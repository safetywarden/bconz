# RDIA -> DRA Architecture

## Sequence
1. RDIA evidence ingestion and normalization.
2. Disease Intelligence Cards with provenance/evidence grades.
3. Frozen Active Portfolio with governed change control.
4. DRA candidate generation from approved/clinically characterized compounds.
5. Hard gates for safety, exposure, contradictory human evidence and captured competition/IP.
6. 100-point DRA score plus separate evidence confidence.
7. Adversarial Deep Asset Dossier.
8. Asset Validation gate.
9. India cohort/model/assay selection after the asset question is specific.
10. Experimental evidence -> asset/IP/partner decision.

Every scientific claim should carry source, evidence class, population, confidence and last-checked date. Identifiable patient data is not required for RDIA/DRA.

Next milestone: executable TypeScript services, Supabase tables, evidence ingestion and reproducible scoring.
