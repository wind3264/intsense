"use client";

import { SessionProvider } from "next-auth/react";
import { STATIC_EXPORT } from "@/lib/mode";

export function Providers({ children }: { children: React.ReactNode }) {
  // The static build has no /api/auth to talk to.
  return STATIC_EXPORT ? children : <SessionProvider>{children}</SessionProvider>;
}
