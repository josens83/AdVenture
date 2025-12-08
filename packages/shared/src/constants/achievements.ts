import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Project Milestones
  {
    id: 'first-project',
    name: 'First Project',
    nameKo: '첫 프로젝트 완료',
    description: 'Complete your first marketing project',
    descriptionKo: '첫 번째 마케팅 프로젝트를 완료하세요',
    icon: '🎯',
    reward: { money: 100000, experience: 50 },
  },
  {
    id: 'project-10',
    name: 'Experienced Marketer',
    nameKo: '경험 많은 마케터',
    description: 'Complete 10 projects',
    descriptionKo: '10개의 프로젝트를 완료하세요',
    icon: '📊',
    reward: { money: 500000, experience: 200 },
  },
  {
    id: 'project-50',
    name: 'Marketing Veteran',
    nameKo: '마케팅 베테랑',
    description: 'Complete 50 projects',
    descriptionKo: '50개의 프로젝트를 완료하세요',
    icon: '🏆',
    reward: { money: 2000000, experience: 1000 },
  },
  {
    id: 'project-100',
    name: 'Marketing Legend',
    nameKo: '마케팅 레전드',
    description: 'Complete 100 projects',
    descriptionKo: '100개의 프로젝트를 완료하세요',
    icon: '👑',
    reward: { money: 5000000, experience: 3000 },
  },

  // Success Streaks
  {
    id: 'streak-3',
    name: 'Hat Trick',
    nameKo: '해트트릭',
    description: 'Complete 3 projects in a row successfully',
    descriptionKo: '3개의 프로젝트를 연속으로 성공하세요',
    icon: '🎩',
    reward: { reputation: 10, experience: 100 },
  },
  {
    id: 'streak-5',
    name: 'On Fire',
    nameKo: '연승 행진',
    description: 'Complete 5 projects in a row successfully',
    descriptionKo: '5개의 프로젝트를 연속으로 성공하세요',
    icon: '🔥',
    reward: { reputation: 20, experience: 250 },
  },
  {
    id: 'streak-10',
    name: 'Unstoppable',
    nameKo: '무적',
    description: 'Complete 10 projects in a row successfully',
    descriptionKo: '10개의 프로젝트를 연속으로 성공하세요',
    icon: '💫',
    reward: { reputation: 50, money: 3000000 },
  },

  // Difficulty Achievements
  {
    id: 'first-hard',
    name: 'Challenge Accepted',
    nameKo: '도전 성공',
    description: 'Complete your first hard difficulty project',
    descriptionKo: '첫 번째 어려움 난이도 프로젝트를 완료하세요',
    icon: '💪',
    reward: { reputation: 15, experience: 200 },
  },
  {
    id: 'first-expert',
    name: 'Expert Mode',
    nameKo: '전문가 모드',
    description: 'Complete your first expert difficulty project',
    descriptionKo: '첫 번째 전문가 난이도 프로젝트를 완료하세요',
    icon: '🧠',
    reward: { reputation: 30, money: 2000000 },
  },

  // Financial Achievements
  {
    id: 'earn-10m',
    name: 'First Million',
    nameKo: '천만원 달성',
    description: 'Earn 10,000,000 KRW total',
    descriptionKo: '총 수익 1,000만원을 달성하세요',
    icon: '💵',
    reward: { experience: 100 },
  },
  {
    id: 'earn-100m',
    name: 'Eight Figures',
    nameKo: '억대 수익',
    description: 'Earn 100,000,000 KRW total',
    descriptionKo: '총 수익 1억원을 달성하세요',
    icon: '💰',
    reward: { experience: 500 },
  },
  {
    id: 'earn-1b',
    name: 'Billionaire',
    nameKo: '10억 클럽',
    description: 'Earn 1,000,000,000 KRW total',
    descriptionKo: '총 수익 10억원을 달성하세요',
    icon: '🤑',
    reward: { experience: 2000 },
  },

  // Reputation Achievements
  {
    id: 'reputation-80',
    name: 'Well Known',
    nameKo: '업계 유명인',
    description: 'Reach 80 reputation',
    descriptionKo: '평판 80점에 도달하세요',
    icon: '⭐',
    reward: { money: 500000 },
  },
  {
    id: 'reputation-100',
    name: 'Industry Star',
    nameKo: '업계 스타',
    description: 'Reach 100 reputation',
    descriptionKo: '평판 100점에 도달하세요',
    icon: '🌟',
    reward: { money: 1000000 },
  },

  // Level Achievements
  {
    id: 'level-5',
    name: 'Rising Star',
    nameKo: '떠오르는 별',
    description: 'Reach level 5',
    descriptionKo: '레벨 5에 도달하세요',
    icon: '📈',
    reward: { money: 300000 },
  },
  {
    id: 'level-10',
    name: 'Agency Director',
    nameKo: '에이전시 디렉터',
    description: 'Reach level 10',
    descriptionKo: '레벨 10에 도달하세요',
    icon: '🏢',
    reward: { money: 1000000 },
  },
  {
    id: 'level-20',
    name: 'Marketing Mogul',
    nameKo: '마케팅 거물',
    description: 'Reach level 20',
    descriptionKo: '레벨 20에 도달하세요',
    icon: '🎭',
    reward: { money: 5000000 },
  },

  // Special Achievements
  {
    id: 'perfect-score',
    name: 'Perfect Campaign',
    nameKo: '완벽한 캠페인',
    description: 'Exceed all KPIs by 50%',
    descriptionKo: '모든 KPI를 50% 이상 초과 달성하세요',
    icon: '💎',
    reward: { reputation: 25, money: 1000000 },
  },
  {
    id: 'comeback',
    name: 'The Comeback',
    nameKo: '역전승',
    description: 'Succeed after having less than 10 reputation',
    descriptionKo: '평판 10 미만에서 회복하여 프로젝트를 성공시키세요',
    icon: '🔄',
    reward: { reputation: 30, experience: 300 },
  },
  {
    id: 'all-channels',
    name: 'Omnichannel Master',
    nameKo: '옴니채널 마스터',
    description: 'Use all marketing channels in a single project',
    descriptionKo: '한 프로젝트에서 모든 마케팅 채널을 사용하세요',
    icon: '🎪',
    reward: { experience: 200 },
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    nameKo: '스피드 데몬',
    description: 'Complete a project 30% faster than expected',
    descriptionKo: '예상보다 30% 빠르게 프로젝트를 완료하세요',
    icon: '⚡',
    reward: { money: 500000, experience: 150 },
  },
  {
    id: 'budget-master',
    name: 'Budget Master',
    nameKo: '예산 달인',
    description: 'Complete a project using only 70% of budget',
    descriptionKo: '예산의 70%만 사용하여 프로젝트를 완료하세요',
    icon: '📉',
    reward: { money: 800000, experience: 150 },
  },

  // Team Achievements
  {
    id: 'first-hire',
    name: 'First Hire',
    nameKo: '첫 팀원',
    description: 'Hire your first team member',
    descriptionKo: '첫 번째 팀원을 고용하세요',
    icon: '👥',
    reward: { experience: 100 },
  },
  {
    id: 'full-team',
    name: 'Full Team',
    nameKo: '풀 팀',
    description: 'Have a team of 5 members',
    descriptionKo: '5명의 팀원을 보유하세요',
    icon: '🤝',
    reward: { reputation: 10, experience: 300 },
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
};

export const checkAchievements = (
  player: {
    completedProjects: number;
    reputation: number;
    money: number;
    totalEarnings: number;
    level: number;
    achievements: Achievement[];
    teamMembers: any[];
  },
  context?: {
    projectSuccess?: boolean;
    kpiExceeded?: number;
    budgetUsed?: number;
    daysUsed?: number;
    expectedDays?: number;
    channelsUsed?: string[];
    previousReputation?: number;
    successStreak?: number;
  }
): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const existingIds = player.achievements.map((a) => a.id);

  // Helper to check and add achievement
  const checkAndAdd = (id: string, condition: boolean) => {
    if (!existingIds.includes(id) && condition) {
      const achievement = getAchievementById(id);
      if (achievement) {
        newAchievements.push({ ...achievement, unlockedAt: new Date() });
      }
    }
  };

  // Project milestones
  checkAndAdd('first-project', player.completedProjects >= 1);
  checkAndAdd('project-10', player.completedProjects >= 10);
  checkAndAdd('project-50', player.completedProjects >= 50);
  checkAndAdd('project-100', player.completedProjects >= 100);

  // Financial achievements
  checkAndAdd('earn-10m', player.totalEarnings >= 10000000);
  checkAndAdd('earn-100m', player.totalEarnings >= 100000000);
  checkAndAdd('earn-1b', player.totalEarnings >= 1000000000);

  // Reputation achievements
  checkAndAdd('reputation-80', player.reputation >= 80);
  checkAndAdd('reputation-100', player.reputation >= 100);

  // Level achievements
  checkAndAdd('level-5', player.level >= 5);
  checkAndAdd('level-10', player.level >= 10);
  checkAndAdd('level-20', player.level >= 20);

  // Team achievements
  checkAndAdd('first-hire', player.teamMembers.length >= 1);
  checkAndAdd('full-team', player.teamMembers.length >= 5);

  // Context-based achievements
  if (context) {
    if (context.successStreak) {
      checkAndAdd('streak-3', context.successStreak >= 3);
      checkAndAdd('streak-5', context.successStreak >= 5);
      checkAndAdd('streak-10', context.successStreak >= 10);
    }

    if (context.kpiExceeded !== undefined) {
      checkAndAdd('perfect-score', context.kpiExceeded >= 50);
    }

    if (context.previousReputation !== undefined && context.projectSuccess) {
      checkAndAdd('comeback', context.previousReputation < 10);
    }

    if (context.channelsUsed) {
      const allChannels = ['seo', 'sns', 'ads', 'content', 'email', 'influencer'];
      const hasAll = allChannels.every((c) => context.channelsUsed?.includes(c));
      checkAndAdd('all-channels', hasAll);
    }

    if (context.daysUsed && context.expectedDays) {
      const speedRatio = context.daysUsed / context.expectedDays;
      checkAndAdd('speed-demon', speedRatio <= 0.7);
    }

    if (context.budgetUsed !== undefined) {
      checkAndAdd('budget-master', context.budgetUsed <= 0.7);
    }
  }

  return newAchievements;
};
