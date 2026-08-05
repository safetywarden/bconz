"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubmissionService } from "@/lib/forms/SubmissionService";
import { validateContactForm } from "@/lib/forms/ValidationHelpers";
import type { ContactFormSchema } from "@/lib/forms/ContactFormSchema";

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

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Partial<ContactFormSchema>>({
    organization: "",
    contactName: "",
    jobTitle: "",
    businessEmail: "",
    phone: "",
    country: "",
    organizationType: "",
    areaOfInterest: "",
    preferredContactMethod: "Email",
    message: "",
    consent: false,
  });

  function update<Field extends keyof ContactFormSchema>(field: Field, value: ContactFormSchema[Field]) {
    setForm((s) => ({ ...(s as object), [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateContactForm({
      organization: form.organization,
      contactName: form.contactName,
      businessEmail: form.businessEmail,
      areaOfInterest: form.areaOfInterest,
      message: form.message,
      consent: form.consent,
    });
    setErrors(v.errors);
    if (!v.ok) return;
    const enableSubmissions = process.env.NEXT_PUBLIC_ENABLE_SUBMISSIONS === "true";
    const isProd = process.env.NODE_ENV === "production";

    if (!enableSubmissions) {
      if (!isProd) {
        // Development-safe validated state
        setSubmitted(true);
        return;
      }
      // In production, inform the user submission is unavailable
      setErrors((s) => ({ ...s, form: "Submission service is currently unavailable. Please try again later." }));
      return;
    }

    setLoading(true);
    try {
      await SubmissionService.submitContact(form);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="p-8">
        <h3 className="text-xl font-semibold text-slate-950">Thanks — we will be in touch</h3>
        <p className="mt-2 text-sm text-slate-700">A member of the BCONZ team will contact you shortly to discuss next steps.</p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      {errors.form ? (
        <div role="alert" className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          {errors.form}
        </div>
      ) : null}
      <div className="mb-4 text-sm text-slate-700">
        If you are requesting Research Data or want to become a Data Partner, please use the dedicated options above to access the correct workflow.
      </div>
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Organization Name</span>
            <input
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
              name="organization"
              type="text"
              aria-invalid={!!errors.organization}
              aria-describedby={errors.organization ? "err-organization" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.organization ? <p id="err-organization" className="mt-2 text-sm text-rose-600">{errors.organization}</p> : null}
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
        </label>

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={!!form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            name="consent"
            className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
          />
          I agree to be contacted about BCONZ partnership and research collaboration opportunities.
        </label>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="primary" size="large" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
          {submitted ? <p className="text-sm text-teal-600">Form submitted. We will follow up soon.</p> : null}
        </div>
      </form>
    </Card>
  );
}
