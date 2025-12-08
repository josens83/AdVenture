'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import GameHeader from '@/components/layout/GameHeader';
import IntroScreen from './IntroScreen';
import ClientSelectScreen from './ClientSelectScreen';
import StrategyScreen from './StrategyScreen';
import ExecutionScreen from './ExecutionScreen';
import ResultsScreen from './ResultsScreen';
import GameOverScreen from './GameOverScreen';
import AchievementModal from '@/components/ui/AchievementModal';

export default function Game() {
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
    dismissAchievement,
  } = useGameStore();

  const handleSave = () => {
    const save = saveGame();
    if (save) {
      localStorage.setItem('adventure-save', JSON.stringify(save));
      alert('게임이 저장되었습니다!');
    }
  };

  const handleShowResults = () => {
    calculateResults();
  };

  // Render based on game state
  const renderGameContent = () => {
    switch (gameState) {
      case 'intro':
        return <IntroScreen onStart={initGame} />;

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
          onSave={handleSave}
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
    </div>
  );
}
