"use client";

import { useSession } from "next-auth/react";

export type UserState =
    | { status: "loading" | "signed-out" }
    | { status: "signed-in"; id: string; name: string | null };

export function useUser(): UserState {
    const { data, status } = useSession();
    if (status === "loading") return { status: "loading" };
    if (!data?.user) return { status: "signed-out" };
    return { status: "signed-in", id: data.user.id, name: data.user.name ?? null };
}
