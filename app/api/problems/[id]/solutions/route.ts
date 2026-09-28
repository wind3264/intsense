import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parseId } from "@/lib/ids";
import { logEvent } from "@/lib/log";
import { listSolutions } from "@/lib/solutions";

const MAX_BODY_LENGTH = 10_000;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseId((await params).id);
    if (!id) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    const session = await auth();
    return NextResponse.json(await listSolutions(id, session?.user?.id));
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId((await params).id);
    const problem = id && await prisma.problem.findUnique({ where: { id } });
    if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const { body } = await request.json().catch(() => ({}));
    const text = typeof body === "string" ? body.trim() : "";
    if (!text || text.length > MAX_BODY_LENGTH) {
        return NextResponse.json(
            { error: `Solution must be between 1 and ${MAX_BODY_LENGTH} characters` },
            { status: 400 },
        );
    }

    const solution = await prisma.solution.create({
        data: { userId: session.user.id, problemId: problem.id, body: text },
    });
    logEvent("solution_posted", { userId: session.user.id, problemId: problem.id, solutionId: solution.id });
    return NextResponse.json({ id: solution.id }, { status: 201 });
}
