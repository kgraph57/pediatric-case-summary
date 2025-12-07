# Cloudflare Worker - AI API Proxy

## 概要

このCloudflare Workerは、クライアント側からAI APIを安全に呼び出すためのプロキシサーバーです。
APIキーを保護し、入力検証とレート制限を提供します。

## セットアップ

### 1. Cloudflareアカウントの作成

1. [Cloudflare](https://www.cloudflare.com/)でアカウントを作成
2. Workers & Pages に移動

### 2. Wrangler CLIのインストール

```bash
npm install -g wrangler
```

### 3. Cloudflareにログイン

```bash
wrangler login
```

### 4. 環境変数の設定

```bash
# OpenAI APIキーを設定
wrangler secret put OPENAI_API_KEY

# 許可されたオリジンを設定（GitHub PagesのURL）
wrangler secret put ALLOWED_ORIGINS
# 例: https://yourusername.github.io
```

### 5. デプロイ

```bash
cd cloudflare-worker
npm install
npm run deploy
```

デプロイ後、WorkerのURLが表示されます（例: `https://pediatric-case-summary-api.your-subdomain.workers.dev`）

## 使用方法

### クライアント側からの呼び出し

```typescript
const response = await fetch('https://your-worker-url.workers.dev', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    caseNumber: 1,
    fieldNumber: 3,
    isDesignatedDisease: false,
    voiceInputText: '患者IDはP12345...',
  }),
})

const data = await response.json()
```

## セキュリティ機能

- ✅ APIキーの保護（クライアント側に露出しない）
- ✅ 入力検証（XSS、インジェクション攻撃の防止）
- ✅ CORS設定（許可されたオリジンのみ）
- ✅ エラーメッセージのサニタイズ（情報漏洩防止）

## 開発

### ローカル開発

```bash
npm run dev
```

### ステージング環境へのデプロイ

```bash
npm run deploy:staging
```

## トラブルシューティング

### エラー: "Authentication required"

```bash
wrangler login
```

### エラー: "Secret not found"

環境変数を設定してください：
```bash
wrangler secret put OPENAI_API_KEY
wrangler secret put ALLOWED_ORIGINS
```
