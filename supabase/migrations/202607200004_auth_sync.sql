create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'staff',
    true
  )
  on conflict (id) do nothing;

  insert into public.users (id, email, role, is_active)
  values (new.id, new.email, 'staff', true)
  on conflict (id) do update
  set email = excluded.email,
      role = excluded.role,
      is_active = excluded.is_active,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_auth_user();
