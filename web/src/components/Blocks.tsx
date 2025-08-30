import React from 'react'
import CodeBlock from './CodeBlock'
import type { BlogBlock } from '@/types/domain'

export default function Blocks({ blocks }: { blocks: BlogBlock[] }) {
  if (!blocks?.length) return null
  return (
    <div className="prose max-w-none">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h1':
            return (
              <h1 key={i} className="text-3xl font-bold mt-10 mb-4">
                {b.text}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={i} className="text-2xl font-semibold mt-8 mb-3">
                {b.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} className="text-xl font-semibold mt-6 mb-2">
                {b.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="my-4">
                {b.text}
              </p>
            )
          case 'quote':
            return (
              <blockquote key={i} className="border-l-4 pl-4 italic my-4 text-gray-700">
                {b.text}
              </blockquote>
            )
          case 'ul':
            return (
              <ul key={i} className="list-disc ml-6 my-4">
                {b.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="list-decimal ml-6 my-4">
                {b.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ol>
            )
          case 'code':
            return <CodeBlock key={i} code={b.code} language={b.language} />
          case 'image':
            return (
              <figure key={i} className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.url} alt={b.alt ?? ''} className="rounded-xl border" />
                {b.caption ? (
                  <figcaption className="text-sm text-gray-500 mt-2">{b.caption}</figcaption>
                ) : null}
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
