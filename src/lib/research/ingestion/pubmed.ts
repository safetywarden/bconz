import type { IngestionResult, NormalizedEvidence } from "./types";

type ESearchResponse={esearchresult?:{idlist?:string[]}}; type ESummaryItem={uid?:string;title?:string;pubdate?:string;source?:string;sortfirstauthor?:string}; type ESummaryResponse={result?:Record<string,ESummaryItem|string[]>};
const MONTHS:Record<string,string>={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
function normalizePubmedDate(pubdate?:string){if(!pubdate)return undefined;const m=pubdate.trim().match(/^(\d{4})(?:\s+([A-Z][a-z]{2}))?(?:\s+(\d{1,2}))?/);if(!m)return undefined;const[,y,mt,d]=m;if(!mt)return`${y}-01-01`;const mo=MONTHS[mt];if(!mo)return`${y}-01-01`;return`${y}-${mo}-${d?d.padStart(2,"0"):"01"}`;}
function classifyPubmedEvidence(title:string):NormalizedEvidence["evidenceClass"]{const t=title.toLowerCase();if(t.includes("randomized")||t.includes("randomised")||t.includes("phase 3")||t.includes("phase iii"))return"E1";if(t.includes("prospective"))return"E3";if(t.includes("retrospective")||t.includes("cohort"))return"E4";if(t.includes("case report")||t.includes("case series"))return"E5";return"E6";}
async function searchPubmed(term:string,limit:number){const url=`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&sort=relevance&retmax=${limit}&term=${encodeURIComponent(term)}`;const r=await fetch(url,{cache:"no-store"});if(!r.ok)throw new Error(`PubMed search failed (${r.status})`);const p=await r.json() as ESearchResponse;return p.esearchresult?.idlist??[];}

export async function ingestPubmedDisease(diseaseName:string,limit=20):Promise<IngestionResult>{
  // Retrieval v2: preserve broad disease recall and add a therapeutic/repurposing lane.
  const diseaseTerm=`"${diseaseName}"[Title/Abstract]`;
  const therapeuticTerm=`"${diseaseName}"[Title/Abstract] AND (drug OR treatment OR therapy OR therapeutic OR repurposing OR pharmacological OR chaperone OR trial OR inhibitor OR agonist OR antagonist)`;
  const [broadIds,therapeuticIds]=await Promise.all([searchPubmed(diseaseTerm,limit),searchPubmed(therapeuticTerm,limit)]);
  const ids=[...new Set([...therapeuticIds,...broadIds])].slice(0,Math.min(limit*2,80));
  if(!ids.length)return{source:"PUBMED",diseaseName,fetched:0,normalized:[]};
  const summaryUrl=`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(",")}`;const response=await fetch(summaryUrl,{cache:"no-store"});if(!response.ok)throw new Error(`PubMed summary failed (${response.status})`);const summary=await response.json() as ESummaryResponse;
  const therapeuticSet=new Set(therapeuticIds);
  const normalized:NormalizedEvidence[]=ids.flatMap(id=>{const item=summary.result?.[id];if(!item||Array.isArray(item)||typeof item!=="object")return[];const title=item.title?.trim();if(!title)return[];const therapeutic=therapeuticSet.has(id);return[{diseaseName,sourceType:"PUBMED" as const,sourceId:id,sourceUrl:`https://pubmed.ncbi.nlm.nih.gov/${id}/`,title,publicationDate:normalizePubmedDate(item.pubdate),population:undefined,extractedClaim:`${therapeutic?"Therapeutic-retrieval signal. ":""}${title}`,evidenceClass:classifyPubmedEvidence(title),confidence:therapeutic?68:60}];});
  return{source:"PUBMED",diseaseName,fetched:ids.length,normalized};
}
