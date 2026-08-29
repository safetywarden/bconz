create unique index if not exists uq_research_evidence_source
  on research_evidence(disease_id, source_type, source_id)
  where source_id is not null;
