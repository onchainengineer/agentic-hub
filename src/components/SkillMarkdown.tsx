import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Custom markdown renderer for skill bodies.
 *
 * The default `prose prose-code:bg-gray-100` approach breaks on code blocks
 * because react-markdown emits `<code>` inside `<pre>`, and the prose selector
 * hits both inline and block code. This component splits them: inline code
 * gets subtle gray backgrounds, block code gets a single solid dark background
 * (no per-line styling).
 */
const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-gray-900 mt-5 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-1.5 mb-4 text-gray-700 marker:text-gray-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 space-y-1.5 mb-4 text-gray-700 marker:text-gray-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-accent-600 hover:text-brand-accent-700 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-brand-accent-300 bg-brand-accent-50/50 pl-4 pr-3 py-2 my-4 text-gray-700 italic rounded-r">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-6 border-gray-200" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
  th: ({ children }) => (
    <th className="text-left px-3 py-2 font-semibold text-gray-900 border-b border-gray-200">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-700 border-b border-gray-100">{children}</td>
  ),
  // Fenced code blocks (inside a <pre>) vs inline code
  pre: ({ children }) => (
    <pre className="bg-[#0d1117] text-[#e6edf3] rounded-lg p-4 my-4 overflow-x-auto text-[12.5px] leading-relaxed border border-[#1c2432]">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }) => {
    // If className contains "language-", it's a block code; inside pre the parent handles styling
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className={`font-mono ${className ?? ""}`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="font-mono text-[0.9em] bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded"
        {...props}
      >
        {children}
      </code>
    );
  },
};

export function SkillMarkdown({ children }: { children: string }) {
  return (
    <div className="skill-markdown max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
