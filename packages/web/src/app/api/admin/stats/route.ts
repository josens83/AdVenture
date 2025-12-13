import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get daily stats
    const dailyStats = await prisma.dailyStats.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    // Get user counts
    const totalUsers = await prisma.user.count();
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });
    const verifiedUsers = await prisma.user.count({
      where: {
        emailVerified: { not: null },
      },
    });

    // Get subscription counts
    const subscriptionCounts = await prisma.user.groupBy({
      by: ['subscription'],
      _count: true,
    });

    // Get total revenue
    const payments = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCEEDED' },
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    // Get game stats
    const totalGameSaves = await prisma.gameSave.count();
    const totalAchievements = await prisma.userAchievement.count();

    // Get leaderboard top 10
    const topPlayers = await prisma.leaderboardEntry.findMany({
      take: 10,
      orderBy: { totalEarnings: 'desc' },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    // Get event counts for last 7 days
    const eventCounts = await prisma.userAnalytics.groupBy({
      by: ['eventType'],
      _count: true,
      where: {
        timestamp: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      users: {
        total: totalUsers,
        newToday: newUsersToday,
        verified: verifiedUsers,
      },
      subscriptions: subscriptionCounts.reduce(
        (acc, item) => ({
          ...acc,
          [item.subscription]: item._count,
        }),
        {}
      ),
      revenue: {
        total: payments._sum.amount || 0,
      },
      recentPayments: recentPayments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        tier: p.subscriptionTier,
        date: p.createdAt,
        user: p.user?.email || 'Unknown',
      })),
      game: {
        totalSaves: totalGameSaves,
        totalAchievements: totalAchievements,
      },
      topPlayers: topPlayers.map((p) => ({
        name: p.user.name || p.user.email,
        level: p.highestLevel,
        earnings: p.totalEarnings.toString(),
        projects: p.totalProjects,
      })),
      events: eventCounts.map((e) => ({
        type: e.eventType,
        count: e._count,
      })),
      dailyStats: dailyStats.map((d) => ({
        date: d.date,
        activeUsers: d.activeUsers,
        newUsers: d.newUsers,
        gamesStarted: d.gamesStarted,
        projectsCompleted: d.projectsCompleted,
        revenue: d.revenue.toString(),
        newSubscribers: d.newSubscribers,
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    if (error instanceof Error) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
      }
    }
    return NextResponse.json({ error: '통계 조회에 실패했습니다.' }, { status: 500 });
  }
}
