import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionConfirmEmail } from '@/lib/email';

// Define SubscriptionTier type locally to avoid dependency on @prisma/client
type SubscriptionTier = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Map Stripe price IDs to subscription tiers
const priceToTier: Record<string, SubscriptionTier> = {
  [process.env.STRIPE_PRICE_STARTER_MONTHLY || '']: 'STARTER',
  [process.env.STRIPE_PRICE_STARTER_YEARLY || '']: 'STARTER',
  [process.env.STRIPE_PRICE_PRO_MONTHLY || '']: 'PRO',
  [process.env.STRIPE_PRICE_PRO_YEARLY || '']: 'PRO',
  [process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '']: 'ENTERPRISE',
  [process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '']: 'ENTERPRISE',
};

const tierNames: Record<string, string> = {
  STARTER: '스타터',
  PRO: '프로',
  ENTERPRISE: '엔터프라이즈',
};

function formatAmount(amount: number, currency: string = 'KRW'): string {
  if (currency.toUpperCase() === 'KRW') {
    return `${amount.toLocaleString()}원`;
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  // Skip signature verification if webhook secret is not set (development)
  let event: Stripe.Event;

  if (!endpointSecret || !sig) {
    console.log('Webhook secret not configured, skipping signature verification');
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          const userId = session.metadata?.userId;
          if (!userId) {
            console.error('No userId in session metadata');
            break;
          }

          const priceId = subscription.items.data[0].price.id;
          const tier = priceToTier[priceId] || 'STARTER';

          // Get user for email
          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          // Update user subscription
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: tier,
              subscriptionEnd: new Date(subscription.current_period_end * 1000),
              stripeCustomerId: session.customer as string,
            },
          });

          // Log payment
          await prisma.payment.create({
            data: {
              userId,
              stripePaymentId: session.payment_intent as string || session.id,
              amount: session.amount_total || 0,
              currency: session.currency?.toUpperCase() || 'KRW',
              status: 'SUCCEEDED',
              subscriptionTier: tier,
              billingPeriod:
                subscription.items.data[0].price.recurring?.interval === 'year'
                  ? 'YEARLY'
                  : 'MONTHLY',
            },
          });

          // Log analytics
          await prisma.userAnalytics.create({
            data: {
              userId,
              eventType: 'subscription_purchased',
              eventData: {
                tier,
                amount: session.amount_total,
              },
            },
          });

          // Update daily stats
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          await prisma.dailyStats.upsert({
            where: { date: today },
            update: {
              revenue: { increment: BigInt(session.amount_total || 0) },
              newSubscribers: { increment: 1 },
            },
            create: {
              date: today,
              revenue: BigInt(session.amount_total || 0),
              newSubscribers: 1,
            },
          });

          // Send confirmation email
          if (user?.email) {
            await sendSubscriptionConfirmEmail(
              user.email,
              tierNames[tier] || tier,
              formatAmount(session.amount_total || 0, session.currency || 'KRW'),
              user.name || undefined
            );
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          const priceId = subscription.items.data[0].price.id;
          const tier = priceToTier[priceId] || 'FREE';

          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscription: tier,
              subscriptionEnd: new Date(subscription.current_period_end * 1000),
            },
          });

          // Log subscription update
          await prisma.userAnalytics.create({
            data: {
              userId: user.id,
              eventType: 'subscription_updated',
              eventData: {
                tier,
                status: subscription.status,
              },
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscription: 'FREE',
              subscriptionEnd: null,
            },
          });

          await prisma.userAnalytics.create({
            data: {
              userId: user.id,
              eventType: 'subscription_cancelled',
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.userAnalytics.create({
            data: {
              userId: user.id,
              eventType: 'payment_failed',
              eventData: {
                invoiceId: invoice.id,
                amount: invoice.amount_due,
              },
            },
          });

          // TODO: Send payment failed email notification
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user && invoice.subscription) {
          // Record recurring payment
          await prisma.payment.create({
            data: {
              userId: user.id,
              stripePaymentId: invoice.payment_intent as string || invoice.id,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid,
              currency: invoice.currency.toUpperCase(),
              status: 'SUCCEEDED',
              subscriptionTier: user.subscription,
              billingPeriod: invoice.lines.data[0]?.price?.recurring?.interval === 'year'
                ? 'YEARLY'
                : 'MONTHLY',
            },
          });

          // Update daily stats
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          await prisma.dailyStats.upsert({
            where: { date: today },
            update: {
              revenue: { increment: BigInt(invoice.amount_paid) },
            },
            create: {
              date: today,
              revenue: BigInt(invoice.amount_paid),
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
