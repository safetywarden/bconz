export type ScoreInput = Record<string, number>;

export type WeightedCriterion = {
  key: string;
  weight: number;
};

export type ScoreResult = {
  score: number;
  contributions: Record<string, number>;
};

/**
 * Scores 0-5 criterion inputs against an arbitrary weighted model.
 * Throws instead of silently accepting missing/out-of-range research judgments.
 */
export function calculateWeightedScore(
  input: ScoreInput,
  criteria: WeightedCriterion[],
): ScoreResult {
  const contributions: Record<string, number> = {};
  let score = 0;

  for (const criterion of criteria) {
    const value = input[criterion.key];
    if (value === undefined) throw new Error(`Missing score: ${criterion.key}`);
    if (!Number.isFinite(value) || value < 0 || value > 5) {
      throw new Error(`Score ${criterion.key} must be between 0 and 5`);
    }

    const contribution = (value / 5) * criterion.weight;
    contributions[criterion.key] = contribution;
    score += contribution;
  }

  return { score: Math.round(score * 10) / 10, contributions };
}
