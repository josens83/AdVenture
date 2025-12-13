import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '마케터 생존기 개인정보처리방침. 개인정보 수집, 이용, 보호에 관한 정책을 확인하세요. GDPR 및 국내 개인정보보호법 준수.',
  keywords: [
    '개인정보처리방침',
    '개인정보보호',
    'GDPR',
    '개인정보 정책',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '마케터 생존기 개인정보처리방침',
    description: '마케터 생존기 개인정보 처리에 관한 정책',
    url: `${SITE_URL}/privacy`,
  },
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
