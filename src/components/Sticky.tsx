import React, { useEffect, useRef, useState } from "react";
import { cx, isDark, isPop } from "../utils/helpers";

interface StickyProps {
  variant?: string;
  color?: string;
  text?: string;
  width?: number;
  height?: number;
  theme?: string;
  editable?: boolean;
  onChangeText?: (text: string) => void;
  onResize?: (size: { width: number; height: number }) => void;
  autoFocus?: boolean;
  selected?: boolean;
  onEdit?: () => void;
}

export const Sticky = React.memo(function Sticky({
  variant = 'rect',
  color = "#FFEFD5",
  text = "",
  width = 300,
  height = 200,
  theme = 'classic',
  editable = false,
  onChangeText = () => {},
  onResize = () => {},
  autoFocus = false,
  selected = false,
  onEdit = () => {}
}: StickyProps) {
  const base = cx(
    editable ? "shadow-md border p-3" : "shadow-md border p-3 select-none",
    isPop(theme)
      ? "text-black border-white border-[5px] shadow-[0_8px_0_rgba(0,0,0,0.15)] hover:shadow-[0_10px_0_rgba(0,0,0,0.15)]"
      : isDark(theme)
      ? "text-slate-100 border-slate-700 bg-slate-800"
      : "text-black border-slate-200"
  );
  const textRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width, height });
  const [isResizing, setIsResizing] = useState(false);
  const startRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const finalSize = useRef({ width, height });

  // props が変更されたら state を更新（リサイズ中は除く）
  useEffect(() => {
    if (!isResizing) {
      setSize({ width, height });
      finalSize.current = { width, height };
    }
  }, [width, height, isResizing]);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsResizing(true);
    startRef.current = {
      x: e.clientX,
      y: e.clientY,
      w: size.width,
      h: size.height
    };
  };

  const handleResizeMove = (e: PointerEvent) => {
    if (!isResizing) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const newWidth = Math.max(100, startRef.current.w + dx);
    const newHeight = Math.max(100, startRef.current.h + dy);
    const newSize = { width: newWidth, height: newHeight };
    setSize(newSize);
    finalSize.current = newSize;
  };

  const handleResizeEnd = () => {
    if (!isResizing) return;
    const endSize = finalSize.current;
    setIsResizing(false);
    onResize(endSize);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('pointermove', handleResizeMove);
      window.addEventListener('pointerup', handleResizeEnd);
      return () => {
        window.removeEventListener('pointermove', handleResizeMove);
        window.removeEventListener('pointerup', handleResizeEnd);
      };
    }
  }, [isResizing, size]);

  useEffect(() => {
    if (textRef.current && editable) {
      if (textRef.current.innerText !== text) {
        textRef.current.innerText = text;
      }
      if (autoFocus) {
        textRef.current.focus();
        const sel = window.getSelection?.();
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        range.collapse(false);
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }, [editable]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChangeText(e.currentTarget.innerText);
  };

  const TextBlock = () => (
    <div
      ref={textRef}
      contentEditable={editable}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className={cx(
        "mt-1 font-semibold outline-none whitespace-pre-wrap break-words",
        editable ? (isDark(theme) ? "caret-white" : "caret-black") : ""
      )}
      spellCheck={false}
    />
  );

  const inner = (children: React.ReactNode) => (
    <div
      className={cx(
        "relative transition-transform duration-150",
        isPop(theme) && "hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-100",
        selected &&
          (isDark(theme)
            ? "ring-2 ring-sky-500 rounded-xl"
            : isPop(theme)
            ? "ring-4 ring-pink-400 rounded-xl"
            : "ring-2 ring-pink-300 rounded-xl")
      )}
      onClick={(e) => {
        if (selected && !editable) {
          e.stopPropagation();
          onEdit();
        }
      }}
    >
      {children}
    </div>
  );

  const ViewText = () => <div className="mt-1 font-semibold">{text}</div>;

  // Resize handle component
  const ResizeHandle = () => (
    <div
      data-resize-handle="true"
      className={cx(
        "absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10",
        isDark(theme) ? "bg-slate-600" : "bg-slate-300",
        "hover:bg-slate-400 rounded-tl-md transition-colors"
      )}
      style={{ touchAction: "none" }}
      onPointerDown={handleResizeStart}
    >
      <div className="absolute bottom-0.5 right-0.5 w-2 h-2">
        <svg viewBox="0 0 8 8" className="fill-current opacity-50">
          <path d="M7,4 L7,7 L4,7" />
          <path d="M7,0 L7,3 L4,3" />
        </svg>
      </div>
    </div>
  );

  // 画像バリアント
  if (variant === 'image')
    return inner(
      <div
        className={cx("relative overflow-hidden", base)}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <img
          src={text}
          alt="uploaded"
          className="w-full h-full object-cover rounded-2xl"
          draggable={false}
        />
        <ResizeHandle />
      </div>
    );

  if (variant === 'round')
    return inner(
      <div
        className={cx("w-40 h-40 rounded-full flex flex-col justify-center items-center", base)}
        style={{ background: color }}
      >
        {editable ? <TextBlock /> : <ViewText />}
        <ResizeHandle />
      </div>
    );

  if (variant === 'square')
    return inner(
      <div className={cx("w-44 h-44 rounded-2xl", base)} style={{ background: color }}>
        {editable ? <TextBlock /> : <ViewText />}
        <ResizeHandle />
      </div>
    );

  if (variant === 'torn')
    return inner(
      <div
        className={cx("w-52 rounded-2xl relative", base)}
        style={{
          background: color,
          clipPath:
            "polygon(0% 0%,100% 0%,100% 85%,95% 88%,90% 85%,85% 88%,80% 85%,75% 88%,70% 85%,65% 88%,60% 85%,55% 88%,50% 85%,45% 88%,40% 85%,35% 88%,30% 85%,25% 88%,20% 85%,15% 88%,10% 85%,5% 88%,0% 85%)"
        }}
      >
        {editable ? <TextBlock /> : <ViewText />}
        <ResizeHandle />
      </div>
    );

  if (variant === 'fold')
    return inner(
      <div className={cx("w-52 h-48 rounded-2xl relative overflow-hidden", base)} style={{ background: color }}>
        <div
          className="absolute top-0 right-0 w-16 h-16"
          style={{
            clipPath: "polygon(0 0,100% 0,100% 100%)",
            background: "linear-gradient(135deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.05) 100%)"
          }}
        />
        <div
          className="absolute top-0 right-0 w-16 h-16 border-l border-b"
          style={{
            clipPath: "polygon(0 0,100% 0,100% 100%)",
            borderColor: "rgba(0,0,0,.1)"
          }}
        />
        {editable ? <TextBlock /> : <ViewText />}
        <ResizeHandle />
      </div>
    );

  if (variant === 'cloud')
    return inner(
      <div
        className={cx("w-64 h-48 relative", base)}
        style={{
          background: color,
          borderRadius: "50% 40% 40% 50% / 60% 50% 50% 60%"
        }}
      >
        <div className="absolute inset-0 p-4 flex items-center justify-center">
          {editable ? <TextBlock /> : <ViewText />}
        </div>
        <ResizeHandle />
      </div>
    );

  if (variant === 'tab')
    return inner(
      <div
        className={cx("w-52 rounded-b-2xl rounded-t-[1.6rem] relative", base)}
        style={{ background: color }}
      >
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/80 border text-[10px]">
          tab
        </div>
        <div className="p-3 pt-5">
          {editable ? <TextBlock /> : <ViewText />}
        </div>
        <ResizeHandle />
      </div>
    );

  return inner(
    <div
      className={cx("rounded-2xl relative", base)}
      style={{ background: color, width: `${size.width}px`, height: `${size.height}px` }}
    >
      <div className="p-3">
        {editable ? <TextBlock /> : <ViewText />}
      </div>
      <ResizeHandle />
    </div>
  );
}, (prev, next) => {
  // 編集中はtextの変更を無視（手動で入力しているため）
  if (prev.editable && next.editable && prev.text !== next.text) {
    // textだけ変わった場合は再レンダリングしない
    return (
      prev.variant === next.variant &&
      prev.color === next.color &&
      prev.width === next.width &&
      prev.height === next.height &&
      prev.theme === next.theme &&
      prev.editable === next.editable &&
      prev.autoFocus === next.autoFocus &&
      prev.selected === next.selected
    );
  }
  return (
    prev.variant === next.variant &&
    prev.color === next.color &&
    prev.text === next.text &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.theme === next.theme &&
    prev.editable === next.editable &&
    prev.autoFocus === next.autoFocus &&
    prev.selected === next.selected
  );
});
