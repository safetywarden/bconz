-- Curated/ingested landscape facts used by CRN-2.0 novelty and competition scoring.

create table if not exists candidate_landscape_facts (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid references research_diseases(id) on delete cascade,
  drug_name text not null,
  drug_normalized_id text,
  fact_type text not null check (fact_type in ('KNOWN_INDICATION','APPROVAL','ACTIVE_TRIAL','COMPETITOR_ASSET','NEGATIVE_TRIAL','SAFETY_SIGNAL','HUMAN_EXPOSURE','IP_CONSTRAINT','OTHER')),
  source_type text,
  source_id text,
  source_url text,
  fact_summary text not null,
  confidence numeric(5,1) not null default 80 check (confidence between 0 and 100),
  observed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_landscape_drug on candidate_landscape_facts(lower(drug_name), fact_type);
create index if not exists idx_landscape_disease_drug on candidate_landscape_facts(disease_id, lower(drug_name), fact_type);
create index if not exists idx_landscape_fact_type on candidate_landscape_facts(fact_type, confidence desc);
