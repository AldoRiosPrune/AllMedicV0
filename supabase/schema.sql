-- Extensiones necesarias
create extension if not exists "pgcrypto";

-- Tabla de perfiles (pacientes)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Tabla de doctores
create table if not exists public.doctors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  specialty text,
  license_number text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Tabla de citas
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  constraint chk_time_window check (end_at > start_at)
);

-- Índices básicos
create index if not exists idx_appointments_patient on public.appointments (patient_id);
create index if not exists idx_appointments_doctor on public.appointments (doctor_id);
create index if not exists idx_appointments_doctor_start on public.appointments (doctor_id, start_at);

-- RLS: cada usuario ve únicamente sus citas
alter table public.appointments enable row level security;
alter table public.appointments force row level security;

drop policy if exists "Patients can select own appointments" on public.appointments;
create policy "Patients can select own appointments"
  on public.appointments
  for select
  to authenticated
  using (patient_id = auth.uid());

drop policy if exists "Doctors can select own appointments" on public.appointments;
create policy "Doctors can select own appointments"
  on public.appointments
  for select
  to authenticated
  using (doctor_id = auth.uid());