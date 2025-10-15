# VisionBoard Diary

インタラクティブなビジョンボードと日記機能を組み合わせたデスクトップアプリケーション

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [ビルド](#ビルド)
- [プロジェクト構造](#プロジェクト構造)
- [データ永続化](#データ永続化)
- [今後のアップデート計画](#今後のアップデート計画)

## 概要

VisionBoard Diaryは、目標や夢を視覚化するビジョンボードと、日々の思考を記録する日記機能を統合したデスクトップアプリケーションです。直感的なドラッグ&ドロップインターフェースと3つのテーマオプションで、あなたの創造性を引き出します。

## 主な機能

### 🎨 ビジョンボード
- **ドラッグ&ドロップ付箋**: 自由に配置・移動できる付箋機能
- **8色カラーパレット**: yellow, pink, blue, green, purple, orange, red, gray
- **3種類のバリアント**: default, outlined, dashed
- **無限キャンバス**: パン&ズーム機能で広大なワークスペース
- **リアルタイム編集**: contentEditable APIによる即座のテキスト編集

### 📔 日記機能
- **日付別エントリー**: カレンダーで簡単に日付を選択
- **リッチテキスト編集**: HTML対応のエディター
- **罫線付き紙デザイン**: テーマに応じた美しい罫線表示
- **月次カレンダービュー**: サイドバーで月全体を俯瞰

### 🎭 テーマシステム
1. **Classic**: シンプルで落ち着いたデザイン
2. **Pop**: カラフルでポップな配色とアニメーション
3. **Dark**: 目に優しいダークモード

### 💾 データ永続化
- **自動保存**: 変更が即座にディスクに保存
- **完全復元**: アプリ再起動時に全データを復元
- **JSON形式**: 人間が読めるデータ形式

## 技術スタック

### フロントエンド
- **React 19.2.0**: UI フレームワーク
- **TypeScript**: 型安全な開発
- **Vite 5.4.20**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS

### バックエンド
- **Tauri 2.8.5**: デスクトップアプリフレームワーク
- **Rust**: バックエンドロジック
- **tauri-plugin-store 2.4.0**: データ永続化

### 状態管理
- **React Hooks**: useState, useEffect, useRef, useMemo
- **Zustand 5.0.8**: グローバル状態管理（将来的な拡張用）

## セットアップ

### 前提条件

- Node.js (v18以上)
- pnpm
- Rust (最新安定版)
- Visual Studio Build Tools (Windows)

### インストール手順

```bash
# リポジトリのクローン
git clone https://github.com/suzukinz/visionboard-diary.git
cd visionboard-diary

# 依存関係のインストール
pnpm install
```

### ⚠️ 重要：実行環境について

**Git Bashでは実行できません**。必ずPowerShellまたはCMDを使用してください。

## 開発

### 開発サーバーの起動

```powershell
# PowerShellで実行（推奨）
pnpm tauri dev
```

- ホットリロード有効
- DevToolsでデバッグ可能
- ネイティブウィンドウで起動

### TypeScriptコンパイル

```bash
pnpm exec tsc
```

## ビルド

### プロダクションビルド

```bash
pnpm tauri build
```

### 出力ファイル

ビルド成功後、以下のファイルが生成されます：

```
src-tauri/target/release/bundle/
├── msi/
│   └── visionboard-diary_0.1.0_x64_en-US.msi
└── nsis/
    └── visionboard-diary_0.1.0_x64-setup.exe
```

## プロジェクト構造

```
visionboard-diary/
├── src/                          # フロントエンドソースコード
│   ├── components/               # Reactコンポーネント
│   │   ├── Draggable.tsx        # ドラッグ機能コンポーネント
│   │   ├── Icons.tsx            # アイコンコンポーネント
│   │   ├── Journal.tsx          # 日記コンポーネント (データ永続化)
│   │   └── Sticky.tsx           # 付箋コンポーネント
│   ├── utils/                   # ユーティリティ関数
│   │   └── helpers.ts           # テーマ、カラー、クラス名ヘルパー
│   ├── App.tsx                  # メインアプリケーション (データ永続化)
│   ├── App.css                  # アプリケーションスタイル
│   ├── main.tsx                 # Reactエントリーポイント
│   └── index.css                # グローバルスタイル + Tailwind
├── src-tauri/                   # Tauriバックエンド
│   ├── src/
│   │   └── lib.rs               # Rustエントリーポイント (Store plugin登録)
│   ├── Cargo.toml               # Rust依存関係 (tauri-plugin-store)
│   ├── tauri.conf.json          # Tauri設定
│   └── icons/                   # アプリケーションアイコン
├── public/                      # 静的ファイル
├── package.json                 # npm依存関係 (@tauri-apps/plugin-store)
├── pnpm-lock.yaml              # pnpmロックファイル
├── tsconfig.json               # TypeScript設定
├── vite.config.ts              # Vite設定
└── tailwind.config.js          # Tailwind CSS設定
```

## データ永続化

### 保存されるデータ

#### 1. `visionboard.json` (ビジョンボードデータ)

```typescript
{
  "items": [
    {
      "id": "unique-id",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 200,
      "color": "yellow",
      "text": "My goal",
      "variant": "default"
    }
  ],
  "theme": "pop"
}
```

#### 2. `journal.json` (日記データ)

```typescript
{
  "journals": {
    "2025-10-15": "<p>Today's entry...</p>",
    "2025-10-14": "<p>Yesterday's entry...</p>"
  }
}
```

### データファイルの場所

Windows: `%APPDATA%\com.visionboard-diary.dev\`

### データ永続化の仕組み

```typescript
// App.tsx - ビジョンボードデータの保存
useEffect(() => {
  const saveItems = async () => {
    await store.set("items", items);
    await store.save();
  };
  saveItems();
}, [items]);

// Journal.tsx - 日記データの保存
useEffect(() => {
  const saveJournals = async () => {
    await tauriStore.set("journals", store);
    await tauriStore.save();
  };
  saveJournals();
}, [store]);
```

## 今後のアップデート計画

### 優先度: 高 🔥

#### 🖼️ 画像サポート
**実装箇所**: `src/components/Sticky.tsx`, `src/App.tsx`

**変更内容**:
```typescript
// src/App.tsx - インターフェース拡張
interface StickyItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  variant: string;
  image?: string;  // 追加: 画像URL or Base64
  imagePosition?: 'top' | 'background';  // 追加: 画像配置
}

// src/components/Sticky.tsx - 画像アップロード機能
const handleImageUpload = async (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target?.result as string;
    onUpdate({ ...item, image: base64 });
  };
  reader.readAsDataURL(file);
};
```

**必要な依存関係**:
```bash
pnpm add @tauri-apps/plugin-dialog @tauri-apps/plugin-fs
```

**実装手順**:
1. `StickyItem`インターフェースに`image`と`imagePosition`を追加
2. `Sticky.tsx`に画像アップロードボタンを追加
3. Tauri Dialogプラグインでファイル選択
4. Base64変換して保存
5. 画像表示ロジックを実装

---

#### 📤 エクスポート機能
**実装箇所**: `src/App.tsx`, `src/components/Journal.tsx`

**変更内容**:
```typescript
// src/utils/export.ts - 新規ファイル
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

export const exportToPDF = async (boardRef: HTMLElement) => {
  const doc = new jsPDF('landscape', 'px', 'a4');
  const canvas = await html2canvas(boardRef);
  const imgData = canvas.toDataURL('image/png');
  doc.addImage(imgData, 'PNG', 0, 0, 595, 842);

  const path = await save({
    defaultPath: 'visionboard.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (path) {
    const blob = doc.output('blob');
    const buffer = await blob.arrayBuffer();
    await writeFile(path, new Uint8Array(buffer));
  }
};

export const exportToImage = async (boardRef: HTMLElement) => {
  const canvas = await html2canvas(boardRef);
  const dataUrl = canvas.toDataURL('image/png');

  const path = await save({
    defaultPath: 'visionboard.png',
    filters: [{ name: 'PNG', extensions: ['png'] }]
  });

  if (path) {
    const base64Data = dataUrl.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    await writeFile(path, buffer);
  }
};
```

**必要な依存関係**:
```bash
pnpm add jspdf html2canvas
pnpm add @tauri-apps/plugin-dialog @tauri-apps/plugin-fs
```

**実装手順**:
1. エクスポート用ユーティリティファイル作成
2. App.tsxにエクスポートボタン追加
3. PDF/PNG選択モーダル実装
4. Tauri FSプラグインでファイル保存

---

#### 🔍 検索機能
**実装箇所**: `src/components/Journal.tsx`

**変更内容**:
```typescript
// src/components/Journal.tsx - 検索機能追加
export function Journal({ theme = 'classic' }: JournalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const searchJournals = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = Object.entries(store)
      .filter(([_, content]) =>
        content.toLowerCase().includes(query.toLowerCase())
      )
      .map(([date, _]) => date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    setSearchResults(results);
  };

  return (
    <div className="...">
      {/* 検索バー */}
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="日記を検索..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            searchJournals(e.target.value);
          }}
          className="w-full px-3 py-2 rounded-xl border"
        />
      </div>

      {/* 検索結果リスト */}
      {searchResults.length > 0 && (
        <div className="p-3">
          <h3>検索結果 ({searchResults.length}件)</h3>
          {searchResults.map(date => (
            <button
              key={date}
              onClick={() => setDate(new Date(date))}
              className="block w-full text-left p-2 hover:bg-slate-100 rounded"
            >
              {date}
            </button>
          ))}
        </div>
      )}

      {/* 既存のコンテンツ */}
    </div>
  );
}
```

**実装手順**:
1. 検索バーUIの追加（ヘッダー部分）
2. 検索ロジック実装（`searchJournals`関数）
3. 検索結果リストの表示
4. 結果クリックで該当日付にジャンプ
5. ハイライト機能（オプション）

---

### 優先度: 中 ⚡

#### 🏷️ タグ機能
**実装箇所**: `src/App.tsx`, `src/components/Sticky.tsx`

**変更内容**:
```typescript
// src/App.tsx - インターフェース拡張
interface StickyItem {
  // ... 既存フィールド
  tags?: string[];  // 追加
}

// src/App.tsx - タグフィルタリング
const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [allTags, setAllTags] = useState<string[]>([]);

const filteredItems = useMemo(() => {
  if (selectedTags.length === 0) return items;
  return items.filter(item =>
    item.tags?.some(tag => selectedTags.includes(tag))
  );
}, [items, selectedTags]);

// 全タグのリスト更新
useEffect(() => {
  const tags = new Set<string>();
  items.forEach(item => item.tags?.forEach(tag => tags.add(tag)));
  setAllTags(Array.from(tags).sort());
}, [items]);

// src/components/Sticky.tsx - タグ編集UI
const [tagInput, setTagInput] = useState('');

const addTag = (tag: string) => {
  if (!tag.trim() || item.tags?.includes(tag)) return;
  const newTags = [...(item.tags || []), tag.trim()];
  onUpdate({ ...item, tags: newTags });
  setTagInput('');
};

const removeTag = (tagToRemove: string) => {
  const newTags = item.tags?.filter(tag => tag !== tagToRemove);
  onUpdate({ ...item, tags: newTags });
};
```

**実装手順**:
1. `StickyItem`に`tags`配列を追加
2. Sticky.tsxにタグ入力欄追加
3. タグ追加/削除UI実装
4. App.tsxにタグフィルターUI追加
5. フィルタリングロジック実装

---

#### 📊 統計ダッシュボード
**実装箇所**: 新規コンポーネント `src/components/Dashboard.tsx`

**新規ファイル**:
```typescript
// src/components/Dashboard.tsx
import { useMemo } from 'react';
import { cx, isDark, isPop } from '../utils/helpers';

interface DashboardProps {
  items: StickyItem[];
  journals: { [key: string]: string };
  theme: string;
}

export function Dashboard({ items, journals, theme }: DashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const entriesThisMonth = Object.keys(journals).filter(date => {
      const d = new Date(date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const totalWords = Object.values(journals).reduce((sum, content) => {
      const text = content.replace(/<[^>]*>/g, '');
      return sum + text.split(/\s+/).length;
    }, 0);

    return {
      totalEntries: Object.keys(journals).length,
      totalStickies: items.length,
      entriesThisMonth,
      totalWords,
      averageWordsPerEntry: Math.round(totalWords / Object.keys(journals).length) || 0,
    };
  }, [items, journals]);

  return (
    <div className={cx(
      "p-6 rounded-3xl",
      isDark(theme) ? "bg-slate-800" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold mb-6">📊 統計</h2>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="総日記数"
          value={stats.totalEntries}
          icon="📔"
          theme={theme}
        />
        <StatCard
          title="今月の日記"
          value={stats.entriesThisMonth}
          icon="📅"
          theme={theme}
        />
        <StatCard
          title="付箋数"
          value={stats.totalStickies}
          icon="📌"
          theme={theme}
        />
        <StatCard
          title="平均文字数"
          value={stats.averageWordsPerEntry}
          icon="✍️"
          theme={theme}
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  theme: string;
}

function StatCard({ title, value, icon, theme }: StatCardProps) {
  return (
    <div className={cx(
      "p-4 rounded-xl border",
      isDark(theme)
        ? "bg-slate-900 border-slate-700"
        : "bg-slate-50 border-slate-200"
    )}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
```

**App.tsx統合**:
```typescript
// src/App.tsx - Dashboardの追加
import { Dashboard } from './components/Dashboard';

const [showDashboard, setShowDashboard] = useState(false);

// UIに統計ボタン追加
<button onClick={() => setShowDashboard(!showDashboard)}>
  📊 統計
</button>

{showDashboard && (
  <Dashboard items={items} journals={store} theme={theme} />
)}
```

**実装手順**:
1. Dashboard.tsxコンポーネント作成
2. 統計計算ロジック実装
3. StatCardコンポーネント作成
4. App.tsxに統計ボタン追加
5. モーダル/サイドバーで表示

---

#### ☁️ クラウド同期
**実装箇所**: 新規モジュール `src/services/sync.ts`

**技術選択肢**:
- **Supabase** (推奨): オープンソース、PostgreSQL、認証、リアルタイム同期
- **Firebase**: リアルタイム同期、簡単なセットアップ
- **カスタムAPI**: 完全な制御

**Supabaseを使った実装例**:

```typescript
// src/services/sync.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export class SyncService {
  async uploadData(userId: string, data: any) {
    const { error } = await supabase
      .from('visionboards')
      .upsert({
        user_id: userId,
        data: data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  async downloadData(userId: string) {
    const { data, error } = await supabase
      .from('visionboards')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.data;
  }

  async syncConflictResolution(localData: any, remoteData: any) {
    // タイムスタンプベースの競合解決
    if (localData.updated_at > remoteData.updated_at) {
      return localData;
    }
    return remoteData;
  }

  setupRealtimeSync(userId: string, onUpdate: (data: any) => void) {
    const subscription = supabase
      .channel('visionboard_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'visionboards',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        onUpdate(payload.new.data);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }
}
```

**必要な依存関係**:
```bash
pnpm add @supabase/supabase-js
```

**実装手順**:
1. Supabaseプロジェクト作成
2. データベーステーブル設計
3. SyncServiceクラス実装
4. 認証機能の追加
5. 手動/自動同期オプション
6. 競合解決UI

---

### 優先度: 低 💡

#### 🌐 多言語対応
**実装箇所**: 新規ディレクトリ `src/i18n/`

**ファイル構成**:
```
src/
├── i18n/
│   ├── index.ts              # i18n初期化
│   └── locales/
│       ├── en.json           # 英語
│       ├── ja.json           # 日本語
│       └── zh.json           # 中国語
```

**実装内容**:
```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: 'ja',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

// src/i18n/locales/ja.json
{
  "app": {
    "title": "VisionBoard Diary",
    "board": "ボード",
    "journal": "日記"
  },
  "sticky": {
    "add": "付箋を追加",
    "delete": "削除",
    "colors": "色"
  },
  "theme": {
    "classic": "クラシック",
    "pop": "ポップ",
    "dark": "ダーク"
  }
}

// src/i18n/locales/en.json
{
  "app": {
    "title": "VisionBoard Diary",
    "board": "Board",
    "journal": "Journal"
  },
  "sticky": {
    "add": "Add Sticky",
    "delete": "Delete",
    "colors": "Colors"
  },
  "theme": {
    "classic": "Classic",
    "pop": "Pop",
    "dark": "Dark"
  }
}
```

**使用例**:
```typescript
// src/App.tsx
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
      <button onClick={() => i18n.changeLanguage('ja')}>
        日本語
      </button>
    </div>
  );
}
```

**必要な依存関係**:
```bash
pnpm add i18next react-i18next
```

---

#### 🎨 カスタムテーマビルダー
**実装箇所**: 新規コンポーネント `src/components/ThemeBuilder.tsx`

**実装内容**:
```typescript
// src/components/ThemeBuilder.tsx
import { useState } from 'react';

interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  gradients: {
    board: string;
    header: string;
  };
}

export function ThemeBuilder({ onSave }: { onSave: (theme: CustomTheme) => void }) {
  const [theme, setTheme] = useState<CustomTheme>({
    name: 'My Theme',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#FFFFFF',
      text: '#1F2937',
      accent: '#F59E0B',
    },
    gradients: {
      board: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      header: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    },
  });

  const updateColor = (key: keyof CustomTheme['colors'], value: string) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  };

  return (
    <div className="p-6 bg-white rounded-3xl">
      <h2 className="text-2xl font-bold mb-6">🎨 カスタムテーマビルダー</h2>

      {/* テーマ名 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">テーマ名</label>
        <input
          type="text"
          value={theme.name}
          onChange={(e) => setTheme({ ...theme, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-xl"
        />
      </div>

      {/* カラーピッカー */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.entries(theme.colors).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2 capitalize">
              {key}
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => updateColor(key as keyof CustomTheme['colors'], e.target.value)}
                className="w-16 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateColor(key as keyof CustomTheme['colors'], e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* プレビュー */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{
          background: theme.gradients.board,
          color: theme.colors.text,
        }}
      >
        <h3 className="text-lg font-bold mb-2">プレビュー</h3>
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: theme.colors.primary }}
        >
          <p style={{ color: theme.colors.background }}>サンプルテキスト</p>
        </div>
      </div>

      {/* 保存ボタン */}
      <button
        onClick={() => onSave(theme)}
        className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600"
      >
        テーマを保存
      </button>
    </div>
  );
}
```

**App.tsx統合**:
```typescript
// src/App.tsx
const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

const handleSaveTheme = (theme: CustomTheme) => {
  setCustomThemes([...customThemes, theme]);
  // Store APIで永続化
  store.set('customThemes', [...customThemes, theme]);
};
```

---

#### 🔔 リマインダー機能
**実装箇所**: 新規モジュール `src/services/notifications.ts`

**実装内容**:
```typescript
// src/services/notifications.ts
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

export class NotificationService {
  async initialize() {
    let permission = await isPermissionGranted();
    if (!permission) {
      permission = await requestPermission() === 'granted';
    }
    return permission;
  }

  async scheduleReminder(time: Date, message: string) {
    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(async () => {
        await sendNotification({
          title: 'VisionBoard Diary',
          body: message,
          icon: 'icons/icon.png',
        });
      }, delay);
    }
  }

  async sendDailyReminder() {
    const permission = await this.initialize();
    if (!permission) return;

    const now = new Date();
    const reminder = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20, // 20:00
      0,
      0
    );

    if (reminder < now) {
      reminder.setDate(reminder.getDate() + 1);
    }

    this.scheduleReminder(reminder, '今日の日記を書きましょう！');
  }
}

// src/components/Settings.tsx
export function Settings() {
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');

  const notificationService = new NotificationService();

  useEffect(() => {
    if (reminderEnabled) {
      notificationService.sendDailyReminder();
    }
  }, [reminderEnabled]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={reminderEnabled}
          onChange={(e) => setReminderEnabled(e.target.checked)}
        />
        日次リマインダーを有効にする
      </label>

      <input
        type="time"
        value={reminderTime}
        onChange={(e) => setReminderTime(e.target.value)}
        disabled={!reminderEnabled}
      />
    </div>
  );
}
```

**必要な依存関係**:
```bash
pnpm add @tauri-apps/plugin-notification
```

**Cargo.toml設定**:
```toml
[dependencies]
tauri-plugin-notification = "2"
```

**lib.rs設定**:
```rust
.plugin(tauri_plugin_notification::init())
```

---

## 開発ガイドライン

### コーディング規約

1. **TypeScript**: すべての新規コードに型定義を追加
2. **コンポーネント**: 単一責任の原則に従う
3. **命名規則**:
   - コンポーネント: PascalCase (`Dashboard.tsx`)
   - 関数/変数: camelCase (`handleClick`)
   - 定数: UPPER_SNAKE_CASE (`PALETTE`)
4. **CSS**: Tailwind優先、カスタムCSSは最小限に
5. **コメント**: 複雑なロジックには日本語コメントを追加

### Git ワークフロー

```bash
# 新機能開発
git checkout -b feature/image-upload
# 開発作業...
git add .
git commit -m "Add image upload functionality to sticky notes"
git push origin feature/image-upload

# バグ修正
git checkout -b fix/journal-save-issue
# 修正作業...
git commit -m "Fix journal auto-save timing issue"
git push origin fix/journal-save-issue
```

### コミットメッセージ形式

```
<type>: <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: ビルド、設定変更

**例**:
```
feat: Add image upload to sticky notes

- Add file picker using Tauri dialog plugin
- Convert images to Base64 for storage
- Update StickyItem interface with image field
- Add image display in Sticky component

Closes #15
```

## トラブルシューティング

### ビルドエラー

**問題**: TypeScriptコンパイルエラー
```bash
pnpm exec tsc --noEmit
```

**問題**: Tauriビルド失敗
```bash
# Rustツールチェーンの更新
rustup update stable

# キャッシュクリア
cargo clean
```

### データが保存されない

1. **アプリデータフォルダの確認**:
   - Windows: `%APPDATA%\com.visionboard-diary.dev\`
   - ファイルの存在確認: `visionboard.json`, `journal.json`

2. **コンソールエラーの確認**:
   - DevToolsを開いて確認 (Ctrl+Shift+I)
   - "Failed to save" エラーを探す

3. **ストアファイルの権限確認**:
   - フォルダの読み取り/書き込み権限を確認

### パフォーマンス問題

- **付箋の数を制限**: 100個以下を推奨
- **画像サイズの最適化**: 1MB以下を推奨（今後実装時）
- **DevToolsのPerformanceタブで分析**

### Git Bashで実行できない

**症状**: `Segmentation fault (core dumped)`

**解決策**: PowerShellまたはCMDを使用
```powershell
# PowerShell（推奨）
cd "C:\Users\udon1\OneDrive\デスクトップ\VsionDiary\visionboard-diary"
pnpm tauri dev
```

## ライセンス

MIT License

## 貢献

プルリクエスト歓迎！大きな変更の場合は、まずissueを開いて議論してください。

### 貢献の手順

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 作者

- GitHub: [@suzukinz](https://github.com/suzukinz)
- Repository: [visionboard-diary](https://github.com/suzukinz/visionboard-diary)

---

🤖 Built with [Claude Code](https://claude.com/claude-code)
