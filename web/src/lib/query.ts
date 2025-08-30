// Server-side Supabase client for Next.js App Router
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function serverClient() {
  // In Next 15 types, cookies() may be typed as Promise. We cast to a minimal interface.
  type CookieInit = {
    name: string
    value: string
    expires?: Date
    path?: string
    sameSite?: 'lax' | 'strict' | 'none'
    httpOnly?: boolean
    secure?: boolean
    maxAge?: number
    domain?: string
  }
  interface CookieStoreLike {
    get: (name: string) => { name: string; value: string } | undefined
    set: (init: CookieInit) => void
  }

  const cookieStore = (cookies() as unknown) as CookieStoreLike

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch {
            return undefined
          }
        },
        set(name: string, value: string, options: Partial<Omit<CookieInit, 'name' | 'value'>>) {
          try {
            cookieStore.set({ name, value, ...(options ?? {}) })
          } catch {}
        },
        remove(name: string, options: Partial<Omit<CookieInit, 'value'>>) {
          try {
            cookieStore.set({ name, value: '', ...(options ?? {}), expires: new Date(0) })
          } catch {}
        },
      },
    },
  )
}
