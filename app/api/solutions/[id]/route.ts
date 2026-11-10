import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parseId } from "@/lib/ids";
import { logEvent } from "@/lib/log";

// Deletes a solution; only its author may.
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId((await params).id);
    const solution = id && await prisma.solution.findUnique({ where: { id } });
    if (!solution) {
        return NextResponse.json({ error: "Solution not found" }, { status: 404 });
    }
    if (solution.userId !== session.user.id) {
        return NextResponse.json({ error: "You can only delete your own solutions" }, { status: 403 });
    }

    // Votes reference the solution, so they have to go first.
    await prisma.$transaction([
        prisma.solutionVote.deleteMany({ where: { solutionId: solution.id } }),
        prisma.solution.delete({ where: { id: solution.id } }),
    ]);
    logEvent("solution_deleted", { userId: session.user.id, problemId: solution.problemId, solutionId: solution.id });
    return NextResponse.json({ deleted: true });
}
