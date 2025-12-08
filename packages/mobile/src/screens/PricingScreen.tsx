import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import {
  SUBSCRIPTIONS,
  SubscriptionTier,
  formatSubscriptionPrice,
  getYearlyDiscount,
} from '@adventure/shared';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Pricing'>;
};

export default function PricingScreen({ navigation }: Props) {
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

  const handleSubscribe = (tier: SubscriptionTier) => {
    if (tier === 'free') {
      navigation.navigate('Intro');
      return;
    }

    // In production, this would open in-app purchase
    Alert.alert(
      '구독',
      `${tierNames[tier]} 플랜을 구독하시겠습니까?\n${formatSubscriptionPrice(
        tier,
        billingPeriod
      )}/${billingPeriod === 'monthly' ? '월' : '년'}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '구독하기',
          onPress: () => {
            Alert.alert('안내', '결제 시스템이 곧 연동됩니다.');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← 뒤로</Text>
          </TouchableOpacity>

          <Text style={styles.title}>요금제</Text>
          <Text style={styles.subtitle}>
            당신에게 맞는 플랜을 선택하세요
          </Text>

          {/* Billing Toggle */}
          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                billingPeriod === 'monthly' && styles.toggleButtonActive,
              ]}
              onPress={() => setBillingPeriod('monthly')}
            >
              <Text
                style={[
                  styles.toggleText,
                  billingPeriod === 'monthly' && styles.toggleTextActive,
                ]}
              >
                월간
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                billingPeriod === 'yearly' && styles.toggleButtonActive,
              ]}
              onPress={() => setBillingPeriod('yearly')}
            >
              <Text
                style={[
                  styles.toggleText,
                  billingPeriod === 'yearly' && styles.toggleTextActive,
                ]}
              >
                연간
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>할인</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Pricing Cards */}
          {tiers.map((tier) => {
            const subscription = SUBSCRIPTIONS[tier];
            const isPopular = tier === 'pro';
            const discount = getYearlyDiscount(tier);

            return (
              <View
                key={tier}
                style={[
                  styles.pricingCard,
                  isPopular && styles.pricingCardPopular,
                ]}
              >
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>인기</Text>
                  </View>
                )}

                <Text style={styles.tierName}>{tierNames[tier]}</Text>
                <Text style={styles.tierDesc}>{tierDescriptions[tier]}</Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {formatSubscriptionPrice(tier, billingPeriod)}
                  </Text>
                  {tier !== 'free' && (
                    <Text style={styles.priceUnit}>
                      / {billingPeriod === 'monthly' ? '월' : '년'}
                    </Text>
                  )}
                </View>

                {billingPeriod === 'yearly' && discount > 0 && (
                  <Text style={styles.discountLabel}>
                    {discount}% 할인 적용
                  </Text>
                )}

                <View style={styles.featuresList}>
                  {subscription.features.slice(0, 5).map((feature) => (
                    <View key={feature.id} style={styles.featureItem}>
                      <Text
                        style={[
                          styles.featureIcon,
                          !feature.included && styles.featureDisabled,
                        ]}
                      >
                        {feature.included ? '✓' : '✗'}
                      </Text>
                      <Text
                        style={[
                          styles.featureText,
                          !feature.included && styles.featureDisabled,
                        ]}
                      >
                        {feature.nameKo}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.subscribeButton,
                    isPopular && styles.subscribeButtonPopular,
                  ]}
                  onPress={() => handleSubscribe(tier)}
                >
                  {isPopular ? (
                    <LinearGradient
                      colors={['#4ade80', '#22d3ee']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.subscribeButtonGradient}
                    >
                      <Text style={styles.subscribeTextPopular}>구독하기</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.subscribeText}>
                      {tier === 'free' ? '무료로 시작' : '구독하기'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4ade80',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#4ade80',
  },
  toggleText: {
    color: '#94a3b8',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#0f172a',
  },
  discountBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '700',
  },
  pricingCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pricingCardPopular: {
    borderColor: '#4ade80',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#4ade80',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    marginTop: 8,
  },
  tierDesc: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  priceUnit: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 4,
  },
  discountLabel: {
    fontSize: 12,
    color: '#4ade80',
    textAlign: 'center',
    marginBottom: 16,
  },
  featuresList: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  featureIcon: {
    color: '#4ade80',
    fontWeight: '600',
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
  },
  featureDisabled: {
    color: '#64748b',
  },
  subscribeButton: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  subscribeButtonPopular: {
    borderWidth: 0,
    overflow: 'hidden',
  },
  subscribeButtonGradient: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#fff',
    fontWeight: '600',
  },
  subscribeTextPopular: {
    color: '#0f172a',
    fontWeight: '600',
  },
});
