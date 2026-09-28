import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// returns list of problems with given difficulty and tags

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const tags = searchParams.get("tags");
    const filteredProblems = await prisma.problem.findMany({
        where: {
            difficulty: difficulty ? { equals: parseInt(difficulty) || 0 } : undefined,
            tags: tags ? { some: { tag: { name: tags } } } : undefined,
        },
        // answers are only handed out one at a time, to logged-in users, by /check
        omit: { answerKey: true },
        include: { tags: { select: { tag: { select: { name: true } } } } },
        orderBy: { id: "asc" },
    });
    return NextResponse.json(filteredProblems);
}
