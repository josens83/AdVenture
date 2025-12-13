import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import { formatMoney } from '@adventure/shared';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Intro'>;
};

export default function IntroScreen({ navigation }: Props) {
  const [playerName, setPlayerName] = useState('');
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    checkSavedGame();
    loadUserName();
  }, []);

  const checkSavedGame = async () => {
    try {
      const save = await AsyncStorage.getItem('adventure-save');
      setHasSavedGame(!!save);
    } catch (error) {
      console.error('Failed to check saved game:', error);
    }
  };

  const loadUserName = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || null);
      }
    } catch (error) {
      console.error('Failed to load user name:', error);
    }
  };

  const handleStart = () => {
    navigation.navigate('Game', { playerName: playerName || userName || '신입 마케터' });
  };

  const handleLoadGame = async () => {
    try {
      const save = await AsyncStorage.getItem('adventure-save');
      if (save) {
        const parsedSave = JSON.parse(save);
        navigation.navigate('Game', {
          playerName: parsedSave.player?.name || '마케터',
        });
      }
    } catch (error) {
      Alert.alert('오류', '저장된 게임을 불러올 수 없습니다.');
    }
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.topButtonText}>👤</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.navigate('Pricing')}
          >
            <Text style={styles.topButtonText}>⭐ PRO</Text>
          </TouchableOpacity>
        </View>

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
            <TouchableOpacity onPress={handleStart} activeOpacity={0.8} style={styles.buttonWrapper}>
              <LinearGradient
                colors={['#4ade80', '#22d3ee']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>새 게임 시작 →</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Load Game Button */}
            {hasSavedGame && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleLoadGame}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>저장된 게임 불러오기</Text>
              </TouchableOpacity>
            )}

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  topButton: {
    padding: 8,
  },
  topButtonText: {
    color: '#94a3b8',
    fontSize: 16,
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
  buttonWrapper: {
    width: '100%',
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
  secondaryButton: {
    width: '100%',
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#94a3b8',
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
