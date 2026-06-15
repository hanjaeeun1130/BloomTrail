-- BloomTrail saved routes table and RLS policies.
-- Paste this file into the Supabase SQL Editor.

create table if not exists public.saved_routes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  arboretum_name text not null,
  route_name text not null,
  duration text not null,
  theme text not null,
  companion text not null,
  zones text[] not null default '{}',
  created_at timestamp with time zone not null default now()
);

create index if not exists saved_routes_user_id_idx
on public.saved_routes (user_id);

alter table public.saved_routes enable row level security;

-- SELECT: users can read only their own saved routes.
drop policy if exists "Users can view their own saved routes" on public.saved_routes;
create policy "Users can view their own saved routes"
on public.saved_routes
for select
to authenticated
using (auth.uid() = user_id);

-- INSERT: users can insert only rows whose user_id is their own auth.uid().
drop policy if exists "Users can insert their own saved routes" on public.saved_routes;
create policy "Users can insert their own saved routes"
on public.saved_routes
for insert
to authenticated
with check (auth.uid() = user_id);

-- UPDATE: users can update only their own saved routes.
drop policy if exists "Users can update their own saved routes" on public.saved_routes;
create policy "Users can update their own saved routes"
on public.saved_routes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- DELETE: users can delete only their own saved routes.
drop policy if exists "Users can delete their own saved routes" on public.saved_routes;
create policy "Users can delete their own saved routes"
on public.saved_routes
for delete
to authenticated
using (auth.uid() = user_id);
