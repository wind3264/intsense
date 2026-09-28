"use client";

import { useEffect, useState } from "react";
import { canTrack, useUser } from "@/lib/use-user";
import { fetchSolves, type Solve } from "@/lib/user-data";

// The current user's solves, or null until known (or when signed out).
export function useSolves(): Solve[] | null {
    const user = useUser();
    const tracking = canTrack(user);
    const [solves, setSolves] = useState<Solve[] | null>(null);

    useEffect(() => {
        if (!tracking) return;
        let cancelled = false;
        fetchSolves()
            .then((s) => !cancelled && setSolves(s))
            .catch(() => !cancelled && setSolves([]));
        return () => {
            cancelled = true;
        };
    }, [tracking]);

    return tracking ? solves : null;
}
