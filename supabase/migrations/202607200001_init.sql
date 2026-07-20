create extension if not exists pgcrypto;

create type public.sex_type as enum ('M', 'F', 'O');
create type public.exam_status as enum ('pending', 'completed');
create type public.profile_role as enum ('admin', 'staff');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  cpf varchar(11) not null unique,
  birth_date date not null,
  phone text,
  email text,
  sex public.sex_type not null,
  notes text
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null,
  role public.profile_role not null default 'staff',
  is_active boolean not null default true,
  phone text,
  avatar_url text
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  exam_type text not null,
  exam_date date not null,
  status public.exam_status not null default 'pending',
  pdf_path text,
  notes text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  changed_by uuid references public.profiles (id) on delete set null
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lab_name text not null,
  phone text,
  whatsapp text,
  address text,
  logo_url text,
  instagram text,
  facebook text,
  linkedin text
);

create table if not exists public.download_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  ip_address text,
  user_agent text,
  downloaded_by uuid references public.profiles (id) on delete set null,
  requested_by_cpf varchar(11)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id uuid references public.profiles (id) on delete set null,
  actor_role text,
  action text not null,
  table_name text not null,
  record_id uuid,
  meta jsonb not null default '{}'::jsonb,
  ip_address text
);

create index if not exists idx_patients_full_name on public.patients using gin (to_tsvector('portuguese', full_name));
create index if not exists idx_patients_cpf on public.patients (cpf);
create index if not exists idx_exams_patient_id on public.exams (patient_id);
create index if not exists idx_exams_status on public.exams (status);
create index if not exists idx_exams_date on public.exams (exam_date desc);
create index if not exists idx_download_logs_exam_id on public.download_logs (exam_id);
create index if not exists idx_audit_logs_table_name on public.audit_logs (table_name);

drop trigger if exists patients_set_updated_at on public.patients;
create trigger patients_set_updated_at
before update on public.patients
for each row
execute procedure public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

drop trigger if exists exams_set_updated_at on public.exams;
create trigger exams_set_updated_at
before update on public.exams
for each row
execute procedure public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
before update on public.settings
for each row
execute procedure public.set_updated_at();

alter table public.patients enable row level security;
alter table public.exams enable row level security;
alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.download_logs enable row level security;
alter table public.audit_logs enable row level security;

create policy "admin_staff_read_patients"
on public.patients
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
));

create policy "admin_staff_write_patients"
on public.patients
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
));

create policy "admin_staff_read_exams"
on public.exams
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
));

create policy "admin_staff_write_exams"
on public.exams
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
));

create policy "authenticated_read_profiles"
on public.profiles
for select
to authenticated
using (id = auth.uid() or exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
));

create policy "admin_manage_profiles"
on public.profiles
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
));

create policy "authenticated_read_settings"
on public.settings
for select
to authenticated
using (true);

create policy "admin_manage_settings"
on public.settings
for all
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
))
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
));

create policy "admin_staff_read_download_logs"
on public.download_logs
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
));

create policy "admin_staff_insert_download_logs"
on public.download_logs
for insert
to authenticated
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_active = true
));

create policy "admin_staff_read_audit_logs"
on public.audit_logs
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
));

create policy "admin_staff_insert_audit_logs"
on public.audit_logs
for insert
to authenticated
with check (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
));
