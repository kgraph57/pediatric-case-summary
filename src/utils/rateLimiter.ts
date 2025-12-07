/**
 * レート制限ユーティリティ
 * クライアント側での簡易レート制限
 */

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10, // 10リクエスト
  windowMs: 60000, // 1分間
}

class RateLimiter {
  private requests: number[] = []
  private config: RateLimitConfig

  constructor(config: RateLimitConfig = DEFAULT_CONFIG) {
    this.config = config
  }

  /**
   * リクエストが許可されるかチェック
   */
  canMakeRequest(): boolean {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // 古いリクエストを削除
    this.requests = this.requests.filter((time) => time > windowStart)

    // リクエスト数が上限を超えているかチェック
    if (this.requests.length >= this.config.maxRequests) {
      return false
    }

    // リクエストを記録
    this.requests.push(now)
    return true
  }

  /**
   * 次のリクエストまで待つ時間（ミリ秒）
   */
  getTimeUntilNextRequest(): number {
    if (this.requests.length === 0) {
      return 0
    }

    const oldestRequest = this.requests[0]
    const windowEnd = oldestRequest + this.config.windowMs
    const now = Date.now()

    return Math.max(0, windowEnd - now)
  }

  /**
   * リセット
   */
  reset(): void {
    this.requests = []
  }
}

// シングルトンインスタンス
export const rateLimiter = new RateLimiter()

/**
 * レート制限をチェックし、エラーを投げる
 */
export function checkRateLimit(): void {
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getTimeUntilNextRequest()
    const waitSeconds = Math.ceil(waitTime / 1000)
    throw new Error(
      `リクエストが多すぎます。${waitSeconds}秒後に再試行してください。`
    )
  }
}
