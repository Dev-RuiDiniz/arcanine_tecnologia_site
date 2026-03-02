import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { verifyPasswordAgainstHashes } from "@/lib/auth/password";
import type { AppRole } from "@/lib/auth/rbac";
import { getAuthUsersFromEnv } from "@/lib/auth/users";
import { resolveAdminUserPermissionOverride } from "@/services/settings-admin.service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const authUsers = getAuthUsersFromEnv();
        const authUser = authUsers.find(
          (candidateUser) => candidateUser.email.toLowerCase() === parsed.data.email.toLowerCase(),
        );
        if (!authUser) {
          return null;
        }

        let resolvedRole: AppRole = authUser.role;
        try {
          const override = await resolveAdminUserPermissionOverride(authUser.email);
          if (override && !override.active) {
            return null;
          }
          if (override) {
            resolvedRole = override.role;
          }
        } catch {
          // Keep env role when permission overrides are unavailable.
        }

        const isPasswordValid = await verifyPasswordAgainstHashes(
          parsed.data.password,
          authUser.passwordHashCurrent,
          authUser.passwordHashNext,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name,
          role: resolvedRole,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.role = (token.role as AppRole) ?? "VIEWER";
      }
      return session;
    },
  },
};
