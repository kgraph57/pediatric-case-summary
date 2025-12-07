# 症例要約作成アプリ - React実装版

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成して、AI APIの設定を追加してください：

**推奨: Cloudflare Worker経由（APIキー保護）**
```env
VITE_API_PROXY_URL=https://your-worker-url.workers.dev
```

**開発環境: 直接API呼び出し（非推奨）**
```env
VITE_AI_API_KEY=your-api-key-here
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
VITE_AI_MODEL=gpt-4
```

⚠️ **セキュリティ警告**: 本番環境では必ずCloudflare Workerを使用してください。直接APIキーを使用すると、APIキーがクライアント側に露出します。

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてください。

### 4. ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` フォルダに生成されます。

## 📁 プロジェクト構造

```
症例要約/
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── CaseForm.tsx    # 入力フォーム
│   │   └── ResultView.tsx  # 結果表示
│   ├── services/           # サービス層
│   │   ├── aiService.ts     # AI API呼び出し
│   │   └── wordService.ts   # Word生成
│   ├── types.ts            # TypeScript型定義
│   ├── App.tsx             # メインコンポーネント
│   ├── App.css             # スタイル
│   ├── main.tsx            # エントリーポイント
│   └── index.css           # グローバルスタイル
├── public/                 # 静的ファイル
├── .github/
│   └── workflows/
│       └── pages.yml       # GitHub Actions設定
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔧 機能

### 実装済み機能
- ✅ 症例情報入力フォーム
- ✅ 音声入力テキストの入力
- ✅ AI API呼び出し（OpenAI / Anthropic対応）
- ✅ 症例要約の生成
- ✅ Word形式でのダウンロード
- ✅ テキストのコピー
- ✅ レスポンシブデザイン
- ✅ モダンなUI（Notion/Linear風）

### 今後の拡張予定
- ⏳ 複数症例の管理
- ⏳ 進捗管理機能
- ⏳ テンプレート機能
- ⏳ 医学用語整形機能の統合
- ⏳ オフライン対応

## 🚀 GitHub Pagesへのデプロイ

### 自動デプロイ

`main`ブランチにプッシュすると、GitHub Actionsが自動的にビルドしてデプロイします。

### 手動デプロイ

1. リポジトリのSettings > Pagesに移動
2. Sourceを「GitHub Actions」に設定
3. `main`ブランチにプッシュ

### 環境変数の設定

GitHubリポジトリのSettings > Secrets and variables > Actionsで、以下のシークレットを設定してください：

- `VITE_AI_API_KEY`: AI APIのキー
- `VITE_AI_API_URL`: AI APIのURL（オプション）
- `VITE_AI_MODEL`: 使用するモデル（オプション）

## 📝 使用方法

1. 症例番号と分野番号を入力
2. 指定疾患の場合はチェック
3. 音声入力で作成したテキストを貼り付け
4. 「症例要約を作成」ボタンをクリック
5. 生成された症例要約を確認
6. Word形式でダウンロードまたはテキストをコピー

## 🛠️ 技術スタック

- **React 18**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: ビルドツール
- **docx.js**: Wordファイル生成
- **OpenAI API / Anthropic API**: AI処理

## 📄 ライセンス

個人利用を目的としています。
