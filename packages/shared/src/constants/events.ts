import { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  // Good Events
  {
    id: 'viral-content',
    type: 'good',
    title: 'Content Goes Viral',
    titleKo: '콘텐츠 바이럴!',
    message: 'Your content went viral on social media!',
    messageKo: '🎉 콘텐츠가 SNS에서 바이럴되었습니다! 방문자 +30%',
    effect: { visitors: 1.3 },
    probability: 0.08,
    minDay: 3,
    maxDay: 999,
    requiredChannels: ['sns', 'content'],
  },
  {
    id: 'influencer-share',
    type: 'good',
    title: 'Influencer Mention',
    titleKo: '인플루언서 언급',
    message: 'An influencer organically shared your content!',
    messageKo: '💬 인플루언서가 자발적으로 공유했습니다! 방문자 +20%',
    effect: { visitors: 1.2, reputation: 5 },
    probability: 0.06,
    minDay: 5,
    maxDay: 999,
  },
  {
    id: 'press-coverage',
    type: 'good',
    title: 'Press Coverage',
    titleKo: '언론 보도',
    message: 'Your campaign got covered by media!',
    messageKo: '📰 캠페인이 언론에 소개되었습니다! 브랜드 인지도 상승',
    effect: { visitors: 1.25, reputation: 10 },
    probability: 0.04,
    minDay: 10,
    maxDay: 999,
  },
  {
    id: 'seasonal-boost',
    type: 'good',
    title: 'Seasonal Trend',
    titleKo: '시즌 트렌드',
    message: 'Your product aligns with a trending topic!',
    messageKo: '📈 제품이 시즌 트렌드와 맞아떨어졌습니다! 전환율 +15%',
    effect: { conversion: 1.15 },
    probability: 0.07,
    minDay: 7,
    maxDay: 999,
  },
  {
    id: 'organic-seo-boost',
    type: 'good',
    title: 'SEO Breakthrough',
    titleKo: 'SEO 급상승',
    message: 'Your content reached page 1 of search results!',
    messageKo: '🔍 검색 결과 1페이지에 노출되었습니다! 자연 유입 +40%',
    effect: { visitors: 1.4 },
    probability: 0.05,
    minDay: 14,
    maxDay: 999,
    requiredChannels: ['seo'],
  },

  // Bad Events
  {
    id: 'ad-account-suspended',
    type: 'bad',
    title: 'Ad Account Suspended',
    titleKo: '광고 계정 정지',
    message: 'Your ad account was temporarily suspended!',
    messageKo: '😰 광고 계정이 정지되었습니다. 2일 손실',
    effect: { days: -2, channelEffectiveness: { ads: 0 } },
    probability: 0.05,
    minDay: 1,
    maxDay: 999,
    requiredChannels: ['ads'],
  },
  {
    id: 'negative-review',
    type: 'bad',
    title: 'Negative Reviews',
    titleKo: '부정적 리뷰',
    message: 'Negative reviews are affecting your campaign!',
    messageKo: '😤 부정적 리뷰가 확산되고 있습니다. 전환율 -10%',
    effect: { conversion: 0.9, reputation: -5 },
    probability: 0.08,
    minDay: 5,
    maxDay: 999,
  },
  {
    id: 'competitor-attack',
    type: 'bad',
    title: 'Competitor Campaign',
    titleKo: '경쟁사 공세',
    message: 'A competitor launched an aggressive campaign!',
    messageKo: '📈 경쟁사가 공격적 마케팅 시작. 광고 단가 상승',
    effect: { budget: 0.85 },
    probability: 0.1,
    minDay: 7,
    maxDay: 999,
  },
  {
    id: 'client-revision',
    type: 'bad',
    title: 'Client Revision Request',
    titleKo: '클라이언트 수정 요청',
    message: 'Client requested urgent revisions!',
    messageKo: '😤 클라이언트가 급하게 수정 요청. 1일 손실',
    effect: { days: -1 },
    probability: 0.12,
    minDay: 3,
    maxDay: 999,
  },
  {
    id: 'platform-bug',
    type: 'bad',
    title: 'Platform Technical Issue',
    titleKo: '플랫폼 기술 오류',
    message: 'A platform bug affected your tracking!',
    messageKo: '🔧 플랫폼 오류로 트래킹이 누락되었습니다.',
    effect: { visitors: 0.95 },
    probability: 0.06,
    minDay: 1,
    maxDay: 999,
  },

  // Neutral Events
  {
    id: 'algorithm-update',
    type: 'neutral',
    title: 'Algorithm Update',
    titleKo: '알고리즘 업데이트',
    message: 'A major algorithm update requires strategy adjustment!',
    messageKo: '📊 구글 알고리즘 업데이트. SEO 전략 재검토 필요',
    effect: { channelEffectiveness: { seo: 0.8, content: 0.9 } },
    probability: 0.07,
    minDay: 10,
    maxDay: 999,
  },
  {
    id: 'market-shift',
    type: 'neutral',
    title: 'Market Trend Shift',
    titleKo: '시장 트렌드 변화',
    message: 'Market trends are shifting!',
    messageKo: '🔄 시장 트렌드가 변화하고 있습니다. 전략 조정 권장',
    effect: {},
    probability: 0.1,
    minDay: 14,
    maxDay: 999,
  },
  {
    id: 'privacy-regulation',
    type: 'neutral',
    title: 'Privacy Regulation',
    titleKo: '개인정보 규제 강화',
    message: 'New privacy regulations affect targeting options!',
    messageKo: '🔒 개인정보 규제 강화로 타겟팅 옵션이 제한됩니다.',
    effect: { channelEffectiveness: { ads: 0.9 } },
    probability: 0.05,
    minDay: 20,
    maxDay: 999,
  },

  // Critical Events
  {
    id: 'mega-viral',
    type: 'critical',
    title: 'Mega Viral!',
    titleKo: '메가 바이럴!',
    message: 'Your campaign became a cultural phenomenon!',
    messageKo: '🚀 캠페인이 문화 현상이 되었습니다! 모든 지표 +50%',
    effect: { visitors: 1.5, conversion: 1.5, reputation: 20 },
    probability: 0.02,
    minDay: 15,
    maxDay: 999,
  },
  {
    id: 'pr-crisis',
    type: 'critical',
    title: 'PR Crisis',
    titleKo: 'PR 위기',
    message: 'A PR crisis requires immediate attention!',
    messageKo: '🚨 PR 위기 발생! 즉각적인 대응이 필요합니다.',
    effect: { reputation: -15, conversion: 0.7 },
    probability: 0.03,
    minDay: 10,
    maxDay: 999,
  },
];

export const getRandomEvent = (
  day: number,
  activeChannels: string[]
): GameEvent | null => {
  const eligibleEvents = GAME_EVENTS.filter((event) => {
    // Check day constraints
    if (day < event.minDay || day > event.maxDay) return false;

    // Check channel requirements
    if (event.requiredChannels) {
      const hasRequiredChannel = event.requiredChannels.some((channel) =>
        activeChannels.includes(channel)
      );
      if (!hasRequiredChannel) return false;
    }

    return true;
  });

  // Calculate total probability
  const totalProbability = eligibleEvents.reduce(
    (sum, event) => sum + event.probability,
    0
  );

  // Roll for event
  const roll = Math.random();
  let cumulativeProbability = 0;

  for (const event of eligibleEvents) {
    cumulativeProbability += event.probability;
    if (roll <= cumulativeProbability) {
      return event;
    }
  }

  return null;
};

export const getEventsByType = (type: string): GameEvent[] => {
  return GAME_EVENTS.filter((event) => event.type === type);
};
