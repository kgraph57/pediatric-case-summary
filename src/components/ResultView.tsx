import { downloadWord } from '../services/wordService'
import type { CaseSummaryResult } from '../types'

interface ResultViewProps {
  result: CaseSummaryResult
}

export default function ResultView({ result }: ResultViewProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary)
      alert('テキストをクリップボードにコピーしました')
    } catch (err) {
      alert('コピーに失敗しました')
    }
  }

  const handleDownload = async () => {
    try {
      await downloadWord(result)
    } catch (err) {
      alert('Wordファイルの生成に失敗しました')
    }
  }

  return (
    <div className="result-section">
      <div className="result-section-title">症例要約が完成しました</div>
      <div className="result-content">{result.summary}</div>
      <div className="button-group">
        <button onClick={handleDownload} className="button">
          Word形式でダウンロード
        </button>
        <button onClick={handleCopy} className="button button-secondary">
          テキストをコピー
        </button>
      </div>
    </div>
  )
}
