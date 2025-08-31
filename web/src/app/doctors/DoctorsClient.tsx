
"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Search, Star, MapPin, Calendar, Filter } from "lucide-react"
import Link from "next/link"

type Doctor = {
  id: string
  full_name: string | null
  specialty: string | null
  avatar_url: string | null
  rating_avg: number | null
  rating_count: number | null
  years_experience: number | null
  phone: string | null
}

export default function DoctorsClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("")
  const [sortBy, setSortBy] = useState<"rating" | "name" | "experience">("rating")
  const supabase = getSupabaseBrowserClient()

  const specialties = [
    "Cardiología", "Dermatología", "Pediatría", "Neurología", 
    "Ginecología", "Oftalmología", "Psiquiatría", "Ortopedia"
  ]

  // Cargar doctores
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
            phone,
            profiles!inner(full_name, avatar_url)
          `)

        if (error) throw error

        const mappedDoctors = data?.map(d => ({
          id: d.id,
          full_name: d.profiles?.full_name || null,
          specialty: d.specialty,
          avatar_url: d.profiles?.avatar_url || null,
          rating_avg: d.rating_avg,
          rating_count: d.rating_count,
          years_experience: d.years_experience,
          phone: d.phone
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

  // Filtrar y ordenar doctores
  useEffect(() => {
    let filtered = [...doctors]

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(doctor => 
        doctor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por especialidad
    if (selectedSpecialty) {
      filtered = filtered.filter(doctor => doctor.specialty === selectedSpecialty)
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating_avg || 0) - (a.rating_avg || 0)
        case "name":
          return (a.full_name || "").localeCompare(b.full_name || "")
        case "experience":
          return (b.years_experience || 0) - (a.years_experience || 0)
        default:
          return 0
      }
    })

    setFilteredDoctors(filtered)
  }, [searchTerm, selectedSpecialty, sortBy, doctors])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Encuentra tu doctor ideal</h1>
          
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o especialidad"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Especialidad */}
              <div>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las especialidades</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Ordenar */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "rating" | "name" | "experience")}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Mejor calificados</option>
                  <option value="name">Nombre A-Z</option>
                  <option value="experience">Más experiencia</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 'es' : ''} encontrado{filteredDoctors.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Lista de doctores */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
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
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {doctor.full_name || "Dr. Anónimo"}
                      </h3>
                      <p className="text-gray-600 mb-1">{doctor.specialty}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{Number(doctor.rating_avg || 0).toFixed(1)} ({doctor.rating_count || 0} reseñas)</span>
                        </div>
                        
                        {doctor.years_experience && (
                          <span>{doctor.years_experience} años de experiencia</span>
                        )}
                        
                        {doctor.phone && (
                          <span>{doctor.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver perfil
                    </Link>
                    <Link
                      href={`/appointments/new?doctor=${doctor.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar cita</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron doctores</h3>
            <p className="text-gray-600 mb-4">
              Intenta ajustar los filtros o buscar con términos diferentes
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedSpecialty("")
              }}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
