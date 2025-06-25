'use server'

import type {
  User,
  RegisterWithGoogleData,
  GoogleAuthValues,
  BackendUsuarioDto,
  BackendTransaccionRequestDto,
  BackendTransaccionResponseDto,
  BackendApuestaRequestDto,
  BackendApuestaResponseDto,
  BackendMatchmakingResponseDto,
  RegistrarUsuarioRequest,
} from '@/types'
import { BACKEND_URL } from '@/lib/config'

/* -------------------------
   USUARIO
-------------------------- */

export async function registerUserAction(
  data: RegisterWithGoogleData
): Promise<{ user: User | null; error: string | null }> {
  const backendPayload: RegistrarUsuarioRequest = {
    id: data.googleId,
    nombre: data.username,
    email: data.email,
    telefono: data.phone,
    linkAmistad: data.friendLink,
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/jugadores`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return { user: null, error: err.message || `Error ${response.status}` }
    }

    const registered = await response.json() as BackendUsuarioDto

    if (!registered.id) {
      return { user: null, error: 'El backend no devolvió un ID.' }
    }

    const user: User = {
      id: registered.id,
      username: registered.nombre,
      email: registered.email,
      phone: registered.telefono,
      clashTag: registered.tagClash,
      nequiAccount: registered.telefono,
      balance: registered.saldo ?? 0,
      friendLink: registered.linkAmistad || '',
      avatarUrl: data.avatarUrl || `https://placehold.co/100x100.png?text=${registered.nombre?.[0] ?? 'U'}`,
      reputacion: registered.reputacion ?? 0,
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message || 'Error de red al registrar.' }
  }
}

export async function loginWithGoogleAction(
  googleAuthData: GoogleAuthValues
): Promise<{ user: User | null; error: string | null; needsProfileCompletion?: boolean }> {
  const result = await getUserDataAction(googleAuthData.googleId)

  if (result.user) {
    return { user: result.user, error: null, needsProfileCompletion: false }
  }

  return { user: null, error: null, needsProfileCompletion: true }
}

export async function getUserDataAction(userId: string): Promise<{ user: User | null; error: string | null }> {
  if (!userId) return { user: null, error: 'Se requiere googleId' }

  try {
    const res = await fetch(`${BACKEND_URL}/api/jugadores/${userId}`)
    if (!res.ok) {
      if (res.status === 404) return { user: null, error: 'Usuario no encontrado.' }
      const err = await res.json().catch(() => ({}))
      return { user: null, error: err.message || `Error ${res.status}` }
    }

    const backendUser = await res.json() as BackendUsuarioDto

    const user: User = {
      id: backendUser.id,
      username: backendUser.nombre,
      email: backendUser.email,
      phone: backendUser.telefono,
      clashTag: backendUser.tagClash,
      nequiAccount: backendUser.telefono,
      balance: backendUser.saldo,
      friendLink: backendUser.linkAmistad,
      avatarUrl: `https://placehold.co/100x100.png?text=${backendUser.nombre?.[0] ?? 'U'}`,
      reputacion: backendUser.reputacion,
    }

    return { user, error: null }
  } catch (err: any) {
    return { user: null, error: err.message || 'Error de red al obtener usuario.' }
  }
}

/**
 * Solo simula actualización en frontend. No persistente.
 */
export async function updateUserProfileInMemoryAction(
  userId: string,
  updatedData: Partial<User>
): Promise<{ user: User | null; error: string | null }> {
  return { user: updatedData as User, error: null }
}

/* -------------------------
   TRANSACCIONES
-------------------------- */

export async function requestTransactionAction(
  userGoogleId: string,
  amount: number,
  type: 'DEPOSITO' | 'RETIRO'
): Promise<{ transaction: BackendTransaccionResponseDto | null; error: string | null }> {
  const payload: BackendTransaccionRequestDto = {
    jugadorId: userGoogleId,
    monto: amount,
    tipo: type,
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/transacciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { transaction: null, error: err.message || `Error ${res.status}` }
    }

    const data = await res.json() as BackendTransaccionResponseDto
    return { transaction: data, error: null }
  } catch (err: any) {
    return { transaction: null, error: err.message || 'Error de red.' }
  }
}

export async function getUserTransactionsAction(
  userGoogleId: string
): Promise<{ transactions: BackendTransaccionResponseDto[] | null; error: string | null }> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/transacciones/jugador/${userGoogleId}`)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { transactions: null, error: err.message || `Error ${res.status}` }
    }

    const data = await res.json() as BackendTransaccionResponseDto[]
    return { transactions: data, error: null }
  } catch (err: any) {
    return { transactions: null, error: err.message || 'Error de red.' }
  }
}

/* -------------------------
   MATCHMAKING
-------------------------- */

export async function createBetAction(
  userGoogleId: string,
  amount: number,
  gameMode: string
): Promise<{ bet: BackendApuestaResponseDto | null; error: string | null }> {
  const payload: BackendApuestaRequestDto = {
    jugador1Id: userGoogleId,
    monto: amount,
    modoJuego: gameMode,
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/apuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { bet: null, error: err.message || `Error ${res.status}` }
    }

    const data = await res.json() as BackendApuestaResponseDto
    return { bet: data, error: null }
  } catch (err: any) {
    return { bet: null, error: err.message || 'Error de red.' }
  }
}

export async function matchmakingAction(
  userGoogleId: string,
  gameMode: string,
  bet: number
): Promise<{ match: BackendMatchmakingResponseDto | null; error: string | null }> {
  try {
    /*
    const res = await fetch(`${BACKEND_URL}/api/duelo/solicitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: userGoogleId, modosJuego: gameMode, monto: balance }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { match: null, error: err.message || `Error ${res.status} al solicitar duelo.` }
    } */

    const matchRes = await fetch(`${BACKEND_URL}/api/matchmaking/ejecutar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: userGoogleId, modoJuego: gameMode, monto: bet }),
    })

    if (!matchRes.ok) {
      const err = await matchRes.json().catch(() => ({}))
      return { match: null, error: err.message || `Error ${matchRes.status} al hacer matchmaking.` }
    }

    const data = await matchRes.json() as BackendMatchmakingResponseDto
    return { match: data, error: null }
  } catch (err: any) {
    return { match: null, error: err.message || 'Error de red durante el matchmaking.' }
  }
}
