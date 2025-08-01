import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginResponse {
  token: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!username || !password) {
      setErrorMsg('Debes ingresar usuario y contraseña');
      setLoading(false);
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';
    const loginPayload = { username, password };

    // 🔍 Logs para debug
    console.log('🔐 Enviando login a:', `${baseUrl}/api/admin/auth/login`);
    console.log('📦 Payload:', loginPayload);

    try {
      const res = await fetch(`${baseUrl}/api/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload)
      });

      if (res.ok) {
        const data: LoginResponse = await res.json();
        localStorage.setItem('adminToken', data.token);
        router.push('/');
      } else {
        const errorText = await res.text();
        setErrorMsg(`Error: ${res.status} - ${errorText || 'Credenciales inválidas'}`);
      }
    } catch (err) {
      console.error('🚨 Error al intentar loguear:', err);
      setErrorMsg('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e1e1e] via-[#111111] to-black">
      <form
        onSubmit={handleSubmit}
        className="w-80 flex flex-col gap-4 p-6 border border-gray-700 rounded-xl shadow-lg bg-[#1a1a1a] text-white"
      >
        <h2 className="text-2xl font-semibold text-center">Iniciar sesión</h2>

      <input
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Usuario"
        autoComplete="username"
      />

      <input
        type="password"
        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
      >
        {loading ? 'Ingresando...' : 'Login'}
      </button>

      {errorMsg && <p className="text-red-600 text-sm text-center">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default Login;
