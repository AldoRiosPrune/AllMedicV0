"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import Protected from "@/components/Protected";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import Link from "next/link";

type Profile = { full_name: string | null };
type DoctorRow = {
  id: string;
  specialty: string;
  years_experience: number | null;
  rating_avg: number | null;
  rating_count: number | null;
  profiles?: Profile | null;
};

export default function DoctorDetail() {
  const supabase = getSupabaseBrowserClient();
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<DoctorRow | null>(null); // 👈 sin any
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, specialty, years_experience, rating_avg, rating_count, profiles(full_name)")
        .eq("id", id)
        .single<DoctorRow>();
      if (!error) setD(data);
      setLoading(false);
    })();
  }, [id, supabase]);

  if (loading) return <p>Cargando…</p>;
  if (!d) return <p>No encontrado.</p>;

  return (
    <Protected>
      <h1 className="text-2xl font-semibold">{d.profiles?.full_name ?? "Médico(a)"}</h1>
      <p className="text-gray-600">{d.specialty}</p>
      <p className="mt-1">⭐ {Number(d.rating_avg ?? 0).toFixed(1)} ({d.rating_count ?? 0})</p>
      <div className="mt-4">
        <Link className="inline-block rounded border px-4 py-2" href={`/appointments/new?doctor=${d.id}`}>
          Agendar cita
        </Link>
      </div>
    </Protected>
  );
}
