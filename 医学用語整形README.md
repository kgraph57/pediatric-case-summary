# 医学用語整形機能の使用方法

## 概要

この機能は、症例要約や医学論文・学会発表において、医学用語や表現を適切な形式に自動整形するための機能です。

## ファイル構成

- `医学用語ルール定義.json` - 医学用語・表現のルール定義（JSON形式）
- `医学用語整形関数.ts` - TypeScript版の整形関数
- `医学用語整形関数.js` - JavaScript版の整形関数
- `医学用語整形AIプロンプト.md` - AIに整形を依頼する際のプロンプト

## 基本的な使用方法

### TypeScript/JavaScriptアプリケーションでの使用

```typescript
import { formatMedicalText } from './医学用語整形関数';

const inputText = `
アプガールスコアは9点でした。
エコー検査を実施したところ、異常所見は認められませんでした。
抗生剤を投与しました。
痙攣が認められました。
15才男子が来院しました。
家族にご説明していただきました。
`;

const result = formatMedicalText(inputText);

console.log('整形後のテキスト:');
console.log(result.formattedText);

if (result.errors.length > 0) {
  console.error('エラー:', result.errors);
}

if (result.warnings.length > 0) {
  console.warn('警告:', result.warnings);
}
```

### Reactコンポーネントでの使用例

```tsx
import React, { useState } from 'react';
import { formatMedicalText } from './医学用語整形関数';

function MedicalTextFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleFormat = () => {
    const result = formatMedicalText(input);
    setOutput(result.formattedText);
    setErrors(result.errors);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="症例要約を入力..."
      />
      <button onClick={handleFormat}>整形する</button>
      
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, i) => (
            <p key={i} style={{ color: 'red' }}>{error}</p>
          ))}
        </div>
      )}
      
      <textarea
        value={output}
        readOnly
        placeholder="整形後のテキストがここに表示されます"
      />
    </div>
  );
}
```

### AIプロンプトでの使用

AI（ChatGPT、Claudeなど）に整形を依頼する際は、`医学用語整形AIプロンプト.md`の内容を参照してプロンプトを作成してください。

**プロンプト例：**
```
以下のテキストに対して、医学用語・表現ルールを適用して整形してください。
医学用語整形AIプロンプト.mdに記載されたルールに従ってください。

[テキストをここに貼り付け]
```

## 適用されるルール

### 1. 人名由来の病名
- アプガール → Apgar
- ファロー四徴症 → Fallot四徴症
- グラム染色 → Gram染色
- Chédiak-Higashi症候群（ハイフンで結ぶ）
- Henoch Schönlein紫斑病 → IgA血管炎

### 2. 検査名
- エコー → 超音波検査
- レントゲン → X線検査
- 採血を行う → 血液検査を行う

### 3. 薬剤呼称
- 抗生剤 → 抗菌薬

### 4. 医学用語
- 奇形 → 先天異常（可能な限り）
- 痙攣 → けいれん

### 5. ひらがな表記
- 一旦 → いったん
- 未だ → いまだ
- 全て → すべて
- 出来る → できる
- 等

### 6. 年齢表記
- ヶ月 → か月
- 才 → 歳

### 7. 文章表現
- 週間前より → 週前から
- AとBとが → A、Bおよび

### 8. 敬語表現
- ご家族 → 家族
- ～していただいた → ～した

詳細なルールは`医学用語ルール定義.json`を参照してください。

## カスタマイズ

### ルールの追加・変更

`医学用語ルール定義.json`を編集することで、ルールを追加・変更できます。

**例：新しい人名由来病名の追加**

```json
{
  "人名由来病名": {
    "rules": [
      {
        "pattern": "パーキンソン",
        "replacement": "Parkinson"
      }
    ]
  }
}
```

### 関数の拡張

`医学用語整形関数.ts`を編集して、独自の整形ロジックを追加できます。

## 実装時の注意事項

### 1. パフォーマンス
- 大量のテキストを整形する場合は、バッチ処理を検討してください
- リアルタイム整形が必要な場合は、デバウンス処理を実装してください

### 2. エラーハンドリング
- 入力テキストが空の場合の処理
- 不正な文字列が含まれる場合の処理
- ルール適用時の例外処理

### 3. ユーザー体験
- 整形前後の差分を表示する
- エラー・警告を視覚的に分かりやすく表示する
- 元のテキストに戻す機能を提供する

## 統合方法

### 症例要約作成アプリへの統合

1. **入力時整形**：ユーザーがテキストを入力する際にリアルタイムで整形
2. **保存時整形**：保存前に自動整形
3. **エクスポート時整形**：PDF/Word出力時に整形
4. **手動整形ボタン**：ユーザーが任意のタイミングで整形できるボタンを提供

### バリデーションとの統合

整形関数は、バリデーション機能と組み合わせて使用できます：

```typescript
function validateAndFormat(caseData: Case): ValidationResult {
  // 1. 整形
  const formatted = formatMedicalText(caseData.presentIllness);
  
  // 2. バリデーション
  const validation = validateCase({
    ...caseData,
    presentIllness: formatted.formattedText
  });
  
  // 3. エラーと警告を統合
  return {
    ...validation,
    formattingErrors: formatted.errors,
    formattingWarnings: formatted.warnings
  };
}
```

## テスト例

```typescript
import { formatMedicalText } from './医学用語整形関数';

describe('医学用語整形', () => {
  test('アプガールがApgarに変換される', () => {
    const result = formatMedicalText('アプガールスコアは9点');
    expect(result.formattedText).toContain('Apgarスコア');
  });

  test('エコーが超音波検査に変換される', () => {
    const result = formatMedicalText('エコー検査を実施');
    expect(result.formattedText).toContain('超音波検査');
  });

  test('禁止された感情表現を検出', () => {
    const result = formatMedicalText('無念だった');
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

## トラブルシューティング

### ルールが適用されない

1. `医学用語ルール定義.json`のパスが正しいか確認
2. ルールのパターンが正規表現として正しいか確認
3. 大文字小文字の設定（caseSensitive）を確認

### パフォーマンスが遅い

1. 大量のテキストの場合は、バッチ処理に変更
2. 不要なルールを削除
3. 正規表現を最適化

## 今後の拡張案

- [ ] より多くの医学用語ルールの追加
- [ ] コンテキストを考慮した高度な変換
- [ ] ユーザー定義ルールのサポート
- [ ] 整形履歴の保存
- [ ] 複数言語対応

## 参考資料

- `症例要約作成ルール.md` - 詳細なルールと表記規則
- `Manas開発指示書.md` - アプリケーション全体の仕様


