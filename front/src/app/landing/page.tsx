"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Trophy, Users, CircleDollarSign, Menu, Shield } from "lucide-react";

/* =========================================================
   UI BÁSICOS
========================================================= */
function baseButtonClasses({
  variant = "solid",
  size = "md",
  extra = "",
}: {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  extra?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2", lg: "px-6 py-3 text-base" } as const;
  const variants = {
    solid: "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400/50 neon-button",
    outline: "border border-yellow-400/60 text-yellow-300 hover:bg-yellow-400/10 focus:ring-yellow-400/40 neon-outline",
    ghost: "text-yellow-300 hover:bg-yellow-400/10",
  } as const;
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`;
}

function LinkButton(props: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-testid"?: string;
}) {
  const { href, children, variant = "solid", size = "md", className = "", "data-testid": testid } = props;
  return (
    <Link href={href} data-testid={testid} className={baseButtonClasses({ variant, size, extra: className })}>
      {children}
    </Link>
  );
}

function Card({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl ${className}`}>{children}</div>;
}
function CardHeader({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
function CardTitle({ children, className = "" }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
function CardContent({ children, className = "" }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}

/** Logo con fallback (si /public/logo-arena.png no existe, muestra “AR”) */
function FallbackLogo({ src = "/logo-arena.png", size = 40 }: { src?: string; size?: number }) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        aria-label="logo-fallback"
        style={{ width: size, height: size }}
        className="grid place-items-center rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-amber-600 text-black font-extrabold shadow-[0_0_18px_2px_rgba(255,215,0,0.45)]"
      >
        AR
      </div>
    );
  }
  return (
    <img
      src={src}
      alt="Arena Real"
      width={size}
      height={size}
      onError={() => setError(true)}
      className="block object-contain drop-shadow-[0_0_14px_rgba(255,215,0,0.35)]"
    />
  );
}

/* =========================================================
   HELPERS ANIMACIÓN: CountUp, Parallax, Magnetic
========================================================= */
function CountUp({
  to = 100,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  to?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (reduce) {
      ref.current.textContent = `${prefix}${to}${suffix}`;
      return;
    }
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const val = Math.floor(p * to);
      if (ref.current) ref.current.textContent = `${prefix}${val}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, prefix, suffix, duration, reduce]);
  return <span ref={ref} />;
}

function useParallax(strength = 12) {
  const reduce = useReducedMotion();
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const { currentTarget, clientX, clientY } = e;
    const rect = (currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((clientY - rect.top) / rect.height - 0.5) * strength;
    (currentTarget as HTMLElement).style.setProperty("--parallax-x", `${x}px`);
    (currentTarget as HTMLElement).style.setProperty("--parallax-y", `${y}px`);
  };
  const onMouseLeave = (e: React.MouseEvent) => {
    (e.currentTarget as HTMLElement).style.setProperty("--parallax-x", `0px`);
    (e.currentTarget as HTMLElement).style.setProperty("--parallax-y", `0px`);
  };
  return { onMouseMove, onMouseLeave };
}

function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };
  return (
    <div onMouseMove={handle} onMouseLeave={leave}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* =========================================================
   DECORACIÓN GLADIADORA: Espadas cruzadas animadas (SVG)
========================================================= */
function CrossedSwords() {
  return (
    <svg className="mx-auto mb-2 h-10 w-10 text-yellow-300 sword-glow" viewBox="0 0 64 64" fill="none">
      {/* izquierda */}
      <path
        d="M8 8 L28 28 M28 28 L36 20 M28 28 L20 36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="sword-stroke-left"
      />
      {/* derecha */}
      <path
        d="M56 8 L36 28 M36 28 L28 20 M36 28 L44 36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="sword-stroke-right"
      />
    </svg>
  );
}

/* =========================================================
   PÁGINA
========================================================= */
export default function ArenaRealHome() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const heroPx = useParallax(16);

  const features = [
    { icon: <Shield className="h-6 w-6" aria-hidden />, title: "Duelo 1v1", desc: "Desafía a un rival y demuestra tu temple." },
    { icon: <Users className="h-6 w-6" aria-hidden />, title: "Clasificación", desc: "Escala como gladiador y forja tu leyenda." },
    { icon: <CircleDollarSign className="h-6 w-6" aria-hidden />, title: "Botín asegurado", desc: "Gana y cobra sin fricciones." },
  ];

  // Sanity checks (dev)
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production") return;
    document.querySelectorAll<HTMLAnchorElement>("[data-testid='cta']").forEach((a) => {
      const ok = a.href.endsWith("/auth/login") || a.pathname === "/auth/login";
      console.assert(ok, "Todos los CTAs → /auth/login");
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b12] text-slate-100">
      {/* ===== Fondo: grid + orbes + polvo ===== */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 animated-grid opacity-[0.06]" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        {/* polvo en la arena */}
        <div className="dust dust-a" />
        <div className="dust dust-b" />
        <div className="dust dust-c" />
        {/* silueta de graderías / columnas */}
        <div className="arena-silhouette" />
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b0b12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <FallbackLogo src="/logo-arena.png" />
          <div className="hidden gap-3 sm:flex">
            <LinkButton data-testid="cta" href="/auth/login" variant="outline">
              Entrar
            </LinkButton>
            <LinkButton data-testid="cta" href="/auth/login">
              Registrarse
            </LinkButton>
          </div>
          <button
            aria-label="Abrir menú"
            className="sm:hidden p-2 rounded-lg text-yellow-300 hover:bg-yellow-400/10 neon-text"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {mobileOpen && (
          <div className="sm:hidden border-t border-white/10 px-5 pb-3">
            <div className="mt-3 grid gap-2">
              <LinkButton data-testid="cta" href="/auth/login" variant="outline">
                Entrar
              </LinkButton>
              <LinkButton data-testid="cta" href="/auth/login">
                Registrarse
              </LinkButton>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO: temática gladiador ===== */}
      <section className="relative overflow-hidden pt-28">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <motion.div
            {...(!reduce
              ? { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }
              : { initial: false, animate: { opacity: 1 } })}
            className="text-center hero-parallax"
            onMouseMove={heroPx.onMouseMove}
            onMouseLeave={heroPx.onMouseLeave}
          >
            <p className="inline-block rounded-full border border-yellow-400/40 bg-yellow-400/5 px-3 py-1 text-xs tracking-wide text-yellow-200 neon-text float-fade">
              EN VIVO · Desafíos abiertos
            </p>

            <CrossedSwords />
            <h1 data-testid="hero-title" className="mt-1 text-5xl font-extrabold tracking-tight sm:text-6xl">
              DESAFÍA LA <span className="neon-gold">ARENA REAL</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Entra como gladiador, reta a tus rivales y conquista la Arena. Honor, gloria y botín te esperan.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <LinkButton data-testid="cta" href="/auth/login" size="lg" className="btn-pulse ripple">
                  Desafiar ahora
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <LinkButton data-testid="cta" href="/auth/login" size="lg" variant="outline" className="ripple">
                  Ver batallas
                </LinkButton>
              </Magnetic>
            </div>

            {/* MÉTRICAS en escudos */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="shield-card neon-card">
                <div className="flex items-center gap-3 text-yellow-300">
                  <Trophy className="h-5 w-5" />
                  <div className="text-2xl font-bold">
                    <CountUp to={128} prefix="+" />
                  </div>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Duelo activos</div>
              </div>
              <div className="shield-card neon-card">
                <div className="flex items-center gap-3 text-yellow-300">
                  <CircleDollarSign className="h-5 w-5" />
                  <div className="text-2xl font-bold">
                    +$<CountUp to={50} />K
                  </div>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Botín entregado</div>
              </div>
              <div className="shield-card neon-card">
                <div className="flex items-center gap-3 text-yellow-300">
                  <Users className="h-5 w-5" />
                  <div className="text-2xl font-bold">
                    <CountUp to={2000} prefix="+" />
                  </div>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-slate-400">Gladiadores</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MARQUEE: ethos gladiador ===== */}
      <section className="py-6">
        <div className="overflow-hidden whitespace-nowrap marquee">
          <span className="mx-8 text-yellow-300/80">GLORIA</span>
          <span className="mx-8 text-yellow-300/80">HONOR</span>
          <span className="mx-8 text-yellow-300/80">DESAFÍO</span>
          <span className="mx-8 text-yellow-300/80">BOTÍN</span>
          <span className="mx-8 text-yellow-300/80">LEGIÓN</span>
          <span className="mx-8 text-yellow-300/80">ARENA</span>
          <span className="mx-8 text-yellow-300/80">GLADIADORES</span>
          <span className="mx-8 text-yellow-300/80">VICTORIA</span>
        </div>
      </section>

      {/* ===== FEATURES: estilo gladiador (tilt) ===== */}
      <section className="pb-20 pt-2">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-semibold text-yellow-300 neon-text">
            Forja tu leyenda en la Arena
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="border border-yellow-400/25 bg-white/5 text-slate-100 backdrop-blur neon-card tilt">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400/10 text-yellow-300 neon-text">
                      {f.icon}
                    </div>
                    <CardTitle className="text-base text-yellow-200">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <Card className="border border-yellow-400/25 bg-gradient-to-br from-yellow-400/10 via-yellow-600/5 to-transparent text-slate-100 backdrop-blur neon-card">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-300 neon-text">
                    ¿Listo para combatir?
                  </h3>
                  <p className="mt-1 text-slate-300">Crea tu cuenta y únete a los duelos en vivo.</p>
                </div>
                <div className="flex gap-3">
                  <LinkButton data-testid="cta" href="/auth/login" size="lg" className="btn-pulse ripple">
                    Entrar a la Arena
                  </LinkButton>
                  <LinkButton data-testid="cta" href="/auth/login" size="lg" variant="outline" className="ripple">
                    Ver batallas
                  </LinkButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ===== ESTILOS (neón + gladiador) ===== */}
      <style jsx>{`
        /* Grid animado */
        .animated-grid {
          background-image:
            linear-gradient(#fff 1px, transparent 1px),
            linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 32px 32px, 32px 32px;
          animation: gridMove 40s linear infinite;
        }
        @keyframes gridMove {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 512px 512px, 512px 512px;
          }
        }

        /* Orbes */
        .orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(60px);
          opacity: 0.25;
        }
        .orb-a {
          width: 22rem;
          height: 22rem;
          left: 4%;
          top: 18%;
          background: #ffd70033;
          animation: float 12s ease-in-out infinite;
        }
        .orb-b {
          width: 16rem;
          height: 16rem;
          right: 8%;
          top: 40%;
          background: #ffb30033;
          animation: float 14s ease-in-out infinite reverse;
        }
        .orb-c {
          width: 20rem;
          height: 20rem;
          right: 20%;
          bottom: 10%;
          background: #ffe06630;
          animation: float 16s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* Polvo en la arena */
        .dust {
          position: absolute;
          left: 0;
          right: 0;
          margin: auto;
          width: 100%;
          height: 40%;
          bottom: 0;
          background:
            radial-gradient(8px 8px at 10% 90%, rgba(255, 215, 0, 0.08) 0%, transparent 60%),
            radial-gradient(6px 6px at 40% 95%, rgba(255, 215, 0, 0.06) 0%, transparent 60%),
            radial-gradient(7px 7px at 70% 88%, rgba(255, 215, 0, 0.08) 0%, transparent 60%);
          opacity: 0.4;
          animation: dustRise 10s ease-in-out infinite;
        }
        .dust-b {
          animation-duration: 12s;
          opacity: 0.3;
        }
        .dust-c {
          animation-duration: 14s;
          opacity: 0.25;
        }
        @keyframes dustRise {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Silueta graderías / columnas al fondo */
        .arena-silhouette {
          position: absolute;
          inset: auto 0 0 0;
          height: 120px;
          background:
            linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent 60%),
            repeating-linear-gradient(
              90deg,
              rgba(255, 215, 0, 0.06),
              rgba(255, 215, 0, 0.06) 2px,
              transparent 2px,
              transparent 24px
            );
          mask-image: linear-gradient(to top, black 70%, transparent 100%);
        }

        /* Parallax */
        .hero-parallax {
          transform: translate(var(--parallax-x, 0), var(--parallax-y, 0));
          transition: transform 0.15s ease-out;
        }

        /* Espadas: stroke brillante */
        .sword-glow {
          filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.55));
        }
        .sword-stroke-left {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawLeft 1s ease forwards 0.1s;
        }
        .sword-stroke-right {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: drawRight 1s ease forwards 0.25s;
        }
        @keyframes drawLeft {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes drawRight {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Shield-styled cards */
        .shield-card {
          border: 1px solid rgba(255, 215, 0, 0.28);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.03));
          border-radius: 24px;
          padding: 20px;
          position: relative;
        }
        .shield-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 24px;
          background: linear-gradient(
            45deg,
            rgba(255, 215, 0, 0.25),
            rgba(255, 215, 0, 0) 30%,
            rgba(255, 215, 0, 0.15) 70%,
            rgba(255, 215, 0, 0)
          );
          pointer-events: none;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          padding: 1px;
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }

        /* Pulsos / ripple / tilt (reutilizados) */
        .btn-pulse {
          animation: pulseGlow 2.4s ease-in-out infinite;
        }
        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 12px rgba(255, 215, 0, 0.35), 0 0 28px rgba(255, 215, 0, 0.2);
          }
          50% {
            box-shadow: 0 0 22px rgba(255, 215, 0, 0.55), 0 0 44px rgba(255, 215, 0, 0.3);
          }
        }
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple:active::after {
          content: "";
          position: absolute;
          inset: 0;
          margin: auto;
          width: 0;
          height: 0;
          border-radius: 9999px;
          background: rgba(255, 215, 0, 0.25);
          animation: ripple 0.6s ease-out;
        }
        @keyframes ripple {
          to {
            width: 400%;
            height: 400%;
            opacity: 0;
          }
        }
        .tilt {
          transition: transform 0.15s ease, box-shadow 0.2s ease;
          transform-style: preserve-3d;
        }
        .tilt:hover {
          transform: perspective(600px) rotateX(6deg) rotateY(-6deg) translateZ(8px);
        }

        /* Marquee */
        .marquee {
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Texto neón */
        .neon-gold {
          color: #ffd700;
          text-shadow: 0 0 6px #ffd700, 0 0 12px #ffb300, 0 0 24px #ffb300, 0 0 46px #ffd700, 0 0 90px #ffea70;
          animation: flicker 2.5s infinite alternate;
        }
        .neon-text {
          text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 14px rgba(255, 215, 0, 0.35);
        }
        .neon-card {
          box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.15) inset, 0 0 18px rgba(255, 215, 0, 0.12);
        }
        .neon-button {
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.45), 0 0 28px rgba(255, 215, 0, 0.25);
        }
        .neon-outline {
          box-shadow: 0 0 16px rgba(255, 215, 0, 0.18);
        }
        @keyframes flicker {
          0%,
          19%,
          21%,
          23%,
          25%,
          54%,
          56%,
          100% {
            opacity: 1;
          }
          20%,
          24%,
          55% {
            opacity: 0.7;
          }
        }

        /* Accesibilidad */
        @media (prefers-reduced-motion: reduce) {
          .animated-grid,
          .orb,
          .dust,
          .btn-pulse,
          .marquee,
          .float-fade,
          .sword-stroke-left,
          .sword-stroke-right {
            animation: none !important;
          }
          .hero-parallax {
            transform: none !important;
          }
          .neon-gold {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

