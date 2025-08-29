export const tokens = {
  colors: {
    bg: 'var(--bg)',
    panel: 'var(--panel)',
    panel2: 'var(--panel-2)',
    text: {
      primary: 'var(--text)',
      sec: 'var(--muted)',
    },
    gold: 'var(--gold)',
    goldStrong: 'var(--gold-strong)',
    stroke: 'var(--stroke)',
    success: 'var(--success)',
    error: 'var(--error)',
  },
  fonts: {
    body: 'Inter, ui-sans-serif, system-ui',
    headline: 'Poppins, ui-sans-serif, system-ui',
    code: 'monospace',
  },
  radii: {
    base: 'var(--radius)',
    xl2: 'calc(var(--radius) + 4px)',
  },
  shadows: {
    soft: 'var(--shadow)',
  },
  spacing: (factor: number) => `calc(var(--space) * ${factor})`,
};
export type DesignTokens = typeof tokens;
