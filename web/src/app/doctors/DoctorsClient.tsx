
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Star, MapPin, Calendar, Phone, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MockApiClient, mockSpecialties } from '@/lib/mockData';
import { Doctor } from '@/lib/api';

const mockApi = new MockApiClient();

export default function DoctorsClient() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const locations = ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'];

  // Cargar doctores
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setLoading(true);
        const filters = {
          search: searchQuery || undefined,
          specialty: selectedSpecialty || undefined,
          location: selectedLocation || undefined
        };
        const data = await mockApi.getDoctors(filters);
        setDoctors(data);
      } catch (error) {
        console.error('Error loading doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [searchQuery, selectedSpecialty, selectedLocation]);

  // Filtrar y ordenar doctores
  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = [...doctors];

    // Ordenar
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'experience':
        filtered.sort((a, b) => b.years_experience - a.years_experience);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [doctors, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Los efectos se encargan de recargar automáticamente
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setSelectedLocation('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Doctores</h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedDoctors.length} doctores encontrados
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar con filtros */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">Filtros</h3>
            
            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nombre o especialidad..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Especialidad */}
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
                  <option value="">Todas</option>
                  {mockSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Ubicación */}
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
                  <option value="">Todas</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Ordenar por */}
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rating">Calificación</option>
                  <option value="experience">Experiencia</option>
                  <option value="name">Nombre</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </form>
          </div>
        </div>

        {/* Lista de doctores */}
        <div className="lg:col-span-3">
          {filteredAndSortedDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron doctores con los filtros seleccionados.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{doctor.name}</h3>
                      <p className="text-blue-600 text-sm">{doctor.specialty}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{doctor.rating}</span>
                          <span>({doctor.rating_count})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{doctor.location}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2">
                        {doctor.years_experience} años de experiencia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Link
                      href={`/doctors/${doctor.id}`}
                      className="flex-1 px-3 py-2 text-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Ver perfil</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/appointments/new?doctor=${doctor.id}`}
                      className="flex-1 px-3 py-2 text-center text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Agendar</span>
                    </Link>
                  </div>
                  
                  {doctor.phone && (
                    <a
                      href={`tel:${doctor.phone}`}
                      className="w-full mt-2 px-3 py-2 text-center text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Llamar ahora</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
