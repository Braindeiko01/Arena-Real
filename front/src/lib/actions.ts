'use client'

import type {
  User,
  RegisterWithGoogleData,
  GoogleAuthValues,
  BackendUsuarioDto,
  BackendTransaccionRequestDto,
  BackendTransaccionResponseDto,
  BackendApuestaRequestDto,
  BackendApuestaResponseDto,
  BackendPartidaResponseDto,
  BackendMatchmakingResponseDto,
  RegistrarUsuarioRequest,
  BackendPartidaResultadoRequestDto,
} from '@/types'
import { BACKEND_URL } from '@/lib/config'
import { auth } from '@/lib/firebase'

async function authorizedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  let token: string | null = null
  if (typeof window !== 'undefined') {
    try {
      token = await auth.currentUser?.getIdToken() || null
    } catch {
      token = null
    }
  }
  const headers = {
    ...(init.headers || {}),
    ...(token
      ? { Authorization: `Bearer ${token}`, 'X-Auth-Provider': 'firebase' }
      : {}),
  } as HeadersInit
  return fetch(input, { ...init, headers })
}

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
    referralCode: data.referralCode,
  }

  try {
    const response = await authorizedFetch(`${BACKEND_URL}/api/register`, {
      method: 'POST',
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
      referralCode: registered.referralCode,
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
    const res = await authorizedFetch(`${BACKEND_URL}/api/jugadores/${userId}`)
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
      referralCode: backendUser.referralCode,
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
  type: 'DEPOSITO' | 'RETIRO',
  comprobante?: string
): Promise<{ transaction: BackendTransaccionResponseDto | null; error: string | null }> {
  const payload: BackendTransaccionRequestDto = {
    jugadorId: userGoogleId,
    monto: amount,
    tipo: type,
    comprobante,
  }

  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/transacciones`, {
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
    const res = await authorizedFetch(`${BACKEND_URL}/api/transacciones/jugador/${userGoogleId}`)

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

export async function getUserDuelsAction(
  userGoogleId: string
): Promise<{ duels: BackendPartidaResponseDto[] | null; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/partidas/jugador/${userGoogleId}`)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { duels: null, error: err.message || `Error ${res.status}` }
    }

    const data = await res.json() as BackendPartidaResponseDto[]
    return { duels: data, error: null }
  } catch (err: any) {
    return { duels: null, error: err.message || 'Error de red.' }
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
    const res = await authorizedFetch(`${BACKEND_URL}/api/apuestas`, {
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

    const matchRes = await authorizedFetch(`${BACKEND_URL}/api/matchmaking/ejecutar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: userGoogleId, modoJuego: gameMode, monto: bet }),
    })

    if (!matchRes.ok) {
      const errorText = await matchRes.text()
      return { match: null, error: errorText || `Error ${matchRes.status} al hacer matchmaking.` }
    }

    const data = await matchRes.json() as BackendMatchmakingResponseDto
    return { match: data, error: null }
  } catch (err: any) {
    return { match: null, error: err.message || 'Error de red durante el matchmaking.' }
  }
}

export async function cancelMatchmakingAction(
  userGoogleId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/matchmaking/cancelar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: userGoogleId }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message || `Error ${res.status}` }
    }

    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red.' }
  }
}

export async function declineMatchAction(
  userGoogleId: string,
  opponentId: string,
  matchId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/matchmaking/declinar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId: userGoogleId, oponenteId: opponentId, partidaId: matchId }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { success: false, error: err.message || `Error ${res.status}` }
    }

    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de red.' }
  }
}

export async function acceptMatchAction(
  matchId: string,
  userGoogleId: string
): Promise<{ duel: BackendPartidaResponseDto | null; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/partidas/${matchId}/aceptar/${userGoogleId}`, {
      method: 'PUT',
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { duel: null, error: err.message || `Error ${res.status}` }
    }

    const data = (await res.json()) as BackendPartidaResponseDto
    return { duel: data, error: null }
  } catch (err: any) {
    return { duel: null, error: err.message || 'Error de red.' }
  }
}

export async function assignMatchWinnerAction(
  matchId: string,
  winnerId: string
): Promise<{ duel: BackendPartidaResponseDto | null; error: string | null }> {
  try {
    const res = await authorizedFetch(
      `${BACKEND_URL}/api/partidas/${matchId}/ganador/${winnerId}`,
      { method: 'PUT' }
    )

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { duel: null, error: err.message || `Error ${res.status}` }
    }

    const data = (await res.json()) as BackendPartidaResponseDto
    return { duel: data, error: null }
  } catch (err: any) {
    return { duel: null, error: err.message || 'Error de red.' }
  }
}
export async function submitMatchResultAction(
  matchId: string,
  jugadorId: string,
  result: 'VICTORIA' | 'DERROTA',
  screenshot?: string,
): Promise<{ duel: BackendPartidaResponseDto | null; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/partidas/${matchId}/resultado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jugadorId, resultado: result, captura: screenshot }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { duel: null, error: err.message || `Error ${res.status}` }
    }

    const data = (await res.json()) as BackendPartidaResponseDto
    return { duel: data, error: null }
  } catch (err: any) {
    return { duel: null, error: err.message || 'Error de red.' }
  }
}

export async function fetchMatchIdByChat(
  chatId: string,
): Promise<string | null> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/partidas/chat/${encodeURIComponent(chatId)}`)
    if (!res.ok) return null
    const data = (await res.json()) as { id: string }
    return data.id
  } catch {
    return null
  }
}

export async function getReferralEarningsAction(
  userId: string,
): Promise<{ total: number | null; error: string | null }> {
  try {
    const res = await authorizedFetch(`${BACKEND_URL}/api/referrals/earnings/${userId}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { total: null, error: err.message || `Error ${res.status}` }
    }
    const data = (await res.json()) as { total: number }
    return { total: data.total, error: null }
  } catch (err: any) {
    return { total: null, error: err.message || 'Error de red.' }
  }
}