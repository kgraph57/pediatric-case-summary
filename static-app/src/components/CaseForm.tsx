import { useState, useEffect } from 'react';
import { Case, storage } from '../storage';
import { Save, X, Sparkles, FileText } from 'lucide-react';
import { extractCaseData, formatMedicalText } from '../services/aiService';

interface CaseFormProps {
  caseId: string | null;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

export default function CaseForm({ caseId, onSave, onCancel }: CaseFormProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [aiInputText, setAiInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Case>>({
    title: '',
    patientAge: 0,
    patientGender: '男性',
    status: 'draft',
    priority: 'medium',
    isFavorite: false,
    completeness: 0,
    tags: [],
    chiefComplaint: '',
    presentIllness: '',
    pastHistory: '',
    familyHistory: '',
    physicalExam: '',
    labFindings: '',
    imagingFindings: '',
    diagnosis: '',
    treatment: '',
    discussion: '',
  });

  useEffect(() => {
    if (caseId) {
      const existingCase = storage.getCase(caseId);
      if (existingCase) {
        setFormData(existingCase);
      }
    }
  }, [caseId]);

  const calculateCompleteness = (data: Partial<Case>): number => {
    const fields = [
      'title', 'patientAge', 'patientGender', 'chiefComplaint',
      'presentIllness', 'pastHistory', 'familyHistory', 'physicalExam',
      'labFindings', 'imagingFindings', 'diagnosis', 'treatment', 'discussion'
    ];
    const filledFields = fields.filter(field => {
      const value = data[field as keyof Case];
      return value !== '' && value !== 0;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const handleAiProcess = async () => {
    if (!aiInputText.trim()) {
      alert('症例情報を入力してください');
      return;
    }

    setIsProcessing(true);
    try {
      const extractedData = await extractCaseData(aiInputText);
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));
      
      setShowPreview(true);
      setActiveTab('manual'); // 手動入力タブに切り替えて結果を確認できるようにする
      alert('AI整形が完了しました。各項目に自動振り分けされました。必要に応じて修正してください。');
    } catch (error) {
      alert('AI整形に失敗しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };



  const handleManualAiFormat = async () => {
    setIsProcessing(true);
    try {
      // 各フィールドを個別に整形
      const fields = [
        'chiefComplaint', 'presentIllness', 'pastHistory', 'familyHistory',
        'physicalExam', 'labFindings', 'imagingFindings', 'diagnosis', 'treatment', 'discussion'
      ] as const;
      
      const formattedData: Partial<Case> = {};
      
      for (const field of fields) {
        const value = formData[field];
        if (value && typeof value === 'string' && value.trim()) {
          formattedData[field] = await formatMedicalText(value);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        ...formattedData
      }));
      
      alert('AI整形が完了しました。医学用語と表記が整形されました。');
    } catch (error) {
      alert('AI整形に失敗しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const completeness = calculateCompleteness(formData);
    const caseData: Case = {
      id: caseId || `case-${Date.now()}`,
      title: formData.title || '',
      patientAge: formData.patientAge || 0,
      patientGender: formData.patientGender || '男性',
      status: formData.status || 'draft',
      priority: formData.priority || 'medium',
      isFavorite: formData.isFavorite || false,
      completeness,
      tags: formData.tags || [],
      chiefComplaint: formData.chiefComplaint || '',
      presentIllness: formData.presentIllness || '',
      pastHistory: formData.pastHistory || '',
      familyHistory: formData.familyHistory || '',
      physicalExam: formData.physicalExam || '',
      labFindings: formData.labFindings || '',
      imagingFindings: formData.imagingFindings || '',
      diagnosis: formData.diagnosis || '',
      treatment: formData.treatment || '',
      discussion: formData.discussion || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(caseData);
  };

  const updateField = (field: keyof Case, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{caseId ? '症例編集' : '新規症例作成'}</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-2" />
            キャンセル
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            保存
          </button>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'ai'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            AI入力
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`py-4 px-6 text-sm font-medium border-b-2 ${
              activeTab === 'manual'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            手動入力
          </button>
        </nav>
      </div>

      {/* AI入力タブ */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">📝 入力ガイド</h3>
            <p className="text-sm text-blue-800 mb-2">
              デバイスの音声入力機能を使って、以下の情報を自由に話してください：
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>患者の年齢・性別</li>
              <li>主訴（なぜ来院したか）</li>
              <li>現病歴（いつから、どんな症状が）</li>
              <li>診察所見（体温、呼吸数、身体所見など）</li>
              <li>検査結果（血液検査、画像検査など）</li>
              <li>診断名と治療内容</li>
              <li>経過と転帰</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              症例情報（音声入力または手入力）
            </label>
            <textarea
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder="例：
3歳の男児。主訴は発熱と発疹。5日前から発熱が続き、3日前から全身に発疹が出現。体温は38.5度、両側の頸部リンパ節腫脹あり。眼球結膜充血、口唇発赤、いちご舌を認める。血液検査でWBC 15000、CRP 8.5、血小板 35万。心エコーで冠動脈拡大なし。川崎病と診断し、免疫グロブリン療法を開始。解熱し、発疹も改善。"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 iPhone/Macの音声入力: キーボードのマイクボタンをタップ
            </p>
          </div>

          <button
            type="button"
            onClick={handleAiProcess}
            disabled={isProcessing || !aiInputText.trim()}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI整形中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                AIで整形して各項目に振り分ける
              </>
            )}
          </button>

          {showPreview && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="text-sm font-semibold text-green-900 mb-2">✅ AI整形完了</h3>
              <p className="text-sm text-green-800">
                症例情報が各項目に自動振り分けされました。「手動入力」タブで確認・修正できます。
              </p>
            </div>
          )}
        </div>
      )}

      {/* 手動入力タブ */}
      {activeTab === 'manual' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">各項目を個別に入力してください</p>
            <button
              type="button"
              onClick={handleManualAiFormat}
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-purple-600 text-sm font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI整形
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">症例タイトル *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例: 川崎病の症例"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">患者年齢 *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="20"
                    value={formData.patientAge}
                    onChange={(e) => updateField('patientAge', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">性別 *</label>
                  <select
                    value={formData.patientGender}
                    onChange={(e) => updateField('patientGender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="男性">男性</option>
                    <option value="女性">女性</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">下書き</option>
                  <option value="in-progress">作成中</option>
                  <option value="review">レビュー中</option>
                  <option value="completed">完成</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateField('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFavorite}
                    onChange={(e) => updateField('isFavorite', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">お気に入り</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
            <h2 className="text-xl font-semibold">症例詳細</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">主訴</label>
              <textarea
                value={formData.chiefComplaint}
                onChange={(e) => updateField('chiefComplaint', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 発熱と発疹"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">現病歴</label>
              <textarea
                value={formData.presentIllness}
                onChange={(e) => updateField('presentIllness', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 5日前から発熱が続き..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">既往歴</label>
              <textarea
                value={formData.pastHistory}
                onChange={(e) => updateField('pastHistory', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 特記事項なし"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">家族歴</label>
              <textarea
                value={formData.familyHistory}
                onChange={(e) => updateField('familyHistory', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 特記事項なし"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">身体所見</label>
              <textarea
                value={formData.physicalExam}
                onChange={(e) => updateField('physicalExam', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 体温38.5度、頸部リンパ節腫脹..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">検査所見</label>
              <textarea
                value={formData.labFindings}
                onChange={(e) => updateField('labFindings', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: WBC 15000, CRP 8.5..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">画像所見</label>
              <textarea
                value={formData.imagingFindings}
                onChange={(e) => updateField('imagingFindings', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 心エコーで冠動脈拡大なし"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">診断</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => updateField('diagnosis', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 川崎病"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">治療・経過</label>
              <textarea
                value={formData.treatment}
                onChange={(e) => updateField('treatment', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 免疫グロブリン療法を開始..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">考察・学び</label>
              <textarea
                value={formData.discussion}
                onChange={(e) => updateField('discussion', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: 川崎病の診断基準について..."
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
