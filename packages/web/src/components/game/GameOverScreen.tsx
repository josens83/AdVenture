'use client';

import { motion } from 'framer-motion';
import { Player, formatMoney } from '@adventure/shared';

interface GameOverScreenProps {
  player: Player;
  currentDay: number;
  onRestart: () => void;
}

export default function GameOverScreen({
  player,
  currentDay,
  onRestart,
}: GameOverScreenProps) {
  const isReputationLoss = player.reputation <= 0;
  const isMoneyLoss = player.money <= 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg"
      >
        {/* Icon */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-7xl block mb-6"
        >
          💼
        </motion.span>

        {/* Title */}
        <h1 className="text-4xl font-bold text-red-400 mb-4">게임 오버</h1>

        {/* Reason */}
        <p className="text-dark-300 text-lg mb-8">
          {isReputationLoss &&
            '평판이 바닥났습니다. 더 이상 클라이언트를 구할 수 없습니다.'}
          {isMoneyLoss &&
            !isReputationLoss &&
            '자금이 부족하여 에이전시를 운영할 수 없습니다.'}
        </p>

        {/* Final Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">📊 최종 기록</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-dark-400 text-sm">완료한 프로젝트</p>
              <p className="text-3xl font-bold text-primary-400">
                {player.completedProjects}개
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">최종 레벨</p>
              <p className="text-3xl font-bold text-secondary-400">
                Lv.{player.level}
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">총 수익</p>
              <p className="text-2xl font-bold">
                {formatMoney(player.totalEarnings)}
              </p>
            </div>
            <div>
              <p className="text-dark-400 text-sm">생존 일수</p>
              <p className="text-2xl font-bold">{currentDay}일</p>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        {player.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <h3 className="text-lg font-semibold mb-4">🏆 획득한 업적</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {player.achievements.map((achievement) => (
                <span
                  key={achievement.id}
                  className="badge bg-dark-700 text-dark-200"
                  title={achievement.descriptionKo}
                >
                  {achievement.icon} {achievement.nameKo}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-left bg-dark-800/50 rounded-xl p-6 mb-8"
        >
          <h4 className="font-semibold mb-3">💡 다음 게임을 위한 팁</h4>
          <ul className="text-sm text-dark-400 space-y-2">
            {isReputationLoss && (
              <>
                <li>• 프로젝트 실패가 연속되면 평판이 급락합니다.</li>
                <li>• 난이도가 너무 높은 프로젝트는 피하세요.</li>
                <li>• 클라이언트의 요구사항에 맞는 전략을 세우세요.</li>
              </>
            )}
            {isMoneyLoss && !isReputationLoss && (
              <>
                <li>• 예산 배분을 신중하게 하세요.</li>
                <li>• 높은 예산 클라이언트를 찾아 수익을 높이세요.</li>
                <li>• 성공 보너스를 노려 추가 수익을 얻으세요.</li>
              </>
            )}
            <li>• 다양한 마케팅 채널을 활용해보세요.</li>
            <li>• 이벤트에 유연하게 대응하세요.</li>
          </ul>
        </motion.div>

        {/* Restart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="btn-primary text-lg px-8 w-full"
        >
          다시 시작하기
        </motion.button>

        {/* Share (placeholder) */}
        <p className="text-dark-500 text-sm mt-6">
          결과를 친구들과 공유하고 도전해보세요!
        </p>
      </motion.div>
    </div>
  );
}
