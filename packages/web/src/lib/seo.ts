import { Metadata } from 'next';

// Base URL for the site
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';
const SITE_NAME = '마케터 생존기';
const SITE_DESCRIPTION =
  '실제 마케팅을 배우는 시뮬레이션 게임. 클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요!';

// Default Open Graph image
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'game';
  noindex?: boolean;
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

/**
 * Generate metadata for a page
 */
export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = SITE_DESCRIPTION,
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    url = SITE_URL,
    type = 'website',
    noindex = false,
    locale = 'ko_KR',
  } = config;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  const baseKeywords = [
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
  ];

  const allKeywords = [...new Set([...baseKeywords, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: 'AdVenture Team' }],
    creator: 'AdVenture Team',
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        'ko-KR': url,
        'en-US': `${url}?lang=en`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale,
      type: type === 'game' ? 'website' : type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@marketersurvival',
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for the game
 */
export function generateGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    inLanguage: 'ko-KR',
    genre: ['Simulation', 'Educational', 'Business'],
    gamePlatform: ['Web browser', 'iOS', 'Android'],
    applicationCategory: 'Game',
    operatingSystem: 'Web browser, iOS, Android',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock',
        name: '무료 버전',
      },
      {
        '@type': 'Offer',
        price: '9900',
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock',
        name: '스타터 플랜',
      },
      {
        '@type': 'Offer',
        price: '29900',
        priceCurrency: 'KRW',
        availability: 'https://schema.org/InStock',
        name: '프로 플랜',
      },
    ],
    author: {
      '@type': 'Organization',
      name: 'AdVenture Team',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AdVenture Team',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/marketersurvival',
      'https://instagram.com/marketersurvival',
      'https://github.com/adventure-team',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@marketer-survival.com',
      availableLanguage: ['Korean', 'English'],
    },
  };
}

/**
 * Generate JSON-LD structured data for FAQ
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for a breadcrumb
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD structured data for pricing
 */
export function generatePricingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE_NAME} 프리미엄`,
    description: '마케터 생존기 프리미엄 구독으로 모든 기능을 이용하세요',
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '9900',
      highPrice: '99000',
      priceCurrency: 'KRW',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: '스타터',
          price: '9900',
          priceCurrency: 'KRW',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: '프로',
          price: '29900',
          priceCurrency: 'KRW',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: '엔터프라이즈',
          price: '99000',
          priceCurrency: 'KRW',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
  };
}
