'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import GDPRDataRequest from '@/components/common/GDPRDataRequest';
import Footer from '@/components/common/Footer';

type Tab = 'profile' | 'security' | 'subscription' | 'privacy';

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile state
  const [name, setName] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Data deletion state
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showGDPRModal, setShowGDPRModal] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/settings');
    }
  }, [status, router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '프로필 업데이트에 실패했습니다.');
      }

      await update({ name });
      showMessage('success', '프로필이 업데이트되었습니다.');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showMessage('error', '새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      showMessage('error', '비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '비밀번호 변경에 실패했습니다.');
      }

      showMessage('success', '비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/payment/create-portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '포털 접근에 실패했습니다.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/user/export');

      if (!response.ok) {
        throw new Error('데이터 내보내기에 실패했습니다.');
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adventure-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showMessage('success', '데이터가 다운로드되었습니다.');
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== session?.user?.email) {
      showMessage('error', '이메일 주소가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('계정 삭제에 실패했습니다.');
      }

      await signOut({ callbackUrl: '/' });
    } catch (error) {
      showMessage('error', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as Tab, label: '프로필', icon: '👤' },
    { id: 'security' as Tab, label: '보안', icon: '🔒' },
    { id: 'subscription' as Tab, label: '구독', icon: '💳' },
    { id: 'privacy' as Tab, label: '개인정보', icon: '🛡️' },
  ];

  const tierNames: Record<string, string> = {
    FREE: '무료',
    STARTER: '스타터',
    PRO: '프로',
    ENTERPRISE: '엔터프라이즈',
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-4">
            <span>←</span> 게임으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold">설정</h1>
        </motion.div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 px-4 py-3 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                : 'bg-red-500/10 border border-red-500/50 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-48 flex-shrink-0"
          >
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="card">
                <h2 className="text-xl font-bold mb-6">프로필 설정</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">이메일</label>
                    <input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="input bg-dark-800 cursor-not-allowed"
                    />
                    <p className="text-dark-500 text-xs mt-1">이메일은 변경할 수 없습니다.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">이름 (닉네임)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input"
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? '저장 중...' : '변경 사항 저장'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card">
                <h2 className="text-xl font-bold mb-6">보안 설정</h2>

                {session?.user?.email && !session.user.email.includes('@') ? (
                  <p className="text-dark-400">
                    소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.
                  </p>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">현재 비밀번호</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">새 비밀번호</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input"
                        placeholder="최소 8자 이상"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">새 비밀번호 확인</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? '변경 중...' : '비밀번호 변경'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-bold mb-6">구독 정보</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-dark-400">현재 플랜</span>
                      <span className="font-medium">
                        {tierNames[session?.user?.subscription || 'FREE']}
                      </span>
                    </div>

                    {session?.user?.subscriptionEnd && (
                      <div className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-dark-400">다음 결제일</span>
                        <span className="font-medium">
                          {new Date(session.user.subscriptionEnd).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-3">
                      <span className="text-dark-400">상태</span>
                      <span className={`font-medium ${
                        session?.user?.subscription !== 'FREE' ? 'text-green-400' : ''
                      }`}>
                        {session?.user?.subscription !== 'FREE' ? '활성' : '무료'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link href="/pricing" className="btn-primary">
                    요금제 보기
                  </Link>

                  {session?.user?.subscription !== 'FREE' && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="btn-secondary"
                    >
                      {loading ? '로딩 중...' : '구독 관리'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                {/* GDPR Rights */}
                <div className="card">
                  <h2 className="text-xl font-bold mb-2">개인정보 권리</h2>
                  <p className="text-dark-400 text-sm mb-6">
                    GDPR 및 개인정보보호법에 따라 개인정보에 관한 권리를 행사할 수 있습니다.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowGDPRModal(true)}
                      className="p-4 bg-dark-800 rounded-xl text-left hover:bg-dark-700 transition-colors"
                    >
                      <div className="text-2xl mb-2">📋</div>
                      <h3 className="font-medium mb-1">개인정보 권리 행사</h3>
                      <p className="text-dark-400 text-sm">
                        열람, 내보내기, 정정, 삭제 요청
                      </p>
                    </button>

                    <Link
                      href="/privacy"
                      className="p-4 bg-dark-800 rounded-xl text-left hover:bg-dark-700 transition-colors"
                    >
                      <div className="text-2xl mb-2">📄</div>
                      <h3 className="font-medium mb-1">개인정보처리방침</h3>
                      <p className="text-dark-400 text-sm">
                        개인정보 처리 방법 확인
                      </p>
                    </Link>

                    <Link
                      href="/cookies"
                      className="p-4 bg-dark-800 rounded-xl text-left hover:bg-dark-700 transition-colors"
                    >
                      <div className="text-2xl mb-2">🍪</div>
                      <h3 className="font-medium mb-1">쿠키 정책</h3>
                      <p className="text-dark-400 text-sm">
                        쿠키 사용 정보 및 설정
                      </p>
                    </Link>

                    <button
                      onClick={() => {
                        localStorage.removeItem('cookie-consent');
                        document.cookie = 'cookie-consent=; Max-Age=0; path=/';
                        window.location.reload();
                      }}
                      className="p-4 bg-dark-800 rounded-xl text-left hover:bg-dark-700 transition-colors"
                    >
                      <div className="text-2xl mb-2">⚙️</div>
                      <h3 className="font-medium mb-1">쿠키 설정 변경</h3>
                      <p className="text-dark-400 text-sm">
                        쿠키 동의 다시 선택
                      </p>
                    </button>
                  </div>
                </div>

                {/* Data Management */}
                <div className="card">
                  <h2 className="text-xl font-bold mb-6">데이터 관리</h2>

                  <div className="space-y-6">
                    {/* Export Data */}
                    <div className="p-4 bg-dark-800 rounded-xl">
                      <h3 className="font-medium mb-2">내 데이터 내보내기</h3>
                      <p className="text-dark-400 text-sm mb-4">
                        프로필, 게임 저장 데이터, 업적 등 모든 데이터를 JSON 형식으로 다운로드합니다.
                      </p>
                      <button
                        onClick={handleExportData}
                        disabled={loading}
                        className="btn-secondary text-sm"
                      >
                        {loading ? '준비 중...' : '데이터 다운로드'}
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <h3 className="font-medium text-red-400 mb-2">계정 삭제</h3>
                      <p className="text-dark-400 text-sm mb-4">
                        계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                      >
                        계정 삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-900 rounded-2xl p-6 w-full max-w-md border border-white/10"
          >
            <h3 className="text-xl font-bold text-red-400 mb-4">계정 삭제 확인</h3>
            <p className="text-dark-400 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
              모든 데이터(게임 저장, 업적, 결제 내역 등)가 영구적으로 삭제됩니다.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                확인을 위해 이메일 주소를 입력하세요
              </label>
              <input
                type="email"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={session?.user?.email || ''}
                className="input"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm('');
                }}
                className="flex-1 btn-secondary"
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirm !== session?.user?.email}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '삭제 중...' : '계정 삭제'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* GDPR Data Request Modal */}
      <GDPRDataRequest
        isOpen={showGDPRModal}
        onClose={() => setShowGDPRModal(false)}
        userEmail={session?.user?.email || undefined}
      />

      {/* Footer */}
      <Footer minimal />
    </div>
  );
}
