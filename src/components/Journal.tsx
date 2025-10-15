import { useState, useRef, useEffect, useMemo } from "react";
import { cx, isDark, isPop } from "../utils/helpers";
import { Icon } from "./Icons";
import { load } from "@tauri-apps/plugin-store";

function keyForDate(d: Date) {
  const z = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

function defaultJournalHTML() {
  return `<p></p>`;
}

interface JournalProps {
  theme?: string;
}

export function Journal({ theme = 'classic' }: JournalProps) {
  const [date, setDate] = useState(() => new Date());
  const [store, setStore] = useState<{ [key: string]: string }>(() => ({}));
  const editorRef = useRef<HTMLDivElement>(null);

  const shift = (d: number) => {
    const n = new Date(date);
    n.setDate(n.getDate() + d);
    setDate(n);
  };

  const dkey = keyForDate(date);
  const dstr = useMemo(
    () =>
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        weekday: "short"
      }),
    [date]
  );

  // Load journal data from Tauri Store on mount
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const tauriStore = await load("journal.json");
        const savedJournals = await tauriStore.get<{ [key: string]: string }>("journals");
        if (savedJournals) {
          setStore(savedJournals);
        }
      } catch (error) {
        console.error("Failed to load journals:", error);
      }
    };

    loadJournals();
  }, []);

  useEffect(() => {
    setStore(s => (dkey in s ? s : { ...s, [dkey]: defaultJournalHTML() }));
  }, [dkey]);

  useEffect(() => {
    const html = store[dkey] ?? defaultJournalHTML();
    if (editorRef.current && editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [dkey, store]);

  // Save journal data to Tauri Store whenever store changes
  useEffect(() => {
    const saveJournals = async () => {
      try {
        const tauriStore = await load("journal.json");
        await tauriStore.set("journals", store);
        await tauriStore.save();
      } catch (error) {
        console.error("Failed to save journals:", error);
      }
    };

    // Only save if there's actual data
    if (Object.keys(store).length > 0) {
      saveJournals();
    }
  }, [store]);

  const onInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    setStore(s => ({ ...s, [dkey]: html }));
  };

  const paperBG = isPop(theme)
    ? {
        backgroundImage:
          "repeating-linear-gradient(#e2e8f0 0 1px, transparent 1px 28px)",
        backgroundSize: "auto 28px"
      }
    : isDark(theme)
    ? {
        backgroundImage:
          "repeating-linear-gradient(#334155 0 1px, transparent 1px 28px)",
        backgroundSize: "auto 28px"
      }
    : {
        backgroundImage:
          "repeating-linear-gradient(#cbd5e1 0 1px, transparent 1px 28px)",
        backgroundSize: "auto 28px"
      };

  return (
    <div
      className={cx(
        "w-full h-full rounded-3xl overflow-hidden flex border",
        isDark(theme) ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-white"
      )}
    >
      <div style={{ flex: '8 0 0' }} className="flex flex-col">
        <div
          className={cx(
            "flex items-center gap-3 p-3 border-b",
            isPop(theme)
              ? "bg-pink-50/60 border-pink-100"
              : isDark(theme)
              ? "bg-slate-900 border-slate-700"
              : "bg-slate-50/60 border-slate-200"
          )}
        >
          <button
            className={cx(
              "p-1 rounded border",
              isDark(theme)
                ? "hover:bg-slate-800 border-slate-700"
                : "hover:bg-white border"
            )}
            onClick={() => shift(-1)}
          >
            <Icon.ChevronL className="w-4 h-4" />
          </button>
          <div
            className={cx(
              "px-2 py-1 rounded-xl border font-medium",
              isDark(theme) ? "bg-slate-800 border-slate-700" : "bg-white border"
            )}
          >
            {dstr}
          </div>
          <button
            className={cx(
              "p-1 rounded border",
              isDark(theme)
                ? "hover:bg-slate-800 border-slate-700"
                : "hover:bg-white border"
            )}
            onClick={() => shift(1)}
          >
            <Icon.ChevronR className="w-4 h-4" />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              className={cx(
                "text-sm px-2 py-1 rounded-xl border",
                isDark(theme)
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-white hover:bg-slate-50"
              )}
              onClick={() => setDate(new Date())}
            >
              Today
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 flex flex-col">
          <div
            ref={editorRef}
            onInput={onInput}
            contentEditable
            suppressContentEditableWarning
            className={cx(
              "prose max-w-none p-4 rounded-2xl border focus:outline-none focus:ring-2 flex-1",
              isPop(theme)
                ? "prose-slate bg-white"
                : isDark(theme)
                ? "prose-invert bg-slate-800 border-slate-700 focus:ring-sky-700"
                : "prose-slate bg-slate-50/60 focus:ring-slate-300"
            )}
            style={paperBG}
          ></div>
          <div
            className={cx(
              "mt-2 text-[11px]",
              isDark(theme) ? "text-slate-400" : "text-slate-500"
            )}
          >
            自動保存: {dkey}（日付ごとに別ノート）
          </div>
        </div>
      </div>
      <aside
        style={{ flex: '2 0 0' }}
        className={cx(
          "border-l p-3 hidden xl:block overflow-y-auto flex flex-col",
          isPop(theme)
            ? "bg-sky-50/50 border-sky-100"
            : isDark(theme)
            ? "bg-slate-900 border-slate-700"
            : "bg-slate-50/50 border-slate-200"
        )}
      >
        <div className="font-semibold mb-2">今月</div>
        {/* 曜日ヘッダー */}
        <div className={cx(
          "grid grid-cols-7 gap-1 text-[10px] font-medium text-center",
          isDark(theme) ? "text-slate-400" : "text-slate-600"
        )}>
          <div className={isDark(theme) ? "text-pink-400" : "text-pink-600"}>日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div className={isDark(theme) ? "text-sky-400" : "text-sky-600"}>土</div>
        </div>
        {/* カレンダー */}
        <div className="mt-1 grid grid-cols-7 gap-0.5 text-[11px]">
          {(() => {
            const year = date.getFullYear();
            const month = date.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startDayOfWeek = firstDay.getDay(); // 0 (日) ~ 6 (土)

            const cells = [];

            // 前月の空白セル
            for (let i = 0; i < startDayOfWeek; i++) {
              cells.push(<div key={`empty-${i}`} className="aspect-square" />);
            }

            // 当月の日付
            for (let day = 1; day <= daysInMonth; day++) {
              const dd = new Date(year, month, day);
              const k = keyForDate(dd);
              const isSel = k === dkey;
              const dayOfWeek = dd.getDay();
              const isSaturday = dayOfWeek === 6;
              const isSunday = dayOfWeek === 0;

              cells.push(
                <button
                  key={day}
                  onClick={() => setDate(dd)}
                  className={cx(
                    "aspect-square rounded text-center flex items-center justify-center text-xs p-1",
                    isSel
                      ? isDark(theme)
                        ? "bg-slate-700 border border-sky-500 font-semibold"
                        : "bg-sky-100 border border-sky-400 font-semibold"
                      : isDark(theme)
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100",
                    // 土曜日の色分け
                    isSaturday && !isSel && (isDark(theme) ? "text-sky-400" : "text-sky-600"),
                    // 日曜日の色分け
                    isSunday && !isSel && (isDark(theme) ? "text-pink-400" : "text-pink-600")
                  )}
                >
                  {day}
                </button>
              );
            }

            return cells;
          })()}
        </div>
      </aside>
    </div>
  );
}
