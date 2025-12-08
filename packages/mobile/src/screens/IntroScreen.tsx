import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { formatMoney } from '@adventure/shared';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Intro'>;
};

export default function IntroScreen({ navigation }: Props) {
  const [playerName, setPlayerName] = useState('');

  const handleStart = () => {
    navigation.navigate('Game', { playerName: playerName || '신입 마케터' });
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <Text style={styles.logoIcon}>📊</Text>
            <Text style={styles.title}>마케터 생존기</Text>
            <Text style={styles.subtitle}>MARKETING SIMULATOR</Text>

            {/* Description */}
            <Text style={styles.description}>
              당신은 이제 막 마케팅 에이전시에 입사한 신입 마케터입니다.{'\n'}
              클라이언트의 홈페이지를 홍보하고, 성과를 만들어내세요!
            </Text>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statText}>
                  시작 자금: {formatMoney(5000000)}
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statText}>초기 평판: 50점</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statIcon}>🎯</Text>
                <Text style={styles.statText}>목표: 에이전시 성장</Text>
              </View>
            </View>

            {/* Name Input */}
            <TextInput
              style={styles.input}
              placeholder="마케터 이름 입력..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
              onSubmitEditing={handleStart}
            />

            {/* Start Button */}
            <TouchableOpacity onPress={handleStart} activeOpacity={0.8}>
              <LinearGradient
                colors={['#4ade80', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>게임 시작 →</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Features */}
            <View style={styles.featuresGrid}>
              <View style={styles.featureBox}>
                <Text style={styles.featureIcon}>📈</Text>
                <Text style={styles.featureTitle}>실제 마케팅 학습</Text>
                <Text style={styles.featureDesc}>
                  SEO, SNS, 광고 등 실제 마케팅 전략을 경험
                </Text>
              </View>
              <View style={styles.featureBox}>
                <Text style={styles.featureIcon}>🎮</Text>
                <Text style={styles.featureTitle}>시뮬레이션 게임</Text>
                <Text style={styles.featureDesc}>
                  리스크 없이 마케팅 의사결정을 연습
                </Text>
              </View>
              <View style={styles.featureBox}>
                <Text style={styles.featureIcon}>🏆</Text>
                <Text style={styles.featureTitle}>성장 시스템</Text>
                <Text style={styles.featureDesc}>
                  레벨업하고 더 큰 프로젝트에 도전
                </Text>
              </View>
              <View style={styles.featureBox}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureTitle}>실제 지표</Text>
                <Text style={styles.featureDesc}>
                  CTR, CPA, ROAS 등 실제 마케팅 지표 사용
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#4ade80',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    letterSpacing: 3,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statText: {
    color: '#fff',
    fontSize: 13,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  featureBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
});
