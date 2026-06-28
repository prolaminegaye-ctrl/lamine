create table if not exists public.campusforma_contacts (
  id uuid primary key default gen_random_uuid(),
  request_type text not null check (request_type in ('contact', 'enterprise', 'partner', 'recruitment')),
  full_name text not null,
  email text not null,
  phone text,
  organization text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.campusforma_contacts enable row level security;
revoke all on table public.campusforma_contacts from anon, authenticated;

create or replace function public.campusforma_submit_contact(
  contact_request_type text,
  contact_full_name text,
  contact_email text,
  contact_phone text default '',
  contact_organization text default '',
  contact_message text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_contact_id uuid;
begin
  if contact_request_type not in ('contact', 'enterprise', 'partner', 'recruitment') then
    raise exception 'Invalid request type';
  end if;

  if length(trim(contact_full_name)) < 2
    or length(trim(contact_full_name)) > 120
    or position('@' in contact_email) < 2
    or length(trim(contact_email)) > 254
    or length(trim(contact_phone)) > 40
    or length(trim(contact_organization)) > 160
    or length(trim(contact_message)) < 10
    or length(trim(contact_message)) > 4000 then
    raise exception 'Invalid contact details';
  end if;

  insert into public.campusforma_contacts (request_type, full_name, email, phone, organization, message)
  values (
    contact_request_type,
    trim(contact_full_name),
    lower(trim(contact_email)),
    nullif(trim(contact_phone), ''),
    nullif(trim(contact_organization), ''),
    trim(contact_message)
  )
  returning id into new_contact_id;

  return new_contact_id;
end;
$$;

revoke all on function public.campusforma_submit_contact(text, text, text, text, text, text) from public;
grant execute on function public.campusforma_submit_contact(text, text, text, text, text, text) to anon, authenticated;
