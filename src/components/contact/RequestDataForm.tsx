"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubmissionService } from "@/lib/forms/SubmissionService";
import { validateResearchRequest } from "@/lib/forms/ValidationHelpers";
import type { ResearchRequestSchema } from "@/lib/forms/ResearchRequestSchema";

const diseaseAreas = [
  "Oncology",
  "Cardiology",
  "Neurology",
  "Rare Disease",
  "Diabetes",
  "Respiratory",
  "Women's Health",
  "Infectious Disease",
  "Other",
];

const dataModalities = [
  "Clinical Data",
  "Genomics",
  "Transcriptomics",
  "Proteomics",
  "Imaging",
  "Digital Pathology",
  "Biospecimens",
  "Real World Data",
];

export function RequestDataForm() {
  const [form, setForm] = useState<Partial<ResearchRequestSchema>>({
    organization: "",
    contactName: "",
    role: "",
    businessEmail: "",
    country: "",
    diseaseArea: "",
    researchObjective: "",
    dataModalities: [],
    estimatedTimeline: "Flexible",
    additionalInformation: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function update<Field extends keyof ResearchRequestSchema>(field: Field, value: ResearchRequestSchema[Field]) {
    setForm((s) => ({ ...(s as object), [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateResearchRequest({
      organization: form.organization,
      contactName: form.contactName,
      businessEmail: form.businessEmail,
      researchObjective: form.researchObjective,
      consent: form.consent,
    });
    setErrors(v.errors);
    if (!v.ok) return;
    const enableSubmissions = process.env.NEXT_PUBLIC_ENABLE_SUBMISSIONS === "true";
    const isProd = process.env.NODE_ENV === "production";

    if (!enableSubmissions) {
      if (!isProd) {
        setSuccess(true);
        return;
      }
      setErrors((s) => ({ ...s, form: "Submission service is currently unavailable. Please try again later." }));
      return;
    }

    setSubmitting(true);
    try {
      await SubmissionService.submitResearchRequest(form);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-8">
      {errors.form ? (
        <div role="alert" className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">
          {errors.form}
        </div>
      ) : null}
        {success ? (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-950">Request submitted</h3>
          <p className="text-sm text-slate-700">Thank you — we&apos;ll review your request and follow up shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Organization</span>
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
              <span className="text-sm font-semibold text-slate-900">Role</span>
              <input
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                name="role"
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
              <span className="text-sm font-semibold text-slate-900">Disease Area</span>
              <select
                value={form.diseaseArea}
                onChange={(e) => update("diseaseArea", e.target.value)}
                name="diseaseArea"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option value="">Select</option>
                {diseaseAreas.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Research Objective</span>
            <textarea
              value={form.researchObjective}
              onChange={(e) => update("researchObjective", e.target.value)}
              name="researchObjective"
              rows={4}
              aria-invalid={!!errors.researchObjective}
              aria-describedby={errors.researchObjective ? "err-researchObjective" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.researchObjective ? <p id="err-researchObjective" className="mt-2 text-sm text-rose-600">{errors.researchObjective}</p> : null}
          </label>

          <div>
            <p className="text-sm font-semibold text-slate-900">Data Modalities</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dataModalities.map((m) => (
                  <label key={m} className="inline-flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={(form.dataModalities || []).includes(m)}
                      onChange={(e) => {
                        const current = (form.dataModalities || []) as string[];
                        const next = e.target.checked ? [...current, m] : current.filter((x) => x !== m);
                        update("dataModalities", next);
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                    />
                    <span className="text-sm text-slate-700">{m}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Estimated Timeline</span>
                <select
                value={(form.estimatedTimeline as string) || "Flexible"}
                onChange={(e) => update("estimatedTimeline", e.target.value)}
                name="timeline"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
              >
                <option>Immediate</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>Flexible</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-900">Additional Information</span>
              <input
                value={(form.additionalInformation as string) || ""}
                onChange={(e) => update("additionalInformation", e.target.value)}
                name="additional"
                type="text"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
            </label>
          </div>

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

          <div className="flex items-center gap-4">
            <Button variant="primary" size="large" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="secondary" size="normal" as="a" href="/contact">
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
