import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProblemActions } from "@/components/ProblemActions";
import { Solutions } from "@/components/Solutions";
import { TeX } from "@/components/TeX";
import { getProblem, getProblemIds } from "@/lib/content";
import { parseId } from "@/lib/ids";
import { STATIC_EXPORT } from "@/lib/mode";
import { listSolutions } from "@/lib/solutions";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProblemIds()).map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Problem ${(await params).id}` };
}

export default async function ProblemPage({ params }: Props) {
  const id = parseId((await params).id);
  const [problem, ids, solutions] = id
    ? await Promise.all([getProblem(id), getProblemIds(), listSolutions(id)])
    : [null, [], []];
  if (!problem) notFound();

  const index = ids.indexOf(problem.id);
  const prev = ids[index - 1];
  const next = ids[index + 1];

  return (
    <article>
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Problem {problem.id}</h1>
        <span className="font-sans text-sm text-muted">Difficulty {problem.difficulty} of 5</span>
      </div>
      {problem.techniques.length > 0 && (
        <p className="mt-1 font-sans text-sm text-muted">
          {problem.techniques.map((t, i) => (
            <span key={t.name}>
              {i > 0 && ", "}
              {t.slug ? (
                <Link href={`/wiki/${t.slug}`} className="link">
                  {t.name}
                </Link>
              ) : (
                t.name
              )}
            </span>
          ))}
        </p>
      )}

      <div className="my-12 text-xl">
        <TeX math={problem.latex} display />
      </div>

      {/* Only the static build embeds the answer; the server build hands it out via the API. */}
      <ProblemActions problemId={problem.id} answerKey={STATIC_EXPORT ? problem.answerKey : undefined} />

      <Solutions problemId={problem.id} initial={solutions} />

      <nav className="mt-12 flex justify-between font-sans text-sm">
        {prev ? (
          <Link href={`/problems/${prev}`} className="text-muted hover:text-foreground">
            ← Problem {prev}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/problems/${next}`} className="text-muted hover:text-foreground">
            Problem {next} →
          </Link>
        )}
      </nav>
    </article>
  );
}
