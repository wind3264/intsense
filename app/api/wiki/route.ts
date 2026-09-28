import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const pages = await prisma.wikiPage.findMany({
        select: { slug: true, title: true },
        orderBy: { id: "asc" },
    });
    return NextResponse.json(pages);
}
