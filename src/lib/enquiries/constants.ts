export const ORGANIZATION_TYPES = [
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
] as const;

export const AREA_OF_INTEREST_OPTIONS = [
  "General Enquiry",
  "Strategic Partnership",
  "Technology Partnership",
  "Scientific Collaboration",
  "Media or Speaking",
  "Other",
] as const;

export const PREFERRED_CONTACT_METHOD_OPTIONS = [
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "VIDEO_MEETING", label: "Video meeting" },
] as const;
