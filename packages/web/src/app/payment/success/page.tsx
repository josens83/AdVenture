'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, update } = useSession();

  const sessionId = searchParams.get('session_id');
  const isMock = searchParams.get('mock') === 'true';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    tier: string;
    billingPeriod: string;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('결제 정보를 찾을 수 없습니다.');
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        if (isMock) {
          // Mock mode - just show success
          setSubscriptionInfo({
            tier: '프로',
            billingPeriod: 'monthly',
          });
          setLoading(false);

          // Refresh session to get updated subscription
          await update();
          return;
        }

        // Verify the checkout session with the server
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '결제 확인에 실패했습니다.');
        }

        setSubscriptionInfo({
          tier: data.tier,
          billingPeriod: data.billingPeriod,
        });

        // Refresh session to get updated subscription
        await update();
      } catch (err) {
        setError(err instanceof Error ? err.message : '결제 확인 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, isMock, update]);

  const tierNames: Record<string, string> = {
    starter: '스타터',
    pro: '프로',
    enterprise: '엔터프라이즈',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">결제 확인 중...</h2>
          <p className="text-dark-400">잠시만 기다려주세요.</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md text-center border border-white/20"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">결제 확인 실패</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <div className="space-y-3">
            <Link href="/pricing" className="btn-primary w-full block text-center">
              요금제 페이지로 돌아가기
            </Link>
            <Link href="/" className="text-dark-400 hover:text-dark-300 text-sm block">
              홈으로 돌아가기
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md text-center border border-white/20"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">결제 완료!</h1>
          <p className="text-dark-300 mb-6">
            {subscriptionInfo?.tier
              ? `${tierNames[subscriptionInfo.tier] || subscriptionInfo.tier} 플랜이 활성화되었습니다.`
              : '구독이 성공적으로 완료되었습니다.'}
          </p>

          {/* Subscription Details */}
          <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm text-dark-400 mb-3">구독 정보</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-400">플랜</span>
                <span className="text-white font-medium">
                  {subscriptionInfo?.tier
                    ? tierNames[subscriptionInfo.tier] || subscriptionInfo.tier
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">결제 주기</span>
                <span className="text-white font-medium">
                  {subscriptionInfo?.billingPeriod === 'yearly' ? '연간' : '월간'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">상태</span>
                <span className="text-green-400 font-medium">활성</span>
              </div>
            </div>
          </div>

          {/* New Features Unlocked */}
          <div className="bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl p-4 mb-6 text-left border border-primary-500/30">
            <h3 className="text-sm text-primary-400 mb-3 flex items-center gap-2">
              <span>✨</span> 새로 잠금 해제된 기능
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span> 모든 클라이언트 잠금 해제
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span> 추가 마케팅 채널
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span> 광고 없는 게임 플레이
              </li>
              <li className="flex items-center gap-2 text-white">
                <span className="text-green-400">✓</span> 더 많은 저장 슬롯
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="btn-primary w-full block text-center"
            >
              게임 시작하기
            </Link>
            <Link
              href="/settings"
              className="text-dark-400 hover:text-dark-300 text-sm block"
            >
              구독 관리 →
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
