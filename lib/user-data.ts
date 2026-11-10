import type { ProfileView, SolutionView } from "@/lib/solutions";

// Browser-side access to the API routes.

export type Solve = { problemId: number; solvedAt: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);
    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: null }));
        throw new Error(error ?? `Request failed (${res.status})`);
    }
    return res.json();
}

export async function fetchSolves(): Promise<Solve[]> {
    return request("/api/me/solves");
}

export async function setSolved(problemId: number, solved: boolean): Promise<void> {
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

export async function deleteSolution(solutionId: number): Promise<void> {
    await request(`/api/solutions/${solutionId}`, { method: "DELETE" });
}

export async function setVote(solutionId: number, voted: boolean): Promise<{ votes: number; voted: boolean }> {
    return request(`/api/solutions/${solutionId}/vote`, { method: voted ? "POST" : "DELETE" });
}

export async function fetchProfile(userId: string): Promise<ProfileView> {
    return request(`/api/users/${encodeURIComponent(userId)}`);
}
