import { researchDb } from "./supabase-rest";

type Study={protocolSection?:{identificationModule?:{nctId?:string};armsInterventionsModule?:{interventions?:Array<{name?:string;type?:string;otherNames?:string[]}>}}};
type CtgovResponse={studies?:Study[]}; type EvidenceRow={id:string;source_id:string|null};
const allowedTypes=new Set(["DRUG","BIOLOGICAL"]);
const normalize=(v:string)=>v.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();

export async function persistClinicalTrialInterventionSignals(diseaseName:string,limit=20){
  const diseases=await researchDb<Array<{id:string}>>(`research_diseases?canonical_name=eq.${encodeURIComponent(diseaseName)}&select=id`);const diseaseId=diseases[0]?.id;if(!diseaseId)return{interventions:0,relations:0};
  const url=`https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(diseaseName)}&pageSize=${Math.min(limit,100)}&format=json`;const response=await fetch(url,{cache:"no-store"});if(!response.ok)return{interventions:0,relations:0};const payload=await response.json() as CtgovResponse;
  const evidenceRows=await researchDb<EvidenceRow[]>(`research_evidence?disease_id=eq.${diseaseId}&source_type=eq.CLINICAL_TRIALS&select=id,source_id`);const evidenceByNct=new Map(evidenceRows.flatMap(r=>r.source_id?[[r.source_id,r.id] as const]:[]));
  const rows:Array<Record<string,unknown>>=[];const seen=new Set<string>();let interventions=0;
  for(const study of payload.studies??[]){const nctId=study.protocolSection?.identificationModule?.nctId;const evidenceId=nctId?evidenceByNct.get(nctId):undefined;if(!evidenceId)continue;for(const intervention of study.protocolSection?.armsInterventionsModule?.interventions??[]){const type=intervention.type?.toUpperCase();const name=intervention.name?.trim();if(!name||!type||!allowedTypes.has(type))continue;const names=[name,...(intervention.otherNames??[])].filter(Boolean);const canonical=names[0];const key=`${evidenceId}|${normalize(canonical)}`;if(seen.has(key))continue;seen.add(key);interventions++;rows.push({evidence_id:evidenceId,relation_type:"TRIAL_INTERVENTION",entity1_type:"DRUG",entity1_id:"",entity1_text:canonical,entity2_type:"DISEASE",entity2_id:"",entity2_text:diseaseName,source:"CLINICALTRIALS_V2"});}}
  if(rows.length)await researchDb<unknown>("research_evidence_relations?on_conflict=evidence_id,relation_type,entity1_id,entity1_text,entity2_id,entity2_text",{method:"POST",body:rows,prefer:"resolution=merge-duplicates,return=minimal"});
  return{interventions,relations:rows.length};
}
