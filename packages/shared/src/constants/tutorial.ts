// Tutorial System Constants
export interface TutorialStep {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  target?: string; // CSS selector or component name to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: TutorialAction;
  condition?: TutorialCondition;
  reward?: TutorialReward;
}

export type TutorialAction =
  | 'click'
  | 'input'
  | 'select'
  | 'wait'
  | 'complete_project';

export interface TutorialCondition {
  type: 'state' | 'action' | 'value';
  key: string;
  value?: string | number | boolean;
}

export interface TutorialReward {
  money?: number;
  experience?: number;
  reputation?: number;
}

// Intro Tutorial (for new players)
export const INTRO_TUTORIAL: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Marketer Survival!',
    titleKo: '마케터 생존기에 오신 것을 환영합니다!',
    description: 'You are a new marketer at a digital agency. Your goal is to successfully complete client projects and grow your reputation.',
    descriptionKo: '당신은 디지털 에이전시의 신입 마케터입니다. 클라이언트 프로젝트를 성공적으로 완료하고 평판을 성장시키세요.',
    position: 'center',
    action: 'click',
  },
  {
    id: 'check_status',
    title: 'Your Status',
    titleKo: '당신의 상태',
    description: 'Here you can see your money, reputation, and level. Keep your reputation above 0 to survive!',
    descriptionKo: '여기서 자금, 평판, 레벨을 확인할 수 있습니다. 평판이 0 이하로 떨어지면 게임 오버입니다!',
    target: '.game-header',
    position: 'bottom',
    action: 'click',
  },
  {
    id: 'select_client',
    title: 'Select a Client',
    titleKo: '클라이언트 선택',
    description: 'Choose a client project to work on. Different clients have different budgets and requirements.',
    descriptionKo: '작업할 클라이언트 프로젝트를 선택하세요. 클라이언트마다 예산과 요구사항이 다릅니다.',
    target: '.client-list',
    position: 'right',
    action: 'select',
  },
  {
    id: 'understand_kpi',
    title: 'KPI Goals',
    titleKo: 'KPI 목표',
    description: 'Each client has specific KPI goals you need to achieve: visitors, conversion rate, and leads.',
    descriptionKo: '각 클라이언트에는 달성해야 할 KPI 목표가 있습니다: 방문자 수, 전환율, 리드 수.',
    target: '.client-kpi',
    position: 'left',
    action: 'click',
  },
  {
    id: 'set_strategy',
    title: 'Set Your Strategy',
    titleKo: '전략 설정',
    description: 'Allocate the budget across different marketing channels. Each channel has different strengths.',
    descriptionKo: '예산을 여러 마케팅 채널에 분배하세요. 각 채널은 서로 다른 강점을 가지고 있습니다.',
    target: '.strategy-sliders',
    position: 'right',
    action: 'input',
  },
  {
    id: 'understand_channels',
    title: 'Marketing Channels',
    titleKo: '마케팅 채널',
    description: 'SEO builds organic traffic, SNS creates engagement, Ads bring quick results, and Content builds long-term value.',
    descriptionKo: 'SEO는 유기적 트래픽, SNS는 참여도, 광고는 즉각적 결과, 콘텐츠는 장기적 가치를 만듭니다.',
    target: '.channel-info',
    position: 'bottom',
    action: 'click',
  },
  {
    id: 'start_execution',
    title: 'Start Execution',
    titleKo: '실행 시작',
    description: 'Once your strategy is set, click Start to begin the marketing campaign!',
    descriptionKo: '전략이 설정되면 시작 버튼을 클릭하여 마케팅 캠페인을 시작하세요!',
    target: '.start-button',
    position: 'top',
    action: 'click',
  },
  {
    id: 'watch_progress',
    title: 'Campaign Progress',
    titleKo: '캠페인 진행',
    description: 'Watch your campaign progress day by day. Random events may occur that affect your results.',
    descriptionKo: '캠페인 진행 상황을 매일 확인하세요. 랜덤 이벤트가 발생하여 결과에 영향을 줄 수 있습니다.',
    target: '.execution-progress',
    position: 'right',
    action: 'wait',
  },
  {
    id: 'view_results',
    title: 'Project Results',
    titleKo: '프로젝트 결과',
    description: 'See how well you performed against the KPI goals. Success brings payment and reputation increase!',
    descriptionKo: 'KPI 목표 대비 성과를 확인하세요. 성공하면 보수와 평판이 올라갑니다!',
    target: '.results-panel',
    position: 'center',
    action: 'click',
    reward: {
      money: 100000,
      experience: 10,
    },
  },
  {
    id: 'tutorial_complete',
    title: 'Tutorial Complete!',
    titleKo: '튜토리얼 완료!',
    description: 'You\'ve learned the basics! Now go out there and become a marketing legend!',
    descriptionKo: '기본을 배웠습니다! 이제 나가서 마케팅 전설이 되어보세요!',
    position: 'center',
    action: 'click',
    reward: {
      money: 500000,
      experience: 50,
      reputation: 5,
    },
  },
];

// Advanced Tutorial (unlocked at level 3)
export const ADVANCED_TUTORIAL: TutorialStep[] = [
  {
    id: 'adv_intro',
    title: 'Advanced Marketing',
    titleKo: '고급 마케팅',
    description: 'You\'ve reached Level 3! Let\'s learn about advanced marketing features.',
    descriptionKo: '레벨 3에 도달했습니다! 고급 마케팅 기능을 배워봅시다.',
    position: 'center',
    action: 'click',
  },
  {
    id: 'email_channel',
    title: 'Email Marketing',
    titleKo: '이메일 마케팅',
    description: 'Email marketing is now unlocked! It\'s great for nurturing leads and repeat customers.',
    descriptionKo: '이메일 마케팅이 해금되었습니다! 리드 육성과 재방문 고객에 효과적입니다.',
    target: '.channel-email',
    position: 'right',
    action: 'click',
  },
  {
    id: 'skills_intro',
    title: 'Skill System',
    titleKo: '스킬 시스템',
    description: 'Earn skill points by completing projects. Invest them to specialize in marketing areas!',
    descriptionKo: '프로젝트를 완료하여 스킬 포인트를 획득하세요. 마케팅 분야에 특화할 수 있습니다!',
    target: '.skills-button',
    position: 'bottom',
    action: 'click',
  },
  {
    id: 'harder_clients',
    title: 'Harder Clients',
    titleKo: '더 어려운 클라이언트',
    description: 'Higher level clients have bigger budgets but stricter requirements. Choose wisely!',
    descriptionKo: '높은 레벨의 클라이언트는 예산이 크지만 요구사항도 엄격합니다. 신중하게 선택하세요!',
    position: 'center',
    action: 'click',
    reward: {
      experience: 25,
    },
  },
];

// Pro Tutorial (unlocked at level 5)
export const PRO_TUTORIAL: TutorialStep[] = [
  {
    id: 'pro_intro',
    title: 'Professional Marketing',
    titleKo: '프로페셔널 마케팅',
    description: 'Welcome to Level 5! You\'re now a professional marketer with access to influencer marketing.',
    descriptionKo: '레벨 5에 오신 것을 환영합니다! 이제 인플루언서 마케팅에 접근할 수 있습니다.',
    position: 'center',
    action: 'click',
  },
  {
    id: 'influencer_channel',
    title: 'Influencer Marketing',
    titleKo: '인플루언서 마케팅',
    description: 'Influencer marketing can bring massive reach but is expensive. Use it for premium clients!',
    descriptionKo: '인플루언서 마케팅은 대규모 도달을 가져오지만 비용이 높습니다. 프리미엄 클라이언트에 활용하세요!',
    target: '.channel-influencer',
    position: 'right',
    action: 'click',
  },
  {
    id: 'team_building',
    title: 'Team Building',
    titleKo: '팀 빌딩',
    description: 'With a paid subscription, you can hire team members to boost your marketing effectiveness!',
    descriptionKo: '유료 구독으로 팀원을 고용하여 마케팅 효과를 높일 수 있습니다!',
    target: '.team-panel',
    position: 'left',
    action: 'click',
    reward: {
      experience: 50,
    },
  },
];

// Get tutorial by type
export function getTutorialSteps(type: string): TutorialStep[] {
  switch (type) {
    case 'intro':
      return INTRO_TUTORIAL;
    case 'advanced':
      return ADVANCED_TUTORIAL;
    case 'pro':
      return PRO_TUTORIAL;
    default:
      return INTRO_TUTORIAL;
  }
}

// Get next uncompleted step
export function getNextStep(
  type: string,
  completedSteps: string[]
): TutorialStep | null {
  const steps = getTutorialSteps(type);
  return steps.find((step) => !completedSteps.includes(step.id)) || null;
}

// Check if tutorial is complete
export function isTutorialComplete(
  type: string,
  completedSteps: string[]
): boolean {
  const steps = getTutorialSteps(type);
  return steps.every((step) => completedSteps.includes(step.id));
}

// Get tutorial progress percentage
export function getTutorialProgress(
  type: string,
  completedSteps: string[]
): number {
  const steps = getTutorialSteps(type);
  const completed = steps.filter((step) =>
    completedSteps.includes(step.id)
  ).length;
  return Math.round((completed / steps.length) * 100);
}
