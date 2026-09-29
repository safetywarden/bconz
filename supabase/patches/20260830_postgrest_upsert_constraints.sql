-- Patch for databases bootstrapped before PostgREST-compatible evidence constraints.
-- Safe to run once after 20260830090000_research_intelligence_bootstrap.sql.

-- research_evidence used a partial unique index, which PostgREST cannot infer for
-- on_conflict=disease_id,source_type,source_id. Seeded/ingested evidence always has
-- a source_id, so promote this to a real table constraint.
drop index if exists uq_research_evidence_source;
alter table research_evidence
  drop constraint if exists uq_research_evidence_source;
alter table research_evidence
  add constraint uq_research_evidence_source
  unique (disease_id, source_type, source_id);

-- PubTator entity/relation persistence now stores empty strings instead of NULL
-- for missing normalized IDs/signature fields, allowing ordinary unique constraints
-- that PostgREST can target with ON CONFLICT.
update research_evidence_entities set normalized_id = '' where normalized_id is null;
alter table research_evidence_entities alter column normalized_id set default '';
alter table research_evidence_entities alter column normalized_id set not null;
drop index if exists uq_evidence_entity_signature;
alter table research_evidence_entities
  drop constraint if exists uq_evidence_entity_signature;
alter table research_evidence_entities
  add constraint uq_evidence_entity_signature
  unique (evidence_id, entity_type, normalized_id, text);

update research_evidence_relations set entity1_id = '' where entity1_id is null;
update research_evidence_relations set entity1_text = '' where entity1_text is null;
update research_evidence_relations set entity2_id = '' where entity2_id is null;
update research_evidence_relations set entity2_text = '' where entity2_text is null;
alter table research_evidence_relations alter column entity1_id set default '';
alter table research_evidence_relations alter column entity1_text set default '';
alter table research_evidence_relations alter column entity2_id set default '';
alter table research_evidence_relations alter column entity2_text set default '';
alter table research_evidence_relations alter column entity1_id set not null;
alter table research_evidence_relations alter column entity1_text set not null;
alter table research_evidence_relations alter column entity2_id set not null;
alter table research_evidence_relations alter column entity2_text set not null;
drop index if exists uq_evidence_relation_signature;
alter table research_evidence_relations
  drop constraint if exists uq_evidence_relation_signature;
alter table research_evidence_relations
  add constraint uq_evidence_relation_signature
  unique (evidence_id, relation_type, entity1_id, entity1_text, entity2_id, entity2_text);

-- Ask PostgREST to refresh its schema cache immediately.
notify pgrst, 'reload schema';
