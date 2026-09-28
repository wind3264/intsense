import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// The logged-in user's solve history, newest first.
export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const solves = await prisma.solve.findMany({
        where: { userId: session.user.id },
        select: { problemId: true, solvedAt: true },
        orderBy: { solvedAt: "desc" },
    });
    return NextResponse.json(solves);
}
