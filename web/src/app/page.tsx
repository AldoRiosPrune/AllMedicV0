
export const revalidate = 60

import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabaseServer"

async function fetchTopDoctors() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("doctors")
    .select("id, full_name, specialty, avatar_url, rating_avg")
    .order("rating_avg", { ascending: false })
    .limit(4)
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

  const specialties = [
    { name: "Cardiología", icon: "❤️", color: "bg-red-100" },
    { name: "Dermatología", icon: "🧴", color: "bg-orange-100" },
    { name: "Pediatría", icon: "👶", color: "bg-yellow-100" },
    { name: "Neurología", icon: "🧠", color: "bg-green-100" },
    { name: "Ginecología", icon: "👩", color: "bg-pink-100" },
    { name: "Oftalmología", icon: "👁️", color: "bg-blue-100" }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20z' fill='%23e5e7eb'/%3E%3C/svg%3E")`
          }}
        />
        <div className="relative px-8 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Encuentra el mejor doctor cerca de ti
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Reserva citas médicas en línea con los mejores doctores en tu área. Accede a opiniones de pacientes, 
            disponibilidad y agenda.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Buscar médicos o especialidades..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Doctores cerca de ti */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Doctores cerca de ti</h2>
        {!doctors.length ? (
          <p className="text-gray-600">Aún no hay doctores disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => {
              const rating = typeof doctor.rating_avg === 'number' ? doctor.rating_avg : 0
              return (
                <div key={doctor.id} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-semibold">
                    {doctor.full_name?.charAt(0) || "D"}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {doctor.full_name || "Médico(a)"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {doctor.specialty || "Sin especialidad"}
                  </p>
                  <div className="text-sm text-yellow-600 mb-4">
                    ★ {rating.toFixed(1)}
                  </div>
                  <Link 
                    href={`/doctors/${doctor.id}`}
                    className="inline-block w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver perfil
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Especialidades populares */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Especialidades populares</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {specialties.map((specialty) => (
            <Link
              key={specialty.name}
              href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
              className={`${specialty.color} rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
            >
              <div className="text-3xl mb-3">{specialty.icon}</div>
              <h3 className="font-medium text-gray-900">{specialty.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Artículos de salud */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos de salud</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
            <div className="p-6">
              <span className="text-sm text-green-600 font-medium">Nutrición</span>
              <h3 className="font-bold text-xl text-gray-900 mt-2 mb-3">
                Consejos para mantener una dieta equilibrada
              </h3>
              <p className="text-gray-600 text-sm">
                Descubre cómo una alimentación adecuada puede mejorar tu bienestar general y prevenir enfermedades.
              </p>
            </div>
          </article>

          <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-500"></div>
            <div className="p-6">
              <span className="text-sm text-orange-600 font-medium">Bienestar</span>
              <h3 className="font-bold text-xl text-gray-900 mt-2 mb-3">
                Manejo del estrés en la vida diaria
              </h3>
              <p className="text-gray-600 text-sm">
                Aprende técnicas efectivas para reducir el estrés y mejorar tu calidad de vida.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Footer info */}
      <section className="text-center py-8 border-t">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-4">
          <Link href="/about" className="hover:text-gray-900">Acerca de</Link>
          <Link href="/services" className="hover:text-gray-900">Servicios</Link>
          <Link href="/contact" className="hover:text-gray-900">Contacto</Link>
          <Link href="/privacy" className="hover:text-gray-900">Privacidad</Link>
        </div>
        <p className="text-xs text-gray-500">
          ©2024 HealthFind. Todos los derechos reservados.
        </p>
      </section>
    </div>
  )
}
