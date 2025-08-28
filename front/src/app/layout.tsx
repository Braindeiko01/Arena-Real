import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ReduxProvider } from '@/store/ReduxProvider';
import TransactionUpdatesListener from '@/components/TransactionUpdatesListener';
import PushNotificationsInitializer from '@/components/PushNotificationsInitializer';

export const metadata: Metadata = {
  title: 'Arena Real - Torneos CR Colombia',
  description: 'Demuestra tus habilidades contra otros jugadores!',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-cinzel' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="bg-app" aria-hidden="true">
          <div className="bg-grid" />
        </div>
        <ReduxProvider>
          <PushNotificationsInitializer />
          <TransactionUpdatesListener />
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
