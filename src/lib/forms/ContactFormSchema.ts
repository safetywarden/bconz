export type ContactFormSchema = {
  organization: string;
  contactName: string;
  jobTitle?: string;
  businessEmail: string;
  phone?: string;
  country?: string;
  organizationType?: string;
  areaOfInterest?: string;
  preferredContactMethod?: "Email" | "Phone" | "Video" | string;
  message: string;
  consent: boolean;
};
