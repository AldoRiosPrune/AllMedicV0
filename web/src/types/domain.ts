// Domain types for the web app

// Roles
export type UserRole = "patient" | "doctor" | "admin";

// Common aliases
export type ID = string; // UUID string
export type ISODateTime = string; // ISO-8601 date-time string
export type Nullable<T> = T | null;

// Reusable enums/unions
export type AppointmentStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "canceled";

export type Gender = "male" | "female" | "other" | "unspecified";

// Optional helpers
export interface WithTimestamps {
  created_at?: ISODateTime;
  updated_at?: ISODateTime;
}

// Core entities
export interface Doctor extends WithTimestamps {
  id: ID;
  full_name: Nullable<string>;
  specialty: string;
  years_experience: Nullable<number>;
  rating_avg: number;
  rating_count: number;
}

export interface Patient extends WithTimestamps {
  id: ID;
  full_name: Nullable<string>;
  email?: Nullable<string>;
  phone?: Nullable<string>;
  date_of_birth?: Nullable<string>; // ISO date (YYYY-MM-DD)
  gender?: Nullable<Gender>;
}

export interface Appointment extends WithTimestamps {
  id: ID;
  doctor_id: ID;
  patient_id: ID;
  starts_at: ISODateTime; // ISO
  ends_at: ISODateTime;
  status: AppointmentStatus;
}

// Unificado de usuario con rol y referencias
export interface User extends WithTimestamps {
  id: ID;
  email: string;
  role: UserRole;
  full_name?: Nullable<string>;
  avatar_url?: Nullable<string>;
  // IDs relacionales (útiles para consultas y payloads ligeros)
  doctor_id?: Nullable<ID>; // si role === "doctor"
  patient_id?: Nullable<ID>; // si role === "patient"
  // Objetos embebidos (opcional, cuando se expanden relaciones)
  doctor?: Nullable<Doctor>;
  patient?: Nullable<Patient>;
}

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
};

// Blog content blocks
export type BlogBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'p';  text: string }
  | { type: 'quote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; language?: string; code: string }
  | { type: 'image'; url: string; alt?: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  content_json: BlogBlock[];
  tags?: string[];
  created_at?: string;
};
