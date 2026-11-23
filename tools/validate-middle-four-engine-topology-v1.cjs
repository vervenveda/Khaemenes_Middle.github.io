#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8"),exists=p=>fs.existsSync(path.join(root,p));
const manifest=JSON.parse(read("workflow/engines/four-subject-engine-topology-v1.json"));
const router=read("assets/khaemenes-middle-learning-context.js");
const files={
 math:["assets/khaemenes-middle-math-week-practice-v1.js"],
 science:["assets/khaemenes-middle-science-instruction-engine-v1.js"],
 ela:["assets/khaemenes-middle-language-arts-engine-v1.js"],
 ss:["assets/khaemenes-middle-social-studies-engine-v1.js"]
};
for(const list of Object.values(files))for(const p of list)assert(exists(p),"Missing engine runtime: "+p);
for(const p of Object.values(files).flat())new Function(read(p));

const routes=[
 ["mathematics","khaemenes-middle-math-week-practice-v1.js"],
 ["science","khaemenes-middle-science-instruction-engine-v1.js"],
 ["language-arts","khaemenes-middle-language-arts-engine-v1.js"],
 ["social-studies","khaemenes-middle-social-studies-engine-v1.js"]
];
for(const [subject,file] of routes){
 assert(router.includes("subjects\\/"+subject),"Router missing route isolation for "+subject);
 assert(router.includes(file),"Router missing "+subject+" runtime "+file);
}
assert.equal(manifest.sharedLayer.ownsPedagogy,false);
assert.equal(manifest.sharedLayer.ownsMastery,false);
assert.equal(manifest.sharedLayer.ownsAssessment,false);
assert.equal(manifest.authorityBoundaries.subjectEnginesMayWriteMastery,false);
assert.equal(manifest.authorityBoundaries.subjectEnginesMayChangePlacement,false);
assert.equal(manifest.authorityBoundaries.subjectEnginesMayOwnChrome,false);

const engines={
 mathematics:read(files.math[0]),
 science:read(files.science[0]),
 "language-arts":read(files.ela[0]),
 "social-studies":read(files.ss[0])
};
const forbiddenBySubject={
 mathematics:["middle-science-engine","middle-language-arts-engine","middle-social-studies-engine"],
 science:["middle-ela-engine","middle-ss-engine","middle-math-course"],
 "language-arts":["middle-science-engine","middle-ss-engine","middle-math-course"],
 "social-studies":["middle-science-engine","middle-ela-engine","middle-math-course"]
};
for(const [subject,src] of Object.entries(engines)){
 for(const token of forbiddenBySubject[subject])assert(!src.includes(token),subject+" engine leaks foreign pedagogy token "+token);
}

let surfaces=0;
for(const g of ["06","07","08"]){
 for(const subject of ["mathematics","science","language-arts","social-studies"]){
  for(let w=1;w<=36;w++){
   const p="grades/grade-"+g+"/subjects/"+subject+"/week-"+String(w).padStart(2,"0")+".html";
   assert(exists(p),"Missing core subject surface: "+p);
   const html=read(p);
   assert(html.includes("khaemenes-middle-learning-context.js"),p+" missing subject router");
   assert.equal((html.match(/<article class="lesson">/g)||[]).length,5,p+" must retain five curriculum days");
   surfaces++;
  }
 }
}
assert.equal(surfaces,432);

const science=engines.science;
for(const token of ["storage:false","mastery:false","assessmentAuthority:false","chrome:false","Observe & Prepare","Model & Explain","Investigate & Analyze","Check & Revise","CER & Transfer"])assert(science.includes(token),"Science contract missing "+token);
for(const src of [engines.science,engines["language-arts"],engines["social-studies"]]){
 for(const forbidden of ["state.weekly[","state.midterm=","state.final=","verifiedBy:","PASS=80"])assert(!src.includes(forbidden),"Subject engine claims protected mastery authority: "+forbidden);
}

const legacy=["grade-06-math-chrome.js","grade-07-math-translator-tools-v1.js","grade-07-mathematics-studio-v1.js"];
const textFiles=[];
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules"].includes(e.name))continue;
  const f=path.join(dir,e.name);
  if(e.isDirectory())walk(f);
  else if(/\.(?:html|js|mjs|cjs|json|md|yml|yaml|css)$/i.test(e.name))textFiles.push(f);
 }
}
walk(root);
const legacyRefs={};
for(const name of legacy){
 const refs=[];
 for(const f of textFiles){
   if(path.basename(f)===name)continue;
   let src;try{src=fs.readFileSync(f,"utf8")}catch{continue}
   if(src.includes(name))refs.push(path.relative(root,f).split(path.sep).join("/"));
 }
 legacyRefs[name]=refs;
}
console.log("Middle four-engine topology: PASS");
console.log("  core subject week surfaces: "+surfaces);
console.log("  engine owners: mathematics, science, language-arts, social-studies");
console.log("  shared context role: router/context only");
console.log("  legacy math helper references: "+JSON.stringify(legacyRefs));
