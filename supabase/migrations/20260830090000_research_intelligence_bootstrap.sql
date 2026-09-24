-- BCONZ Research Intelligence bootstrap schema.
-- Consolidates RDIA, DRA, PubTator3, hypothesis registry, ontology, batching,
-- evidence quality, candidate generation, CRN-2.0 ranking and governance.
-- Stores public/scientific research evidence; not identifiable patient data.

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

create unique index if not exists uq_research_evidence_source
  on research_evidence(disease_id, source_type, source_id)
  where source_id is not null;
create index if not exists idx_research_evidence_disease on research_evidence(disease_id);
create index if not exists idx_research_evidence_checked on research_evidence(checked_at desc);

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
create index if not exists idx_repurposing_candidates_disease on repurposing_candidates(disease_id);

create table if not exists evidence_change_log (
  id uuid primary key default gen_random_uuid(),
  disease_id uuid references research_diseases(id) on delete cascade,
  candidate_id uuid references repurposing_candidates(id) on delete cascade,
  event_date date not null,
  development text not null,
  impact text not null,
  estimated_score_delta numeric(5,1),
  material_review_required boolean not null default false,
  severity text check (severity in ('RED','AMBER','GREEN')),
  trigger_type text,
  source_type text,
  source_id text,
  created_at timestamptz not null default now()
);
create index if not exists idx_change_log_event_date on evidence_change_log(event_date desc);
create unique index if not exists uq_change_log_source_event on evidence_change_log(disease_id, source_type, source_id, trigger_type);
create index if not exists idx_change_log_material on evidence_change_log(material_review_required, event_date desc);

create table if not exists research_evidence_entities (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references research_evidence(id) on delete cascade,
  entity_type text not null check (entity_type in ('GENE','DISEASE','CHEMICAL','VARIANT','SPECIES','CELL_LINE','OTHER')),
  normalized_id text,
  text text not null,
  source text not null default 'PUBTATOR3',
  created_at timestamptz not null default now()
);
create unique index if not exists uq_evidence_entity_signature
  on research_evidence_entities(evidence_id, entity_type, coalesce(normalized_id,''), text);
create index if not exists idx_evidence_entities_evidence on research_evidence_entities(evidence_id);
create index if not exists idx_evidence_entities_norm on research_evidence_entities(entity_type, normalized_id);

create table if not exists research_evidence_relations (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references research_evidence(id) on delete cascade,
  relation_type text not null,
  entity1_type text,
  entity1_id text,
  entity1_text text,
  entity2_type text,
  entity2_id text,
  entity2_text text,
  source text not null default 'PUBTATOR3',
  created_at timestamptz not null default now()
);
create unique index if not exists uq_evidence_relation_signature
  on research_evidence_relations(evidence_id, relation_type, coalesce(entity1_id,''), coalesce(entity1_text,''), coalesce(entity2_id,''), coalesce(entity2_text,''));
create index if not exists idx_evidence_relations_evidence on research_evidence_relations(evidence_id);
create index if not exists idx_evidence_relations_type on research_evidence_relations(relation_type);

create table if not exists candidate_hypotheses (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references repurposing_candidates(id) on delete cascade,
  hypothesis_version integer not null default 1,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','PAUSED','RETIRED')),
  responder_subgroup text,
  mechanism_terms text[] not null default '{}',
  biomarker_terms text[] not null default '{}',
  phenotype_terms text[] not null default '{}',
  genotype_terms text[] not null default '{}',
  regimen_terms text[] not null default '{}',
  positive_signal_terms text[] not null default '{}',
  negative_signal_terms text[] not null default '{}',
  kill_criteria text[] not null default '{}',
  rationale text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (candidate_id, hypothesis_version)
);
create unique index if not exists uq_candidate_single_active_hypothesis
  on candidate_hypotheses(candidate_id) where status='ACTIVE';
create index if not exists idx_candidate_hypotheses_candidate on candidate_hypotheses(candidate_id, status);

create table if not exists candidate_aliases (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references repurposing_candidates(id) on delete cascade,
  alias_type text not null check (alias_type in ('DRUG','DISEASE','GENE','BIOMARKER','PHENOTYPE','OTHER')),
  alias text not null,
  normalized_id text,
  source text,
  created_at timestamptz not null default now(),
  unique (candidate_id, alias_type, alias)
);
create index if not exists idx_candidate_aliases_candidate on candidate_aliases(candidate_id, alias_type);
create index if not exists idx_candidate_aliases_alias_lower on candidate_aliases(lower(alias));

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

create table if not exists ontology_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('DISEASE','DRUG','GENE','VARIANT','BIOMARKER','PHENOTYPE','MECHANISM','OTHER')),
  canonical_name text not null,
  namespace text not null default 'BCONZ',
  external_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, namespace, external_id)
);

create table if not exists ontology_aliases (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references ontology_entities(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  source text not null,
  confidence numeric(5,1) not null default 100 check (confidence between 0 and 100),
  created_at timestamptz not null default now(),
  unique (entity_id, normalized_alias)
);
create index if not exists idx_ontology_alias_normalized on ontology_aliases(normalized_alias);
create index if not exists idx_ontology_external on ontology_entities(entity_type, namespace, external_id);

create table if not exists evidence_entity_resolutions (
  id uuid primary key default gen_random_uuid(),
  evidence_entity_id uuid not null references research_evidence_entities(id) on delete cascade,
  ontology_entity_id uuid not null references ontology_entities(id) on delete cascade,
  resolution_method text not null check (resolution_method in ('EXTERNAL_ID','EXACT_ALIAS','CANONICAL_NAME','MANUAL')),
  confidence numeric(5,1) not null check (confidence between 0 and 100),
  created_at timestamptz not null default now(),
  unique (evidence_entity_id, ontology_entity_id)
);
create index if not exists idx_resolution_evidence_entity on evidence_entity_resolutions(evidence_entity_id);

create table if not exists candidate_entity_links (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references repurposing_candidates(id) on delete cascade,
  hypothesis_id uuid references candidate_hypotheses(id) on delete cascade,
  ontology_entity_id uuid not null references ontology_entities(id) on delete cascade,
  role text not null check (role in ('DISEASE','DRUG','GENE','VARIANT','BIOMARKER','PHENOTYPE','MECHANISM','REGIMEN','OTHER')),
  created_at timestamptz not null default now()
);
create unique index if not exists uq_candidate_entity_links_versioned
  on candidate_entity_links(candidate_id, hypothesis_id, ontology_entity_id, role) where hypothesis_id is not null;
create unique index if not exists uq_candidate_entity_links_unversioned
  on candidate_entity_links(candidate_id, ontology_entity_id, role) where hypothesis_id is null;
create index if not exists idx_candidate_entity_links on candidate_entity_links(candidate_id, role);

create table if not exists research_batch_runs (
  id uuid primary key default gen_random_uuid(),
  run_type text not null default 'EVIDENCE_INGESTION',
  status text not null default 'QUEUED' check (status in ('QUEUED','RUNNING','COMPLETED','PARTIAL','FAILED','CANCELLED')),
  requested_by text,
  config jsonb not null default '{}'::jsonb,
  total_tasks integer not null default 0,
  completed_tasks integer not null default 0,
  failed_tasks integer not null default 0,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists research_batch_tasks (
  id uuid primary key default gen_random_uuid(),
  batch_run_id uuid not null references research_batch_runs(id) on delete cascade,
  disease_id uuid references research_diseases(id) on delete cascade,
  disease_name text not null,
  status text not null default 'QUEUED' check (status in ('QUEUED','RUNNING','COMPLETED','FAILED','CANCELLED')),
  priority integer not null default 100,
  attempt_count integer not null default 0,
  max_attempts integer not null default 3,
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  error text,
  available_at timestamptz not null default now(),
  leased_until timestamptz,
  worker_id text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);
create index if not exists idx_batch_tasks_claim on research_batch_tasks(status, available_at, priority, created_at);
create index if not exists idx_batch_tasks_run on research_batch_tasks(batch_run_id, status);

create or replace function claim_research_batch_tasks(p_worker_id text, p_limit integer default 5, p_lease_minutes integer default 10)
returns setof research_batch_tasks language plpgsql security definer as $$
begin
  return query
  with claimable as (
    select t.id from research_batch_tasks t
    where (t.status='QUEUED' or (t.status='RUNNING' and t.leased_until < now()))
      and t.available_at <= now() and t.attempt_count < t.max_attempts
    order by t.priority asc, t.created_at asc
    for update skip locked
    limit greatest(1, least(p_limit,50))
  )
  update research_batch_tasks t
  set status='RUNNING', worker_id=p_worker_id,
      leased_until=now()+make_interval(mins=>greatest(1,p_lease_minutes)),
      attempt_count=t.attempt_count+1,
      started_at=coalesce(t.started_at,now())
  from claimable c where t.id=c.id returning t.*;
end; $$;

create or replace function refresh_research_batch_run(p_run_id uuid)
returns void language plpgsql security definer as $$
declare v_total integer; v_completed integer; v_failed integer; v_running integer;
begin
  select count(*), count(*) filter(where status='COMPLETED'), count(*) filter(where status='FAILED'), count(*) filter(where status='RUNNING')
  into v_total,v_completed,v_failed,v_running from research_batch_tasks where batch_run_id=p_run_id;
  update research_batch_runs set
    total_tasks=v_total, completed_tasks=v_completed, failed_tasks=v_failed,
    started_at=case when (v_running+v_completed+v_failed)>0 then coalesce(started_at,now()) else started_at end,
    status=case when v_total=0 then 'COMPLETED' when v_completed+v_failed=v_total and v_failed=0 then 'COMPLETED'
      when v_completed+v_failed=v_total and v_completed>0 then 'PARTIAL' when v_completed+v_failed=v_total then 'FAILED'
      when (v_running+v_completed+v_failed)>0 then 'RUNNING' else 'QUEUED' end,
    completed_at=case when v_total>0 and v_completed+v_failed=v_total then now() else null end
  where id=p_run_id;
end; $$;

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
create index if not exists idx_evidence_quality_score on evidence_quality_scores(composite_score desc);

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
  cross_disease_support integer not null default 0,
  negative_evidence_penalty numeric(5,1) not null default 0 check (negative_evidence_penalty between 0 and 100),
  competition_penalty numeric(5,1) not null default 0 check (competition_penalty between 0 and 100),
  human_exposure_score numeric(5,1) not null default 0 check (human_exposure_score between 0 and 100),
  development_readiness_score numeric(5,1) not null default 0 check (development_readiness_score between 0 and 100),
  preliminary_dra_score numeric(5,1) not null default 0 check (preliminary_dra_score between 0 and 100),
  routing_decision text not null default 'HOLD' check (routing_decision in ('FAST_TRACK_DRA','DRA_REVIEW','HOLD','DEPRIORITIZE')),
  ranking_version text not null default 'CRN-2.0',
  ranking_rationale jsonb not null default '{}'::jsonb,
  status text not null default 'PROPOSED' check (status in ('PROPOSED','REVIEW','PROMOTED','REJECTED','SUPERSEDED')),
  generated_by text not null default 'RELATION_ENGINE_V1',
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists uq_generated_candidate_signature on generated_candidate_hypotheses(disease_id, lower(drug_name), relation_type, lower(coalesce(gene_name,'')));
create index if not exists idx_generated_candidates_disease on generated_candidate_hypotheses(disease_id, generation_score desc);
create index if not exists idx_generated_candidates_status on generated_candidate_hypotheses(status, generation_score desc);
create index if not exists idx_generated_candidates_prelim_dra on generated_candidate_hypotheses(preliminary_dra_score desc);
create index if not exists idx_generated_candidates_route on generated_candidate_hypotheses(routing_decision, preliminary_dra_score desc);

create table if not exists drug_cross_disease_signals (
  id uuid primary key default gen_random_uuid(),
  drug_key text not null unique,
  drug_name text not null,
  drug_normalized_id text,
  disease_count integer not null default 0,
  evidence_count integer not null default 0,
  positive_signal_count integer not null default 0,
  negative_signal_count integer not null default 0,
  mean_evidence_quality numeric(5,1) not null default 0,
  human_exposure_score numeric(5,1) not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists idx_cross_disease_signal_score on drug_cross_disease_signals(disease_count desc, mean_evidence_quality desc);

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

-- RDIA v1.0 active portfolio seed.
insert into research_diseases (canonical_name,portfolio_status,portfolio_tier,last_reviewed_at) values
 ('Gaucher disease','ACTIVE','A','2026-08-29T00:00:00Z'),
 ('SCA12','ACTIVE','A','2026-08-29T00:00:00Z'),
 ('GNE myopathy','ACTIVE','B','2026-08-29T00:00:00Z'),
 ('Alport syndrome','ACTIVE','B','2026-08-29T00:00:00Z'),
 ('Dravet syndrome','ACTIVE','B','2026-08-29T00:00:00Z'),
 ('Pompe disease','ACTIVE','B','2026-08-29T00:00:00Z'),
 ('Cystinosis','ACTIVE','C','2026-08-29T00:00:00Z'),
 ('Maple syrup urine disease','ACTIVE','C','2026-08-29T00:00:00Z')
on conflict(canonical_name) do update set portfolio_status=excluded.portfolio_status, portfolio_tier=excluded.portfolio_tier,
 last_reviewed_at=excluded.last_reviewed_at, updated_at=now();

-- Five current DRA assets.
with s(disease_name,drug_name,responder_hypothesis,biomarker,regimen_concept,decision,kill_criterion,decisive_next_gate) as (values
 ('Gaucher disease','ambroxol','GBA1 variant + residual glucocerebrosidase activity + ex-vivo chaperone response + Lyso-Gb1 + phenotype predicts response','Lyso-Gb1; residual GCase activity; ex-vivo ambroxol rescue','precision responder / adjunctive regimen','ADVANCE','Ex-vivo rescue fails to predict response, chronic exposure is intolerable, or protectable claim space is absent','Validate responder signature prospectively'),
 ('SCA12','propranolol','Tremor-dominant genetically confirmed SCA12 with a digital tremor signature predicts response to optimized ER propranolol','TETRAS; accelerometry; wearable tremor signature','extended-release propranolol responder regimen','ADVANCE','External replication fails or no protectable responder/digital differentiation remains','Replicate responder model across 2-3 centres'),
 ('Alport syndrome','SGLT2 inhibitor','COL4 genotype + age + UACR + eGFR + RAAS background + progression rate predicts SGLT2 response','UACR; eGFR; progression slope','precision SGLT2 response / partnership asset','INVESTIGATE','No uncaptured responder subgroup or defensible claim space remains','Resolve FTO/competitor map before prospective validation'),
 ('GNE myopathy','6-sialyllactose','Genotype + disease stage + preserved muscle volume + MRI progression + biochemical resialylation predicts functional benefit','muscle MRI; biochemical resialylation','oral 6-sialyllactose responder validation','INVESTIGATE','Biochemical response does not predict MRI/function or IP/manufacturing economics are unattractive','Validate biomarker-to-MRI relationship'),
 ('GNE myopathy','ManNAc','Biochemical target engagement and early resialylation identify a precision replacement responder subgroup','sialic acid pathway PD; resialylation','precision replacement benchmark / partnering','BENCHMARK','Rights unavailable or current development status eliminates ownership path','Resolve ownership/licensing and comparator role')
), upserted as (
 insert into repurposing_candidates(disease_id,drug_name,responder_hypothesis,biomarker,regimen_concept,decision,kill_criterion,decisive_next_gate)
 select d.id,s.drug_name,s.responder_hypothesis,s.biomarker,s.regimen_concept,s.decision,s.kill_criterion,s.decisive_next_gate
 from s join research_diseases d on lower(d.canonical_name)=lower(s.disease_name)
 on conflict(disease_id,drug_name) do update set responder_hypothesis=excluded.responder_hypothesis,biomarker=excluded.biomarker,
 regimen_concept=excluded.regimen_concept,decision=excluded.decision,kill_criterion=excluded.kill_criterion,
 decisive_next_gate=excluded.decisive_next_gate,updated_at=now()
 returning id,disease_id,drug_name
)
insert into candidate_hypotheses(candidate_id,hypothesis_version,responder_subgroup,mechanism_terms,biomarker_terms,phenotype_terms,genotype_terms,regimen_terms,positive_signal_terms,negative_signal_terms,kill_criteria,rationale)
select c.id,1,
 case lower(c.drug_name) when 'ambroxol' then 'Neuronopathic/incomplete-response Gaucher with molecular or ex-vivo evidence of chaperone responsiveness' when 'propranolol' then 'Tremor-dominant, genetically confirmed SCA12' when 'sglt2 inhibitor' then 'Genotype/trajectory-defined Alport subgroup on optimized RAAS background' when '6-sialyllactose' then 'Earlier-stage GNE myopathy with preserved muscle volume and measurable resialylation' else 'GNE myopathy subgroup with measurable biochemical target engagement' end,
 case lower(c.drug_name) when 'ambroxol' then array['pharmacological chaperone','GCase','glucocerebrosidase','lysosomal trafficking'] when 'propranolol' then array['beta adrenergic blockade','tremor modulation'] when 'sglt2 inhibitor' then array['glomerular hemodynamics','SGLT2','albuminuria','renal protection'] when '6-sialyllactose' then array['sialylation','sialic acid','GNE pathway'] else array['ManNAc','sialic acid biosynthesis','GNE pathway'] end,
 case lower(c.drug_name) when 'ambroxol' then array['Lyso-Gb1','GCase activity','ex-vivo rescue'] when 'propranolol' then array['TETRAS','accelerometry','digital tremor'] when 'sglt2 inhibitor' then array['UACR','eGFR','eGFR slope'] when '6-sialyllactose' then array['muscle MRI','resialylation'] else array['sialic acid','resialylation'] end,
 case lower(c.drug_name) when 'ambroxol' then array['neuronopathic','GD3','incomplete ERT response','incomplete SRT response'] when 'propranolol' then array['tremor-dominant','action tremor'] when 'sglt2 inhibitor' then array['proteinuria','progressive CKD'] else array['muscle weakness','preserved muscle volume'] end,
 case lower(c.drug_name) when 'ambroxol' then array['GBA1'] when 'propranolol' then array['PPP2R2B','CAG repeat','SCA12'] when 'sglt2 inhibitor' then array['COL4A3','COL4A4','COL4A5'] else array['GNE'] end,
 case lower(c.drug_name) when 'propranolol' then array['extended release','ER propranolol'] else array[]::text[] end,
 array['responder','target engagement','biomarker response','improvement','prospective','randomized'],
 array['lack of efficacy','no significant benefit','poor tolerability','insufficient exposure','serious adverse','failed primary endpoint'],
 array[(select kill_criterion from repurposing_candidates r where r.id=c.id)],
 'Seeded from BCONZ DRA v0.2; expand or supersede through versioned registry records.'
from upserted c on conflict(candidate_id,hypothesis_version) do nothing;

insert into candidate_aliases(candidate_id,alias_type,alias,source)
select c.id,'DRUG',c.drug_name,'BCONZ_DRA_V0.2' from repurposing_candidates c on conflict do nothing;
insert into candidate_aliases(candidate_id,alias_type,alias,source)
select c.id,'DISEASE',d.canonical_name,'BCONZ_DRA_V0.2' from repurposing_candidates c join research_diseases d on d.id=c.disease_id on conflict do nothing;
insert into candidate_aliases(candidate_id,alias_type,alias,source)
select c.id,'DRUG',a.alias,'BCONZ_DRA_V0.2' from repurposing_candidates c cross join lateral (
 select unnest(case lower(c.drug_name) when 'ambroxol' then array['ambroxol hydrochloride'] when 'propranolol' then array['propranolol hydrochloride','ER propranolol','extended-release propranolol'] when 'sglt2 inhibitor' then array['SGLT2 inhibitor','SGLT2i','empagliflozin','dapagliflozin'] when '6-sialyllactose' then array['6SL','6′-sialyllactose','6-prime-sialyllactose'] when 'mannac' then array['N-acetylmannosamine','ManNAc'] else array[c.drug_name] end) alias
) a where lower(c.drug_name) in ('ambroxol','propranolol','sglt2 inhibitor','6-sialyllactose','mannac') on conflict do nothing;
