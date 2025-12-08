import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: '마케터 생존기 | Marketing Simulator',
  description: '실제 마케팅을 배우는 시뮬레이션 게임. 클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요!',
  keywords: ['마케팅', '시뮬레이션', '게임', '교육', '디지털마케팅', '광고'],
  authors: [{ name: 'AdVenture Team' }],
  openGraph: {
    title: '마케터 생존기',
    description: '실제 마케팅을 배우는 시뮬레이션 게임',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '마케터 생존기',
    description: '실제 마케팅을 배우는 시뮬레이션 게임',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1a1a2e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <div id="app-root">{children}</div>
        <div id="modal-root" />
      </body>
    </html>
  );
}
