
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message); else alert("Revisa tu correo ✉️");
  };
  return (
    <form onSubmit={onSubmit} className="p-6">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
      <button>Enviar magic link</button>
    </form>
  );
}
