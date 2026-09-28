import { prisma } from "@/lib/prisma";

export type SolutionView = {
    id: number;
    body: string;
    author: string;
    createdAt: string;
    votes: number;
    voted: boolean;
};

// Solutions for a problem, most upvoted first; `voted` is relative to userId.
export async function listSolutions(problemId: number, userId?: string): Promise<SolutionView[]> {
    const [solutions, votes] = await Promise.all([
        prisma.solution.findMany({
            where: { problemId },
            include: { user: { select: { name: true } }, _count: { select: { votes: true } } },
            orderBy: [{ votes: { _count: "desc" } }, { createdAt: "asc" }],
        }),
        userId
            ? prisma.solutionVote.findMany({ where: { userId, solution: { problemId } }, select: { solutionId: true } })
            : [],
    ]);
    const voted = new Set(votes.map((v) => v.solutionId));
    return solutions.map((s) => ({
        id: s.id,
        body: s.body,
        author: s.user.name ?? "Anonymous",
        createdAt: s.createdAt.toISOString(),
        votes: s._count.votes,
        voted: voted.has(s.id),
    }));
}
