import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { auth } from '@/lib/auth';
import { db, apiKeys, workspaces, eq } from '@notifykit/db';

export const dynamic = 'force-dynamic';

async function getWorkspaceForUser(userId: string) {
  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.userId, userId))
    .limit(1);
  return workspace;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const keys = await (db as unknown as { select: Function })
    .select({
      id: apiKeys.id,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      rateLimitPerHour: apiKeys.rateLimitPerHour,
      isActive: apiKeys.isActive,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(eq(apiKeys.workspaceId, workspace.id))
    .orderBy(apiKeys.createdAt);

  return NextResponse.json(
    keys.map((k: typeof keys[0]) => ({ ...k, keyDisplay: k.keyPrefix + '...' }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const workspace = await getWorkspaceForUser(session.user.id);
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const name = (body as { name?: string }).name ?? 'API Key';

  const prefix = nanoid(8);
  const secret = randomBytes(32).toString('hex');
  const fullKey = `${prefix}.${secret}`;
  const keyHash = await bcrypt.hash(secret, 12);

  await (db as unknown as { insert: Function })
    .insert(apiKeys)
    .values({
      workspaceId: workspace.id,
      name,
      keyPrefix: prefix,
      keyHash,
    });

  return NextResponse.json({ key: fullKey, name, prefix }, { status: 201 });
}
