import { z } from "zod";
import { AREA_OF_INTEREST_OPTIONS, ORGANIZATION_TYPES } from "./constants";

const normaliseText = (value: string) => value.replace(/\0/g, "").replace(/\s+/g, " ").trim();

const nonEmptyString = (fieldName: string, minLen: number, maxLen: number) =>
  z
    .string()
    .transform(normaliseText)
    .pipe(
      z
        .string()
        .min(minLen, `${fieldName} must contain at least ${minLen} characters.`)
        .max(maxLen, `${fieldName} must be at most ${maxLen} characters.`)
    );

const optionalText = (maxLen: number) =>
  z.preprocess(
    (value) => {
      if (typeof value === "undefined") return undefined;
      if (typeof value !== "string") return value;
      const normalised = normaliseText(value);
      return normalised === "" ? undefined : normalised;
    },
    z.string().max(maxLen, `Must be at most ${maxLen} characters.`).optional()
  );

export const contactEnquirySchema = z
  .object({
    organizationName: nonEmptyString("Organization Name", 2, 200),
    contactName: nonEmptyString("Contact Name", 2, 120),
    businessEmail: z
      .string()
      .trim()
      .toLowerCase()
      .email({ message: "Enter a valid business email." })
      .max(254, { message: "Business Email must be at most 254 characters." }),
    organizationType: z.enum(ORGANIZATION_TYPES),
    areaOfInterest: z.enum(AREA_OF_INTEREST_OPTIONS),
    message: nonEmptyString("Message", 10, 5000),
    privacyConsent: z.boolean().refine((value) => value === true, {
      message: "You must agree to be contacted.",
    }),
    jobTitle: optionalText(160),
    phone: optionalText(40),
    country: optionalText(100),
    preferredContactMethod: z.enum(["EMAIL", "PHONE", "VIDEO_MEETING"] as const).optional(),
    sourcePath: optionalText(250),
    websiteUrl: optionalText(250),
  })
  .strict();

export type ContactEnquirySchema = z.infer<typeof contactEnquirySchema>;
