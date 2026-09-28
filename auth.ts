import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { logEvent } from "@/lib/log";

declare module "next-auth" {
    interface Session {
        user: { id: string } & DefaultSession["user"];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Google],
    callbacks: {
        // Database sessions only expose name/email/image by default; routes need the id.
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
    },
    events: {
        createUser({ user }) {
            logEvent("signup", { userId: user.id });
        },
    },
});
