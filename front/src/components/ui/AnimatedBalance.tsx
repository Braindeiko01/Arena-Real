'use client';

import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface AnimatedBalanceProps {
  value: number;
}

export function AnimatedBalance({ value }: AnimatedBalanceProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span className="text-[40px] font-bold text-gold-1 leading-none drop-shadow-[0_0_6px_var(--glow)]">
      {new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
      }).format(display)}
    </span>
  );
}
