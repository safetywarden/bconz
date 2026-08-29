insert into research_diseases (canonical_name, portfolio_status, portfolio_tier, last_reviewed_at)
values
  ('Gaucher disease', 'ACTIVE', 'A', '2026-08-29T00:00:00Z'),
  ('SCA12', 'ACTIVE', 'A', '2026-08-29T00:00:00Z'),
  ('GNE myopathy', 'ACTIVE', 'B', '2026-08-29T00:00:00Z'),
  ('Alport syndrome', 'ACTIVE', 'B', '2026-08-29T00:00:00Z'),
  ('Dravet syndrome', 'ACTIVE', 'B', '2026-08-29T00:00:00Z'),
  ('Pompe disease', 'ACTIVE', 'B', '2026-08-29T00:00:00Z'),
  ('Cystinosis', 'ACTIVE', 'C', '2026-08-29T00:00:00Z'),
  ('Maple syrup urine disease', 'ACTIVE', 'C', '2026-08-29T00:00:00Z')
on conflict (canonical_name) do update
set portfolio_status = excluded.portfolio_status,
    portfolio_tier = excluded.portfolio_tier,
    last_reviewed_at = excluded.last_reviewed_at,
    updated_at = now();
