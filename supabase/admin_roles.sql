-- public.admin_users.role è l'unica fonte di verità per i permessi admin.
-- I metadata di Supabase Authentication non vengono letti dall'applicazione.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'client')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Nessuna policy pubblica: la tabella viene letta soltanto dal server tramite
-- la service role key. Un utente autenticato non può assegnarsi un ruolo.
insert into public.admin_users (user_id, role)
values
  ('bf7f0905-ff34-435c-8699-36c65ee391e3', 'owner'),
  ('4966e7de-a595-4315-a2bc-a88d1e000342', 'client')
on conflict (user_id) do update set role = excluded.role;
