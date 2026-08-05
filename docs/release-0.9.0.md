# Release 0.9.0 — Sprint 1.8 Summary

Summary of work completed for Sprint 1.8 (Public website quality & launch readiness):

- Removed public email addresses and `mailto:` links; replaced with internal action buttons linking to `/contact` or `/request-data`.
- Added `typecheck` npm script and ran `eslint`, `tsc --noEmit`, and `next build`.
- Added `app/robots.ts` and verified `app/sitemap.ts` exists.
- Embedded Organization JSON-LD in root layout.
- Created `docs/launch-readiness.md` and this release note.

Next recommended steps:
- Manual responsive QA across listed widths.
- Legal review of Privacy/Terms.
- Integrate `SubmissionService` with a secure backend service.

Recommended commit message:
"Sprint 1.8 - Public website quality and launch readiness"
