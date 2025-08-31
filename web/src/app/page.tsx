export const revalidate = 60

import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabaseServer"

async function fetchTopDoctors() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, avatar_url, rating_avg")
    .order("rating_avg", { ascending: false })
    .limit(10)
  if (error) return [] as Array<{ id: string; full_name: string | null; specialty: string | null; avatar_url: string | null; rating_avg?: number | null }>
  return (data ?? []) as Array<{
    id: string
    full_name: string | null
    specialty: string | null
    avatar_url: string | null
    rating_avg?: number | null
  }>
}

export default async function HomePage() {
  const doctors = await fetchTopDoctors()

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-tr from-emerald-300 via-sky-300 to-indigo-300">
        <div className="absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative px-6 py-10 sm:px-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Top 10 Doctores</h1>
            <p className="mt-3 text-lg text-gray-800">
              Explora a los mejores doctores de la plataforma. No necesitas iniciar sesión para verlos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/doctors" className="rounded-md bg-white/80 px-4 py-2 text-sm font-medium text-gray-900 border hover:bg-white">
                Ver todos los doctores
              </Link>
              <Link href="/appointments/new" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black">
                Agendar cita (requiere login)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 doctores */}
      <section>
        {!doctors.length ? (
          <p className="text-gray-600">Aún no hay doctores.</p>
        ) : (
          <ol className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {doctors.map((d, idx) => {
              const rating = typeof d.rating_avg === 'number' ? d.rating_avg : 0
              return (
                <li key={d.id} className="relative rounded-xl border p-4 bg-gradient-to-br from-white to-slate-50">
                  <span className="absolute -top-2 -left-2 select-none rounded-full bg-amber-400 text-black text-xs font-bold px-2 py-1 shadow">
                    #{idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" aria-hidden />
                    <div>
                      <div className="font-medium">{d.full_name ?? "Médico(a)"}</div>
                      <div className="text-sm text-gray-600">{d.specialty ?? "Sin especialidad"}</div>
                      <div className="text-sm mt-1">★ {rating.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <Link href={`/doctors/${d.id}`} className="text-sm underline">Ver perfil</Link>
                    <Link href={`/appointments/new?doctor=${d.id}`} className="text-sm underline">Agendar (login)</Link>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}

