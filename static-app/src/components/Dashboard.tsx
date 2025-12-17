import { Case } from '../storage';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DashboardProps {
  cases: Case[];
}

export default function Dashboard({ cases }: DashboardProps) {
  const stats = {
    total: cases.length,
    draft: cases.filter(c => c.status === 'draft').length,
    completed: cases.filter(c => c.status === 'completed').length,
    submitted: cases.filter(c => c.status === 'submitted').length,
    avgCompleteness: cases.length > 0
      ? Math.round(cases.reduce((sum, c) => sum + c.completeness, 0) / cases.length)
      : 0,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">総症例数</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">下書き</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">完成</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">提出済み</p>
              <p className="text-3xl font-bold text-blue-600">{stats.submitted}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">平均完成度</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${stats.avgCompleteness}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-gray-900">{stats.avgCompleteness}%</span>
        </div>
      </div>

      {cases.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">まだ症例が登録されていません</p>
          <p className="text-sm text-gray-500 mt-2">右上の「新規作成」ボタンから症例を追加してください</p>
        </div>
      )}
    </div>
  );
}
