import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 생성 시작...');

  // 1. 관리자 계정 생성
  const adminPassword = await bcrypt.hash('Admin123!@#', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@adventure-game.com' },
    update: {},
    create: {
      email: 'admin@adventure-game.com',
      name: '관리자',
      hashedPassword: adminPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
      subscription: 'ENTERPRISE',
    },
  });
  console.log('✅ 관리자 계정 생성:', admin.email);

  // 2. 테스트 유저 계정 생성
  const testPassword = await bcrypt.hash('Test123!@#', 12);
  const testUsers = [
    { email: 'starter@test.com', name: '스타터 유저', subscription: 'STARTER' as const },
    { email: 'pro@test.com', name: '프로 유저', subscription: 'PRO' as const },
    { email: 'free@test.com', name: '무료 유저', subscription: 'FREE' as const },
  ];

  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        hashedPassword: testPassword,
        emailVerified: new Date(),
        role: 'USER',
        subscription: userData.subscription,
      },
    });
    console.log('✅ 테스트 유저 생성:', user.email);

    // 리더보드 엔트리 생성
    await prisma.leaderboardEntry.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        highestLevel: Math.floor(Math.random() * 10) + 1,
        totalProjects: Math.floor(Math.random() * 20),
        totalEarnings: BigInt(Math.floor(Math.random() * 100000000)),
        highestReputation: Math.floor(Math.random() * 50) + 50,
        longestStreak: Math.floor(Math.random() * 10),
      },
    });
  }

  // 3. 일별 통계 시드 데이터 생성 (최근 30일)
  console.log('📊 일별 통계 데이터 생성 중...');
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyStats.upsert({
      where: { date },
      update: {},
      create: {
        date,
        activeUsers: Math.floor(Math.random() * 100) + 10,
        newUsers: Math.floor(Math.random() * 20),
        gamesStarted: Math.floor(Math.random() * 50) + 5,
        gamesCompleted: Math.floor(Math.random() * 30),
        projectsStarted: Math.floor(Math.random() * 100) + 20,
        projectsCompleted: Math.floor(Math.random() * 80) + 10,
        revenue: BigInt(Math.floor(Math.random() * 1000000)),
        newSubscribers: Math.floor(Math.random() * 5),
      },
    });
  }
  console.log('✅ 일별 통계 30일치 생성 완료');

  // 4. 게임 분석 샘플 데이터
  console.log('🎮 게임 분석 샘플 데이터 생성 중...');
  const eventTypes = [
    'game_started',
    'client_selected',
    'strategy_set',
    'project_completed',
    'achievement_unlocked',
    'skill_learned',
  ];
  const platforms = ['web', 'ios', 'android'];

  for (let i = 0; i < 100; i++) {
    await prisma.gameAnalytics.create({
      data: {
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        eventData: {
          level: Math.floor(Math.random() * 10) + 1,
          timestamp: new Date().toISOString(),
        },
        sessionId: `session_${Math.random().toString(36).substring(7)}`,
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        deviceType: Math.random() > 0.5 ? 'mobile' : 'desktop',
        playerLevel: Math.floor(Math.random() * 10) + 1,
      },
    });
  }
  console.log('✅ 게임 분석 데이터 100개 생성 완료');

  console.log('');
  console.log('🎉 시드 데이터 생성 완료!');
  console.log('');
  console.log('📌 테스트 계정 정보:');
  console.log('   관리자: admin@adventure-game.com / Admin123!@#');
  console.log('   스타터: starter@test.com / Test123!@#');
  console.log('   프로: pro@test.com / Test123!@#');
  console.log('   무료: free@test.com / Test123!@#');
}

main()
  .catch((e) => {
    console.error('❌ 시드 실행 중 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
