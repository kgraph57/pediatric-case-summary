import { useState } from 'react'
import type { CaseFormData } from '../types'
import { validateAllInputs } from '../utils/validation'

interface CaseFormProps {
  onSubmit: (data: CaseFormData) => Promise<void>
  loading: boolean
}

export default function CaseForm({ onSubmit, loading }: CaseFormProps) {
  const [caseNumber, setCaseNumber] = useState(1)
  const [fieldNumber, setFieldNumber] = useState(3)
  const [isDesignatedDisease, setIsDesignatedDisease] = useState(false)
  const [voiceInputText, setVoiceInputText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 入力検証
    const validation = validateAllInputs({
      caseNumber,
      fieldNumber,
      voiceInputText: voiceInputText.trim(),
    })

    if (!validation.valid) {
      alert(validation.errors.join('\n'))
      return
    }

    await onSubmit({
      caseNumber,
      fieldNumber,
      isDesignatedDisease,
      voiceInputText: voiceInputText.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="caseNumber">
            症例番号
          </label>
          <input
            type="number"
            id="caseNumber"
            className="form-input"
            value={caseNumber}
            onChange={(e) => setCaseNumber(Number(e.target.value))}
            required
            min={1}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="fieldNumber">
            分野番号
          </label>
          <select
            id="fieldNumber"
            className="form-select"
            value={fieldNumber}
            onChange={(e) => setFieldNumber(Number(e.target.value))}
            required
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                分野{num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="isDesignatedDisease"
            className="checkbox"
            checked={isDesignatedDisease}
            onChange={(e) => setIsDesignatedDisease(e.target.checked)}
          />
          <label htmlFor="isDesignatedDisease" className="checkbox-label">
            指定疾患
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="voiceInputText">
          音声入力テキスト
        </label>
        <p className="form-label-hint">
          形式は気にしなくてOK、思いついた順で話した内容をそのまま貼り付けてください
        </p>
        <textarea
          id="voiceInputText"
          className="form-textarea"
          value={voiceInputText}
          onChange={(e) => {
            const value = e.target.value
            // 入力サイズ制限（10,000文字）
            if (value.length <= 10000) {
              setVoiceInputText(value)
            }
          }}
          placeholder="例: 患者IDはP12345、生後2か月の男児で、発熱と咳嗽で来院しました。1か月前から軽い咳があったんですが、3日前から発熱が38.5度で、咳嗽も悪化して食欲も低下しました。近医でRSウイルス陽性となって当院に紹介されました。入院時の所見は、体温38.5度、呼吸数40回、脈拍130回、血圧80/50で、SpO2は96パーセント、室内気です。体重は4.2キロで、呼吸音にラ音がありました。検査では、WBCが12500、Hbが11.2、CRPが2.5でした。胸部X線で両側下肺野に浸潤影がありました。診断はRSウイルス感染症です。鑑別診断としては、細菌性肺炎と気管支喘息を考えました。入院後は、酸素投与と補液を行い、3日目に解熱、7日目に退院しました。家族には、RSウイルス感染症について説明して、今後の注意点も説明しました。"
          required
          rows={12}
          maxLength={10000}
        />
        {voiceInputText.length > 0 && (
          <p className="form-label-hint" style={{ marginTop: '4px' }}>
            {voiceInputText.length} / 10,000 文字
          </p>
        )}
      </div>

      {loading && (
        <div className="status processing">
          AIが情報を整理中... しばらくお待ちください
        </div>
      )}

      <button type="submit" className="button" disabled={loading}>
        {loading ? '処理中...' : '症例要約を作成'}
      </button>
    </form>
  )
}
