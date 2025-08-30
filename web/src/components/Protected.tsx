"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function Protected({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseBrowserClient();
  const [ready, setReady] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const res = await supabase.auth.getSession();
      setIsAuth(!!res.data.session);
      setReady(true);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setIsAuth(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  if (!ready) return <p>Cargando…</p>;
  if (!isAuth)
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Necesitas iniciar sesión</h2>
        <a className="underline" href="/login">
          Ir a login
        </a>
      </div>
    );

  return <>{children}</>;
}
