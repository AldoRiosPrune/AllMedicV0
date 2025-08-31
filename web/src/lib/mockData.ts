
import { Doctor, Appointment } from './api';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. María González',
    specialty: 'Cardiología',
    location: 'Ciudad de México',
    rating: 4.8,
    rating_count: 127,
    years_experience: 15,
    phone: '+52 55 1234 5678',
    email: 'maria.gonzalez@healthfind.com',
    description: 'Especialista en cardiología con amplia experiencia en cirugía cardiovascular y tratamientos preventivos.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    available_times: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: '2',
    name: 'Dr. Carlos Ruiz',
    specialty: 'Neurología',
    location: 'Guadalajara',
    rating: 4.9,
    rating_count: 89,
    years_experience: 12,
    phone: '+52 33 9876 5432',
    email: 'carlos.ruiz@healthfind.com',
    description: 'Neurólogo especializado en trastornos del movimiento y enfermedades neurodegenerativas.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    available_times: ['08:00', '09:00', '11:00', '13:00', '15:00', '17:00']
  },
  {
    id: '3',
    name: 'Dra. Ana Martínez',
    specialty: 'Pediatría',
    location: 'Monterrey',
    rating: 4.7,
    rating_count: 156,
    years_experience: 18,
    phone: '+52 81 1111 2222',
    email: 'ana.martinez@healthfind.com',
    description: 'Pediatra con especialización en desarrollo infantil y medicina preventiva.',
    image: 'https://images.unsplash.com/photo-1594824475062-d78ac8c9f5c5?w=300&h=300&fit=crop&crop=face',
    available_times: ['09:00', '10:00', '12:00', '14:00', '16:00', '17:00']
  },
  {
    id: '4',
    name: 'Dr. Roberto Silva',
    specialty: 'Dermatología',
    location: 'Ciudad de México',
    rating: 4.6,
    rating_count: 94,
    years_experience: 10,
    phone: '+52 55 3333 4444',
    email: 'roberto.silva@healthfind.com',
    description: 'Dermatólogo especializado en tratamientos estéticos y medicina dermatológica.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&crop=face',
    available_times: ['10:00', '11:00', '13:00', '15:00', '16:00', '18:00']
  },
  {
    id: '5',
    name: 'Dra. Laura Hernández',
    specialty: 'Ginecología',
    location: 'Puebla',
    rating: 4.9,
    rating_count: 112,
    years_experience: 14,
    phone: '+52 22 5555 6666',
    email: 'laura.hernandez@healthfind.com',
    description: 'Ginecóloga obsteta con especialización en medicina reproductiva.',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=300&fit=crop&crop=face',
    available_times: ['08:00', '09:00', '11:00', '14:00', '15:00', '16:00']
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patient_name: 'Juan Pérez',
    patient_email: 'juan.perez@email.com',
    patient_phone: '+52 55 9999 8888',
    doctor_id: '1',
    doctor_name: 'Dr. María González',
    date: '2024-01-15',
    time: '10:00',
    reason: 'Revisión cardiológica general',
    status: 'confirmed',
    created_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    patient_name: 'María López',
    patient_email: 'maria.lopez@email.com',
    patient_phone: '+52 33 7777 6666',
    doctor_id: '2',
    doctor_name: 'Dr. Carlos Ruiz',
    date: '2024-01-20',
    time: '14:00',
    reason: 'Consulta por dolores de cabeza frecuentes',
    status: 'pending',
    created_at: '2024-01-12T14:30:00Z'
  }
];

export const mockSpecialties = [
  'Cardiología',
  'Neurología',
  'Pediatría',
  'Dermatología',
  'Ginecología',
  'Oftalmología',
  'Traumatología',
  'Psiquiatría',
  'Endocrinología',
  'Gastroenterología'
];

// Simulador de API con datos mock
export class MockApiClient {
  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getDoctors(filters?: { specialty?: string; location?: string; search?: string }): Promise<Doctor[]> {
    await this.delay();
    let doctors = [...mockDoctors];

    if (filters?.specialty) {
      doctors = doctors.filter(d => d.specialty.toLowerCase().includes(filters.specialty!.toLowerCase()));
    }
    if (filters?.location) {
      doctors = doctors.filter(d => d.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      doctors = doctors.filter(d => 
        d.name.toLowerCase().includes(search) ||
        d.specialty.toLowerCase().includes(search) ||
        d.description?.toLowerCase().includes(search)
      );
    }

    return doctors;
  }

  async getDoctor(id: string): Promise<Doctor> {
    await this.delay();
    const doctor = mockDoctors.find(d => d.id === id);
    if (!doctor) throw new Error('Doctor not found');
    return doctor;
  }

  async getAppointments(): Promise<Appointment[]> {
    await this.delay();
    return [...mockAppointments];
  }

  async createAppointment(data: any): Promise<Appointment> {
    await this.delay();
    const doctor = mockDoctors.find(d => d.id === data.doctor_id);
    if (!doctor) throw new Error('Doctor not found');

    const appointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      doctor_name: doctor.name,
      status: 'pending' as const,
      created_at: new Date().toISOString()
    };

    mockAppointments.push(appointment);
    return appointment;
  }

  async cancelAppointment(id: string): Promise<void> {
    await this.delay();
    const appointment = mockAppointments.find(a => a.id === id);
    if (appointment) {
      appointment.status = 'cancelled';
    }
  }

  async getSpecialties(): Promise<string[]> {
    await this.delay();
    return [...mockSpecialties];
  }

  async searchDoctors(query: string): Promise<Doctor[]> {
    return this.getDoctors({ search: query });
  }

  async getRecommendations(): Promise<Doctor[]> {
    await this.delay();
    return mockDoctors.slice(0, 3);
  }
}
