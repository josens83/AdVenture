import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '쿠키 정책',
  description: '마케터 생존기 쿠키 정책. 필수, 기능, 분석, 마케팅 쿠키 사용에 관한 정보와 쿠키 설정 방법을 확인하세요.',
  keywords: [
    '쿠키 정책',
    '쿠키 설정',
    '웹사이트 쿠키',
    '쿠키 동의',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '마케터 생존기 쿠키 정책',
    description: '마케터 생존기 쿠키 사용에 관한 정책',
    url: `${SITE_URL}/cookies`,
  },
  alternates: {
    canonical: `${SITE_URL}/cookies`,
  },
};

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
