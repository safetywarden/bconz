-- Scalable ontology/entity resolution and database-backed research job queue.
-- The ontology layer normalizes scientific concepts; the queue decouples ingestion from HTTP request duration.

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

create table if not exists evidence_entity_resolutions (
  id uuid primary key default gen_random_uuid(),
  evidence_entity_id uuid not null references research_evidence_entities(id) on delete cascade,
  ontology_entity_id uuid not null references ontology_entities(id) on delete cascade,
  resolution_method text not null check (resolution_method in ('EXTERNAL_ID','EXACT_ALIAS','CANONICAL_NAME','MANUAL')),
  confidence numeric(5,1) not null check (confidence between 0 and 100),
  created_at timestamptz not null default now(),
  unique (evidence_entity_id, ontology_entity_id)
);

create table if not exists candidate_entity_links (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references repurposing_candidates(id) on delete cascade,
  hypothesis_id uuid references candidate_hypotheses(id) on delete cascade,
  ontology_entity_id uuid not null references ontology_entities(id) on delete cascade,
  role text not null check (role in ('DISEASE','DRUG','GENE','VARIANT','BIOMARKER','PHENOTYPE','MECHANISM','REGIMEN','OTHER')),
  created_at timestamptz not null default now(),
  unique (candidate_id, hypothesis_id, ontology_entity_id, role)
);

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

create index if not exists idx_ontology_alias_normalized on ontology_aliases(normalized_alias);
create index if not exists idx_ontology_external on ontology_entities(entity_type, namespace, external_id);
create index if not exists idx_resolution_evidence_entity on evidence_entity_resolutions(evidence_entity_id);
create index if not exists idx_candidate_entity_links on candidate_entity_links(candidate_id, role);
create index if not exists idx_batch_tasks_claim on research_batch_tasks(status, available_at, priority, created_at);
create index if not exists idx_batch_tasks_run on research_batch_tasks(batch_run_id, status);

-- Atomically claim work. SKIP LOCKED permits multiple workers without duplicate processing.
create or replace function claim_research_batch_tasks(p_worker_id text, p_limit integer default 5, p_lease_minutes integer default 10)
returns setof research_batch_tasks
language plpgsql
security definer
as $$
begin
  return query
  with claimable as (
    select t.id
    from research_batch_tasks t
    where (
      t.status = 'QUEUED'
      or (t.status = 'RUNNING' and t.leased_until < now())
    )
      and t.available_at <= now()
      and t.attempt_count < t.max_attempts
    order by t.priority asc, t.created_at asc
    for update skip locked
    limit greatest(1, least(p_limit, 50))
  )
  update research_batch_tasks t
  set status = 'RUNNING',
      worker_id = p_worker_id,
      leased_until = now() + make_interval(mins => greatest(1, p_lease_minutes)),
      attempt_count = t.attempt_count + 1,
      started_at = coalesce(t.started_at, now())
  from claimable c
  where t.id = c.id
  returning t.*;
end;
$$;

create or replace function refresh_research_batch_run(p_run_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_total integer;
  v_completed integer;
  v_failed integer;
  v_running integer;
begin
  select count(*),
         count(*) filter (where status='COMPLETED'),
         count(*) filter (where status='FAILED'),
         count(*) filter (where status='RUNNING')
    into v_total, v_completed, v_failed, v_running
  from research_batch_tasks where batch_run_id=p_run_id;

  update research_batch_runs
  set total_tasks=v_total,
      completed_tasks=v_completed,
      failed_tasks=v_failed,
      started_at=case when (v_running+v_completed+v_failed)>0 then coalesce(started_at, now()) else started_at end,
      status=case
        when v_total=0 then 'COMPLETED'
        when v_completed+v_failed=v_total and v_failed=0 then 'COMPLETED'
        when v_completed+v_failed=v_total and v_completed>0 then 'PARTIAL'
        when v_completed+v_failed=v_total then 'FAILED'
        when (v_running+v_completed+v_failed)>0 then 'RUNNING'
        else 'QUEUED'
      end,
      completed_at=case when v_total>0 and v_completed+v_failed=v_total then now() else null end
  where id=p_run_id;
end;
$$;
