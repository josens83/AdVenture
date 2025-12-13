'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface TutorialOverlayProps {
  step: TutorialStep | null;
  progress: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  onNeverShow: () => void;
}

export default function TutorialOverlay({
  step,
  progress,
  totalSteps,
  onNext,
  onSkip,
  onNeverShow,
}: TutorialOverlayProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (step?.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  if (!step) return null;

  const getTooltipPosition = () => {
    if (!targetRect || step.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;

    switch (step.position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: `${targetRect.bottom + padding}px`,
          left: `${targetRect.left + targetRect.width / 2}px`,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          right: `${window.innerWidth - targetRect.left + padding}px`,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2}px`,
          left: `${targetRect.right + padding}px`,
          transform: 'translateY(-50%)',
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        };
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Highlight target element */}
        {targetRect && (
          <div
            className="absolute border-2 border-primary-400 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] z-10"
            style={{
              top: targetRect.top - 4,
              left: targetRect.left - 4,
              width: targetRect.width + 8,
              height: targetRect.height + 8,
            }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="absolute bg-dark-800 border border-dark-600 rounded-xl p-6 max-w-md z-20 shadow-2xl"
          style={getTooltipPosition()}
        >
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-dark-400 mb-1">
              <span>튜토리얼 진행</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-dark-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary-500 rounded-full"
              />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2">{step.titleKo}</h3>
          <p className="text-dark-300 mb-4 leading-relaxed">
            {step.descriptionKo}
          </p>

          {/* Reward preview */}
          {step.reward && (
            <div className="bg-dark-700/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-dark-400 mb-2">완료 보상:</p>
              <div className="flex flex-wrap gap-3">
                {step.reward.money && (
                  <span className="flex items-center gap-1 text-sm">
                    <span>💰</span>
                    <span className="text-green-400">
                      +{step.reward.money.toLocaleString()}원
                    </span>
                  </span>
                )}
                {step.reward.experience && (
                  <span className="flex items-center gap-1 text-sm">
                    <span>⭐</span>
                    <span className="text-blue-400">
                      +{step.reward.experience} XP
                    </span>
                  </span>
                )}
                {step.reward.reputation && (
                  <span className="flex items-center gap-1 text-sm">
                    <span>📈</span>
                    <span className="text-yellow-400">
                      +{step.reward.reputation} 평판
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onNext}
              className="btn-primary flex-1"
            >
              {step.action === 'click' ? '확인' : '다음'}
            </button>
            <button
              onClick={onSkip}
              className="btn-secondary px-4"
            >
              건너뛰기
            </button>
          </div>

          {/* Never show option */}
          <button
            onClick={onNeverShow}
            className="mt-3 text-xs text-dark-500 hover:text-dark-400 w-full text-center"
          >
            다시 표시하지 않기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
