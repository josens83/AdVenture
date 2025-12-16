import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { GameValidator } from '@/lib/game-validator';
import { GAME_CONFIG } from '@adventure/shared';

// Save game state
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slotNumber = 1, playerState, gameState, currentData } = body;

    // Validate player state
    const validation = GameValidator.validatePlayerState(playerState);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check save slot limits based on subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscription: true },
    });

    const subscriptionKey = (user?.subscription || 'FREE').toLowerCase() as keyof typeof GAME_CONFIG.SAVE_SLOTS;
    const maxSlots = GAME_CONFIG.SAVE_SLOTS[subscriptionKey] ?? GAME_CONFIG.SAVE_SLOTS.free;
    if (maxSlots !== -1 && slotNumber > maxSlots) {
      return NextResponse.json(
        { error: `Upgrade to save to slot ${slotNumber}` },
        { status: 403 }
      );
    }

    // Upsert game save
    const save = await prisma.gameSave.upsert({
      where: {
        userId_slotNumber: {
          userId: session.user.id,
          slotNumber,
        },
      },
      update: {
        playerName: playerState.name,
        playerLevel: playerState.level,
        playerExperience: playerState.experience,
        playerMoney: BigInt(playerState.money),
        playerReputation: playerState.reputation,
        completedProjects: playerState.completedProjects,
        totalEarnings: BigInt(playerState.totalEarnings || 0),
        unlockedChannels: playerState.unlockedChannels || ['seo', 'sns', 'ads', 'content'],
        gameState: gameState,
        currentDay: currentData?.currentDay || 1,
        currentClientId: currentData?.clientId,
        currentStrategy: currentData?.strategy,
        executionProgress: currentData?.executionProgress || 0,
        executionResults: currentData?.executionResults,
        teamMembers: playerState.teamMembers,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        slotNumber,
        playerName: playerState.name,
        playerLevel: playerState.level,
        playerExperience: playerState.experience,
        playerMoney: BigInt(playerState.money),
        playerReputation: playerState.reputation,
        completedProjects: playerState.completedProjects,
        totalEarnings: BigInt(playerState.totalEarnings || 0),
        unlockedChannels: playerState.unlockedChannels || ['seo', 'sns', 'ads', 'content'],
        gameState: gameState,
        currentDay: currentData?.currentDay || 1,
        currentClientId: currentData?.clientId,
        currentStrategy: currentData?.strategy,
        executionProgress: currentData?.executionProgress || 0,
        executionResults: currentData?.executionResults,
        teamMembers: playerState.teamMembers,
      },
    });

    // Update leaderboard
    await prisma.leaderboardEntry.upsert({
      where: { userId: session.user.id },
      update: {
        highestLevel: {
          set: playerState.level,
        },
        totalProjects: playerState.completedProjects,
        totalEarnings: BigInt(playerState.totalEarnings || 0),
        highestReputation: Math.max(
          playerState.reputation,
          (await prisma.leaderboardEntry.findUnique({
            where: { userId: session.user.id },
            select: { highestReputation: true },
          }))?.highestReputation || 0
        ),
      },
      create: {
        userId: session.user.id,
        highestLevel: playerState.level,
        totalProjects: playerState.completedProjects,
        totalEarnings: BigInt(playerState.totalEarnings || 0),
        highestReputation: playerState.reputation,
      },
    });

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: 'game_saved',
        eventData: {
          slotNumber,
          level: playerState.level,
          completedProjects: playerState.completedProjects,
        },
      },
    });

    return NextResponse.json({
      success: true,
      saveId: save.id,
      savedAt: save.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}

// Get user's saves
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const saves = await prisma.gameSave.findMany({
      where: { userId: session.user.id },
      orderBy: { slotNumber: 'asc' },
      select: {
        id: true,
        slotNumber: true,
        playerName: true,
        playerLevel: true,
        playerMoney: true,
        playerReputation: true,
        completedProjects: true,
        gameState: true,
        currentDay: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      saves: saves.map((save: typeof saves[number]) => ({
        ...save,
        playerMoney: save.playerMoney.toString(),
      })),
    });
  } catch (error) {
    console.error('Load saves error:', error);
    return NextResponse.json(
      { error: 'Failed to load saves' },
      { status: 500 }
    );
  }
}

// Delete a save
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slotNumber = parseInt(searchParams.get('slot') || '1');

    await prisma.gameSave.delete({
      where: {
        userId_slotNumber: {
          userId: session.user.id,
          slotNumber,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete save error:', error);
    return NextResponse.json(
      { error: 'Failed to delete save' },
      { status: 500 }
    );
  }
}
