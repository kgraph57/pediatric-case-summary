/**
 * Cloudflare Worker - AI API Proxy
 * APIキーを保護し、クライアントからのリクエストをプロキシする
 */

export interface Env {
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY?: string
  ALLOWED_ORIGINS: string
}

interface RequestBody {
  caseNumber: number
  fieldNumber: number
  isDesignatedDisease: boolean
  voiceInputText: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS設定
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGINS || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    }

    // OPTIONSリクエスト（プリフライト）の処理
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // POSTリクエストのみ許可
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders,
      })
    }

    try {
      // リクエストボディの取得と検証
      const body: RequestBody = await request.json()

      // 入力検証
      const validationError = validateInput(body)
      if (validationError) {
        return new Response(
          JSON.stringify({ error: validationError }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // プロンプトの構築
      const prompt = buildPrompt(body)

      // OpenAI API呼び出し
      const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
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
          max_tokens: 2000,
        }),
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}))
        const errorMessage = getErrorMessage(apiResponse.status)
        
        return new Response(
          JSON.stringify({ error: errorMessage }),
          {
            status: apiResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      const apiData = await apiResponse.json()
      const summary = apiData.choices?.[0]?.message?.content || ''

      if (!summary) {
        return new Response(
          JSON.stringify({ error: '症例要約の生成に失敗しました' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // レスポンス
      return new Response(
        JSON.stringify({
          caseNumber: body.caseNumber,
          fieldNumber: body.fieldNumber,
          isDesignatedDisease: body.isDesignatedDisease,
          summary: summary.trim(),
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('Error:', error)
      return new Response(
        JSON.stringify({
          error: 'サーバーエラーが発生しました。しばらく待ってから再試行してください。',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }
  },
}

/**
 * 入力検証
 */
function validateInput(body: RequestBody): string | null {
  if (!body || typeof body !== 'object') {
    return '無効なリクエストです'
  }

  if (!Number.isInteger(body.caseNumber) || body.caseNumber < 1 || body.caseNumber > 1000) {
    return '症例番号が無効です'
  }

  if (!Number.isInteger(body.fieldNumber) || body.fieldNumber < 1 || body.fieldNumber > 10) {
    return '分野番号が無効です'
  }

  if (typeof body.isDesignatedDisease !== 'boolean') {
    return '指定疾患の値が無効です'
  }

  if (!body.voiceInputText || typeof body.voiceInputText !== 'string') {
    return '音声入力テキストが無効です'
  }

  if (body.voiceInputText.length === 0) {
    return '音声入力テキストが空です'
  }

  if (body.voiceInputText.length > 10000) {
    return '音声入力テキストが長すぎます（最大10,000文字）'
  }

  // 危険な文字列の検出
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\(/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(body.voiceInputText)) {
      return '無効な文字列が検出されました'
    }
  }

  return null
}

/**
 * プロンプトの構築
 */
function buildPrompt(body: RequestBody): string {
  // プロンプトインジェクション攻撃を防ぐため、サニタイズ
  const sanitizedText = body.voiceInputText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

  return `以下の音声入力から症例要約を作成してください。

症例番号: ${body.caseNumber}
分野番号: ${body.fieldNumber}
指定疾患: ${body.isDesignatedDisease ? 'あり' : 'なし'}

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
}

/**
 * エラーメッセージの取得（情報漏洩を防ぐ）
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return '認証に失敗しました'
    case 429:
      return 'リクエストが多すぎます。しばらく待ってから再試行してください'
    case 500:
    case 502:
    case 503:
      return 'サーバーエラーが発生しました。しばらく待ってから再試行してください'
    default:
      return '症例要約の生成に失敗しました。もう一度お試しください'
  }
}
