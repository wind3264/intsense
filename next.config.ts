import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a server-less copy of the site for GitHub Pages (`npm run build:pages`).
// Pages read the database at build time; per-user features fall back to the browser
// (see lib/mode.ts). BASE_PATH is the repo subpath Pages serves from, e.g. /intsense.
const staticExport: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH || undefined,
  trailingSlash: true,
  // Only .tsx files are routes, which leaves out the API route handlers (route.ts):
  // a static host can't run them.
  pageExtensions: ["tsx"],
  env: { NEXT_PUBLIC_STATIC_EXPORT: "1" },
};

const nextConfig: NextConfig = process.env.STATIC_EXPORT === "1" ? staticExport : {};

export default nextConfig;
