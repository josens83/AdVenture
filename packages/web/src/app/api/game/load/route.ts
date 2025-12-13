import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CLIENTS } from '@adventure/shared';

// Load a specific game save
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slotNumber = parseInt(searchParams.get('slot') || '1');

    // Get the game save
    const gameSave = await prisma.gameSave.findUnique({
      where: {
        userId_slotNumber: {
          userId: session.user.id,
          slotNumber,
        },
      },
    });

    if (!gameSave) {
      return NextResponse.json(
        { error: 'Save not found' },
        { status: 404 }
      );
    }

    // Get user achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: session.user.id },
      select: {
        achievementId: true,
        unlockedAt: true,
        rewardClaimed: true,
      },
    });

    // Get user skills (may not exist if migration hasn't run)
    let userSkills: { skillId: string; level: number; experience: number }[] = [];
    try {
      userSkills = await prisma.userSkill.findMany({
        where: { userId: session.user.id },
        select: { skillId: true, level: true, experience: true },
      });
    } catch {
      // Skills table may not exist yet
    }

    // Get current client if exists
    let currentClient = null;
    if (gameSave.currentClientId) {
      currentClient = CLIENTS.find((c) => c.id === gameSave.currentClientId) || null;
    }

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: 'game_loaded',
        eventData: {
          slotNumber,
          level: gameSave.playerLevel,
        },
      },
    });

    return NextResponse.json({
      save: {
        id: gameSave.id,
        slotNumber: gameSave.slotNumber,
        playerName: gameSave.playerName,
        playerLevel: gameSave.playerLevel,
        playerExperience: gameSave.playerExperience,
        playerMoney: gameSave.playerMoney.toString(),
        playerReputation: gameSave.playerReputation,
        completedProjects: gameSave.completedProjects,
        totalEarnings: gameSave.totalEarnings.toString(),
        unlockedChannels: gameSave.unlockedChannels,
        gameState: gameSave.gameState,
        currentDay: gameSave.currentDay,
        currentClient,
        currentStrategy: gameSave.currentStrategy,
        executionProgress: gameSave.executionProgress,
        executionResults: gameSave.executionResults,
        teamMembers: gameSave.teamMembers,
        updatedAt: gameSave.updatedAt,
      },
      achievements,
      skills: userSkills.map((skill) => ({
        id: skill.skillId,
        level: skill.level,
        experience: skill.experience,
      })),
    });
  } catch (error) {
    console.error('Load game error:', error);
    return NextResponse.json(
      { error: 'Failed to load game' },
      { status: 500 }
    );
  }
}
