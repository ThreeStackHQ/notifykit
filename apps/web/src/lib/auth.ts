import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db, users, workspaces, eq } from '@notifykit/db';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const [user] = await (db as typeof db & { select: Function })
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        // Get workspace
        const [workspace] = await (db as typeof db & { select: Function })
          .select()
          .from(workspaces)
          .where(eq(workspaces.userId, user.id))
          .limit(1);

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          workspaceId: workspace?.id ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.workspaceId = (user as { workspaceId?: string }).workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session as { workspaceId?: string }).workspaceId = token.workspaceId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
});
