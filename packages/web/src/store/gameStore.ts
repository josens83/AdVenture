'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameEngine,
  Player,
  Client,
  MarketingStrategy,
  GameState,
  ProjectResult,
  ExecutionResult,
  GameSave,
  Achievement,
} from '@adventure/shared';

interface GameStore {
  // Engine instance
  engine: GameEngine | null;

  // Game state
  gameState: GameState;
  player: Player | null;
  currentClient: Client | null;
  currentStrategy: MarketingStrategy;
  currentDay: number;
  executionProgress: number;
  lastExecutionResult: ExecutionResult | null;
  projectResult: ProjectResult | null;

  // UI state
  message: string;
  isLoading: boolean;
  showAchievement: Achievement | null;

  // Actions
  initGame: (playerName: string) => void;
  loadGame: (save: GameSave) => void;
  selectClient: (client: Client) => boolean;
  updateStrategy: (channel: keyof MarketingStrategy, value: number) => void;
  startExecution: () => boolean;
  simulateStep: () => ExecutionResult | null;
  calculateResults: () => ProjectResult;
  continueGame: () => boolean;
  resetGame: () => void;
  saveGame: () => GameSave | null;
  setMessage: (message: string) => void;
  clearMessage: () => void;
  dismissAchievement: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      engine: null,
      gameState: 'intro',
      player: null,
      currentClient: null,
      currentStrategy: {
        seo: 0,
        sns: 0,
        ads: 0,
        content: 0,
        email: 0,
        influencer: 0,
      },
      currentDay: 1,
      executionProgress: 0,
      lastExecutionResult: null,
      projectResult: null,
      message: '',
      isLoading: false,
      showAchievement: null,

      // Actions
      initGame: (playerName: string) => {
        const engine = new GameEngine(playerName);
        set({
          engine,
          gameState: 'clientSelect',
          player: engine.getPlayer(),
          currentClient: null,
          currentStrategy: {
            seo: 0,
            sns: 0,
            ads: 0,
            content: 0,
            email: 0,
            influencer: 0,
          },
          currentDay: 1,
          executionProgress: 0,
          lastExecutionResult: null,
          projectResult: null,
          message: '',
        });
      },

      loadGame: (save: GameSave | Record<string, unknown>) => {
        // Handle both GameSave format and API response format
        const normalizedSave: GameSave = {
          id: (save.id as string) || '',
          playerId: (save.playerId as string) || '',
          player: (save.player as Player) || {
            id: '',
            name: (save.playerName as string) || 'Player',
            reputation: (save.playerReputation as number) || 50,
            money: parseInt(String(save.playerMoney || '5000000')),
            level: (save.playerLevel as number) || 1,
            experience: (save.playerExperience as number) || 0,
            completedProjects: (save.completedProjects as number) || 0,
            totalEarnings: parseInt(String(save.totalEarnings || '0')),
            achievements: [],
            teamMembers: (save.teamMembers as never[]) || [],
            unlockedChannels: (save.unlockedChannels as never[]) || ['seo', 'sns', 'ads', 'content'],
            subscription: 'free',
            createdAt: new Date(),
            lastPlayedAt: new Date(),
          },
          currentState: ((save.currentState || save.gameState) as GameState) || 'clientSelect',
          currentClient: (save.currentClient as Client) || undefined,
          currentStrategy: (save.currentStrategy as MarketingStrategy) || undefined,
          currentDay: (save.currentDay as number) || 1,
          executionProgress: (save.executionProgress as number) || 0,
          executionResults: (save.executionResults as ExecutionResult[]) || [],
          savedAt: new Date(String(save.savedAt || save.updatedAt || Date.now())),
          version: (save.version as string) || '1.0.0',
        };

        const engine = new GameEngine(undefined, normalizedSave);
        set({
          engine,
          gameState: normalizedSave.currentState,
          player: engine.getPlayer(),
          currentClient: normalizedSave.currentClient || null,
          currentStrategy: normalizedSave.currentStrategy || {
            seo: 0,
            sns: 0,
            ads: 0,
            content: 0,
            email: 0,
            influencer: 0,
          },
          currentDay: normalizedSave.currentDay,
          executionProgress: normalizedSave.executionProgress,
        });
      },

      selectClient: (client: Client) => {
        const { engine } = get();
        if (!engine) return false;

        const success = engine.selectClient(client);
        if (success) {
          set({
            gameState: 'strategy',
            currentClient: client,
            currentStrategy: {
              seo: 0,
              sns: 0,
              ads: 0,
              content: 0,
              email: 0,
              influencer: 0,
            },
            player: engine.getPlayer(),
          });
        }
        return success;
      },

      updateStrategy: (channel: keyof MarketingStrategy, value: number) => {
        const { currentStrategy, engine } = get();
        const newStrategy = { ...currentStrategy, [channel]: value };

        if (engine) {
          engine.setStrategy(newStrategy);
        }

        set({ currentStrategy: newStrategy });
      },

      startExecution: () => {
        const { engine, currentStrategy } = get();
        if (!engine) return false;

        const total = Object.values(currentStrategy).reduce((sum, val) => sum + val, 0);
        if (total < 50) {
          set({ message: '최소 50% 이상의 예산을 배분해주세요!' });
          return false;
        }

        engine.setStrategy(currentStrategy);
        const success = engine.startExecution();

        if (success) {
          set({
            gameState: 'execution',
            executionProgress: 0,
            message: '',
          });
        }
        return success;
      },

      simulateStep: () => {
        const { engine } = get();
        if (!engine) return null;

        const result = engine.simulateStep();

        if (result) {
          const newState = engine.getState();
          set({
            lastExecutionResult: result,
            executionProgress: engine.getExecutionProgress(),
            currentDay: engine.getCurrentDay(),
            gameState: newState,
            message: result.events.length > 0 ? result.events[0].messageKo : '',
          });
        }

        return result;
      },

      calculateResults: () => {
        const { engine, player } = get();
        if (!engine) throw new Error('No game engine');

        const previousAchievements = player?.achievements.length || 0;
        const result = engine.calculateResults();
        const updatedPlayer = engine.getPlayer();

        // Check for new achievements
        const newAchievements = updatedPlayer.achievements.slice(previousAchievements);

        set({
          projectResult: result,
          player: updatedPlayer,
          gameState: 'results',
          showAchievement: newAchievements.length > 0 ? newAchievements[0] : null,
        });

        return result;
      },

      continueGame: () => {
        const { engine } = get();
        if (!engine) return false;

        const canContinue = engine.continueGame();

        set({
          gameState: canContinue ? 'clientSelect' : 'gameover',
          currentClient: null,
          currentStrategy: {
            seo: 0,
            sns: 0,
            ads: 0,
            content: 0,
            email: 0,
            influencer: 0,
          },
          executionProgress: 0,
          lastExecutionResult: null,
          projectResult: null,
          player: engine.getPlayer(),
        });

        return canContinue;
      },

      resetGame: () => {
        set({
          engine: null,
          gameState: 'intro',
          player: null,
          currentClient: null,
          currentStrategy: {
            seo: 0,
            sns: 0,
            ads: 0,
            content: 0,
            email: 0,
            influencer: 0,
          },
          currentDay: 1,
          executionProgress: 0,
          lastExecutionResult: null,
          projectResult: null,
          message: '',
        });
      },

      saveGame: () => {
        const { engine } = get();
        if (!engine) return null;
        return engine.createSave();
      },

      setMessage: (message: string) => set({ message }),
      clearMessage: () => set({ message: '' }),
      dismissAchievement: () => set({ showAchievement: null }),
    }),
    {
      name: 'adventure-game-storage',
      partialize: (state) => ({
        // Only persist essential data, engine will be recreated from save
      }),
    }
  )
);
