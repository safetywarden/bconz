-- BCONZ enquiry capture table
-- Stores public website enquiries only.
-- Do not use this table for patient-identifiable or clinical data.

create extension if not exists pgcrypto;

create table if not exists public.contact_enquiries (
    id uuid primary key default gen_random_uuid(),

    reference_number text unique not null,

    enquiry_type text not null
        check (
            enquiry_type in (
                'GENERAL',
                'RESEARCH_DATA',
                'DATA_PARTNER'
            )
        ),

    organization_name text,
    organization_type text,

    contact_name text not null,
    job_title text,

    business_email text not null,
    phone text,
    country text,

    area_of_interest text,
    disease_area text,
    research_objective text,

    data_modalities text[],
    data_available text[],
    estimated_timeline text,

    message text,

    preferred_contact_method text,

    privacy_consent boolean not null default false,

    status text not null default 'NEW'
        check (
            status in (
                'NEW',
                'CONTACTED',
                'CLOSED'
            )
        ),

    source_path text,
    user_agent text,

    -- Never store a raw visitor IP address.
    submitted_ip_hash text,

    email_notification_status text not null default 'PENDING'
        check (
            email_notification_status in (
                'PENDING',
                'SENT',
                'FAILED'
            )
        ),

    acknowledgement_status text not null default 'PENDING'
        check (
            acknowledgement_status in (
                'PENDING',
                'SENT',
                'FAILED',
                'NOT_REQUESTED'
            )
        ),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists contact_enquiries_created_at_idx
    on public.contact_enquiries (created_at desc);

create index if not exists contact_enquiries_type_idx
    on public.contact_enquiries (enquiry_type);

create index if not exists contact_enquiries_status_idx
    on public.contact_enquiries (status);

create index if not exists contact_enquiries_email_idx
    on public.contact_enquiries (business_email);

create index if not exists contact_enquiries_reference_idx
    on public.contact_enquiries (reference_number);

-- Automatically maintain updated_at.
create or replace function public.set_contact_enquiry_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists contact_enquiries_set_updated_at
on public.contact_enquiries;

create trigger contact_enquiries_set_updated_at
before update on public.contact_enquiries
for each row
execute function public.set_contact_enquiry_updated_at();

-- Prevent public browser access.
alter table public.contact_enquiries enable row level security;

-- Explicitly remove direct access from public API roles.
revoke all on table public.contact_enquiries from anon;
revoke all on table public.contact_enquiries from authenticated;