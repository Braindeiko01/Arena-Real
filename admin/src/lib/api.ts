const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8081';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: authHeaders(),
    credentials: 'include', // por si usas cookies en algún entorno
  });

  if (!res.ok) {
    console.error(`❌ GET ${path} → ${res.status}`);
    throw new Error(await res.text());
  }

  return res.json();
}

export async function post<T = void>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (!res.ok) {
    console.error(`❌ POST ${path} → ${res.status}`);
    throw new Error(await res.text());
  }

  return res.status === 204 ? (undefined as T) : res.json();
}
