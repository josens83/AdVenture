'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  SUBSCRIPTIONS,
  SubscriptionTier,
  formatSubscriptionPrice,
  getYearlyDiscount,
} from '@adventure/shared';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

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
    if (tier === 'free') {
      window.location.href = '/';
      return;
    }

    // In production, this would call the Stripe checkout API
    alert(`${tierNames[tier]} 플랜 구독 페이지로 이동합니다.`);
  };

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

            return (
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card relative ${
                  isPopular
                    ? 'border-2 border-primary-400 scale-105'
                    : 'border border-white/10'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900 text-sm font-bold px-4 py-1 rounded-full">
                      인기
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
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isPopular
                      ? 'bg-gradient-to-r from-primary-400 to-secondary-400 text-dark-900 hover:opacity-90'
                      : tier === 'free'
                      ? 'bg-dark-700 text-white hover:bg-dark-600'
                      : 'border-2 border-white/30 hover:bg-white/10'
                  }`}
                >
                  {tier === 'free'
                    ? '무료로 시작'
                    : tier === 'enterprise'
                    ? '문의하기'
                    : '구독하기'}
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
          </div>
        </motion.div>

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
