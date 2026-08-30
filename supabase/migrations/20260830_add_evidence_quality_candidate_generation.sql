-- Evidence quality scoring and generated hypothesis staging.
-- Generated hypotheses remain quarantined until reviewed; no automatic promotion to DRA.

create table if not exists evidence_quality_scores (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references research_evidence(id) on delete cascade,
  source_quality numeric(5,1) not null check (source_quality between 0 and 100),
  study_design_quality numeric(5,1) not null check (study_design_quality between 0 and 100),
  human_relevance numeric(5,1) not null check (human_relevance between 0 and 100),
  recency numeric(5,1) not null check (recency between 0 and 100),
  ontology_resolution numeric(5,1) not null check (ontology_resolution between 0 and 100),
  reproducibility_signal numeric(5,1) not null check (reproducibility_signal between 0 and 100),
  composite_score numeric(5,1) not null check (composite_score between 0 and 100),
  rationale jsonb not null default '{}'::jsonb,
  scoring_version text not null default 'EQS-1.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (evidence_id, scoring_version)
);

create table if not exists generated_candidate_hypotheses (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid not null references research_diseases(id) on delete cascade,
  drug_name text not null,
  drug_normalized_id text,
  gene_name text,
  gene_normalized_id text,
  relation_type text not null,
  hypothesis_summary text not null,
  support_evidence_ids uuid[] not null default '{}',
  evidence_count integer not null default 0,
  mean_evidence_quality numeric(5,1) not null default 0,
  max_evidence_quality numeric(5,1) not null default 0,
  confidence numeric(5,1) not null default 0 check (confidence between 0 and 100),
  novelty_score numeric(5,1) not null default 0 check (novelty_score between 0 and 100),
  generation_score numeric(5,1) not null default 0 check (generation_score between 0 and 100),
  status text not null default 'PROPOSED' check (status in ('PROPOSED','REVIEW','PROMOTED','REJECTED','SUPERSEDED')),
  generated_by text not null default 'RELATION_ENGINE_V1',
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_evidence_quality_score on evidence_quality_scores(composite_score desc);
create index if not exists idx_generated_candidates_disease on generated_candidate_hypotheses(disease_id, generation_score desc);
create index if not exists idx_generated_candidates_status on generated_candidate_hypotheses(status, generation_score desc);
create unique index if not exists uq_generated_candidate_signature
  on generated_candidate_hypotheses(disease_id, lower(drug_name), relation_type, lower(coalesce(gene_name, '')));
