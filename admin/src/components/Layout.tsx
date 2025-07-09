
import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#1a1a1a]">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
