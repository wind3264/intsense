import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">About</h1>
      <div className="prose">
        <p>Welcome to IntegralSense, a website for integration bee training!</p>
        <h2>How to use this website</h2>
        <p>
          Use the Practice mode to get a random problem, or view the entire list in All Problems. I currently
          don&apos;t have an efficient way to check answers so you&apos;ll have to check them yourself while
          practicing (sorry!). If you&apos;ve solved a problem, you can also write a solution for the whole world to
          see!
        </p>
        <p>Happy integrating :)</p>
      </div>
    </>
  );
}
