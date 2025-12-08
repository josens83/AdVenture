'use client';

import { motion } from 'framer-motion';
import { ProjectResult, Player, formatMoney } from '@adventure/shared';

interface ResultsScreenProps {
  result: ProjectResult;
  player: Player;
  onContinue: () => void;
}

export default function ResultsScreen({
  result,
  player,
  onContinue,
}: ResultsScreenProps) {
  const satisfactionEmojis = ['😡', '😟', '😐', '😊', '😄'];
  const satisfactionLabels = [
    '매우 불만족',
    '불만족',
    '보통',
    '만족',
    '매우 만족',
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Result Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl p-8 mb-8 text-center ${
          result.success
            ? 'bg-gradient-to-r from-primary-500 to-primary-600'
            : 'bg-gradient-to-r from-red-500 to-red-600'
        }`}
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-6xl block mb-4"
        >
          {result.success ? '🎉' : '😢'}
        </motion.span>
        <h2 className="text-3xl font-bold text-white mb-2">
          {result.success ? '프로젝트 성공!' : '목표 미달성'}
        </h2>
        <p className="text-white/80">
          {result.success
            ? '클라이언트의 목표를 달성했습니다!'
            : '다음엔 더 좋은 결과가 있을 거예요.'}
        </p>
      </motion.div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <h4 className="text-dark-400 text-sm mb-2">📊 방문자 수</h4>
          <p className="text-2xl font-bold mb-1">
            {result.visitors.toLocaleString()}명
          </p>
          <p className="text-dark-500 text-sm">
            목표: {result.targetVisitors.toLocaleString()}명
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              result.visitors >= result.targetVisitors
                ? 'bg-primary-400 text-dark-900'
                : 'bg-red-400 text-white'
            }`}
          >
            {result.visitors >= result.targetVisitors ? '달성 ✓' : '미달성 ✗'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <h4 className="text-dark-400 text-sm mb-2">📈 전환율</h4>
          <p className="text-2xl font-bold mb-1">{result.conversion}%</p>
          <p className="text-dark-500 text-sm">목표: {result.targetConversion}%</p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              result.conversion >= result.targetConversion
                ? 'bg-primary-400 text-dark-900'
                : 'bg-red-400 text-white'
            }`}
          >
            {result.conversion >= result.targetConversion ? '달성 ✓' : '미달성 ✗'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <h4 className="text-dark-400 text-sm mb-2">🎯 획득 리드</h4>
          <p className="text-2xl font-bold mb-1">{result.leads}건</p>
          <p className="text-dark-500 text-sm">
            {result.targetLeads > 0
              ? `목표: ${result.targetLeads}건`
              : '전환된 고객'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <h4 className="text-dark-400 text-sm mb-2">💰 정산금</h4>
          <p className="text-2xl font-bold mb-1">{formatMoney(result.payment)}</p>
          <p className="text-dark-500 text-sm">
            {result.success ? '성공 보너스 포함' : '패널티 적용'}
          </p>
        </motion.div>
      </div>

      {/* Bonuses */}
      {result.bonuses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card mb-6"
        >
          <h4 className="font-semibold mb-3">🎁 보너스</h4>
          <div className="space-y-2">
            {result.bonuses.map((bonus, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-primary-400/10 rounded-lg p-3"
              >
                <span className="text-primary-400">{bonus.description}</span>
                <span className="font-bold">+{formatMoney(bonus.amount)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Client Feedback */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card mb-6"
      >
        <h4 className="font-semibold mb-4">💬 클라이언트 피드백</h4>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">
            {satisfactionEmojis[result.feedback.satisfaction - 1]}
          </span>
          <div>
            <p className="font-semibold">
              {satisfactionLabels[result.feedback.satisfaction - 1]}
            </p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= result.feedback.satisfaction
                      ? 'text-yellow-400'
                      : 'text-dark-600'
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-dark-300 italic">"{result.feedback.comment}"</p>
        <div className="flex gap-4 mt-4 text-sm">
          {result.feedback.willRecommend && (
            <span className="badge-success">추천 의사 있음</span>
          )}
          {result.feedback.repeatClient && (
            <span className="badge-info">재계약 희망</span>
          )}
        </div>
      </motion.div>

      {/* Changes Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="card mb-8"
      >
        <h4 className="font-semibold mb-4">📊 변동 사항</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <span className="text-dark-400 text-sm block mb-1">평판 변화</span>
            <span
              className={`text-xl font-bold ${
                result.reputationChange > 0 ? 'text-primary-400' : 'text-red-400'
              }`}
            >
              {result.reputationChange > 0 ? '+' : ''}
              {result.reputationChange}
            </span>
          </div>
          <div className="text-center">
            <span className="text-dark-400 text-sm block mb-1">경험치 획득</span>
            <span className="text-xl font-bold text-secondary-400">
              +{result.experienceGained} XP
            </span>
          </div>
          <div className="text-center">
            <span className="text-dark-400 text-sm block mb-1">현재 평판</span>
            <span className="text-xl font-bold">{player.reputation}</span>
          </div>
          <div className="text-center">
            <span className="text-dark-400 text-sm block mb-1">보유 자금</span>
            <span className="text-xl font-bold">{formatMoney(player.money)}</span>
          </div>
        </div>
      </motion.div>

      {/* Updated Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <div className="stat-box">
          <span>📊</span>
          <span>레벨 {player.level}</span>
        </div>
        <div className="stat-box">
          <span>⭐</span>
          <span>평판 {player.reputation}</span>
        </div>
        <div className="stat-box">
          <span>💰</span>
          <span>{formatMoney(player.money)}</span>
        </div>
        <div className="stat-box">
          <span>📁</span>
          <span>완료 프로젝트 {player.completedProjects}</span>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          className="btn-primary text-lg px-8"
        >
          다음 프로젝트 찾기 →
        </motion.button>
      </div>
    </div>
  );
}
