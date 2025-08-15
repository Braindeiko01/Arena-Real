"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
// Si no tienes lucide-react instala con: pnpm add lucide-react (o usa emojis)
import { Trophy, Users, CircleDollarSign, Menu } from "lucide-react";

/**
 * Arena Real – Landing enfocada 100% a conversión
 * - Navbar minimal: solo logo + Entrar / Registrarse (con menú en móvil)
 * - Hero impactante con TÍTULO EN ORO real (gradientes + brillo controlado)
 * - “Shine” respeta prefers-reduced-motion
 * - Métricas + Features concisos
 * - Componentes UI locales (sin @/components/ui/*)
 * - Dev checks seguros (solo en desarrollo) => nunca leen propiedades de null
 */

/* ====================== UI BASICOS ====================== */
function Button({
  children,
  className = "",
  variant = "solid",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-base",
  } as const;
  const variants = {
    solid:
      "bg-yellow-400 text-black hover:bg-yellow-300 focus:ring-yellow-400/50",
    outline:
      "border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 focus:ring-yellow-400/40",
    ghost: "text-yellow-400 hover:bg-yellow-400/10",
  } as const;

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Card({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl ${className}`}>{children}</div>;
}
function CardHeader({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
function CardTitle({
  children,
  className = "",
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
function CardContent({
  children,
  className = "",
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`}>{children}</div>;
}

/** Logo con fallback (si /public/logo-arena.png no existe, muestra “AR” dorado) */
function FallbackLogo({
  src = "/logo-arena.png",
  size = 40,
}: {
  src?: string;
  size?: number;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div
        aria-label="logo-fallback"
        style={{ width: size, height: size }}
        className="grid place-items-center rounded-full bg-gradient-to-br from-yellow-400 via-amber-400 to-amber-600 text-black font-extrabold"
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
      className="block object-contain"
    />
  );
}

/* ====================== PAGINA ====================== */
export default function ArenaRealHome() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const features = [
    {
      icon: <Trophy className="h-6 w-6" aria-hidden />,
      title: "Duelos 1v1",
      desc: "Reta a otros jugadores y demuestra tu nivel.",
    },
    {
      icon: <Users className="h-6 w-6" aria-hidden />,
      title: "Comunidad activa",
      desc: "Encuentra rivales en segundos.",
    },
    {
      icon: <CircleDollarSign className="h-6 w-6" aria-hidden />,
      title: "Premios reales",
      desc: "Gana y cobra sin fricciones.",
    },
  ];

  // ====== Dev Tests (solo desarrollo) ======
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV === "production")
      return;
    const q = (sel: string) => document.querySelector(sel);
    console.assert(!!q('[data-testid="btn-entrar"]'), "Botón Entrar debe existir");
    console.assert(
      !!q('[data-testid="btn-registrarse"]'),
      "Botón Registrarse debe existir"
    );
    console.assert(
      document.querySelectorAll('[data-testid="feature-card"]').length ===
        features.length,
      `Deben renderizarse ${features.length} features`
    );
    const title = q('[data-testid="hero-title"]');
    if (title && title.textContent)
      console.assert(
        title.textContent.includes("ARENA REAL"),
        "El título debe contener 'ARENA REAL'"
      );
    console.assert(
      document.querySelectorAll('[data-testid="metric-card"]').length === 3,
      "Deben renderizarse 3 métricas"
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b12] text-slate-100">
      {/* Fondo decorativo suave */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.07]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute left-1/2 top-[-15%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute right-[-10%] top-1/3 h-[28rem] w-[28rem] rounded-full bg-yellow-600/10 blur-3xl" />
      </div>

      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b0b12]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <FallbackLogo src="/logo-arena.png" />
          <div className="hidden gap-3 sm:flex">
            <Button data-testid="btn-entrar" variant="outline">
              Entrar
            </Button>
            <Button data-testid="btn-registrarse">Registrarse</Button>
          </div>
          <button
            aria-label="Abrir menú"
            className="sm:hidden text-yellow-400 p-2 rounded-lg hover:bg-yellow-400/10"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Drawer móvil simple */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-white/10 px-5 pb-3">
            <div className="mt-3 grid gap-2">
              <Button variant="outline">Entrar</Button>
              <Button>Registrarse</Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-28">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="inline-block rounded-full border border-yellow-400/30 bg-yellow-400/5 px-3 py-1 text-xs tracking-wide text-yellow-300">
              Duélate hoy — Gana oro
            </p>

            <h1
              data-testid="hero-title"
              className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl"
            >
              BIENVENIDO A{" "}
              <span className="gold-text relative inline-block align-baseline">
                ARENA REAL
                <span className="gold-shine" />
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Duelos 1v1, emoción real y recompensas al instante. Únete y conquista la Arena.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="shadow-lg">
                ¡Comienza a jugar!
              </Button>
              <Button size="lg" variant="outline">
                Explorar partidas
              </Button>
            </div>

            {/* Métricas */}
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { icon: Trophy, label: "Duelos activos", value: "+128" },
                { icon: CircleDollarSign, label: "Premios entregados", value: "+$50K" },
                { icon: Users, label: "Gladiadores", value: "+2K" },
              ].map((m, i) => (
                <div
                  key={i}
                  data-testid="metric-card"
                  className="rounded-2xl border border-yellow-400/30 bg-white/5 p-5 backdrop-blur transition hover:bg-yellow-400/10"
                >
                  <div className="flex items-center gap-3 text-yellow-400">
                    <m.icon className="h-5 w-5" />
                    <div className="text-2xl font-bold">{m.value}</div>
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-slate-400">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="pb-20 pt-2">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-semibold text-yellow-400">
            Vive la experiencia Arena Real
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                data-testid="feature-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Card className="border border-yellow-400/20 bg-white/5 text-slate-100 backdrop-blur">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-400/10 text-yellow-400">
                      {f.icon}
                    </div>
                    <CardTitle className="text-base text-yellow-300">
                      {f.title}
                    </CardTitle>
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

      {/* CTA FINAL */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <Card className="border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 via-yellow-600/5 to-transparent text-slate-100 backdrop-blur">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-400">
                    ¿Listo para entrar a la Arena?
                  </h3>
                  <p className="mt-1 text-slate-300">
                    Crea tu cuenta y únete a partidas en vivo.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button size="lg">Crear cuenta</Button>
                  <Button size="lg" variant="outline">
                    Ver partidas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* EFECTO ORO */}
      <style jsx>{`
        .gold-text {
          padding: 0.1em 0.2em;
          background-image:
            linear-gradient(
              180deg,
              #fff8d6 0%,
              #ffe082 18%,
              #ffc544 35%,
              #d6a528 52%,
              #b8871a 66%,
              #f4d56a 82%,
              #a06a00 100%
            ),
            radial-gradient(
              120% 120% at 10% 10%,
              rgba(255, 255, 255, 0.85) 0%,
              rgba(255, 255, 255, 0) 40%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45),
            0 -1px 0 rgba(160, 90, 0, 0.25), 0 8px 24px rgba(255, 204, 0, 0.25);
          position: relative;
        }
        .gold-text .gold-shine {
          position: absolute;
          left: -30%;
          top: 0;
          width: 30%;
          height: 100%;
          content: "";
          pointer-events: none;
          background: linear-gradient(
            75deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          filter: blur(1px);
          transform: skewX(-20deg);
          mix-blend-mode: screen;
          animation: shine 2.8s linear infinite;
        }
        @keyframes shine {
          0% {
            left: -30%;
          }
          60% {
            left: 130%;
          }
          100% {
            left: 130%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gold-text .gold-shine {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

