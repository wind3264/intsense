import { prisma } from "@/lib/prisma";

// Read-only queries used by pages at build/render time.

export type ProblemSummary = {
    id: number;
    latex: string;
    difficulty: number;
    tags: string[];
};

const summarySelect = {
    id: true,
    latex: true,
    difficulty: true,
    tags: { select: { tag: { select: { name: true } } }, orderBy: { tag: { name: "asc" } } },
} as const;

function toSummary(p: { id: number; latex: string; difficulty: number; tags: { tag: { name: string } }[] }): ProblemSummary {
    return { id: p.id, latex: p.latex, difficulty: p.difficulty, tags: p.tags.map((t) => t.tag.name) };
}

export async function getProblems(): Promise<ProblemSummary[]> {
    const problems = await prisma.problem.findMany({ select: summarySelect, orderBy: { id: "asc" } });
    return problems.map(toSummary);
}

export async function getProblem(id: number) {
    const problem = await prisma.problem.findUnique({
        where: { id },
        select: {
            ...summarySelect,
            answerKey: true,
            tags: { select: { tag: { select: { name: true, wikiPages: { select: { slug: true } } } } } },
        },
    });
    if (!problem) return null;
    return {
        ...toSummary(problem),
        answerKey: problem.answerKey,
        techniques: problem.tags.map((t) => ({ name: t.tag.name, slug: t.tag.wikiPages[0]?.slug ?? null })),
    };
}

export async function getProblemIds(): Promise<number[]> {
    const problems = await prisma.problem.findMany({ select: { id: true }, orderBy: { id: "asc" } });
    return problems.map((p) => p.id);
}

export async function getTagNames(): Promise<string[]> {
    const tags = await prisma.tag.findMany({ select: { name: true }, orderBy: { name: "asc" } });
    return tags.map((t) => t.name);
}

export async function getWikiPages() {
    const pages = await prisma.wikiPage.findMany({
        select: { slug: true, title: true, relatedTag: { select: { _count: { select: { problems: true } } } } },
        orderBy: { title: "asc" },
    });
    return pages.map((p) => ({ slug: p.slug, title: p.title, problemCount: p.relatedTag?._count.problems ?? 0 }));
}

export async function getWikiPage(slug: string) {
    const page = await prisma.wikiPage.findUnique({
        where: { slug },
        select: {
            slug: true,
            title: true,
            body: true,
            relatedTag: {
                select: { problems: { select: { problem: { select: summarySelect } }, orderBy: { problemId: "asc" } } },
            },
        },
    });
    if (!page) return null;
    return {
        slug: page.slug,
        title: page.title,
        body: page.body,
        problems: (page.relatedTag?.problems ?? []).map((p) => toSummary(p.problem)),
    };
}
