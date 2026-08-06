"use client";

import { useEffect, useRef, useState } from "react";
import { FormStatus, type FormStatusState } from "@/components/forms/FormStatus";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card } from "@/components/ui/card";
import { validateContactForm } from "@/lib/forms/ValidationHelpers";
import { submitWeb3Form } from "@/lib/forms/web3forms";

const organizationTypes = [
  "Hospital or Healthcare Network",
  "Cancer Centre",
  "Diagnostic Laboratory",
  "Genomics Laboratory",
  "Biobank",
  "Research Institute",
  "Pharmaceutical Company",
  "Biotechnology Company",
  "Healthcare AI Company",
  "CRO",
  "Medical Device or Digital Health",
  "Government or Public Sector",
  "Investor",
  "Other",
];

const interestAreas = [
  "General Enquiry",
  "Strategic Partnership",
  "Technology Partnership",
  "Scientific Collaboration",
  "Media or Speaking",
  "Other",
];

type ContactFormState = {
  organizationName: string;
  contactName: string;
  jobTitle: string;
  businessEmail: string;
  phone: string;
  country: string;
  organizationType: string;
  areaOfInterest: string;
  preferredContactMethod: "EMAIL" | "PHONE" | "VIDEO_MEETING";
  message: string;
  privacyConsent: boolean;
  sourcePage: string;
  botcheck: string;
};

const initialFormState: ContactFormState = {
  organizationName: "",
  contactName: "",
  jobTitle: "",
  businessEmail: "",
  phone: "",
  country: "",
  organizationType: "",
  areaOfInterest: "",
  preferredContactMethod: "EMAIL",
  message: "",
  privacyConsent: false,
  sourcePage: "/contact",
  botcheck: "",
};

const contactSuccessTitle = "Thank you for contacting BCONZ.";
const contactSuccessMessage = "Our team will review your enquiry and contact you using the details provided.";
const contactErrorMessage = "Unable to submit your enquiry. Please try again.";

function trimValue(value: string) {
  return value.trim();
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const statusRef = useRef<HTMLDivElement>(null);

  const formStatus: FormStatusState = submitted ? "success" : loading ? "submitting" : errors.form ? "error" : "idle";

  useEffect(() => {
    if (errors.form) {
      statusRef.current?.focus();
    }
  }, [errors.form]);

  function update<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      organizationName: form.organizationName,
      contactName: form.contactName,
      businessEmail: form.businessEmail,
      organizationType: form.organizationType,
      areaOfInterest: form.areaOfInterest,
      message: form.message,
      privacyConsent: form.privacyConsent,
      jobTitle: form.jobTitle,
      phone: form.phone,
      country: form.country,
      preferredContactMethod: form.preferredContactMethod,
    };

    const validation = validateContactForm(payload);
    setErrors(validation.errors);
    if (!validation.ok) {
      return;
    }

    setLoading(true);
    try {
      const organizationName = trimValue(form.organizationName);
      const result = await submitWeb3Form(`[CONTACT] New BCONZ Website Enquiry \u2013 ${organizationName}`, {
        contactName: trimValue(form.contactName),
        organizationName,
        jobTitle: trimValue(form.jobTitle),
        businessEmail: trimValue(form.businessEmail),
        phone: trimValue(form.phone),
        country: trimValue(form.country),
        organizationType: form.organizationType,
        areaOfInterest: form.areaOfInterest,
        preferredContactMethod: form.preferredContactMethod,
        message: trimValue(form.message),
        sourcePage: form.sourcePage,
        botcheck: form.botcheck,
      });

      if (!result.success) {
        setErrors({ form: result.message });
        return;
      }

      setSubmitted(true);
      setForm(initialFormState);
    } catch {
      setErrors({ form: contactErrorMessage });
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="p-8" aria-live="polite">
        <FormStatus
          status="success"
          successTitle={contactSuccessTitle}
          successMessage={contactSuccessMessage}
        />
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div ref={statusRef} tabIndex={-1} className="outline-none">
        <FormStatus status={formStatus} errorMessage={errors.form} />
      </div>
      <div className="mb-4 text-sm text-slate-700">
        If you are requesting Research Data or want to become a Data Partner, please use the dedicated options above to access the correct workflow.
      </div>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Organization Name</span>
            <input
              value={form.organizationName}
              onChange={(e) => update("organizationName", e.target.value)}
              name="organizationName"
              type="text"
              aria-invalid={!!errors.organizationName}
              aria-describedby={errors.organizationName ? "err-organizationName" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.organizationName ? <p id="err-organizationName" className="mt-2 text-sm text-rose-600">{errors.organizationName}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Contact Name</span>
            <input
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
              name="contactName"
              type="text"
              aria-invalid={!!errors.contactName}
              aria-describedby={errors.contactName ? "err-contactName" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.contactName ? <p id="err-contactName" className="mt-2 text-sm text-rose-600">{errors.contactName}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Job Title</span>
            <input
              value={form.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              name="jobTitle"
              type="text"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Business Email</span>
            <input
              value={form.businessEmail}
              onChange={(e) => update("businessEmail", e.target.value)}
              name="businessEmail"
              type="email"
              aria-invalid={!!errors.businessEmail}
              aria-describedby={errors.businessEmail ? "err-businessEmail" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.businessEmail ? <p id="err-businessEmail" className="mt-2 text-sm text-rose-600">{errors.businessEmail}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Phone</span>
            <input
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              name="phone"
              type="tel"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Country</span>
            <input
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              name="country"
              type="text"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Organization Type</span>
            <select
              value={form.organizationType}
              onChange={(e) => update("organizationType", e.target.value)}
              name="organizationType"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="">Select</option>
              {organizationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Area of Interest</span>
            <select
              value={form.areaOfInterest}
              onChange={(e) => update("areaOfInterest", e.target.value)}
              name="areaOfInterest"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="">Select</option>
              {interestAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Message</span>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            name="message"
            rows={5}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          {errors.message ? <p id="err-message" className="mt-2 text-sm text-rose-600">{errors.message}</p> : null}
          <p className="mt-2 text-sm text-slate-600">Do not include patient names, medical record numbers, genomic files or other identifiable health information in this form.</p>
        </label>

        <fieldset className="grid gap-2 sm:grid-cols-3">
          <legend className="text-sm font-semibold text-slate-900">Preferred Contact Method</legend>
          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="radio"
              name="preferredContactMethod"
              value="EMAIL"
              checked={form.preferredContactMethod === "EMAIL"}
              onChange={() => update("preferredContactMethod", "EMAIL")}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
            />
            Email
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="radio"
              name="preferredContactMethod"
              value="PHONE"
              checked={form.preferredContactMethod === "PHONE"}
              onChange={() => update("preferredContactMethod", "PHONE")}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
            />
            Phone
          </label>
          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
            <input
              type="radio"
              name="preferredContactMethod"
              value="VIDEO_MEETING"
              checked={form.preferredContactMethod === "VIDEO_MEETING"}
              onChange={() => update("preferredContactMethod", "VIDEO_MEETING")}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
            />
            Video meeting
          </label>
        </fieldset>

        <input
          type="text"
          name="botcheck"
          value={form.botcheck}
          onChange={(e) => update("botcheck", e.target.value)}
          autoComplete="off"
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.privacyConsent === true}
            onChange={(e) => update("privacyConsent", e.target.checked)}
            name="privacyConsent"
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "err-privacyConsent" : undefined}
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
          />
          <span>
            I agree that BCONZ may use the information submitted to review and respond to this enquiry in accordance with the{" "}
            <a href="/privacy" className="font-semibold text-slate-950 underline underline-offset-2">
              Privacy Policy
            </a>.
          </span>
        </label>
        <p className="text-sm text-slate-600">Your information will only be used to review and respond to your enquiry.</p>
        {errors.privacyConsent ? <p id="err-privacyConsent" className="text-sm text-rose-600">{errors.privacyConsent}</p> : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SubmitButton isSubmitting={loading}>Submit</SubmitButton>
        </div>
      </form>
    </Card>
  );
}
