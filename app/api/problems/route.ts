import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty");
    const tags = searchParams.get("tags");
    const filteredProblems = await prisma.problem.findMany({
        where: {
            difficulty: difficulty ? { equals: parseInt(difficulty) } : undefined,
            tags: tags ? { some: { tag: { name: tags } } } : undefined,
        },
    });
    return NextResponse.json(filteredProblems);
}