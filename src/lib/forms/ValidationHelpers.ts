export function isEmail(value: string) {
  return /^[\w-.]+@[\w-]+\.[\w-.]+$/.test(value);
}

import type { ContactFormSchema } from "./ContactFormSchema";
import type { ResearchRequestSchema } from "./ResearchRequestSchema";

export function validateContactForm(data: Partial<ContactFormSchema>) {
  const errors: Record<string, string> = {};
  if (!data.organization || String(data.organization).trim().length < 2) {
    errors.organization = "Enter your organization name.";
  }
  if (!data.contactName || String(data.contactName).trim().length < 2) {
    errors.contactName = "Enter a contact name.";
  }
  if (!data.businessEmail || !isEmail(String(data.businessEmail))) {
    errors.businessEmail = "Enter a valid business email.";
  }
  if (!data.areaOfInterest) {
    errors.areaOfInterest = "Select an area of interest.";
  }
  if (!data.message || String(data.message).trim().length < 10) {
    errors.message = "Provide a short message describing your enquiry.";
  }
  if (!data.consent) {
    errors.consent = "You must agree to be contacted.";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export function validateResearchRequest(data: Partial<ResearchRequestSchema>) {
  const errors: Record<string, string> = {};
  if (!data.organization || String(data.organization).trim().length < 2) {
    errors.organization = "Enter your organization name.";
  }
  if (!data.contactName || String(data.contactName).trim().length < 2) {
    errors.contactName = "Enter a contact name.";
  }
  if (!data.businessEmail || !isEmail(String(data.businessEmail))) {
    errors.businessEmail = "Enter a valid business email.";
  }
  if (!data.researchObjective || String(data.researchObjective).trim().length < 10) {
    errors.researchObjective = "Describe your research objective (short summary).";
  }
  if (!data.consent) {
    errors.consent = "You must agree to be contacted.";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}
