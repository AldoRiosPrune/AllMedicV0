// web/src/app/layout.tsx
import "./globals.css";
import Link from "next/link"; // 👈 importa Link

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold">AllMedic</Link>
            <Link href="/doctors" className="text-sm">Doctores</Link>
            <Link href="/appointments" className="text-sm">Citas</Link>
            <Link href="/login" className="ml-auto text-sm">Login</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
