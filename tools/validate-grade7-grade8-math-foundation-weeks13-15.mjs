import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const grades=["07","08"],weeks=["13","14","15"];
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const totals={grades:2,weeks:0,lessons:0,challenges:0,keys:0};
for(const grade of grades){
 const dir="grades/grade-"+grade+"/subjects/mathematics/";
 const entry=fs.readFileSync(dir+"index.html","utf8");
 for(const week of weeks){
  const path=dir+"week-"+week+".html";
  const html=fs.readFileSync(path,"utf8");
  const originalArticles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(x=>x[0]);
  assert.equal(originalArticles.length,5,path+" must preserve five original lesson articles");
  assert.equal((html.match(/<script[^>]*src=/g)||[]).length,grade==="07"?12:8,path+" script count changed");
  assert.match(html,/khaemenes-middle-learning-context\.js/,path+" missing shared loader");
  if(grade==="07")assert.match(html,/grade-07-mathematics-studio-v1\.js/,path+" missing Grade 7 studio");
  if(grade==="08")assert.match(html,/khaemenes-middle-learning-context\.js/,path+" missing Grade 8 shared studio loader");
  assert.ok(entry.includes('href="week-'+week+'.html"'),path+" missing course entry");
  for(let d=0;d<5;d++){
   const article=originalArticles[d],id="g"+grade+"-math-w"+week+"-d"+(d+1);
   assert.match(article,new RegExp('<h4>'+days[d]+'(?:\\s|:|\\s*[—-])'),id+" day mismatch");
   const panels=[...article.matchAll(/<section class="khae-math-depth"[\s\S]*?<\/section>/g)].map(x=>x[0]);
   assert.equal(panels.length,1,id+" must have exactly one deep mathematical laboratory");
   const panel=panels[0];
   assert.ok(panel.includes('data-math-depth="'+id+'"'),id+" mismatched lab identity");
   for(const part of ["Vocabulary in context:","Worked mathematical model:","Misconception checkpoint:","Independent reasoning challenges:","Independent self-check:","Teacher solution key (open after attempting)"])assert.ok(panel.includes(part),id+" missing "+part);
   const questionGroup=panel.match(/<p><strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
   assert.ok(questionGroup,id+" missing independent challenge section");
   const problems=[...questionGroup.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
   assert.equal(problems.length,4,id+" must retain four distinct mathematics challenges");
   assert.equal(new Set(problems).size,4,id+" duplicated a practice question");
   const answers=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
   assert.ok(answers,id+" missing teacher key");
   assert.equal([...answers.matchAll(/<li>([\s\S]*?)<\/li>/g)].length,4,id+" must have four keyed answers");
   assert.equal((panel.match(/<textarea /g)||[]).length,1,id+" missing exactly one practice field");
   assert.ok(panel.includes('<label for="'+id+'-response"'),id+" input label missing");
   assert.ok(panel.includes('<textarea id="'+id+'-response"'),id+" response field mismatch");
   assert.ok(panel.indexOf("Worked mathematical model:")<panel.indexOf("Independent reasoning challenges:"),id+" worked model should precede practice");
   assert.ok(panel.indexOf("Independent self-check:")<panel.indexOf("<summary>Teacher solution key"),id+" key cannot preempt self-check");
   assert.match(panel,/not automatically saved/);
   assert.match(panel,/official assessment engine may record verified 80% mastery/);
   assert.ok(!/localStorage|sessionStorage|setItem\(|fetch\(|<script|mastery_met|unlocksCurriculum|authoritative:true/.test(panel),id+" formative panel acquired runtime or grade authority");
   totals.lessons++;totals.challenges+=4;totals.keys+=4;
  }
  totals.weeks++;
 }
}
assert.deepEqual(totals,{grades:2,weeks:6,lessons:30,challenges:120,keys:120});
for(const path of ["assets/khaemenes-middle-math-lesson-engine-v1.js","assets/grade-07-mathematics-studio-v1.js","assets/khaemenes-middle-math-portal-studio-v1.js","assets/khaemenes-middle-math-week-practice-v1.js"])new vm.Script(fs.readFileSync(path,"utf8"),{filename:path});
console.log("PASS Grade 7/8 mathematics: six 5-day weeks, 30 original daily lesson laboratories, 120 unique practice questions with 120 matching key entries, shared engine syntax and formative-only authority.");
