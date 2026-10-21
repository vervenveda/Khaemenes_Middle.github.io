import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const base="grades/grade-06";
const subjects=["language-arts","mathematics","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
const pad=n=>String(n).padStart(2,"0");
const read=p=>fs.readFileSync(p,"utf8");
const isFile=p=>fs.existsSync(p)&&fs.statSync(p).isFile();
const checkLink=(origin,target)=>{
 if(!target || /^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(target))return;
 const resolved=path.resolve(path.dirname(origin),target.split(/[?#]/)[0]);
 assert(isFile(resolved),`Broken local link ${origin} -> ${target}`);
};
let companionCount=0,lessonCount=0;
for(let w=1;w<=36;w++){
 const n=pad(w);
 const plan=`${base}/weekly-plans/week-${n}.html`;
 const packet=`${base}/printables/week-${n}-packet.html`;
 const exam=`${base}/assessments/week-${n}-assessment.html`;
 for(const file of [plan,packet,exam])assert(isFile(file),`Missing Week ${n} route: ${file}`);
 const planHtml=read(plan),packetHtml=read(packet),examHtml=read(exam);
 assert(planHtml.includes(`week-${n}-packet.html`),`Week ${n} plan lacks packet navigation`);
 assert(planHtml.includes(`week-${n}-assessment.html`),`Week ${n} plan lacks exam navigation`);
 assert(/Khaemenes Academy/i.test(packetHtml),`Week ${n} packet lacks Academy identity`);
 assert(/Student:|Student Name:|Name:/i.test(packetHtml),`Week ${n} packet lacks student field`);
 assert(/Date:/i.test(packetHtml),`Week ${n} packet lacks date field`);
 assert(/<script|assessment/i.test(examHtml),`Week ${n} exam has no assessment implementation marker`);
 for(const sub of subjects){
   const file=`${base}/subjects/${sub}/week-${n}.html`;
   assert(isFile(file),`Missing Week ${n} subject hall: ${sub}`);
   const html=read(file);
   const count=(html.match(/<article class="lesson">/g)||[]).length;
   assert(count>=5,`Week ${n} ${sub} has only ${count} lessons`);
   lessonCount+=count;
 }
 const companion=`${base}/printables/week-${n}-subject-evidence.html`;
 if(isFile(companion)){
   companionCount++;
   const h=read(companion);
   assert((h.match(/<h2>Original lesson evidence<\/h2>/g)||[]).length===9,`Week ${n} companion requires nine subject evidence prompts`);
   assert(packetHtml.includes(`week-${n}-subject-evidence.html`),`Week ${n} companion is orphaned from packet`);
 }
 for(const [file,html] of [[plan,planHtml],[packet,packetHtml]]){
  for(const link of html.matchAll(/\bhref=["']([^"']+)["']/g))checkLink(file,link[1]);
 }
}
console.log(`Grade 6 full-journey safeguards passed: 36 plans, packets and exams; 324 subject-week halls; ${lessonCount} lesson blocks; ${companionCount} connected nine-subject companions. Companion expansion remains progressive.`);
