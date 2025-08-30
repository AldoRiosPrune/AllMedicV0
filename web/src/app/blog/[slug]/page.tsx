export const revalidate = 60

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { serverClient } from '@/lib/query'
import Blocks from '@/components/Blocks'

async function fetchPost(slug: string) {
  const supabase = serverClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, content_json, tags, created_at')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data as {
    slug: string
    title: string
    content_json: any
    tags: string[] | null
    created_at: string | null
  } | null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const post = await fetchPost(params.slug)
    if (!post) return { title: 'Blog' }
    return { title: post.title }
  } catch {
    return { title: 'Blog' }
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug)
  if (!post) return notFound()

  const dateStr = post.created_at
    ? new Date(post.created_at).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight mb-3">{post.title}</h1>
      <div className="text-sm text-gray-600 mb-8 flex flex-wrap gap-2">
        {dateStr ? <span>{dateStr}</span> : null}
        {post.tags && post.tags.length ? (
          <span aria-hidden>-</span>
        ) : null}
        {post.tags && post.tags.length ? (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full border text-gray-700 bg-white">
                #{t}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <Blocks blocks={post.content_json} />
    </article>
  )
}