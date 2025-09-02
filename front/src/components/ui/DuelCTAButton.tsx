'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export function DuelCTAButton({
  className,
  ...props
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(245,211,108,.25)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'w-full rounded-[20px] px-6 py-4 font-semibold text-center text-[#15181D] [background:linear-gradient(180deg,#F8EDBD_0%,#F5D36C_45%,#D9A441_100%)] shadow-[0_6px_16px_rgba(0,0,0,.35),0_8px_24px_rgba(245,211,108,.12)] focus:outline-none focus:ring-2 focus:ring-[#F5D36C]/50 disabled:opacity-50 disabled:pointer-events-none',
        className
      )}
      {...props}
    />
  );
}
