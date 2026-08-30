-- Candidate ranking / novelty engine v2.
-- Adds cross-disease aggregation, readiness, competition and preliminary DRA routing signals.

alter table generated_candidate_hypotheses
  add column if not exists cross_disease_support integer not null default 0,
  add column if not exists negative_evidence_penalty numeric(5,1) not null default 0 check (negative_evidence_penalty between 0 and 100),
  add column if not exists competition_penalty numeric(5,1) not null default 0 check (competition_penalty between 0 and 100),
  add column if not exists human_exposure_score numeric(5,1) not null default 0 check (human_exposure_score between 0 and 100),
  add column if not exists development_readiness_score numeric(5,1) not null default 0 check (development_readiness_score between 0 and 100),
  add column if not exists preliminary_dra_score numeric(5,1) not null default 0 check (preliminary_dra_score between 0 and 100),
  add column if not exists routing_decision text not null default 'HOLD' check (routing_decision in ('FAST_TRACK_DRA','DRA_REVIEW','HOLD','DEPRIORITIZE')),
  add column if not exists ranking_version text not null default 'CRN-2.0',
  add column if not exists ranking_rationale jsonb not null default '{}'::jsonb;

create table if not exists drug_cross_disease_signals (
  id uuid primary key default gen_random_uuid(),
  drug_key text not null,
  drug_name text not null,
  drug_normalized_id text,
  disease_count integer not null default 0,
  evidence_count integer not null default 0,
  positive_signal_count integer not null default 0,
  negative_signal_count integer not null default 0,
  mean_evidence_quality numeric(5,1) not null default 0,
  human_exposure_score numeric(5,1) not null default 0,
  updated_at timestamptz not null default now(),
  unique (drug_key)
);

create index if not exists idx_generated_candidates_prelim_dra on generated_candidate_hypotheses(preliminary_dra_score desc);
create index if not exists idx_generated_candidates_route on generated_candidate_hypotheses(routing_decision, preliminary_dra_score desc);
create index if not exists idx_cross_disease_signal_score on drug_cross_disease_signals(disease_count desc, mean_evidence_quality desc);
