"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Custom components for proper rendering
const components = {
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-border last:border-0">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border border-border px-4 py-3 text-left font-semibold text-foreground bg-muted/50">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-4 py-3 text-muted-foreground">
      {children}
    </td>
  ),
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-6 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-border text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="text-muted-foreground my-4 pl-6 list-disc space-y-2">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-muted-foreground my-4 pl-6 list-decimal space-y-2">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-primary font-medium hover:underline">{children}</a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary bg-muted/30 py-2 px-4 italic my-4">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) => 
    inline ? (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
    ) : (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    ),
  hr: () => (
    <hr className="border-border my-8" />
  ),
  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="rounded-xl shadow-md my-4" />
  ),
};

export default function MarkdownContent({ content }) {
  if (!content) return null;
  
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
