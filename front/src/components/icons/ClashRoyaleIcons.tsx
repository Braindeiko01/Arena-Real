
import { Crown, Shield, Swords, Gem, ShieldCheck, ShieldX, UserCircle, Phone, MessageSquare, Coins, Image as ImageIcon, LogIn, UserPlus, PlayCircle, Landmark, Bot, Info, ScrollText, LogOut, User } from 'lucide-react'; // Added User

// For specific icons, consider creating actual SVG components if lucide doesn't fit the cartoon style.
// For now, we map generic concepts to Lucide icons.

export const CrownIcon = (props: React.ComponentProps<typeof Crown>) => <Crown {...props} />;
export const ShieldIcon = (props: React.ComponentProps<typeof Shield>) => <Shield {...props} />; // Could be player avatar frame
export const SwordsIcon = (props: React.ComponentProps<typeof Swords>) => <Swords {...props} />; // Represents a match/duel
export const ChestIcon = (props: React.ComponentProps<typeof Gem>) => <Gem {...props} />; // Represents a reward or bet item
export const VictoryIcon = (props: React.ComponentProps<typeof ShieldCheck>) => <ShieldCheck {...props} className="text-green-500" />;
export const DefeatIcon = (props: React.ComponentProps<typeof ShieldX>) => <ShieldX {...props} className="text-destructive" />;
export const AvatarIcon = (props: React.ComponentProps<typeof UserCircle>) => <UserCircle {...props} />;
export const PhoneIcon = (props: React.ComponentProps<typeof Phone>) => <Phone {...props} />;
export const ChatIcon = (props: React.ComponentProps<typeof MessageSquare>) => <MessageSquare {...props} />;
export const SaldoIcon = (props: React.ComponentProps<typeof Coins>) => <Coins {...props} />;
export const ScreenshotIcon = (props: React.ComponentProps<typeof ImageIcon>) => <ImageIcon {...props} />;
export const LoginIcon = (props: React.ComponentProps<typeof LogIn>) => <LogIn {...props} />;
export const RegisterIcon = (props: React.ComponentProps<typeof UserPlus>) => <UserPlus {...props} />;
export const FindMatchIcon = (props: React.ComponentProps<typeof PlayCircle>) => <PlayCircle {...props} />;
export const NequiIcon = (props: React.ComponentProps<typeof Landmark>) => <Landmark {...props} />; // Generic bank/payment icon for Nequi
export const BotIcon = (props: React.ComponentProps<typeof Bot>) => <Bot {...props} />;
export const InfoIcon = (props: React.ComponentProps<typeof Info>) => <Info {...props} />;
export const ScrollTextIcon = (props: React.ComponentProps<typeof ScrollText>) => <ScrollText {...props} />;
export const LogOutIcon = (props: React.ComponentProps<typeof LogOut>) => <LogOut {...props} />;
export const UserIcon = (props: React.ComponentProps<typeof User>) => <User {...props} />; // For general User/Username fields

export const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

    