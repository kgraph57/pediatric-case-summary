import { useState, useEffect } from 'react';
import { Case, storage } from '../storage';
import { Save, X } from 'lucide-react';

interface CaseFormProps {
  caseId: string | null;
  onSave: (caseData: Case) => void;
  onCancel: () => void;
}

export default function CaseForm({ caseId, onSave, onCancel }: CaseFormProps) {
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
                onChange={(e) => updateField('patientAge', parseInt(e.target.value))}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
            <select
              value={formData.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">下書き</option>
              <option value="completed">完成</option>
              <option value="submitted">提出済み</option>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">主訴</label>
          <textarea
            value={formData.chiefComplaint}
            onChange={(e) => updateField('chiefComplaint', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例: 5日間続く発熱"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">現病歴</label>
          <textarea
            value={formData.presentIllness}
            onChange={(e) => updateField('presentIllness', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="現病歴の詳細を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">既往歴</label>
          <textarea
            value={formData.pastHistory}
            onChange={(e) => updateField('pastHistory', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="既往歴を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">家族歴</label>
          <textarea
            value={formData.familyHistory}
            onChange={(e) => updateField('familyHistory', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="家族歴を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">身体所見</label>
          <textarea
            value={formData.physicalExam}
            onChange={(e) => updateField('physicalExam', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="身体所見を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">検査所見</label>
          <textarea
            value={formData.labFindings}
            onChange={(e) => updateField('labFindings', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="血液検査などの結果を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">画像所見</label>
          <textarea
            value={formData.imagingFindings}
            onChange={(e) => updateField('imagingFindings', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="レントゲン、CTなどの所見を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">診断</label>
          <input
            type="text"
            value={formData.diagnosis}
            onChange={(e) => updateField('diagnosis', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="例: 川崎病"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">治療</label>
          <textarea
            value={formData.treatment}
            onChange={(e) => updateField('treatment', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="治療内容を入力してください"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">考察</label>
          <textarea
            value={formData.discussion}
            onChange={(e) => updateField('discussion', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="考察を入力してください"
          />
        </div>
      </div>
    </form>
  );
}
