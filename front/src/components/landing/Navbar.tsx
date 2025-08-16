import Link from 'next/link';
import SwordsIcon from './SwordsIcon';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container mx-auto px-5 flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="logo-badge text-[#141414]">
            <SwordsIcon width={22} height={22} />
          </div>
        </div>
        <nav aria-label="Navegación primaria" className="flex gap-2">
          <Link href="/auth/login" className="btn btn-ghost btn-pill px-4 py-3 text-[color:var(--gold)] hover:bg-[rgba(233,196,106,.12)]">
            Entrar
          </Link>
          <Link
            href="/auth/login"
            aria-label="Registrarse y comenzar duelo"
            className="btn btn-pill px-4 py-3 text-[#141414]"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--gold), var(--gold-2))' }}
          >
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}
