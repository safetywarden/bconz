export function isEmail(value: string) {
  return /^[\w-.]+@[\w-]+\.[\w-.]+$/.test(value);
}

import { contactEnquirySchema } from "@/lib/enquiries/schemas";
import type { ResearchRequestSchema } from "./ResearchRequestSchema";

export function validateContactForm(data: unknown) {
  const errors: Record<string, string> = {};
  const parsed = contactEnquirySchema.safeParse(data);
  if (!parsed.success) {
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string | undefined;
      if (!key) {
        return;
      }
      errors[key] = errors[key] ? `${errors[key]} ${issue.message}` : issue.message;
    });
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function validateResearchRequest(data: Partial<ResearchRequestSchema>) {
  const errors: Record<string, string> = {};
  if (!data.organizationName || data.organizationName.trim().length < 2) {
    errors.organizationName = "Enter your organization name.";
  }
  if (!data.contactName || data.contactName.trim().length < 2) {
    errors.contactName = "Enter a contact name.";
  }
  if (!data.businessEmail || !isEmail(data.businessEmail.trim())) {
    errors.businessEmail = "Enter a valid business email.";
  }
  if (!data.country || data.country.trim().length < 2) {
    errors.country = "Enter your country.";
  }
  if (!data.diseaseArea) {
    errors.diseaseArea = "Select a disease area.";
  }
  if (!data.researchObjective || data.researchObjective.trim().length < 10) {
    errors.researchObjective = "Describe your research objective (short summary).";
  }
  if (!data.dataModalities || data.dataModalities.length < 1) {
    errors.dataModalities = "Select at least one data modality.";
  }
  if (!data.privacyConsent) {
    errors.privacyConsent = "You must agree to be contacted.";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
