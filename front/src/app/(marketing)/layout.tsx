import '../globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arena Real - Torneos CR Colombia',
  description: 'Demuestra tus habilidades contra otros jugadores!',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="landing">{children}</body>
    </html>
  );
}
