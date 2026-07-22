import { prisma } from "@/lib/prisma";

async function main() {
  const parts = await prisma.tag.upsert({
    where: { name: "Integration by Parts" },
    update: {},
    create: { name: "Integration by Parts" },
  });

  const trigSub = await prisma.tag.upsert({
    where: { name: "Trigonometric Substitution" },
    update: {},
    create: { name: "Trigonometric Substitution" },
  });

  const uSub = await prisma.tag.upsert({
    where: { name: "u-Substitution" },
    update: {},
    create: { name: "u-Substitution" },
  });

  const feynmansRule = await prisma.tag.upsert({
    where: { name: "Feynman's Rule" },
    update: {},
    create: { name: "Feynman's Rule" },
  });

  const partialFractions = await prisma.tag.upsert({
    where: { name: "Partial Fractions" },
    update: {},
    create: { name: "Partial Fractions" },
  });

  const problems: {
    latex: string;
    answerKey: string;
    difficulty: number;
    tagIds?: number[];
  }[] = [
    {
      latex: "\\int_0^1 x^2 \\, dx",
      answerKey: "1/3",
      difficulty: 1,
    },
    {
      latex: "\\int_0^1 x \\, dx",
      answerKey: "1/2",
      difficulty: 1,
    },
    {
      latex: "\\int_0^3 2x \\, dx",
      answerKey: "9",
      difficulty: 1,
    },
    {
      latex: "\\int_1^2 x^3 \\, dx",
      answerKey: "15/4",
      difficulty: 1,
    },
    {
      latex: "\\int_0^1 (3x^2 + 1) \\, dx",
      answerKey: "2",
      difficulty: 1,
    },
    {
      latex: "\\int_0^2 (x + 1) \\, dx",
      answerKey: "4",
      difficulty: 1,
    },
    {
      latex: "\\int_0^1 \\sqrt{x} \\, dx",
      answerKey: "2/3",
      difficulty: 2,
    },
    {
      latex: "\\int_1^4 \\frac{1}{\\sqrt{x}} \\, dx",
      answerKey: "2",
      difficulty: 2,
    },
    {
      latex: "\\int_0^{\\pi} \\sin x \\, dx",
      answerKey: "2",
      difficulty: 2,
    },
    {
      latex: "\\int_0^{\\pi/2} \\cos x \\, dx",
      answerKey: "1",
      difficulty: 2,
    },
    {
      latex: "\\int_0^{\\pi} \\cos x \\, dx",
      answerKey: "0",
      difficulty: 2,
    },
    {
      latex: "\\int_0^{\\pi/4} \\sec^2 x \\, dx",
      answerKey: "1",
      difficulty: 2,
    },
    {
      latex: "\\int_1^{e} \\frac{1}{x} \\, dx",
      answerKey: "1",
      difficulty: 2,
    },
    {
      latex: "\\int_0^1 e^x \\, dx",
      answerKey: "e-1",
      difficulty: 2,
    },
    {
      latex: "\\int_0^1 (2x + 3) \\, dx",
      answerKey: "4",
      difficulty: 1,
    },
    {
      latex: "\\int_{-1}^1 x^2 \\, dx",
      answerKey: "2/3",
      difficulty: 2,
    },
    {
      latex: "\\int_{-1}^1 x \\, dx",
      answerKey: "0",
      difficulty: 1,
    },
    {
      latex: "\\int_0^2 x^3 \\, dx",
      answerKey: "4",
      difficulty: 1,
    },
    {
      latex: "\\int_1^2 (4x^3 - 1) \\, dx",
      answerKey: "14",
      difficulty: 2,
    },
    {
      latex: "\\int_0^1 (x^2 + 2x) \\, dx",
      answerKey: "4/3",
      difficulty: 1,
    },
    {
      latex: "\\int_0^{\\pi/6} \\cos(3x) \\, dx",
      answerKey: "1/3",
      difficulty: 3,
      tagIds: [uSub.id],
    },
  ];

  for (const problem of problems) {
    await prisma.problem.create({
      data: {
        latex: problem.latex,
        answerKey: problem.answerKey,
        difficulty: problem.difficulty,
        tags: problem.tagIds
          ? {
              create: problem.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
    });
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
