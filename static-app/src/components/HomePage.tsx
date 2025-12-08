import { ArrowRight, FileText, BarChart3, Search, Sparkles } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export default function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900">
          小児科症例要約作成支援
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          小児科専門医試験の症例要約30症例以上の作成を効率的に支援するツールです。
          症例の管理、進捗の可視化、検索機能を提供します。
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          今すぐ始める
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">症例管理</h3>
          <p className="text-gray-600">
            30症例以上の症例要約を一元管理。ステータス、優先度、タグで整理できます。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">進捗可視化</h3>
          <p className="text-gray-600">
            ダッシュボードで進捗状況を視覚的に確認。完成度や期限を一目で把握できます。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Search className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">高度な検索</h3>
          <p className="text-gray-600">
            タイトル、診断名、主訴などで症例を素早く検索。フィルター機能も充実。
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <Sparkles className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold mb-2">ローカル保存</h3>
          <p className="text-gray-600">
            データはブラウザに保存され、インターネット接続なしでも利用可能です。
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">使い方</h2>
        <ol className="space-y-4 text-gray-700">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">1</span>
            <div>
              <strong>新規作成</strong>をクリックして症例要約を作成します
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">2</span>
            <div>
              患者情報、主訴、現病歴などの必要な情報を入力します
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">3</span>
            <div>
              ステータスや優先度を設定して進捗を管理します
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">4</span>
            <div>
              ダッシュボードで全体の進捗を確認しながら作成を進めます
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
