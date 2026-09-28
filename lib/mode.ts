// True in the GitHub Pages build (see next.config.ts): there is no server, so no
// accounts or API routes. Progress is kept in localStorage and content is baked
// into the pages at build time.
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";
