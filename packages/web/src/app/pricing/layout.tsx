import { Metadata } from 'next';
import { PricingJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

export const metadata: Metadata = {
  title: '요금제',
  description:
    '마케터 생존기 요금제 - 무료부터 엔터프라이즈까지 다양한 플랜으로 마케팅 시뮬레이션 게임을 즐기세요. 스타터 월 9,900원, 프로 월 29,900원.',
  keywords: [
    '마케터 생존기 가격',
    '마케팅 게임 요금',
    '구독 플랜',
    '프리미엄 기능',
    '마케팅 교육 가격',
  ],
  openGraph: {
    title: '마케터 생존기 요금제',
    description: '무료부터 엔터프라이즈까지 다양한 플랜으로 마케팅 시뮬레이션을 즐기세요.',
    url: `${SITE_URL}/pricing`,
    images: [
      {
        url: `${SITE_URL}/og-pricing.png`,
        width: 1200,
        height: 630,
        alt: '마케터 생존기 요금제',
      },
    ],
  },
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PricingJsonLd />
      {children}
    </>
  );
}
