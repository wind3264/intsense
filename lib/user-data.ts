import { STATIC_EXPORT } from "@/lib/mode";
import type { SolutionView } from "@/lib/solutions";

// Browser-side access to per-user data. The server build goes through the API
// routes; the static build has no server, so solves live in localStorage.

export type Solve = { problemId: number; solvedAt: string };

const SOLVES_KEY = "integralsense.solves";

function readLocalSolves(): Record<string, string> {
    try {
        return JSON.parse(localStorage.getItem(SOLVES_KEY) ?? "{}");
    } catch {
        return {};
    }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);
    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        throw new Error(error ?? `Request failed (${res.status})`);
    }
    return res.json();
}

export async function fetchSolves(): Promise<Solve[]> {
    if (STATIC_EXPORT) {
        return Object.entries(readLocalSolves())
            .map(([id, solvedAt]) => ({ problemId: Number(id), solvedAt }))
            .sort((a, b) => b.solvedAt.localeCompare(a.solvedAt));
    }
    return request("/api/me/solves");
}

export async function setSolved(problemId: number, solved: boolean): Promise<void> {
    if (STATIC_EXPORT) {
        const solves = readLocalSolves();
        if (solved) solves[problemId] ??= new Date().toISOString();
        else delete solves[problemId];
        localStorage.setItem(SOLVES_KEY, JSON.stringify(solves));
        return;
    }
    await request(`/api/problems/${problemId}/check`, { method: solved ? "POST" : "DELETE" });
}

export async function fetchAnswer(problemId: number): Promise<string> {
    const { answerKey } = await request<{ answerKey: string }>(`/api/problems/${problemId}/check`);
    return answerKey;
}

export async function fetchSolutions(problemId: number): Promise<SolutionView[]> {
    return request(`/api/problems/${problemId}/solutions`);
}

export async function postSolution(problemId: number, body: string): Promise<void> {
    await request(`/api/problems/${problemId}/solutions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
    });
}

export async function setVote(solutionId: number, voted: boolean): Promise<{ votes: number; voted: boolean }> {
    return request(`/api/solutions/${solutionId}/vote`, { method: voted ? "POST" : "DELETE" });
}
