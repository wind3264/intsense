import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One technique page, with the ids of the practice problems tagged with its technique.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await prisma.wikiPage.findUnique({
        where: { slug },
        include: { relatedTag: { select: { name: true, problems: { select: { problemId: true } } } } },
    });
    if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }
    const { relatedTag, ...rest } = page;
    return NextResponse.json({
        ...rest,
        tag: relatedTag?.name ?? null,
        problemIds: relatedTag?.problems.map((p) => p.problemId) ?? [],
    });
}
