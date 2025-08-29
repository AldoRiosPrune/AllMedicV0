-- Requerido para gen_random_uuid()
create extension if not exists pgcrypto;

-- Perfiles base (Auth → public.profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('patient','doctor','admin')) default 'patient',
  full_name text,
  created_at timestamptz default now()
);

-- Médicos
create table if not exists public.doctors (
  id uuid primary key references public.profiles(id) on delete cascade,
  specialty text not null,
  license_id text,          -- cédula
  years_experience int default 0,
  lat double precision,
  lng double precision,
  rating_avg numeric(3,2) default 0,
  rating_count int default 0
);

-- Pacientes
create table if not exists public.patients (
  id uuid primary key references public.profiles(id) on delete cascade,
  birthdate date,
  blood_type text,
  notes text
);

-- Citas
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text check (status in ('requested','confirmed','completed','canceled')) default 'requested',
  created_at timestamptz default now(),
  check (ends_at > starts_at)
);
create index if not exists appointments_doctor_startsat_idx on public.appointments (doctor_id, starts_at desc);

-- Ratings
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  score int check (score between 1 and 5) not null,
  comment text,
  created_at timestamptz default now(),
  unique (doctor_id, patient_id) -- un rating por paciente/doctor
);

-- Expediente (entradas)
create table if not exists public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  entry_type text,          -- "consulta", "laboratorio", "imagen", etc.
  notes text,
  file_path text,           -- ruta en Storage (bucket privado)
  created_at timestamptz default now()
);
create index if not exists medical_records_patient_created_idx on public.medical_records (patient_id, created_at desc);

-- Blog
create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  content_md text not null,
  tags text[],
  author_id uuid references public.profiles(id) on delete set null,
  published_at timestamptz
);

-- RLS
alter table public.profiles        enable row level security;
alter table public.doctors         enable row level security;
alter table public.patients        enable row level security;
alter table public.appointments    enable row level security;
alter table public.ratings         enable row level security;
alter table public.medical_records enable row level security;
alter table public.blog_posts      enable row level security;

-- Helper para UID
create or replace function public.uid() returns uuid
language sql stable as $$
  select auth.uid()
$$;

-- POLICIES

-- profiles: cada quien ve su perfil, admin ve todo
create policy "read own profile or admin"
on public.profiles for select
using (
  uid() = id or
  exists (select 1 from public.profiles p where p.id = uid() and p.role = 'admin')
);

create policy "update own profile"
on public.profiles for update
using (uid() = id);

-- doctors: público puede leer (búsqueda), cada doctor actualiza su info, admin full
create policy "read doctors public"
on public.doctors for select using (true);

create policy "update own doctor"
on public.doctors for update
using (uid() = id);

-- patients: solo el dueño o el doctor (cuando exista cita confirmada) o admin
create policy "read own patient or assigned doctor"
on public.patients for select
using (
  uid() = id or
  exists (
    select 1 from public.appointments a
    where a.patient_id = public.patients.id
      and a.doctor_id = uid()
      and a.status in ('confirmed','completed')
  ) or
  exists (select 1 from public.profiles p where p.id = uid() and p.role='admin')
);

create policy "update own patient"
on public.patients for update
using (uid() = id);

-- appointments: paciente y doctor involucrados pueden leer/crear/actualizar; admin también
create policy "read own appointments"
on public.appointments for select
using (
  uid() = patient_id or
  uid() = doctor_id or
  exists (select 1 from public.profiles p where p.id=uid() and p.role='admin')
);

create policy "create as patient"
on public.appointments for insert
with check (uid() = patient_id);

create policy "update by participants"
on public.appointments for update
using (
  uid() = patient_id or
  uid() = doctor_id or
  exists (select 1 from public.profiles p where p.id=uid() and p.role='admin')
);

-- ratings: lectura pública; inserta solo paciente con cita completada
create policy "read ratings public"
on public.ratings for select using (true);

create policy "insert rating if completed appointment"
on public.ratings for insert
with check (
  uid() = patient_id and
  exists (
    select 1 from public.appointments a
    where a.patient_id = uid()
      and a.doctor_id = public.ratings.doctor_id
      and a.status = 'completed'
  )
);

-- medical_records: dueño, doctor asignado (cita confirmada/completada), o admin
create policy "read medical records by owner, assigned doctor or admin"
on public.medical_records for select
using (
  uid() = patient_id or
  exists (
    select 1 from public.appointments a
    where a.patient_id = public.medical_records.patient_id
      and a.doctor_id = uid()
      and a.status in ('confirmed','completed')
  ) or
  exists (select 1 from public.profiles p where p.id=uid() and p.role='admin')
);

create policy "insert medical record by patient"
on public.medical_records for insert
with check (uid() = patient_id);

-- blog_posts: lectura pública; escribe/actualiza solo admin
create policy "read blog public"
on public.blog_posts for select using (true);

create policy "admin can write blog"
on public.blog_posts for insert
with check (
  exists (select 1 from public.profiles p where p.id=uid() and p.role='admin')
);

create policy "admin can update blog"
on public.blog_posts for update
using (
  exists (select 1 from public.profiles p where p.id=uid() and p.role='admin')
);
