import { useState, useRef } from "react";
import { cx, isDark } from "../utils/helpers";
import { useDrag } from "../utils/hooks";

export const DEFAULT_TOP_RATIO = 60;

interface SplitPaneProps {
  top: React.ReactNode;
  bottom: React.ReactNode;
  initial?: number;
  collapsed?: boolean;
  theme: string;
}

export function SplitPane({
  top,
  bottom,
  initial = DEFAULT_TOP_RATIO,
  collapsed = false,
  theme
}: SplitPaneProps) {
  const [ratio, setRatio] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);

  const { start } = useDrag((e: PointerEvent) => {
    if (collapsed) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const y = e.clientY - r.top;
    const rr = Math.min(80, Math.max(30, (y / r.height) * 100));
    setRatio(rr);
  });

  return (
    <div
      ref={ref}
      className={cx(
        "w-full h-full rounded-3xl border",
        "bg-slate-100/50",
        isDark(theme) ? "border-slate-700" : ""
      )}
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}
    >
      <div style={{
        flex: collapsed ? '1 0 auto' : `${ratio} 0 0`,
        minHeight: 0,
        position: 'relative',
        overflow: 'auto'
      }}>
        {top}
      </div>
      {!collapsed && (
        <div onPointerDown={start} className="h-2 relative group cursor-row-resize flex-shrink-0" style={{ flex: '0 0 auto' }}>
          <div className="absolute inset-x-24 top-1/2 -translate-y-1/2 h-1 rounded-full bg-slate-300 group-hover:bg-slate-400" />
        </div>
      )}
      <div style={{
        flex: collapsed ? '0 0 0' : `${100 - ratio} 0 0`,
        minHeight: 0,
        display: collapsed ? 'none' : 'flex'
      }} className="p-3">
        {bottom}
      </div>
    </div>
  );
}
