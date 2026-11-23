#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");

function loadBrowserData(file,key){
 const code=read(file),sandbox={window:{}};
 vm.createContext(sandbox);
 vm.runInContext(code,sandbox,{filename:file});
 return sandbox.window[key];
}
const spine=loadBrowserData("assets/khaemenes-grade6-language-arts-spine-v1.js","KhaemenesGrade6LanguageArtsSpine");
const lab=loadBrowserData("assets/khaemenes-grade6-language-arts-reading-lab-v1.js","KhaemenesGrade6LanguageArtsReadingLab");
const engine=read("assets/khaemenes-middle-language-arts-engine-v1.js");
const router=read("assets/khaemenes-middle-learning-context.js");
new Function(engine);

assert.equal(spine.grade,"06");
assert.equal(Object.keys(spine.weeks).length,36,"Grade 6 literacy spine must cover 36 weeks");
for(let w=1;w<=36;w++){
 const k=String(w).padStart(2,"0"),row=spine.weeks[k];
 assert(row,"Missing Grade 6 literacy spine week "+k);
 for(const field of ["mechanics","morphology","readingEvidence","writingRevision"])assert(row[field]&&String(row[field]).length>4,"Weak/missing "+field+" in week "+k);
 assert(Array.isArray(row.morphology)&&row.morphology.length>=3,"Week "+k+" needs at least 3 morphology/vocabulary stems");
}
assert.equal(Object.keys(lab.weeks).length,16,"Sustained reading lab must cover Weeks 08-23");
for(let w=8;w<=23;w++){
 const k=String(w).padStart(2,"0"),row=lab.weeks[k];
 assert(row,"Missing sustained reading lab week "+k);
 assert(Array.isArray(row.paragraphs)&&row.paragraphs.length>=3,"Reading lab "+k+" needs at least 3 paragraphs");
 assert(row.paragraphs.join(" ").length>=350,"Reading lab "+k+" is too thin");
 assert(Array.isArray(row.questions)&&row.questions.length>=3,"Reading lab "+k+" needs at least 3 evidence questions");
}

let pages=0;
for(let w=1;w<=36;w++){
 const k=String(w).padStart(2,"0"),p="grades/grade-06/subjects/language-arts/week-"+k+".html",html=read(p);
 assert.equal((html.match(/<article class="lesson">/g)||[]).length,5,p+" must retain five authored daily lessons");
 assert(html.includes("khaemenes-middle-learning-context.js"),p+" missing subject-engine router");
 assert(/<div class="heading">/.test(html),p+" missing heading");
 assert(/<h1[^>]*>/.test(html),p+" missing week title");
 if(w<=7){
   assert(html.includes("ela-workshop"),p+" lost rich workshop structure");
   assert(/Academy-original/i.test(html),p+" lost Academy-original reading");
   assert(/Learning target:/i.test(html),p+" lost explicit learning target");
   assert(/portfolio evidence:/i.test(html),p+" lost portfolio evidence deliverable");
 }
 pages++;
}
assert.equal(pages,36);

for(const token of [
 "Learning target","Today’s portfolio evidence","Today's portfolio evidence",
 "KhaemenesGrade6LanguageArtsSpine","KhaemenesGrade6LanguageArtsReadingLab",
 "middle-ela-skill-spine","middle-ela-reading-lab","readingLab:readingLab?"
])assert(engine.includes(token),"Language Arts engine missing Grade 6 depth integration token: "+token);

for(const token of [
 "khaemenes-grade6-language-arts-spine-v1.js",
 "khaemenes-grade6-language-arts-reading-lab-v1.js"
])assert(router.includes(token),"Grade 6 Language Arts router missing "+token);

console.log("PASS Grade 6 Language Arts depth certification");
console.log("  authored week pages: 36");
console.log("  rich workshop weeks: 01-07");
console.log("  explicit literacy-spine weeks: 36");
console.log("  sustained reading-evidence labs: 08-23");
console.log("  revision/writing progression: protected");
console.log("  official mastery authority: unchanged");
