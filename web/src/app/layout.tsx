// web/src/app/layout.tsx
import "./globals.css";
import Link from "next/link"; // 👈 importa Link

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold text-blue-600">HealthFind</Link>
            <Link href="/" className="text-sm hover:text-blue-600">Inicio</Link>
            <Link href="/services" className="text-sm hover:text-blue-600">Servicios</Link>
            <Link href="/doctors" className="text-sm hover:text-blue-600">Nosotros</Link>
            <Link href="/contact" className="text-sm hover:text-blue-600">Contacto</Link>
            <button className="ml-auto px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              Iniciar sesión
            </button>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
