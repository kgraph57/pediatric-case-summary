# 小児科症例要約作成支援 - デザインシステム

## デザイン原則

### 1. Clarity & Calm（明瞭さと落ち着き）
- 白を基調とした清潔感のあるデザイン
- 90%の余白（Air-space）で情報を整理
- 低彩度のアクセントカラーで視覚的な疲労を軽減

### 2. One Hierarchy（明確な階層）
- タイポグラフィと色のみで情報を整理
- 絵文字やアイコンの過剰使用を避ける
- 一貫性のあるスペーシングシステム

### 3. Fluid Motion（流動的な動き）
- 0.2-0.4秒のease-in-outトランジション
- スムーズなページ遷移
- インタラクティブなフィードバック

### 4. Accessible by Default（アクセシビリティ）
- WCAG 2.2 AA準拠
- 高コントラスト比（4.5:1以上）
- キーボードナビゲーション対応

## カラーパレット

### Light Mode
```css
/* Surface */
--color-surface-primary: #FFFFFF;
--color-surface-secondary: #F8F9FA;
--color-surface-tertiary: #E9ECEF;

/* Text */
--color-text-primary: #212529;
--color-text-secondary: #6C757D;
--color-text-tertiary: #ADB5BD;

/* Accent */
--color-accent-primary: #0A84FF;    /* Medical Blue */
--color-accent-secondary: #5AC8FA;  /* Light Blue */
--color-accent-hover: #0066CC;

/* Semantic */
--color-success: #30D158;
--color-warning: #FFD60A;
--color-danger: #FF453A;
--color-info: #64D2FF;

/* Border */
--color-border-light: #E9ECEF;
--color-border-medium: #DEE2E6;
--color-border-dark: #CED4DA;
```

### Dark Mode
```css
/* Surface */
--color-surface-primary: #1C1C1E;
--color-surface-secondary: #2C2C2E;
--color-surface-tertiary: #3A3A3C;

/* Text */
--color-text-primary: #FFFFFF;
--color-text-secondary: #EBEBF5;
--color-text-tertiary: #98989D;

/* Accent - 同じ値を維持 */
```

## タイポグラフィ

### フォントファミリー
```css
--font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", 
                       "Noto Sans JP", "Hiragino Sans", sans-serif;
--font-family-mono: "SF Mono", "Consolas", "Monaco", monospace;
```

### フォントサイズ
```css
--font-size-display: 2rem;      /* 32px - ページタイトル */
--font-size-h1: 1.75rem;        /* 28px - セクションタイトル */
--font-size-h2: 1.5rem;         /* 24px - サブセクション */
--font-size-h3: 1.25rem;        /* 20px - カードタイトル */
--font-size-body: 1rem;         /* 16px - 本文 */
--font-size-small: 0.875rem;    /* 14px - キャプション */
--font-size-tiny: 0.75rem;      /* 12px - ラベル */
```

### フォントウェイト
```css
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 行の高さ
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

## スペーシング（8pxグリッド）

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

## コンポーネント

### ボーダー半径
```css
--radius-sm: 0.375rem;   /* 6px - 小要素 */
--radius-md: 0.5rem;     /* 8px - ボタン、入力フィールド */
--radius-lg: 0.75rem;    /* 12px - カード */
--radius-xl: 1rem;       /* 16px - モーダル */
--radius-full: 9999px;   /* 完全な円形 */
```

### シャドウ
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### トランジション
```css
--transition-fast: 0.15s ease-in-out;
--transition-base: 0.2s ease-in-out;
--transition-slow: 0.3s ease-in-out;
```

## レイアウト

### コンテナ幅
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### ブレークポイント
```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## UIコンポーネント仕様

### ボタン
- **Primary**: 背景色 accent-primary、白テキスト、hover時に accent-hover
- **Secondary**: 背景色 surface-secondary、テキスト text-primary、border
- **Ghost**: 透明背景、テキスト accent-primary、hover時に surface-secondary
- **高さ**: 40px（medium）、48px（large）
- **パディング**: 16px 24px（medium）、20px 32px（large）

### カード
- **背景**: surface-primary
- **ボーダー**: 1px solid border-light
- **パディング**: 24px
- **ボーダー半径**: radius-lg
- **シャドウ**: shadow-sm（通常）、shadow-md（hover）

### 入力フィールド
- **高さ**: 40px
- **パディング**: 12px 16px
- **ボーダー**: 1px solid border-medium
- **ボーダー半径**: radius-md
- **フォーカス**: 2px solid accent-primary

### ナビゲーション
- **高さ**: 64px
- **背景**: surface-primary with backdrop-blur
- **シャドウ**: shadow-sm
- **固定**: top: 0, sticky

### サイドバー
- **幅**: 280px（デスクトップ）
- **背景**: surface-secondary
- **ボーダー**: 1px solid border-light（右側）
- **パディング**: 24px

## ページ構造

### ダッシュボード
```
┌─────────────────────────────────────────┐
│ Header (固定)                            │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content                │
│ (固定)   │  - Stats Cards               │
│          │  - Case List                 │
│          │  - Quick Actions             │
│          │                              │
└──────────┴──────────────────────────────┘
```

### 症例詳細
```
┌─────────────────────────────────────────┐
│ Header (固定)                            │
├──────────┬──────────────────────────────┤
│          │ Breadcrumb                   │
│ Sidebar  │ ┌──────────────────────────┐ │
│ (固定)   │ │ Case Information         │ │
│          │ └──────────────────────────┘ │
│          │ ┌──────────────────────────┐ │
│          │ │ Medical History          │ │
│          │ └──────────────────────────┘ │
└──────────┴──────────────────────────────┘
```

### 症例作成フォーム
```
┌─────────────────────────────────────────┐
│ Header (固定)                            │
├──────────┬──────────────────────────────┤
│ Progress │ Step 1: Basic Info           │
│ Stepper  │ ┌──────────────────────────┐ │
│ (固定)   │ │ Form Fields              │ │
│          │ └──────────────────────────┘ │
│          │ [Back] [Next]                │
└──────────┴──────────────────────────────┘
```

## アニメーション

### ページ遷移
```css
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease-in-out;
}
```

### カードホバー
```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease-in-out;
}
```

### ボタンクリック
```css
.button:active {
  transform: scale(0.98);
  transition: transform 0.1s ease-in-out;
}
```

## アイコン

### アイコンライブラリ
- **Lucide Icons**: モダンでシンプルなアイコンセット
- **サイズ**: 16px（small）、20px（medium）、24px（large）
- **ストローク幅**: 2px

### 使用例
- Home: ダッシュボード
- FileText: 症例リスト
- PlusCircle: 新規作成
- Search: 検索
- Settings: 設定
- User: ユーザープロフィール
