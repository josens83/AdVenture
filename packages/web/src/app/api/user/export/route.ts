import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // Get all user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        subscription: true,
        subscriptionEnd: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Get game saves
    const gameSaves = await prisma.gameSave.findMany({
      where: { userId: session.user.id },
      select: {
        slotNumber: true,
        playerName: true,
        playerLevel: true,
        playerExperience: true,
        playerMoney: true,
        playerReputation: true,
        completedProjects: true,
        totalEarnings: true,
        unlockedChannels: true,
        gameState: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: {
        achievementId: true,
        unlockedAt: true,
        rewardClaimed: true,
      },
    });

    // Get leaderboard entry
    const leaderboardEntry = await prisma.leaderboardEntry.findUnique({
      where: { userId: session.user.id },
      select: {
        highestLevel: true,
        totalProjects: true,
        totalEarnings: true,
        highestReputation: true,
        longestStreak: true,
        weeklyRank: true,
        monthlyRank: true,
        allTimeRank: true,
      },
    });

    // Get payment history
    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      select: {
        amount: true,
        currency: true,
        status: true,
        subscriptionTier: true,
        billingPeriod: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get activity analytics (limited to last 100 events)
    const analytics = await prisma.userAnalytics.findMany({
      where: { userId: session.user.id },
      select: {
        eventType: true,
        timestamp: true,
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });

    // Compile export data
    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        ...user,
        totalEarnings: leaderboardEntry?.totalEarnings?.toString() || '0',
      },
      gameSaves: gameSaves.map((save) => ({
        ...save,
        playerMoney: save.playerMoney.toString(),
        totalEarnings: save.totalEarnings.toString(),
      })),
      achievements,
      leaderboard: leaderboardEntry
        ? {
            ...leaderboardEntry,
            totalEarnings: leaderboardEntry.totalEarnings.toString(),
          }
        : null,
      payments,
      recentActivity: analytics,
    };

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: 'data_exported',
      },
    });

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    return NextResponse.json(
      { error: '데이터 내보내기에 실패했습니다.' },
      { status: 500 }
    );
  }
}
