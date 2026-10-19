import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { researchDb } from "@/lib/research/supabase-rest";

const factSchema=z.object({
  diseaseId:z.string().uuid().nullable().optional(), drugName:z.string().trim().min(1).max(200), drugNormalizedId:z.string().trim().max(200).optional(),
  factType:z.enum(["KNOWN_INDICATION","APPROVAL","ACTIVE_TRIAL","COMPETITOR_ASSET","NEGATIVE_TRIAL","SAFETY_SIGNAL","HUMAN_EXPOSURE","IP_CONSTRAINT","OTHER"]),
  sourceType:z.string().trim().max(100).optional(), sourceId:z.string().trim().max(200).optional(), sourceUrl:z.string().url().max(2000).optional(),
  factSummary:z.string().trim().min(3).max(5000), confidence:z.number().min(0).max(100).default(80), observedAt:z.string().date().optional(),
});

export async function GET(request:Request){
  try{assertResearchApiToken(request); const url=new URL(request.url); const drug=url.searchParams.get("drug"); const filter=drug?`&drug_name=ilike.${encodeURIComponent(drug)}`:""; const rows=await researchDb<unknown[]>(`candidate_landscape_facts?select=*&order=created_at.desc${filter}`); return NextResponse.json({count:rows.length,facts:rows});}
  catch(error){const status=(error as Error&{status?:number}).status??500; return NextResponse.json({error:error instanceof Error?error.message:"Landscape read failed"},{status});}
}

export async function POST(request:Request){
  try{assertResearchApiToken(request); const parsed=factSchema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"Invalid request",details:parsed.error.flatten()},{status:400}); const d=parsed.data; const rows=await researchDb<unknown[]>("candidate_landscape_facts",{method:"POST",prefer:"return=representation",body:{disease_id:d.diseaseId??null,drug_name:d.drugName,drug_normalized_id:d.drugNormalizedId??null,fact_type:d.factType,source_type:d.sourceType??null,source_id:d.sourceId??null,source_url:d.sourceUrl??null,fact_summary:d.factSummary,confidence:d.confidence,observed_at:d.observedAt??null}}); return NextResponse.json({ok:true,fact:rows[0]},{status:201});}
  catch(error){const status=(error as Error&{status?:number}).status??500; return NextResponse.json({error:error instanceof Error?error.message:"Landscape write failed"},{status});}
}
