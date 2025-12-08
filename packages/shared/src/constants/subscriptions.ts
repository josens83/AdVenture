import { Subscription, SubscriptionTier } from '../types';

export const SUBSCRIPTIONS: Record<SubscriptionTier, Subscription> = {
  free: {
    tier: 'free',
    features: [
      {
        id: 'basic-clients',
        name: 'Basic Clients',
        nameKo: '기본 클라이언트',
        description: 'Access to easy difficulty clients only',
        descriptionKo: '쉬움 난이도 클라이언트만 이용 가능',
        included: true,
      },
      {
        id: 'basic-channels',
        name: 'Basic Channels',
        nameKo: '기본 채널',
        description: 'Access to 4 basic marketing channels',
        descriptionKo: '4개의 기본 마케팅 채널 이용 가능',
        included: true,
      },
      {
        id: 'save-slots',
        name: '1 Save Slot',
        nameKo: '1개 저장 슬롯',
        description: 'One game save slot',
        descriptionKo: '게임 저장 슬롯 1개',
        included: true,
      },
      {
        id: 'ads',
        name: 'Contains Ads',
        nameKo: '광고 포함',
        description: 'Ad-supported gameplay',
        descriptionKo: '광고가 포함된 게임플레이',
        included: true,
      },
      {
        id: 'leaderboard',
        name: 'Leaderboard',
        nameKo: '리더보드',
        description: 'View global leaderboard',
        descriptionKo: '글로벌 리더보드 조회',
        included: false,
      },
      {
        id: 'team-hiring',
        name: 'Team Hiring',
        nameKo: '팀원 고용',
        description: 'Hire team members',
        descriptionKo: '팀원 고용 기능',
        included: false,
      },
    ],
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'KRW',
    },
  },
  starter: {
    tier: 'starter',
    features: [
      {
        id: 'medium-clients',
        name: 'Medium Clients',
        nameKo: '중급 클라이언트',
        description: 'Access to easy and medium difficulty clients',
        descriptionKo: '쉬움/보통 난이도 클라이언트 이용 가능',
        included: true,
      },
      {
        id: 'all-channels',
        name: 'All Channels',
        nameKo: '모든 채널',
        description: 'Access to all 6 marketing channels',
        descriptionKo: '6개의 모든 마케팅 채널 이용 가능',
        included: true,
      },
      {
        id: 'save-slots',
        name: '3 Save Slots',
        nameKo: '3개 저장 슬롯',
        description: 'Three game save slots',
        descriptionKo: '게임 저장 슬롯 3개',
        included: true,
      },
      {
        id: 'no-ads',
        name: 'Ad-Free',
        nameKo: '광고 없음',
        description: 'No advertisements',
        descriptionKo: '광고 없는 게임플레이',
        included: true,
      },
      {
        id: 'leaderboard',
        name: 'Leaderboard',
        nameKo: '리더보드',
        description: 'View and compete on leaderboard',
        descriptionKo: '리더보드 조회 및 경쟁',
        included: true,
      },
      {
        id: 'team-hiring',
        name: 'Team Hiring',
        nameKo: '팀원 고용',
        description: 'Hire up to 2 team members',
        descriptionKo: '최대 2명의 팀원 고용',
        included: true,
      },
      {
        id: 'statistics',
        name: 'Basic Statistics',
        nameKo: '기본 통계',
        description: 'View basic game statistics',
        descriptionKo: '기본 게임 통계 조회',
        included: true,
      },
    ],
    price: {
      monthly: 4900,
      yearly: 49000,
      currency: 'KRW',
    },
  },
  pro: {
    tier: 'pro',
    features: [
      {
        id: 'all-clients',
        name: 'All Clients',
        nameKo: '모든 클라이언트',
        description: 'Access to all difficulty levels',
        descriptionKo: '모든 난이도 클라이언트 이용 가능',
        included: true,
      },
      {
        id: 'all-channels',
        name: 'All Channels',
        nameKo: '모든 채널',
        description: 'Access to all marketing channels',
        descriptionKo: '모든 마케팅 채널 이용 가능',
        included: true,
      },
      {
        id: 'unlimited-saves',
        name: 'Unlimited Saves',
        nameKo: '무제한 저장',
        description: 'Unlimited game save slots',
        descriptionKo: '무제한 게임 저장 슬롯',
        included: true,
      },
      {
        id: 'no-ads',
        name: 'Ad-Free',
        nameKo: '광고 없음',
        description: 'No advertisements',
        descriptionKo: '광고 없는 게임플레이',
        included: true,
      },
      {
        id: 'leaderboard',
        name: 'Leaderboard',
        nameKo: '리더보드',
        description: 'View and compete on leaderboard',
        descriptionKo: '리더보드 조회 및 경쟁',
        included: true,
      },
      {
        id: 'team-hiring',
        name: 'Full Team',
        nameKo: '풀 팀',
        description: 'Hire up to 5 team members',
        descriptionKo: '최대 5명의 팀원 고용',
        included: true,
      },
      {
        id: 'advanced-stats',
        name: 'Advanced Statistics',
        nameKo: '고급 통계',
        description: 'Detailed analytics and insights',
        descriptionKo: '상세한 분석 및 인사이트',
        included: true,
      },
      {
        id: 'exclusive-events',
        name: 'Exclusive Events',
        nameKo: '독점 이벤트',
        description: 'Access to special game events',
        descriptionKo: '특별 게임 이벤트 참여',
        included: true,
      },
      {
        id: 'priority-support',
        name: 'Priority Support',
        nameKo: '우선 지원',
        description: 'Priority customer support',
        descriptionKo: '우선 고객 지원',
        included: true,
      },
    ],
    price: {
      monthly: 9900,
      yearly: 99000,
      currency: 'KRW',
    },
  },
  enterprise: {
    tier: 'enterprise',
    features: [
      {
        id: 'all-features',
        name: 'All Features',
        nameKo: '모든 기능',
        description: 'Access to all game features',
        descriptionKo: '모든 게임 기능 이용 가능',
        included: true,
      },
      {
        id: 'custom-scenarios',
        name: 'Custom Scenarios',
        nameKo: '커스텀 시나리오',
        description: 'Create custom client scenarios',
        descriptionKo: '커스텀 클라이언트 시나리오 생성',
        included: true,
      },
      {
        id: 'team-features',
        name: 'Team Features',
        nameKo: '팀 기능',
        description: 'Multi-user team accounts',
        descriptionKo: '다중 사용자 팀 계정',
        included: true,
      },
      {
        id: 'api-access',
        name: 'API Access',
        nameKo: 'API 접근',
        description: 'Access to game API for integrations',
        descriptionKo: '통합을 위한 게임 API 접근',
        included: true,
      },
      {
        id: 'white-label',
        name: 'White Label',
        nameKo: '화이트 라벨',
        description: 'Custom branding options',
        descriptionKo: '커스텀 브랜딩 옵션',
        included: true,
      },
      {
        id: 'training-mode',
        name: 'Training Mode',
        nameKo: '교육 모드',
        description: 'Employee training mode',
        descriptionKo: '직원 교육 모드',
        included: true,
      },
      {
        id: 'dedicated-support',
        name: 'Dedicated Support',
        nameKo: '전담 지원',
        description: 'Dedicated account manager',
        descriptionKo: '전담 계정 관리자',
        included: true,
      },
    ],
    price: {
      monthly: 49900,
      yearly: 499000,
      currency: 'KRW',
    },
  },
};

export const getSubscription = (tier: SubscriptionTier): Subscription => {
  return SUBSCRIPTIONS[tier];
};

export const getSubscriptionPrice = (
  tier: SubscriptionTier,
  period: 'monthly' | 'yearly'
): number => {
  return SUBSCRIPTIONS[tier].price[period];
};

export const formatSubscriptionPrice = (
  tier: SubscriptionTier,
  period: 'monthly' | 'yearly'
): string => {
  const price = getSubscriptionPrice(tier, period);
  if (price === 0) return '무료';
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

export const canAccessFeature = (
  userTier: SubscriptionTier,
  featureId: string
): boolean => {
  const subscription = SUBSCRIPTIONS[userTier];
  const feature = subscription.features.find((f) => f.id === featureId);
  return feature?.included ?? false;
};

export const getYearlyDiscount = (tier: SubscriptionTier): number => {
  const monthly = SUBSCRIPTIONS[tier].price.monthly;
  const yearly = SUBSCRIPTIONS[tier].price.yearly;
  if (monthly === 0) return 0;
  const fullYear = monthly * 12;
  return Math.round(((fullYear - yearly) / fullYear) * 100);
};
