import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: '2026-02-25.clover' as any,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    monthlyLimit: 1000,
    priceId: null as string | null,
  },
  starter: {
    name: 'Starter',
    price: 9,
    monthlyLimit: 25000,
    priceId: process.env.STRIPE_PRICE_STARTER ?? null,
  },
  pro: {
    name: 'Pro',
    price: 19,
    monthlyLimit: Infinity,
    priceId: process.env.STRIPE_PRICE_PRO ?? null,
  },
} as const;

export type PlanTier = keyof typeof PLANS;

export function getPlanFromPriceId(priceId: string): PlanTier {
  if (priceId === process.env.STRIPE_PRICE_STARTER) return 'starter';
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  return 'free';
}
