import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-white">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
