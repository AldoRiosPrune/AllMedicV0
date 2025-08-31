"use client";

import { useState } from 'react';
import { Search, Heart, Shield, Clock, Star, MapPin, Calendar, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockDoctors, mockSpecialties } from '@/lib/mockData';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedSpecialty) params.append('specialty', selectedSpecialty);
    if (selectedLocation) params.append('location', selectedLocation);

    router.push(`/doctors?${params.toString()}`);
  };

  const handleSpecialtyClick = (specialty: string) => {
    router.push(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  const featuredDoctors = mockDoctors.slice(0, 3);
  const locations = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-white rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">
          Encuentra el <span className="text-blue-600">doctor perfecto</span> para ti
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conectamos a pacientes con los mejores profesionales de la salud.
          Agenda tu cita de manera fácil y segura.
        </p>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar doctor o especialidad
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej: Cardiología, Dr. García..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                Especialidad
              </label>
              <select
                id="specialty"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las especialidades</option>
                {mockSpecialties.map((specialty) => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación
              </label>
              <select
                id="location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las ubicaciones</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Características */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Doctores Verificados</h3>
          <p className="text-gray-600">
            Todos nuestros profesionales están certificados y verificados para garantizar la mejor atención.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Seguro y Confiable</h3>
          <p className="text-gray-600">
            Tu información está protegida con los más altos estándares de seguridad y privacidad.
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Citas al Instante</h3>
          <p className="text-gray-600">
            Agenda tu cita en línea de forma rápida y recibe confirmación inmediata.
          </p>
        </div>
      </section>

      {/* Especialidades populares */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Especialidades Populares</h2>
          <Link href="/doctors" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>Ver todas</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {mockSpecialties.slice(0, 10).map((specialty) => (
            <button
              key={specialty}
              onClick={() => handleSpecialtyClick(specialty)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-sm font-medium">{specialty}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Doctores destacados */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Doctores Destacados</h2>
          <Link href="/doctors" className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doctor) => (
            <div key={doctor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-blue-600 text-sm">{doctor.specialty}</p>

                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{doctor.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="flex-1 px-3 py-2 text-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Ver perfil
                    </Link>
                    <Link
                      href={`/appointments/new?doctor=${doctor.id}`}
                      className="flex-1 px-3 py-2 text-center text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">¿Necesitas atención médica urgente?</h2>
        <p className="text-xl mb-6 opacity-90">
          Encuentra doctores disponibles las 24 horas para consultas de emergencia.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/doctors?available=now"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Ver doctores disponibles
          </Link>
          <a
            href="tel:911"
            className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Phone className="w-5 h-5" />
            <span>Llamar emergencias</span>
          </a>
        </div>
      </section>
    </div>
  );
}