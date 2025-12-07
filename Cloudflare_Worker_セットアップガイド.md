# Cloudflare Worker セットアップガイド

## 🚀 クイックスタート

### 1. Cloudflareアカウントの作成

1. [Cloudflare](https://www.cloudflare.com/)でアカウントを作成（無料）
2. ダッシュボードにログイン

### 2. Wrangler CLIのインストール

```bash
npm install -g wrangler
```

### 3. Cloudflareにログイン

```bash
wrangler login
```

ブラウザが開き、Cloudflareアカウントでログインします。

### 4. Workerのデプロイ

```bash
cd cloudflare-worker
npm install
npm run deploy
```

### 5. 環境変数の設定

デプロイ後、環境変数を設定します：

```bash
# OpenAI APIキーを設定
wrangler secret put OPENAI_API_KEY
# プロンプトが表示されたら、APIキーを貼り付け

# 許可されたオリジンを設定（GitHub PagesのURL）
wrangler secret put ALLOWED_ORIGINS
# 例: https://yourusername.github.io
# または: https://yourusername.github.io/pediatric-case-summary
```

### 6. Worker URLの確認

デプロイ後、以下のようなURLが表示されます：
```
https://pediatric-case-summary-api.your-subdomain.workers.dev
```

このURLをコピーします。

### 7. クライアント側の設定

`.env`ファイルまたはGitHub Secretsに以下を追加：

```env
VITE_API_PROXY_URL=https://pediatric-case-summary-api.your-subdomain.workers.dev
```

---

## 📋 詳細な手順

### ステップ1: プロジェクトの準備

```bash
cd cloudflare-worker
npm install
```

### ステップ2: ローカルでのテスト

```bash
npm run dev
```

ローカルでWorkerを起動し、テストできます。

### ステップ3: 本番環境へのデプロイ

```bash
npm run deploy
```

### ステップ4: 環境変数の設定

```bash
# 本番環境
wrangler secret put OPENAI_API_KEY
wrangler secret put ALLOWED_ORIGINS

# ステージング環境（オプション）
wrangler secret put OPENAI_API_KEY --env staging
wrangler secret put ALLOWED_ORIGINS --env staging
```

---

## 🔧 設定の確認

### Worker URLの確認

```bash
wrangler whoami
```

### 環境変数の確認

環境変数は直接確認できませんが、Workerが正常に動作しているかテストできます：

```bash
curl -X POST https://your-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "caseNumber": 1,
    "fieldNumber": 3,
    "isDesignatedDisease": false,
    "voiceInputText": "テスト"
  }'
```

---

## 🐛 トラブルシューティング

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

### エラー: "CORS error"

`ALLOWED_ORIGINS`に正しいURLを設定してください：
```bash
wrangler secret put ALLOWED_ORIGINS
# 例: https://yourusername.github.io
```

### Workerが応答しない

1. CloudflareダッシュボードでWorkerの状態を確認
2. ログを確認: `wrangler tail`
3. 環境変数が正しく設定されているか確認

---

## 📊 モニタリング

### ログの確認

```bash
wrangler tail
```

リアルタイムでログを確認できます。

### 使用量の確認

Cloudflareダッシュボード > Workers & Pages > 使用量統計

---

## 🔒 セキュリティ

### 推奨設定

1. **ALLOWED_ORIGINS**: 本番環境のURLのみ許可
2. **APIキー**: 定期的にローテーション
3. **レート制限**: Cloudflareのレート制限機能を有効化（オプション）

### 環境変数の管理

- 本番環境とステージング環境で別々のAPIキーを使用
- 定期的にAPIキーをローテーション
- 不要になったAPIキーは削除

---

## 🚀 次のステップ

1. Worker URLをクライアント側の環境変数に設定
2. クライアント側のコードを更新（既に実装済み）
3. テストして動作確認
4. 本番環境にデプロイ

---

## 📚 参考資料

- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Wrangler CLI ドキュメント](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Workers 料金](https://developers.cloudflare.com/workers/platform/pricing/)
