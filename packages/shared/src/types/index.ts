// 게임 상태 타입
export type GameState =
  | 'intro'
  | 'clientSelect'
  | 'strategy'
  | 'execution'
  | 'analysis'
  | 'results'
  | 'growth'
  | 'gameover';

// 난이도
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

// 마케팅 채널
export type MarketingChannel = 'seo' | 'sns' | 'ads' | 'content' | 'email' | 'influencer';

// 이벤트 타입
export type EventType = 'good' | 'bad' | 'neutral' | 'critical';

// 구독 티어
export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

// 플레이어 인터페이스
export interface Player {
  id: string;
  name: string;
  email?: string;
  reputation: number;
  money: number;
  level: number;
  experience: number;
  completedProjects: number;
  totalEarnings: number;
  achievements: Achievement[];
  teamMembers: TeamMember[];
  unlockedChannels: MarketingChannel[];
  subscription: SubscriptionTier;
  createdAt: Date;
  lastPlayedAt: Date;
}

// 클라이언트 인터페이스
export interface Client {
  id: string;
  name: string;
  industry: string;
  companySize: 'startup' | 'small' | 'medium' | 'enterprise';
  budget: number;
  duration: number; // 일 단위
  difficulty: Difficulty;
  targetKPI: KPI;
  description: string;
  demands: string;
  personality: ClientPersonality;
  avatar?: string;
  unlockLevel: number;
}

// KPI 인터페이스
export interface KPI {
  visitors: number;
  conversion: number;
  leads: number;
  revenue?: number;
  brandAwareness?: number;
  engagement?: number;
}

// 클라이언트 성격
export interface ClientPersonality {
  patience: number; // 1-10
  flexibility: number; // 1-10
  expectation: number; // 1-10
  communicationStyle: 'formal' | 'casual' | 'demanding' | 'friendly';
}

// 마케팅 전략
export interface MarketingStrategy {
  seo: number;
  sns: number;
  ads: number;
  content: number;
  email: number;
  influencer: number;
}

// 채널 정보
export interface ChannelInfo {
  id: MarketingChannel;
  name: string;
  nameKo: string;
  icon: string;
  description: string;
  descriptionKo: string;
  costMultiplier: number;
  timeToEffect: 'instant' | 'fast' | 'medium' | 'slow';
  minLevel: number;
  effectivenessFactors: {
    visitorMultiplier: number;
    conversionMultiplier: number;
    brandMultiplier: number;
  };
}

// 게임 이벤트
export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  titleKo: string;
  message: string;
  messageKo: string;
  effect: EventEffect;
  probability: number;
  minDay: number;
  maxDay: number;
  requiredChannels?: MarketingChannel[];
}

// 이벤트 효과
export interface EventEffect {
  visitors?: number;
  conversion?: number;
  budget?: number;
  reputation?: number;
  days?: number;
  channelEffectiveness?: Partial<Record<MarketingChannel, number>>;
}

// 실행 결과
export interface ExecutionResult {
  day: number;
  visitors: number;
  leads: number;
  conversion: number;
  spend: number;
  events: GameEvent[];
  metrics: DailyMetrics;
}

// 일일 지표
export interface DailyMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

// 프로젝트 결과
export interface ProjectResult {
  success: boolean;
  visitors: number;
  targetVisitors: number;
  conversion: number;
  targetConversion: number;
  leads: number;
  targetLeads: number;
  payment: number;
  reputationChange: number;
  experienceGained: number;
  bonuses: Bonus[];
  feedback: ClientFeedback;
}

// 보너스
export interface Bonus {
  type: 'overperformance' | 'speed' | 'efficiency' | 'client_satisfaction';
  amount: number;
  description: string;
}

// 클라이언트 피드백
export interface ClientFeedback {
  satisfaction: number; // 1-5
  comment: string;
  willRecommend: boolean;
  repeatClient: boolean;
}

// 팀원
export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  level: number;
  salary: number;
  skills: TeamSkill[];
  avatar?: string;
}

// 팀 역할
export type TeamRole =
  | 'seo_specialist'
  | 'content_writer'
  | 'social_media_manager'
  | 'paid_ads_specialist'
  | 'data_analyst'
  | 'designer'
  | 'account_manager';

// 팀원 스킬 (팀원용 간단한 스킬)
export interface TeamSkill {
  name: string;
  level: number;
  channel?: MarketingChannel;
}

// 업적
export interface Achievement {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  icon: string;
  unlockedAt?: Date;
  reward?: {
    money?: number;
    reputation?: number;
    experience?: number;
  };
}

// 게임 세이브 데이터
export interface GameSave {
  id: string;
  playerId: string;
  player: Player;
  currentState: GameState;
  currentClient?: Client;
  currentStrategy?: MarketingStrategy;
  currentDay: number;
  executionProgress: number;
  executionResults: ExecutionResult[];
  savedAt: Date;
  version: string;
}

// 리더보드 항목
export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  level: number;
  totalEarnings: number;
  completedProjects: number;
  reputation: number;
}

// 구독 정보
export interface Subscription {
  tier: SubscriptionTier;
  features: SubscriptionFeature[];
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
}

// 구독 기능
export interface SubscriptionFeature {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  included: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 사용자 인증
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: SubscriptionTier;
  createdAt: Date;
}

// 결제 정보
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  subscription?: SubscriptionTier;
}
