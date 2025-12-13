'use client';

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-built JSON-LD components for common use cases

export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '마케터 생존기',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com',
    description: '실제 마케팅을 배우는 시뮬레이션 게임',
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com'}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

export function GameJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: '마케터 생존기',
    description: '실제 마케팅을 배우는 시뮬레이션 게임. 클라이언트를 수주하고, 전략을 세우고, 성과를 만들어내세요!',
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    inLanguage: 'ko-KR',
    genre: ['Simulation', 'Educational', 'Business'],
    gamePlatform: ['Web browser', 'iOS', 'Android'],
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    playMode: 'SinglePlayer',
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 1,
      maxValue: 1,
    },
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
      url: siteUrl,
    },
  };

  return <JsonLd data={data} />;
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AdVenture Team',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@marketer-survival.com',
      availableLanguage: ['Korean', 'English'],
    },
    sameAs: [
      'https://twitter.com/marketersurvival',
      'https://instagram.com/marketersurvival',
    ],
  };

  return <JsonLd data={data} />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const data = {
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

  return <JsonLd data={data} />;
}

export function PricingJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: '마케터 생존기 프리미엄',
    description: '마케터 생존기 프리미엄 구독으로 모든 기능을 이용하세요',
    brand: {
      '@type': 'Brand',
      name: '마케터 생존기',
    },
    image: `${siteUrl}/og-image.png`,
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
          url: `${siteUrl}/pricing`,
        },
        {
          '@type': 'Offer',
          name: '프로',
          price: '29900',
          priceCurrency: 'KRW',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/pricing`,
        },
        {
          '@type': 'Offer',
          name: '엔터프라이즈',
          price: '99000',
          priceCurrency: 'KRW',
          priceValidUntil: '2025-12-31',
          availability: 'https://schema.org/InStock',
          url: `${siteUrl}/pricing`,
        },
      ],
    },
  };

  return <JsonLd data={data} />;
}

export function SoftwareApplicationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://marketer-survival.com';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '마케터 생존기',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1200',
    },
    downloadUrl: siteUrl,
  };

  return <JsonLd data={data} />;
}
