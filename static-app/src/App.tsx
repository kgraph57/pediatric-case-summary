import { useState, useEffect } from 'react';
import { Home, FileText, BarChart3, Plus } from 'lucide-react';
import { storage, Case } from './storage';
import Dashboard from './components/Dashboard';
import CaseList from './components/CaseList';
import CaseForm from './components/CaseForm';
import HomePage from './components/HomePage';

type Page = 'home' | 'dashboard' | 'cases' | 'new-case' | 'edit-case';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cases, setCases] = useState<Case[]>([]);
  const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

  useEffect(() => {
    setCases(storage.getCases());
  }, []);

  const refreshCases = () => {
    setCases(storage.getCases());
  };

  const handleNewCase = () => {
    setEditingCaseId(null);
    setCurrentPage('new-case');
  };

  const handleEditCase = (id: string) => {
    setEditingCaseId(id);
    setCurrentPage('edit-case');
  };

  const handleSaveCase = (caseData: Case) => {
    storage.saveCase(caseData);
    refreshCases();
    setCurrentPage('cases');
  };

  const handleDeleteCase = (id: string) => {
    if (confirm('この症例を削除してもよろしいですか？')) {
      storage.deleteCase(id);
      refreshCases();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'home'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                ホーム
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'dashboard'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                ダッシュボード
              </button>
              <button
                onClick={() => setCurrentPage('cases')}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  currentPage === 'cases'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                症例一覧
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleNewCase}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                新規作成
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <HomePage onGetStarted={() => setCurrentPage('cases')} />}
        {currentPage === 'dashboard' && <Dashboard cases={cases} />}
        {currentPage === 'cases' && (
          <CaseList
            cases={cases}
            onEdit={handleEditCase}
            onDelete={handleDeleteCase}
            onRefresh={refreshCases}
          />
        )}
        {(currentPage === 'new-case' || currentPage === 'edit-case') && (
          <CaseForm
            caseId={editingCaseId}
            onSave={handleSaveCase}
            onCancel={() => setCurrentPage('cases')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
