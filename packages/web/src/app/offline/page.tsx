import Link from 'next/link';

export const metadata = {
  title: '오프라인 | 마케터 생존기',
  description: '인터넷 연결을 확인해주세요.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-gray-700 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          오프라인 상태입니다
        </h1>
        <p className="text-gray-400 mb-8">
          인터넷 연결이 끊어졌습니다.
          <br />
          연결을 확인한 후 다시 시도해주세요.
        </p>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 mb-4"
        >
          다시 시도
        </button>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-xl text-left">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            💡 오프라인에서도 가능한 것들:
          </h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• 이전에 저장한 게임 데이터 보기</li>
            <li>• 캐시된 페이지 탐색</li>
            <li>• 설정 확인</li>
          </ul>
        </div>

        {/* Connection Status */}
        <div className="mt-6 text-xs text-gray-500">
          연결이 복구되면 자동으로 동기화됩니다.
        </div>
      </div>
    </div>
  );
}
