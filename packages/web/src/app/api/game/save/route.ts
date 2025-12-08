import { NextRequest, NextResponse } from 'next/server';
import { GameSave } from '@adventure/shared';

// In production, this would save to a database
const gameSaves = new Map<string, GameSave[]>();

export async function POST(request: NextRequest) {
  try {
    const { userId, save } = await request.json();

    if (!userId || !save) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get existing saves for user
    const userSaves = gameSaves.get(userId) || [];

    // Check save slot limits based on subscription
    // This would be checked against the user's subscription in production

    // Add new save
    userSaves.push(save);

    // Keep only the last 10 saves
    if (userSaves.length > 10) {
      userSaves.shift();
    }

    gameSaves.set(userId, userSaves);

    return NextResponse.json({
      success: true,
      saveId: save.id,
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const userSaves = gameSaves.get(userId) || [];

    return NextResponse.json({
      saves: userSaves.map((save) => ({
        id: save.id,
        playerName: save.player.name,
        level: save.player.level,
        money: save.player.money,
        completedProjects: save.player.completedProjects,
        savedAt: save.savedAt,
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
