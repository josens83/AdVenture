'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatMoney } from '@adventure/shared';

interface IntroScreenProps {
  onStart: (name: string) => void;
  onLoadGame?: () => void;
}

export default function IntroScreen({ onStart, onLoadGame }: IntroScreenProps) {
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    onStart(playerName || '신입 마케터');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg"
      >
        {/* Logo */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-7xl mb-6"
        >
          📊
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          마케터 생존기
        </h1>
        <p className="text-dark-400 text-lg tracking-widest uppercase mb-8">
          Marketing Simulator
        </p>

        {/* Description */}
        <p className="text-dark-300 text-lg leading-relaxed mb-8">
          당신은 이제 막 마케팅 에이전시에 입사한 신입 마케터입니다.
          <br />
          클라이언트의 홈페이지를 홍보하고, 성과를 만들어내세요!
        </p>

        {/* Stats Preview */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="stat-box">
            <span className="text-xl">💰</span>
            <span className="text-sm">시작 자금: {formatMoney(5000000)}</span>
          </div>
          <div className="stat-box">
            <span className="text-xl">⭐</span>
            <span className="text-sm">초기 평판: 50점</span>
          </div>
          <div className="stat-box">
            <span className="text-xl">🎯</span>
            <span className="text-sm">목표: 에이전시 성장</span>
          </div>
        </div>

        {/* Name Input */}
        <input
          type="text"
          placeholder="마케터 이름 입력..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input mb-4"
          maxLength={20}
        />

        {/* Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="btn-primary w-full text-lg"
          >
            새 게임 시작 →
          </motion.button>
          {onLoadGame && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoadGame}
              className="btn-secondary w-full text-lg"
            >
              저장된 게임 불러오기
            </motion.button>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-left">
          <div className="card p-4">
            <span className="text-2xl mb-2 block">📈</span>
            <h3 className="font-semibold mb-1">실제 마케팅 학습</h3>
            <p className="text-sm text-dark-400">
              SEO, SNS, 광고 등 실제 마케팅 전략을 경험
            </p>
          </div>
          <div className="card p-4">
            <span className="text-2xl mb-2 block">🎮</span>
            <h3 className="font-semibold mb-1">시뮬레이션 게임</h3>
            <p className="text-sm text-dark-400">
              리스크 없이 마케팅 의사결정을 연습
            </p>
          </div>
          <div className="card p-4">
            <span className="text-2xl mb-2 block">🏆</span>
            <h3 className="font-semibold mb-1">성장 시스템</h3>
            <p className="text-sm text-dark-400">
              레벨업하고 더 큰 프로젝트에 도전
            </p>
          </div>
          <div className="card p-4">
            <span className="text-2xl mb-2 block">📊</span>
            <h3 className="font-semibold mb-1">실제 지표</h3>
            <p className="text-sm text-dark-400">
              CTR, CPA, ROAS 등 실제 마케팅 지표 사용
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
