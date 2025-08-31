// web/src/app/layout.tsx
"use client"

import { Geist, Geist_Mono } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import "./globals.css"
import Link from "next/link"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white text-gray-900`}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </body>
    </html>
  )
}