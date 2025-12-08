'use client';

import { motion } from 'framer-motion';
import {
  Client,
  MarketingStrategy,
  MarketingChannel,
  CHANNELS,
  getChannelsByLevel,
  getTimeToEffectLabel,
  getCostLabel,
  formatMoney,
} from '@adventure/shared';

interface StrategyScreenProps {
  client: Client;
  strategy: MarketingStrategy;
  playerLevel: number;
  message: string;
  onUpdateStrategy: (channel: keyof MarketingStrategy, value: number) => void;
  onStartExecution: () => void;
  onBack: () => void;
}

export default function StrategyScreen({
  client,
  strategy,
  playerLevel,
  message,
  onUpdateStrategy,
  onStartExecution,
  onBack,
}: StrategyScreenProps) {
  const availableChannels = getChannelsByLevel(playerLevel);
  const totalAllocation = Object.values(strategy).reduce((sum, val) => sum + val, 0);
  const budgetUsed = Math.round((totalAllocation / 100) * client.budget);

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="section-title text-3xl mb-2">🎯 마케팅 전략 수립</h2>
            <p className="text-dark-400">각 채널에 예산을 배분하세요.</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{client.name}</p>
            <p className="text-dark-400 text-sm">
              예산: {formatMoney(client.budget)} | 기간: {client.duration}일
            </p>
          </div>
        </div>
      </motion.div>

      {/* Budget Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold">예산 배분</span>
          <span
            className={`text-lg font-bold ${
              totalAllocation > 100 ? 'text-red-400' : 'text-primary-400'
            }`}
          >
            {totalAllocation}%
          </span>
        </div>

        <div className="progress-bar mb-3">
          <div
            className={`progress-fill ${
              totalAllocation > 100 ? '!bg-red-500' : ''
            }`}
            style={{ width: `${Math.min(totalAllocation, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-dark-400">
          <span>사용 예산: {formatMoney(budgetUsed)}</span>
          <span>전체 예산: {formatMoney(client.budget)}</span>
        </div>

        {totalAllocation < 50 && (
          <p className="text-yellow-400 text-sm mt-3">
            ⚠️ 최소 50% 이상의 예산을 배분해야 합니다.
          </p>
        )}

        {totalAllocation > 100 && (
          <p className="text-red-400 text-sm mt-3">
            ⚠️ 예산을 초과했습니다. 배분을 조정해주세요.
          </p>
        )}
      </motion.div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {availableChannels.map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="card"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">{channel.icon}</span>
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{channel.nameKo}</h4>
                <p className="text-dark-400 text-sm">{channel.descriptionKo}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className="badge bg-dark-700 text-dark-300 text-xs">
                {getTimeToEffectLabel(channel.timeToEffect)}
              </span>
              <span className="badge bg-dark-700 text-dark-300 text-xs">
                {getCostLabel(channel.costMultiplier)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                value={strategy[channel.id as keyof MarketingStrategy] || 0}
                onChange={(e) =>
                  onUpdateStrategy(
                    channel.id as keyof MarketingStrategy,
                    parseInt(e.target.value)
                  )
                }
                className="flex-1"
              />
              <span className="text-xl font-bold text-primary-400 w-16 text-right">
                {strategy[channel.id as keyof MarketingStrategy] || 0}%
              </span>
            </div>
          </motion.div>
        ))}

        {/* Locked Channels */}
        {CHANNELS.filter((c) => c.minLevel > playerLevel).map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (availableChannels.length + index) * 0.05 }}
            className="card opacity-50"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl grayscale">{channel.icon}</span>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-dark-500">
                  {channel.nameKo}
                </h4>
                <p className="text-dark-600 text-sm">Lv.{channel.minLevel}에 해금</p>
              </div>
              <span className="badge bg-dark-700 text-dark-500">🔒</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Error Message */}
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center mb-4"
        >
          {message}
        </motion.p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onBack} className="btn-secondary">
          ← 클라이언트 다시 선택
        </button>
        <button
          onClick={onStartExecution}
          className="btn-primary"
          disabled={totalAllocation < 50 || totalAllocation > 100}
        >
          마케팅 실행 시작 →
        </button>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 card bg-dark-800/50"
      >
        <h4 className="font-semibold mb-3">💡 전략 팁</h4>
        <ul className="text-sm text-dark-400 space-y-2">
          <li>
            • <span className="text-primary-400">유료 광고</span>는 빠른 효과를
            보지만 비용이 많이 듭니다.
          </li>
          <li>
            • <span className="text-primary-400">SEO와 콘텐츠</span>는 장기적으로
            효과적이지만 시간이 걸립니다.
          </li>
          <li>
            • <span className="text-primary-400">SNS 마케팅</span>은 바이럴 가능성이
            있지만 예측이 어렵습니다.
          </li>
          <li>• 클라이언트의 요구사항에 맞는 채널을 선택하면 보너스가 있습니다.</li>
        </ul>
      </motion.div>
    </div>
  );
}
