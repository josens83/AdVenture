import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '@/styles/globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import AnalyticsProvider from '@/components/providers/AnalyticsProvider';
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider';
import CookieConsent from '@/components/common/CookieConsent';
import { WebsiteJsonLd, GameJsonLd, OrganizationJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '마케터 생존기 | 실제 마케팅을 배우는 시뮬레이션 게임',
    template: '%s | 마케터 생존기',
  },
  description:
    '실제 마케팅을 배우는 시뮬레이션 게임. 클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요! SEO, SNS, 광고, 콘텐츠 마케팅의 모든 것.',
  keywords: [
    '마케팅',
    '시뮬레이션',
    '게임',
    '마케터',
    '디지털마케팅',
    'SEO',
    'SNS마케팅',
    '광고',
    '마케팅 교육',
    '마케팅 게임',
    '비즈니스 시뮬레이션',
    '웹마케팅',
    '온라인 마케팅',
  ],
  authors: [{ name: 'AdVenture Team', url: SITE_URL }],
  creator: 'AdVenture Team',
  publisher: '마케터 생존기',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'ko-KR': SITE_URL,
      'en-US': `${SITE_URL}?lang=en`,
    },
  },
  openGraph: {
    title: '마케터 생존기 - 실제 마케팅을 배우는 시뮬레이션 게임',
    description: '클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요! 무료로 시작하는 마케팅 시뮬레이션.',
    url: SITE_URL,
    siteName: '마케터 생존기',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: '마케터 생존기 - 마케팅 시뮬레이션 게임',
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: '마케터 생존기',
    description: '실제 마케팅을 배우는 시뮬레이션 게임',
    images: [`${SITE_URL}/og-image.png`],
    creator: '@marketersurvival',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  category: 'game',
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
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="마케터 생존기" />
        <meta name="application-name" content="마케터 생존기" />
        <meta name="msapplication-TileColor" content="#1a1a2e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <WebsiteJsonLd />
        <GameJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <ServiceWorkerProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <div id="app-root">{children}</div>
                <div id="modal-root" />
                <CookieConsent />
              </AnalyticsProvider>
            </Suspense>
          </ServiceWorkerProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
