'use client'

import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

export type DoctorRow = {
  id: string
  full_name: string | null
  specialty: string | null
  license_number: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
}

export const doctorsKeys = {
  all: ['doctors'] as const,
  list: (specialty?: string | null) =>
    specialty ? ([...doctorsKeys.all, 'list', { specialty }] as const) : ([...doctorsKeys.all, 'list'] as const),
}

async function fetchDoctors(specialty?: string | null): Promise<DoctorRow[]> {
  const supabase = getSupabaseBrowserClient()
  let query = supabase
    .from('doctors')
    .select('id, full_name, specialty, license_number, phone, avatar_url, created_at')
    .order('full_name', { ascending: true })

  if (specialty) {
    query = query.eq('specialty', specialty)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as DoctorRow[]
}

export function useDoctors(specialty?: string | null): UseQueryResult<DoctorRow[], Error> {
  return useQuery({
    queryKey: doctorsKeys.list(specialty),
    queryFn: () => fetchDoctors(specialty),
  })
}