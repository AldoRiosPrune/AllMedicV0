-- Asegura RLS en storage.objects (suele venir activado, pero por si acaso)
alter table if exists storage.objects enable row level security;

-- === Buckets ===
insert into storage.buckets (id, name, public) values ('public', 'public', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('records', 'records', false)
on conflict (id) do nothing;

-- === Policies para Storage ===
-- Nota de convención de rutas:
--  - En 'records' guardaremos archivos bajo: records/{patient_id}/... 

-- Bucket 'public': lectura pública para todos, escrituras solo admin autenticado
create policy if not exists "public read"
on storage.objects for select
using (bucket_id = 'public');

create policy if not exists "admin write public"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy if not exists "admin update public"
on storage.objects for update to authenticated
using (
  bucket_id = 'public'
  and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Bucket 'records': lectura para el paciente dueño, el doctor con cita confirmada/completada o admin
create policy if not exists "read records by owner/doctor"
on storage.objects for select to authenticated
using (
  bucket_id = 'records'
  and (
    -- path: records/{patient_id}/...
    (split_part(name,'/',2)::uuid = auth.uid())
    or exists (
      select 1 from public.appointments a
      where a.patient_id = split_part(name,'/',2)::uuid
        and a.doctor_id = auth.uid()
        and a.status in ('confirmed','completed')
    )
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  )
);

-- Sólo el paciente dueño puede escribir a su carpeta en 'records'
create policy if not exists "patient write own records"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'records'
  and split_part(name,'/',2)::uuid = auth.uid()
);
