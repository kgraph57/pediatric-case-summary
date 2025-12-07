/**
 * 入力検証ユーティリティ
 * XSS、インジェクション攻撃を防ぐ
 */

const MAX_INPUT_LENGTH = 10000 // 最大入力文字数
const MAX_CASE_NUMBER = 1000 // 最大症例番号
const MAX_FIELD_NUMBER = 10 // 最大分野番号

/**
 * テキスト入力の検証
 */
export function validateInput(text: string): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: '入力が無効です' }
  }

  if (text.length === 0) {
    return { valid: false, error: '入力が空です' }
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return {
      valid: false,
      error: `入力が長すぎます（最大${MAX_INPUT_LENGTH}文字）`,
    }
  }

  // 危険な文字列の検出（簡易版）
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror= など
    /eval\(/i,
    /expression\(/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(text)) {
      return { valid: false, error: '無効な文字列が検出されました' }
    }
  }

  return { valid: true }
}

/**
 * 症例番号の検証
 */
export function validateCaseNumber(caseNumber: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(caseNumber)) {
    return { valid: false, error: '症例番号は整数である必要があります' }
  }

  if (caseNumber < 1) {
    return { valid: false, error: '症例番号は1以上である必要があります' }
  }

  if (caseNumber > MAX_CASE_NUMBER) {
    return {
      valid: false,
      error: `症例番号は${MAX_CASE_NUMBER}以下である必要があります`,
    }
  }

  return { valid: true }
}

/**
 * 分野番号の検証
 */
export function validateFieldNumber(fieldNumber: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(fieldNumber)) {
    return { valid: false, error: '分野番号は整数である必要があります' }
  }

  if (fieldNumber < 1 || fieldNumber > MAX_FIELD_NUMBER) {
    return {
      valid: false,
      error: `分野番号は1から${MAX_FIELD_NUMBER}の間である必要があります`,
    }
  }

  return { valid: true }
}

/**
 * プロンプトのサニタイズ
 * AI APIに送信する前に、危険な文字列をエスケープ
 */
export function sanitizePrompt(text: string): string {
  // 基本的なエスケープ
  let sanitized = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  // システムプロンプトの上書きを防ぐ
  const systemPromptOverrides = [
    /ignore\s+previous\s+instructions/i,
    /forget\s+previous/i,
    /system:\s*/i,
    /assistant:\s*/i,
  ]

  for (const pattern of systemPromptOverrides) {
    if (pattern.test(sanitized)) {
      // 危険な文字列を削除
      sanitized = sanitized.replace(pattern, '')
    }
  }

  return sanitized
}

/**
 * 全入力の検証
 */
export function validateAllInputs(data: {
  caseNumber: number
  fieldNumber: number
  voiceInputText: string
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  const caseNumberValidation = validateCaseNumber(data.caseNumber)
  if (!caseNumberValidation.valid) {
    errors.push(caseNumberValidation.error || '症例番号が無効です')
  }

  const fieldNumberValidation = validateFieldNumber(data.fieldNumber)
  if (!fieldNumberValidation.valid) {
    errors.push(fieldNumberValidation.error || '分野番号が無効です')
  }

  const inputValidation = validateInput(data.voiceInputText)
  if (!inputValidation.valid) {
    errors.push(inputValidation.error || '入力テキストが無効です')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
