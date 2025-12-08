export * from './clients';
export * from './channels';
export * from './events';
export * from './achievements';
export * from './subscriptions';

// Game balance constants
export const GAME_CONFIG = {
  // Initial player values
  INITIAL_MONEY: 5000000,
  INITIAL_REPUTATION: 50,
  INITIAL_LEVEL: 1,

  // Limits
  MAX_REPUTATION: 100,
  MIN_REPUTATION: 0,
  MIN_BUDGET_ALLOCATION: 50, // Minimum 50% budget must be allocated

  // Experience and leveling
  EXPERIENCE_PER_LEVEL: 100,
  EXPERIENCE_MULTIPLIER: 1.5, // Each level requires 1.5x more XP

  // Reputation thresholds
  REPUTATION_GAME_OVER: 0,
  REPUTATION_WARNING: 20,

  // Money thresholds
  MONEY_GAME_OVER: 0,
  MONEY_WARNING: 500000,

  // Project multipliers
  SUCCESS_PAYMENT_MULTIPLIER: 1.2,
  FAILURE_PAYMENT_MULTIPLIER: 0.5,
  SUCCESS_REPUTATION_CHANGE: 15,
  FAILURE_REPUTATION_CHANGE: -10,

  // Simulation settings
  SIMULATION_STEP_DAYS: 5,
  EVENT_PROBABILITY: 0.3,

  // Team settings
  MAX_TEAM_SIZE: {
    free: 0,
    starter: 2,
    pro: 5,
    enterprise: 10,
  },

  // Save slot limits
  SAVE_SLOTS: {
    free: 1,
    starter: 3,
    pro: -1, // unlimited
    enterprise: -1,
  },
};

// Difficulty multipliers
export const DIFFICULTY_MULTIPLIERS = {
  easy: {
    baseReward: 1.0,
    experienceGain: 1.0,
    eventProbability: 0.2,
  },
  medium: {
    baseReward: 1.5,
    experienceGain: 1.5,
    eventProbability: 0.3,
  },
  hard: {
    baseReward: 2.0,
    experienceGain: 2.0,
    eventProbability: 0.4,
  },
  expert: {
    baseReward: 3.0,
    experienceGain: 3.0,
    eventProbability: 0.5,
  },
};
