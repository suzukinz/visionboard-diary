// Icon components
export const Icon = {
  Layout: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 12h18" />
    </svg>
  ),
  Sticky: (p: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6 3h9l6 6v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Zm9 0v6h6" />
    </svg>
  ),
  Image: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 18-5.5-5.5L9 19l-3-3-3 3" />
    </svg>
  ),
  ChevronL: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M15 6 9 12l6 6" />
    </svg>
  ),
  ChevronR: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Eye: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3c0-.4-.1-.9-.3-1.2M9.9 4.2A10.7 10.7 0 0 1 12 5c6 0 10 7 10 7a18.3 18.3 0 0 1-4 4.8" />
      <path d="M6.5 6.5A18.6 18.6 0 0 0 2 12s4 7 10 7c1.7 0 3.3-.4 4.7-1.1" />
    </svg>
  ),
  Plus: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  X: (p: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Github: (p: any) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
      <path
        fillRule="evenodd"
        d="M12 .5C5.648.5.5 5.648.5 12c0 5.087 3.292 9.396 7.862 10.92.575.11.786-.252.786-.56 0-.276-.01-1.007-.016-1.978-3.198.695-3.873-1.541-3.873-1.541-.523-1.329-1.278-1.684-1.278-1.684-1.044-.714.079-.7.079-.7 1.155.081 1.763 1.187 1.763 1.187 1.026 1.757 2.693 1.25 3.35.956.104-.742.402-1.25.73-1.537-2.553-.29-5.237-1.277-5.237-5.683 0-1.256.448-2.283 1.184-3.09-.118-.29-.513-1.456.112-3.035 0 0 .965-.309 3.165 1.18a10.98 10.98 0 0 1 2.882-.388c.978.004 1.966.132 2.883.388 2.198-1.488 3.161-1.18 3.161-1.18.628 1.579.233 2.745.115 3.035.737.807 1.183 1.834 1.183 3.09 0 4.418-2.69 5.388-5.255 5.673.413.356.78 1.057.78 2.132 0 1.54-.014 2.783-.014 3.161 0 .311.208.676.792.561C20.21 21.392 23.5 17.083 23.5 12 23.5 5.648 18.352.5 12 .5Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};
