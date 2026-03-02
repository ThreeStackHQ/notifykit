import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db, users, workspaces, eq } from '@notifykit/db';

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check if email exists
    const existing = await (db as unknown as { select: Function })
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const [user] = await (db as unknown as { insert: Function })
      .insert(users)
      .values({ name, email, passwordHash })
      .returning();

    // Create default workspace
    await (db as unknown as { insert: Function })
      .insert(workspaces)
      .values({
        userId: user.id,
        name: `${name}'s Workspace`,
      });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
