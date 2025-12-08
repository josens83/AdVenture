import {
  GameState,
  Client,
  MarketingStrategy,
  ProjectResult,
  CLIENTS,
  CHANNELS,
  GAME_CONFIG,
  DIFFICULTY_MULTIPLIERS,
  getRandomEvent,
} from '@adventure/shared';

// Server-side game validation to prevent cheating
export class GameValidator {
  // Validate that a client can be selected
  static validateClientSelection(
    clientId: string,
    playerLevel: number,
    playerMoney: number
  ): { valid: boolean; error?: string } {
    const client = CLIENTS.find((c) => c.id === clientId);

    if (!client) {
      return { valid: false, error: 'Invalid client ID' };
    }

    if (client.unlockLevel > playerLevel) {
      return {
        valid: false,
        error: `Client requires level ${client.unlockLevel}`,
      };
    }

    // Check if player has minimum funds
    const minBudget = client.budget * 0.3;
    if (playerMoney < minBudget) {
      return { valid: false, error: 'Insufficient funds' };
    }

    return { valid: true };
  }

  // Validate strategy allocation
  static validateStrategy(
    strategy: MarketingStrategy,
    playerLevel: number,
    unlockedChannels: string[]
  ): { valid: boolean; error?: string } {
    const total = Object.values(strategy).reduce((sum, val) => sum + val, 0);

    if (total < GAME_CONFIG.MIN_BUDGET_ALLOCATION) {
      return {
        valid: false,
        error: `Minimum ${GAME_CONFIG.MIN_BUDGET_ALLOCATION}% allocation required`,
      };
    }

    if (total > 100) {
      return { valid: false, error: 'Cannot allocate more than 100%' };
    }

    // Check each channel
    for (const [channel, value] of Object.entries(strategy)) {
      if (value < 0 || value > 50) {
        return { valid: false, error: `Invalid allocation for ${channel}` };
      }

      if (value > 0) {
        const channelInfo = CHANNELS.find((c) => c.id === channel);
        if (!channelInfo) {
          return { valid: false, error: `Unknown channel: ${channel}` };
        }

        if (channelInfo.minLevel > playerLevel) {
          return {
            valid: false,
            error: `Channel ${channel} requires level ${channelInfo.minLevel}`,
          };
        }

        if (!unlockedChannels.includes(channel)) {
          return { valid: false, error: `Channel ${channel} is locked` };
        }
      }
    }

    return { valid: true };
  }

  // Server-side result calculation (to verify client results)
  static calculateResults(
    client: Client,
    strategy: MarketingStrategy,
    seed: number // Use deterministic seed for verification
  ): ProjectResult {
    // Use seeded random for reproducibility
    const seededRandom = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    const baseVisitors = client.targetKPI.visitors;
    const baseConversion = client.targetKPI.conversion;

    // Calculate effectiveness based on strategy
    let totalEffect = 1;
    for (const channel of CHANNELS) {
      const allocation = strategy[channel.id as keyof MarketingStrategy] || 0;
      if (allocation > 0) {
        const channelEffect =
          allocation * 0.01 * channel.effectivenessFactors.visitorMultiplier;
        totalEffect += channelEffect;
      }
    }

    const randomFactor = 0.8 + seededRandom() * 0.4;
    const actualVisitors = Math.round(baseVisitors * totalEffect * randomFactor);

    // Calculate conversion with content and SEO bonuses
    const contentBonus = (strategy.content || 0) * 0.01;
    const seoBonus = (strategy.seo || 0) * 0.005;
    const actualConversion =
      Math.round(baseConversion * (1 + contentBonus + seoBonus) * 100) / 100;

    const leads = Math.round(actualVisitors * (actualConversion / 100));

    const targetVisitors = client.targetKPI.visitors;
    const targetConversion = client.targetKPI.conversion;
    const targetLeads = client.targetKPI.leads || 0;

    const visitorsAchieved = actualVisitors >= targetVisitors;
    const conversionAchieved = actualConversion >= targetConversion;
    const leadsAchieved = targetLeads === 0 || leads >= targetLeads;

    const success = visitorsAchieved && conversionAchieved && leadsAchieved;

    // Calculate payment
    const basePayment = client.budget;
    let payment: number;
    let reputationChange: number;

    if (success) {
      payment = Math.round(
        basePayment * GAME_CONFIG.SUCCESS_PAYMENT_MULTIPLIER
      );
      reputationChange = GAME_CONFIG.SUCCESS_REPUTATION_CHANGE;
    } else {
      payment = Math.round(
        basePayment * GAME_CONFIG.FAILURE_PAYMENT_MULTIPLIER
      );
      reputationChange = GAME_CONFIG.FAILURE_REPUTATION_CHANGE;
    }

    // Calculate experience
    const difficultyMultiplier =
      DIFFICULTY_MULTIPLIERS[client.difficulty].experienceGain;
    const experienceGained = Math.round(
      50 * difficultyMultiplier * (success ? 1 : 0.5)
    );

    // Calculate bonuses
    const bonuses: ProjectResult['bonuses'] = [];
    const kpiExceeded =
      ((actualVisitors - targetVisitors) / targetVisitors) * 100;

    if (kpiExceeded > 20) {
      const bonusAmount = Math.round(basePayment * (kpiExceeded / 100) * 0.1);
      bonuses.push({
        type: 'overperformance',
        amount: bonusAmount,
        description: `KPI ${Math.round(kpiExceeded)}% 초과 달성`,
      });
      payment += bonusAmount;
    }

    // Generate feedback
    const satisfaction = success
      ? Math.min(5, 3 + Math.floor(seededRandom() * 3))
      : Math.max(1, 2 + Math.floor(seededRandom() * 2));

    const feedbackComments = {
      5: '완벽한 결과입니다! 다음 프로젝트도 함께하고 싶습니다.',
      4: '좋은 성과였습니다. 만족합니다.',
      3: '기대한 수준입니다. 나쁘지 않았어요.',
      2: '조금 아쉬운 부분이 있네요.',
      1: '기대에 미치지 못했습니다.',
    };

    return {
      success,
      visitors: actualVisitors,
      targetVisitors,
      conversion: actualConversion,
      targetConversion,
      leads,
      targetLeads,
      payment,
      reputationChange,
      experienceGained,
      bonuses,
      feedback: {
        satisfaction,
        comment: feedbackComments[satisfaction as keyof typeof feedbackComments],
        willRecommend: satisfaction >= 4,
        repeatClient: satisfaction >= 3 && seededRandom() > 0.5,
      },
    };
  }

  // Validate that submitted result matches server calculation
  static verifyResult(
    submittedResult: ProjectResult,
    serverResult: ProjectResult,
    tolerance: number = 0.1 // 10% tolerance for random variations
  ): { valid: boolean; error?: string } {
    // Check success status
    if (submittedResult.success !== serverResult.success) {
      return { valid: false, error: 'Success status mismatch' };
    }

    // Check visitors within tolerance
    const visitorDiff =
      Math.abs(submittedResult.visitors - serverResult.visitors) /
      serverResult.visitors;
    if (visitorDiff > tolerance) {
      return { valid: false, error: 'Visitor count out of tolerance' };
    }

    // Check payment
    const paymentDiff =
      Math.abs(submittedResult.payment - serverResult.payment) /
      serverResult.payment;
    if (paymentDiff > tolerance) {
      return { valid: false, error: 'Payment amount out of tolerance' };
    }

    return { valid: true };
  }

  // Validate player state for consistency
  static validatePlayerState(playerState: {
    money: number;
    reputation: number;
    level: number;
    experience: number;
    completedProjects: number;
  }): { valid: boolean; error?: string } {
    if (playerState.money < 0) {
      return { valid: false, error: 'Invalid money amount' };
    }

    if (playerState.reputation < 0 || playerState.reputation > 100) {
      return { valid: false, error: 'Invalid reputation' };
    }

    if (playerState.level < 1 || playerState.level > 100) {
      return { valid: false, error: 'Invalid level' };
    }

    if (playerState.experience < 0) {
      return { valid: false, error: 'Invalid experience' };
    }

    if (playerState.completedProjects < 0) {
      return { valid: false, error: 'Invalid completed projects count' };
    }

    // Validate level is consistent with experience
    const expectedLevel = Math.floor(
      Math.log(
        (playerState.experience / GAME_CONFIG.EXPERIENCE_PER_LEVEL) *
          (GAME_CONFIG.EXPERIENCE_MULTIPLIER - 1) +
          1
      ) / Math.log(GAME_CONFIG.EXPERIENCE_MULTIPLIER)
    );

    // Allow some leeway
    if (Math.abs(playerState.level - expectedLevel) > 2) {
      return { valid: false, error: 'Level/experience mismatch' };
    }

    return { valid: true };
  }
}

export default GameValidator;
