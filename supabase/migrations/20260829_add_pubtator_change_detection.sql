-- PubTator3 annotations and material-change support for RDIA.

alter table research_evidence
  add constraint research_evidence_source_unique unique (disease_id, source_type, source_id);

create table if not exists research_evidence_entities (
  id uuid primary key default gen_random_uuid(),
  evidence_id uuid not null references research_evidence(id) on delete cascade,
  entity_type text not null check (entity_type in ('GENE','DISEASE','CHEMICAL','VARIANT','SPECIES','CELL_LINE','OTHER')),
  normalized_id text,
  text text not null,
  source text not null default 'PUBTATOR3',
  created_at timestamptz not null default now(),
  unique (evidence_id, entity_type, normalized_id, text)
);

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
  created_at timestamptz not null default now(),
  unique (evidence_id, relation_type, entity1_id, entity2_id)
);

alter table evidence_change_log
  add column if not exists severity text check (severity in ('RED','AMBER','GREEN')),
  add column if not exists trigger_type text,
  add column if not exists source_type text,
  add column if not exists source_id text;

create index if not exists idx_evidence_entities_evidence on research_evidence_entities(evidence_id);
create index if not exists idx_evidence_entities_norm on research_evidence_entities(entity_type, normalized_id);
create index if not exists idx_evidence_relations_evidence on research_evidence_relations(evidence_id);
create index if not exists idx_evidence_relations_type on research_evidence_relations(relation_type);
create index if not exists idx_change_log_material on evidence_change_log(material_review_required, event_date desc);
