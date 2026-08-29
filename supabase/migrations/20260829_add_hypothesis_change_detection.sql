-- Hypothesis-level impact review. Proposed changes never mutate RDIA/DRA scores automatically.

create table if not exists hypothesis_change_events (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references repurposing_candidates(id) on delete cascade,
  disease_id uuid not null references research_diseases(id) on delete cascade,
  source_type text not null,
  source_id text not null,
  direction text not null check (direction in ('STRENGTHEN','WEAKEN','KILL','NEUTRAL')),
  confidence numeric(5,1) not null check (confidence between 0 and 100),
  proposed_dra_delta numeric(5,1) not null default 0,
  proposed_rdia_delta numeric(5,1) not null default 0,
  hard_gate_candidate boolean not null default false,
  rationale text not null,
  matched_signals jsonb not null default '[]'::jsonb,
  requires_human_review boolean not null default false,
  review_status text not null default 'PENDING' check (review_status in ('PENDING','APPROVED','REJECTED','SUPERSEDED')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (candidate_id, source_type, source_id)
);

create index if not exists idx_hypothesis_change_candidate on hypothesis_change_events(candidate_id, created_at desc);
create index if not exists idx_hypothesis_change_review on hypothesis_change_events(review_status, requires_human_review, created_at desc);
create index if not exists idx_hypothesis_change_direction on hypothesis_change_events(direction, created_at desc);
