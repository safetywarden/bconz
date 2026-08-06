# Launch Readiness Checklist

This document records the Sprint 1.8 review findings for production readiness.

Routes reviewed:
- /
- /data
- /solutions
- /data-partners
- /about
- /contact
- /insights
- /request-data
- /privacy
- /terms

Metadata:
- Central metadata implemented via `src/lib/metadata.ts` using `metadataBase`.
- Pages use `createMetadata` to inherit base metadata. Homepage recommended overrides applied.

Accessibility:
- Forms include labels, aria-invalid and aria-describedby for field-level errors.
- Contact `mailto:` links removed; buttons route to internal forms.

Responsive:
- Manual checks recommended across widths: 320,375,390,768,1024,1280,1440,1920.

Known limitations / blockers:
- Contact submissions use Web3Forms. Verify provider delivery after configuring `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in the deployment environment.
- Legal content requires review by qualified counsel before public launch.

Commands run:
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Security notes:
- No secrets or API keys found in source.

Legal note (developer-only):
/* Legal content requires review by qualified counsel before public production launch. */
