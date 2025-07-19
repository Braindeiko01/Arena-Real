import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ReduxProvider } from '@/store/ReduxProvider';
import TransactionUpdatesListener from '@/components/TransactionUpdatesListener';

export const metadata: Metadata = {
  title: 'Arena Real - Torneos CR Colombia',
  description: 'Demuestra tus habilidades contra otros jugadores!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ReduxProvider>
          <TransactionUpdatesListener />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
