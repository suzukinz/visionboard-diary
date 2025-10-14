import { useState } from "react";
import { cx, isDark } from "../utils/helpers";
import { useDrag } from "../utils/hooks";

export interface CropRect {
  t: number;
  r: number;
  b: number;
  l: number;
}

interface CropHandlesProps {
  rect: CropRect;
  onChange: (rect: CropRect) => void;
  bounds: { w: number; h: number; theme: string };
}

function CropHandles({ rect, onChange, bounds }: CropHandlesProps) {
  const edge = (side: string) => {
    const drag = useDrag((e: PointerEvent) => {
      const bb = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
      const x = e.clientX - bb.left;
      const y = e.clientY - bb.top;
      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      if (side === 'l') onChange({ ...rect, l: clamp(x, 0, rect.r - 20) });
      if (side === 'r')
        onChange({ ...rect, r: clamp(bounds.w - x, 0, bounds.w - rect.l - 20) });
      if (side === 't') onChange({ ...rect, t: clamp(y, 0, rect.b - 20) });
      if (side === 'b')
        onChange({ ...rect, b: clamp(bounds.h - y, 0, bounds.h - rect.t - 20) });
    });

    return (
      <div
        onPointerDown={drag.start}
        className={cx(
          "absolute border",
          side === 't' || side === 'b'
            ? "h-1 w-full cursor-ns-resize"
            : "w-1 h-full cursor-ew-resize",
          side === 't' ? "top-0" : "",
          side === 'b' ? "bottom-0" : "",
          side === 'l' ? "left-0" : "",
          side === 'r' ? "right-0" : "",
          isDark(bounds.theme)
            ? "bg-white/30 border-white/40"
            : "bg-white/70 border-slate-400"
        )}
      />
    );
  };

  const corner = (pos: string) => {
    const drag = useDrag((e: PointerEvent) => {
      const bb = (e.currentTarget as HTMLElement).parentElement!.getBoundingClientRect();
      const x = e.clientX - bb.left;
      const y = e.clientY - bb.top;
      const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(max, v));

      let t = rect.t,
        r = rect.r,
        b = rect.b,
        l = rect.l;
      if (pos.includes('t')) t = clamp(y, 0, b - 20);
      if (pos.includes('b')) b = clamp(bounds.h - y, 0, bounds.h - t - 20);
      if (pos.includes('l')) l = clamp(x, 0, r - 20);
      if (pos.includes('r')) r = clamp(bounds.w - x, 0, bounds.w - l - 20);
      onChange({ t, r, b, l });
    });

    const cls = cx(
      "absolute w-3 h-3 border",
      pos.includes('t') ? "top-0" : "bottom-0",
      pos.includes('l') ? "left-0" : "right-0",
      "-translate-x-1/2 -translate-y-1/2 cursor-grab",
      "bg-white",
      isDark(bounds.theme) ? "border-white/50" : "border-slate-500"
    );
    return <div onPointerDown={drag.start} className={cls} />;
  };

  return (
    <>
      {edge('t')}
      {edge('r')}
      {edge('b')}
      {edge('l')}
      {corner('tl')}
      {corner('tr')}
      {corner('bl')}
      {corner('br')}
    </>
  );
}

interface ImageCardProps {
  crop: CropRect;
  cropping: boolean;
  onCropChange: (rect: CropRect) => void;
  theme?: string;
}

export function ImageCard({
  crop,
  cropping,
  onCropChange,
  theme = 'classic'
}: ImageCardProps) {
  const [boxRef, setBoxRef] = useState<HTMLDivElement | null>(null);
  const w = 224,
    h = 128;
  const bounds = { w, h, theme };

  const styleImg = {
    backgroundImage: isDark(theme)
      ? "linear-gradient(135deg,#1f2937,#0b1220)"
      : "linear-gradient(135deg,#e5e7eb,white)",
    backgroundSize: "cover",
    clipPath: `inset(${crop.t}px ${crop.r}px ${crop.b}px ${crop.l}px round 14px)`
  };

  return (
    <div className="w-56">
      <div className="relative" style={{ width: w, height: h }} ref={setBoxRef}>
        <div className="absolute inset-0" style={styleImg} />
        {cropping && boxRef && (
          <div className="absolute inset-0">
            <div
              className={cx(
                "absolute inset-0",
                isDark(theme) ? "bg-black/50" : "bg-black/30"
              )}
              style={{
                clipPath: `inset(${crop.t}px ${crop.r}px ${crop.b}px ${crop.l}px)`
              }}
            />
            <div
              className="absolute"
              style={{
                left: crop.l,
                top: crop.t,
                right: crop.r,
                bottom: crop.b,
                outline: isDark(theme) ? "2px solid #fff" : "2px solid white",
                boxShadow: isDark(theme)
                  ? "0 0 0 1px rgba(148,163,184,.5)"
                  : "0 0 0 1px rgba(51,65,85,.6)"
              }}
            >
              <CropHandles rect={crop} onChange={onCropChange} bounds={bounds} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
