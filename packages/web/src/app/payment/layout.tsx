import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | 마케터 생존기',
    default: '결제 | 마케터 생존기',
  },
  description: '결제 처리 중입니다.',
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl">
            마케터 생존기
          </Link>
          <span className="text-gray-400 text-sm">안전한 결제</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-700">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <p className="mb-2">
            결제는 Stripe를 통해 안전하게 처리됩니다.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              이용약관
            </Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
