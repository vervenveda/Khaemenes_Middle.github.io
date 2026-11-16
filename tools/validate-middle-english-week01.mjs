/* Khaemenes Academy — Middle School English 6–8 Week 01 regression.
   Run: node tools/validate-middle-english-week01.mjs
   Read-only static checks; never touches real student records. */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(file)=>fs.readFileSync(path.join(root,file),"utf8");
const css=read("assets/khaemenes-middle-ela-week01.css");
assert.match(css,/font:400 17px/);
assert.match(css,/border-radius:7px/);
assert.match(css,/\.ela-workshop/);
const named=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const genres={
  6:["The Missing Map Key","Planning Without Guesswork","Observations","inferences"],
  7:["Riverbend Library Pilot","Two Voices at Riverbend","voluntary survey","counterclaim"],
  8:["Cedar Brook Observation Memo","Concerned Editorial","Project Weather Note","oral"]
};
for(const grade of [6,7,8]){
 const base="grades/grade-0"+grade+"/";
 const page=read(base+"subjects/language-arts/week-01.html");
 const course=JSON.parse(read(base+"data/course-data.json"));
 assert.equal(course.weeks.length,36,"English "+grade+" keeps 36-week course architecture");
 assert.equal((page.match(/<article class="lesson">/g)||[]).length,5,"English "+grade+" must retain five daily lesson cards");
 assert.equal((page.match(/<details class="ela-workshop"/g)||[]).length,5);
 assert.equal((page.match(/<h5>Student practice<\/h5>/g)||[]).length,5);
 assert.equal((page.match(/<li>/g)||[]).length,20);
 assert.equal((page.match(/<details class="ela-week-mentor"/g)||[]).length,5);
 assert.equal((page.match(/<p class="ela-deliverable"/g)||[]).length,5);
 assert.match(page,/khaemenes-middle-ela-week01\.css/);
 assert.match(page,/khaemenes-middle-learning-ledger\.js/);
 assert.match(page,/khaemenes-middle-question-factory\.js/);
 assert.match(page,/href="\.\.\/\.\.\/printables\/week-01-packet\.html"/);
 assert.match(page,/href="\.\.\/\.\.\/weekly-plans\/week-01\.html"/);
 assert.doesNotMatch(page,/Name the subject:/,"Generic template must not return");
 for(const day of named)assert.match(page,new RegExp(day+"[^<]*"),"English "+grade+" missing "+day);
 for(const term of genres[grade])assert.ok(page.toLowerCase().includes(term.toLowerCase()),"English "+grade+" missing "+term);
 assert.match(page,/never replace the verified 80% Academy assessment engine/i);
 console.log("PASS English "+grade+": 5 original lessons · 20 specific tasks · 5 evidence records · learning engine preserved");
}
for(const grade of [7,8]){
 const base="grades/grade-0"+grade+"/";
 const app=read(base+"assets/app.js");
 const certificate=read(base+"assets/certificate.js");
 assert.doesNotMatch(app,/state\.portfolio\s*=\s*\$\("portfolio"\)\.checked/,"Student cannot approve their own portfolio");
 assert.match(app,/state\.portfolio=!!latest\.portfolio/);
 assert.match(app,/\$\("portfolio"\)\.disabled=true/);
 assert.match(app,/state\.assessmentMeta=latest\.assessmentMeta/);
 assert.match(app,/state\.weekly=\{\.\.\.\(latest\.weekly\|\|\{\}\)\}/);
 assert.match(certificate,/context\.status==="ready"/);
 assert.match(certificate,/if\(!placementOK\)/);
 if(grade===8){
   assert.doesNotMatch(app,/state\.transition\s*=\s*\$\("transition"\)\.checked/);
   assert.match(app,/state\.transition=!!latest\.transition/);
   assert.match(app,/\$\("transition"\)\.disabled=true/);
 }
 console.log("PASS English "+grade+" course gate: student approval controls read-only and verified results preserved");
}
console.log("PASS Middle School English 6–8 phase-one regression checks");
