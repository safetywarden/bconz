-- BCONZ RDIA/DRA research intelligence schema.
-- Stores public/scientific evidence and research judgments; not identifiable patient data.

create extension if not exists pgcrypto;

create table if not exists research_diseases (
  id uuid primary key default gen_random_uuid(),
  canonical_name text not null unique,
  orpha_id text,
  omim_id text,
  portfolio_status text not null default 'MONITOR' check (portfolio_status in ('ACTIVE','INVESTIGATE','WATCHLIST','MONITOR','RESERVE')),
  portfolio_tier text,
  opportunity_score numeric(5,1) check (opportunity_score between 0 and 100),
  evidence_confidence numeric(5,1) check (evidence_confidence between 0 and 100),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists research_evidence (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid references research_diseases(id) on delete cascade,
  source_type text not null,
  source_id text,
  source_url text,
  title text not null,
  publication_date date,
  evidence_class text not null check (evidence_class in ('E1','E2','E3','E4','E5','E6','E7','E8','H')),
  population text,
  extracted_claim text not null,
  confidence numeric(5,1) check (confidence between 0 and 100),
  review_state text not null default 'AI_EXTRACTED' check (review_state in ('AI_EXTRACTED','INTERNAL_REVIEWED','EXPERT_VALIDATED')),
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists repurposing_candidates (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid not null references research_diseases(id) on delete cascade,
  drug_name text not null,
  responder_hypothesis text,
  biomarker text,
  regimen_concept text,
  dra_score numeric(5,1) check (dra_score between 0 and 100),
  evidence_confidence numeric(5,1) check (evidence_confidence between 0 and 100),
  decision text not null default 'INVESTIGATE' check (decision in ('ADVANCE','INVESTIGATE','KILL','BENCHMARK')),
  hard_gate_failed boolean not null default false,
  hard_gate_reason text,
  preliminary_ip_note text,
  kill_criterion text,
  decisive_next_gate text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (disease_id, drug_name)
);

create table if not exists evidence_change_log (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid references research_diseases(id) on delete cascade,
  candidate_id uuid references repurposing_candidates(id) on delete cascade,
  event_date date not null,
  development text not null,
  impact text not null,
  estimated_score_delta numeric(5,1),
  material_review_required boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_research_evidence_disease on research_evidence(disease_id);
create index if not exists idx_research_evidence_checked on research_evidence(checked_at desc);
create index if not exists idx_repurposing_candidates_disease on repurposing_candidates(disease_id);
create index if not exists idx_change_log_event_date on evidence_change_log(event_date desc);
