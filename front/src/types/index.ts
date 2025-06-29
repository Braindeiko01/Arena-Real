

export interface RegistrarUsuarioRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  linkAmistad: string;
}

export interface BackendUsuarioDto {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  tagClash: string;
  linkAmistad: string;
  saldo: number;
  reputacion: number;
}

export interface BackendTransaccionRequestDto {
  jugadorId: string;
  monto: number;
  tipo: "DEPOSITO" | "RETIRO" | "PREMIO";
  comprobante?: string;
}

export interface BackendTransaccionResponseDto {
  id: string; // UUID de la transacción (propio del backend)
  jugadorId: string;
  monto: number;
  tipo: "DEPOSITO" | "RETIRO" | "PREMIO";
  estado: "PENDIENTE" | "APROBADA" | "RECHAZADA";
  creadoEn: string; // date-time
  comprobante?: string;
}

export interface BackendApuestaRequestDto {
  jugador1Id: string;
  jugador2Id?: string;
  monto: number;
  modoJuego: string;
}

export interface BackendApuestaResponseDto {
  id: string; // UUID de la apuesta (propio del backend)
  jugador1Id?: string; // googleId
  jugador2Id?: string; // googleId
  monto: number;
  modoJuego: string;
  estado: "PENDIENTE" | "EMPAREJADA" | "EN_PROGRESO" | "FINALIZADA" | "CANCELADA";
  creadoEn: string; // date-time
}

export interface BackendPartidaRequestDto {
  apuestaId: string; // UUID de la apuesta
  ganadorId: string;
  resultadoJson?: string;
}

export interface BackendPartidaResponseDto {
  id: string; // UUID de la partida
  apuestaId: string; // UUID de la apuesta
  jugador1Id: string;
  jugador2Id: string;
  ganadorId?: string;
  modoJuego: string;
  estado: string;
  validada: boolean;
  creada: string; // date-time
  validadaEn?: string; // date-time
  monto: number;
}

export interface BackendMatchResultDto {
  apuesta1Id: string; // UUID
  apuesta2Id: string; // UUID
  monto: number;
  modoJuego: string;
}

export interface BackendMatchmakingResponseDto {
  apuestaId: string; // UUID de la apuesta resultante
  jugadorOponenteId: string; // googleId del oponente
  jugadorOponenteTag: string;
  chatId: string;
  jugadorOponenteAvatarUrl?: string;
}


// Tipos de la Aplicación Frontend

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  clashTag: string;
  nequiAccount: string;
  avatarUrl?: string;
  balance: number;
  friendLink?: string;
  reputacion?: number;
}

// Para el formulario de completar perfil después del login con Google
export interface CompleteProfileFormValues {
  username: string;
  phone: string;
  friendLink: string;
}

// Valores obtenidos de la simulación de Google Auth
export interface GoogleAuthValues {
  googleId: string;
  email: string;
  username: string;
  avatarUrl?: string;
}

// Datos completos para registrarse: combina GoogleAuthValues y CompleteProfileFormValues
export type RegisterWithGoogleData = {
  googleId: string;
  email: string;
  username: string;
  avatarUrl?: string;
  phone: string;
  friendLink: string;
  clashTag?: string;
};


export type MatchStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type MatchResult = 'win' | 'loss' | 'draw';

export interface Bet {
  id: string; // ID de la apuesta (del backend, UUID)
  userId: string;
  matchId?: string; // Si se mapea a una partida/chat local
  amount: number;
  opponentTag?: string;
  opponentId?: string; // googleId del oponente
  matchDate: string;
  result?: MatchResult;
  status: BackendApuestaResponseDto['estado'];
  modoJuego: string;
  screenshotUrl?: string;
}

export interface ChatMessage {
  id: string;
  matchId: string; // Este es el ID de la apuesta del backend (UUID)
  senderId: string;
  text: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

export interface BackendMatchDeclineRequestDto {
  jugadorId: string;
  oponenteId: string;
}
