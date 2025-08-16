'use client';

import { useEffect, useRef } from 'react';

export default function CountUp({ id, to, prefix = '+', suffix = '' }: { id: string; to: number; prefix?: string; suffix?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    const start = performance.now();
    const duration = 1200;
    const step = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const val = Math.floor(p * to);
      el.textContent = `${prefix}${val}${suffix}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, prefix, suffix]);
  return <span id={id} ref={spanRef}>{prefix}{0}{suffix}</span>;
}
