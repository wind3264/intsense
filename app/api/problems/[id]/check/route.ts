import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parseId } from "@/lib/ids";
import { logEvent } from "@/lib/log";

// Reveals the answer key so the user can check their own work ("unspoil").
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId((await params).id); // id of the problem to unspoil
    const problem = id && await prisma.problem.findUnique({
        where: { id },
    });
    if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    logEvent("reveal", { userId: session.user.id, problemId: problem.id });
    return NextResponse.json({ answerKey: problem.answerKey });
}

// Marks the problem solved on the user's word, no answer verification.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const id = parseId((await params).id); // id of the problem to mark solved
    const problem = id && await prisma.problem.findUnique({
        where: { id },
    });
    if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    await prisma.solve.upsert({
        where: { userId_problemId: { userId, problemId: problem.id } },
        create: { userId, problemId: problem.id },
        update: {},
    });
    logEvent("solve", { userId, problemId: problem.id });
    return NextResponse.json({ solved: true });
}

// Un-marks the problem, e.g. after marking it solved by mistake.
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseId((await params).id);
    if (id) {
        await prisma.solve.deleteMany({ where: { userId: session.user.id, problemId: id } });
    }
    return NextResponse.json({ solved: false });
}
