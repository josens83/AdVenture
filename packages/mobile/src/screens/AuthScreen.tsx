import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Auth'>;
};

export default function AuthScreen({ navigation }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
        return;
      }
      if (password.length < 8) {
        Alert.alert('오류', '비밀번호는 8자 이상이어야 합니다.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'signin' ? '/api/auth/signin' : '/api/auth/register';
      const body = mode === 'signin'
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '인증에 실패했습니다.');
      }

      // Store token/session
      await AsyncStorage.setItem('auth-token', data.token || '');
      await AsyncStorage.setItem('user', JSON.stringify(data.user || {}));

      Alert.alert('성공', mode === 'signin' ? '로그인되었습니다!' : '회원가입이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.replace('Intro'),
        },
      ]);
    } catch (error) {
      Alert.alert('오류', error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestPlay = () => {
    navigation.replace('Intro');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>📊</Text>
              <Text style={styles.title}>마케터 생존기</Text>
              <Text style={styles.subtitle}>Marketing Simulator</Text>
            </View>

            {/* Mode Toggle */}
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'signin' && styles.modeButtonActive]}
                onPress={() => setMode('signin')}
              >
                <Text style={[styles.modeButtonText, mode === 'signin' && styles.modeButtonTextActive]}>
                  로그인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, mode === 'signup' && styles.modeButtonActive]}
                onPress={() => setMode('signup')}
              >
                <Text style={[styles.modeButtonText, mode === 'signup' && styles.modeButtonTextActive]}>
                  회원가입
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {mode === 'signup' && (
                <TextInput
                  style={styles.input}
                  placeholder="이름 (닉네임)"
                  placeholderTextColor="#64748b"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="none"
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="이메일"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {mode === 'signup' && (
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 확인"
                  placeholderTextColor="#64748b"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              )}

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleAuth}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4ade80', '#22d3ee']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#0f172a" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      {mode === 'signin' ? '로그인' : '회원가입'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Social Login */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>🌐</Text>
                <Text style={styles.socialText}>Google로 계속</Text>
              </TouchableOpacity>
            </View>

            {/* Guest Play */}
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestPlay}>
              <Text style={styles.guestButtonText}>게스트로 플레이 (저장 안됨)</Text>
            </TouchableOpacity>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#4ade80',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeButtonActive: {
    backgroundColor: '#4ade80',
  },
  modeButtonText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: '#0f172a',
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#64748b',
    marginHorizontal: 12,
    fontSize: 12,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  socialIcon: {
    fontSize: 20,
  },
  socialText: {
    color: '#fff',
    fontWeight: '500',
  },
  guestButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#64748b',
    textDecorationLine: 'underline',
  },
});
