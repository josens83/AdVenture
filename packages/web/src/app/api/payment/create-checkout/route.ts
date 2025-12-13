import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe, getStripePriceId } from '@/lib/stripe';
import { SubscriptionTier, SUBSCRIPTIONS } from '@adventure/shared';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { tier, billingPeriod } = await request.json();

    if (!tier || !billingPeriod) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // Validate tier
    if (!['starter', 'pro', 'enterprise'].includes(tier)) {
      return NextResponse.json(
        { error: '유효하지 않은 플랜입니다.' },
        { status: 400 }
      );
    }

    // Validate billing period
    if (!['monthly', 'yearly'].includes(billingPeriod)) {
      return NextResponse.json(
        { error: '유효하지 않은 결제 주기입니다.' },
        { status: 400 }
      );
    }

    const subscription = SUBSCRIPTIONS[tier as SubscriptionTier];
    if (!subscription) {
      return NextResponse.json(
        { error: '유효하지 않은 구독 티어입니다.' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // Check if Stripe is configured
    const priceId = getStripePriceId(
      tier as 'starter' | 'pro' | 'enterprise',
      billingPeriod as 'monthly' | 'yearly'
    );

    // If Stripe is not configured, use mock checkout for development
    if (!process.env.STRIPE_SECRET_KEY || !priceId) {
      console.log('Stripe not configured, using mock checkout');

      // Create mock payment record
      const mockPaymentId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: mockPaymentId,
          amount: billingPeriod === 'yearly'
            ? subscription.price.yearly
            : subscription.price.monthly,
          currency: 'KRW',
          status: 'SUCCEEDED',
          subscriptionTier: tier.toUpperCase() as any,
          billingPeriod: billingPeriod.toUpperCase() as any,
        },
      });

      // Update user subscription
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscription: tier.toUpperCase() as any,
          subscriptionEnd: new Date(
            Date.now() + (billingPeriod === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000
          ),
        },
      });

      return NextResponse.json({
        sessionId: mockPaymentId,
        url: `/payment/success?session_id=${mockPaymentId}&mock=true`,
        mock: true,
      });
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: user.id,
        tier,
        billingPeriod,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
          billingPeriod,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: 'ko',
    });

    // Log analytics
    await prisma.userAnalytics.create({
      data: {
        userId: user.id,
        eventType: 'checkout_started',
        eventData: {
          tier,
          billingPeriod,
          sessionId: checkoutSession.id,
        },
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: '결제 세션 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
