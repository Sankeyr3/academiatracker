-- Ejecutar en Supabase > SQL Editor

create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  module      text not null default '',
  position    double precision not null default 0,
  status      text not null default 'sin_grabar'
              check (status in ('sin_grabar', 'grabado', 'editando', 'editado')),
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) default auth.uid()
);

create index if not exists videos_position_idx on public.videos (position);

-- updated_at / updated_by automáticos
create or replace function public.touch_video()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end $$;

drop trigger if exists videos_touch on public.videos;
create trigger videos_touch before update on public.videos
for each row execute function public.touch_video();

-- Seguridad: solo usuarios logueados pueden leer/escribir
alter table public.videos enable row level security;

drop policy if exists "auth read"   on public.videos;
drop policy if exists "auth insert" on public.videos;
drop policy if exists "auth update" on public.videos;
drop policy if exists "auth delete" on public.videos;

create policy "auth read"   on public.videos for select to authenticated using (true);
create policy "auth insert" on public.videos for insert to authenticated with check (true);
create policy "auth update" on public.videos for update to authenticated using (true) with check (true);
create policy "auth delete" on public.videos for delete to authenticated using (true);

-- Tiempo real (para ver los cambios del otro al instante)
alter publication supabase_realtime add table public.videos;
