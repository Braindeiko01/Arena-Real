  'use client';

  import Link from 'next/link';
  import { useEffect, useRef } from 'react';
  import Navbar from '@/components/landing/Navbar';
  import CountUp from '@/components/landing/CountUp';
  import { Inter, Cinzel } from 'next/font/google';
  import Image from 'next/image';
  import './landing.css';

  function Icon({
    src, alt, size = 56, className = '',
  }: { src: string; alt: string; size?: number; className?: string }) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className={`mx-auto drop-shadow-[0_0_4px_rgba(245,158,11,.35)] ${className}`}
      />
    );
  }

  const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
  const cinzel = Cinzel({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-cinzel' });

  export default function Page() {
    const heroParallaxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = heroParallaxRef.current;
      if (!el) return;
      const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isCoarse || prefersReduced) return;
      let rect = el.getBoundingClientRect();
      const onResize = () => { rect = el.getBoundingClientRect(); };
      const strength = 10;
      const onMouseMove = (e: MouseEvent) => {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
        el.style.setProperty('--px', x + 'px');
        el.style.setProperty('--py', y + 'px');
      };
      const onLeave = () => { el.style.setProperty('--px', '0px'); el.style.setProperty('--py', '0px'); };
      window.addEventListener('resize', onResize);
      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        window.removeEventListener('resize', onResize);
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    }, []);

    return (
      <div className={`${inter.variable} ${cinzel.variable}`}>
        <div className="bg-app" aria-hidden="true">
          <div className="bg-grid" />
        </div>
        <Navbar />
        <main className="pt-9 pb-">
          <section id="stats" className="relative overflow-visible">
            <div className="container mx-auto px-5 pt-6 pb-8 text-center">
              <span className="badge-gold">
                <span className="w-2 h-2 rounded-full bg-[#ffb703] shadow-[0_0_6px_#ffb703]" aria-hidden="true" />
                En vivo · Duelos abiertos
              </span>
              <Icon src="/icons/espadas.png" alt="Espadas" size={94} className="mt-0" />

              <h1 className="font-cinzel font-extrabold tracking-wide mt-2 text-[clamp(28px,8vw,46px)]">
                DESAFÍA LA <span className="neon">ARENA REAL</span>
              </h1>
              <p className="max-w-2xl mx-auto text-muted text-[17px] mt-1">
                Gladiador, obten tu botin y demuestra tu honor.
              </p>
              <div
                ref={heroParallaxRef}
                className="mt-6 flex flex-wrap items-center justify-center gap-3 transition-transform [transform:translate(var(--px,0),var(--py,0))]"
              >
                <Link
                  href="/login"
                  className="btn btn-solid btn-lg btn-pill px-6 text-[#141414]"
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--gold), var(--gold-2))' }}
                >
                  Desafiar ahora
                </Link>
                <Link
                  href="/login"
                  className="btn btn-ghost btn-lg btn-pill px-6 text-[color:var(--gold)] hover:bg-[rgba(233,196,106,.12)]"
                >
                  Ver batallas
                </Link>
              </div>

              <div className="rounded-3xl bg-[#0E141C] border border-yellow-400/20 p-6 shadow-[0_10px_40px_rgba(0,0,0,.35)] mt-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto" role="list">
                  <article className="card text-center" role="listitem">
                    <Icon src="/icons/espadas.png" alt="Duelos activos" size={56} className="mb-2" />
                    <div className="font-cinzel font-extrabold text-[28px] leading-none text-[color:var(--gold-2)]">
                      <CountUp id="m1" to={50} prefix="+" />
                    </div>
                    <div className="mt-1 text-[11px] tracking-[.18em] opacity-75">DUELOS ACTIVOS</div>
                  </article>

                  <article className="card text-center" role="listitem">
                    <Icon src="/icons/cofre.png" alt="Botín entregado" size={56} className="mb-2" />
                    <div className="font-cinzel font-extrabold text-[28px] leading-none text-[color:var(--gold-2)]">
                      <CountUp id="m2" to={200} prefix="+$" suffix="K" />
                    </div>
                    <div className="mt-1 text-[11px] tracking-[.18em] opacity-75">BOTÍN ENTREGADO</div>
                  </article>

                  <article className="card text-center" role="listitem">
                    <Icon src="/icons/casco.png" alt="Gladiadores" size={56} className="mb-2" />
                    <div className="font-cinzel font-extrabold text-[28px] leading-none text-[color:var(--gold-2)]">
                      <CountUp id="m3" to={100} prefix="+" />
                    </div>
                    <div className="mt-1 text-[11px] tracking-[.18em] opacity-75">GLADIADORES</div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section id="forge" className="container mx-auto px-5 mt-6">
            <div className="rounded-3xl bg-[#0E141C] border border-yellow-400/20 p-6 ring-1 ring-yellow-400/10 ring-offset-2 ring-offset-[#0B0F17] shadow-[0_8px_30px_rgba(0,0,0,.35)]">
              <h2 className="text-2xl font-extrabold text-yellow-300 text-center mb-4 font-cinzel">
                Forja tu leyenda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="card card-lg relative">
                <svg className="absolute right-3 top-3 opacity-90" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.3L12 16l-5.5 3.6 1-6.3L3 8.9 9 8l3-6z" stroke="currentColor" strokeWidth="1.3" color="#CDA434" />
                </svg>
                <h3 className="m-0 mb-1 font-bold text-[#f0e0a6]">Duelos 1vs1</h3>
                <p className="m-0 text-muted">Rapidos.</p>
              </article>
              <article className="card card-lg relative">
                <svg className="absolute right-3 top-3 opacity-90" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 21h10M12 3v14M8 9l4-4 4 4" stroke="currentColor" strokeWidth="1.3" color="#CDA434" />
                </svg>
                <h3 className="m-0 mb-1 font-bold text-[#f0e0a6]">Clasificación</h3>
                <p className="m-0 text-muted">Coronas y laureles para los mejores. Ranking transparente.</p>
              </article>
              <article className="card card-lg relative">
                <svg className="absolute right-3 top-3 opacity-90" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" color="#CDA434" />
                  <path d="M3 10h18M8 5h8l1 2H7l1-2z" stroke="currentColor" strokeWidth="1.3" color="#CDA434" />
                </svg>
                <h3 className="m-0 mb-1 font-bold text-[#f0e0a6]">Botín asegurado</h3>
                <p className="m-0 text-muted">Premios seguros y verificados por administradores.</p>
              </article>
            </div>

            <div
              className="mt-8 rounded-3xl p-6 border border-[rgba(233,196,106,.28)]"
              style={{ background: 'linear-gradient(135deg, rgba(233,196,106,.10), rgba(16,21,33,.25))' }}
            >
              <div className="flex flex-col items-center justify-center gap-3 text-center">
                <div>
                  <h3 className="font-cinzel text-[24px] leading-tight text-[color:var(--gold-3)] m-0">¿Listo para combatir?</h3>
                  <p className="text-muted m-0 mt-2">Únete a los duelos en vivo.</p>
                </div>
                <div className="w-full max-w-[340px] grid grid-cols-1 gap-2">
                  <Link
                    href="/login"
                    className="btn btn-solid btn-lg btn-pill px-6 text-[#141414] text-center"
                    style={{ backgroundImage: 'linear-gradient(135deg, var(--gold), var(--gold-2))' }}
                  >
                    Entrar a la Arena
                  </Link>
                  <Link
                    href="/login"
                    className="btn btn-ghost btn-lg btn-pill px-6 text-[color:var(--gold)] hover:bg-[rgba(233,196,106,.12)] text-center"
                  >
                    Ver batallas
                  </Link>
                </div>
              </div>
            </div>

            <div className="my-6 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(233,196,106,.25), transparent)' }} />

            <footer className="my-9 text-[#a4a6b4] text-[13px]">
              <div className="container mx-auto px-0 md:px-2 flex items-center justify-between flex-wrap gap-3">
                <div>© {new Date().getFullYear()} Arena Real</div>
                <div className="flex gap-3 opacity-90">
                  <a href="#" aria-label="Términos">Términos</a>
                  <span aria-hidden="true">•</span>
                  <a href="#" aria-label="Privacidad">Privacidad</a>
                  <span aria-hidden="true">•</span>
                  <a href="#" aria-label="Soporte">Soporte</a>
                </div>
              </div>
            </footer>
          </div>
          </section>
        </main>
      </div>
    );
  }
