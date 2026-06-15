create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 2 and 120),
  category text,
  context text,
  status text not null default 'draft'
    check (status in ('draft', 'recommended', 'accepted', 'retry_requested')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(trim(label)) between 1 and 120),
  description text,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  unique (decision_id, sort_order),
  foreign key (decision_id, user_id)
    references public.decisions(id, user_id)
    on delete cascade
);

create index if not exists decisions_user_created_at_idx
  on public.decisions (user_id, created_at desc);

create index if not exists options_decision_sort_order_idx
  on public.options (decision_id, sort_order);

alter table public.decisions enable row level security;
alter table public.options enable row level security;

create policy "Users can view their own decisions"
on public.decisions
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own decisions"
on public.decisions
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own decisions"
on public.decisions
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own decisions"
on public.decisions
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can view their own options"
on public.options
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own options"
on public.options
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own options"
on public.options
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own options"
on public.options
for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.create_decision_with_options(
  decision_title text,
  decision_context text,
  option_labels text[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  new_decision_id uuid;
  cleaned_labels text[];
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select array_agg(trim(option_label) order by option_order)
  into cleaned_labels
  from unnest(option_labels) with ordinality
    as submitted_options(option_label, option_order)
  where trim(option_label) <> '';

  if coalesce(array_length(cleaned_labels, 1), 0) < 2 then
    raise exception 'At least two options are required';
  end if;

  insert into public.decisions (user_id, title, context)
  values (
    current_user_id,
    trim(decision_title),
    nullif(trim(decision_context), '')
  )
  returning id into new_decision_id;

  insert into public.options (
    decision_id,
    user_id,
    label,
    sort_order
  )
  select
    new_decision_id,
    current_user_id,
    option_label,
    option_order - 1
  from unnest(cleaned_labels) with ordinality
    as cleaned_options(option_label, option_order);

  return new_decision_id;
end;
$$;

grant execute on function public.create_decision_with_options(
  text,
  text,
  text[]
) to authenticated;
