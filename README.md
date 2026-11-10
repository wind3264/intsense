# IntegralSense

Practice problems and a technique wiki for integration bees.

Live: https://intsense.vercel.app

## Features

- **Practice** - the landing page serves one random problem at a time for a chosen difficulty range and set of tags.
  Problems you have solved or already been served do not come back until every match is used up.
  The answer and posted solutions sit in a drop-down under the problem.
- **All Problems** - 228 integrals rendered with KaTeX, filterable by difficulty (1-5) and one or more tags, searchable by LaTeX or problem number, and sortable by difficulty.
  Tags are techniques or sources (UT Austin Integration Bee 2025-26, MIT Integration Bee qualifiers 2022-26).
- **Trust-based checking** - work the integral on paper, reveal the answer, and mark it solved yourself.
  Anyone can reveal an answer; marking solved needs an account, and the two are independent.
- **Accounts** - Google sign-in via Auth.js; solved problems are remembered.
- **Profiles** - every user has a public profile with their progress, solve history and posted solutions.
- **Solutions** - users post Markdown + LaTeX write-ups under each problem, with one upvote per user, and can delete their own.
  Solutions are collapsed by default since they give the answer away.
- **Wiki** - one page per technique, each linked to its practice problems.

## Stack

Next.js (App Router) + TypeScript, Prisma with PostgreSQL, Auth.js (next-auth v5) with the Prisma adapter, Tailwind CSS, KaTeX, Vitest.

## Running locally

```bash
docker run --name intsense-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=intsense -p 5432:5432 -d postgres:17
npm install
npx prisma migrate dev   # applies prisma/migrations
npx prisma db seed       # loads prisma/content (safe to re-run)
npm run dev
```

`.env` needs:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/intsense?connection_limit=2&pool_timeout=0"
AUTH_SECRET=...          # npx auth secret
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

`connection_limit` matters for `npm run build`: pages are prerendered by one worker process per CPU core, each with its own Prisma connection pool, and the default pool size would exhaust Postgres' 100 connections.

Google sign-in only works on origins whose redirect URI (`<origin>/api/auth/callback/google`) is registered in the Google Cloud console.

## Deployment

The site is hosted on Vercel, with a Neon Postgres database installed through the Vercel Marketplace.
`vercel.json` makes every deploy apply pending migrations and re-seed `prisma/content` before `next build`, so content changes go live with a deploy.
Migrations use Neon's direct connection (`DATABASE_URL_UNPOOLED`); the app itself uses the pooled `DATABASE_URL`.
The Vercel project needs `AUTH_SECRET`, `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`; the database variables are set by the integration.

Pages read problems and wiki content from the database at build time; everything per-user goes through the API routes (`lib/user-data.ts`).

## Content

Problems, wiki pages and editorial solutions live in `prisma/content/` and are loaded by `prisma/seed.ts`.
Problem ids are positions in `problems.json`, so only ever append to it.
`npm test` checks that every formula is valid LaTeX.

## API

| Route | Auth | |
| --- | --- | --- |
| `GET /api/problems?difficulty=&tags=` | - | list/filter problems (no answers) |
| `GET /api/problems/:id/check` | - | reveal the answer |
| `POST`/`DELETE /api/problems/:id/check` | yes | mark / unmark solved |
| `GET /api/me/solves` | yes | the user's solves |
| `GET`/`POST /api/problems/:id/solutions` | `POST` only | list / post solutions |
| `DELETE /api/solutions/:id` | yes (author) | delete a solution |
| `POST`/`DELETE /api/solutions/:id/vote` | yes | upvote / withdraw |
| `GET /api/users/:id` | - | a user's public profile |
| `GET /api/wiki`, `GET /api/wiki/:slug` | - | technique pages |

Sign-ups, reveals, solves and posted or deleted solutions are logged as one-line JSON events (`lib/log.ts`).

## CI/CD

`.github/workflows/ci.yml` type-checks, lints, tests and builds on every push and pull request against a freshly seeded database.
Vercel deploys `main` on push.
