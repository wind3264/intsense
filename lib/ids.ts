// Parses a numeric route param; null for anything that isn't a positive integer,
// so routes can 404 instead of passing NaN to Prisma.
export function parseId(raw: string): number | null {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}
