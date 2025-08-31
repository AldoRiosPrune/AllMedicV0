
"use client"

import Protected from "@/components/Protected"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Calendar, Clock, User, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Doctor = {
  id: string
  specialty: string | null
  profiles?: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default function NewAppointmentClient() {
  const supabase = getSupabaseBrowserClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const doctorId = searchParams.get("doctor") || ""
  
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [doctorLoading, setDoctorLoading] = useState(true)

  // Horarios disponibles (simulados)
  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ]

  // Obtener mínima fecha (hoy)
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    async function fetchDoctor() {
      if (!doctorId) return
      
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select(`
            id,
            specialty,
            profiles(full_name, avatar_url)
          `)
          .eq("id", doctorId)
          .single()

        if (error) throw error
        setDoctor(data)
      } catch (error) {
        console.error("Error fetching doctor:", error)
      } finally {
        setDoctorLoading(false)
      }
    }

    fetchDoctor()
  }, [doctorId, supabase])

  async function createAppointment(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time || !doctorId) return

    setLoading(true)

    try {
      const { data: userRes } = await supabase.auth.getUser()
      const patientId = userRes.user?.id
      
      if (!patientId) {
        alert("Debes iniciar sesión para agendar una cita")
        router.push("/login")
        return
      }

      // Crear datetime para la cita
      const startDateTime = new Date(`${date}T${time}:00`)
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000) // 30 minutos después

      // Verificar si ya existe una cita en ese horario
      const { data: existingAppointments } = await supabase
        .from("appointments")
        .select("id")
        .eq("doctor_id", doctorId)
        .eq("starts_at", startDateTime.toISOString())
        .neq("status", "cancelled")

      if (existingAppointments && existingAppointments.length > 0) {
        alert("Este horario ya está ocupado. Por favor selecciona otro.")
        return
      }

      const { error } = await supabase.from("appointments").insert({
        doctor_id: doctorId,
        patient_id: patientId,
        starts_at: startDateTime.toISOString(),
        ends_at: endDateTime.toISOString(),
        status: "requested",
        notes: notes.trim() || null
      })

      if (error) throw error

      alert("¡Solicitud de cita enviada exitosamente! ✅\nEl doctor confirmará tu cita pronto.")
      router.push("/appointments")
      
    } catch (error) {
      console.error("Error creating appointment:", error)
      alert("Error al crear la cita. Por favor intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Protected>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/doctors" 
              className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a doctores
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Agendar nueva cita</h1>
          </div>

          {/* Información del doctor */}
          {doctorLoading ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : doctor ? (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {doctor.profiles?.avatar_url ? (
                    <img
                      src={doctor.profiles.avatar_url}
                      alt={doctor.profiles.full_name || "Doctor"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">👨‍⚕️</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {doctor.profiles?.full_name || "Doctor"}
                  </h2>
                  <p className="text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">No se pudo cargar la información del doctor.</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={createAppointment} className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Fecha */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Fecha de la cita</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Hora */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Hora preferida</span>
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  <span>Notas adicionales (opcional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Información importante */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Información importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• La duración estimada de la consulta es de 30 minutos</li>
                  <li>• Recibirás una confirmación por email</li>
                  <li>• Puedes cancelar o reprogramar hasta 24 horas antes</li>
                </ul>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-4">
                <Link
                  href="/doctors"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading || !date || !time || !doctorId}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Agendando..." : "Agendar cita"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Protected>
  )
}
