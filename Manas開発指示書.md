# 小児科専門医申請用症例要約作成アプリ 開発指示書

## 📋 プロジェクト概要

### 目的
小児科専門医試験の申請に必要な30症例以上の症例要約を、効率的かつ正確に作成するためのWebアプリケーション/モバイルアプリケーションを開発する。

### ターゲットユーザー
- 小児科専門医試験を受験する医師（主にR3以降）
- 症例要約作成の指導を行うメンター医師

### 主要機能
1. **症例情報の入力と管理**
2. **症例要約の自動生成**（ルールに基づいたフォーマット化）
3. **バリデーションとチェック機能**
4. **症例一覧の管理と進捗確認**
5. **PDF/Word形式でのエクスポート**

---

## 🎯 機能要件

### 1. 症例管理機能

#### 1.1 症例一覧画面
- **機能**：
  - 30症例以上の症例を一覧表示
  - 症例番号、分野番号、診断名、入院/外来、年齢、転帰を表示
  - 進捗状況（未作成/作成中/完成）を表示
  - 検索・フィルタ機能（分野別、入院/外来別など）
  - 症例の追加・編集・削除

- **必須チェック機能**：
  - 30例未満の警告
  - 各分野の症例数チェック（各分野2症例以上）
  - 外来症例が3症例を超えていないかチェック
  - 同一疾患の重複チェック
  - 症例番号が分野番号順になっているかチェック

#### 1.2 症例詳細入力画面
- **基本情報セクション**：
  - 症例番号（自動採番 or 手動入力）
  - 分野番号（1-10から選択）
  - 患者ID
  - 入院・外来（ラジオボタン）
  - 受け持ち期間（開始日・終了日）
  - 受け持ち開始時点の年齢（年齢表記ルールに従った入力支援）
  - 性別（ラジオボタン）
  - 転帰（治癒・軽快・不変・増悪・死亡から選択）
  - 指定疾患フラグ（チェックボックス）

- **周産期歴セクション**（条件付き表示）：
  - 在胎週数
  - 出生体重
  - 分娩方法（経腟分娩・帝王切開）
  - Apgarスコア（1分・5分）
  - 母体情報（年齢、経産歴、母体感染症など）

- **既往歴・家族歴セクション**：
  - 既往歴（自由入力）
  - 家族歴（自由入力）
  - 感染接触歴（自由入力）
  - 生活歴（自由入力）

- **診断名セクション**：
  - 第1病名（必須）
  - 第2病名以降（任意、複数可）
  - 指定疾患マークの自動付与

- **主訴・現病歴セクション**：
  - 主訴（テキストエリア）
  - 現病歴（テキストエリア、時系列で入力）

- **診察所見セクション**：
  - バイタルサイン入力フォーム
  - 身体所見入力フォーム（チェックボックス + 自由入力）
  - 外来症例の場合は「入院時」→「来院時」に自動変更

- **検査所見セクション**：
  - 血液検査入力フォーム
  - 血清生化学入力フォーム
  - 凝固系入力フォーム
  - 静脈血液ガス入力フォーム（条件付き表示）
  - 特殊検査入力フォーム（条件付き表示）
  - 尿検査入力フォーム（条件付き表示）
  - その他検査入力フォーム

- **鑑別診断セクション**（必須）：
  - 複数の鑑別診断を入力（最低1つ必須）

- **症例の問題点セクション**（推奨）：
  - 自由入力テキストエリア

- **入院後経過セクション**：
  - 時系列で入力（テキストエリア）
  - 外来症例の場合は「入院後」→「来院後」に自動変更

- **家族への説明・指示セクション**（必須）：
  - インフォームドコンセントの内容入力
  - 退院後の指導内容入力

- **退院後の経過セクション**（推奨）：
  - 自由入力テキストエリア

### 2. 症例要約自動生成機能

#### 2.1 フォーマット化ルール
- **改行ルール**：
  - 各項目（【主訴】【現病歴】など）の冒頭でのみ改行
  - 項目内では改行しない
  - 30行以内に収める

- **表記ルール**：
  - 数字：すべて半角に変換
  - 単位のスペース：
    - 原則：半角スペース（例：`12.4 g/dL`）
    - 例外（スペースなし）：点、日、g、度、回/分、秒、万/µL、mm、%、mg/kg/day
    - WBC：`WBC 13560/μL`のように、WBCと数字の間にスペース、数字と単位の間はスペースなし
  - 句読点：、。で統一（カンマ、ピリオドは不可）
  - 敬語：不要（「～した」で統一）
  - µ（マイクロ）：半角記号に統一
  - L（リットル）：大文字に統一

- **年齢表記の自動変換**：
  - 生後0日～1か月まで：日齢〇日
  - 生後1か月～11か月：〇か月
  - 生後1歳0か月～1歳11か月：1歳〇か月
  - 生後2歳0か月以降：〇歳

- **検査名の自動変換**：
  - 「エコー」→「超音波検査」
  - 「レントゲン」→「X線検査」
  - 「採血を行う」→「血液検査を行う」

- **人名由来の病名の自動変換**：
  - 「アプガール」→「Apgar」
  - 「ファロー四徴症」→「Fallot四徴症」
  - 「グラム染色」→「Gram染色」
  - 「Chédiak-Higashi」症候群（ハイフンで結ぶ）
  - 「Sjögren」症候群
  - 「Henoch Schönlein紫斑病」→「IgA血管炎」

- **医学用語・表現の自動整形**（詳細は`医学用語ルール定義.json`参照）：
  - 薬剤呼称：「抗生剤」→「抗菌薬」
  - 医学用語：「奇形」→「先天異常」、「痙攣」→「けいれん」
  - ひらがな表記必須の語（一旦→いったん、全て→すべて、等）
  - 年齢表記：「ヶ月」→「か月」、「才」→「歳」
  - 文章表現：「週間前より」→「週前から」
  - 敬語表現：「ご家族」→「家族」、「～していただいた」→「～した」
  - 特殊記号：pH（pは小文字、Hは大文字）、µ（マイクロ）は半角
  - 学名・遺伝子名：イタリック表記
  - 動植物名：医学文献ではカタカナ表記（イヌ、サル、ヒト等）
  - 感情表現の検出と警告（「無念」「残念」等は禁止）
  
  **実装方法**：
  - `医学用語整形関数.ts`または`医学用語整形関数.js`を使用
  - 入力時、保存時、エクスポート時に自動適用
  - 手動整形ボタンも提供

#### 2.2 プレビュー機能
- リアルタイムで症例要約のプレビューを表示
- 30行以内かどうかを視覚的に表示
- 表記ルール違反をハイライト表示

### 3. バリデーション機能

#### 3.1 入力時バリデーション
- **必須項目チェック**：
  - 症例番号、分野番号、患者ID、性別、転帰、第1病名、主訴、現病歴、鑑別診断、家族への説明・指示

- **形式チェック**：
  - 年齢表記がルールに従っているか
  - 数字が半角か
  - 単位のスペースが正しいか
  - 句読点が、。で統一されているか

- **論理チェック**：
  - 受け持ち期間がローテ期間内か
  - 外来症例が3症例を超えていないか
  - 同一疾患が重複していないか

#### 3.2 全体バリデーション
- **基本要件チェック**：
  - 30例以上あるか
  - 各分野に2症例以上あるか
  - 各分野に指定疾患が含まれているか
  - 外来症例が3症例までか
  - 症例番号が分野番号順になっているか
  - 特定の年齢層に偏っていないか

- **一覧表との整合性チェック**：
  - 第1病名が要約と一覧表で一致しているか
  - 症例番号が正しく振られているか

### 4. チェックリスト機能
- 各症例ごとのチェックリスト表示
- 全体の最終チェックリスト表示
- チェック項目の自動判定と手動チェック

### 5. エクスポート機能
- **PDF形式**：
  - 症例要約をPDF形式でエクスポート
  - 複数症例をまとめてエクスポート可能
  - 印刷用フォーマット（A4サイズ）

- **Word形式**：
  - 症例要約をWord形式でエクスポート
  - 編集可能な形式

- **Excel形式**：
  - 症例一覧をExcel形式でエクスポート

### 6. データ管理機能
- **ローカルストレージ**：
  - ブラウザのローカルストレージにデータを保存
  - データのインポート・エクスポート機能

- **クラウドストレージ**（オプション）：
  - ユーザーアカウント機能
  - クラウドにデータを保存
  - 複数デバイス間での同期

---

## 🎨 UI/UX要件

### デザイン原則
- **シンプルで直感的なUI**
- **医療現場での使用を想定した操作性**
- **重要な情報が一目で分かるレイアウト**
- **モバイル対応（レスポンシブデザイン）**

### 画面構成

#### 1. トップ画面（ダッシュボード）
- 症例一覧のサマリー表示
- 進捗状況の可視化（グラフ・プログレスバー）
- チェックリストのサマリー
- クイックアクション（新規症例追加、エクスポートなど）

#### 2. 症例一覧画面
- テーブル形式で症例を一覧表示
- ソート機能（症例番号順、分野順、作成日順など）
- フィルタ機能（分野別、入院/外来別、進捗状況別）
- 検索機能（診断名、患者IDなど）

#### 3. 症例入力画面
- **タブ形式またはアコーディオン形式**でセクションを分ける
  - 基本情報
  - 周産期歴・既往歴
  - 診断名
  - 主訴・現病歴
  - 診察所見
  - 検査所見
  - 鑑別診断・経過
  - 家族への説明
- **リアルタイムプレビュー**を右側または下部に表示
- **入力支援機能**：
  - オートコンプリート
  - 入力例の表示
  - ツールチップでルール説明

#### 4. プレビュー画面
- 症例要約の完成形を表示
- 印刷プレビュー
- エクスポートボタン

#### 5. チェックリスト画面
- 症例ごとのチェックリスト
- 全体のチェックリスト
- チェック状況の可視化

### カラースキーム
- **プライマリカラー**：医療をイメージした落ち着いた色（青系）
- **アクセントカラー**：警告・注意を表す色（オレンジ・赤）
- **成功カラー**：完成・OKを表す色（緑）
- **背景色**：目に優しい色（白・ライトグレー）

### フォント
- **和文**：MS明朝、MSゴシック（または同等のフォント）
- **欧文**：Times New Roman
- **文字サイズ**：10.5pt～12pt（症例要約本文）

---

## 📊 データ構造

### 症例データモデル

```typescript
interface Case {
  id: string; // 一意のID
  caseNumber: number; // 症例番号
  fieldNumber: number; // 分野番号（1-10）
  patientId: string; // 患者ID
  isInpatient: boolean; // true: 入院症例, false: 外来症例
  carePeriod: {
    startDate: Date;
    endDate: Date;
  };
  patientAge: {
    type: 'day' | 'month' | 'year' | 'yearMonth';
    value: number;
    monthValue?: number; // 1歳〇か月の場合
  };
  gender: 'male' | 'female';
  outcome: 'cured' | 'improved' | 'unchanged' | 'worsened' | 'deceased';
  isDesignatedDisease: boolean; // 指定疾患かどうか
  
  // 周産期歴
  perinatalHistory?: {
    gestationalAge: {
      weeks: number;
      days: number;
    };
    birthWeight: number; // g
    deliveryMethod: 'vaginal' | 'cesarean';
    apgarScore?: {
      oneMinute: number;
      fiveMinutes: number;
    };
    maternalInfo?: {
      age: number;
      gravida: number;
      para: number;
      infection: boolean;
      infectionDetails?: string;
    };
  };
  
  // 既往歴・家族歴
  pastMedicalHistory?: string;
  familyHistory?: string;
  infectionContactHistory?: string;
  lifestyleHistory?: string;
  
  // 診断名
  diagnoses: {
    primary: string; // 第1病名（必須）
    secondary?: string[]; // 第2病名以降
  };
  
  // 主訴・現病歴
  chiefComplaint: string;
  presentIllness: string;
  
  // 診察所見
  physicalExamination: {
    vitalSigns: {
      temperature?: number; // 度
      respiratoryRate?: number; // 回/分
      heartRate?: number; // 回/分
      bloodPressure?: {
        systolic: number;
        diastolic: number;
      }; // mmHg
      spO2?: number; // %
      oxygenTherapy?: boolean;
      gcs?: {
        eye: number;
        verbal: number;
        motor: number;
      };
    };
    bodyMeasurements?: {
      height?: number; // cm
      weight?: number; // kg
      headCircumference?: number; // cm（新生児・乳児の場合）
    };
    findings: string; // 自由入力
  };
  
  // 検査所見
  laboratoryFindings: {
    bloodTest?: {
      wbc?: number; // /µL
      hb?: number; // g/dL
      hct?: number; // %
      plt?: number; // 万/µL
      neu?: number; // %
      lym?: number; // %
    };
    biochemistry?: {
      tBil?: number; // mg/dL
      dBil?: number; // mg/dL
      ast?: number; // U/L
      alt?: number; // U/L
      ldh?: number; // U/L
      bun?: number; // mg/dL
      cre?: number; // mg/dL
      na?: number; // mEq/L
      k?: number; // mEq/L
      cl?: number; // mEq/L
      crp?: number; // mg/dL
      bnp?: number; // pg/mL
    };
    coagulation?: {
      ptInr?: number;
      aptt?: number; // 秒
      fibrinogen?: number; // mg/dL
      dDimer?: number; // µg/mL
      pivka2?: number; // mAU/mL
    };
    bloodGas?: {
      pH?: number;
      pCO2?: number; // mmHg
      hco3?: number; // mmol/L
      glucose?: number; // mg/dL
      lactate?: number; // mmol/L
    };
    specialTests?: {
      insulin?: number; // µU/mL
      acetoacetate?: number; // µmol/L
      hydroxybutyrate?: number; // µmol/L
      freeFattyAcids?: number; // μEq/L
    };
    urinalysis?: {
      method: 'catheter' | 'midstream';
      specificGravity?: number;
      leukocyteEsterase?: 'negative' | 'positive';
      nitrite?: 'negative' | 'positive';
      wbc?: number; // /HPF
      gramStain?: 'negative' | 'positive';
      gramStainDetails?: string;
    };
    otherTests?: {
      ultrasound?: string;
      xray?: string;
      ct?: string;
      mri?: string;
      ecg?: string;
    };
  };
  
  // 鑑別診断（必須）
  differentialDiagnoses: string[]; // 最低1つ必須
  
  // 症例の問題点（推奨）
  problemPoints?: string;
  
  // 入院後経過
  hospitalCourse: string;
  
  // 家族への説明・指示（必須）
  familyExplanation: string;
  
  // 退院後の経過（推奨）
  postDischargeCourse?: string;
  
  // メタデータ
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'completed' | 'reviewed';
}
```

### 設定データモデル

```typescript
interface Settings {
  userId?: string;
  rotationPeriod?: {
    startDate: Date;
    endDate: Date;
  };
  fieldDefinitions: {
    [fieldNumber: number]: {
      name: string;
      designatedDiseases: string[];
    };
  };
}
```

---

## 🔧 技術仕様

### フロントエンド
- **フレームワーク**：React / Vue.js / Next.js（推奨）
- **UIライブラリ**：Material-UI / Chakra UI / Tailwind CSS
- **状態管理**：Redux / Zustand / Context API
- **フォーム管理**：React Hook Form / Formik
- **バリデーション**：Yup / Zod

### バックエンド（オプション）
- **フレームワーク**：Node.js / Python（FastAPI）
- **データベース**：PostgreSQL / MongoDB
- **認証**：Firebase Auth / Auth0

### データストレージ
- **ローカルストレージ**：IndexedDB / LocalStorage
- **クラウドストレージ**（オプション）：Firebase / AWS S3

### PDF生成
- **ライブラリ**：jsPDF / PDFKit / Puppeteer

### デプロイ
- **Webアプリ**：Vercel / Netlify / AWS Amplify
- **モバイルアプリ**：React Native / Flutter（オプション）

---

## 📝 バリデーションルール詳細

### 入力値バリデーション

#### 年齢表記
```javascript
function validateAge(age) {
  if (age.type === 'day' && age.value >= 0 && age.value <= 31) {
    return true; // 日齢〇日
  }
  if (age.type === 'month' && age.value >= 1 && age.value <= 11) {
    return true; // 〇か月
  }
  if (age.type === 'yearMonth' && age.value === 1 && age.monthValue >= 0 && age.monthValue <= 11) {
    return true; // 1歳〇か月
  }
  if (age.type === 'year' && age.value >= 2) {
    return true; // 〇歳
  }
  return false;
}
```

#### 単位のスペース
```javascript
function formatUnit(value, unit) {
  const noSpaceUnits = ['点', '日', 'g', '度', '回/分', '秒', '万/µL', 'mm', '%', 'mg/kg/day'];
  if (noSpaceUnits.includes(unit)) {
    return `${value}${unit}`;
  }
  return `${value} ${unit}`;
}

function formatWBC(value) {
  return `WBC ${value}/μL`; // WBCと数字の間にスペース、数字と単位の間はスペースなし
}
```

#### 数字の半角変換
```javascript
function convertToHalfWidth(str) {
  return str.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}
```

#### 句読点の統一
```javascript
function normalizePunctuation(str) {
  return str
    .replace(/[，]/g, '、')
    .replace(/[．]/g, '。')
    .replace(/[,]/g, '、')
    .replace(/[.]/g, '。');
}
```

### 全体バリデーション

#### 基本要件チェック
```javascript
function validateAllCases(cases) {
  const errors = [];
  
  // 30例以上
  if (cases.length < 30) {
    errors.push('症例数が30例未満です');
  }
  
  // 各分野の症例数
  const fieldCounts = {};
  cases.forEach(c => {
    fieldCounts[c.fieldNumber] = (fieldCounts[c.fieldNumber] || 0) + 1;
  });
  
  for (let i = 1; i <= 10; i++) {
    if (!fieldCounts[i] || fieldCounts[i] < 2) {
      errors.push(`分野${i}の症例数が2例未満です`);
    }
  }
  
  // 外来症例数
  const outpatientCount = cases.filter(c => !c.isInpatient).length;
  if (outpatientCount > 3) {
    errors.push(`外来症例が3例を超えています（${outpatientCount}例）`);
  }
  
  // 同一疾患の重複
  const diagnoses = cases.map(c => c.diagnoses.primary);
  const duplicates = diagnoses.filter((d, i) => diagnoses.indexOf(d) !== i);
  if (duplicates.length > 0) {
    errors.push(`同一疾患が重複しています: ${[...new Set(duplicates)].join(', ')}`);
  }
  
  // 症例番号が分野番号順
  const sortedCases = [...cases].sort((a, b) => a.fieldNumber - b.fieldNumber || a.caseNumber - b.caseNumber);
  cases.forEach((c, i) => {
    if (c.caseNumber !== sortedCases[i].caseNumber) {
      errors.push('症例番号が分野番号順になっていません');
    }
  });
  
  return errors;
}
```

---

## 🚀 実装優先順位

### Phase 1: MVP（最小機能）
1. 症例情報の入力フォーム
2. 基本的なバリデーション
3. 症例要約の自動生成（基本的なフォーマット化）
4. 症例一覧表示
5. ローカルストレージへの保存

### Phase 2: 基本機能
1. 詳細なバリデーション
2. チェックリスト機能
3. PDFエクスポート
4. プレビュー機能の改善

### Phase 3: 高度な機能
1. クラウドストレージ連携
2. ユーザーアカウント機能
3. 複数デバイス間での同期
4. モバイルアプリ版

---

## 📚 参考資料

### ルールファイル
- `症例要約作成ルール.md` - 詳細なルールと表記規則
- `症例情報収集テンプレート.md` - 入力項目のテンプレート
- `症例要約作成ガイド.md` - ユーザーガイド
- `医学用語ルール定義.json` - 医学用語・表現のルール定義（論文・学会発表対応）
- `医学用語整形関数.ts` / `医学用語整形関数.js` - 医学用語整形の実装
- `医学用語整形README.md` - 医学用語整形機能の使用方法
- `医学用語整形AIプロンプト.md` - AIに整形を依頼する際のプロンプト

### サンプルデータ
- 先輩の症例要約例（30症例分）を参考に

---

## 🎯 成功指標

### ユーザー体験
- 1症例の入力時間：30分以内
- 症例要約の自動生成精度：95%以上
- バリデーションエラーの検出率：100%

### 技術指標
- ページ読み込み時間：2秒以内
- レスポンシブデザイン対応
- 主要ブラウザでの動作確認（Chrome, Firefox, Safari, Edge）

---

## 📞 開発時の注意事項

1. **医療情報の取り扱い**：
   - 個人情報保護に配慮
   - データの暗号化
   - ローカルストレージを基本とし、クラウドストレージはオプション

2. **アクセシビリティ**：
   - WCAG 2.1 AAレベルを目指す
   - キーボード操作の対応
   - スクリーンリーダー対応

3. **パフォーマンス**：
   - 大量データの処理を考慮
   - 仮想スクロールの実装
   - レイジーローディング

4. **エラーハンドリング**：
   - 分かりやすいエラーメッセージ
   - データ損失の防止
   - 自動保存機能

---

## 🔄 今後の拡張案

1. **AI機能**：
   - カルテからの自動情報抽出
   - 症例要約の自動生成の精度向上
   - 表記ルール違反の自動修正

2. **コラボレーション機能**：
   - メンターとの共有機能
   - コメント・フィードバック機能
   - バージョン管理

3. **統計・分析機能**：
   - 症例の分布分析
   - 進捗状況の可視化
   - レポート生成

4. **多言語対応**：
   - 英語版の追加
   - 他言語への拡張

