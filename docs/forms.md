# BCONZ Public Forms

BCONZ public enquiry forms use Web3Forms directly from client components. No database, Supabase, SMTP service, API route, or server-side contact submission backend is used.

## Provider

- Provider: Web3Forms
- Endpoint: `https://api.web3forms.com/submit`
- Shared service: `src/lib/forms/web3forms.ts`
- Required environment variable: `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`

The shared service injects:

- `access_key`
- `from_name = BCONZ Website`
- the subject supplied by the form

It sends JSON, uses an `AbortController` timeout, parses provider responses safely, and returns user-safe messages without logging form payloads or personal data.

## Connected Forms

### Contact

- Route: `/contact`
- Component: `src/components/contact/ContactForm.tsx`
- Subject: `[CONTACT] New BCONZ Website Enquiry – {organizationName}`

Fields sent:

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
- `sourcePage = /contact`
- `botcheck`

### Request Research Data

- Route: `/request-data`
- Component: `src/components/contact/RequestDataForm.tsx`
- Subject: `[DATA REQUEST] New BCONZ Research Data Request – {organizationName}`

Fields sent:

- `organizationName`
- `contactName`
- `jobTitle`
- `businessEmail`
- `phone`
- `country`
- `diseaseArea`
- `researchObjective`
- `dataModalities`
- `estimatedTimeline`
- `additionalInformation`
- `sourcePage = /request-data`
- `botcheck`

### Data Partners

`/data-partners` currently contains CTA buttons and page content, not a working form. It was not given a new form during the Web3Forms standardization.

## Honeypot

Every connected form includes a visually hidden `botcheck` field. It is not required, is hidden from keyboard users and screen readers, and is submitted to Web3Forms.

## Consent

Every connected form includes an unchecked consent checkbox linking to `/privacy`:

`I agree that BCONZ may use the information submitted to review and respond to this enquiry in accordance with the Privacy Policy.`

The forms also show:

`Your information will only be used to review and respond to your enquiry.`

## Success And Error Handling

Form values are preserved after failed submission. Forms reset only after Web3Forms returns a successful response.

Contact success copy:

`Thank you for contacting BCONZ.`

`Our team will review your enquiry and contact you using the details provided.`

Request data success copy:

`Thank you for your research data request.`

`Our team will review your requirements and contact you using the details provided.`

Failure copy:

`Unable to submit your enquiry. Please try again.`

## Local Testing

1. Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to `.env.local`.
2. Run `npm run dev`.
3. Test `/contact` and `/request-data`.
4. Confirm valid submissions show the success state.
5. Confirm failed submissions preserve entered values.
6. Confirm browser network activity posts to `https://api.web3forms.com/submit`.
7. Confirm no form calls `/api/contact`, `/api/contact-test`, or `/api/enquiries`.

## Vercel Setup

Add `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` to the Vercel project environment variables for each environment that should accept public enquiry submissions.

Do not display internal recipient email addresses publicly.
