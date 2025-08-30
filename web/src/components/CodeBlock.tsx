"use client";

import React, { useEffect, useState } from "react";

export type CodeBlockProps = {
  code: string;
  language?: string;
};

// Minimal typing surface to avoid a hard dependency on highlight.js types
interface HLJSLike {
  highlight: (code: string, options: { language: string }) => { value: string };
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!language) {
        setHighlighted(null);
        return;
      }
      try {
        const imported = await import("highlight.js");
        const maybeDefault = (imported as unknown as { default?: HLJSLike }).default;
        const hl: HLJSLike | null = maybeDefault ?? ((imported as unknown) as HLJSLike);
        if (!hl) {
          if (alive) setHighlighted(null);
          return;
        }
        const { value } = hl.highlight(code, { language });
        if (alive) setHighlighted(value);
      } catch {
        if (alive) setHighlighted(null);
      }
    }
    run();
    return () => {
      alive = false;
    };
  }, [code, language]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <pre className="rounded-2xl border p-4 overflow-x-auto relative group">
      <button
        type="button"
        onClick={onCopy}
        className="absolute top-2 right-2 hidden group-hover:block text-xs px-2 py-1 rounded-md border bg-white/70 backdrop-blur hover:bg-white"
        aria-label="Copiar código"
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
      <code
        className={language ? `hljs language-${language}` : undefined}
        dangerouslySetInnerHTML={highlighted ? { __html: highlighted } : undefined}
      >
        {!highlighted ? code : null}
      </code>
    </pre>
  );
}
