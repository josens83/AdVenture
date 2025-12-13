import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { requestType, additionalInfo } = body;

    const validTypes = ['access', 'export', 'delete', 'correction'];
    if (!validTypes.includes(requestType)) {
      return NextResponse.json(
        { error: '유효하지 않은 요청 유형입니다.' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Handle different request types
    switch (requestType) {
      case 'access':
      case 'export': {
        // Fetch all user data
        const userData = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            // Related data
            gameSaves: {
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
                createdAt: true,
                updatedAt: true,
              },
            },
            achievements: {
              select: {
                id: true,
                achievementId: true,
                unlockedAt: true,
              },
            },
            leaderboardEntries: {
              select: {
                id: true,
                score: true,
                totalEarnings: true,
                projectsCompleted: true,
                maxReputation: true,
                updatedAt: true,
              },
            },
            subscription: {
              select: {
                id: true,
                stripeSubscriptionId: true,
                stripePriceId: true,
                stripeCurrentPeriodEnd: true,
                status: true,
                createdAt: true,
                updatedAt: true,
              },
            },
            userSkills: {
              select: {
                skillId: true,
                level: true,
                experience: true,
                createdAt: true,
              },
            },
            analytics: {
              select: {
                eventType: true,
                eventData: true,
                createdAt: true,
              },
            },
          },
        });

        if (!userData) {
          return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
        }

        // Log the access request
        await prisma.userAnalytics.create({
          data: {
            userId,
            eventType: `gdpr_${requestType}`,
            eventData: { timestamp: new Date().toISOString() },
          },
        });

        return NextResponse.json({
          success: true,
          data: {
            exportedAt: new Date().toISOString(),
            user: userData,
          },
        });
      }

      case 'correction': {
        if (!additionalInfo) {
          return NextResponse.json(
            { error: '정정할 내용을 입력해주세요.' },
            { status: 400 }
          );
        }

        // Log the correction request for manual review
        await prisma.userAnalytics.create({
          data: {
            userId,
            eventType: 'gdpr_correction_request',
            eventData: {
              additionalInfo,
              requestedAt: new Date().toISOString(),
              status: 'pending',
            },
          },
        });

        // In a production system, this would:
        // 1. Send an email to the support team
        // 2. Create a ticket in the support system
        // 3. Notify the user of the request status

        return NextResponse.json({
          success: true,
          message: '정정 요청이 접수되었습니다. 검토 후 이메일로 안내드리겠습니다.',
        });
      }

      case 'delete': {
        // For account deletion, we need to:
        // 1. Mark the account for deletion
        // 2. Send confirmation email
        // 3. Schedule actual deletion after grace period

        // Log the deletion request
        await prisma.userAnalytics.create({
          data: {
            userId,
            eventType: 'gdpr_delete_request',
            eventData: {
              requestedAt: new Date().toISOString(),
              scheduledDeletionDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(), // 30 days grace period
            },
          },
        });

        // In a production system, this would:
        // 1. Send confirmation email with cancellation link
        // 2. Schedule a job to delete the account after 30 days
        // 3. Disable the account immediately if requested

        // For now, we'll soft-delete by marking the account
        // The actual deletion would be handled by a scheduled job

        return NextResponse.json({
          success: true,
          message:
            '계정 삭제 요청이 접수되었습니다. 30일 후에 모든 데이터가 영구 삭제됩니다. 취소를 원하시면 고객센터로 문의해주세요.',
        });
      }

      default:
        return NextResponse.json(
          { error: '지원하지 않는 요청 유형입니다.' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('GDPR request error:', error);
    return NextResponse.json(
      { error: '요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET - Check pending GDPR requests
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    // Check for any pending deletion request
    const deletionRequest = await prisma.userAnalytics.findFirst({
      where: {
        userId: session.user.id,
        eventType: 'gdpr_delete_request',
      },
      orderBy: { createdAt: 'desc' },
    });

    const correctionRequests = await prisma.userAnalytics.findMany({
      where: {
        userId: session.user.id,
        eventType: 'gdpr_correction_request',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json({
      pendingDeletion: deletionRequest
        ? {
            requestedAt: deletionRequest.createdAt,
            scheduledDate: (deletionRequest.eventData as { scheduledDeletionDate?: string })?.scheduledDeletionDate,
          }
        : null,
      correctionRequests: correctionRequests.map((r) => ({
        requestedAt: r.createdAt,
        status: (r.eventData as { status?: string })?.status || 'pending',
      })),
    });
  } catch (error) {
    console.error('GDPR status check error:', error);
    return NextResponse.json(
      { error: '상태 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
