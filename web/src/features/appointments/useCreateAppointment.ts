'use client'

import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

export type CreateAppointmentInput = {
  patient_id: string
  doctor_id: string
  start_at: string // ISO datetime
  end_at: string // ISO datetime
  notes?: string | null
  status?: 'scheduled' | 'completed' | 'cancelled'
}

export type AppointmentRow = {
  id: string
  patient_id: string
  doctor_id: string
  start_at: string
  end_at: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes: string | null
  created_at: string
}

async function createAppointment(input: CreateAppointmentInput): Promise<AppointmentRow> {
  const supabase = getSupabaseBrowserClient()
  const payload = {
    patient_id: input.patient_id,
    doctor_id: input.doctor_id,
    start_at: input.start_at,
    end_at: input.end_at,
    notes: input.notes ?? null,
    ...(input.status ? { status: input.status } : {}),
  }
  const { data, error } = await supabase.from('appointments').insert(payload).select('*').single()
  if (error) throw error
  return data as AppointmentRow
}

export function useCreateAppointment(
  options?: {
    onSuccess?: (data: AppointmentRow) => void
    onError?: (err: Error) => void
  },
): UseMutationResult<AppointmentRow, Error, CreateAppointmentInput> {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: (data) => {
      // Invalida consultas generales de citas si existen
      qc.invalidateQueries({ queryKey: ['appointments'] }).catch(() => {})
      options?.onSuccess?.(data)
    },
    onError: (err) => {
      options?.onError?.(err)
    },
  })
}