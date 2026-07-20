insert into storage.buckets (id, name, public)
values ('exam-pdfs', 'exam-pdfs', false)
on conflict (id) do nothing;

create policy "admin_staff_read_private_exam_pdfs"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'exam-pdfs'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_active = true
  )
);

create policy "admin_staff_insert_private_exam_pdfs"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'exam-pdfs'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
  )
);

create policy "admin_staff_delete_private_exam_pdfs"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'exam-pdfs'
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'staff') and p.is_active = true
  )
);
