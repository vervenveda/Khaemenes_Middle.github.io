#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const engine=read("assets/khaemenes-middle-social-studies-engine-v1.js");
const css=read("assets/khaemenes-middle-social-studies-engine-v1.css");
const router=read("assets/khaemenes-middle-learning-context.js");
const contract=JSON.parse(read("workflow/engines/social-studies/engine-contract-v1.json"));
new Function(engine);
for(const token of ["Question","Source","Context","Corroborate","Map/Data","Claim","Counterclaim","Qualify","authoritative:false","affectsGrade:false","unlocksCurriculum:false","changesPlacement:false"])assert(engine.includes(token),"Social Studies engine missing "+token);
for(const token of ["khaemenes-middle-social-studies-engine-v1.css","khaemenes-middle-social-studies-engine-v1.js","subjects\\/social-studies"])assert(router.includes(token),"Social Studies router missing "+token);
assert.equal(contract.middleSchoolAuthority.totalWeekSurfaces,108);
for(const key of ["masteryAuthority","assessmentAuthority","affectsGrade","unlocksCurriculum","changesPlacement"])assert.equal(contract.boundaries[key],false,key+" boundary drift");
assert(css.includes("middle-ss-engine-routine")&&css.includes("font-size:16px"),"Social Studies engine style contract incomplete");

let pages=0;
for(const g of ["06","07","08"]){
 for(let w=1;w<=36;w++){
   const p="grades/grade-"+g+"/subjects/social-studies/week-"+String(w).padStart(2,"0")+".html";
   assert(fs.existsSync(path.join(root,p)),"Missing Social Studies week: "+p);
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
 assert(!engine.includes(forbidden),"Social Studies engine must not claim assessment/mastery authority: "+forbidden);
}
console.log("PASS Middle School Social Studies engine: 108 curriculum weeks · High-School-derived inquiry workflow · 5 daily stages · learner-scoped inquiry notes · qualified evidence reasoning · no mastery or assessment authority.");
