// Server-side Supabase client for Next.js App Router
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function serverClient() {
  const cookieStore = cookies()
  // Uses public anon key on server; RLS still applies.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            // @ts-ignore - set allows object in App Router
            cookieStore.set({ name, value, ...options })
          } catch {}
        },
        remove(name: string, options: any) {
          try {
            // Expire cookie
            // @ts-ignore
            cookieStore.set({ name, value: '', ...options, expires: new Date(0) })
          } catch {}
        },
      },
    },
  )
}
