const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:8081';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function post(path: string, body?: unknown): Promise<void> {
  const headers: Record<string, string> = { ...(authHeaders() as Record<string, string>) };
  let payload;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: payload
  });
  if (!res.ok) throw new Error(await res.text());
}
