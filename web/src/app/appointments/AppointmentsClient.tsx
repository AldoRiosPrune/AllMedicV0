
"use client"

import Protected from "@/components/Protected"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Calendar, Clock, User, Phone, MapPin, Plus } from "lucide-react"
import Link from "next/link"

type AppointmentWithDoctor = {
  id: string
  starts_at: string
  ends_at: string
  status: "requested" | "confirmed" | "completed" | "cancelled"
  notes: string | null
  doctor: {
    id: string
    specialty: string | null
    phone: string | null
    profiles?: {
      full_name: string | null
      avatar_url: string | null
    } | null
  }
}

export default function AppointmentsClient() {
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return

        const { data, error } = await supabase
          .from("appointments")
          .select(`
            id,
            starts_at,
            ends_at,
            status,
            notes,
            doctors!inner(
              id,
              specialty,
              phone,
              profiles(full_name, avatar_url)
            )
          `)
          .eq("patient_id", userData.user.id)
          .order("starts_at", { ascending: true })

        if (error) throw error

        const mappedAppointments = data?.map(apt => ({
          id: apt.id,
          starts_at: apt.starts_at,
          ends_at: apt.ends_at,
          status: apt.status as "requested" | "confirmed" | "completed" | "cancelled",
          notes: apt.notes,
          doctor: {
            id: apt.doctors.id,
            specialty: apt.doctors.specialty,
            phone: apt.doctors.phone,
            profiles: apt.doctors.profiles
          }
        })) || []

        setAppointments(mappedAppointments)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "requested": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmada"
      case "requested": return "Pendiente"
      case "completed": return "Completada"
      case "cancelled": return "Cancelada"
      default: return status
    }
  }

  async function cancelAppointment(appointmentId: string) {
    if (!confirm("¿Estás seguro de que quieres cancelar esta cita?")) return

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", appointmentId)

      if (error) throw error

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: "cancelled" as const }
            : apt
        )
      )

      alert("Cita cancelada exitosamente")
    } catch (error) {
      console.error("Error cancelling appointment:", error)
      alert("Error al cancelar la cita")
    }
  }

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
              <p className="text-gray-600 mt-1">Gestiona todas tus citas médicas</p>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva cita
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes citas agendadas</h3>
              <p className="text-gray-600 mb-6">¡Agenda tu primera consulta médica!</p>
              <Link
                href="/doctors"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Agendar cita
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {appointment.doctor.profiles?.avatar_url ? (
                          <img
                            src={appointment.doctor.profiles.avatar_url}
                            alt={appointment.doctor.profiles.full_name || "Doctor"}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👨‍⚕️</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.doctor.profiles?.full_name || "Doctor"}
                        </h3>
                        <p className="text-gray-600 mb-2">{appointment.doctor.specialty}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(appointment.starts_at).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(appointment.starts_at).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notas:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                      
                      {appointment.status === "requested" || appointment.status === "confirmed" ? (
                        <div className="flex space-x-2">
                          {appointment.doctor.phone && (
                            <a
                              href={`tel:${appointment.doctor.phone}`}
                              className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                              title="Llamar al doctor"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => cancelAppointment(appointment.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Protected>
  )
}
