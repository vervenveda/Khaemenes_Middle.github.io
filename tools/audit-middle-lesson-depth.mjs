/** Khaemenes Academy — non-destructive instructional-depth audit.
 * Usage: node tools/audit-middle-lesson-depth.mjs
 * Reports concerns; deliberately does NOT fail CI because existing pages are being upgraded incrementally.
 */
import fs from "node:fs";
import path from "node:path";
const grades=["06","07","08"];
const subjectSlugs=["language-arts","mathematics","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
const findings=[];
const counts={total:0,thinTemplate:0,repeatedFocus:0,missingDailySequence:0};
const strip=s=>s.replace(/<[^>]*>/g," ").replace(/&(?:amp|quot|apos|#39);/g," ").replace(/\s+/g," ").trim();
for(const grade of grades)for(const subject of subjectSlugs)for(let week=1;week<=36;week++){
  const rel=`grades/grade-${grade}/subjects/${subject}/week-${String(week).padStart(2,"0")}.html`;
  if(!fs.existsSync(rel)){findings.push({path:rel,issue:"missing-file"});continue;}
  counts.total++;
  const html=fs.readFileSync(rel,"utf8");
  const articles=[...html.matchAll(/<article class="lesson">([\s\S]*?)<\/article>/g)].map(m=>strip(m[1]));
  const subjects=[...html.matchAll(/<strong>Focus:<\/strong>\s*([^<]+)/g)].map(m=>strip(m[1]).toLowerCase());
  const templateHits=articles.filter(s=>s.includes("Introduce the subject focus, connect the essential question")||s.includes("Name the subject:")).length;
  const flags=[];
  if(templateHits>=3){counts.thinTemplate++;flags.push("generic-repeated-teacher-script");}
  if(subjects.length>=4&&new Set(subjects).size===1&&templateHits>=3){counts.repeatedFocus++;flags.push("unchanged-focus-across-days");}
  if(articles.length<5){counts.missingDailySequence++;flags.push("fewer-than-five-daily-articles");}
  if(flags.length)findings.push({path:rel,issues:flags});
}
const output={scope:"Middle School Grades 06–08 subject-week lessons",counts,flagged:findings.length,findings};
const json=JSON.stringify(output,null,2);
if(process.argv.includes("--json"))process.stdout.write(json+"\n");
else{
  console.log("Middle School lesson-depth scan",JSON.stringify(counts));
  console.log("Flagged files:",findings.length);
  findings.slice(0,30).forEach(f=>console.log(f.path, (f.issues||[f.issue]).join(",")));
  if(findings.length>30)console.log(`... ${findings.length-30} additional items; run with --json for full report.`);
}
