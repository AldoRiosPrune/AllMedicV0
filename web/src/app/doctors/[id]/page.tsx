
"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Star, MapPin, Phone, Clock, Calendar, Award, Users } from "lucide-react"

type Doctor = {
  id: string
  specialty: string | null
  years_experience: number | null
  rating_avg: number | null
  rating_count: number | null
  phone: string | null
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

type Appointment = {
  id: string
  starts_at: string
  status: string
}

export default function DoctorDetail() {
  const supabase = getSupabaseBrowserClient()
  const { id } = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener información del doctor
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select(`
            id, 
            specialty, 
            years_experience, 
            rating_avg, 
            rating_count,
            phone,
            profiles(full_name, avatar_url)
          `)
          .eq("id", id)
          .single()

        if (doctorError) throw doctorError
        setDoctor(doctorData)

        // Obtener citas del doctor (próximas)
        const { data: appointmentsData } = await supabase
          .from("appointments")
          .select("id, starts_at, status")
          .eq("doctor_id", id)
          .eq("status", "confirmed")
          .gte("starts_at", new Date().toISOString())
          .order("starts_at", { ascending: true })
          .limit(5)

        setAppointments(appointmentsData || [])

        // Obtener usuario actual
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Doctor no encontrado</h2>
          <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar la información de este doctor.</p>
          <Link 
            href="/doctors"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ver todos los doctores
          </Link>
        </div>
      </div>
    )
  }

  const nextAppointments = appointments.slice(0, 3)
  const availableSlots = 5 - appointments.length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header del doctor */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                {doctor.profiles?.avatar_url ? (
                  <img
                    src={doctor.profiles.avatar_url}
                    alt={doctor.profiles.full_name || "Doctor"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">👨‍⚕️</span>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {doctor.profiles?.full_name || "Doctor"}
                </h1>
                <p className="text-xl text-blue-600 mb-3">{doctor.specialty}</p>
                
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">
                      {Number(doctor.rating_avg || 0).toFixed(1)}
                    </span>
                    <span className="text-sm">({doctor.rating_count || 0} reseñas)</span>
                  </div>
                  
                  {doctor.years_experience && (
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>{doctor.years_experience} años de experiencia</span>
                    </div>
                  )}
                  
                  {doctor.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5" />
                      <span>{doctor.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link
                href={`/appointments/new?doctor=${doctor.id}`}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Agendar cita</span>
              </Link>
              
              {doctor.phone && (
                <a
                  href={`tel:${doctor.phone}`}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Phone className="w-5 h-5" />
                  <span>Llamar</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Información general */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre el doctor</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Especialidad</p>
                    <p className="text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>
                
                {doctor.years_experience && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Experiencia</p>
                      <p className="text-gray-600">{doctor.years_experience} años</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Pacientes atendidos</p>
                    <p className="text-gray-600">{doctor.rating_count || 0} pacientes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horarios disponibles */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Disponibilidad</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{availableSlots}</div>
                  <p className="text-sm text-gray-600">Citas disponibles esta semana</p>
                </div>
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">30min</div>
                  <p className="text-sm text-gray-600">Duración promedio</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            {/* Próximas citas */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas citas</h3>
              {nextAppointments.length > 0 ? (
                <div className="space-y-3">
                  {nextAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm">
                        {new Date(apt.starts_at).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.starts_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Sin citas programadas</p>
              )}
            </div>

            {/* Acción rápida */}
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">¿Necesitas una cita?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Agenda una consulta con {doctor.profiles?.full_name || "este doctor"}
              </p>
              <Link
                href={`/appointments/new?doctor=${doctor.id}`}
                className="w-full inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Agendar ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
