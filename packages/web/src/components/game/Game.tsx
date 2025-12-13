'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useGameStore } from '@/store/gameStore';
import { GAME_CONFIG } from '@adventure/shared';
import GameHeader from '@/components/layout/GameHeader';
import IntroScreen from './IntroScreen';
import ClientSelectScreen from './ClientSelectScreen';
import StrategyScreen from './StrategyScreen';
import ExecutionScreen from './ExecutionScreen';
import ResultsScreen from './ResultsScreen';
import GameOverScreen from './GameOverScreen';
import AchievementModal from '@/components/ui/AchievementModal';
import TutorialOverlay from './TutorialOverlay';
import SkillsPanel from './SkillsPanel';
import SaveLoadScreen from './SaveLoadScreen';

interface TutorialStep {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  reward?: {
    money?: number;
    experience?: number;
    reputation?: number;
  };
}

export default function Game() {
  const { data: session } = useSession();
  const {
    gameState,
    player,
    currentClient,
    currentStrategy,
    currentDay,
    executionProgress,
    lastExecutionResult,
    projectResult,
    message,
    showAchievement,
    initGame,
    selectClient,
    updateStrategy,
    startExecution,
    simulateStep,
    calculateResults,
    continueGame,
    resetGame,
    saveGame,
    loadGame,
    dismissAchievement,
  } = useGameStore();

  // Modal states
  const [showSkills, setShowSkills] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState<'save' | 'load'>('save');

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState<TutorialStep | null>(null);
  const [tutorialProgress, setTutorialProgress] = useState(0);
  const [tutorialTotalSteps, setTutorialTotalSteps] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  // Subscription-based save slots
  const subscription = (session?.user as { subscription?: string })?.subscription || 'FREE';
  const maxSaveSlots = GAME_CONFIG.SAVE_SLOTS[subscription.toLowerCase() as keyof typeof GAME_CONFIG.SAVE_SLOTS] || 1;

  // Fetch tutorial progress on mount
  useEffect(() => {
    if (session?.user && gameState === 'intro') {
      fetchTutorialProgress();
    }
  }, [session, gameState]);

  const fetchTutorialProgress = async () => {
    try {
      const response = await fetch('/api/game/tutorial');
      if (response.ok) {
        const data = await response.json();
        if (!data.isCompleted && !data.neverShowAgain && data.nextStep) {
          setTutorialStep(data.nextStep);
          setTutorialProgress(data.progress);
          setTutorialTotalSteps(data.steps.length);
          setShowTutorial(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch tutorial:', error);
    }
  };

  const handleTutorialNext = async () => {
    if (!tutorialStep) return;

    try {
      const response = await fetch('/api/game/tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId: tutorialStep.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.nextStep) {
          setTutorialStep(data.nextStep);
          setTutorialProgress(data.progress);
        } else {
          setShowTutorial(false);
          setTutorialStep(null);
        }
      }
    } catch (error) {
      console.error('Failed to complete tutorial step:', error);
    }
  };

  const handleTutorialSkip = async () => {
    try {
      await fetch('/api/game/tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'skip' }),
      });
      setShowTutorial(false);
      setTutorialStep(null);
    } catch (error) {
      console.error('Failed to skip tutorial:', error);
    }
  };

  const handleTutorialNeverShow = async () => {
    try {
      await fetch('/api/game/tutorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'never_show' }),
      });
      setShowTutorial(false);
      setTutorialStep(null);
    } catch (error) {
      console.error('Failed to set never show:', error);
    }
  };

  const handleSave = useCallback(async (slotNumber: number) => {
    if (!player) return;

    const saveData = saveGame();
    if (!saveData) return;

    try {
      const response = await fetch('/api/game/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotNumber,
          playerState: {
            name: player.name,
            level: player.level,
            experience: player.experience,
            money: player.money,
            reputation: player.reputation,
            completedProjects: player.completedProjects,
            totalEarnings: player.totalEarnings,
            unlockedChannels: player.unlockedChannels,
            teamMembers: player.teamMembers,
          },
          gameState,
          currentData: {
            currentDay,
            clientId: currentClient?.id,
            strategy: currentStrategy,
            executionProgress,
          },
        }),
      });

      if (response.ok) {
        alert('게임이 저장되었습니다!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('저장에 실패했습니다.');
    }
  }, [player, gameState, currentDay, currentClient, currentStrategy, executionProgress, saveGame]);

  const handleLoad = useCallback(async (slotNumber: number) => {
    try {
      const response = await fetch(`/api/game/load?slot=${slotNumber}`);
      if (response.ok) {
        const data = await response.json();
        loadGame(data.save);
      } else {
        throw new Error('Load failed');
      }
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('불러오기에 실패했습니다.');
    }
  }, [loadGame]);

  const handleOpenSave = () => {
    setSaveLoadMode('save');
    setShowSaveLoad(true);
  };

  const handleOpenLoad = () => {
    setSaveLoadMode('load');
    setShowSaveLoad(true);
  };

  const handleShowResults = () => {
    calculateResults();
  };

  // Render based on game state
  const renderGameContent = () => {
    switch (gameState) {
      case 'intro':
        return (
          <IntroScreen
            onStart={initGame}
            onLoadGame={handleOpenLoad}
          />
        );

      case 'clientSelect':
        if (!player) return null;
        return (
          <ClientSelectScreen
            playerLevel={player.level}
            onSelectClient={selectClient}
          />
        );

      case 'strategy':
        if (!player || !currentClient) return null;
        return (
          <StrategyScreen
            client={currentClient}
            strategy={currentStrategy}
            playerLevel={player.level}
            message={message}
            onUpdateStrategy={updateStrategy}
            onStartExecution={startExecution}
            onBack={() => {
              useGameStore.setState({
                gameState: 'clientSelect',
                currentClient: null,
              });
            }}
          />
        );

      case 'execution':
      case 'analysis':
        if (!player || !currentClient) return null;
        return (
          <ExecutionScreen
            client={currentClient}
            strategy={currentStrategy}
            currentDay={currentDay}
            executionProgress={executionProgress}
            lastResult={lastExecutionResult}
            message={message}
            onSimulateStep={simulateStep}
            onShowResults={handleShowResults}
          />
        );

      case 'results':
        if (!player || !projectResult) return null;
        return (
          <ResultsScreen
            result={projectResult}
            player={player}
            onContinue={continueGame}
          />
        );

      case 'gameover':
        if (!player) return null;
        return (
          <GameOverScreen
            player={player}
            currentDay={currentDay}
            onRestart={resetGame}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header - only show when playing */}
      {player && gameState !== 'intro' && gameState !== 'gameover' && (
        <GameHeader
          player={player}
          currentDay={currentDay}
          onSave={handleOpenSave}
          onLoad={handleOpenLoad}
          onSkills={() => setShowSkills(true)}
        />
      )}

      {/* Main Content */}
      <main>{renderGameContent()}</main>

      {/* Achievement Modal */}
      {showAchievement && (
        <AchievementModal
          achievement={showAchievement}
          onClose={dismissAchievement}
        />
      )}

      {/* Tutorial Overlay */}
      {showTutorial && tutorialStep && (
        <TutorialOverlay
          step={tutorialStep}
          progress={tutorialProgress}
          totalSteps={tutorialTotalSteps}
          onNext={handleTutorialNext}
          onSkip={handleTutorialSkip}
          onNeverShow={handleTutorialNeverShow}
        />
      )}

      {/* Skills Panel */}
      <SkillsPanel
        isOpen={showSkills}
        onClose={() => setShowSkills(false)}
        playerLevel={player?.level || 1}
      />

      {/* Save/Load Screen */}
      <SaveLoadScreen
        isOpen={showSaveLoad}
        mode={saveLoadMode}
        onClose={() => setShowSaveLoad(false)}
        onSave={handleSave}
        onLoad={handleLoad}
        maxSlots={maxSaveSlots}
      />
    </div>
  );
}
