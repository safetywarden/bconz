import { NextResponse } from "next/server";
import { z } from "zod";
import { assertResearchApiToken } from "@/lib/research/auth";
import { rankGeneratedCandidatesV2 } from "@/lib/research/candidate-ranking-v2";

const schema=z.object({diseaseName:z.string().trim().min(2).max(200).optional()});

export async function POST(request:Request){
  try{
    assertResearchApiToken(request);
    const parsed=schema.safeParse(await request.json().catch(()=>({})));
    if(!parsed.success)return NextResponse.json({error:"Invalid request",details:parsed.error.flatten()},{status:400});
    const result=await rankGeneratedCandidatesV2(parsed.data.diseaseName);
    return NextResponse.json({version:"CRN-2.0",...result});
  }catch(error){
    const status=(error as Error&{status?:number}).status??500;
    return NextResponse.json({error:error instanceof Error?error.message:"Candidate ranking failed"},{status});
  }
}
