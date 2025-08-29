"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function Login() {
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    alert(error ? error.message : "Revisa tu correo ✉️");
  }

  return (
    <form onSubmit={handleLogin} className="p-6 flex flex-col gap-3 max-w-sm">
      <input
        type="email"
        value={email}
        placeholder="you@example.com"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Enviar magic link
      </button>
    </form>
  );
}
