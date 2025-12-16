import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | 마케터 생존기',
    default: '인증 | 마케터 생존기',
  },
  description: '마케터 생존기 계정 인증',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          홈으로 돌아가기
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-500 text-sm">
        <p>
          &copy; 2024 마케터 생존기. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
