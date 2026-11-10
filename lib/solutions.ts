import { prisma } from "@/lib/prisma";

export type SolutionView = {
    id: number;
    body: string;
    author: string;
    authorId: string;
    createdAt: string;
    votes: number;
    voted: boolean;
    // Posted by the viewer, who may therefore delete it.
    mine: boolean;
};

// A user's public profile: what they have solved and the solutions they have posted.
export type ProfileView = {
    name: string | null;
    solves: { problemId: number; solvedAt: string }[];
    solutions: { id: number; problemId: number; createdAt: string; votes: number }[];
};

// Solutions for a problem, most upvoted first; `voted` and `mine` are relative to userId.
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
        authorId: s.userId,
        createdAt: s.createdAt.toISOString(),
        votes: s._count.votes,
        voted: voted.has(s.id),
        mine: s.userId === userId,
    }));
}

export async function getProfile(userId: string): Promise<ProfileView | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            solves: { select: { problemId: true, solvedAt: true }, orderBy: { solvedAt: "desc" } },
            solutions: {
                select: { id: true, problemId: true, createdAt: true, _count: { select: { votes: true } } },
                orderBy: { createdAt: "desc" },
            },
        },
    });
    if (!user) return null;
    return {
        name: user.name,
        solves: user.solves.map((s) => ({ problemId: s.problemId, solvedAt: s.solvedAt.toISOString() })),
        solutions: user.solutions.map((s) => ({
            id: s.id,
            problemId: s.problemId,
            createdAt: s.createdAt.toISOString(),
            votes: s._count.votes,
        })),
    };
}
