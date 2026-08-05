export type ResearchRequestSchema = {
  organization: string;
  contactName: string;
  role?: string;
  businessEmail: string;
  country?: string;
  diseaseArea?: string;
  researchObjective: string;
  dataModalities?: string[];
  estimatedTimeline?: string;
  additionalInformation?: string;
  consent: boolean;
};
