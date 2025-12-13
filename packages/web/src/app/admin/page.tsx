'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Tab = 'overview' | 'users' | 'analytics';

interface Stats {
  users: {
    total: number;
    newToday: number;
    verified: number;
  };
  subscriptions: Record<string, number>;
  revenue: {
    total: number;
  };
  recentPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    tier: string;
    date: string;
    user: string;
  }>;
  game: {
    totalSaves: number;
    totalAchievements: number;
  };
  topPlayers: Array<{
    name: string;
    level: number;
    earnings: string;
    projects: number;
  }>;
  events: Array<{
    type: string;
    count: number;
  }>;
  dailyStats: Array<{
    date: string;
    activeUsers: number;
    newUsers: number;
    revenue: string;
    newSubscribers: number;
  }>;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscription: string;
  subscriptionEnd: string | null;
  emailVerified: string | null;
  createdAt: string;
  gameSaves: number;
  achievements: number;
  payments: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, usersPagination.page, searchQuery]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.status === 403) {
        setError('관리자 권한이 필요합니다.');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: usersPagination.page.toString(),
        limit: usersPagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
      setUsersPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };

  const tabs = [
    { id: 'overview' as Tab, label: '개요', icon: '📊' },
    { id: 'users' as Tab, label: '사용자', icon: '👥' },
    { id: 'analytics' as Tab, label: '분석', icon: '📈' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">{error}</h1>
          <Link href="/" className="text-primary-400 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-4">
            <span>←</span> 게임으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500/20 text-primary-400'
                  : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="text-dark-400 text-sm mb-1">총 사용자</div>
                <div className="text-3xl font-bold">{stats.users.total.toLocaleString()}</div>
                <div className="text-green-400 text-sm">+{stats.users.newToday} 오늘</div>
              </div>
              <div className="card">
                <div className="text-dark-400 text-sm mb-1">인증된 사용자</div>
                <div className="text-3xl font-bold">{stats.users.verified.toLocaleString()}</div>
                <div className="text-dark-500 text-sm">
                  {((stats.users.verified / stats.users.total) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="card">
                <div className="text-dark-400 text-sm mb-1">총 매출</div>
                <div className="text-3xl font-bold">{formatCurrency(stats.revenue.total)}</div>
              </div>
              <div className="card">
                <div className="text-dark-400 text-sm mb-1">게임 저장</div>
                <div className="text-3xl font-bold">{stats.game.totalSaves.toLocaleString()}</div>
              </div>
            </div>

            {/* Subscription Distribution */}
            <div className="card">
              <h3 className="font-bold mb-4">구독 현황</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.subscriptions).map(([tier, count]) => (
                  <div key={tier} className="bg-dark-800 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-dark-400 text-sm">{tier}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Payments */}
              <div className="card">
                <h3 className="font-bold mb-4">최근 결제</h3>
                <div className="space-y-3">
                  {stats.recentPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <div>
                        <div className="font-medium">{payment.user}</div>
                        <div className="text-dark-400 text-sm">{payment.tier}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-400">{formatCurrency(payment.amount)}</div>
                        <div className="text-dark-500 text-xs">
                          {new Date(payment.date).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Players */}
              <div className="card">
                <h3 className="font-bold mb-4">상위 플레이어</h3>
                <div className="space-y-3">
                  {stats.topPlayers.slice(0, 5).map((player, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-dark-400 text-sm">Lv.{player.level}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{parseInt(player.earnings).toLocaleString()}원</div>
                        <div className="text-dark-500 text-xs">{player.projects} 프로젝트</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Distribution */}
            <div className="card">
              <h3 className="font-bold mb-4">최근 7일 이벤트 (상위 10개)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {stats.events.slice(0, 10).map((event) => (
                  <div key={event.type} className="bg-dark-800 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold">{event.count}</div>
                    <div className="text-dark-400 text-xs truncate">{event.type}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="이메일 또는 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input flex-1"
              />
            </div>

            {/* Users Table */}
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-3 text-dark-400 font-medium">사용자</th>
                    <th className="pb-3 text-dark-400 font-medium">역할</th>
                    <th className="pb-3 text-dark-400 font-medium">구독</th>
                    <th className="pb-3 text-dark-400 font-medium">인증</th>
                    <th className="pb-3 text-dark-400 font-medium">가입일</th>
                    <th className="pb-3 text-dark-400 font-medium">활동</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{user.name || '-'}</div>
                          <div className="text-dark-400 text-sm">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="bg-dark-800 border border-white/10 rounded px-2 py-1 text-sm"
                        >
                          <option value="USER">User</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.subscription === 'PRO' || user.subscription === 'ENTERPRISE'
                            ? 'bg-primary-500/20 text-primary-400'
                            : user.subscription === 'STARTER'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-dark-700 text-dark-400'
                        }`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="py-3">
                        {user.emailVerified ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-dark-500">-</span>
                        )}
                      </td>
                      <td className="py-3 text-dark-400 text-sm">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 text-dark-400 text-sm">
                        {user.gameSaves}저장 / {user.achievements}업적
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <div className="text-dark-400 text-sm">
                총 {usersPagination.total}명 중 {(usersPagination.page - 1) * usersPagination.limit + 1}-
                {Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)}명
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setUsersPagination({ ...usersPagination, page: usersPagination.page - 1 })}
                  disabled={usersPagination.page === 1}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setUsersPagination({ ...usersPagination, page: usersPagination.page + 1 })}
                  disabled={usersPagination.page >= usersPagination.totalPages}
                  className="btn-secondary text-sm disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="card">
              <h3 className="font-bold mb-4">일별 통계 (최근 30일)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-white/10">
                      <th className="pb-3 text-dark-400 font-medium">날짜</th>
                      <th className="pb-3 text-dark-400 font-medium">활성 사용자</th>
                      <th className="pb-3 text-dark-400 font-medium">신규 사용자</th>
                      <th className="pb-3 text-dark-400 font-medium">신규 구독자</th>
                      <th className="pb-3 text-dark-400 font-medium">매출</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailyStats.map((day) => (
                      <tr key={day.date} className="border-b border-white/5">
                        <td className="py-2">{new Date(day.date).toLocaleDateString('ko-KR')}</td>
                        <td className="py-2">{day.activeUsers}</td>
                        <td className="py-2">{day.newUsers}</td>
                        <td className="py-2">{day.newSubscribers}</td>
                        <td className="py-2">{formatCurrency(parseInt(day.revenue))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
