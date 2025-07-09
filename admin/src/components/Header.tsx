import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()
  const logout = () => {
    localStorage.removeItem('adminToken')
    router.push('/login')
  }
  return (
    <header className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">Arena Real Admin</h1>
        <button className="text-sm hover:underline" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
