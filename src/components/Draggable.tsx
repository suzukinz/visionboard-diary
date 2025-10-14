import React, { useRef, useState, useEffect } from "react";
import { useDrag } from "../utils/hooks";
import { cx } from "../utils/helpers";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  x: number;
  y: number;
  onChange?: (id: string, pos: { x: number; y: number }) => void;
  onSelect?: (id: string) => void;
  scale?: number;
  disabled?: boolean;
  isEditing?: boolean;
}

export function Draggable({
  id,
  children,
  x,
  y,
  onChange,
  onSelect,
  scale = 1,
  disabled = false,
  isEditing = false
}: DraggableProps) {
  const [pos, setPos] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const origin = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const finalPos = useRef({ x, y });

  // props が変更されたら state を更新（ドラッグ中または編集中は除く）
  useEffect(() => {
    if (!isDragging && !isEditing) {
      setPos({ x, y });
      finalPos.current = { x, y };
    }
  }, [x, y, isDragging, isEditing]);

  const { start } = useDrag(
    (e) => {
      if (disabled) return;
      const dx = (e.clientX - origin.current.sx) / scale;
      const dy = (e.clientY - origin.current.sy) / scale;
      const newPos = {
        x: Math.round(origin.current.x + dx),
        y: Math.round(origin.current.y + dy)
      };
      setPos(newPos);
      finalPos.current = newPos;
    },
    () => {
      if (!disabled) {
        // ドラッグ終了時に最終位置を確実に保存
        const endPos = finalPos.current;
        setIsDragging(false);
        // すぐに onChange を呼び出す
        onChange?.(id, endPos);
      }
    }
  );

  return (
    <div
      onPointerDown={(e) => {
        // 付箋内のテキストエディタやリサイズハンドルからのイベントは無視
        if ((e.target as HTMLElement).getAttribute('contenteditable') === 'true') return;
        if ((e.target as HTMLElement).closest('[data-resize-handle]')) return;
        // 削除ボタンからのイベントも無視
        if ((e.target as HTMLElement).closest('button[aria-label="削除"]')) return;

        onSelect?.(id);
        if (!disabled) {
          setIsDragging(true);
          origin.current = {
            x: pos.x,
            y: pos.y,
            sx: e.clientX,
            sy: e.clientY
          };
          start(e);
        }
      }}
      className={cx(
        "absolute touch-none",
        disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      )}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        willChange: isDragging ? 'transform' : 'auto',
        pointerEvents: 'auto'
      }}
    >
      {children}
    </div>
  );
}
