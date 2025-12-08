'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatMoney, formatCompactMoney } from '@adventure/shared';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  playerName: string;
  avatar?: string;
  subscription: string;
  highestLevel: number;
  totalProjects: number;
  totalEarnings: string;
  highestReputation: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<
    'all_time' | 'level' | 'weekly' | 'monthly'
  >('all_time');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [leaderboardType]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/game/leaderboard?type=${leaderboardType}&limit=100`
      );
      const data = await response.json();
      setEntries(data.entries || []);
      setUserRank(data.userRank || null);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'ENTERPRISE':
        return <span className="badge bg-purple-500 text-white text-xs">ENT</span>;
      case 'PRO':
        return <span className="badge-success text-xs">PRO</span>;
      case 'STARTER':
        return <span className="badge-info text-xs">스타터</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block mb-4">
            <span className="text-4xl">📊</span>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent mb-2">
            리더보드
          </h1>
          <p className="text-dark-400">최고의 마케터들을 확인하세요</p>
        </motion.div>

        {/* Type Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-xl p-1 flex gap-1">
            {[
              { id: 'all_time', label: '전체' },
              { id: 'level', label: '레벨' },
              { id: 'weekly', label: '주간' },
              { id: 'monthly', label: '월간' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setLeaderboardType(type.id as any)}
                className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  leaderboardType === type.id
                    ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* User's Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card border-2 border-primary-400/50 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary-400">
                  #{userRank.rank}
                </span>
                <div>
                  <p className="font-semibold">나의 순위</p>
                  <p className="text-dark-400 text-sm">
                    {userRank.playerName || session?.user?.name || 'Anonymous'}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-dark-400">레벨</p>
                  <p className="font-bold">Lv.{userRank.highestLevel}</p>
                </div>
                <div className="text-center">
                  <p className="text-dark-400">프로젝트</p>
                  <p className="font-bold">{userRank.totalProjects}</p>
                </div>
                <div className="text-center">
                  <p className="text-dark-400">총 수익</p>
                  <p className="font-bold">
                    {formatCompactMoney(parseInt(userRank.totalEarnings))}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-dark-400">로딩 중...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🏆</span>
            <p className="text-dark-400">아직 데이터가 없습니다.</p>
            <p className="text-dark-500 text-sm">첫 번째 마케터가 되어보세요!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`card p-4 flex items-center justify-between ${
                  entry.rank <= 3 ? 'border border-yellow-400/30' : ''
                } ${
                  entry.userId === session?.user?.id
                    ? 'bg-primary-400/10 border-primary-400/50'
                    : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <span
                    className={`text-2xl font-bold min-w-[60px] ${
                      entry.rank <= 3 ? '' : 'text-dark-500'
                    }`}
                  >
                    {getRankBadge(entry.rank)}
                  </span>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center overflow-hidden">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.playerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">👤</span>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {entry.playerName || 'Anonymous'}
                      </span>
                      {getSubscriptionBadge(entry.subscription)}
                    </div>
                    <span className="text-dark-500 text-xs">
                      Lv.{entry.highestLevel}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="text-center hidden md:block">
                    <p className="text-dark-500 text-xs">프로젝트</p>
                    <p className="font-semibold">{entry.totalProjects}</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-dark-500 text-xs">최고 평판</p>
                    <p className="font-semibold">{entry.highestReputation}</p>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <p className="text-dark-500 text-xs">총 수익</p>
                    <p className="font-bold text-primary-400">
                      {formatCompactMoney(parseInt(entry.totalEarnings))}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back to Game */}
        <div className="text-center mt-8">
          <Link href="/" className="btn-secondary">
            ← 게임으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
