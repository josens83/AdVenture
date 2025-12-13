// Marketing Skill Tree System
export interface Skill {
  id: string;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  icon: string;
  category: SkillCategory;
  maxLevel: number;
  unlockLevel: number; // Player level required
  prerequisiteSkills?: string[]; // Other skills required
  effects: SkillEffect[];
}

export type SkillCategory =
  | 'seo'
  | 'sns'
  | 'ads'
  | 'content'
  | 'email'
  | 'influencer'
  | 'analytics'
  | 'management';

export interface SkillEffect {
  type: SkillEffectType;
  value: number; // Per level multiplier
  channel?: string; // Which channel this affects
}

export type SkillEffectType =
  | 'channel_effectiveness' // Increase channel effectiveness
  | 'cost_reduction' // Reduce channel cost
  | 'conversion_boost' // Boost conversion rate
  | 'reputation_bonus' // Extra reputation on success
  | 'experience_bonus' // Extra XP gain
  | 'event_luck' // Better random events
  | 'budget_efficiency' // More effective budget usage
  | 'client_satisfaction'; // Better client feedback

// Experience required per skill level
export const SKILL_EXP_PER_LEVEL = [
  0, // Level 0 (not learned)
  100, // Level 1
  250, // Level 2
  500, // Level 3
  1000, // Level 4
  2000, // Level 5 (max for most skills)
];

// All available skills
export const SKILLS: Skill[] = [
  // SEO Skills
  {
    id: 'seo_fundamentals',
    name: 'SEO Fundamentals',
    nameKo: 'SEO 기초',
    description: 'Master the basics of Search Engine Optimization',
    descriptionKo: '검색 엔진 최적화의 기본을 마스터합니다',
    icon: '🔍',
    category: 'seo',
    maxLevel: 5,
    unlockLevel: 1,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'seo' },
    ],
  },
  {
    id: 'keyword_research',
    name: 'Keyword Research',
    nameKo: '키워드 리서치',
    description: 'Expert at finding high-value keywords',
    descriptionKo: '고가치 키워드를 발굴하는 전문가가 됩니다',
    icon: '🎯',
    category: 'seo',
    maxLevel: 5,
    unlockLevel: 3,
    prerequisiteSkills: ['seo_fundamentals'],
    effects: [
      { type: 'channel_effectiveness', value: 0.08, channel: 'seo' },
      { type: 'conversion_boost', value: 0.02 },
    ],
  },
  {
    id: 'technical_seo',
    name: 'Technical SEO',
    nameKo: '테크니컬 SEO',
    description: 'Deep understanding of technical SEO aspects',
    descriptionKo: '테크니컬 SEO의 깊은 이해를 갖춥니다',
    icon: '⚙️',
    category: 'seo',
    maxLevel: 5,
    unlockLevel: 5,
    prerequisiteSkills: ['keyword_research'],
    effects: [
      { type: 'channel_effectiveness', value: 0.1, channel: 'seo' },
      { type: 'cost_reduction', value: 0.03, channel: 'seo' },
    ],
  },

  // SNS Skills
  {
    id: 'social_basics',
    name: 'Social Media Basics',
    nameKo: '소셜 미디어 기초',
    description: 'Understanding of social media marketing',
    descriptionKo: '소셜 미디어 마케팅의 기본을 이해합니다',
    icon: '📱',
    category: 'sns',
    maxLevel: 5,
    unlockLevel: 1,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'sns' },
    ],
  },
  {
    id: 'viral_content',
    name: 'Viral Content Creation',
    nameKo: '바이럴 콘텐츠 제작',
    description: 'Create content that goes viral',
    descriptionKo: '바이럴이 되는 콘텐츠를 만듭니다',
    icon: '🚀',
    category: 'sns',
    maxLevel: 5,
    unlockLevel: 4,
    prerequisiteSkills: ['social_basics'],
    effects: [
      { type: 'channel_effectiveness', value: 0.1, channel: 'sns' },
      { type: 'event_luck', value: 0.05 },
    ],
  },
  {
    id: 'community_management',
    name: 'Community Management',
    nameKo: '커뮤니티 관리',
    description: 'Build and manage engaged communities',
    descriptionKo: '활발한 커뮤니티를 구축하고 관리합니다',
    icon: '👥',
    category: 'sns',
    maxLevel: 5,
    unlockLevel: 6,
    prerequisiteSkills: ['viral_content'],
    effects: [
      { type: 'reputation_bonus', value: 0.05 },
      { type: 'client_satisfaction', value: 0.03 },
    ],
  },

  // Ads Skills
  {
    id: 'ppc_basics',
    name: 'PPC Basics',
    nameKo: 'PPC 기초',
    description: 'Fundamentals of Pay-Per-Click advertising',
    descriptionKo: 'PPC 광고의 기본을 배웁니다',
    icon: '💰',
    category: 'ads',
    maxLevel: 5,
    unlockLevel: 1,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'ads' },
    ],
  },
  {
    id: 'campaign_optimization',
    name: 'Campaign Optimization',
    nameKo: '캠페인 최적화',
    description: 'Optimize ad campaigns for better ROI',
    descriptionKo: '더 나은 ROI를 위해 광고 캠페인을 최적화합니다',
    icon: '📊',
    category: 'ads',
    maxLevel: 5,
    unlockLevel: 4,
    prerequisiteSkills: ['ppc_basics'],
    effects: [
      { type: 'channel_effectiveness', value: 0.08, channel: 'ads' },
      { type: 'cost_reduction', value: 0.05, channel: 'ads' },
    ],
  },
  {
    id: 'retargeting_master',
    name: 'Retargeting Master',
    nameKo: '리타겟팅 마스터',
    description: 'Expert in retargeting strategies',
    descriptionKo: '리타겟팅 전략의 전문가가 됩니다',
    icon: '🎯',
    category: 'ads',
    maxLevel: 5,
    unlockLevel: 7,
    prerequisiteSkills: ['campaign_optimization'],
    effects: [
      { type: 'conversion_boost', value: 0.05 },
      { type: 'budget_efficiency', value: 0.05 },
    ],
  },

  // Content Skills
  {
    id: 'content_basics',
    name: 'Content Marketing Basics',
    nameKo: '콘텐츠 마케팅 기초',
    description: 'Fundamentals of content marketing',
    descriptionKo: '콘텐츠 마케팅의 기본을 배웁니다',
    icon: '✍️',
    category: 'content',
    maxLevel: 5,
    unlockLevel: 1,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'content' },
    ],
  },
  {
    id: 'storytelling',
    name: 'Brand Storytelling',
    nameKo: '브랜드 스토리텔링',
    description: 'Tell compelling brand stories',
    descriptionKo: '매력적인 브랜드 스토리를 전달합니다',
    icon: '📖',
    category: 'content',
    maxLevel: 5,
    unlockLevel: 5,
    prerequisiteSkills: ['content_basics'],
    effects: [
      { type: 'channel_effectiveness', value: 0.1, channel: 'content' },
      { type: 'reputation_bonus', value: 0.03 },
    ],
  },

  // Email Skills
  {
    id: 'email_basics',
    name: 'Email Marketing Basics',
    nameKo: '이메일 마케팅 기초',
    description: 'Fundamentals of email marketing',
    descriptionKo: '이메일 마케팅의 기본을 배웁니다',
    icon: '📧',
    category: 'email',
    maxLevel: 5,
    unlockLevel: 3,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'email' },
    ],
  },
  {
    id: 'automation',
    name: 'Marketing Automation',
    nameKo: '마케팅 자동화',
    description: 'Automate marketing workflows',
    descriptionKo: '마케팅 워크플로우를 자동화합니다',
    icon: '🤖',
    category: 'email',
    maxLevel: 5,
    unlockLevel: 6,
    prerequisiteSkills: ['email_basics'],
    effects: [
      { type: 'channel_effectiveness', value: 0.08, channel: 'email' },
      { type: 'cost_reduction', value: 0.05 },
    ],
  },

  // Influencer Skills
  {
    id: 'influencer_basics',
    name: 'Influencer Marketing Basics',
    nameKo: '인플루언서 마케팅 기초',
    description: 'Fundamentals of influencer partnerships',
    descriptionKo: '인플루언서 파트너십의 기본을 배웁니다',
    icon: '⭐',
    category: 'influencer',
    maxLevel: 5,
    unlockLevel: 5,
    effects: [
      { type: 'channel_effectiveness', value: 0.05, channel: 'influencer' },
    ],
  },
  {
    id: 'influencer_relations',
    name: 'Influencer Relations',
    nameKo: '인플루언서 관계 관리',
    description: 'Build lasting influencer relationships',
    descriptionKo: '지속적인 인플루언서 관계를 구축합니다',
    icon: '🤝',
    category: 'influencer',
    maxLevel: 5,
    unlockLevel: 8,
    prerequisiteSkills: ['influencer_basics'],
    effects: [
      { type: 'channel_effectiveness', value: 0.1, channel: 'influencer' },
      { type: 'cost_reduction', value: 0.08, channel: 'influencer' },
    ],
  },

  // Analytics Skills
  {
    id: 'data_analysis',
    name: 'Data Analysis',
    nameKo: '데이터 분석',
    description: 'Analyze marketing data effectively',
    descriptionKo: '마케팅 데이터를 효과적으로 분석합니다',
    icon: '📈',
    category: 'analytics',
    maxLevel: 5,
    unlockLevel: 2,
    effects: [
      { type: 'experience_bonus', value: 0.05 },
      { type: 'budget_efficiency', value: 0.03 },
    ],
  },
  {
    id: 'ab_testing',
    name: 'A/B Testing',
    nameKo: 'A/B 테스팅',
    description: 'Master the art of A/B testing',
    descriptionKo: 'A/B 테스팅의 달인이 됩니다',
    icon: '🔬',
    category: 'analytics',
    maxLevel: 5,
    unlockLevel: 5,
    prerequisiteSkills: ['data_analysis'],
    effects: [
      { type: 'conversion_boost', value: 0.03 },
      { type: 'budget_efficiency', value: 0.05 },
    ],
  },
  {
    id: 'attribution_modeling',
    name: 'Attribution Modeling',
    nameKo: '어트리뷰션 모델링',
    description: 'Understand complex attribution models',
    descriptionKo: '복잡한 어트리뷰션 모델을 이해합니다',
    icon: '🧮',
    category: 'analytics',
    maxLevel: 5,
    unlockLevel: 8,
    prerequisiteSkills: ['ab_testing'],
    effects: [
      { type: 'budget_efficiency', value: 0.1 },
      { type: 'experience_bonus', value: 0.05 },
    ],
  },

  // Management Skills
  {
    id: 'client_communication',
    name: 'Client Communication',
    nameKo: '클라이언트 커뮤니케이션',
    description: 'Effective client communication',
    descriptionKo: '효과적인 클라이언트 커뮤니케이션을 합니다',
    icon: '💬',
    category: 'management',
    maxLevel: 5,
    unlockLevel: 2,
    effects: [
      { type: 'client_satisfaction', value: 0.05 },
      { type: 'reputation_bonus', value: 0.02 },
    ],
  },
  {
    id: 'project_management',
    name: 'Project Management',
    nameKo: '프로젝트 관리',
    description: 'Manage marketing projects efficiently',
    descriptionKo: '마케팅 프로젝트를 효율적으로 관리합니다',
    icon: '📋',
    category: 'management',
    maxLevel: 5,
    unlockLevel: 4,
    effects: [
      { type: 'budget_efficiency', value: 0.05 },
      { type: 'experience_bonus', value: 0.03 },
    ],
  },
  {
    id: 'team_leadership',
    name: 'Team Leadership',
    nameKo: '팀 리더십',
    description: 'Lead and motivate marketing teams',
    descriptionKo: '마케팅 팀을 이끌고 동기부여합니다',
    icon: '👔',
    category: 'management',
    maxLevel: 5,
    unlockLevel: 7,
    prerequisiteSkills: ['project_management', 'client_communication'],
    effects: [
      { type: 'experience_bonus', value: 0.1 },
      { type: 'reputation_bonus', value: 0.05 },
      { type: 'client_satisfaction', value: 0.05 },
    ],
  },
];

// Get skill by ID
export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find((skill) => skill.id === id);
}

// Get skills by category
export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return SKILLS.filter((skill) => skill.category === category);
}

// Get available skills for player level
export function getAvailableSkills(playerLevel: number, learnedSkillIds: string[]): Skill[] {
  return SKILLS.filter((skill) => {
    // Check player level requirement
    if (skill.unlockLevel > playerLevel) return false;

    // Check prerequisite skills
    if (skill.prerequisiteSkills) {
      const hasAllPrerequisites = skill.prerequisiteSkills.every((prereq) =>
        learnedSkillIds.includes(prereq)
      );
      if (!hasAllPrerequisites) return false;
    }

    return true;
  });
}

// Calculate total effect from user's skills
export function calculateSkillEffects(
  userSkills: { skillId: string; level: number }[]
): Map<SkillEffectType, { total: number; byChannel: Map<string, number> }> {
  const effects = new Map<SkillEffectType, { total: number; byChannel: Map<string, number> }>();

  for (const userSkill of userSkills) {
    const skill = getSkillById(userSkill.skillId);
    if (!skill) continue;

    for (const effect of skill.effects) {
      const effectValue = effect.value * userSkill.level;

      if (!effects.has(effect.type)) {
        effects.set(effect.type, { total: 0, byChannel: new Map() });
      }

      const effectData = effects.get(effect.type)!;

      if (effect.channel) {
        const currentChannelValue = effectData.byChannel.get(effect.channel) || 0;
        effectData.byChannel.set(effect.channel, currentChannelValue + effectValue);
      } else {
        effectData.total += effectValue;
      }
    }
  }

  return effects;
}

// Skill categories with display info
export const SKILL_CATEGORIES: {
  id: SkillCategory;
  name: string;
  nameKo: string;
  icon: string;
  color: string;
}[] = [
  { id: 'seo', name: 'SEO', nameKo: 'SEO', icon: '🔍', color: 'text-blue-400' },
  { id: 'sns', name: 'Social Media', nameKo: '소셜 미디어', icon: '📱', color: 'text-pink-400' },
  { id: 'ads', name: 'Paid Advertising', nameKo: '유료 광고', icon: '💰', color: 'text-yellow-400' },
  { id: 'content', name: 'Content', nameKo: '콘텐츠', icon: '✍️', color: 'text-green-400' },
  { id: 'email', name: 'Email', nameKo: '이메일', icon: '📧', color: 'text-purple-400' },
  { id: 'influencer', name: 'Influencer', nameKo: '인플루언서', icon: '⭐', color: 'text-orange-400' },
  { id: 'analytics', name: 'Analytics', nameKo: '분석', icon: '📈', color: 'text-cyan-400' },
  { id: 'management', name: 'Management', nameKo: '관리', icon: '👔', color: 'text-gray-400' },
];
