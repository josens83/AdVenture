'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  SUBSCRIPTIONS,
  SubscriptionTier,
  formatSubscriptionPrice,
  getYearlyDiscount,
} from '@adventure/shared';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState('');

  const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'enterprise'];

  const tierNames: Record<SubscriptionTier, string> = {
    free: '무료',
    starter: '스타터',
    pro: '프로',
    enterprise: '엔터프라이즈',
  };

  const tierDescriptions: Record<SubscriptionTier, string> = {
    free: '마케팅 게임을 체험해보세요',
    starter: '더 많은 콘텐츠와 기능을 즐기세요',
    pro: '모든 기능을 제한 없이 이용하세요',
    enterprise: '팀과 함께 교육하세요',
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setError('');

    if (tier === 'free') {
      router.push('/');
      return;
    }

    if (tier === 'enterprise') {
      window.location.href = 'mailto:support@adventure-game.com?subject=엔터프라이즈 플랜 문의';
      return;
    }

    // Check if user is logged in
    if (status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=/pricing&tier=${tier}`);
      return;
    }

    // Check if already subscribed to this tier or higher
    const currentTier = session?.user?.subscription?.toLowerCase();
    const tierOrder = ['free', 'starter', 'pro', 'enterprise'];
    const currentTierIndex = tierOrder.indexOf(currentTier || 'free');
    const targetTierIndex = tierOrder.indexOf(tier);

    if (currentTierIndex >= targetTierIndex && currentTier !== 'free') {
      setError('이미 동일하거나 상위 플랜을 구독 중입니다.');
      return;
    }

    setLoadingTier(tier);

    try {
      const response = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billingPeriod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '결제 세션 생성에 실패했습니다.');
      }

      // Redirect to checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoadingTier(null);
    }
  };

  const currentUserTier = session?.user?.subscription?.toLowerCase() || 'free';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Link href="/" className="inline-block mb-8">
            <span className="text-4xl">📊</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              마케터 생존기
            </span>{' '}
            요금제
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            실제 마케팅을 배우는 최고의 시뮬레이션 게임.
            <br />
            당신에게 맞는 플랜을 선택하세요.
          </p>
        </motion.div>

        {/* Current Plan Badge */}
        {session?.user && currentUserTier !== 'free' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-400 px-4 py-2 rounded-full text-sm">
              <span>✓</span>
              현재 플랜: {tierNames[currentUserTier as SubscriptionTier] || currentUserTier}
            </span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mb-8 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-dark-800 rounded-xl p-1 flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              연간
              <span className="bg-yellow-400 text-dark-900 text-xs px-2 py-0.5 rounded-full font-bold">
                최대 17% 할인
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => {
            const subscription = SUBSCRIPTIONS[tier];
            const isPopular = tier === 'pro';
            const discount = getYearlyDiscount(tier);
            const isCurrentPlan = currentUserTier === tier;
            const isLoading = loadingTier === tier;

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card relative ${
                  isPopular
                    ? 'border-2 border-primary-400 scale-105'
                    : isCurrentPlan
                    ? 'border-2 border-green-400'
                    : 'border border-white/10'
                }`}
              >
                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900 text-sm font-bold px-4 py-1 rounded-full">
                      인기
                    </span>
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-dark-900 text-sm font-bold px-4 py-1 rounded-full">
                      현재 플랜
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tierNames[tier]}</h3>
                  <p className="text-dark-400 text-sm">
                    {tierDescriptions[tier]}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold">
                    {formatSubscriptionPrice(tier, billingPeriod)}
                  </div>
                  {tier !== 'free' && (
                    <p className="text-dark-500 text-sm">
                      {billingPeriod === 'monthly' ? '/ 월' : '/ 년'}
                    </p>
                  )}
                  {billingPeriod === 'yearly' && discount > 0 && (
                    <p className="text-primary-400 text-sm mt-1">
                      {discount}% 할인 적용
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {subscription.features.map((feature) => (
                    <li
                      key={feature.id}
                      className={`flex items-start gap-2 text-sm ${
                        feature.included ? 'text-white' : 'text-dark-600'
                      }`}
                    >
                      <span className={feature.included ? '' : 'opacity-50'}>
                        {feature.included ? '✓' : '✗'}
                      </span>
                      <span>{feature.nameKo}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrentPlan
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-400'
                      : isPopular
                      ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900 hover:opacity-90'
                      : tier === 'free'
                      ? 'bg-dark-700 text-white hover:bg-dark-600'
                      : 'border-2 border-white/30 hover:bg-white/10'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      처리 중...
                    </span>
                  ) : isCurrentPlan ? (
                    '현재 플랜'
                  ) : tier === 'free' ? (
                    '무료로 시작'
                  ) : tier === 'enterprise' ? (
                    '문의하기'
                  ) : (
                    '구독하기'
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            <div className="card">
              <h4 className="font-semibold mb-2">무료 플랜의 제한은 무엇인가요?</h4>
              <p className="text-dark-400 text-sm">
                무료 플랜에서는 쉬움 난이도의 클라이언트만 이용할 수 있고, 4개의 기본
                마케팅 채널을 사용할 수 있습니다. 광고가 표시되며 저장 슬롯은 1개입니다.
              </p>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-2">언제든지 구독을 취소할 수 있나요?</h4>
              <p className="text-dark-400 text-sm">
                네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 결제 기간이 끝날
                때까지 프리미엄 기능을 이용할 수 있습니다.
              </p>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-2">엔터프라이즈 플랜은 어떤 분들께 적합한가요?</h4>
              <p className="text-dark-400 text-sm">
                마케팅 교육이 필요한 기업, 학교, 교육기관에 적합합니다. 팀 계정,
                커스텀 시나리오, API 접근 등의 기능을 제공합니다.
              </p>
            </div>
            <div className="card">
              <h4 className="font-semibold mb-2">결제는 어떻게 처리되나요?</h4>
              <p className="text-dark-400 text-sm">
                모든 결제는 Stripe를 통해 안전하게 처리됩니다. 신용카드/체크카드로
                결제할 수 있으며, 결제 정보는 저희 서버에 저장되지 않습니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Manage Subscription Link */}
        {session?.user && currentUserTier !== 'free' && (
          <div className="text-center mt-8">
            <Link
              href="/settings"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              구독 관리하기 →
            </Link>
          </div>
        )}

        {/* Back to Game */}
        <div className="text-center mt-12">
          <Link href="/" className="btn-secondary">
            ← 게임으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
