'use client';

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function GoldButton({ className, ...props }: GoldButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center w-full select-none rounded-[20px] px-5 py-4 text-base font-semibold text-center fantasy-text text-[#15181D] transition-all duration-200 [background:linear-gradient(180deg,#F6E7AA,#F5D36C_40%,#D9A441)] shadow-[0_6px_16px_rgba(0,0,0,.35),0_8px_24px_rgba(245,211,108,.12)] hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(245,211,108,.25)] active:translate-y-0 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#F5D36C]/50 disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  );
}
