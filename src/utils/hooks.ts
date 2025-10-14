import React from "react";

// Drag helper hook
export function useDrag(
  onMove?: (e: PointerEvent) => void,
  onEnd?: (e: PointerEvent) => void
) {
  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      onMove?.(ev);
    };
    const up = (ev: PointerEvent) => {
      ev.preventDefault();
      onEnd?.(ev);
      target.releasePointerCapture(ev.pointerId);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };
  return { start };
}
