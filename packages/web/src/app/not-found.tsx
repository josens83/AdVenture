import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-9xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
          >
            홈으로 이동
          </Link>
          <Link
            href="/leaderboard"
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            리더보드 보기
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            문제가 계속되면{' '}
            <a href="mailto:support@adventure-game.com" className="text-blue-400 hover:underline">
              고객센터
            </a>
            에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
