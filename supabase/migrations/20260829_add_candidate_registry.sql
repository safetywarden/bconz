-- Flexible candidate hypothesis registry for scaling RDIA/DRA beyond the initial portfolio.

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

create index if not exists idx_candidate_hypotheses_candidate on candidate_hypotheses(candidate_id, status);
create index if not exists idx_candidate_aliases_candidate on candidate_aliases(candidate_id, alias_type);
create index if not exists idx_candidate_aliases_alias_lower on candidate_aliases(lower(alias));

-- Seed v1 hypotheses for the five current DRA assets. These are research hypotheses, not clinical recommendations.
with disease_map as (
  select id, canonical_name from research_diseases
), seeded_candidates as (
  select d.id as disease_id, s.drug_name, s.responder_hypothesis, s.biomarker, s.regimen_concept, s.decision, s.kill_criterion, s.decisive_next_gate
  from (values
    ('Gaucher disease','ambroxol','GBA1 variant + residual glucocerebrosidase activity + ex-vivo chaperone response + Lyso-Gb1 + phenotype predicts response','Lyso-Gb1; residual GCase activity; ex-vivo ambroxol rescue','precision responder / adjunctive regimen','ADVANCE','Ex-vivo rescue fails to predict response, chronic exposure is intolerable, or protectable claim space is absent','Validate responder signature prospectively'),
    ('SCA12','propranolol','Tremor-dominant genetically confirmed SCA12 with a digital tremor signature predicts response to optimized ER propranolol','TETRAS; accelerometry; wearable tremor signature','extended-release propranolol responder regimen','ADVANCE','External replication fails or no protectable responder/digital differentiation remains','Replicate responder model across 2-3 centres'),
    ('Alport syndrome','SGLT2 inhibitor','COL4 genotype + age + UACR + eGFR + RAAS background + progression rate predicts SGLT2 response','UACR; eGFR; progression slope','precision SGLT2 response / partnership asset','INVESTIGATE','No uncaptured responder subgroup or defensible claim space remains','Resolve FTO/competitor map before prospective validation'),
    ('GNE myopathy','6-sialyllactose','Genotype + disease stage + preserved muscle volume + MRI progression + biochemical resialylation predicts functional benefit','muscle MRI; biochemical resialylation','oral 6-sialyllactose responder validation','INVESTIGATE','Biochemical response does not predict MRI/function or IP/manufacturing economics are unattractive','Validate biomarker-to-MRI relationship'),
    ('GNE myopathy','ManNAc','Biochemical target engagement and early resialylation identify a precision replacement responder subgroup','sialic acid pathway PD; resialylation','precision replacement benchmark / partnering','BENCHMARK','Rights unavailable or current development status eliminates ownership path','Resolve ownership/licensing and comparator role')
  ) as s(disease_name,drug_name,responder_hypothesis,biomarker,regimen_concept,decision,kill_criterion,decisive_next_gate)
  join disease_map d on lower(d.canonical_name)=lower(s.disease_name)
), upsert_candidates as (
  insert into repurposing_candidates (disease_id, drug_name, responder_hypothesis, biomarker, regimen_concept, decision, kill_criterion, decisive_next_gate)
  select disease_id, drug_name, responder_hypothesis, biomarker, regimen_concept, decision, kill_criterion, decisive_next_gate from seeded_candidates
  on conflict (disease_id, drug_name) do update set
    responder_hypothesis=excluded.responder_hypothesis,
    biomarker=excluded.biomarker,
    regimen_concept=excluded.regimen_concept,
    decision=excluded.decision,
    kill_criterion=excluded.kill_criterion,
    decisive_next_gate=excluded.decisive_next_gate,
    updated_at=now()
  returning id, disease_id, drug_name
)
insert into candidate_hypotheses (candidate_id, hypothesis_version, responder_subgroup, mechanism_terms, biomarker_terms, phenotype_terms, genotype_terms, regimen_terms, positive_signal_terms, negative_signal_terms, kill_criteria, rationale)
select c.id, 1,
  case lower(c.drug_name)
    when 'ambroxol' then 'Neuronopathic/incomplete-response Gaucher with molecular or ex-vivo evidence of chaperone responsiveness'
    when 'propranolol' then 'Tremor-dominant, genetically confirmed SCA12'
    when 'sglt2 inhibitor' then 'Genotype/trajectory-defined Alport subgroup on optimized RAAS background'
    when '6-sialyllactose' then 'Earlier-stage GNE myopathy with preserved muscle volume and measurable resialylation'
    else 'GNE myopathy subgroup with measurable biochemical target engagement'
  end,
  case lower(c.drug_name)
    when 'ambroxol' then array['pharmacological chaperone','GCase','glucocerebrosidase','lysosomal trafficking']
    when 'propranolol' then array['beta adrenergic blockade','tremor modulation']
    when 'sglt2 inhibitor' then array['glomerular hemodynamics','SGLT2','albuminuria','renal protection']
    when '6-sialyllactose' then array['sialylation','sialic acid','GNE pathway']
    else array['ManNAc','sialic acid biosynthesis','GNE pathway']
  end,
  case lower(c.drug_name)
    when 'ambroxol' then array['Lyso-Gb1','GCase activity','ex-vivo rescue']
    when 'propranolol' then array['TETRAS','accelerometry','digital tremor']
    when 'sglt2 inhibitor' then array['UACR','eGFR','eGFR slope']
    when '6-sialyllactose' then array['muscle MRI','resialylation']
    else array['sialic acid','resialylation']
  end,
  case lower(c.drug_name)
    when 'ambroxol' then array['neuronopathic','GD3','incomplete ERT response','incomplete SRT response']
    when 'propranolol' then array['tremor-dominant','action tremor']
    when 'sglt2 inhibitor' then array['proteinuria','progressive CKD']
    else array['muscle weakness','preserved muscle volume']
  end,
  case lower(c.drug_name)
    when 'ambroxol' then array['GBA1']
    when 'propranolol' then array['PPP2R2B','CAG repeat','SCA12']
    when 'sglt2 inhibitor' then array['COL4A3','COL4A4','COL4A5']
    else array['GNE']
  end,
  case lower(c.drug_name)
    when 'propranolol' then array['extended release','ER propranolol']
    else array[]::text[]
  end,
  array['responder','target engagement','biomarker response','improvement','prospective','randomized'],
  array['lack of efficacy','no significant benefit','poor tolerability','insufficient exposure','serious adverse','failed primary endpoint'],
  array[(select kill_criterion from repurposing_candidates r where r.id=c.id)],
  'Seeded from BCONZ DRA v0.2; expand or supersede through versioned registry records.'
from upsert_candidates c
on conflict (candidate_id, hypothesis_version) do nothing;

insert into candidate_aliases (candidate_id, alias_type, alias, source)
select c.id, a.alias_type, a.alias, 'BCONZ_DRA_V0.2'
from repurposing_candidates c
join research_diseases d on d.id=c.disease_id
cross join lateral (
  values
    ('DRUG', c.drug_name),
    ('DISEASE', d.canonical_name)
) as a(alias_type, alias)
on conflict do nothing;

-- Drug/synonym aliases important for scalable evidence matching.
insert into candidate_aliases (candidate_id, alias_type, alias, source)
select c.id, 'DRUG', a.alias, 'BCONZ_DRA_V0.2'
from repurposing_candidates c
cross join lateral (
  select unnest(case lower(c.drug_name)
    when 'ambroxol' then array['ambroxol hydrochloride']
    when 'propranolol' then array['propranolol hydrochloride','ER propranolol','extended-release propranolol']
    when 'sglt2 inhibitor' then array['SGLT2 inhibitor','SGLT2i','empagliflozin','dapagliflozin']
    when '6-sialyllactose' then array['6SL','6′-sialyllactose','6-prime-sialyllactose']
    when 'mannac' then array['N-acetylmannosamine','ManNAc']
    else array[c.drug_name]
  end) as alias
) a
where lower(c.drug_name) in ('ambroxol','propranolol','sglt2 inhibitor','6-sialyllactose','mannac')
on conflict do nothing;
