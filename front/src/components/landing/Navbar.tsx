import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <header className="navbar bg-[#0d0d0d]">
      <div className="container mx-auto px-5 flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo GladiArena"
            width={58}
            height={58}
            className="object-contain"
            priority
          />
          <span className="hidden sm:inline text-lg font-semibold text-[var(--gold)] fantasy-text">
            Arena Real
          </span>
        </Link>

        {/* Nav Links */}
        <nav aria-label="Navegación primaria" className="flex gap-2">
          <Link
            href="/login"
            className="btn btn-ghost btn-pill px-4 py-3 text-[color:var(--gold)] hover:bg-[rgba(233,196,106,.12)] fantasy-text"
          >
            Entrar
          </Link>

          <Link
            href="/register"
            aria-label="Registrarse y comenzar duelo"
            className="btn btn-pill px-4 py-3 text-[#141414] fantasy-text"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--gold), var(--gold-2))' }}
          >
            Registrarse
          </Link>
        </nav>
      </div>
    </header>
  );
}
