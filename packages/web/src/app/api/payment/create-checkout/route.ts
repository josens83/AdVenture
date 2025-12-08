import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionTier, SUBSCRIPTIONS } from '@adventure/shared';

// This would use Stripe in production
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { tier, billingPeriod, userId } = await request.json();

    if (!tier || !billingPeriod || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const subscription = SUBSCRIPTIONS[tier as SubscriptionTier];
    if (!subscription) {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    const price =
      billingPeriod === 'yearly'
        ? subscription.price.yearly
        : subscription.price.monthly;

    if (price === 0) {
      return NextResponse.json(
        { error: 'Cannot checkout free tier' },
        { status: 400 }
      );
    }

    // In production, create Stripe checkout session
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'krw',
            product_data: {
              name: `마케터 생존기 ${tier} 플랜`,
              description: subscription.features
                .filter((f) => f.included)
                .map((f) => f.nameKo)
                .join(', '),
            },
            unit_amount: price,
            recurring: {
              interval: billingPeriod === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        userId,
        tier,
        billingPeriod,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
    */

    // Mock response for development
    return NextResponse.json({
      sessionId: 'mock_session_' + Date.now(),
      url: '/payment/success?mock=true',
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
