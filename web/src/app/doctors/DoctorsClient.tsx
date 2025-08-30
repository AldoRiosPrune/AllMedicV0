"use client";

import { useMemo, useState } from "react";
import Protected from "@/components/Protected";
import Link from "next/link";
import { useDoctors, type DoctorRow } from "@/features/doctors/useDoctors";

type Sort = "rating_desc" | "rating_asc"
type DoctorWithRating = DoctorRow & { rating_avg?: number | null };

export default function DoctorsClient() {
  const [specialty, setSpecialty] = useState<string>("");
  const [sort, setSort] = useState<Sort>("rating_desc");

  const { data, isLoading, error } = useDoctors(specialty || null);

  const items = useMemo(() => {
    const arr = ((data ?? []) as DoctorWithRating[]).slice();
    const getRating = (d: DoctorWithRating) => Number(d.rating_avg ?? 0);
    arr.sort((a, b) =>
      sort === "rating_desc"
        ? getRating(b) - getRating(a)
        : getRating(a) - getRating(b)
    );
    return arr;
  }, [data, sort]);

  return (
    <Protected>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-sm">Especialidad</label>
          <input
            className="border rounded px-2 py-1"
            placeholder="Cardiología, Odontología, ..."
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm">Ordenar por</label>
          <select
            className="border rounded px-2 py-1"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="rating_desc">Mejor calificados</option>
            <option value="rating_asc">Peor calificados</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Cargando doctores…</p>}
      {error && !isLoading && (
        <p className="text-red-600">Error al cargar doctores.</p>
      )}
      {!isLoading && !error && items.length === 0 && (
        <p>No hay doctores que coincidan.</p>
      )}
      {!isLoading && !error && items.length > 0 && (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => {
            const rating = Number((d as DoctorWithRating).rating_avg ?? 0);
            return (
              <li key={d.id} className="border rounded-lg p-4">
                <div className="font-semibold">
                  {d.full_name ?? "Médico(a) sin nombre"}
                </div>
                <div className="text-sm text-gray-600">{d.specialty ?? "Sin especialidad"}</div>
                <div className="text-sm mt-1">⭐ {rating.toFixed(1)}</div>
                <div className="mt-3">
                  <Link className="inline-block rounded border px-3 py-1" href={`/doctors/${d.id}`}>
                    Ver perfil
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Protected>
  );
}


