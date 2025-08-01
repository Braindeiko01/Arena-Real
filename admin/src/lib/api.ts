const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

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
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
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

  const text = await res.text();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    console.error(`❌ POST ${path} → ${res.status}`);
    throw new Error(text);
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
