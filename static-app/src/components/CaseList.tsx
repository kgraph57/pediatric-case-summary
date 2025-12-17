import { useState } from 'react';
import { Case } from '../storage';
import { Edit, Trash2, Star, Search } from 'lucide-react';

interface CaseListProps {
  cases: Case[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function CaseList({ cases, onEdit, onDelete }: CaseListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Case['status']) => {
    const styles = {
      draft: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      submitted: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      draft: '下書き',
      completed: '完成',
      submitted: '提出済み',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: Case['priority']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800',
    };
    const labels = {
      low: '低',
      medium: '中',
      high: '高',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[priority]}`}>
        優先度: {labels[priority]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">症例一覧</h1>
        <div className="text-sm text-gray-600">
          {filteredCases.length} / {cases.length} 件
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="タイトルまたは診断名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">すべてのステータス</option>
          <option value="draft">下書き</option>
          <option value="completed">完成</option>
          <option value="submitted">提出済み</option>
        </select>
      </div>

      {filteredCases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">症例が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCases.map(caseItem => (
            <div key={caseItem.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{caseItem.title}</h3>
                    {caseItem.isFavorite && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <div className="flex gap-2 mb-2">
                    {getStatusBadge(caseItem.status)}
                    {getPriorityBadge(caseItem.priority)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {caseItem.patientAge}歳 {caseItem.patientGender} | 診断: {caseItem.diagnosis || '未入力'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(caseItem.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(caseItem.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">完成度</span>
                  <span className="font-medium">{caseItem.completeness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${caseItem.completeness}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
