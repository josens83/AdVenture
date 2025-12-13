import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { formatMoney } from '@adventure/shared';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

interface UserData {
  id: string;
  name: string;
  email: string;
  subscription: string;
  subscriptionEnd?: string;
}

interface GameStats {
  highestLevel: number;
  totalProjects: number;
  totalEarnings: string;
  highestReputation: number;
}

export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load game stats from local storage
      const statsData = await AsyncStorage.getItem('game-stats');
      if (statsData) {
        setStats(JSON.parse(statsData));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove(['auth-token', 'user']);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '계정 삭제',
      '정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to delete account
            Alert.alert('알림', '계정이 삭제되었습니다.');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      '데이터 초기화',
      '게임 데이터를 모두 삭제하시겠습니까? (계정은 유지됩니다)',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('adventure-save');
            await AsyncStorage.removeItem('game-stats');
            setStats(null);
            Alert.alert('알림', '게임 데이터가 초기화되었습니다.');
          },
        },
      ]
    );
  };

  const getSubscriptionLabel = (tier: string) => {
    const labels: Record<string, string> = {
      FREE: '무료',
      STARTER: '스타터',
      PRO: '프로',
      ENTERPRISE: '엔터프라이즈',
    };
    return labels[tier] || tier;
  };

  const getSubscriptionColor = (tier: string) => {
    const colors: Record<string, string> = {
      FREE: '#64748b',
      STARTER: '#22c55e',
      PRO: '#3b82f6',
      ENTERPRISE: '#f59e0b',
    };
    return colors[tier] || '#64748b';
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() || '👤'}
              </Text>
            </View>
            <Text style={styles.userName}>{user?.name || '게스트'}</Text>
            <Text style={styles.userEmail}>{user?.email || '로그인이 필요합니다'}</Text>
            {user?.subscription && (
              <View
                style={[
                  styles.subscriptionBadge,
                  { backgroundColor: getSubscriptionColor(user.subscription) },
                ]}
              >
                <Text style={styles.subscriptionText}>
                  {getSubscriptionLabel(user.subscription)}
                </Text>
              </View>
            )}
          </View>

          {/* Game Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>게임 통계</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.highestLevel || 1}</Text>
                <Text style={styles.statLabel}>최고 레벨</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.totalProjects || 0}</Text>
                <Text style={styles.statLabel}>완료 프로젝트</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>
                  {formatMoney(parseInt(stats?.totalEarnings || '0'))}
                </Text>
                <Text style={styles.statLabel}>총 수익</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats?.highestReputation || 50}</Text>
                <Text style={styles.statLabel}>최고 평판</Text>
              </View>
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>설정</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>알림</Text>
                <Text style={styles.settingDesc}>푸시 알림 수신</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#334155', true: '#4ade80' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>사운드</Text>
                <Text style={styles.settingDesc}>게임 효과음</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#334155', true: '#4ade80' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Subscription */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>구독</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Pricing')}
            >
              <Text style={styles.menuIcon}>⭐</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>요금제 업그레이드</Text>
                <Text style={styles.menuDesc}>더 많은 기능을 이용하세요</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>계정</Text>

            <TouchableOpacity style={styles.menuItem} onPress={handleClearData}>
              <Text style={styles.menuIcon}>🗑️</Text>
              <View style={styles.menuInfo}>
                <Text style={styles.menuLabel}>게임 데이터 초기화</Text>
                <Text style={styles.menuDesc}>진행 상황 삭제</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>

            {user && (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                  <Text style={styles.menuIcon}>🚪</Text>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuLabel}>로그아웃</Text>
                  </View>
                  <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItemDanger} onPress={handleDeleteAccount}>
                  <Text style={styles.menuIcon}>⚠️</Text>
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuLabelDanger}>계정 삭제</Text>
                  </View>
                  <Text style={styles.menuArrow}>→</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>버전 1.0.0</Text>
            <Text style={styles.copyright}>© 2024 마케터 생존기</Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    color: '#4ade80',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  subscriptionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuItemDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
  menuDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  menuArrow: {
    color: '#64748b',
    fontSize: 18,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appVersion: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 4,
  },
  copyright: {
    color: '#475569',
    fontSize: 11,
  },
});
