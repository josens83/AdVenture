import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Track analytics events
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      eventType,
      eventData,
      sessionId,
      deviceType,
      platform,
      appVersion,
      gameState,
      playerLevel,
      clientId,
    } = body;

    if (!eventType) {
      return NextResponse.json(
        { error: 'Event type required' },
        { status: 400 }
      );
    }

    // If user is logged in, save to user analytics
    if (session?.user?.id) {
      await prisma.userAnalytics.create({
        data: {
          userId: session.user.id,
          eventType,
          eventData,
          sessionId,
          deviceType,
          platform,
          appVersion,
        },
      });
    }

    // Always save to anonymous game analytics
    await prisma.gameAnalytics.create({
      data: {
        eventType,
        eventData,
        sessionId: sessionId || 'anonymous',
        deviceType,
        platform,
        gameState,
        playerLevel,
        clientId,
      },
    });

    // Update daily stats if applicable
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventType === 'game_started' || eventType === 'project_completed') {
      await prisma.dailyStats.upsert({
        where: { date: today },
        update: {
          gamesStarted:
            eventType === 'game_started' ? { increment: 1 } : undefined,
          projectsCompleted:
            eventType === 'project_completed' ? { increment: 1 } : undefined,
        },
        create: {
          date: today,
          gamesStarted: eventType === 'game_started' ? 1 : 0,
          projectsCompleted: eventType === 'project_completed' ? 1 : 0,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json({ success: true });
  }
}

// Get analytics summary (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin (you would implement this check)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

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

    // Get event counts
    const eventCounts = await prisma.gameAnalytics.groupBy({
      by: ['eventType'],
      where: {
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    // Get unique sessions
    const uniqueSessions = await prisma.gameAnalytics.findMany({
      where: {
        timestamp: { gte: startDate },
      },
      distinct: ['sessionId'],
      select: { sessionId: true },
    });

    // Get platform breakdown
    const platformBreakdown = await prisma.gameAnalytics.groupBy({
      by: ['platform'],
      where: {
        timestamp: { gte: startDate },
        platform: { not: null },
      },
      _count: true,
    });

    return NextResponse.json({
      dailyStats: dailyStats.map((stat: typeof dailyStats[number]) => ({
        ...stat,
        revenue: stat.revenue.toString(),
      })),
      eventCounts,
      uniqueSessions: uniqueSessions.length,
      platformBreakdown,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
