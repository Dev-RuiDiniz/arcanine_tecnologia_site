import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { verifyAdminPassword } from "@/lib/auth/password";

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

        const configuredEmail = process.env.AUTH_ADMIN_EMAIL;
        const currentHash = process.env.AUTH_ADMIN_PASSWORD_HASH_CURRENT;
        const nextHash = process.env.AUTH_ADMIN_PASSWORD_HASH_NEXT;
        if (!configuredEmail) {
          return null;
        }

        if (parsed.data.email.toLowerCase() !== configuredEmail.toLowerCase()) {
          return null;
        }

        const isPasswordValid = await verifyAdminPassword(
          parsed.data.password,
          currentHash,
          nextHash,
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: "admin",
          email: configuredEmail,
          name: "Arcanine Admin",
          role: "ADMIN",
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
        session.user.role = (token.role as "ADMIN") ?? "ADMIN";
      }
      return session;
    },
  },
};
