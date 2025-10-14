import { useState } from "react";
import "./App.css";
import { Sticky } from "./components/Sticky";
import { Draggable } from "./components/Draggable";
import { Icon } from "./components/Icons";
import { Journal } from "./components/Journal";
import { cx, isDark, isPop, PALETTE } from "./utils/helpers";

interface StickyItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  variant: string;
}

function App() {
  const [theme, setTheme] = useState<'classic' | 'pop' | 'dark'>('pop');
  const [items, setItems] = useState<StickyItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Zoom and Pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const updatePos = (id: string, pos: { x: number; y: number }) => {
    setItems(items.map(it => (it.id === id ? { ...it, ...pos } : it)));
  };

  const updateText = (id: string, text: string) => {
    setItems(items.map(it => (it.id === id ? { ...it, text } : it)));
  };

  const updateSize = (id: string, size: { width: number; height: number }) => {
    setItems(items.map(it => (it.id === id ? { ...it, ...size } : it)));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(it => it.id !== id));
    if (selected === id) setSelected(null);
    if (editingId === id) setEditingId(null);
  };

  const addSticky = (variant = 'rect', color = '#FFEFD5') => {
    const id = `s${Date.now() % 1e6}`;
    // グリッドの中心(2000, 2000)を基準に、現在のビューポート中心の座標を計算
    const centerX = 2000 - pan.x / zoom;
    const centerY = 2000 - pan.y / zoom;
    const x = Math.round(centerX / 24) * 24;
    const y = Math.round(centerY / 24) * 24;
    // バリアントに応じた初期サイズ
    const width = variant === 'rect' ? 300 : 200;
    const height = 200;
    setItems([...items, { id, x, y, width, height, color, text: '', variant }]);
    setShowAddMenu(false);
    setTimeout(() => {
      setEditingId(id);
      setSelected(id);
    }, 0);
  };

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const id = `img${Date.now() % 1e6}`;
            // グリッドの中心(2000, 2000)を基準に、現在のビューポート中心の座標を計算
            const centerX = 2000 - pan.x / zoom;
            const centerY = 2000 - pan.y / zoom;
            const x = Math.round(centerX / 24) * 24;
            const y = Math.round(centerY / 24) * 24;

            // 画像のアスペクト比を保ちながら、最大300x300pxに収める
            const maxSize = 300;
            let width = img.width;
            let height = img.height;

            if (width > maxSize || height > maxSize) {
              if (width > height) {
                height = (height / width) * maxSize;
                width = maxSize;
              } else {
                width = (width / height) * maxSize;
                height = maxSize;
              }
            }

            setItems([...items, {
              id,
              x,
              y,
              width: Math.round(width),
              height: Math.round(height),
              color: '#fff',
              text: ev.target?.result as string,
              variant: 'image'
            }]);
            setShowAddMenu(false);
            setSelected(id);
          };
          img.src = ev.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(0.1, zoom * delta), 3);
    setZoom(newZoom);
  };

  // Pan handlers
  const handlePanStart = (e: React.PointerEvent) => {
    // Space key + left click, or middle mouse button
    if ((e.button === 0 && e.shiftKey) || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handlePanMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const appBG = isPop(theme)
    ? "bg-[radial-gradient(circle_at_10%_0%,#fecdd3,transparent_40%),radial-gradient(circle_at_90%_10%,#bae6fd,transparent_40%),radial-gradient(circle_at_20%_90%,#fde047,transparent_40%),radial-gradient(circle_at_70%_70%,#d8b4fe,transparent_40%),#fef9f3]"
    : isDark(theme)
    ? "bg-[radial-gradient(circle_at_20%_10%,#1e293b,transparent_50%),radial-gradient(circle_at_80%_20%,#312e81,transparent_50%),radial-gradient(circle_at_40%_90%,#0c4a6e,transparent_60%),#0f172a]"
    : "bg-[radial-gradient(ellipse_at_top_left,theme(colors.slate.100),white)]";

  return (
    <div className={cx("min-h-screen w-full relative flex flex-col", appBG)}>
      <div className="w-full flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-2">
          <div
            className={cx(
              "flex items-center gap-2 px-3 py-1.5 rounded-2xl shadow-sm",
              isPop(theme)
                ? "bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 border-4 border-white drop-shadow-[0_6px_0_rgba(0,0,0,0.12)] text-white font-bold"
                : isDark(theme)
                ? "bg-slate-900 border border-slate-700 text-slate-100"
                : "bg-white/80 border"
            )}
          >
            <div className="font-semibold">VisionBoard Diary</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setFullScreen(!fullScreen)}
              className={cx(
                "px-3 py-1.5 rounded-xl border text-sm flex items-center gap-2 font-medium",
                isPop(theme)
                  ? "bg-gradient-to-r from-yellow-300 to-orange-300 border-2 border-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  : isDark(theme)
                  ? "bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800"
                  : "bg-white hover:bg-slate-50"
              )}
            >
              {fullScreen ? <Icon.EyeOff className="w-4 h-4" /> : <Icon.Eye className="w-4 h-4" />}
              {fullScreen ? 'ジャーナル表示' : 'フルサイズ'}
            </button>
            <div
              className={cx(
                "rounded-xl border flex items-center",
                isPop(theme)
                  ? "bg-white border-2 border-white shadow-md"
                  : isDark(theme)
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white"
              )}
            >
              <button
                onClick={() => setTheme('classic')}
                className={cx(
                  "px-2 py-1 rounded-l-xl text-sm font-medium",
                  theme === 'classic'
                    ? isPop(theme)
                      ? "bg-gradient-to-r from-slate-300 to-slate-400"
                      : isDark(theme)
                      ? "bg-slate-800"
                      : "bg-slate-100"
                    : ""
                )}
              >
                Classic
              </button>
              <button
                onClick={() => setTheme('pop')}
                className={cx(
                  "px-2 py-1 text-sm font-medium",
                  theme === 'pop'
                    ? isPop(theme)
                      ? "bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-white font-bold"
                      : isDark(theme)
                      ? "bg-slate-800"
                      : "bg-pink-100"
                    : ""
                )}
              >
                Pop
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cx(
                  "px-2 py-1 rounded-r-xl text-sm font-medium",
                  theme === 'dark'
                    ? isPop(theme)
                      ? "bg-gradient-to-r from-slate-700 to-slate-900 text-sky-300"
                      : "bg-slate-800 text-sky-300"
                    : ""
                )}
              >
                Dark
              </button>
            </div>
          </div>
        </header>

        {/* Vision Board + Journal */}
        <div className="flex-1 px-4 pb-2 flex flex-col gap-2" style={{ minHeight: 0 }}>
          {/* Vision Board */}
          <div
            className={cx(
              "rounded-3xl border overflow-hidden",
              isPop(theme)
                ? "border-4 border-white shadow-lg"
                : isDark(theme)
                ? "border-slate-700"
                : ""
            )}
            style={{
              flex: fullScreen ? '1 1 0' : '3 0 0',
              minHeight: 0,
              position: 'relative'
            }}
          >
            <div
              className={cx(
                "relative w-full h-full",
                isDark(theme) ? "text-slate-100" : "",
                isPanning && "cursor-grabbing"
              )}
              style={{
                backgroundImage: isPop(theme)
                  ? "linear-gradient(to right, rgba(251,113,133,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(147,197,253,0.15) 1px, transparent 1px)"
                  : isDark(theme)
                  ? "linear-gradient(to right, rgba(100,116,139,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(100,116,139,0.15) 1px, transparent 1px)"
                  : "linear-gradient(to right, rgba(148,163,184,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.25) 1px, transparent 1px)",
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0',
                backgroundColor: isPop(theme) ? '#fffbf5' : isDark(theme) ? '#1a1f2e' : 'white'
              }}
              onWheel={handleWheel}
              onPointerDown={(e) => {
                handlePanStart(e);
                if (e.target === e.currentTarget && !isPanning) {
                  setSelected(null);
                  setEditingId(null);
                  setShowAddMenu(false);
                }
              }}
              onPointerMove={handlePanMove}
              onPointerUp={handlePanEnd}
              onPointerLeave={handlePanEnd}
            >
              {/* Items Container */}
              <div
                className="absolute"
                style={{
                  width: '4000px',
                  height: '4000px',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-2000px',
                  marginTop: '-2000px',
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center'
                }}
              >
                {items.map(it => (
                  <Draggable
                    key={it.id}
                    id={it.id}
                    x={it.x}
                    y={it.y}
                    onChange={updatePos}
                    onSelect={() => setSelected(it.id)}
                    isEditing={editingId === it.id}
                  >
                    <div className="relative">
                      <Sticky
                        variant={it.variant}
                        color={it.color}
                        text={it.text}
                        width={it.width}
                        height={it.height}
                        theme={theme}
                        editable={editingId === it.id}
                        autoFocus={editingId === it.id}
                        selected={selected === it.id}
                        onChangeText={(val) => updateText(it.id, val)}
                        onResize={(size) => updateSize(it.id, size)}
                        onEdit={() => setEditingId(it.id)}
                      />
                      {selected === it.id && (
                        <button
                          onPointerDown={(e) => {
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(it.id);
                          }}
                          className={cx(
                            "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-20",
                            isDark(theme)
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          )}
                          style={{ pointerEvents: 'auto' }}
                          aria-label="削除"
                        >
                          <Icon.X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </Draggable>
                ))}
              </div>

              {/* FAB & Add Menu */}
              <div className="absolute right-5 bottom-5 z-50">
                {showAddMenu && (
                  <div
                    className={cx(
                      "absolute bottom-16 right-0 rounded-2xl border shadow-2xl p-4 w-80",
                      isDark(theme) ? "bg-slate-900 border-slate-700" : "bg-white"
                    )}
                  >
                    {!selectedVariant ? (
                      <>
                        {/* ステップ1: 形状選択 */}
                        <div className="mb-4">
                          <div className={cx("text-sm font-semibold mb-2", isDark(theme) ? "text-slate-300" : "text-slate-700")}>
                            ステップ1: 形状を選択
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {['rect', 'square', 'round', 'torn', 'fold', 'cloud', 'tab'].map(v => (
                              <button
                                key={v}
                                onClick={() => setSelectedVariant(v)}
                                className={cx(
                                  "h-12 rounded-lg border-2 text-xs font-medium",
                                  isDark(theme)
                                    ? "border-slate-700 hover:border-sky-500 hover:bg-slate-800"
                                    : "border-slate-200 hover:border-sky-400 hover:bg-sky-50"
                                )}
                              >
                                {v === 'rect' && '長方形'}
                                {v === 'square' && '正方形'}
                                {v === 'round' && '円形'}
                                {v === 'torn' && '破れ'}
                                {v === 'fold' && '折り'}
                                {v === 'cloud' && '雲形'}
                                {v === 'tab' && 'タブ'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 画像追加 */}
                        <button
                          onClick={addImage}
                          className={cx(
                            "w-full py-3 rounded-xl border-2 border-dashed font-medium flex items-center justify-center gap-2",
                            isDark(theme)
                              ? "border-slate-700 hover:border-sky-500 hover:bg-slate-800 text-slate-300"
                              : "border-slate-300 hover:border-sky-400 hover:bg-sky-50 text-slate-700"
                          )}
                        >
                          <Icon.Plus className="w-5 h-5" />
                          画像をアップロード
                        </button>
                      </>
                    ) : (
                      <>
                        {/* ステップ2: 色選択 */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className={cx("text-sm font-semibold", isDark(theme) ? "text-slate-300" : "text-slate-700")}>
                              ステップ2: 色を選択
                            </div>
                            <button
                              onClick={() => setSelectedVariant(null)}
                              className={cx(
                                "text-xs px-2 py-1 rounded border",
                                isDark(theme) ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"
                              )}
                            >
                              戻る
                            </button>
                          </div>
                          <div className="grid grid-cols-5 gap-2">
                            {PALETTE.map(c => (
                              <button
                                key={c}
                                onClick={() => {
                                  addSticky(selectedVariant, c);
                                  setSelectedVariant(null);
                                }}
                                className="w-12 h-12 rounded-lg border-2 border-slate-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: c }}
                                aria-label={`色: ${c}`}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowAddMenu(!showAddMenu);
                    if (showAddMenu) setSelectedVariant(null);
                  }}
                  className={cx(
                    "w-12 h-12 rounded-full shadow-xl border flex items-center justify-center transition-all",
                    showAddMenu && "rotate-45",
                    isPop(theme)
                      ? "bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 border-4 border-white hover:shadow-2xl hover:-translate-y-1 hover:scale-110 text-white"
                      : isDark(theme)
                      ? "bg-sky-700 border-sky-600 text-white"
                      : "bg-sky-500 hover:bg-sky-600 border-sky-500 text-white"
                  )}
                  aria-label="Add"
                >
                  <Icon.Plus className="w-6 h-6" />
                </button>
              </div>

              {/* Hint */}
              <div
                className={cx(
                  "absolute left-4 bottom-4 text-xs border rounded-lg px-2 py-1 pointer-events-none",
                  isPop(theme)
                    ? "text-slate-700 bg-white/80"
                    : isDark(theme)
                    ? "text-slate-300 bg-slate-800/80 border-slate-700"
                    : "text-slate-600 bg-white/70"
                )}
              >
                <div>付箋: ドラッグで移動 | ダブルクリックで編集 | +ボタンで追加</div>
                <div className="mt-1">ズーム: マウスホイール | パン: Shift+ドラッグ または 中クリック+ドラッグ</div>
              </div>
            </div>
          </div>

          {/* Journal */}
          {!fullScreen && (
            <div style={{ flex: '2 0 0', minHeight: 0, display: 'flex' }}>
              <Journal theme={theme} />
            </div>
          )}
        </div>

        {/* Status */}
        <footer
          className={cx(
            "px-4 py-2 text-xs flex items-center gap-2",
            isDark(theme) ? "text-slate-400" : "text-slate-500"
          )}
        >
          <span
            className={cx(
              "px-2 py-1 rounded-xl border",
              isDark(theme) ? "bg-slate-900 border-slate-700" : "bg-white"
            )}
          >
            Status: Ready
          </span>
          <span
            className={cx(
              "px-2 py-1 rounded-xl border",
              isDark(theme) ? "bg-slate-900 border-slate-700" : "bg-white"
            )}
          >
            Items: {items.length}
          </span>
          <span
            className={cx(
              "px-2 py-1 rounded-xl border",
              isDark(theme) ? "bg-slate-900 border-slate-700" : "bg-white"
            )}
          >
            Zoom: {Math.round(zoom * 100)}%
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
