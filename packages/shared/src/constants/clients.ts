import { Client } from '../types';

export const CLIENTS: Client[] = [
  // Easy Clients
  {
    id: 'foodtech-startup',
    name: '푸드테크 스타트업',
    industry: '음식 배달 앱',
    companySize: 'startup',
    budget: 3000000,
    duration: 30,
    difficulty: 'easy',
    targetKPI: {
      visitors: 5000,
      conversion: 2.0,
      leads: 100,
    },
    description: '신규 음식 배달 앱 런칭. 초기 사용자 확보가 목표입니다. 젊은 직장인을 타겟으로 합니다.',
    demands: '빠른 성과를 원함',
    personality: {
      patience: 6,
      flexibility: 8,
      expectation: 5,
      communicationStyle: 'casual',
    },
    avatar: '/avatars/foodtech.png',
    unlockLevel: 1,
  },
  {
    id: 'local-cafe',
    name: '동네 카페 "브루잉"',
    industry: '카페 프랜차이즈',
    companySize: 'small',
    budget: 2000000,
    duration: 21,
    difficulty: 'easy',
    targetKPI: {
      visitors: 3000,
      conversion: 3.0,
      leads: 90,
    },
    description: '로컬 카페 체인의 온라인 주문 시스템 홍보. 반경 5km 내 고객 확보 필요.',
    demands: '지역 타겟팅 중시',
    personality: {
      patience: 8,
      flexibility: 7,
      expectation: 4,
      communicationStyle: 'friendly',
    },
    unlockLevel: 1,
  },

  // Medium Clients
  {
    id: 'fashion-brand',
    name: '패션 브랜드 "모던룩"',
    industry: '온라인 쇼핑몰',
    companySize: 'small',
    budget: 5000000,
    duration: 45,
    difficulty: 'medium',
    targetKPI: {
      visitors: 10000,
      conversion: 3.0,
      leads: 300,
    },
    description: 'MZ세대 타겟 패션 쇼핑몰. 브랜드 인지도 상승과 첫 구매 전환이 핵심입니다.',
    demands: 'SNS 바이럴 중시',
    personality: {
      patience: 5,
      flexibility: 6,
      expectation: 7,
      communicationStyle: 'demanding',
    },
    avatar: '/avatars/fashion.png',
    unlockLevel: 2,
  },
  {
    id: 'fitness-app',
    name: '피트니스 앱 "헬시미"',
    industry: '헬스케어 앱',
    companySize: 'startup',
    budget: 4500000,
    duration: 40,
    difficulty: 'medium',
    targetKPI: {
      visitors: 8000,
      conversion: 2.5,
      leads: 200,
    },
    description: '개인 맞춤 운동 추천 앱. 앱 다운로드와 유료 구독 전환이 목표.',
    demands: '인플루언서 마케팅 선호',
    personality: {
      patience: 6,
      flexibility: 7,
      expectation: 6,
      communicationStyle: 'casual',
    },
    unlockLevel: 2,
  },
  {
    id: 'edu-platform',
    name: '온라인 교육 "런앤그로우"',
    industry: '에듀테크',
    companySize: 'medium',
    budget: 6000000,
    duration: 50,
    difficulty: 'medium',
    targetKPI: {
      visitors: 12000,
      conversion: 2.0,
      leads: 240,
    },
    description: '성인 대상 온라인 강의 플랫폼. 무료 체험 신청 유도가 핵심.',
    demands: '콘텐츠 마케팅 중심 요청',
    personality: {
      patience: 7,
      flexibility: 5,
      expectation: 7,
      communicationStyle: 'formal',
    },
    unlockLevel: 3,
  },

  // Hard Clients
  {
    id: 'b2b-saas',
    name: 'B2B SaaS "클라우드원"',
    industry: 'IT 솔루션',
    companySize: 'medium',
    budget: 8000000,
    duration: 60,
    difficulty: 'hard',
    targetKPI: {
      visitors: 3000,
      conversion: 5.0,
      leads: 150,
    },
    description: '기업용 클라우드 서비스. 고품질 B2B 리드 확보가 목표입니다.',
    demands: '전문성 있는 콘텐츠 필요',
    personality: {
      patience: 4,
      flexibility: 4,
      expectation: 9,
      communicationStyle: 'formal',
    },
    avatar: '/avatars/saas.png',
    unlockLevel: 4,
  },
  {
    id: 'fintech-startup',
    name: '핀테크 "페이이지"',
    industry: '금융 서비스',
    companySize: 'startup',
    budget: 10000000,
    duration: 60,
    difficulty: 'hard',
    targetKPI: {
      visitors: 15000,
      conversion: 4.0,
      leads: 600,
    },
    description: '간편 결제 서비스 앱. 신뢰도 구축과 앱 설치가 핵심 지표.',
    demands: '보안 및 신뢰성 강조 필수',
    personality: {
      patience: 3,
      flexibility: 3,
      expectation: 9,
      communicationStyle: 'demanding',
    },
    unlockLevel: 5,
  },
  {
    id: 'luxury-brand',
    name: '럭셔리 브랜드 "엘레강스"',
    industry: '명품 패션',
    companySize: 'enterprise',
    budget: 15000000,
    duration: 90,
    difficulty: 'hard',
    targetKPI: {
      visitors: 8000,
      conversion: 6.0,
      leads: 480,
      brandAwareness: 30,
    },
    description: '하이엔드 패션 브랜드의 국내 런칭. 브랜드 포지셔닝과 VIP 고객 확보.',
    demands: '품격 있는 콘텐츠만 허용',
    personality: {
      patience: 2,
      flexibility: 2,
      expectation: 10,
      communicationStyle: 'formal',
    },
    unlockLevel: 6,
  },

  // Expert Clients
  {
    id: 'global-expansion',
    name: '글로벌 진출 "코리아굿즈"',
    industry: 'K-뷰티/K-푸드',
    companySize: 'medium',
    budget: 20000000,
    duration: 90,
    difficulty: 'expert',
    targetKPI: {
      visitors: 50000,
      conversion: 3.5,
      leads: 1750,
      revenue: 100000000,
    },
    description: '한국 제품 해외 직판몰. 미국/일본/동남아 3개국 동시 진출.',
    demands: '다국어 콘텐츠 및 현지화 필수',
    personality: {
      patience: 3,
      flexibility: 4,
      expectation: 10,
      communicationStyle: 'demanding',
    },
    unlockLevel: 8,
  },
  {
    id: 'ipo-company',
    name: 'IPO 준비 기업 "테크노바"',
    industry: 'AI 솔루션',
    companySize: 'enterprise',
    budget: 30000000,
    duration: 120,
    difficulty: 'expert',
    targetKPI: {
      visitors: 20000,
      conversion: 8.0,
      leads: 1600,
      brandAwareness: 50,
    },
    description: 'IPO를 앞둔 AI 기업. 투자자 및 잠재 고객 대상 브랜드 인지도 극대화.',
    demands: 'IR 연계 마케팅, 보도자료 필수',
    personality: {
      patience: 2,
      flexibility: 2,
      expectation: 10,
      communicationStyle: 'formal',
    },
    unlockLevel: 10,
  },
];

export const getClientsByDifficulty = (difficulty: string): Client[] => {
  return CLIENTS.filter((client) => client.difficulty === difficulty);
};

export const getClientsByLevel = (level: number): Client[] => {
  return CLIENTS.filter((client) => client.unlockLevel <= level);
};

export const getClientById = (id: string): Client | undefined => {
  return CLIENTS.find((client) => client.id === id);
};
