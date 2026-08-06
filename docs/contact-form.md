# Contact Form

The BCONZ contact form submits through the shared Web3Forms framework documented in `docs/forms.md`.

## Provider

- Provider: Web3Forms
- Endpoint: `https://api.web3forms.com/submit`
- Shared service: `src/lib/forms/web3forms.ts`
- Required environment variable: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`

## Submitted Fields

- `access_key`
- `subject`
- `from_name`
- `contactName`
- `organizationName`
- `jobTitle`
- `businessEmail`
- `phone`
- `country`
- `organizationType`
- `areaOfInterest`
- `preferredContactMethod`
- `message`
- `botcheck`

The subject is `New BCONZ Website Enquiry – {organizationName}` and `from_name` is `BCONZ Website`.

## Consent And Honeypot

The privacy consent checkbox is required by the client-side validation before submission. The hidden `botcheck` field is submitted to Web3Forms as a honeypot field.

## Success And Error Handling

The success state appears only after Web3Forms returns a successful response:

`Thank you for contacting BCONZ.`

`Our team will review your enquiry and contact you using the details provided.`

If submission fails, the form data is preserved and the user sees:

`Unable to submit your enquiry. Please try again.`

No database is used and internal recipient email addresses should not be displayed publicly.

## Local Testing

1. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to `.env.local`.
2. Run `npm run dev`.
3. Open `/contact`.
4. Submit a non-sensitive test enquiry.
5. Confirm the success message appears only after the provider response.
6. Confirm the browser network panel shows a request to `https://api.web3forms.com/submit` and no request to `/api/contact`.

## Vercel Setup

Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to the Vercel project environment variables for every environment that should accept contact submissions. `NEXT_PUBLIC_SITE_URL` may also be set for site metadata and canonical URL configuration.
