#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const engine=read("assets/khaemenes-middle-language-arts-engine-v1.js");
const css=read("assets/khaemenes-middle-language-arts-engine-v1.css");
const router=read("assets/khaemenes-middle-learning-context.js");
const contract=JSON.parse(read("workflow/engines/language-arts/engine-contract-v1.json"));
new Function(engine);
for(const token of ["Read","Annotate","Analyze","Draft","Revise","Defend","learner-scoped","authoritative:false","affectsGrade:false","unlocksCurriculum:false","changesPlacement:false"])assert(engine.includes(token),"Language Arts engine missing "+token);
for(const token of ["khaemenes-middle-language-arts-engine-v1.css","khaemenes-middle-language-arts-engine-v1.js","subjects\\/language-arts"])assert(router.includes(token),"Language Arts router missing "+token);
assert.equal(contract.middleSchoolAuthority.totalWeekSurfaces,108);
assert.equal(contract.boundaries.masteryAuthority,false);
assert.equal(contract.boundaries.assessmentAuthority,false);
assert.equal(contract.boundaries.affectsGrade,false);
assert.equal(contract.boundaries.unlocksCurriculum,false);
assert.equal(contract.boundaries.changesPlacement,false);
assert(css.includes("middle-ela-engine-routine")&&css.includes("font-size:16px"),"Language Arts engine style contract incomplete");

let pages=0;
for(const g of ["06","07","08"]){
 for(let w=1;w<=36;w++){
   const p="grades/grade-"+g+"/subjects/language-arts/week-"+String(w).padStart(2,"0")+".html";
   assert(fs.existsSync(path.join(root,p)),"Missing Language Arts week: "+p);
   const html=read(p);
   assert.equal((html.match(/<article class="lesson">/g)||[]).length,5,p+" must retain five daily lessons");
   assert(html.includes("khaemenes-middle-learning-context.js"),p+" missing subject-engine router");
   assert(html.includes("KHAEMENES_MIDDLE_LEARNING_ENGINE_V1"),p+" lost shared Middle learning engine marker");
   assert(/<div class="heading">/.test(html),p+" lost curriculum heading");
   pages++;
 }
}
assert.equal(pages,108);
for(const forbidden of ["state.weekly[","state.midterm=","state.final=","verifiedBy:","PASS=80"]){
 assert(!engine.includes(forbidden),"Language Arts engine must not claim assessment/mastery authority: "+forbidden);
}
console.log("PASS Middle School Language Arts engine: 108 curriculum weeks · High-School-derived evidence workflow · 5 daily stages · learner-scoped drafts · revision/export · no mastery or assessment authority.");
