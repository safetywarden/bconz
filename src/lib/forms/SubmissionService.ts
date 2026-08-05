export const SubmissionService = {
  async submitContact(payload?: unknown) {
    // Placeholder for future CRM integration. Do NOT log or persist personal data here.
    // Keep a no-op reference to the payload to avoid accidental linting of unused vars.
    void payload;
    // Simulate network latency for development.
    return new Promise((resolve) => setTimeout(resolve, 800));
  },

  async submitResearchRequest(payload?: unknown) {
    void payload;
    // Placeholder for future CRM integration for research requests.
    return new Promise((resolve) => setTimeout(resolve, 900));
  },
};
