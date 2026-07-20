insert into storage.buckets (id, name, public)
values ('exam-results', 'exam-results', false)
on conflict (id) do update
set
	name = excluded.name,
	public = false;
