"use client";

import Protected from "@/components/Protected";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function NewAppointment() {
  const supabase = getSupabaseBrowserClient();
  const sp = useSearchParams();
  const doctor = sp.get("doctor") ?? "";
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  async function createAppt(e: React.FormEvent) {
    e.preventDefault();
    const starts = new Date(`${date}T${time}:00`);
    const ends = new Date(starts.getTime() + 30 * 60 * 1000);

    // obtener paciente actual
    const { data: sess } = await supabase.auth.getUser();
    const patient_id = sess.user?.id;
    if (!patient_id) return alert("No hay sesión");

    const { error } = await supabase.from("appointments").insert({
      doctor_id: doctor,
      patient_id,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      status: "requested",
    });
    alert(error ? error.message : "Solicitud enviada ✅");
  }

  return (
    <Protected>
      <h1 className="text-xl font-semibold mb-4">Agendar cita</h1>
      <form onSubmit={createAppt} className="space-y-3 max-w-sm">
        <div>
          <label className="block text-sm">Fecha</label>
          <input type="date" className="border rounded px-2 py-1 w-full" value={date} onChange={(e)=>setDate(e.target.value)} required/>
        </div>
        <div>
          <label className="block text-sm">Hora</label>
          <input type="time" className="border rounded px-2 py-1 w-full" value={time} onChange={(e)=>setTime(e.target.value)} required/>
        </div>
        <button className="rounded px-4 py-2 border">Crear</button>
      </form>
    </Protected>
  );
}
