export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  process.env.BACKEND_API_URL ||
  'http://localhost:8080';

export const BACKEND_WS_URL =
  process.env.NEXT_PUBLIC_BACKEND_WS_URL ||
  BACKEND_URL.replace(/^http/, 'ws');
