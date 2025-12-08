import { ChannelInfo, MarketingChannel } from '../types';

export const CHANNELS: ChannelInfo[] = [
  {
    id: 'seo',
    name: 'SEO Optimization',
    nameKo: 'SEO 최적화',
    icon: '🔍',
    description: 'Search engine optimization for organic traffic',
    descriptionKo: '검색엔진 상위노출을 통한 자연 유입',
    costMultiplier: 0.8,
    timeToEffect: 'slow',
    minLevel: 1,
    effectivenessFactors: {
      visitorMultiplier: 1.5,
      conversionMultiplier: 1.2,
      brandMultiplier: 1.0,
    },
  },
  {
    id: 'sns',
    name: 'Social Media Marketing',
    nameKo: 'SNS 마케팅',
    icon: '📱',
    description: 'Instagram, TikTok, YouTube marketing',
    descriptionKo: '인스타그램, 틱톡, 유튜브 채널 운영',
    costMultiplier: 1.0,
    timeToEffect: 'medium',
    minLevel: 1,
    effectivenessFactors: {
      visitorMultiplier: 1.3,
      conversionMultiplier: 1.0,
      brandMultiplier: 1.5,
    },
  },
  {
    id: 'ads',
    name: 'Paid Advertising',
    nameKo: '유료 광고',
    icon: '💰',
    description: 'Google, Naver, Meta ads',
    descriptionKo: '구글, 네이버, 메타 광고 운영',
    costMultiplier: 1.5,
    timeToEffect: 'fast',
    minLevel: 1,
    effectivenessFactors: {
      visitorMultiplier: 2.0,
      conversionMultiplier: 1.3,
      brandMultiplier: 0.8,
    },
  },
  {
    id: 'content',
    name: 'Content Marketing',
    nameKo: '콘텐츠 마케팅',
    icon: '✍️',
    description: 'Blog, newsletter, whitepapers',
    descriptionKo: '블로그, 뉴스레터, 백서 작성',
    costMultiplier: 0.7,
    timeToEffect: 'slow',
    minLevel: 1,
    effectivenessFactors: {
      visitorMultiplier: 1.2,
      conversionMultiplier: 1.5,
      brandMultiplier: 1.3,
    },
  },
  {
    id: 'email',
    name: 'Email Marketing',
    nameKo: '이메일 마케팅',
    icon: '📧',
    description: 'Email campaigns and automation',
    descriptionKo: '이메일 캠페인 및 자동화',
    costMultiplier: 0.5,
    timeToEffect: 'fast',
    minLevel: 3,
    effectivenessFactors: {
      visitorMultiplier: 0.8,
      conversionMultiplier: 1.8,
      brandMultiplier: 0.5,
    },
  },
  {
    id: 'influencer',
    name: 'Influencer Marketing',
    nameKo: '인플루언서 마케팅',
    icon: '⭐',
    description: 'Collaborations with influencers',
    descriptionKo: '인플루언서 협업 및 스폰서십',
    costMultiplier: 2.0,
    timeToEffect: 'instant',
    minLevel: 5,
    effectivenessFactors: {
      visitorMultiplier: 2.5,
      conversionMultiplier: 1.1,
      brandMultiplier: 2.0,
    },
  },
];

export const getChannelById = (id: MarketingChannel): ChannelInfo | undefined => {
  return CHANNELS.find((channel) => channel.id === id);
};

export const getChannelsByLevel = (level: number): ChannelInfo[] => {
  return CHANNELS.filter((channel) => channel.minLevel <= level);
};

export const getTimeToEffectLabel = (effect: string): string => {
  const labels: Record<string, string> = {
    instant: '⚡ 즉시',
    fast: '🚀 빠름',
    medium: '🔄 보통',
    slow: '🐢 느림',
  };
  return labels[effect] || effect;
};

export const getCostLabel = (multiplier: number): string => {
  if (multiplier < 0.7) return '💚 매우 저렴';
  if (multiplier < 1.0) return '💚 저렴';
  if (multiplier === 1.0) return '💛 보통';
  if (multiplier < 1.5) return '💸 비쌈';
  return '💸 매우 비쌈';
};
