# VisionBoard Diary - 開発ガイド

将来のアップデートと保守のための包括的な開発ドキュメント

## 📚 目次

- [アーキテクチャ概要](#アーキテクチャ概要)
- [主要コンポーネント詳細](#主要コンポーネント詳細)
- [状態管理](#状態管理)
- [データフロー](#データフロー)
- [スタイリング戦略](#スタイリング戦略)
- [パフォーマンス最適化](#パフォーマンス最適化)
- [アップデート時の注意点](#アップデート時の注意点)

---

## アーキテクチャ概要

### レイヤー構造

```
┌─────────────────────────────────────┐
│         UI Components               │  ← React コンポーネント
├─────────────────────────────────────┤
│      State Management (Hooks)       │  ← useState, useEffect
├─────────────────────────────────────┤
│    Data Persistence (Tauri Store)   │  ← JSONファイル保存
├─────────────────────────────────────┤
│       Tauri Runtime (Rust)          │  ← ネイティブAPI
└─────────────────────────────────────┘
```

### フォルダ構成の原則

- **components/**: 再利用可能なUIコンポーネント
- **utils/**: ユーティリティ関数、ヘルパー
- **services/**: データ永続化、外部API連携（今後）
- **types/**: TypeScript型定義（今後）

---

## 主要コンポーネント詳細

### 1. App.tsx（メインコンポーネント）

**責任**:
- アプリケーション全体の状態管理
- ビジョンボードのレイアウト制御
- テーマ管理
- データ永続化の調整

**主要な状態**:
```typescript
interface AppState {
  theme: 'classic' | 'pop' | 'dark';
  items: StickyItem[];
  selected: string[];
  draggingId: string | null;
  offset: { x: number; y: number };
  isPanning: boolean;
  panStart: { x: number; y: number };
}
```

**重要なフック**:
- `useEffect` (行38-57): データロード（マウント時）
- `useEffect` (行56-69): items自動保存
- `useEffect` (行72-83): theme自動保存

**変更時の注意**:
- `StickyItem`インターフェースを変更する場合、`visionboard.json`のマイグレーションが必要
- 新しいグローバル状態を追加する場合、永続化ロジックも追加

---

### 2. Journal.tsx（日記コンポーネント）

**責任**:
- 日付ごとの日記エントリー管理
- カレンダーナビゲーション
- リッチテキストエディター

**主要な状態**:
```typescript
interface JournalState {
  date: Date;                          // 現在表示中の日付
  store: { [key: string]: string };    // 日付キー → HTMLコンテンツ
}
```

**重要なフック**:
- `useEffect` (行43-57): ジャーナルデータロード（マウント時）
- `useEffect` (行59-61): 日付変更時の初期化
- `useEffect` (行63-68): エディター内容の復元
- `useEffect` (行70-85): ジャーナルデータ自動保存

**変更時の注意**:
- `contentEditable`を使用しているため、XSS対策が必要
- HTML形式で保存しているため、サニタイズ処理の追加を検討

---

### 3. Sticky.tsx（付箋コンポーネント）

**責任**:
- 個別付箋のレンダリング
- テキスト編集
- 視覚的スタイリング

**Props**:
```typescript
interface StickyProps {
  item: StickyItem;
  selected: boolean;
  onUpdate: (item: StickyItem) => void;
  onDelete: () => void;
  theme: string;
}
```

**特徴**:
- `contentEditable`による直接編集
- テーマごとのスタイル切り替え
- ホバーアニメーション（Popテーマ）

**変更時の注意**:
- 新しいバリアントを追加する場合、条件分岐が複雑化するため、バリアントマップの導入を検討
- 画像サポート追加時、`item.image`の表示ロジックを追加

---

### 4. Draggable.tsx（ドラッグ機能コンポーネント）

**責任**:
- ドラッグ&ドロップ機能の提供
- ポインターイベントの処理

**Props**:
```typescript
interface DraggableProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onDragStart?: () => void;
  onDrag?: (id: string, x: number, y: number) => void;
  onDragEnd?: () => void;
  children: React.ReactNode;
}
```

**イベントフロー**:
```
onPointerDown → onPointerMove → onPointerUp
     ↓               ↓               ↓
onDragStart  →   onDrag    →   onDragEnd
```

**変更時の注意**:
- タッチデバイス対応時、`touch-action: none`が重要
- リサイズ機能追加時、ハンドル検出ロジックを追加

---

## 状態管理

### 現在の状態管理戦略

**ローカル状態 (useState)**:
- コンポーネント固有の状態
- 一時的なUI状態（ホバー、フォーカスなど）

**Props Drilling**:
- 親から子へのデータ伝達
- コールバック関数による状態更新

**データ永続化 (Tauri Store)**:
- アプリケーション状態の永続化
- JSONファイルへの自動保存

### 将来の拡張（Zustandの活用）

**推奨される状態管理構造**:

```typescript
// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  // State
  items: StickyItem[];
  theme: 'classic' | 'pop' | 'dark';
  journals: { [key: string]: string };

  // Actions
  addItem: (item: StickyItem) => void;
  updateItem: (id: string, updates: Partial<StickyItem>) => void;
  deleteItem: (id: string) => void;
  setTheme: (theme: 'classic' | 'pop' | 'dark') => void;
  setJournal: (date: string, content: string) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      items: [],
      theme: 'classic',
      journals: {},

      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),

      updateItem: (id, updates) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      })),

      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      setTheme: (theme) => set({ theme }),

      setJournal: (date, content) => set((state) => ({
        journals: { ...state.journals, [date]: content }
      })),
    }),
    {
      name: 'visionboard-storage',
    }
  )
);
```

**使用例**:
```typescript
// App.tsx
import { useStore } from './store/useStore';

function App() {
  const items = useStore(state => state.items);
  const theme = useStore(state => state.theme);
  const addItem = useStore(state => state.addItem);
  const setTheme = useStore(state => state.setTheme);

  // ...
}
```

**メリット**:
- Props drillingの削減
- コード可読性の向上
- パフォーマンス最適化（セレクター）
- デバッグツールの利用

---

## データフロー

### 付箋の追加フロー

```
User Click "Add Sticky"
        ↓
generateId() → newItem
        ↓
setItems([...items, newItem])
        ↓
useEffect (items dependency)
        ↓
store.set("items", items)
        ↓
store.save()
        ↓
visionboard.json updated
```

### 日記の保存フロー

```
User types in editor
        ↓
onInput event
        ↓
setStore({ ...store, [dkey]: html })
        ↓
useEffect (store dependency)
        ↓
tauriStore.set("journals", store)
        ↓
tauriStore.save()
        ↓
journal.json updated
```

### テーマ変更フロー

```
User clicks theme button
        ↓
setTheme(newTheme)
        ↓
useEffect (theme dependency)
        ↓
store.set("theme", theme)
        ↓
store.save()
        ↓
CSS classes update (via cx utility)
        ↓
UI re-renders with new theme
```

---

## スタイリング戦略

### Tailwind CSS活用

**設定ファイル**: `tailwind.config.js`

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // カスタムカラー、フォント、スペーシングなど
    },
  },
  plugins: [
    require('@tailwindcss/typography'),  // prose クラス
  ],
};
```

### テーマシステム

**ユーティリティ関数**: `src/utils/helpers.ts`

```typescript
export const isDark = (theme: string) => theme === 'dark';
export const isPop = (theme: string) => theme === 'pop';
export const isClassic = (theme: string) => theme === 'classic';

export const cx = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ');
```

**使用パターン**:
```typescript
className={cx(
  "base-classes",
  isPop(theme) && "pop-specific-classes",
  isDark(theme) && "dark-specific-classes",
  isClassic(theme) && "classic-specific-classes"
)}
```

### 新しいテーマ追加手順

1. **テーマ型に追加**:
```typescript
type Theme = 'classic' | 'pop' | 'dark' | 'newTheme';
```

2. **ヘルパー関数追加**:
```typescript
export const isNewTheme = (theme: string) => theme === 'newTheme';
```

3. **条件分岐に追加**:
```typescript
className={cx(
  "base",
  isNewTheme(theme) && "newTheme-classes"
)}
```

4. **App.tsxのボタン追加**:
```typescript
<button onClick={() => setTheme('newTheme')}>
  New Theme
</button>
```

---

## パフォーマンス最適化

### 現在の最適化

1. **useMemo**: 高コストな計算のメモ化
```typescript
const dstr = useMemo(
  () => date.toLocaleDateString(/* ... */),
  [date]
);
```

2. **useRef**: DOM参照の保持
```typescript
const editorRef = useRef<HTMLDivElement>(null);
```

3. **条件付きレンダリング**: 不要な要素の非表示
```typescript
{selected.length > 0 && <DeleteButton />}
```

### 将来の最適化案

#### 1. React.memo

**問題**: 親コンポーネントの再レンダリング時に子も再レンダリング

**解決策**:
```typescript
// src/components/Sticky.tsx
export const Sticky = React.memo(function Sticky({ item, selected, onUpdate, onDelete, theme }: StickyProps) {
  // ...
}, (prevProps, nextProps) => {
  // カスタム比較関数
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.theme === nextProps.theme
  );
});
```

#### 2. 仮想化（react-window）

**問題**: 大量の付箋（100+）でパフォーマンス低下

**解決策**:
```typescript
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={Math.floor(width / 220)}
  columnWidth={220}
  height={height}
  rowCount={Math.ceil(items.length / columnCount)}
  rowHeight={220}
  width={width}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = items[index];
    return item ? (
      <div style={style}>
        <Sticky item={item} {...props} />
      </div>
    ) : null;
  }}
</FixedSizeGrid>
```

#### 3. デバウンス（lodash）

**問題**: 入力時の頻繁な保存でパフォーマンス低下

**解決策**:
```typescript
import { debounce } from 'lodash';

const debouncedSave = useMemo(
  () => debounce((data) => {
    store.set("items", data);
    store.save();
  }, 500),
  []
);

useEffect(() => {
  debouncedSave(items);
}, [items]);
```

#### 4. Web Workers（将来）

**問題**: 大量データの処理でUIブロック

**解決策**:
```typescript
// src/workers/dataProcessor.worker.ts
self.addEventListener('message', (e) => {
  const { type, data } = e.data;

  if (type === 'PROCESS_ITEMS') {
    const processed = data.map(/* 重い処理 */);
    self.postMessage({ type: 'PROCESSED', data: processed });
  }
});

// App.tsx
const worker = new Worker(new URL('./workers/dataProcessor.worker.ts', import.meta.url));

worker.postMessage({ type: 'PROCESS_ITEMS', data: items });

worker.onmessage = (e) => {
  if (e.data.type === 'PROCESSED') {
    setProcessedItems(e.data.data);
  }
};
```

---

## アップデート時の注意点

### データマイグレーション

**インターフェース変更時のマイグレーション戦略**:

```typescript
// src/utils/migration.ts
interface Migration {
  version: number;
  migrate: (data: any) => any;
}

const migrations: Migration[] = [
  {
    version: 1,
    migrate: (data) => {
      // v0 → v1: image フィールドを追加
      return {
        ...data,
        items: data.items.map(item => ({
          ...item,
          image: item.image || null,
          imagePosition: item.imagePosition || 'top',
        })),
      };
    },
  },
  {
    version: 2,
    migrate: (data) => {
      // v1 → v2: tags フィールドを追加
      return {
        ...data,
        items: data.items.map(item => ({
          ...item,
          tags: item.tags || [],
        })),
      };
    },
  },
];

export async function migrateData(data: any, currentVersion: number, targetVersion: number) {
  let migratedData = data;

  for (let i = currentVersion; i < targetVersion; i++) {
    const migration = migrations.find(m => m.version === i + 1);
    if (migration) {
      migratedData = migration.migrate(migratedData);
    }
  }

  return migratedData;
}

// App.tsx - データロード時
useEffect(() => {
  const loadData = async () => {
    try {
      const savedData = await store.get("versionedData");
      const currentVersion = savedData?.version || 0;
      const targetVersion = 2;  // 最新バージョン

      if (currentVersion < targetVersion) {
        const migratedData = await migrateData(savedData, currentVersion, targetVersion);
        await store.set("versionedData", { ...migratedData, version: targetVersion });
        await store.save();
        setItems(migratedData.items);
      } else {
        setItems(savedData.items);
      }
    } catch (error) {
      console.error("Failed to migrate data:", error);
    }
  };

  loadData();
}, []);
```

### 依存関係の更新

**更新手順**:
```bash
# 依存関係の確認
pnpm outdated

# マイナーバージョン更新
pnpm update

# メジャーバージョン更新（慎重に）
pnpm add react@latest react-dom@latest

# TypeScript更新後、型エラーを修正
pnpm exec tsc --noEmit
```

### Tauri更新

**更新手順**:
```bash
# Tauriバージョン確認
pnpm tauri info

# Tauri CLI更新
pnpm add -D @tauri-apps/cli@latest

# Tauri API更新
pnpm add @tauri-apps/api@latest

# Rustクレート更新
cd src-tauri
cargo update
cd ..

# ビルドテスト
pnpm tauri build
```

### 破壊的変更への対応

**チェックリスト**:
- [ ] package.jsonのバージョン番号更新
- [ ] CHANGELOGの作成・更新
- [ ] データマイグレーションコードの追加
- [ ] TypeScript型定義の更新
- [ ] テストの更新（将来）
- [ ] README.mdの更新
- [ ] ユーザーへの通知（リリースノート）

---

## テストの追加（将来計画）

### テスト戦略

**ユニットテスト**: Vitest
```typescript
// src/utils/helpers.test.ts
import { describe, it, expect } from 'vitest';
import { isDark, isPop, cx } from './helpers';

describe('Theme helpers', () => {
  it('should detect dark theme', () => {
    expect(isDark('dark')).toBe(true);
    expect(isDark('pop')).toBe(false);
  });

  it('should detect pop theme', () => {
    expect(isPop('pop')).toBe(true);
    expect(isPop('classic')).toBe(false);
  });

  it('should combine classes correctly', () => {
    expect(cx('a', 'b', false && 'c', 'd')).toBe('a b d');
  });
});
```

**コンポーネントテスト**: React Testing Library
```typescript
// src/components/Sticky.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sticky } from './Sticky';

describe('Sticky Component', () => {
  const mockItem = {
    id: '1',
    x: 100,
    y: 100,
    width: 200,
    height: 200,
    color: 'yellow',
    text: 'Test Note',
    variant: 'default',
  };

  it('should render sticky note with text', () => {
    render(
      <Sticky
        item={mockItem}
        selected={false}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        theme="classic"
      />
    );

    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();

    render(
      <Sticky
        item={mockItem}
        selected={true}
        onUpdate={vi.fn()}
        onDelete={onDelete}
        theme="classic"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalled();
  });
});
```

**E2Eテスト**: Playwright（Tauriアプリ）
```typescript
// e2e/app.spec.ts
import { test, expect } from '@playwright/test';

test.describe('VisionBoard Diary E2E', () => {
  test('should add a new sticky note', async ({ page }) => {
    await page.goto('http://localhost:1420');

    await page.click('button:has-text("Add Sticky")');

    const sticky = page.locator('[data-testid="sticky-note"]').first();
    await expect(sticky).toBeVisible();
  });

  test('should save journal entry', async ({ page }) => {
    await page.goto('http://localhost:1420');

    await page.click('text=Journal');
    await page.fill('[contenteditable="true"]', 'Today was a good day');

    // 自動保存を待つ
    await page.waitForTimeout(1000);

    // ページをリロード
    await page.reload();

    await expect(page.locator('[contenteditable="true"]')).toContainText('Today was a good day');
  });
});
```

### テスト環境セットアップ

```bash
# テストフレームワークのインストール
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Playwright（E2E）
pnpm add -D @playwright/test
pnpm exec playwright install
```

**package.json**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## デバッグテクニック

### 開発者ツール活用

**React DevTools**:
- コンポーネント階層の確認
- Props/State の検査
- パフォーマンスプロファイリング

**Chrome DevTools**:
- ネットワークタブ: Tauri APIコールの監視
- Performanceタブ: レンダリングパフォーマンス分析
- Memoryタブ: メモリリーク検出

### Tauriデバッグ

**Rustログ出力**:
```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: &str) -> String {
    println!("Greet command called with: {}", name);  // ログ出力
    format!("Hello, {}!", name)
}
```

**フロントエンドログ**:
```typescript
// App.tsx
useEffect(() => {
  console.log('Items updated:', items);
}, [items]);
```

**ストアデータ確認**:
```typescript
// データ確認用ユーティリティ
const debugStore = async () => {
  const data = await store.get("items");
  console.log('Stored items:', data);
};
```

---

## リリースプロセス

### バージョン管理

**セマンティックバージョニング**: `MAJOR.MINOR.PATCH`

- **MAJOR**: 破壊的変更
- **MINOR**: 新機能追加（後方互換）
- **PATCH**: バグ修正

### リリース手順

1. **バージョン更新**:
```bash
# package.json
"version": "0.2.0"

# src-tauri/Cargo.toml
version = "0.2.0"

# src-tauri/tauri.conf.json
"version": "0.2.0"
```

2. **CHANGELOG作成**:
```markdown
# CHANGELOG.md

## [0.2.0] - 2025-01-XX

### Added
- 画像アップロード機能
- 検索機能

### Fixed
- 日記保存のタイミング問題

### Changed
- テーマシステムの改善
```

3. **ビルド**:
```bash
pnpm tauri build
```

4. **Git タグ**:
```bash
git add .
git commit -m "Release v0.2.0"
git tag v0.2.0
git push origin main --tags
```

5. **GitHub Release**:
- GitHubでリリースノート作成
- ビルド成果物（MSI/NSIS）を添付

---

## まとめ

このドキュメントは、VisionBoard Diaryの継続的な開発とメンテナンスを支援するために作成されました。

**重要なポイント**:
- データマイグレーションを慎重に計画する
- パフォーマンス最適化は測定後に実施
- テストを段階的に追加
- セマンティックバージョニングを遵守

将来のアップデートでは、このドキュメントも更新してください。

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
