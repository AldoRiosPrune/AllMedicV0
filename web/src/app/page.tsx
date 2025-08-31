
"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"
import Link from "next/link"
import { Search, Star, Calendar, MapPin, Phone } from "lucide-react"

type Doctor = {
  id: string
  full_name: string | null
  specialty: string | null
  avatar_url: string | null
  rating_avg: number | null
  rating_count: number | null
  years_experience: number | null
}

type Specialty = {
  name: string
  icon: string
  color: string
  description: string
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  const specialties: Specialty[] = [
    { name: "Cardiología", icon: "❤️", color: "bg-red-100 hover:bg-red-200", description: "Especialistas en corazón" },
    { name: "Dermatología", icon: "🧴", color: "bg-orange-100 hover:bg-orange-200", description: "Cuidado de la piel" },
    { name: "Pediatría", icon: "👶", color: "bg-yellow-100 hover:bg-yellow-200", description: "Médicos para niños" },
    { name: "Neurología", icon: "🧠", color: "bg-green-100 hover:bg-green-200", description: "Especialistas en cerebro" },
    { name: "Ginecología", icon: "👩", color: "bg-pink-100 hover:bg-pink-200", description: "Salud femenina" },
    { name: "Oftalmología", icon: "👁️", color: "bg-blue-100 hover:bg-blue-200", description: "Cuidado de los ojos" }
  ]

  // Cargar doctores desde Supabase
  useEffect(() => {
    async function fetchDoctors() {
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select(`
            id, 
            specialty, 
            years_experience, 
            rating_avg, 
            rating_count,
            profiles!inner(full_name, avatar_url)
          `)
          .order("rating_avg", { ascending: false })

        if (error) throw error

        const mappedDoctors = data?.map(d => ({
          id: d.id,
          full_name: d.profiles?.full_name || null,
          specialty: d.specialty,
          avatar_url: d.profiles?.avatar_url || null,
          rating_avg: d.rating_avg,
          rating_count: d.rating_count,
          years_experience: d.years_experience
        })) || []

        setDoctors(mappedDoctors)
        setFilteredDoctors(mappedDoctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [supabase])

  // Filtrar doctores basado en la búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors)
      return
    }

    const filtered = doctors.filter(doctor => 
      doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDoctors(filtered)
  }, [searchTerm, doctors])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // La búsqueda se maneja en tiempo real con useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HealthFind</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link href="/doctors" className="text-gray-600 hover:text-gray-900">Servicios</Link>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">Nosotros</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contacto</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link 
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Encuentra el mejor doctor cerca de ti
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Reserva citas médicas en línea con los mejores doctores en tu área. Accede a opiniones de pacientes, 
                disponibilidad y agenda.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar médicos o especialidades..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Buscar
                </button>
              </form>
            </div>
            
            <div className="lg:text-right">
              <div className="bg-white rounded-2xl shadow-lg p-8 inline-block">
                <div className="w-64 h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">🏥</span>
                </div>
                <p className="text-sm text-gray-600">Consulta médica profesional</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctores cercanos */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Doctores cerca de ti</h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDoctors.slice(0, 4).map((doctor) => (
                <Link
                  key={doctor.id}
                  href={`/doctors/${doctor.id}`}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      {doctor.avatar_url ? (
                        <img
                          src={doctor.avatar_url}
                          alt={doctor.full_name || "Doctor"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">👨‍⚕️</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {doctor.full_name || "Dr. Anónimo"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-gray-600">
                        {Number(doctor.rating_avg || 0).toFixed(1)} ({doctor.rating_count || 0})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link
              href="/doctors"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
            >
              Ver todos los doctores →
            </Link>
          </div>
        </div>
      </section>

      {/* Especialidades populares */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Especialidades populares</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty) => (
              <Link
                key={specialty.name}
                href={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
                className={`${specialty.color} rounded-xl p-6 text-center transition-all duration-200 hover:scale-105`}
              >
                <div className="text-4xl mb-4">{specialty.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{specialty.name}</h3>
                <p className="text-sm text-gray-600">{specialty.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos de salud */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos de salud</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Consejos para mantener una dieta equilibrada
              </h3>
              <p className="text-gray-600 mb-4">
                Descubre cómo una alimentación adecuada puede mejorar tu bienestar general y 
                prevenir enfermedades.
              </p>
              <Link 
                href="/blog/dieta-equilibrada"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Leer más →
              </Link>
              <div className="mt-4 flex">
                <div className="w-24 h-16 bg-green-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥗</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Manejo del estrés en la vida diaria
              </h3>
              <p className="text-gray-600 mb-4">
                Aprende técnicas efectivas para reducir el estrés y mejorar tu calidad de vida.
              </p>
              <Link 
                href="/blog/manejo-estres"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Leer más →
              </Link>
              <div className="mt-4 flex">
                <div className="w-24 h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🧘‍♀️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold">HealthFind</span>
              </div>
              <p className="text-gray-400">
                Tu plataforma confiable para encontrar los mejores profesionales de la salud.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Acerca de</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Nosotros</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/doctors" className="hover:text-white">Doctores</Link></li>
                <li><Link href="/specialties" className="hover:text-white">Especialidades</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy;2024 HealthFind. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
