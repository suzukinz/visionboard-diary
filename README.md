# VisionBoard Diary

ビジョンボードと日記を統合したデスクトップアプリケーション

## 🚀 実行方法

### 重要：Claude Code (Git Bash) では実行できません

このプロジェクトはPowerShellまたはCMDで実行してください。

### PowerShellでの実行（推奨）

```powershell
# 1. PowerShellを開く（Win + X → Windows PowerShell）

# 2. プロジェクトディレクトリに移動
cd "C:\Users\udon1\OneDrive\デスクトップ\VsionDiary\visionboard-diary"

# 3. 依存関係をインストール
pnpm install

# 4. 開発サーバーを起動
pnpm run dev
```

ブラウザで http://localhost:5173 が自動的に開きます。

### Tauriアプリとして実行

```powershell
pnpm tauri dev
```

## ✨ 実装済み機能

### コンポーネント

- **Icons** - アイコンセット
- **Draggable** - ドラッグ＆ドロップ機能
- **Sticky** - 7種類の付箋（rect, square, round, torn, fold, tab, cloud）
- **ImageCard** - 画像カード（クロップ機能付き）
- **Journal** - 日付ごとのジャーナル
- **SplitPane** - リサイズ可能な分割ペイン

### 機能

- ✅ テーマ切り替え（Classic / Pop / Dark）
- ✅ 付箋の追加・移動・編集
- ✅ 付箋の直接編集（ダブルクリック）
- ✅ ドラッグ＆ドロップ
- ✅ 日付ごとのジャーナル保存
- ✅ カレンダーナビゲーション

## 📁 プロジェクト構成

```
visionboard-diary/
├── src/
│   ├── components/
│   │   ├── Draggable.tsx
│   │   ├── Icons.tsx
│   │   ├── ImageCard.tsx
│   │   ├── Journal.tsx
│   │   ├── SplitPane.tsx
│   │   └── Sticky.tsx
│   ├── utils/
│   │   ├── helpers.ts
│   │   └── hooks.ts
│   ├── App.tsx
│   └── App.css
├── tailwind.config.js
└── package.json
```

## 🛠️ 技術スタック

- **フレームワーク**: Tauri (Rust + WebView)
- **UI**: React + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: TailwindCSS
- **状態管理**: Zustand (追加予定)
- **パッケージマネージャー**: pnpm

## 📝 次の実装予定

- [ ] Board完全実装（回転、リサイズ、ページング）
- [ ] ローカルJSON保存機能
- [ ] エクスポート/インポート
- [ ] フルスクリーンモード
- [ ] キーボードショートカット
- [ ] ステッカー機能

## ⚠️ トラブルシューティング

### Git Bashでエラーが出る

Git Bash環境ではNode.js/pnpmがSegmentation faultで実行できません。
必ずPowerShellまたはCMDを使用してください。

### pnpmが見つからない

```powershell
npm install -g pnpm
```

### ポート5173が使用中

```powershell
# 別のポートで起動
pnpm run dev -- --port 3000
```

## 📄 ライセンス

MIT
