import { v4 as uuidv4 } from 'uuid';
import {
  Player,
  Client,
  MarketingStrategy,
  GameState,
  ProjectResult,
  ExecutionResult,
  DailyMetrics,
  GameEvent,
  Achievement,
  GameSave,
  MarketingChannel,
} from '../types';
import { GAME_CONFIG, DIFFICULTY_MULTIPLIERS } from '../constants';
import { getRandomEvent } from '../constants/events';
import { getChannelById, CHANNELS } from '../constants/channels';
import { checkAchievements } from '../constants/achievements';

export class GameEngine {
  private player!: Player;
  private currentClient: Client | null = null;
  private currentStrategy: MarketingStrategy | null = null;
  private currentDay: number = 1;
  private executionProgress: number = 0;
  private executionResults: ExecutionResult[] = [];
  private gameState: GameState = 'intro';
  private successStreak: number = 0;

  constructor(playerName?: string, existingSave?: GameSave) {
    if (existingSave) {
      this.loadFromSave(existingSave);
    } else {
      this.player = this.createNewPlayer(playerName || '신입 마케터');
    }
  }

  private createNewPlayer(name: string): Player {
    return {
      id: uuidv4(),
      name,
      reputation: GAME_CONFIG.INITIAL_REPUTATION,
      money: GAME_CONFIG.INITIAL_MONEY,
      level: GAME_CONFIG.INITIAL_LEVEL,
      experience: 0,
      completedProjects: 0,
      totalEarnings: 0,
      achievements: [],
      teamMembers: [],
      unlockedChannels: ['seo', 'sns', 'ads', 'content'],
      subscription: 'free',
      createdAt: new Date(),
      lastPlayedAt: new Date(),
    };
  }

  // Game State Management
  public getState(): GameState {
    return this.gameState;
  }

  public setState(state: GameState): void {
    this.gameState = state;
  }

  public getPlayer(): Player {
    return { ...this.player };
  }

  public getCurrentClient(): Client | null {
    return this.currentClient ? { ...this.currentClient } : null;
  }

  public getCurrentStrategy(): MarketingStrategy | null {
    return this.currentStrategy ? { ...this.currentStrategy } : null;
  }

  public getCurrentDay(): number {
    return this.currentDay;
  }

  public getExecutionProgress(): number {
    return this.executionProgress;
  }

  // Client Selection
  public selectClient(client: Client): boolean {
    if (client.unlockLevel > this.player.level) {
      return false;
    }

    this.currentClient = client;
    this.currentStrategy = {
      seo: 0,
      sns: 0,
      ads: 0,
      content: 0,
      email: 0,
      influencer: 0,
    };
    this.executionProgress = 0;
    this.executionResults = [];
    this.gameState = 'strategy';
    return true;
  }

  // Strategy Setup
  public setStrategy(strategy: MarketingStrategy): boolean {
    if (!this.currentClient) return false;

    const total = Object.values(strategy).reduce((sum, val) => sum + val, 0);
    if (total < GAME_CONFIG.MIN_BUDGET_ALLOCATION) {
      return false;
    }

    this.currentStrategy = { ...strategy };
    return true;
  }

  public getStrategyTotal(): number {
    if (!this.currentStrategy) return 0;
    return Object.values(this.currentStrategy).reduce((sum, val) => sum + val, 0);
  }

  public getBudgetAllocation(): number {
    if (!this.currentClient || !this.currentStrategy) return 0;
    const total = this.getStrategyTotal();
    return Math.round((total / 100) * this.currentClient.budget);
  }

  // Start Execution
  public startExecution(): boolean {
    if (!this.currentClient || !this.currentStrategy) return false;
    if (this.getStrategyTotal() < GAME_CONFIG.MIN_BUDGET_ALLOCATION) return false;

    this.executionProgress = 0;
    this.executionResults = [];
    this.gameState = 'execution';
    return true;
  }

  // Simulate Day (5-day step)
  public simulateStep(): ExecutionResult | null {
    if (!this.currentClient || !this.currentStrategy) return null;

    const stepDays = GAME_CONFIG.SIMULATION_STEP_DAYS;
    this.executionProgress = Math.min(
      this.executionProgress + stepDays,
      this.currentClient.duration
    );
    this.currentDay += stepDays;

    // Get active channels
    const activeChannels = Object.entries(this.currentStrategy)
      .filter(([_, value]) => value > 0)
      .map(([key]) => key);

    // Check for random event
    const event = getRandomEvent(this.executionProgress, activeChannels);

    // Calculate daily metrics
    const metrics = this.calculateDailyMetrics();

    // Calculate visitors and leads for this step
    const stepProgress = stepDays / this.currentClient.duration;
    const baseVisitors = Math.round(this.currentClient.targetKPI.visitors * stepProgress);
    const effectMultiplier = this.calculateEffectiveness();

    let visitors = Math.round(baseVisitors * effectMultiplier * (0.8 + Math.random() * 0.4));
    let conversion =
      this.currentClient.targetKPI.conversion * (0.9 + Math.random() * 0.2);

    // Apply event effects
    if (event) {
      if (event.effect.visitors) {
        visitors = Math.round(visitors * event.effect.visitors);
      }
      if (event.effect.conversion) {
        conversion *= event.effect.conversion;
      }
    }

    const leads = Math.round(visitors * (conversion / 100));

    const result: ExecutionResult = {
      day: this.executionProgress,
      visitors,
      leads,
      conversion,
      spend: this.getBudgetAllocation() * stepProgress,
      events: event ? [event] : [],
      metrics,
    };

    this.executionResults.push(result);

    // Check if execution is complete
    if (this.executionProgress >= this.currentClient.duration) {
      this.gameState = 'analysis';
    }

    return result;
  }

  private calculateEffectiveness(): number {
    if (!this.currentStrategy) return 1;

    let effectiveness = 1;

    CHANNELS.forEach((channel) => {
      const allocation = this.currentStrategy![channel.id as MarketingChannel] || 0;
      if (allocation > 0) {
        const channelEffect = allocation * 0.01 * channel.effectivenessFactors.visitorMultiplier;
        effectiveness += channelEffect;
      }
    });

    return effectiveness;
  }

  private calculateDailyMetrics(): DailyMetrics {
    if (!this.currentStrategy || !this.currentClient) {
      return {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
        roas: 0,
      };
    }

    const budget = this.getBudgetAllocation();
    const adsAllocation = this.currentStrategy.ads || 0;

    const impressions = Math.round(budget * 0.1 * (1 + adsAllocation * 0.02));
    const ctr = 2 + Math.random() * 3; // 2-5% CTR
    const clicks = Math.round(impressions * (ctr / 100));
    const cpc = clicks > 0 ? budget / clicks : 0;
    const conversions = Math.round(clicks * 0.03); // 3% conversion rate
    const cpa = conversions > 0 ? budget / conversions : 0;
    const revenue = conversions * 50000; // Assume 50,000 KRW per conversion
    const roas = budget > 0 ? revenue / budget : 0;

    return {
      impressions,
      clicks,
      ctr,
      cpc,
      cpa,
      roas,
    };
  }

  // Calculate Final Results
  public calculateResults(): ProjectResult {
    if (!this.currentClient || !this.currentStrategy) {
      throw new Error('No active project');
    }

    const totalVisitors = this.executionResults.reduce((sum, r) => sum + r.visitors, 0);
    const totalLeads = this.executionResults.reduce((sum, r) => sum + r.leads, 0);
    const avgConversion =
      this.executionResults.reduce((sum, r) => sum + r.conversion, 0) /
      this.executionResults.length;

    const targetVisitors = this.currentClient.targetKPI.visitors;
    const targetConversion = this.currentClient.targetKPI.conversion;
    const targetLeads = this.currentClient.targetKPI.leads || 0;

    const visitorsAchieved = totalVisitors >= targetVisitors;
    const conversionAchieved = avgConversion >= targetConversion;
    const leadsAchieved = targetLeads === 0 || totalLeads >= targetLeads;

    const success = visitorsAchieved && conversionAchieved && leadsAchieved;

    // Calculate payment
    const basePayment = this.currentClient.budget;
    let payment: number;
    let reputationChange: number;

    if (success) {
      payment = Math.round(basePayment * GAME_CONFIG.SUCCESS_PAYMENT_MULTIPLIER);
      reputationChange = GAME_CONFIG.SUCCESS_REPUTATION_CHANGE;
      this.successStreak++;
    } else {
      payment = Math.round(basePayment * GAME_CONFIG.FAILURE_PAYMENT_MULTIPLIER);
      reputationChange = GAME_CONFIG.FAILURE_REPUTATION_CHANGE;
      this.successStreak = 0;
    }

    // Calculate bonuses
    const bonuses: ProjectResult['bonuses'] = [];

    // Overperformance bonus
    const kpiExceeded =
      ((totalVisitors - targetVisitors) / targetVisitors) * 100;
    if (kpiExceeded > 20) {
      const bonusAmount = Math.round(basePayment * (kpiExceeded / 100) * 0.1);
      bonuses.push({
        type: 'overperformance',
        amount: bonusAmount,
        description: `KPI ${Math.round(kpiExceeded)}% 초과 달성`,
      });
      payment += bonusAmount;
    }

    // Speed bonus
    const actualDays = this.executionProgress;
    const expectedDays = this.currentClient.duration;
    if (actualDays < expectedDays * 0.8) {
      const speedBonus = Math.round(basePayment * 0.1);
      bonuses.push({
        type: 'speed',
        amount: speedBonus,
        description: '빠른 완료 보너스',
      });
      payment += speedBonus;
    }

    // Calculate experience
    const difficultyMultiplier =
      DIFFICULTY_MULTIPLIERS[this.currentClient.difficulty].experienceGain;
    const experienceGained = Math.round(
      50 * difficultyMultiplier * (success ? 1 : 0.5)
    );

    // Generate client feedback
    const satisfaction = success
      ? Math.min(5, 3 + Math.floor(Math.random() * 3))
      : Math.max(1, 2 + Math.floor(Math.random() * 2));

    const feedbackComments = {
      5: '완벽한 결과입니다! 다음 프로젝트도 함께하고 싶습니다.',
      4: '좋은 성과였습니다. 만족합니다.',
      3: '기대한 수준입니다. 나쁘지 않았어요.',
      2: '조금 아쉬운 부분이 있네요.',
      1: '기대에 미치지 못했습니다.',
    };

    const feedback: ProjectResult['feedback'] = {
      satisfaction,
      comment: feedbackComments[satisfaction as keyof typeof feedbackComments],
      willRecommend: satisfaction >= 4,
      repeatClient: satisfaction >= 3 && Math.random() > 0.5,
    };

    // Update player
    const previousReputation = this.player.reputation;
    this.player.money += payment - this.getBudgetAllocation();
    this.player.reputation = Math.max(
      GAME_CONFIG.MIN_REPUTATION,
      Math.min(
        GAME_CONFIG.MAX_REPUTATION,
        this.player.reputation + reputationChange
      )
    );
    this.player.experience += experienceGained;
    this.player.completedProjects++;
    this.player.totalEarnings += payment;
    this.player.lastPlayedAt = new Date();

    // Check for level up
    this.checkLevelUp();

    // Check for new achievements
    const budgetUsed = this.getBudgetAllocation() / this.currentClient.budget;
    const channelsUsed = Object.entries(this.currentStrategy)
      .filter(([_, val]) => val > 0)
      .map(([key]) => key);

    const newAchievements = checkAchievements(this.player, {
      projectSuccess: success,
      kpiExceeded,
      budgetUsed,
      daysUsed: actualDays,
      expectedDays,
      channelsUsed,
      previousReputation,
      successStreak: this.successStreak,
    });

    newAchievements.forEach((achievement) => {
      this.player.achievements.push(achievement);
      if (achievement.reward) {
        if (achievement.reward.money) {
          this.player.money += achievement.reward.money;
        }
        if (achievement.reward.reputation) {
          this.player.reputation = Math.min(
            GAME_CONFIG.MAX_REPUTATION,
            this.player.reputation + achievement.reward.reputation
          );
        }
        if (achievement.reward.experience) {
          this.player.experience += achievement.reward.experience;
        }
      }
    });

    this.gameState = 'results';

    return {
      success,
      visitors: totalVisitors,
      targetVisitors,
      conversion: Math.round(avgConversion * 100) / 100,
      targetConversion,
      leads: totalLeads,
      targetLeads,
      payment,
      reputationChange,
      experienceGained,
      bonuses,
      feedback,
    };
  }

  private checkLevelUp(): void {
    const expForNextLevel =
      GAME_CONFIG.EXPERIENCE_PER_LEVEL *
      Math.pow(GAME_CONFIG.EXPERIENCE_MULTIPLIER, this.player.level - 1);

    while (this.player.experience >= expForNextLevel) {
      this.player.experience -= expForNextLevel;
      this.player.level++;

      // Unlock new channels at certain levels
      if (this.player.level >= 3 && !this.player.unlockedChannels.includes('email')) {
        this.player.unlockedChannels.push('email');
      }
      if (this.player.level >= 5 && !this.player.unlockedChannels.includes('influencer')) {
        this.player.unlockedChannels.push('influencer');
      }
    }
  }

  // Continue or Game Over
  public continueGame(): boolean {
    if (this.player.reputation <= GAME_CONFIG.REPUTATION_GAME_OVER) {
      this.gameState = 'gameover';
      return false;
    }

    if (this.player.money <= GAME_CONFIG.MONEY_GAME_OVER) {
      this.gameState = 'gameover';
      return false;
    }

    this.currentClient = null;
    this.currentStrategy = null;
    this.executionProgress = 0;
    this.executionResults = [];
    this.gameState = 'clientSelect';
    return true;
  }

  // Reset Game
  public resetGame(playerName?: string): void {
    this.player = this.createNewPlayer(playerName || this.player.name);
    this.currentClient = null;
    this.currentStrategy = null;
    this.currentDay = 1;
    this.executionProgress = 0;
    this.executionResults = [];
    this.successStreak = 0;
    this.gameState = 'intro';
  }

  // Save/Load
  public createSave(): GameSave {
    return {
      id: uuidv4(),
      playerId: this.player.id,
      player: { ...this.player },
      currentState: this.gameState,
      currentClient: this.currentClient ? { ...this.currentClient } : undefined,
      currentStrategy: this.currentStrategy
        ? { ...this.currentStrategy }
        : undefined,
      currentDay: this.currentDay,
      executionProgress: this.executionProgress,
      executionResults: [...this.executionResults],
      savedAt: new Date(),
      version: '1.0.0',
    };
  }

  private loadFromSave(save: GameSave): void {
    this.player = { ...save.player };
    this.gameState = save.currentState;
    this.currentClient = save.currentClient
      ? { ...save.currentClient }
      : null;
    this.currentStrategy = save.currentStrategy
      ? { ...save.currentStrategy }
      : null;
    this.currentDay = save.currentDay;
    this.executionProgress = save.executionProgress;
    this.executionResults = [...save.executionResults];
  }

  // Utility methods
  public getExperienceForNextLevel(): number {
    return Math.round(
      GAME_CONFIG.EXPERIENCE_PER_LEVEL *
        Math.pow(GAME_CONFIG.EXPERIENCE_MULTIPLIER, this.player.level - 1)
    );
  }

  public getExperienceProgress(): number {
    const expForNext = this.getExperienceForNextLevel();
    return (this.player.experience / expForNext) * 100;
  }

  public isGameOver(): boolean {
    return (
      this.player.reputation <= GAME_CONFIG.REPUTATION_GAME_OVER ||
      this.player.money <= GAME_CONFIG.MONEY_GAME_OVER
    );
  }

  public getWarnings(): string[] {
    const warnings: string[] = [];

    if (this.player.reputation <= GAME_CONFIG.REPUTATION_WARNING) {
      warnings.push('평판이 매우 낮습니다! 프로젝트 성공이 필요합니다.');
    }

    if (this.player.money <= GAME_CONFIG.MONEY_WARNING) {
      warnings.push('자금이 부족합니다! 신중하게 예산을 관리하세요.');
    }

    return warnings;
  }
}

export default GameEngine;
