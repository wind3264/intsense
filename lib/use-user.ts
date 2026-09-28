"use client";

import { useSession } from "next-auth/react";
import { STATIC_EXPORT } from "@/lib/mode";

// "local": no accounts exist (static build); progress is stored in the browser.
export type UserState =
    | { status: "loading" | "signed-out" | "local" }
    | { status: "signed-in"; name: string | null };

function useSessionUser(): UserState {
    const { data, status } = useSession();
    if (status === "loading") return { status: "loading" };
    if (!data?.user) return { status: "signed-out" };
    return { status: "signed-in", name: data.user.name ?? null };
}

function useLocalUser(): UserState {
    return { status: "local" };
}

// STATIC_EXPORT is a build-time constant, so each build always calls the same hook.
export const useUser = STATIC_EXPORT ? useLocalUser : useSessionUser;

// Whether the user can reveal answers and record solves.
export function canTrack(user: UserState) {
    return user.status === "signed-in" || user.status === "local";
}
