# 小児科専門医申請用症例要約作成支援

小児科専門医試験の申請に必要な30症例以上の症例要約を、効率的かつ正確に作成するための支援ツールと資料集

## 🚀 クイックスタート

### Webアプリケーション（React版）

最新のReact + TypeScript + Viteで実装されたモダンなWebアプリケーションです。

#### セットアップ

```bash
npm install
npm run dev
```

#### 環境変数の設定

`.env`ファイルを作成：

```env
# Cloudflare Worker経由（推奨・APIキー保護）
VITE_API_PROXY_URL=https://your-worker-url.workers.dev

# または直接API呼び出し（開発環境のみ）
VITE_AI_API_KEY=your-api-key-here
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
VITE_AI_MODEL=gpt-4
```

#### ビルド

```bash
npm run build
```

詳細は [README_React実装.md](./README_React実装.md) を参照してください。

---

## 📁 フォルダ構成

### Manas開発用

Manasでアプリ開発を開始するためのファイル一式

- [Manas開発用/](./Manas開発用/) - 開発用ファイル
- [Manasプロンプト.md](./Manas開発用/Manasプロンプト.md) - 最初に投げるプロンプト
- [Manas開発指示書.md](./Manas開発用/Manas開発指示書.md) - 詳細な開発仕様書

### ルール・テンプレート

- [症例要約作成ルール.md](./症例要約作成ルール.md) - 詳細なルールと表記規則
- [症例情報収集テンプレート.md](./症例情報収集テンプレート.md) - 入力項目のテンプレート
- [症例要約作成ガイド.md](./症例要約作成ガイド.md) - ステップバイステップの作業ガイド

### セキュリティ

- [セキュリティ分析レポート.md](./セキュリティ分析レポート.md) - セキュリティ分析結果
- [セキュリティ実装ガイド.md](./セキュリティ実装ガイド.md) - セキュリティ実装ガイド
- [Cloudflare_Worker_セットアップガイド.md](./Cloudflare_Worker_セットアップガイド.md) - APIキー保護のためのCloudflare Worker設定

---

## 🔒 セキュリティ

### 実装済みのセキュリティ対策

- ✅ 入力検証とサニタイズ（XSS、インジェクション攻撃の防止）
- ✅ レート制限（クライアント側）
- ✅ エラーメッセージの改善（情報漏洩防止）
- ✅ Cloudflare Worker経由のAPIキー保護（推奨）

### 重要な注意事項

⚠️ **APIキーの保護**: 本番環境では必ずCloudflare Workerを使用してください。直接APIキーを使用すると、APIキーがクライアント側に露出します。

詳細は [セキュリティ実装ガイド.md](./セキュリティ実装ガイド.md) を参照してください。

---

## 🛠️ 技術スタック

- **フロントエンド**: React 18 + TypeScript + Vite
- **バックエンド**: Cloudflare Workers（APIキー保護）
- **AI API**: OpenAI / Anthropic
- **Word出力**: docx.js
- **デプロイ**: GitHub Pages

---

## 📚 ドキュメント

- [README_React実装.md](./README_React実装.md) - React実装の詳細
- [技術スタック比較.md](./技術スタック比較.md) - 技術選択の比較
- [理想的なUIUX設計.md](./理想的なUIUX設計.md) - UI/UX設計
- [Cloudflare_Worker_セットアップガイド.md](./Cloudflare_Worker_セットアップガイド.md) - Cloudflare Workerのセットアップ

---

## 📝 ライセンス

このリポジトリは個人利用を目的としています。

---

## 🔗 リンク

- [GitHubリポジトリ](https://github.com/kgraph57/pediatric-case-summary)
