import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { GameValidator } from '@/lib/game-validator';
import { CLIENTS, MarketingStrategy } from '@adventure/shared';

// Validate game action before execution
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'select_client': {
        const { clientId, playerLevel, playerMoney } = data;
        const validation = GameValidator.validateClientSelection(
          clientId,
          playerLevel,
          playerMoney
        );
        return NextResponse.json(validation);
      }

      case 'set_strategy': {
        const { strategy, playerLevel, unlockedChannels } = data;
        const validation = GameValidator.validateStrategy(
          strategy as MarketingStrategy,
          playerLevel,
          unlockedChannels
        );
        return NextResponse.json(validation);
      }

      case 'validate_result': {
        const { clientId, strategy, submittedResult, seed } = data;
        const client = CLIENTS.find((c) => c.id === clientId);

        if (!client) {
          return NextResponse.json(
            { valid: false, error: 'Invalid client' },
            { status: 400 }
          );
        }

        // Calculate server-side result
        const serverResult = GameValidator.calculateResults(
          client,
          strategy as MarketingStrategy,
          seed
        );

        // Verify submitted result
        const verification = GameValidator.verifyResult(
          submittedResult,
          serverResult
        );

        // Log analytics for validation
        if (session?.user?.id) {
          await prisma.userAnalytics.create({
            data: {
              userId: session.user.id,
              eventType: 'result_validated',
              eventData: {
                clientId,
                valid: verification.valid,
                success: submittedResult.success,
              },
            },
          });
        }

        return NextResponse.json({
          ...verification,
          serverResult: verification.valid ? undefined : serverResult,
        });
      }

      case 'validate_player_state': {
        const { playerState } = data;
        const validation = GameValidator.validatePlayerState(playerState);
        return NextResponse.json(validation);
      }

      default:
        return NextResponse.json(
          { valid: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Validation failed' },
      { status: 500 }
    );
  }
}
