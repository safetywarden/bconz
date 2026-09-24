import { researchDb } from "./supabase-rest";
import { runResearchPipeline, type ResearchPipelineInput } from "./pipeline";

type DiseaseRow = { id: string; canonical_name: string };
type BatchRunRow = { id: string; status: string; total_tasks: number; completed_tasks: number; failed_tasks: number };
type BatchTaskRow = {
  id: string;
  batch_run_id: string;
  disease_id: string | null;
  disease_name: string;
  status: string;
  attempt_count: number;
  max_attempts: number;
  payload: ResearchPipelineInput;
};

export type CreateBatchInput = {
  diseases: string[];
  requestedBy?: string;
  priority?: number;
  pipeline?: Omit<ResearchPipelineInput, "diseaseName">;
};

export async function createResearchBatch(input: CreateBatchInput) {
  const uniqueDiseases = [...new Set(input.diseases.map((name) => name.trim()).filter(Boolean))];
  if (uniqueDiseases.length === 0) throw new Error("At least one disease is required");

  const runs = await researchDb<Array<{ id: string }>>("research_batch_runs", {
    method: "POST",
    prefer: "return=representation",
    body: {
      run_type: "EVIDENCE_INGESTION",
      requested_by: input.requestedBy ?? null,
      config: input.pipeline ?? {},
      total_tasks: uniqueDiseases.length,
    },
  });
  const runId = runs[0]?.id;
  if (!runId) throw new Error("Failed to create research batch");

  const tasks = [];
  for (const diseaseName of uniqueDiseases) {
    const diseases = await researchDb<DiseaseRow[]>(
      `research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id,canonical_name`,
    );
    const disease = diseases[0];
    tasks.push({
      batch_run_id: runId,
      disease_id: disease?.id ?? null,
      disease_name: diseaseName,
      priority: input.priority ?? 100,
      payload: { diseaseName, ...(input.pipeline ?? {}) },
    });
  }

  await researchDb<unknown>("research_batch_tasks", {
    method: "POST",
    prefer: "return=minimal",
    body: tasks,
  });

  return { runId, tasks: tasks.length };
}

export async function getResearchBatch(runId: string) {
  const runs = await researchDb<BatchRunRow[]>(
    `research_batch_runs?id=eq.${runId}&select=id,status,total_tasks,completed_tasks,failed_tasks,created_at,started_at,completed_at,config`,
  );
  const run = runs[0];
  if (!run) return undefined;
  const tasks = await researchDb<BatchTaskRow[]>(
    `research_batch_tasks?batch_run_id=eq.${runId}&select=id,batch_run_id,disease_id,disease_name,status,attempt_count,max_attempts,payload,error,result,created_at,started_at,completed_at&order=created_at.asc`,
  );
  return { run, tasks };
}

async function refreshRun(runId: string) {
  await researchDb<unknown>("rpc/refresh_research_batch_run", {
    method: "POST",
    body: { p_run_id: runId },
  });
}

export async function processResearchBatch(workerId: string, limit = 3) {
  const tasks = await researchDb<BatchTaskRow[]>("rpc/claim_research_batch_tasks", {
    method: "POST",
    body: { p_worker_id: workerId, p_limit: limit, p_lease_minutes: 15 },
  });

  const processed: Array<{ taskId: string; diseaseName: string; status: "COMPLETED" | "FAILED"; error?: string }> = [];
  const touchedRuns = new Set<string>();

  for (const task of tasks) {
    touchedRuns.add(task.batch_run_id);
    try {
      const result = await runResearchPipeline(task.payload);
      await researchDb<unknown>(`research_batch_tasks?id=eq.${task.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: {
          status: "COMPLETED",
          result,
          error: null,
          leased_until: null,
          completed_at: new Date().toISOString(),
        },
      });
      processed.push({ taskId: task.id, diseaseName: task.disease_name, status: "COMPLETED" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown batch task error";
      const terminal = task.attempt_count >= task.max_attempts;
      await researchDb<unknown>(`research_batch_tasks?id=eq.${task.id}`, {
        method: "PATCH",
        prefer: "return=minimal",
        body: terminal
          ? { status: "FAILED", error: message, leased_until: null, completed_at: new Date().toISOString() }
          : { status: "QUEUED", error: message, leased_until: null, available_at: new Date(Date.now() + Math.min(task.attempt_count * 60_000, 15 * 60_000)).toISOString() },
      });
      processed.push({ taskId: task.id, diseaseName: task.disease_name, status: "FAILED", error: message });
    }
  }

  for (const runId of touchedRuns) await refreshRun(runId);
  return { claimed: tasks.length, processed };
}
