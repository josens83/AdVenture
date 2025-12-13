import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '회원가입',
  description: '마케터 생존기에 무료로 가입하세요. 이메일 또는 소셜 계정으로 간편하게 시작할 수 있습니다.',
  keywords: [
    '마케터 생존기 회원가입',
    '무료 가입',
    '마케팅 게임 시작',
    '계정 만들기',
  ],
  openGraph: {
    title: '마케터 생존기 회원가입',
    description: '무료로 가입하고 마케팅 시뮬레이션 게임을 시작하세요!',
    url: `${SITE_URL}/auth/signup`,
  },
  alternates: {
    canonical: `${SITE_URL}/auth/signup`,
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
