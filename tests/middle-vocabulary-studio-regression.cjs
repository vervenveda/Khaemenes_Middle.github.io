#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),base="grades/vocabulary-studio/";
const html=fs.readFileSync(path.join(root,base,"index.html"),"utf8");
let total=0;
for(const grade of [6,7,8]){
 const file="grade-"+String(grade).padStart(2,"0")+"-weeks-05-36.json";
 assert(html.includes('fetch("'+file+'"'),"Studio must load "+file);
 const d=JSON.parse(fs.readFileSync(path.join(root,base,file),"utf8"));
 assert.equal(d.grade,grade);assert.equal(d.practiceOnly,true);
 assert.equal(Object.keys(d.weeks).length,32);
 for(let week=5;week<=36;week++){
  const terms=d.weeks[week];assert(Array.isArray(terms),"Missing Grade "+grade+" Week "+week);
  assert.equal(terms.length,6,"Grade "+grade+" Week "+week+" must contain six terms");
  assert.equal(new Set(terms.map(t=>t[0].toLowerCase())).size,6,"Duplicate terms");
  assert.equal(new Set(terms.map(t=>t[1].trim().toLowerCase())).size,6,"Duplicate answer definitions");
  for(const t of terms)assert(t.length===3&&t.every(v=>typeof v==="string"&&v.trim()),"Incomplete term");
  total+=6;
 }
 console.log("PASS Grade "+grade+" Weeks 05–36: 192 complete term placements");
}
assert.equal((html.match(/<option value="\d+">Week/g)||[]).length,36);
assert(html.includes('week.addEventListener("change",draw)'));
assert(html.includes('document.querySelectorAll(\'#questions input\').forEach(i=>i.disabled=true)'));
assert(html.includes('$("retry").addEventListener("click",newSet)'));
assert(html.includes('if(grade.value==="6"&&Number(week.value)>=5)draw()'),"Grade 6 loading must not reset another grade's attempt");
assert(html.includes('quiz=bank.length===6?shuffle(bank):[]'),"Incomplete banks cannot produce practice questions");
assert(html.includes('if(quiz.length!==6)return;'),"Scoring requires six valid questions");
assert(!/localStorage\.setItem|sessionStorage\.setItem/.test(html));
console.log("PASS middle school 3-grade vocabulary static regression: "+total+" additional placements; browser certification outstanding");
