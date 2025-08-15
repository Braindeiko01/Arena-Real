

export interface RegistrarUsuarioRequest {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  linkAmistad: string;
  referralCode?: string;
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
  referralCode?: string;
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

export interface BackendPartidaResultadoRequestDto {
  jugadorId: string;
  resultado: 'VICTORIA' | 'DERROTA';
  captura?: string;
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
  chatId?: string;
  capturaJugador1?: string;
  capturaJugador2?: string;
  resultadoJugador1?: string;
  resultadoJugador2?: string;
}

export interface BackendMatchResultDto {
  apuesta1Id: string; // UUID
  apuesta2Id: string; // UUID
  monto: number;
  modoJuego: string;
}

export interface BackendMatchmakingResponseDto {
  apuestaId: string; // UUID de la apuesta resultante
  partidaId: string; // UUID de la partida creada
  jugadorOponenteId: string; // googleId del oponente
  jugadorOponenteTag: string;
  jugadorOponenteNombre: string;
  chatId?: string;
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
  referralCode?: string;
}

// Para el formulario de completar perfil después del login con Google
export interface CompleteProfileFormValues {
  username: string;
  phone: string;
  friendLink: string;
  referralCode?: string;
}

// Valores obtenidos de la simulación de Google Auth
export interface GoogleAuthValues {
  googleId: string;
  email?: string;
  username?: string;
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
  referralCode?: string;
};


export type MatchStatus = 'pending' | 'active' | 'completed' | 'cancelled';
export type MatchResult = 'win' | 'loss';

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
  prize: number;
  screenshotUrl?: string;
}

export interface ChatMessage {
  id: string;
  matchId: string; // Este es el ID de la apuesta del backend (UUID)
  senderId: string;
  text: string;
  timestamp: string | import('firebase/firestore').FieldValue;
  isSystemMessage?: boolean;
}

export interface BackendMatchDeclineRequestDto {
  jugadorId: string;
  oponenteId: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}
