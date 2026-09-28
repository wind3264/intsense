"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useUser } from "@/lib/use-user";

const links = [
  { href: "/", label: "Problems", active: (p: string) => p === "/" || p.startsWith("/problems") },
  { href: "/wiki", label: "Wiki", active: (p: string) => p.startsWith("/wiki") },
  { href: "/profile", label: "Profile", active: (p: string) => p.startsWith("/profile") },
];

export function Nav() {
  const pathname = usePathname();
  const user = useUser();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-5 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          IntegralSense
        </Link>
        <nav className="flex items-baseline gap-5 font-sans text-sm">
          {links.map(({ href, label, active }) => (
            <Link
              key={href}
              href={href}
              className={active(pathname) ? "text-foreground" : "text-muted transition-colors hover:text-foreground"}
            >
              {label}
            </Link>
          ))}
          {user.status === "signed-out" && (
            <button className="text-muted transition-colors hover:text-foreground" onClick={() => signIn("google")}>
              Sign in
            </button>
          )}
          {user.status === "signed-in" && (
            <button className="text-muted transition-colors hover:text-foreground" onClick={() => signOut()}>
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
