-- Ejecutar en Supabase > SQL Editor (se puede ejecutar varias veces sin problema)

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

-- Duración estimada de grabación del vídeo/bloque, en horas (el progreso se mide en horas)
alter table public.videos
  add column if not exists hours numeric(6,2) not null default 0 check (hours >= 0);

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

-- Seguridad: solo usuarios logueados pueden leer/escribir.
-- Los proyectos nuevos de Supabase no dan permisos automáticos sobre las tablas
-- nuevas, así que se conceden explícitamente (solo a usuarios logueados, no a anon).
revoke all on public.videos from anon;
grant select, insert, update, delete on public.videos to authenticated;

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
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'videos'
  ) then
    alter publication supabase_realtime add table public.videos;
  end if;
end $$;
