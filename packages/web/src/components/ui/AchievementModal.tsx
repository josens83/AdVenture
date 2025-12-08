'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, formatMoney } from '@adventure/shared';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementModal({
  achievement,
  onClose,
}: AchievementModalProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="bg-gradient-to-br from-dark-800 to-dark-900 border-2 border-yellow-400/50 rounded-2xl p-8 max-w-md w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {achievement.icon}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-yellow-400 text-sm uppercase tracking-wider mb-2">
              업적 달성!
            </p>
            <h3 className="text-2xl font-bold mb-2">{achievement.nameKo}</h3>
            <p className="text-dark-400 mb-6">{achievement.descriptionKo}</p>
          </motion.div>

          {/* Rewards */}
          {achievement.reward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-dark-700/50 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-dark-400 mb-2">보상</p>
              <div className="flex justify-center gap-4">
                {achievement.reward.money && (
                  <span className="text-primary-400 font-bold">
                    +{formatMoney(achievement.reward.money)}
                  </span>
                )}
                {achievement.reward.reputation && (
                  <span className="text-yellow-400 font-bold">
                    +{achievement.reward.reputation} 평판
                  </span>
                )}
                {achievement.reward.experience && (
                  <span className="text-secondary-400 font-bold">
                    +{achievement.reward.experience} XP
                  </span>
                )}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="btn-primary"
          >
            확인
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
