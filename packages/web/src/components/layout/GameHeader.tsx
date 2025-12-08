'use client';

import { Player, formatMoney, formatLevel } from '@adventure/shared';

interface GameHeaderProps {
  player: Player;
  currentDay: number;
  onSave?: () => void;
  onShowSubscription?: () => void;
}

export default function GameHeader({
  player,
  currentDay,
  onSave,
  onShowSubscription,
}: GameHeaderProps) {
  return (
    <header className="bg-dark-900/50 border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Player Info */}
          <div className="flex items-center gap-4">
            <span className="text-xl">👤</span>
            <div>
              <span className="font-semibold">{player.name}</span>
              <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900 text-xs font-bold rounded-full">
                {formatLevel(player.level)}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-3 md:gap-6">
            <div className="stat-box">
              <span>💰</span>
              <span className="text-sm font-medium">
                {formatMoney(player.money)}
              </span>
            </div>
            <div className="stat-box">
              <span>⭐</span>
              <span className="text-sm font-medium">
                평판 {player.reputation}
              </span>
            </div>
            <div className="stat-box">
              <span>📅</span>
              <span className="text-sm font-medium">Day {currentDay}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={onSave}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="게임 저장"
              >
                💾
              </button>
            )}
            {onShowSubscription && (
              <button
                onClick={onShowSubscription}
                className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-dark-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                PRO 업그레이드
              </button>
            )}
          </div>
        </div>

        {/* Experience Bar */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-dark-400">EXP</span>
            <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    (player.experience /
                      (100 * Math.pow(1.5, player.level - 1))) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-dark-400">
              {player.experience}/
              {Math.round(100 * Math.pow(1.5, player.level - 1))}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {(player.reputation <= 20 || player.money <= 500000) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {player.reputation <= 20 && (
              <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                ⚠️ 평판이 매우 낮습니다!
              </span>
            )}
            {player.money <= 500000 && (
              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                ⚠️ 자금이 부족합니다!
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
