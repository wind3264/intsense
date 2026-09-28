import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-2 text-muted">
        <Link href="/" className="link">
          Back to the problems
        </Link>
      </p>
    </>
  );
}
