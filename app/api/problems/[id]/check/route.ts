import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth"; // TODO: implement auth

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = await params; // id of the problem to be solved
    const { answer } = await request.json(); // user's answer
    const problem = await prisma.problem.findUnique({
        where: { id: parseInt(id) },
    });
    if (!problem) {
        return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }
    const isCorrect = problem.answerKey === answer;
    if (isCorrect) {
        await prisma.solve.upsert({
            where: { userId_problemId: { userId, problemId: problem.id } },
            create: { userId, problemId: problem.id },
            update: {},
        });
    }
    return NextResponse.json({ isCorrect });
}