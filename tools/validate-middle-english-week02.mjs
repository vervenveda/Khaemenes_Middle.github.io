/* Khaemenes Academy · Grade 6–8 English Week 02 parity regression.
   Run: node tools/validate-middle-english-week02.mjs
   Read-only static checks; student records are never accessed. */
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=relative=>fs.readFileSync(path.join(root,relative),"utf8");
const style=read("assets/khaemenes-middle-ela-week01.css");
assert.match(style,/\.ela-week-guide/);
assert.match(style,/\.lesson\s/);
assert.match(style,/\.ela-workshop/);
assert.match(style,/font:400 17px/);
const expectations={
  6:{
    title:"Evidence, Annotation, and Ratios",
    reading:["The Window Garden","What a Fair Comparison Shows"],
    domains:["purposeful annotation","quotation","paraphrase","ratio"],
    writing:"140–190"
  },
  7:{
    title:"Cited Evidence and Proportional Thinking",
    reading:["The Routes We Share","Route Survey Numbers","A Quick Vote?"],
    domains:["theme","central idea","proportions","counterclaim"],
    writing:"190–260"
  },
  8:{
    title:"Strongest Evidence and Linear Relationships",
    reading:["The Evening Media Lab","Four Weeks of Visits","The Numbers Never Lie?"],
    domains:["strongest","linear","synthesis","oral defense"],
    writing:"250–350"
  }
};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
for(const [raw,expected] of Object.entries(expectations)){
  const grade=Number(raw);
  const prefix="grades/grade-0"+grade+"/";
  const lesson=read(prefix+"subjects/language-arts/week-02.html");
  const prior=read(prefix+"subjects/language-arts/week-01.html");
  const overview=read(prefix+"weekly-plans/week-02.html");
  const data=JSON.parse(read(prefix+"data/course-data.json"));
  assert.equal(data.weeks.length,36,"Grade "+grade+" keeps 36-week architecture");
  assert.ok(lesson.includes(expected.title),"Lesson title must match");
  assert.ok(overview.includes(expected.title),"Existing weekly plan title must match");
  assert.equal((lesson.match(/<article class="lesson">/g)||[]).length,5,"Five daily lessons");
  assert.equal((lesson.match(/<details class="ela-workshop"/g)||[]).length,5,"Five expandable days");
  assert.equal((lesson.match(/<h5>Student practice<\/h5>/g)||[]).length,5,"Five practice sections");
  assert.equal((lesson.match(/<li>/g)||[]).length,20,"Twenty specific exercises");
  assert.equal((lesson.match(/<details class="ela-week-mentor"/g)||[]).length,5,"Five educator notes");
  assert.equal((lesson.match(/<p class="ela-deliverable"/g)||[]).length,5,"Five evidence products");
  assert.match(lesson,/khaemenes-middle-ela-week01\.css/);
  assert.match(prior,/khaemenes-middle-ela-week01\.css/,"Consistent Week 01 and Week 02 presentation");
  assert.doesNotMatch(lesson,/Name the subject:/,"Generic scaffold must not return");
  for(const day of days)assert.ok(lesson.includes(day),"Missing "+day);
  for(const reading of expected.reading)assert.ok(lesson.includes(reading),"Missing original reading: "+reading);
  for(const domain of expected.domains)assert.ok(lesson.toLowerCase().includes(domain.toLowerCase()),"Missing core skill "+domain);
  assert.ok(lesson.includes(expected.writing),"Missing grade-appropriate writing challenge");
  assert.match(lesson,/never an automatic grade|no automatic mastery|not an automatic grade|not an official score|not an official mastery|not verified course mastery|not a verified course mastery/i);
  for(const href of ["../../weekly-plans/week-02.html","../../printables/week-02-packet.html"]){
    assert.ok(lesson.includes('href="'+href+'"'),"Missing original navigation "+href);
    assert.ok(fs.existsSync(path.resolve(root,prefix,"subjects/language-arts",href)),"Broken referenced file "+href);
  }
  for(const asset of ["khaemenes-middle-focus-map.js","khaemenes-middle-question-factory.js","khaemenes-middle-learning-ledger.js","khaemenes-middle-learning-context.js"]){
    assert.ok(lesson.includes(asset),"Shared learning infrastructure removed: "+asset);
  }
  const assessment=prefix+"assessments/week-02-assessment.html";
  assert.ok(fs.existsSync(path.join(root,assessment)),"Original formal assessment unavailable");
  assert.ok(overview.includes("../assessments/week-02-assessment.html"),"Formal assessment link removed from week plan");
  console.log("PASS English "+grade+" Week 02: 5 expandable days · 20 tasks · unique source set · intact learner assessment paths");
}
console.log("PASS Middle English 6–8 Week 02 structural parity");
