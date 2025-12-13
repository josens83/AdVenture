import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '리더보드',
  description:
    '마케터 생존기 전체 순위 - 최고의 마케터들이 경쟁하는 리더보드. 누적 수익, 완료 프로젝트, 최고 레벨로 순위를 확인하세요.',
  keywords: [
    '마케터 생존기 순위',
    '리더보드',
    '마케팅 게임 랭킹',
    '최고 점수',
    '마케터 랭킹',
  ],
  openGraph: {
    title: '마케터 생존기 리더보드',
    description: '최고의 마케터들이 경쟁하는 리더보드를 확인하세요!',
    url: `${SITE_URL}/leaderboard`,
    images: [
      {
        url: `${SITE_URL}/og-leaderboard.png`,
        width: 1200,
        height: 630,
        alt: '마케터 생존기 리더보드',
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/leaderboard`,
  },
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
