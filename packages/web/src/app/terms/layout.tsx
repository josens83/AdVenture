import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '이용약관',
  description: '마케터 생존기 서비스 이용약관. 서비스 제공, 유료 구독, 회원 의무 등에 관한 약관을 확인하세요.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '마케터 생존기 이용약관',
    description: '마케터 생존기 서비스 이용약관',
    url: `${SITE_URL}/terms`,
  },
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
