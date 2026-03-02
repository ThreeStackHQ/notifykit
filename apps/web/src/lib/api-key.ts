import bcrypt from 'bcryptjs';
import { db, apiKeys, workspaces, subscriptions, eq, and } from '@notifykit/db';

export interface ApiKeyVerifyResult {
  workspaceId: string;
  userId: string;
  tier: string;
  notificationsSentThisMonth: number;
  keyId: string;
  rateLimitPerHour: number;
}

export async function verifyApiKey(
  rawKey: string
): Promise<ApiKeyVerifyResult | null> {
  const dotIndex = rawKey.indexOf('.');
  if (dotIndex === -1) return null;

  const prefix = rawKey.substring(0, dotIndex);
  const secret = rawKey.substring(dotIndex + 1);

  if (!prefix || !secret) return null;

  // Find key by prefix
  const [keyRow] = await (db as unknown as { select: Function })
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.keyPrefix, prefix), eq(apiKeys.isActive, true)))
    .limit(1);

  if (!keyRow) return null;

  // Verify hash
  const valid = await bcrypt.compare(secret, keyRow.keyHash);
  if (!valid) return null;

  // Get workspace
  const [workspace] = await (db as unknown as { select: Function })
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, keyRow.workspaceId))
    .limit(1);

  if (!workspace) return null;

  // Get subscription
  const [sub] = await (db as unknown as { select: Function })
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, workspace.userId))
    .limit(1);

  // Update lastUsedAt asynchronously
  (db as unknown as { update: Function })
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, keyRow.id))
    .catch(() => {});

  return {
    workspaceId: keyRow.workspaceId,
    userId: workspace.userId,
    tier: sub?.tier ?? 'free',
    notificationsSentThisMonth: sub?.notificationsSentThisMonth ?? 0,
    keyId: keyRow.id,
    rateLimitPerHour: keyRow.rateLimitPerHour ?? 1000,
  };
}
