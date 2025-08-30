// Server-side Supabase client for Next.js App Router
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function serverClient() {
  const cookieStore = cookies() as unknown as {
    getAll: (name?: string) => Array<{ name: string; value: string }>
    set?: (init: { name: string; value: string; expires?: Date }) => void
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          try {
            const all = cookieStore.getAll()
            return all?.map((c) => ({ name: c.name, value: c.value })) ?? []
          } catch {
            return []
          }
        },
        // setAll is optional for pages/components; Supabase will warn only if needed.
      },
    },
  )
}
