create table if not exists public.campusforma_leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  interest text not null check (interest in ('bilan', 'vae', 'both')),
  message text not null default '',
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.campusforma_leads enable row level security;
revoke all on table public.campusforma_leads from anon, authenticated;

create or replace function public.campusforma_submit_lead(
  lead_first_name text,
  lead_last_name text,
  lead_email text,
  lead_phone text,
  lead_interest text,
  lead_message text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_lead_id uuid;
  normalized_email text := lower(trim(lead_email));
begin
  if length(trim(lead_first_name)) not between 2 and 100
    or length(trim(lead_last_name)) not between 2 and 100 then
    raise exception 'Invalid name';
  end if;
  if length(normalized_email) > 320 or normalized_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Invalid email address';
  end if;
  if lead_phone !~ '^[+0-9 ()-]{8,25}$' then
    raise exception 'Invalid phone number';
  end if;
  if lead_interest not in ('bilan', 'vae', 'both') then
    raise exception 'Invalid interest';
  end if;
  if length(coalesce(lead_message, '')) > 3000 then
    raise exception 'Message too long';
  end if;

  insert into public.campusforma_leads (first_name, last_name, email, phone, interest, message)
  values (trim(lead_first_name), trim(lead_last_name), normalized_email, trim(lead_phone), lead_interest, trim(coalesce(lead_message, '')))
  returning id into new_lead_id;
  return new_lead_id;
end;
$$;

revoke all on function public.campusforma_submit_lead(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.campusforma_submit_lead(text, text, text, text, text, text) to anon, authenticated;
