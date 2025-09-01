import dynamic from 'next/dynamic';

export const Bell = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Bell })),
  { ssr: false }
);
export const Home = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Home })),
  { ssr: false }
);
export const Trophy = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Trophy })),
  { ssr: false }
);
export const Menu = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Menu })),
  { ssr: false }
);
export const ScrollText = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.ScrollText })),
  { ssr: false }
);
export const MessageCircle = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.MessageCircle })),
  { ssr: false }
);
export const Users = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Users })),
  { ssr: false }
);
export const Shield = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Shield })),
  { ssr: false }
);
export const Award = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Award })),
  { ssr: false }
);
export const Swords = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Swords })),
  { ssr: false }
);
export const Layers = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Layers })),
  { ssr: false }
);
export const UploadCloud = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.UploadCloud })),
  { ssr: false }
);
export const Coins = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Coins })),
  { ssr: false }
);
export const Loader2 = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Loader2 })),
  { ssr: false }
);
export const Send = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Send })),
  { ssr: false }
);
export const LinkIcon = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Link })),
  { ssr: false }
);
export const CheckCircle = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.CheckCircle })),
  { ssr: false }
);
export const XCircle = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.XCircle })),
  { ssr: false }
);
export const Banknote = dynamic(
  () => import('lucide-react').then((m) => ({ default: m.Banknote })),
  { ssr: false }
);
