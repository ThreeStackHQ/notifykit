import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getStripe, PLANS } from '@/lib/stripe';
import { db, workspaces, eq } from '@notifykit/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const tier = (body as { tier?: string }).tier ?? 'starter';

  const plan = PLANS[tier as keyof typeof PLANS];
  if (!plan || !plan.priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, session.user.id))
    .limit(1);

  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const stripe = getStripe();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    customer_email: session.user.email ?? undefined,
    subscription_data: {
      metadata: {
        workspaceId: workspace.id,
        userId: session.user.id,
      },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
