import Stripe from 'stripe';

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Stripe price IDs for each subscription tier
// These should be created in your Stripe dashboard
export const STRIPE_PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_STARTER_YEARLY || '',
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  },
  enterprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '',
  },
};

// Subscription tier mapping
export const TIER_TO_STRIPE_PRODUCT: Record<string, string> = {
  starter: process.env.STRIPE_PRODUCT_STARTER || '',
  pro: process.env.STRIPE_PRODUCT_PRO || '',
  enterprise: process.env.STRIPE_PRODUCT_ENTERPRISE || '',
};

// Helper function to get price ID
export function getStripePriceId(
  tier: 'starter' | 'pro' | 'enterprise',
  billingPeriod: 'monthly' | 'yearly'
): string {
  return STRIPE_PRICE_IDS[tier]?.[billingPeriod] || '';
}

// Helper function to convert tier name to DB enum value
export function tierToDbEnum(tier: string): 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE' {
  const map: Record<string, 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE'> = {
    free: 'FREE',
    starter: 'STARTER',
    pro: 'PRO',
    enterprise: 'ENTERPRISE',
  };
  return map[tier.toLowerCase()] || 'FREE';
}

// Format amount for display
export function formatStripeAmount(amount: number, currency: string = 'krw'): string {
  if (currency.toLowerCase() === 'krw') {
    return `${amount.toLocaleString()}원`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}
