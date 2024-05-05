import { DrizzleAdapter } from "@auth/drizzle-adapter";
;
import { db } from "@saas/db";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [GitHub ({ clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET })],
  callbacks: {
    async session({ session, user, token }) {
      return session;
    },
  },
});
