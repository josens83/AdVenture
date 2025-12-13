import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, tierToDbEnum } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: '세션 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // Handle mock session
    if (sessionId.startsWith('mock_')) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { subscription: true },
      });

      return NextResponse.json({
        success: true,
        tier: user?.subscription?.toLowerCase() || 'pro',
        billingPeriod: 'monthly',
        mock: true,
      });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Retrieve checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!checkoutSession) {
      return NextResponse.json(
        { error: '결제 세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Verify payment status
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { error: '결제가 완료되지 않았습니다.' },
        { status: 400 }
      );
    }

    // Get metadata
    const tier = checkoutSession.metadata?.tier || 'pro';
    const billingPeriod = checkoutSession.metadata?.billingPeriod || 'monthly';
    const userId = checkoutSession.metadata?.userId;

    // Verify user matches
    if (userId !== session.user.id) {
      return NextResponse.json(
        { error: '사용자 정보가 일치하지 않습니다.' },
        { status: 403 }
      );
    }

    // Update user subscription if not already done by webhook
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user && user.subscription === 'FREE') {
      // Calculate subscription end date
      const subscriptionEnd = new Date();
      if (billingPeriod === 'yearly') {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
      } else {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          subscription: tierToDbEnum(tier),
          subscriptionEnd,
        },
      });
    }

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
        eventType: 'payment_verified',
        eventData: {
          tier,
          billingPeriod,
          sessionId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      tier,
      billingPeriod,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: '결제 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
