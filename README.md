# IntegralSense

Practice problems and a technique wiki for integration bees.

Live (static copy): https://wind3264.github.io/intsense/

## Features

- **Problems** - 64 integrals, filterable by difficulty (1-5) and technique, rendered with KaTeX.
- **Trust-based checking** - work the integral on paper, reveal the answer, and mark it solved yourself.
  Revealing and marking solved are independent.
- **Accounts** - Google sign-in via Auth.js; solved problems are remembered and shown on the profile page.
- **Solutions** - users post Markdown + LaTeX write-ups under each problem, with one upvote per user.
  Solutions are collapsed by default since they give the answer away.
- **Wiki** - one page per technique, each linked to its practice problems.

## Stack

Next.js (App Router) + TypeScript, Prisma with SQLite, Auth.js (next-auth v5) with the Prisma adapter, Tailwind CSS, KaTeX, Vitest.

## Two builds

The same code builds two ways:

| | Server build | Static build (GitHub Pages) |
| --- | --- | --- |
| Command | `npm run build` | `STATIC_EXPORT=1 BASE_PATH=/intsense npm run build` |
| Accounts | Google sign-in | none |
| Progress | `Solve` rows in the database | `localStorage` |
| Answers | `GET /api/problems/:id/check` (signed in) | embedded in the page |
| Solutions | read, post, upvote | read-only |

Pages always read problems and wiki content from the database at build time.
Per-user features go through `lib/user-data.ts`, which calls the API routes in the server build and uses the browser in the static build.
The static build drops the API route handlers entirely (see `next.config.ts`), since GitHub Pages cannot run them.

## Running locally

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db
npx prisma db seed       # loads prisma/content (safe to re-run)
npm run dev
```

`.env` needs:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET=...          # npx auth secret
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

Google sign-in only works on origins whose redirect URI (`<origin>/api/auth/callback/google`) is registered in the Google Cloud console.

## Content

Problems, wiki pages and editorial solutions live in `prisma/content/` and are loaded by `prisma/seed.ts`.
Problem ids are positions in `problems.json`, so only ever append to it.
`npm test` checks that every formula is valid LaTeX.

## API

| Route | Auth | |
| --- | --- | --- |
| `GET /api/problems?difficulty=&tags=` | - | list/filter problems (no answers) |
| `GET /api/problems/:id/check` | yes | reveal the answer |
| `POST`/`DELETE /api/problems/:id/check` | yes | mark / unmark solved |
| `GET /api/me/solves` | yes | the user's solves |
| `GET`/`POST /api/problems/:id/solutions` | `POST` only | list / post solutions |
| `POST`/`DELETE /api/solutions/:id/vote` | yes | upvote / withdraw |
| `GET /api/wiki`, `GET /api/wiki/:slug` | - | technique pages |

Sign-ups, reveals, solves and posted solutions are logged as one-line JSON events (`lib/log.ts`).

## CI/CD

`.github/workflows/ci.yml` type-checks, lints, tests and builds on every push and pull request against a freshly seeded database, then deploys the static build to GitHub Pages from `main`.
