"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/use-user";
import { fetchSolves, type Solve } from "@/lib/user-data";

// The current user's solves, or null until known (or when signed out).
export function useSolves(): Solve[] | null {
    const user = useUser();
    const signedIn = user.status === "signed-in";
    const [solves, setSolves] = useState<Solve[] | null>(null);

    useEffect(() => {
        if (!signedIn) return;
        let cancelled = false;
        fetchSolves()
            .then((s) => !cancelled && setSolves(s))
            .catch(() => !cancelled && setSolves([]));
        return () => {
            cancelled = true;
        };
    }, [signedIn]);

    return signedIn ? solves : null;
}
