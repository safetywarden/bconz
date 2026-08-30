import { z } from "zod";

const score5 = z.number().min(0).max(5);
const confidence100 = z.number().min(0).max(100);

export const rdiaScoreRequestSchema = z.object({
  opportunity: z.record(z.string(), score5),
  confidence: z.record(z.string(), score5),
});

export const draScoreRequestSchema = z.object({
  scores: z.record(z.string(), score5),
  confidence: confidence100,
  hardGate: z
    .object({
      failed: z.boolean(),
      reason: z.string().max(1000).optional(),
    })
    .optional(),
});

export type RdiaScoreRequest = z.infer<typeof rdiaScoreRequestSchema>;
export type DraScoreRequest = z.infer<typeof draScoreRequestSchema>;
