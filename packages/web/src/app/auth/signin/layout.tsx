import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '로그인',
  description: '마케터 생존기에 로그인하여 게임을 계속하세요. Google, GitHub 또는 이메일로 로그인할 수 있습니다.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: '마케터 생존기 로그인',
    description: '마케터 생존기에 로그인하세요',
    url: `${SITE_URL}/auth/signin`,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
