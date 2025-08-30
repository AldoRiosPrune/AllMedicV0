export const revalidate = 60

import Link from 'next/link'
import { serverClient } from '@/lib/query'

async function fetchPosts() {
  const supabase = serverClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug, title, tags, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as Array<{
    slug: string
    title: string
    tags: string[] | null
    created_at: string | null
  }>
}

export default async function Page() {
  let posts: Awaited<ReturnType<typeof fetchPosts>> = []
  try {
    posts = await fetchPosts()
  } catch (e) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-red-600">Ocurrió un error al cargar el blog.</p>
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600">Aún no hay publicaciones.</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-6">
        {posts.map((p) => {
          const dateStr = p.created_at
            ? new Date(p.created_at).toLocaleDateString()
            : null
          return (
            <li key={p.slug} className="border-b pb-4">
              <Link href={`/blog/${p.slug}`} className="text-xl font-semibold hover:underline">
                {p.title}
              </Link>
              <div className="text-sm text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                {dateStr ? <span>{dateStr}</span> : null}
                {p.tags && p.tags.length ? <span aria-hidden>-</span> : null}
                {p.tags && p.tags.length ? (
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full border text-gray-700 bg-white">
                        #{t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}


