import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const contentDir = path.join(process.cwd(), "prisma", "content");

// Problem ids are positions in problems.json (1-based), so only ever append to it:
// reordering would reassign ids and scramble users' solves and solutions.
const problems: {
  latex: string;
  answerKey: string;
  difficulty: number;
  tags: string[];
}[] = JSON.parse(readFileSync(path.join(contentDir, "problems.json"), "utf8"));

const wikiPages = [
  { slug: "u-substitution", tag: "u-Substitution" },
  { slug: "integration-by-parts", tag: "Integration by Parts" },
  { slug: "trigonometric-substitution", tag: "Trigonometric Substitution" },
  { slug: "partial-fractions", tag: "Partial Fractions" },
  { slug: "trigonometric-identities", tag: "Trigonometric Identities" },
  { slug: "symmetry", tag: "Symmetry" },
  { slug: "feynmans-rule", tag: "Feynman's Rule" },
];

async function main() {
  const tagIds = new Map<string, number>();
  for (const { tag } of wikiPages) {
    const { id } = await prisma.tag.upsert({
      where: { name: tag },
      update: {},
      create: { name: tag },
    });
    tagIds.set(tag, id);
  }

  for (const [index, problem] of problems.entries()) {
    const id = index + 1;
    const data = {
      latex: problem.latex,
      answerKey: problem.answerKey,
      difficulty: problem.difficulty,
    };
    await prisma.problem.upsert({ where: { id }, update: data, create: { id, ...data } });
    await prisma.problemTag.deleteMany({ where: { problemId: id } });
    await prisma.problemTag.createMany({
      data: problem.tags.map((tag) => ({ problemId: id, tagId: tagIds.get(tag)! })),
    });
  }

  for (const { slug, tag } of wikiPages) {
    // Each file starts with "# Title"; the rest is the page body.
    const file = readFileSync(path.join(contentDir, "wiki", `${slug}.md`), "utf8");
    const [heading, ...rest] = file.split("\n");
    const data = {
      title: heading.replace(/^# /, "").trim(),
      body: rest.join("\n").trim(),
      relatedTagId: tagIds.get(tag),
    };
    await prisma.wikiPage.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }

  // Editorial solutions, one file per problem id, posted by a site account.
  const editor = await prisma.user.upsert({
    where: { email: "editorial@integralsense.dev" },
    update: {},
    create: { email: "editorial@integralsense.dev", name: "IntegralSense" },
  });
  for (const file of readdirSync(path.join(contentDir, "solutions"))) {
    const problemId = parseInt(file);
    const body = readFileSync(path.join(contentDir, "solutions", file), "utf8").trim();
    const existing = await prisma.solution.findFirst({ where: { problemId, userId: editor.id } });
    if (existing) {
      await prisma.solution.update({ where: { id: existing.id }, data: { body } });
    } else {
      await prisma.solution.create({ data: { problemId, userId: editor.id, body } });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
