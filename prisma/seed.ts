import { prisma } from "@/lib/prisma";

async function main() {
    const parts = await prisma.tag.upsert({
        where: { name: "Integration by Parts" },
        update: {},
        create: {name: "Integration by Parts"}
    })

    const trigSub = await prisma.tag.upsert({
        where: { name: "Trigonometric Substitution" },
        update: {},
        create: {name: "Trigonometric Substitution"}
    })

    const uSub = await prisma.tag.upsert({
        where: { name: "u-Substitution" },
        update: {},
        create: {name: "u-Substitution"}
    })

    const feynmansRule = await prisma.tag.upsert({
        where: { name: "Feynman's Rule" },
        update: {},
        create: {name: "Feynman's Rule"}
    })

    const partialFractions = await prisma.tag.upsert({
        where: { name: "Partial Fractions" },
        update: {},
        create: {name: "Partial Fractions"}
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })