import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get user to check for Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Cancel Stripe subscription if exists
    if (user.stripeCustomerId && process.env.STRIPE_SECRET_KEY) {
      try {
        // Get all subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
        });

        // Cancel all active subscriptions
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
        }
      } catch (stripeError) {
        console.error('Failed to cancel Stripe subscriptions:', stripeError);
        // Continue with deletion even if Stripe fails
      }
    }

    // Delete all related data in transaction
    await prisma.$transaction([
      // Delete user analytics
      prisma.userAnalytics.deleteMany({
        where: { userId },
      }),

      // Delete user achievements
      prisma.userAchievement.deleteMany({
        where: { userId },
      }),

      // Delete game saves
      prisma.gameSave.deleteMany({
        where: { userId },
      }),

      // Delete leaderboard entry
      prisma.leaderboardEntry.deleteMany({
        where: { userId },
      }),

      // Delete payments (keep for legal reasons? or delete?)
      prisma.payment.deleteMany({
        where: { userId },
      }),

      // Delete sessions
      prisma.session.deleteMany({
        where: { userId },
      }),

      // Delete accounts (OAuth connections)
      prisma.account.deleteMany({
        where: { userId },
      }),

      // Delete email verification tokens
      prisma.emailVerificationToken.deleteMany({
        where: { userId },
      }),

      // Delete password reset tokens
      prisma.passwordResetToken.deleteMany({
        where: { userId },
      }),

      // Finally, delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    // Log anonymized analytics for deletion tracking
    await prisma.gameAnalytics.create({
      data: {
        sessionId: `deleted_${Date.now()}`,
        eventType: 'account_deleted',
        eventData: {
          deletedAt: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: '계정이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: '계정 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
