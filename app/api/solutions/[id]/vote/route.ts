import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parseId } from "@/lib/ids";

// POST upvotes a solution, DELETE withdraws the upvote. Both are idempotent.
async function setVote(params: Promise<{ id: string }>, voted: boolean) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const solutionId = parseId((await params).id);
    const solution = solutionId && await prisma.solution.findUnique({ where: { id: solutionId } });
    if (!solution) {
        return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }

    if (voted) {
        await prisma.solutionVote.upsert({
            where: { userId_solutionId: { userId, solutionId: solution.id } },
            create: { userId, solutionId: solution.id },
            update: {},
        });
    } else {
        await prisma.solutionVote.deleteMany({ where: { userId, solutionId: solution.id } });
    }
    const votes = await prisma.solutionVote.count({ where: { solutionId: solution.id } });
    return NextResponse.json({ votes, voted });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    return setVote(params, true);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    return setVote(params, false);
}
