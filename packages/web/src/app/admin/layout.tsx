import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: '관리자 대시보드 | 마케터 생존기',
  description: '마케터 생존기 관리자 대시보드',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-white font-bold text-xl">
                마케터 생존기
              </a>
              <span className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded-full">
                관리자
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
                {session.user.email}
              </span>
              <a
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                게임으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
