import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe, getPlanFromPriceId } from '@/lib/stripe';
import { db, subscriptions, workspaces, eq } from '@notifykit/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Get workspaceId from subscription metadata
        let workspaceId: string | null = null;
        let userId: string | null = null;

        if (session.subscription) {
          const stripe = getStripe();
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          workspaceId = subscription.metadata?.workspaceId ?? null;
          userId = subscription.metadata?.userId ?? null;
        }

        if (!workspaceId || !userId) {
          break;
        }

        // Get workspace to confirm it exists
        const [workspace] = await (db as unknown as { select: Function })
          .select()
          .from(workspaces)
          .where(eq(workspaces.id, workspaceId))
          .limit(1);

        if (!workspace) break;

        const stripe = getStripe();
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const priceId = sub.items.data[0]?.price.id ?? '';
        const tier = getPlanFromPriceId(priceId);
        // current_period_end is on the Subscription object
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;

        // Upsert subscription
        const existing = await (db as unknown as { select: Function })
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, userId))
          .limit(1);

        if (existing.length > 0) {
          await (db as unknown as { update: Function })
            .update(subscriptions)
            .set({
              tier,
              status: sub.status,
              stripeSubscriptionId: sub.id,
              stripeCustomerId: session.customer as string,
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            })
            .where(eq(subscriptions.userId, userId));
        } else {
          await (db as unknown as { insert: Function })
            .insert(subscriptions)
            .values({
              userId,
              tier,
              status: sub.status,
              stripeSubscriptionId: sub.id,
              stripeCustomerId: session.customer as string,
              currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
            });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price.id ?? '';
        const tier = getPlanFromPriceId(priceId);
        const currentPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;

        await (db as unknown as { update: Function })
          .update(subscriptions)
          .set({
            tier,
            status: sub.status,
            currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;

        await (db as unknown as { update: Function })
          .update(subscriptions)
          .set({ tier: 'free', status: 'canceled' })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
