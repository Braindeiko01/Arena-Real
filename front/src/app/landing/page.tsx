"use client";

import Head from "next/head";
import { useEffect } from "react";

export default function Landing() {
  useEffect(() => {
    const el = document.getElementById("hero-parallax");
    if (!el) return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isCoarse && !prefersReduced) {
      let rect = el.getBoundingClientRect();
      const strength = 10;
      const updateRect = () => {
        rect = el.getBoundingClientRect();
      };
      window.addEventListener("resize", updateRect);
      el.addEventListener("mousemove", (e) => {
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * strength;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * strength;
        el.style.setProperty("--px", `${x}px`);
        el.style.setProperty("--py", `${y}px`);
      });
      el.addEventListener("mouseleave", () => {
        el.style.setProperty("--px", "0px");
        el.style.setProperty("--py", "0px");
      });
    }
    const countUp = (id: string, to: number, prefix = "+", suffix = "") => {
      const element = document.getElementById(id);
      if (!element) return;
      const target = element as HTMLElement;
      const start = performance.now();
      const duration = 1200;
      function step(t: number) {
        const p = Math.min((t - start) / duration, 1);
        const val = Math.floor(p * to);
        target.textContent = `${prefix}${val}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    countUp("m1", 128);
    countUp("m2", 50, "+$", "K");
    countUp("m3", 2000);
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }, []);

  return (
    <>
      <Head>
        <title>Arena Real — Móvil Optimizado · Neon Gold</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a1324" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg" aria-hidden="true">
        <div className="grid" />
        <div
          className="arena-sill"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "120px",
            background: "linear-gradient(to top, rgba(0,0,0,.42), transparent 65%)",
            WebkitMaskImage: "linear-gradient(to top, black 70%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
          }}
        />
      </div>
      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand" aria-label="Arena Real">
            <div className="logo" aria-hidden="true">AR</div>
            <div>
              <div style={{ fontFamily: "Cinzel,serif", fontWeight: 800, letterSpacing: ".05em" }}>ARENA REAL</div>
              <div className="brand-sub" style={{ fontSize: "12px", opacity: ".7", letterSpacing: ".18em" }}>
                DU E LO S
              </div>
            </div>
          </div>
          <nav className="nav-ctas" aria-label="Navegación primaria">
            <a className="btn btn-ghost btn-pill" href="/auth/login">
              Entrar
            </a>
            <a className="btn btn-solid btn-pill" href="/auth/login" aria-label="Registrarse y comenzar duelo">
              Registrarse
            </a>
          </nav>
        </div>
      </header>
      <main className="hero">
        <section className="container" id="hero" style={{ textAlign: "center" }}>
          <span className="badge">
            <span className="live-dot" aria-hidden="true" /> EN VIVO · Desafíos abiertos
          </span>

          <svg className="swords" width="84" height="68" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              className="sword-stroke"
              d="M8 8 L28 28 M28 28 L36 20 M28 28 L20 36"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              color="#e7c56b"
            />
            <path
              className="sword-stroke delay"
              d="M56 8 L36 28 M36 28 L28 20 M36 28 L44 36"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              color="#e7c56b"
            />
          </svg>

          <h1 className="title">
            DESAFÍA LA <span className="neon">ARENA REAL</span>
          </h1>
          <p className="subtitle">Gladiadores, honor y botín. Retos reales con diseño profesional.</p>

          <div className="hero-ctas parallax" id="hero-parallax">
            <a className="btn btn-solid btn-lg btn-pill" href="/auth/login">
              Desafiar ahora
            </a>
            <a className="btn btn-ghost btn-lg btn-pill" href="/auth/login">
              Ver batallas
            </a>
          </div>

          <div className="metrics" role="list">
            <article className="shield" role="listitem">
              <div className="metric-value">
                <span id="m1">+0</span>
              </div>
              <div className="metric-label">DUELOS ACTIVOS</div>
            </article>
            <article className="shield" role="listitem">
              <div className="metric-value">
                +$<span id="m2">0</span>K
              </div>
              <div className="metric-label">BOTÍN ENTREGADO</div>
            </article>
            <article className="shield" role="listitem">
              <div className="metric-value">
                <span id="m3">+0</span>
              </div>
              <div className="metric-label">GLADIADORES</div>
            </article>
          </div>
        </section>

        <div className="sep-curved" aria-hidden="true" />

        <section className="container features-section">
          <h2 className="section-title">Forja tu leyenda</h2>
          <div className="features">
            <article className="card">
              <svg className="icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2l3 6 6 .9-4.5 4.4 1 6.3L12 16l-5.5 3.6 1-6.3L3 8.9 9 8l3-6z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  color="#e7c56b"
                />
              </svg>
              <h3>Duelo 1v1</h3>
              <p>Reglas claras, reportes rápidos y matchmaking justo.</p>
            </article>
            <article className="card">
              <svg className="icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 21h10M12 3v14M8 9l4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  color="#e7c56b"
                />
              </svg>
              <h3>Clasificación</h3>
              <p>Coronas y laureles para los mejores. Ranking transparente.</p>
            </article>
            <article className="card">
              <svg className="icon" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect
                  x="3"
                  y="7"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  color="#e7c56b"
                />
                <path
                  d="M3 10h18M8 5h8l1 2H7l1-2z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  color="#e7c56b"
                />
              </svg>
              <h3>Botín asegurado</h3>
              <p>Pagos sin fricción y verificación segura.</p>
            </article>
          </div>

          <div className="cta">
            <div className="cta-flex">
              <div>
                <h3>¿Listo para combatir?</h3>
                <p>Únete a los duelos en vivo.</p>
              </div>
              <div>
                <a className="btn btn-solid btn-lg btn-pill" href="/auth/login">
                  Entrar a la Arena
                </a>
                <a className="btn btn-ghost btn-lg btn-pill" href="/auth/login" style={{ marginLeft: 0 }}>
                  Ver batallas
                </a>
              </div>
            </div>
          </div>

          <div className="sep" />

          <footer className="footer">
            <div
              className="container"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                © <span id="year" /> Arena Real
              </div>
              <div style={{ display: "flex", gap: "14px", opacity: ".9" }}>
                <a href="#" aria-label="Términos">
                  Términos
                </a>
                <span aria-hidden="true">•</span>
                <a href="#" aria-label="Privacidad">
                  Privacidad
                </a>
                <span aria-hidden="true">•</span>
                <a href="#" aria-label="Soporte">
                  Soporte
                </a>
              </div>
            </div>
          </footer>
        </section>
      </main>

      <style jsx>{`
        :root {
          --bg: #0d0e14;
          --bg-elev: #131420;
          --text: #e8e8ef;
          --muted: #b9b9c7;
          --gold: #f5d469;
          --gold-2: #e7b64a;
          --gold-3: #fff1a8;
          --radius: 18px;
          --shadow-1: 0 10px 24px rgba(0, 0, 0, 0.35);
          --glow: 0 0 10px rgba(245, 212, 105, 0.25);
          --safe: max(env(safe-area-inset-bottom), 16px);
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
          background: var(--bg);
          color: var(--text);
        }
        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        img {
          max-width: 100%;
          display: block;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(38rem 22rem at 50% 18%, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0) 60%),
            radial-gradient(80rem 40rem at 20% 20%, rgba(61, 29, 93, 0.32), transparent 60%),
            radial-gradient(60rem 30rem at 85% 65%, rgba(231, 182, 74, 0.12), transparent 60%),
            linear-gradient(180deg, #2b0f3f 0%, #151524 65%, #0d0e14 100%);
        }
        .bg::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.55;
          background: repeating-conic-gradient(from 0deg at 20% 30%, rgba(255, 255, 255, 0.022) 0% 2%, rgba(0, 0, 0, 0) 2% 4%),
            repeating-linear-gradient(120deg, rgba(255, 255, 255, 0.018) 0 2px, rgba(0, 0, 0, 0) 2px 10px);
          mix-blend-mode: overlay;
        }
        .bg::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 120%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0.6) 100%);
        }
        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px);
          background-size: 38px 38px;
          animation: gridMove 40s linear infinite;
        }
        @keyframes gridMove {
          to {
            background-position: 720px 720px;
          }
        }
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(10px);
          background: rgba(20, 20, 32, 0.6);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          position: relative;
        }
        .brand::before {
          content: "";
          position: absolute;
          left: -26px;
          top: -26px;
          width: 140px;
          height: 140px;
          z-index: -1;
          background: radial-gradient(circle, rgba(231, 182, 74, 0.28), rgba(231, 182, 74, 0) 60%);
          filter: blur(8px);
        }
        .logo {
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          display: grid;
          place-items: center;
          color: #111;
          background: linear-gradient(135deg, var(--gold), var(--gold-2));
          box-shadow: var(--glow);
          font-family: Cinzel, serif;
          font-weight: 800;
        }
        .nav-ctas {
          display: flex;
          gap: 10px;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 12px 16px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
          min-height: 48px;
          -webkit-tap-highlight-color: transparent;
        }
        .btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(231, 182, 74, 0.35);
        }
        .btn-solid {
          background: linear-gradient(135deg, var(--gold), var(--gold-2));
          color: #141414;
          border-color: transparent;
        }
        .btn-solid:hover {
          transform: translateY(-1px);
        }
        .btn-ghost {
          background: rgba(255, 255, 255, 0.04);
          color: var(--gold);
          border-color: rgba(231, 182, 74, 0.35);
        }
        .btn-ghost:hover {
          background: rgba(231, 182, 74, 0.12);
        }
        .btn-lg {
          padding: 14px 22px;
          font-size: 18px;
        }
        .btn-pill {
          border-radius: 9999px;
        }
        .hero {
          padding: 84px 0 24px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(231, 182, 74, 0.1);
          border: 1px solid rgba(231, 182, 74, 0.32);
          color: #fff2d0;
          padding: 6px 12px;
          border-radius: 9999px;
          font-weight: 600;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #ffb703;
          box-shadow: 0 0 6px #ffb703;
        }
        .title {
          font-family: Cinzel, serif;
          font-weight: 800;
          text-align: center;
          font-size: clamp(28px, 8vw, 46px);
          letter-spacing: 0.04em;
          margin: 10px 0 8px;
          color: var(--text);
        }
        .title .neon {
          color: var(--gold-3);
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.22), 0 0 22px rgba(231, 182, 74, 0.22);
        }
        .subtitle {
          text-align: center;
          opacity: 0.9;
          max-width: 760px;
          margin: 0 auto;
          font-size: 17px;
          color: var(--muted);
        }
        .hero-ctas {
          margin-top: 24px;
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .parallax {
          transform: translate(var(--px, 0), var(--py, 0));
          transition: transform 0.15s ease-out;
        }
        .swords {
          display: block;
          margin: 18px auto 0;
        }
        .sword-stroke {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: draw 1s ease forwards;
        }
        .sword-stroke.delay {
          animation-delay: 0.25s;
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          max-width: 900px;
          margin: 28px auto 0;
        }
        .shield {
          position: relative;
          border-radius: var(--radius);
          padding: 18px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(231, 182, 74, 0.28);
          box-shadow: var(--shadow-1);
        }
        .metric-value {
          font: 800 28px/1 Cinzel, serif;
          color: var(--gold-2);
        }
        .metric-label {
          margin-top: 6px;
          font-size: 11px;
          letter-spacing: 0.18em;
          opacity: 0.75;
        }
        .sep-curved {
          position: relative;
          height: 24px;
          margin: 8px 0 0;
          background: radial-gradient(
            120% 140% at 50% -20%,
            rgba(231, 182, 74, 0.34) 0%,
            rgba(231, 182, 74, 0.18) 30%,
            rgba(231, 182, 74, 0) 60%
          );
          pointer-events: none;
        }
        .sep-curved::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.45), transparent);
        }
        .features-section {
          position: relative;
          border-radius: 22px;
          padding: 24px;
          margin-top: 0;
          background: linear-gradient(180deg, rgba(26, 19, 36, 0.88) 0%, rgba(13, 14, 20, 1) 100%);
          border: 1px solid rgba(231, 182, 74, 0.16);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }
        .features-section::before {
          content: "";
          position: absolute;
          left: -1px;
          right: -1px;
          top: -1px;
          height: 140px;
          border-radius: 22px 22px 0 0;
          background: radial-gradient(120% 80% at 50% 0%, rgba(231, 182, 74, 0.18), rgba(231, 182, 74, 0) 70%);
          pointer-events: none;
        }
        .section-title {
          text-align: center;
          margin: 8px 0 14px;
          font: 800 26px/1.15 Cinzel, serif;
          color: #f0e0a6;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          background: none;
        }
        .card {
          position: relative;
          border-radius: var(--radius);
          padding: 18px;
          background: linear-gradient(135deg, rgba(43, 15, 63, 0.35), rgba(231, 182, 74, 0.04));
          border: 1px solid rgba(231, 182, 74, 0.25);
          box-shadow: var(--shadow-1);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .card h3 {
          margin: 0 0 6px;
          color: #f0e0a6;
          font-weight: 700;
        }
        .card p {
          margin: 0;
          color: var(--muted);
        }
        .card .icon {
          position: absolute;
          right: 14px;
          top: 14px;
          opacity: 0.9;
        }
        .cta {
          margin: 28px auto 0;
          border-radius: 22px;
          padding: 26px;
          text-align: center;
          background: linear-gradient(135deg, rgba(231, 182, 74, 0.1), rgba(43, 15, 63, 0.25));
          border: 1px solid rgba(231, 182, 74, 0.28);
        }
        .cta-flex {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .cta h3 {
          margin: 0;
          font: 800 24px/1.15 Cinzel, serif;
          color: var(--gold-3);
        }
        .cta p {
          margin: 6px 0 10px;
          opacity: 0.9;
          color: var(--muted);
        }
        .cta .btn {
          width: 100%;
          max-width: 340px;
          margin: 6px auto;
          display: block;
          text-align: center;
        }
        .footer {
          margin: 36px 0 calc(var(--safe) - 6px);
          color: #a4a6b4;
          font-size: 13px;
        }
        .sep {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(231, 182, 74, 0.25), transparent);
          margin: 22px 0;
        }
        @media (max-width: 900px) {
          .metrics {
            grid-template-columns: 1fr;
            max-width: 640px;
          }
          .features {
            grid-template-columns: 1fr;
          }
          .hero {
            padding-top: 76px;
          }
        }
        @media (max-width: 640px) {
          .container {
            padding: 0 16px;
          }
          .nav-inner {
            padding: 8px 0;
          }
          .brand-sub {
            display: none;
          }
          .btn {
            padding: 10px 14px;
            font-size: 15px;
          }
          .title {
            font-size: clamp(26px, 9vw, 40px);
          }
          .subtitle {
            font-size: 16px;
          }
          .hero-ctas {
            flex-direction: column;
            width: 100%;
          }
          .hero-ctas .btn {
            width: 100%;
          }
          .shield {
            padding: 14px;
          }
          .metric-value {
            font-size: 24px;
          }
          .metric-label {
            font-size: 10px;
          }
          .section-title {
            font-size: 24px;
          }
          .card {
            padding: 16px;
          }
          .cta-flex {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .cta .btn {
            width: 100%;
            max-width: 340px;
          }
          .footer .container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }
          .grid {
            animation: none;
          }
          .card,
          .shield {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .grid,
          .sword-stroke,
          .parallax {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </>
  );
}
