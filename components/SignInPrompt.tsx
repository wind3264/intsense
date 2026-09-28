"use client";

import { signIn } from "next-auth/react";

export function SignInPrompt({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-sans text-sm text-muted">
      <span>{children}</span>
      <button className="btn text-foreground" onClick={() => signIn("google")}>
        Sign in with Google
      </button>
    </div>
  );
}
