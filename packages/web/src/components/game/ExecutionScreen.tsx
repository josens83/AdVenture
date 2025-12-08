'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Client, MarketingStrategy, ExecutionResult, formatMoney } from '@adventure/shared';

interface ExecutionScreenProps {
  client: Client;
  strategy: MarketingStrategy;
  currentDay: number;
  executionProgress: number;
  lastResult: ExecutionResult | null;
  message: string;
  onSimulateStep: () => void;
  onShowResults: () => void;
}

export default function ExecutionScreen({
  client,
  strategy,
  currentDay,
  executionProgress,
  lastResult,
  message,
  onSimulateStep,
  onShowResults,
}: ExecutionScreenProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const progress = (executionProgress / client.duration) * 100;
  const isComplete = executionProgress >= client.duration;

  const handleSimulate = async () => {
    setIsSimulating(true);
    // Small delay for animation
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSimulateStep();
    setIsSimulating(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="section-title text-3xl mb-2">🚀 마케팅 실행 중</h2>
        <p className="text-dark-400">{client.name}</p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-dark-400">진행률</span>
          <span className="text-lg font-bold">
            {executionProgress}/{client.duration}일
          </span>
        </div>
        <div className="progress-bar h-4 mb-2">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-primary-400 font-semibold">
          {Math.round(progress)}% 완료
        </p>
      </motion.div>

      {/* Strategy Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {strategy.seo > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">🔍</span>
            <span className="text-dark-400 text-sm block">SEO</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.seo}%
            </span>
          </motion.div>
        )}
        {strategy.sns > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">📱</span>
            <span className="text-dark-400 text-sm block">SNS</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.sns}%
            </span>
          </motion.div>
        )}
        {strategy.ads > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">💰</span>
            <span className="text-dark-400 text-sm block">광고</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.ads}%
            </span>
          </motion.div>
        )}
        {strategy.content > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">✍️</span>
            <span className="text-dark-400 text-sm block">콘텐츠</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.content}%
            </span>
          </motion.div>
        )}
        {strategy.email > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-dark-400 text-sm block">이메일</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.email}%
            </span>
          </motion.div>
        )}
        {strategy.influencer > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card text-center"
          >
            <span className="text-2xl block mb-2">⭐</span>
            <span className="text-dark-400 text-sm block">인플루언서</span>
            <span className="text-xl font-bold text-primary-400">
              {strategy.influencer}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Event Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-dark-800/80 border-2 border-primary-400/50 mb-6"
        >
          <p className="text-center text-lg">{message}</p>
        </motion.div>
      )}

      {/* Last Result Stats */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card mb-6"
        >
          <h4 className="font-semibold mb-4">📊 최근 5일 성과</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-dark-400 text-sm">방문자</p>
              <p className="text-xl font-bold">
                +{lastResult.visitors.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-dark-400 text-sm">전환율</p>
              <p className="text-xl font-bold">{lastResult.conversion.toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-dark-400 text-sm">리드</p>
              <p className="text-xl font-bold">+{lastResult.leads}</p>
            </div>
            <div className="text-center">
              <p className="text-dark-400 text-sm">지출</p>
              <p className="text-xl font-bold">
                {formatMoney(Math.round(lastResult.spend))}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Simulation Animation */}
      {!isComplete && (
        <div className="flex items-center justify-center gap-3 mb-6 text-dark-400">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-primary-400"
          />
          <span>데이터 수집 중...</span>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        {isComplete ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowResults}
            className="btn-primary text-lg px-8"
          >
            결과 확인 →
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSimulate}
            disabled={isSimulating}
            className="btn-primary text-lg px-8"
          >
            {isSimulating ? (
              <span className="flex items-center gap-2">
                <div className="spinner w-5 h-5" />
                시뮬레이션 중...
              </span>
            ) : (
              '5일 경과 ⏩'
            )}
          </motion.button>
        )}
      </div>

      {/* Target KPIs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 card bg-dark-800/50"
      >
        <h4 className="font-semibold mb-3">🎯 목표 KPI</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-dark-400">목표 방문자</span>
            <p className="font-bold">{client.targetKPI.visitors.toLocaleString()}명</p>
          </div>
          <div>
            <span className="text-dark-400">목표 전환율</span>
            <p className="font-bold">{client.targetKPI.conversion}%</p>
          </div>
          <div>
            <span className="text-dark-400">목표 리드</span>
            <p className="font-bold">{client.targetKPI.leads || '-'}건</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
