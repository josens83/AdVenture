import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all_time';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get leaderboard entries
    let orderBy: any;
    let rankField: string;

    switch (type) {
      case 'weekly':
        orderBy = { totalEarnings: 'desc' };
        rankField = 'weeklyRank';
        break;
      case 'monthly':
        orderBy = { totalProjects: 'desc' };
        rankField = 'monthlyRank';
        break;
      case 'level':
        orderBy = { highestLevel: 'desc' };
        rankField = 'allTimeRank';
        break;
      case 'all_time':
      default:
        orderBy = { totalEarnings: 'desc' };
        rankField = 'allTimeRank';
        break;
    }

    const entries = await prisma.leaderboardEntry.findMany({
      take: limit,
      skip: offset,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            subscription: true,
          },
        },
      },
    });

    // Get current user's position
    const session = await getServerSession(authOptions);
    let userRank = null;

    if (session?.user?.id) {
      const userEntry = await prisma.leaderboardEntry.findUnique({
        where: { userId: session.user.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              subscription: true,
            },
          },
        },
      });

      if (userEntry) {
        // Calculate rank
        const higherEntries = await prisma.leaderboardEntry.count({
          where: {
            totalEarnings: {
              gt: userEntry.totalEarnings,
            },
          },
        });
        userRank = {
          ...userEntry,
          rank: higherEntries + 1,
          totalEarnings: userEntry.totalEarnings.toString(),
        };
      }
    }

    // Format response
    const formattedEntries = entries.map((entry: typeof entries[number], index: number) => ({
      rank: offset + index + 1,
      userId: entry.user.id,
      playerName: entry.user.name || 'Anonymous',
      avatar: entry.user.image,
      subscription: entry.user.subscription,
      highestLevel: entry.highestLevel,
      totalProjects: entry.totalProjects,
      totalEarnings: entry.totalEarnings.toString(),
      highestReputation: entry.highestReputation,
      longestStreak: entry.longestStreak,
    }));

    // Get total count
    const totalCount = await prisma.leaderboardEntry.count();

    return NextResponse.json({
      entries: formattedEntries,
      totalCount,
      userRank,
      type,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load leaderboard' },
      { status: 500 }
    );
  }
}

// Update leaderboard ranks (should be called periodically via cron)
export async function POST(request: NextRequest) {
  try {
    // Verify this is an internal/cron request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update all-time ranks
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: { totalEarnings: 'desc' },
    });

    for (let i = 0; i < entries.length; i++) {
      await prisma.leaderboardEntry.update({
        where: { id: entries[i].id },
        data: { allTimeRank: i + 1 },
      });
    }

    return NextResponse.json({
      success: true,
      updated: entries.length,
    });
  } catch (error) {
    console.error('Leaderboard update error:', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard' },
      { status: 500 }
    );
  }
}
