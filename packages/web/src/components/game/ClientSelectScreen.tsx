'use client';

import { motion } from 'framer-motion';
import { Client, CLIENTS, getClientsByLevel, formatMoney } from '@adventure/shared';

interface ClientSelectScreenProps {
  playerLevel: number;
  onSelectClient: (client: Client) => void;
}

export default function ClientSelectScreen({
  playerLevel,
  onSelectClient,
}: ClientSelectScreenProps) {
  const availableClients = getClientsByLevel(playerLevel);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'border-primary-400 bg-primary-400/10';
      case 'medium':
        return 'border-yellow-400 bg-yellow-400/10';
      case 'hard':
        return 'border-red-400 bg-red-400/10';
      case 'expert':
        return 'border-purple-400 bg-purple-400/10';
      default:
        return 'border-white/20';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="badge-success">쉬움</span>;
      case 'medium':
        return <span className="badge-warning">보통</span>;
      case 'hard':
        return <span className="badge-danger">어려움</span>;
      case 'expert':
        return <span className="badge bg-purple-400 text-white">전문가</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="section-title text-3xl mb-2">📋 클라이언트 선택</h2>
        <p className="text-dark-400">
          프로젝트를 선택하세요. 난이도가 높을수록 보상도 큽니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card-interactive border-2 ${getDifficultyColor(
              client.difficulty
            )}`}
            onClick={() => onSelectClient(client)}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{client.name}</h3>
              {getDifficultyBadge(client.difficulty)}
            </div>

            {/* Industry */}
            <p className="text-dark-400 text-sm mb-3">{client.industry}</p>

            {/* Description */}
            <p className="text-dark-300 text-sm leading-relaxed mb-4">
              {client.description}
            </p>

            {/* Details */}
            <div className="bg-dark-800/50 rounded-xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">💵 예산</span>
                <span className="font-medium">{formatMoney(client.budget)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">📅 기간</span>
                <span className="font-medium">{client.duration}일</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">🎯 목표 방문자</span>
                <span className="font-medium">
                  {client.targetKPI.visitors.toLocaleString()}명
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dark-400">📈 목표 전환율</span>
                <span className="font-medium">{client.targetKPI.conversion}%</span>
              </div>
            </div>

            {/* Client Demands */}
            <p className="text-yellow-400 text-sm italic mb-4">
              💬 "{client.demands}"
            </p>

            {/* Select Button */}
            <button className="btn-primary w-full">이 프로젝트 수주하기</button>
          </motion.div>
        ))}

        {/* Locked Clients */}
        {CLIENTS.filter((c) => c.unlockLevel > playerLevel)
          .slice(0, 2)
          .map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (availableClients.length + index) * 0.1 }}
              className="card border-2 border-dark-700 opacity-50 cursor-not-allowed"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-dark-500">{client.name}</h3>
                <span className="badge bg-dark-700 text-dark-400">
                  🔒 Lv.{client.unlockLevel}
                </span>
              </div>
              <p className="text-dark-500 text-sm mb-3">{client.industry}</p>
              <p className="text-dark-600 text-sm mb-4">
                레벨 {client.unlockLevel} 달성 시 해금됩니다.
              </p>
              <div className="bg-dark-800/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm text-dark-500">
                  <span>💵 예산</span>
                  <span>{formatMoney(client.budget)}</span>
                </div>
              </div>
              <button className="btn-secondary w-full opacity-50" disabled>
                잠김
              </button>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
