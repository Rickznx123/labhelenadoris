create extension if not exists pgcrypto;

create table if not exists public.exam_results (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  patient_cpf varchar(11) not null,
  birth_date date not null,
  exam_name text not null,
  exam_date date not null,
  pdf_path text not null,
  created_at timestamptz not null default now()
);

alter table public.exam_results
  drop constraint if exists exam_results_patient_cpf_digits_check;

alter table public.exam_results
  add constraint exam_results_patient_cpf_digits_check
  check (patient_cpf ~ '^[0-9]{11}$');

create index if not exists idx_exam_results_cpf_birth_date
  on public.exam_results (patient_cpf, birth_date);

create index if not exists idx_exam_results_exam_date
  on public.exam_results (exam_date desc);

alter table public.exam_results enable row level security;

insert into storage.buckets (id, name, public)
values ('exam-results', 'exam-results', false)
on conflict (id) do update
set
  name = excluded.name,
  public = false;
