// Helper functions
export function cx(...xs: any[]): string {
  return xs.filter(Boolean).join(" ");
}

export function isDark(theme: string): boolean {
  return theme === 'dark';
}

export function isPop(theme: string): boolean {
  return theme === 'pop';
}

export function getGridAlpha(theme: string): number {
  return isPop(theme) ? 0.08 : isDark(theme) ? 0.25 : 0.12;
}

export function normDeg(d: number): number {
  const n = ((d % 360) + 360) % 360;
  return Math.round(n);
}

export const PALETTE = [
  '#FFEFD5', '#FDE68A', '#BBF7D0', '#FBCFE8', '#BAE6FD',
  '#DDD6FE', '#FCA5A5', '#F5F5F4', '#E2E8F0', '#DCFCE7'
];

export const MAX_BOARDS = 2;
