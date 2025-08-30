"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function Protected({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowserClient();
  const [ready, setReady] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuth(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuth(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (!ready) return <p>Cargando…</p>;
  if (!isAuth) return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Necesitas iniciar sesión</h2>
      <a className="underline" href="/login">Ir a login</a>
    </div>
  );

  return <>{children}</>;
}
