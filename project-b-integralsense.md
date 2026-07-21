# Project B — IntegralSense

**Goal:** a website where people practice integrals to prepare for "integration
bees" (speed integration competitions). It has two big features — a **practice tool**
(serve problems, check answers, filter by difficulty/tag, accept user solutions) and
a **technique wiki** — plus **user accounts** that remember each person's progress.

This is the **classic fullstack web app**, and it's the single best project for
learning the bread-and-butter skills employers ask about: APIs, authentication, SQL
databases, frontend frameworks, and deployment. If you only finish one project from
this guide, the skills here are the most directly resume-relevant.

Read `02-backend.md` and `03-frontend.md` alongside this — this project is those two
files made concrete.

---

## Part 0 — The big picture

A user opens the site, makes an account, and is shown integrals to solve. They can
**filter** problems ("show me only *hard* problems tagged *integration by parts*"),
type an answer, and get instant feedback. They can browse a **wiki** of techniques,
and submit their own **written solutions** for problems. The site **remembers** which
problems they've solved.

Under the hood this is the standard three-layer app from the README:
- **Frontend** (Next.js + TypeScript): the pages and interactivity in the browser.
- **Backend** (Next.js API routes): the logic — checking answers, saving progress.
- **Database** (PostgreSQL): permanent storage of problems, users, solutions, tags.

We'll use the recommended beginner fullstack stack from `03-frontend.md`:
**Next.js + TypeScript + Prisma + PostgreSQL (Supabase) + Tailwind + Auth.js, hosted
on Vercel.** One project, one language (TypeScript) front-to-back — ideal for a
beginner.

---

## Part 1 — Design the data first (the database schema)

The smartest thing you can do is design your data **before** writing pages. A
**schema** is the blueprint of your tables (see SQL in `02-backend.md`). Here's a
beginner-friendly schema described in plain English; you'll express it with
**Prisma** (the ORM that turns this into real SQL tables).

- **User**: `id`, `email`, `name`, `createdAt`. (Auth.js manages passwords/login.)
- **Problem**: `id`, `latex` (the integral, written in LaTeX — see note below),
  `answerKey` (the correct answer in a normalized form), `difficulty` (1–10),
  `createdAt`.
- **Tag**: `id`, `name` (e.g. "integration by parts", "trig substitution",
  "partial fractions").
- **ProblemTag**: links problems to tags. Because one problem can have many tags and
  one tag applies to many problems (a **many-to-many** relationship), you use a
  little "join table" connecting `problemId` ↔ `tagId`. (This is exactly the kind of
  *relational* link SQL databases are great at — see `02-backend.md`.)
- **Solve**: records that a user solved a problem — `userId`, `problemId`,
  `solvedAt`. This is how the site "remembers" progress.
- **Solution** (user-submitted editorials): `id`, `userId`, `problemId`,
  `body` (the written explanation), `upvotes`, `createdAt`.
- **WikiPage** (technique dictionary): `id`, `slug` (URL-friendly name like
  `integration-by-parts`), `title`, `body`, `relatedTagId` (optional link to a tag so
  the page can show practice problems).

> **LaTeX note:** math is written in **LaTeX**, a text format for equations
> (e.g. `\int x e^x \, dx`). A small frontend library called **KaTeX** or
> **MathJax** renders that text into beautiful typeset math in the browser. You store
> the LaTeX string in the database and render it on the page.

**Tool role — SQL database (PostgreSQL):** this is the app's long-term memory. Every
problem, account, tag, solve-record, and editorial lives here and survives restarts.
The relational links (problem↔tags, user↔solves) are what make filtering and
"remember my progress" possible.

**Tool role — Prisma (ORM):** lets you define the schema above in one file and work
with the data as typed TypeScript objects instead of hand-writing SQL — much safer
and friendlier for a beginner.

---

## Part 2 — Step-by-step build

### Step 1 — Set up the project and tools
1. Install **Node.js** (the JavaScript runtime) and create a Next.js + TypeScript app
   (`npx create-next-app@latest --typescript`). *(frontend framework, fullstack)*
2. Initialize **git** and push to a new **GitHub** repo right away. Commit after
   every step. *(git, `04-pipeline.md`)*
3. Add **Tailwind CSS** for styling. *(frontend)*
4. Create a free **Supabase** project to get a hosted **PostgreSQL** database; copy
   its connection string. *(SQL database, cloud service)*
5. Add **Prisma 6** (pin with `prisma@6` / `@prisma/client@6` — see
   `general_tips.md`), point it at the Supabase database, write the schema from
   Part 1, and run a "migration" (Prisma creates the real tables for you).
   *(SQL, ORM)*

### Step 2 — Seed some content
Before any UI, write a small "seed" script that inserts ~30 problems with
difficulties and tags, plus a few wiki pages. Now you have real data to build
against. *(SQL/database)*

### Step 3 — Build the practice tool (the core feature)
This is where APIs, frontend, and database all come together.

1. **List + filter problems.**
   - **Backend:** create an API route `GET /api/problems` that accepts filter
     parameters, e.g. `/api/problems?difficulty=hard&tag=integration-by-parts`. It
     queries the database (via Prisma) for matching problems and returns them as
     JSON. *(API, SQL filtering)*
   - **Frontend:** a page with dropdowns/checkboxes for **difficulty** and **tags**.
     When the user changes a filter, the page calls the API and shows the matching
     problems. *(frontend, fullstack — this is the "journey of a click" from
     `03-frontend.md`)*
   - This directly satisfies the requirement: *filter by difficulty and by tag.*
2. **Show a problem and check the answer.**
   - **Frontend:** render the integral with **KaTeX**, give an input box for the
     answer.
   - **Backend:** `POST /api/problems/:id/check` receives the user's answer, compares
     it to the stored `answerKey`, and returns correct/incorrect.
   - **Answer-checking is the interesting hard part.** Math answers can be written
     many equivalent ways (`2sin(x)cos(x)` vs `sin(2x)`; `+C` constants). Beginner
     plan: start with **normalized string comparison** (strip spaces, lowercase). Then
     upgrade to **symbolic comparison** using a math library — **SymPy** (Python) or
     **math.js / Nerdamer** (JavaScript) — which can check if two expressions are
     *mathematically equal* by simplifying their difference to zero. Mention this
     upgrade in your resume; it's a genuinely impressive touch. *(API, algorithms)*
3. **Mark it solved.** On a correct answer, the backend inserts a `Solve` row for that
   user+problem. Now the site "remembers." *(SQL, user data)*

### Step 4 — User accounts (authentication)
- Add **Auth.js (NextAuth)** with email/password and/or "Log in with Google" (OAuth).
  It handles password hashing, sessions, and tokens for you — **do not build login
  from scratch** (see `02-backend.md`). *(authentication)*
- Protect the right routes: only logged-in users can submit solutions or have
  progress saved. Show each user a **profile/dashboard** with their solved count and
  history (a query joining `User` → `Solve` → `Problem`). *(authentication,
  authorization, SQL joins)*
- This satisfies: *users can create accounts, log in, and have profile data saved
  (which questions they've solved).*

### Step 5 — User-submitted solutions/editorials
- **Backend:** `POST /api/problems/:id/solutions` (logged-in only) saves a `Solution`
  row; `GET /api/problems/:id/solutions` lists them. Add simple upvoting. *(API, SQL,
  authorization)*
- **Frontend:** a section under each problem showing community solutions, with a form
  to add your own (rendered with Markdown + KaTeX so people can write nice math
  explanations). *(frontend)*
- This satisfies: *users can submit their own solutions/editorials for others to
  view.*

### Step 6 — The technique wiki
- **Backend:** `GET /api/wiki` (list) and `GET /api/wiki/:slug` (one page).
- **Frontend:** a wiki index and individual technique pages (e.g. "Integration by
  Parts") rendered from Markdown + KaTeX. Each page can pull in **practice problems**
  by querying problems with the matching tag (`relatedTagId`) — connecting the wiki to
  the practice tool. *(frontend, API, SQL)*
- This satisfies: *a collection of technique pages, optionally with practice
  problems.*

### Step 7 — Logging & polish
- Add **logging** (`02-backend.md`): record sign-ups, problems attempted/solved, and
  answer-check latency. Add **Sentry** for error tracking. These logs give you real
  **metrics** for your resume (active users, problems solved, average check time).
  *(logging)*

### Step 8 — Containerize and deploy
- The simplest path: deploy the Next.js app on **Vercel** (one click from GitHub),
  with the database on Supabase. *(cloud service)*
- **To exercise the deployment skills on your friend's list**, also do the
  "container + VM" route at least once: write a **Dockerfile** for the app, build the
  image, and run it on a **VM** you **SSH** into and manage from the **Linux
  terminal**. *(Docker, VM, Linux/terminal)* This gives you both the easy modern
  deploy *and* the lower-level deploy experience to talk about.

### Step 9 — CI/CD
- Add **GitHub Actions** (`01-deployment.md`): on every push, run type-checks and
  tests (e.g. "does the answer-checker correctly mark `sin(2x)` equal to
  `2 sin x cos x`?"), then deploy. *(CI/CD, git)*

### Step 10 (optional) — Kubernetes bonus
- Deploy the Docker image to a small managed Kubernetes cluster with 2 replicas, for
  the resume keyword and self-healing demo. Optional (see `01-deployment.md`).

---

## Suggested build order (milestones)
**Commit to git after each.** Build the simplest version end-to-end first, then
enrich.

1. **M1:** Project set up; database schema + seed data; can query it. *(SQL, Prisma,
   git)*
2. **M2:** Page that lists problems and **filters by difficulty + tag**. *(API,
   frontend, fullstack)*
3. **M3:** Solve a problem with basic answer-checking. *(API, algorithms)*
4. **M4:** Accounts/login; "remember solved problems"; profile page. *(auth, SQL)*
5. **M5:** Symbolic answer-checking upgrade (SymPy/math.js). *(algorithms)*
6. **M6:** User-submitted solutions with upvotes. *(API, auth, SQL)*
7. **M7:** Technique wiki with linked practice problems. *(frontend, API, SQL)*
8. **M8:** Logging + Sentry; polish UI. *(logging)*
9. **M9:** Dockerize + deploy (Vercel, and once on a VM). *(Docker, VM, cloud,
   Linux)*
10. **M10:** CI/CD with GitHub Actions. *(CI/CD)*
11. **M11 (optional):** Kubernetes deploy. *(Kubernetes)*

---

## Tool-role summary (for your resume & interviews)
| Tool / concept | Its specific role in this project |
|---|---|
| Frontend (Next.js + TypeScript) | The browser UI: problem pages, filters, wiki, profile |
| Fullstack web dev | Frontend calling backend API routes in one project |
| API (Next.js API routes) | Endpoints to list/filter problems, check answers, save progress, post solutions |
| Authentication (Auth.js) | Account creation, login, sessions; gates who can post & whose progress is saved |
| SQL database (PostgreSQL) | Stores users, problems, tags, solves, solutions, wiki; powers filtering & "remember progress" |
| Prisma (ORM) | Type-safe way to define the schema and query the database |
| Algorithms (SymPy/math.js) | Symbolic answer-checking that recognizes mathematically-equal answers |
| Logging / Sentry | Tracks usage & errors → resume metrics |
| Cloud services (Supabase, Vercel) | Hosted database and app hosting |
| Docker | Packages the app to run identically anywhere |
| VM + Linux/terminal | Lower-level deploy you SSH into and manage |
| CI/CD (GitHub Actions) | Auto type-check, test the answer-checker, and deploy on push |
| git/GitHub | Version history + public portfolio |
| Kubernetes — optional | Bonus: self-healing, multi-replica deploy |
