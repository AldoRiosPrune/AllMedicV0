"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import Protected from "@/components/Protected";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type Doctor = {
  id: string;
  full_name: string | null;
  specialty: string;
  years_experience: number | null;
  rating_avg: number;
  rating_count: number;
};

export default function DoctorsPage() {
  const supabase = getSupabaseBrowserClient();
  const [items, setItems] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialty, setSpecialty] = useState<string>("");
  const [order, setOrder] = useState<"rating" | "experience">("rating");

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase
        .from("doctors")
        .select("id, specialty, years_experience, rating_avg, rating_count, profiles!inner(full_name)")
        .limit(50);

      if (specialty) q = q.ilike("specialty", `%${specialty}%`);

      const { data, error } = await q;
      if (error) {
        console.error(error);
        setItems([]);
      } else {
        const mapped = (data ?? []).map((d: any) => ({
          id: d.id,
          full_name: d.profiles?.full_name ?? null,
          specialty: d.specialty,
          years_experience: d.years_experience,
          rating_avg: Number(d.rating_avg ?? 0),
          rating_count: Number(d.rating_count ?? 0),
        }));
        setItems(mapped);
      }
      setLoading(false);
    })();
  }, [supabase, specialty]);

  const sorted = useMemo(() => {
    const arr = [...items];
    if (order === "rating") {
      arr.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
    } else {
      arr.sort((a, b) => (b.years_experience || 0) - (a.years_experience || 0));
    }
    return arr;
  }, [items, order]);

  return (
    <Protected>
      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-sm">Especialidad</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Cardiología, Odontología…"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Ordenar por</label>
          <select
            className="border rounded px-2 py-1"
            value={order}
            onChange={(e) => setOrder(e.target.value as any)}
          >
            <option value="rating">Mejor calificados</option>
            <option value="experience">Más experiencia</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Cargando doctores…</p>
      ) : sorted.length === 0 ? (
        <p>No hay doctores que coincidan.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((d) => (
            <li key={d.id} className="border rounded-lg p-4">
              <div className="font-semibold">{d.full_name ?? "Médico(a) sin nombre"}</div>
              <div className="text-sm text-gray-600">{d.specialty}</div>
              <div className="text-sm mt-1">
                ⭐ {d.rating_avg?.toFixed(1) ?? "0.0"} ({d.rating_count ?? 0})
              </div>
              <div className="text-sm">Experiencia: {d.years_experience ?? 0} años</div>
              <a className="inline-block mt-3 text-blue-600 underline" href={`/doctors/${d.id}`}>
                Ver perfil
              </a>
            </li>
          ))}
        </ul>
      )}
    </Protected>
  );
}
