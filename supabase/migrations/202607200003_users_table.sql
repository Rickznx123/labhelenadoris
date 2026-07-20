create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null unique,
  role public.profile_role not null default 'staff',
  is_active boolean not null default true
);

create index if not exists idx_users_email on public.users (email);
create index if not exists idx_users_role on public.users (role);

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row
execute procedure public.set_updated_at();

alter table public.users enable row level security;

create policy "admin_read_users"
on public.users
for select
to authenticated
using (exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.role = 'admin' and p.is_active = true
));

create policy "admin_manage_users"
on public.users
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
