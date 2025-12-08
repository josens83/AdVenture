import React, { useState, useEffect } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../App';
import {
  GameEngine,
  GameState,
  Client,
  MarketingStrategy,
  CLIENTS,
  CHANNELS,
  getClientsByLevel,
  getChannelsByLevel,
  formatMoney,
} from '@adventure/shared';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

export default function GameScreen({ navigation, route }: Props) {
  const [engine, setEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>('clientSelect');
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [strategy, setStrategy] = useState<MarketingStrategy>({
    seo: 0,
    sns: 0,
    ads: 0,
    content: 0,
    email: 0,
    influencer: 0,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const playerName = route.params?.playerName || '신입 마케터';
    const newEngine = new GameEngine(playerName);
    setEngine(newEngine);
  }, [route.params?.playerName]);

  if (!engine) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const player = engine.getPlayer();
  const availableClients = getClientsByLevel(player.level);
  const availableChannels = getChannelsByLevel(player.level);

  const handleSelectClient = (client: Client) => {
    if (engine.selectClient(client)) {
      setCurrentClient(client);
      setGameState('strategy');
      setStrategy({
        seo: 0,
        sns: 0,
        ads: 0,
        content: 0,
        email: 0,
        influencer: 0,
      });
    }
  };

  const handleStartExecution = () => {
    const total = Object.values(strategy).reduce((sum, val) => sum + val, 0);
    if (total < 50) {
      setMessage('최소 50% 이상의 예산을 배분해주세요!');
      return;
    }

    engine.setStrategy(strategy);
    if (engine.startExecution()) {
      setGameState('execution');
      setMessage('');
    }
  };

  const handleSimulateStep = () => {
    const result = engine.simulateStep();
    if (result && result.events.length > 0) {
      setMessage(result.events[0].messageKo);
    }

    if (engine.getState() === 'analysis') {
      const projectResult = engine.calculateResults();
      Alert.alert(
        projectResult.success ? '프로젝트 성공!' : '목표 미달성',
        `방문자: ${projectResult.visitors.toLocaleString()}명\n전환율: ${projectResult.conversion}%\n정산금: ${formatMoney(projectResult.payment)}`,
        [
          {
            text: '계속하기',
            onPress: () => {
              if (!engine.continueGame()) {
                Alert.alert('게임 오버', '더 이상 진행할 수 없습니다.', [
                  {
                    text: '다시 시작',
                    onPress: () => navigation.replace('Intro'),
                  },
                ]);
              } else {
                setGameState('clientSelect');
                setCurrentClient(null);
              }
            },
          },
        ]
      );
    }
  };

  const handleSave = async () => {
    const save = engine.createSave();
    try {
      await AsyncStorage.setItem('adventure-save', JSON.stringify(save));
      Alert.alert('저장 완료', '게임이 저장되었습니다.');
    } catch (error) {
      Alert.alert('오류', '저장에 실패했습니다.');
    }
  };

  // Header Component
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.playerName}>👤 {player.name}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{player.level}</Text>
        </View>
      </View>
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💰</Text>
          <Text style={styles.statValue}>{formatMoney(player.money)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>평판 {player.reputation}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>💾</Text>
      </TouchableOpacity>
    </View>
  );

  // Client Select Screen
  const renderClientSelect = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>📋 클라이언트 선택</Text>
      <Text style={styles.sectionDesc}>
        프로젝트를 선택하세요. 난이도가 높을수록 보상도 큽니다.
      </Text>

      {availableClients.map((client) => (
        <TouchableOpacity
          key={client.id}
          style={[
            styles.clientCard,
            {
              borderColor:
                client.difficulty === 'easy'
                  ? '#4ade80'
                  : client.difficulty === 'medium'
                  ? '#fbbf24'
                  : '#f87171',
            },
          ]}
          onPress={() => handleSelectClient(client)}
          activeOpacity={0.8}
        >
          <View style={styles.clientHeader}>
            <Text style={styles.clientName}>{client.name}</Text>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor:
                    client.difficulty === 'easy'
                      ? '#4ade80'
                      : client.difficulty === 'medium'
                      ? '#fbbf24'
                      : '#f87171',
                },
              ]}
            >
              <Text style={styles.difficultyText}>
                {client.difficulty === 'easy'
                  ? '쉬움'
                  : client.difficulty === 'medium'
                  ? '보통'
                  : '어려움'}
              </Text>
            </View>
          </View>

          <Text style={styles.clientIndustry}>{client.industry}</Text>
          <Text style={styles.clientDesc}>{client.description}</Text>

          <View style={styles.clientDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💵 예산</Text>
              <Text style={styles.detailValue}>
                {formatMoney(client.budget)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 기간</Text>
              <Text style={styles.detailValue}>{client.duration}일</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🎯 목표 방문자</Text>
              <Text style={styles.detailValue}>
                {client.targetKPI.visitors.toLocaleString()}명
              </Text>
            </View>
          </View>

          <Text style={styles.clientDemand}>💬 "{client.demands}"</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Strategy Screen
  const renderStrategy = () => {
    if (!currentClient) return null;
    const totalAllocation = Object.values(strategy).reduce(
      (sum, val) => sum + val,
      0
    );

    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>🎯 마케팅 전략 수립</Text>
        <Text style={styles.sectionDesc}>{currentClient.name}</Text>

        {/* Budget Overview */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetLabel}>예산 배분</Text>
            <Text
              style={[
                styles.budgetValue,
                { color: totalAllocation > 100 ? '#f87171' : '#4ade80' },
              ]}
            >
              {totalAllocation}%
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(totalAllocation, 100)}%`,
                  backgroundColor:
                    totalAllocation > 100 ? '#f87171' : '#4ade80',
                },
              ]}
            />
          </View>
          {totalAllocation < 50 && (
            <Text style={styles.warningText}>
              ⚠️ 최소 50% 이상의 예산을 배분해야 합니다.
            </Text>
          )}
        </View>

        {/* Channels */}
        {availableChannels.map((channel) => (
          <View key={channel.id} style={styles.channelCard}>
            <View style={styles.channelHeader}>
              <Text style={styles.channelIcon}>{channel.icon}</Text>
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.nameKo}</Text>
                <Text style={styles.channelDesc}>{channel.descriptionKo}</Text>
              </View>
            </View>
            <View style={styles.sliderContainer}>
              {[0, 10, 20, 30, 40, 50].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    strategy[channel.id as keyof MarketingStrategy] === value &&
                      styles.sliderButtonActive,
                  ]}
                  onPress={() =>
                    setStrategy({
                      ...strategy,
                      [channel.id]: value,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      strategy[channel.id as keyof MarketingStrategy] ===
                        value && styles.sliderButtonTextActive,
                    ]}
                  >
                    {value}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {message !== '' && <Text style={styles.errorMessage}>{message}</Text>}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setGameState('clientSelect');
              setCurrentClient(null);
            }}
          >
            <Text style={styles.secondaryButtonText}>← 뒤로</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (totalAllocation < 50 || totalAllocation > 100) &&
                styles.buttonDisabled,
            ]}
            onPress={handleStartExecution}
            disabled={totalAllocation < 50 || totalAllocation > 100}
          >
            <LinearGradient
              colors={['#4ade80', '#22d3ee']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>실행 시작 →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  // Execution Screen
  const renderExecution = () => {
    if (!currentClient) return null;
    const progress =
      (engine.getExecutionProgress() / currentClient.duration) * 100;

    return (
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>🚀 마케팅 실행 중</Text>
        <Text style={styles.sectionDesc}>{currentClient.name}</Text>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>
            {engine.getExecutionProgress()}/{currentClient.duration}일
          </Text>
          <View style={styles.progressBarLarge}>
            <LinearGradient
              colors={['#4ade80', '#22d3ee']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFillLarge, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressPercent}>{Math.round(progress)}% 완료</Text>
        </View>

        {message !== '' && (
          <View style={styles.eventCard}>
            <Text style={styles.eventMessage}>{message}</Text>
          </View>
        )}

        <View style={styles.loadingIndicator}>
          <Text style={styles.loadingDot}>●</Text>
          <Text style={styles.loadingText}>데이터 수집 중...</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSimulateStep}
        >
          <LinearGradient
            colors={['#4ade80', '#22d3ee']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>5일 경과 ⏩</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        {gameState === 'clientSelect' && renderClientSelect()}
        {gameState === 'strategy' && renderStrategy()}
        {(gameState === 'execution' || gameState === 'analysis') &&
          renderExecution()}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#94a3b8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerName: {
    color: '#fff',
    fontWeight: '600',
  },
  levelBadge: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 12,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
  },
  sectionDesc: {
    color: '#94a3b8',
    marginBottom: 20,
  },
  clientCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '600',
  },
  clientIndustry: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 8,
  },
  clientDesc: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  clientDetails: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  detailLabel: {
    color: '#94a3b8',
    fontSize: 13,
  },
  detailValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  clientDemand: {
    color: '#fbbf24',
    fontSize: 13,
    fontStyle: 'italic',
  },
  budgetCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  warningText: {
    color: '#fbbf24',
    fontSize: 12,
    marginTop: 8,
  },
  channelCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  channelIcon: {
    fontSize: 28,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  channelDesc: {
    color: '#94a3b8',
    fontSize: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sliderButtonActive: {
    backgroundColor: '#4ade80',
  },
  sliderButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  sliderButtonTextActive: {
    color: '#0f172a',
  },
  errorMessage: {
    color: '#f87171',
    textAlign: 'center',
    marginVertical: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarLarge: {
    width: '100%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 10,
  },
  progressPercent: {
    color: '#4ade80',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.5)',
  },
  eventMessage: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  loadingDot: {
    color: '#4ade80',
    fontSize: 12,
  },
});
