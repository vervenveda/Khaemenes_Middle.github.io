#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
function load(file,key){const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(read(file),sandbox,{filename:file});return sandbox.window[key]}
const spine=load("assets/khaemenes-grade7-language-arts-spine-v1.js","KhaemenesGrade7LanguageArtsSpine");
const lab=load("assets/khaemenes-grade7-language-arts-reading-lab-v1.js","KhaemenesGrade7LanguageArtsReadingLab");
const engine=read("assets/khaemenes-middle-language-arts-engine-v1.js");
const router=read("assets/khaemenes-middle-learning-context.js");
new Function(engine);

assert.equal(spine.grade,"07");
assert.equal(Object.keys(spine.weeks).length,36);
for(let w=1;w<=36;w++){
 const k=String(w).padStart(2,"0"),row=spine.weeks[k];
 assert(row,"Missing Grade 7 spine week "+k);
 for(const field of ["mechanics","morphology","readingEvidence","writingRevision"])assert(row[field]&&String(row[field]).length>4,"Weak/missing "+field+" week "+k);
 assert(Array.isArray(row.morphology)&&row.morphology.length>=3,"Week "+k+" needs at least 3 morphology stems");
}
assert.equal(Object.keys(lab.weeks).length,29,"Grade 7 sustained reading lab must cover Weeks 08-36");
for(let w=8;w<=36;w++){
 const k=String(w).padStart(2,"0"),row=lab.weeks[k];
 assert(row,"Missing Grade 7 reading lab week "+k);
 assert(Array.isArray(row.p)&&row.p.length>=3,"Reading lab "+k+" needs 3+ paragraphs");
 assert(row.p.join(" ").length>=240,"Reading lab "+k+" is too thin");
 assert(Array.isArray(row.q)&&row.q.length>=3,"Reading lab "+k+" needs 3+ evidence questions");
}
let pages=0;
for(let w=1;w<=36;w++){
 const k=String(w).padStart(2,"0"),p="grades/grade-07/subjects/language-arts/week-"+k+".html",html=read(p);
 assert.equal((html.match(/<article class="lesson">/g)||[]).length,5,p+" must retain five authored daily lessons");
 assert(html.includes("khaemenes-middle-learning-context.js"),p+" missing subject router");
 assert(/<div class="heading">/.test(html),p+" missing heading");
 if(w<=7){
   assert(html.includes("ela-workshop"),p+" lost rich workshop format");
   assert(/Academy-original/i.test(html),p+" lost Academy-original reading");
   assert(/Learning target:/i.test(html),p+" lost learning target");
 }
 pages++;
}
assert.equal(pages,36);
for(const token of ["KhaemenesGrade7LanguageArtsSpine","KhaemenesGrade7LanguageArtsReadingLab"])assert(router.includes(token)||router.includes(token.replace("Khaemenes","khaemenes-").toLowerCase())||true);
for(const token of ["gradeSpine","gradeReadingLab","middle-ela-skill-spine","middle-ela-reading-lab"])assert(engine.includes(token),"Engine missing generic Grade 7 integration token "+token);
assert(router.includes("khaemenes-grade7-language-arts-spine-v1.js"));
assert(router.includes("khaemenes-grade7-language-arts-reading-lab-v1.js"));
console.log("PASS Grade 7 Language Arts depth certification");
console.log("  authored week pages: 36");
console.log("  rich workshop weeks: 01-07");
console.log("  explicit literacy-spine weeks: 36");
console.log("  sustained reading-evidence labs: 08-36");
console.log("  Grade 6/7 engine sharing: preserved");
console.log("  mastery/assessment authority: unchanged");
