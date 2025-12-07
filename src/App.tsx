import { useState } from 'react'
import CaseForm from './components/CaseForm'
import ResultView from './components/ResultView'
import { createCaseSummary } from './services/aiService'
import type { CaseSummaryResult } from './types'
import './App.css'

function App() {
  const [result, setResult] = useState<CaseSummaryResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: {
    caseNumber: number
    fieldNumber: number
    isDesignatedDisease: boolean
    voiceInputText: string
  }) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const summary = await createCaseSummary(data)
      setResult(summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>症例要約作成アシスタント</h1>
        <p className="subtitle">音声入力で作成したテキストから症例要約を自動生成</p>
      </div>

      <div className="info-section">
        <div className="info-section-title">使い方</div>
        <div className="info-section-content">
          <ol>
            <li>iPhoneの音声入力やMacのAquaVoiceなどで、カルテを見ながら話してテキスト化</li>
            <li>そのテキストを下の欄に貼り付け</li>
            <li>「症例要約を作成」ボタンをクリック</li>
            <li>AIが自動で情報を抽出・分類して症例要約を作成します</li>
          </ol>
        </div>
      </div>

      <div className="form-container">
        <CaseForm onSubmit={handleSubmit} loading={loading} />
        
        {error && (
          <div className="status error">
            {error}
          </div>
        )}
      </div>

      {result && (
        <ResultView result={result} />
      )}
    </div>
  )
}

export default App
