import katex from "katex";

// Renders a LaTeX string with KaTeX. Works in both server and client components.
export function TeX({ math, display = false }: { math: string; display?: boolean }) {
  const html = katex.renderToString(math, { displayMode: display, throwOnError: false });
  const Tag = display ? "div" : "span";
  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
}
