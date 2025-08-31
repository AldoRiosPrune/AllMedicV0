
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  rating_count: number;
  years_experience: number;
  phone?: string;
  email?: string;
  description?: string;
  image?: string;
  available_times?: string[];
}

export interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface CreateAppointmentData {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  doctor_id: string;
  date: string;
  time: string;
  reason: string;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Doctores
  async getDoctors(filters?: { specialty?: string; location?: string; search?: string }): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (filters?.specialty) params.append('specialty', filters.specialty);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    return this.request<Doctor[]>(`/doctors${queryString ? `?${queryString}` : ''}`);
  }

  async getDoctor(id: string): Promise<Doctor> {
    return this.request<Doctor>(`/doctors/${id}`);
  }

  // Citas
  async getAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('/appointments');
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelAppointment(id: string): Promise<void> {
    return this.request<void>(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  // Especialidades
  async getSpecialties(): Promise<string[]> {
    return this.request<string[]>('/specialties');
  }

  // Búsqueda y recomendaciones
  async searchDoctors(query: string): Promise<Doctor[]> {
    return this.request<Doctor[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  async getRecommendations(symptoms?: string[]): Promise<Doctor[]> {
    const params = new URLSearchParams();
    if (symptoms?.length) {
      symptoms.forEach(symptom => params.append('symptoms', symptom));
    }
    return this.request<Doctor[]>(`/recommendations?${params.toString()}`);
  }
}

export const apiClient = new ApiClient();
