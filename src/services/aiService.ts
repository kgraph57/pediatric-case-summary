import type { CaseFormData, CaseSummaryResult } from '../types'
import { sanitizePrompt } from '../utils/validation'
import { checkRateLimit } from '../utils/rateLimiter'

// Cloudflare Worker API URL（環境変数から取得、なければ直接OpenAI APIを使用）
const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || ''
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || ''
const AI_API_URL = import.meta.env.VITE_AI_API_URL || 'https://api.openai.com/v1/chat/completions'
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'gpt-4'

// プロキシを使用するかどうか
const USE_PROXY = !!API_PROXY_URL

export async function createCaseSummary(
  data: CaseFormData
): Promise<CaseSummaryResult> {
  // レート制限チェック
  checkRateLimit()

  // プロキシを使用する場合
  if (USE_PROXY) {
    return createCaseSummaryViaProxy(data)
  }

  // 直接APIを呼び出す場合（開発環境またはフォールバック）
  return createCaseSummaryDirect(data)
}

/**
 * Cloudflare Worker経由でAPIを呼び出す（推奨）
 */
async function createCaseSummaryViaProxy(
  data: CaseFormData
): Promise<CaseSummaryResult> {
  try {
    const response = await fetch(API_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseNumber: data.caseNumber,
        fieldNumber: data.fieldNumber,
        isDesignatedDisease: data.isDesignatedDisease,
        voiceInputText: data.voiceInputText,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || '症例要約の生成に失敗しました。もう一度お試しください。'
      )
    }

    const result: CaseSummaryResult = await response.json()
    return result
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('症例要約の生成に失敗しました')
  }
}

/**
 * 直接OpenAI APIを呼び出す（開発環境用）
 */
async function createCaseSummaryDirect(
  data: CaseFormData
): Promise<CaseSummaryResult> {
  // 入力のサニタイズ
  const sanitizedText = sanitizePrompt(data.voiceInputText)

  const prompt = `以下の音声入力から症例要約を作成してください。

症例番号: ${data.caseNumber}
分野番号: ${data.fieldNumber}
指定疾患: ${data.isDesignatedDisease ? 'あり' : 'なし'}

【音声入力テキスト】
${sanitizedText}

【要件】
1. 音声入力から情報を抽出・分類してください
2. ルールに従って症例要約を作成してください
3. 30行以内に収めてください
4. 表記ルールを遵守してください（数字は半角、単位のスペース、句読点は、。で統一など）

【表記ルール】
- 数字はすべて半角
- 単位の前には半角スペース（例外：点、日、g、度、回/分、秒、万/µL、mm、WBCはスペースなし）
- 句読点は、。で統一
- 敬語は使用しない（「ご家族」→「家族」、「～していただいた」→「～した」）
- 人名由来の病名は英語表記（例：Down症候群）
- 年齢表記：生後0日～1か月は「日齢〇日」、1か月～11か月は「〇か月」、1歳0か月～1歳11か月は「1歳〇か月」、2歳以降は「〇歳」

症例要約のみを返してください。説明文は不要です。`

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: 'あなたは小児科専門医申請用の症例要約を作成する専門家です。表記ルールを厳密に遵守してください。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      // エラーの詳細をユーザーに表示しない（情報漏洩防止）
      const errorMessage =
        response.status === 401
          ? '認証に失敗しました。APIキーを確認してください。'
          : response.status === 429
          ? 'リクエストが多すぎます。しばらく待ってから再試行してください。'
          : response.status >= 500
          ? 'サーバーエラーが発生しました。しばらく待ってから再試行してください。'
          : '症例要約の生成に失敗しました。もう一度お試しください。'
      throw new Error(errorMessage)
    }

    const json = await response.json()
    const summary = json.choices[0]?.message?.content || ''

    if (!summary) {
      throw new Error('症例要約の生成に失敗しました')
    }

    return {
      caseNumber: data.caseNumber,
      fieldNumber: data.fieldNumber,
      isDesignatedDisease: data.isDesignatedDisease,
      summary: summary.trim(),
    }
  } catch (error) {
    // デモモード（APIキーがない場合）
    if (!AI_API_KEY) {
      return createDemoSummary(data)
    }
    throw error
  }
}

function createDemoSummary(data: CaseFormData): CaseSummaryResult {
  // デモ用のレスポンス
  const demoSummary = `症例番号: ${data.caseNumber}${data.isDesignatedDisease ? ' ○' : ''}
分野番号: ${data.fieldNumber}
患者ID: P12345
入院・外来: 入院症例
受け持ち期間: 2024年4月1日～2024年4月15日
年齢: 生後2か月
性別: 男
転帰: 治癒

【主訴】
発熱と咳嗽で来院。

【現病歴】
1か月前から軽い咳があったが、3日前から発熱（38.5度）と咳嗽が悪化。食欲も低下。近医受診し、RSウイルス陽性。当院紹介。

【入院時診察所見】
体温 38.5度、呼吸数 40回/分、脈拍 130回/分、血圧 80/50 mmHg。SpO2 96%（室内気）。体重 4.2 kg。呼吸音: ラ音あり。

【入院時検査所見】
WBC 12500/μL、Hb 11.2 g/dL、Hct 33.5%、Plt 25.3万/μL。T.Bil 0.8 mg/dL、AST 45 U/L、ALT 32 U/L、CRP 2.5 mg/dL。Na 138 mEq/L、K 4.2 mEq/L、Cl 102 mEq/L。胸部X線検査: 両側下肺野に浸潤影。

【鑑別診断】
1. RSウイルス感染症。
2. 細菌性肺炎。
3. 気管支喘息。

【入院後経過】
入院1日目: 酸素投与（1 L/分）開始、補液開始。入院3日目: 解熱、酸素離脱。入院7日目: 症状改善し退院。

【家族への説明・指示】
RSウイルス感染症について説明し、今後の注意点（手洗い、マスク着用、症状悪化時の受診）を説明した。`

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        caseNumber: data.caseNumber,
        fieldNumber: data.fieldNumber,
        isDesignatedDisease: data.isDesignatedDisease,
        summary: demoSummary,
      })
    }, 2000)
  })
}
