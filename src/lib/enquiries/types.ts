import type { ORGANIZATION_TYPES, AREA_OF_INTEREST_OPTIONS, PREFERRED_CONTACT_METHOD_OPTIONS } from "./constants";

export type ContactEnquiryOrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type ContactEnquiryAreaOfInterest = (typeof AREA_OF_INTEREST_OPTIONS)[number];
export type ContactEnquiryPreferredContactMethod = (typeof PREFERRED_CONTACT_METHOD_OPTIONS)[number]["value"];

export type ContactEnquiryRequest = {
  organizationName: string;
  contactName: string;
  businessEmail: string;
  organizationType: ContactEnquiryOrganizationType;
  areaOfInterest: ContactEnquiryAreaOfInterest;
  message: string;
  privacyConsent: boolean;
  jobTitle?: string;
  phone?: string;
  country?: string;
  preferredContactMethod?: ContactEnquiryPreferredContactMethod;
  sourcePath?: string;
  websiteUrl?: string;
};
