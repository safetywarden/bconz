export type ResearchRequestSchema = {
  organizationName: string;
  contactName: string;
  jobTitle: string;
  businessEmail: string;
  phone: string;
  country: string;
  diseaseArea: string;
  researchObjective: string;
  dataModalities: string[];
  estimatedTimeline: string;
  additionalInformation: string;
  privacyConsent: boolean;
  sourcePage: string;
  botcheck: string;
};
