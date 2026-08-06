"use client";

import { useEffect, useRef, useState } from "react";
import { FormStatus, type FormStatusState } from "@/components/forms/FormStatus";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { validateResearchRequest } from "@/lib/forms/ValidationHelpers";
import { submitWeb3Form } from "@/lib/forms/web3forms";
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

type RequestDataFormState = ResearchRequestSchema;

const initialFormState: RequestDataFormState = {
  organizationName: "",
  contactName: "",
  jobTitle: "",
  businessEmail: "",
  phone: "",
  country: "",
  diseaseArea: "",
  researchObjective: "",
  dataModalities: [],
  estimatedTimeline: "Flexible",
  additionalInformation: "",
  privacyConsent: false,
  sourcePage: "/request-data",
  botcheck: "",
};

const requestDataSuccessTitle = "Thank you for your research data request.";
const requestDataSuccessMessage = "Our team will review your requirements and contact you using the details provided.";
const requestDataErrorMessage = "Unable to submit your enquiry. Please try again.";

function trimValue(value: string) {
  return value.trim();
}

export function RequestDataForm() {
  const [form, setForm] = useState<RequestDataFormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const formStatus: FormStatusState = success ? "success" : submitting ? "submitting" : errors.form ? "error" : "idle";

  useEffect(() => {
    if (errors.form) {
      statusRef.current?.focus();
    }
  }, [errors.form]);

  function update<K extends keyof RequestDataFormState>(field: K, value: RequestDataFormState[K]) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validation = validateResearchRequest(form);
    setErrors(validation.errors);
    if (!validation.ok) {
      return;
    }

    setSubmitting(true);
    try {
      const organizationName = trimValue(form.organizationName);
      const result = await submitWeb3Form(`[DATA REQUEST] New BCONZ Research Data Request \u2013 ${organizationName}`, {
        organizationName,
        contactName: trimValue(form.contactName),
        jobTitle: trimValue(form.jobTitle),
        businessEmail: trimValue(form.businessEmail),
        phone: trimValue(form.phone),
        country: trimValue(form.country),
        diseaseArea: form.diseaseArea,
        researchObjective: trimValue(form.researchObjective),
        dataModalities: form.dataModalities,
        estimatedTimeline: form.estimatedTimeline,
        additionalInformation: trimValue(form.additionalInformation),
        sourcePage: form.sourcePage,
        botcheck: form.botcheck,
      });

      if (!result.success) {
        setErrors({ form: result.message });
        return;
      }

      setSuccess(true);
      setForm(initialFormState);
    } catch {
      setErrors({ form: requestDataErrorMessage });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Card className="p-8" aria-live="polite">
        <FormStatus
          status="success"
          successTitle={requestDataSuccessTitle}
          successMessage={requestDataSuccessMessage}
        />
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div ref={statusRef} tabIndex={-1} className="outline-none">
        <FormStatus id="request-data-form-status" status={formStatus} errorMessage={errors.form} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-busy={submitting} aria-describedby="request-data-form-status">
        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Organization</span>
            <input
              value={form.organizationName}
              onChange={(e) => update("organizationName", e.target.value)}
              name="organizationName"
              type="text"
              required
              autoComplete="organization"
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
              required
              autoComplete="name"
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
              autoComplete="organization-title"
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
              required
              autoComplete="email"
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
              autoComplete="tel"
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
              required
              autoComplete="country-name"
              aria-invalid={!!errors.country}
              aria-describedby={errors.country ? "err-country" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            {errors.country ? <p id="err-country" className="mt-2 text-sm text-rose-600">{errors.country}</p> : null}
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Disease Area</span>
            <select
              value={form.diseaseArea}
              onChange={(e) => update("diseaseArea", e.target.value)}
              name="diseaseArea"
              required
              aria-invalid={!!errors.diseaseArea}
              aria-describedby={errors.diseaseArea ? "err-diseaseArea" : undefined}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="">Select</option>
              {diseaseAreas.map((diseaseArea) => (
                <option key={diseaseArea} value={diseaseArea}>
                  {diseaseArea}
                </option>
              ))}
            </select>
            {errors.diseaseArea ? <p id="err-diseaseArea" className="mt-2 text-sm text-rose-600">{errors.diseaseArea}</p> : null}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-900">Research Objective</span>
          <textarea
            value={form.researchObjective}
            onChange={(e) => update("researchObjective", e.target.value)}
            name="researchObjective"
            rows={4}
            required
            aria-invalid={!!errors.researchObjective}
            aria-describedby={errors.researchObjective ? "err-researchObjective" : undefined}
            className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />
          {errors.researchObjective ? <p id="err-researchObjective" className="mt-2 text-sm text-rose-600">{errors.researchObjective}</p> : null}
          <p className="mt-2 text-sm text-slate-600">Do not include patient names, medical record numbers, genomic files or other identifiable health information in this form.</p>
        </label>

        <fieldset aria-invalid={!!errors.dataModalities} aria-describedby={errors.dataModalities ? "err-dataModalities" : undefined}>
          <legend className="text-sm font-semibold text-slate-900">Data Modalities</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dataModalities.map((modality) => (
              <label key={modality} className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.dataModalities.includes(modality)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...form.dataModalities, modality]
                      : form.dataModalities.filter((item) => item !== modality);
                    update("dataModalities", next);
                  }}
                  name="dataModalities"
                  value={modality}
                  className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
                />
                <span className="text-sm text-slate-700">{modality}</span>
              </label>
            ))}
          </div>
          {errors.dataModalities ? <p id="err-dataModalities" className="mt-2 text-sm text-rose-600">{errors.dataModalities}</p> : null}
        </fieldset>

        <div className="grid gap-6 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-900">Estimated Timeline</span>
            <select
              value={form.estimatedTimeline}
              onChange={(e) => update("estimatedTimeline", e.target.value)}
              name="estimatedTimeline"
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
              value={form.additionalInformation}
              onChange={(e) => update("additionalInformation", e.target.value)}
              name="additionalInformation"
              type="text"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
          </label>
        </div>

        <input
          type="text"
          name="botcheck"
          value={form.botcheck}
          onChange={(e) => update("botcheck", e.target.value)}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />

        <label className="flex items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.privacyConsent}
            onChange={(e) => update("privacyConsent", e.target.checked)}
            name="privacyConsent"
            required
            aria-invalid={!!errors.privacyConsent}
            aria-describedby={errors.privacyConsent ? "err-privacyConsent" : undefined}
            className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-400"
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

        <div className="flex items-center gap-4">
          <SubmitButton isSubmitting={submitting}>Submit</SubmitButton>
          <Button variant="secondary" size="normal" as="a" href="/contact">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
