/* Khaemenes Academy — English Grades 06–08 Week 05.
 * node tools/validate-middle-english-week05.mjs
 * Read-only, dependency-free tests; no student account or assessment state touched.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=relative=>fs.readFileSync(path.resolve(root,relative),"utf8");
const syllabus={
  6:{
    title:"Fraction Division and Procedural Writing",
    sources:["The Fraction-Strip Mix-Up","Steps That Make You Guess","Four One-Sixths","Can Someone Repeat It?","The Missing Check"],
    themes:["purpose","procedure","transitions","equal","verification"],
    writing:"170–230"
  },
  7:{
    title:"Operations with Rational Numbers",
    sources:["Cedar Hall Display Log","Temperature Rose by Only One?","Keep the Signs","Three Ways a Number Travels","The Viral Summary"],
    themes:["source credibility","signed-number","provenance","corroboration","counterclaim"],
    writing:"210–290"
  },
  8:{
    title:"Systems of Equations and Competing Explanations",
    sources:["The Archive Labels","Inventory and Caption Cards","The Label Is Close Enough","Both Records Matter","The Curator's Questions"],
    themes:["two conditions","source","provenance","manuscript","oral defense"],
    writing:"290–390"
  }
};
const shared=read("assets/khaemenes-middle-ela-week01.css");
assert.match(shared,/\.ela-week-guide/);
assert.match(shared,/\.ela-workshop/);
assert.match(shared,/font:400 17px/);
assert.match(shared,/border-radius:7px/);
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
for(const [raw,goal] of Object.entries(syllabus)){
  const grade=Number(raw);
  const prefix="grades/grade-0"+grade+"/";
  const lesson=read(prefix+"subjects/language-arts/week-05.html");
  const plan=read(prefix+"weekly-plans/week-05.html");
  const course=JSON.parse(read(prefix+"data/course-data.json"));
  assert.equal(course.weeks.length,36,"Grade "+grade+" still contains 36 weeks");
  assert.ok(lesson.includes(goal.title)&&plan.includes(goal.title),"Original Week 05 title is retained");
  for(const source of goal.sources)assert.ok(lesson.includes(source),"Grade "+grade+" missing Academy-original reading "+source);
  for(const word of goal.themes)assert.ok(lesson.toLowerCase().includes(word.toLowerCase()),"Grade "+grade+" missing instructional theme "+word);
  assert.ok(lesson.includes(goal.writing),"Grade "+grade+" writing target missing");
  for(const [rx,n,label] of [
    [/<article class="lesson">/g,5,"daily lessons"],
    [/<details class="ela-workshop"/g,5,"expandable learning workshops"],
    [/<h5>Student practice<\/h5>/g,5,"student-practice sections"],
    [/<li>/g,20,"specific student tasks"],
    [/<details class="ela-week-mentor"/g,5,"educator guidance sections"],
    [/<p class="ela-deliverable"/g,5,"portfolio evidence descriptions"]
  ])assert.equal((lesson.match(rx)||[]).length,n,"Grade "+grade+" must contain "+n+" "+label);
  assert.match(lesson,/<details class="ela-workshop" open>/,"Monday is expanded by default");
  for(const day of days)assert.ok(lesson.includes(day),"Grade "+grade+" missing "+day);
  assert.ok(lesson.includes("khaemenes-middle-ela-week01.css"),"Grade "+grade+" shares the same CSS as prior weeks");
  assert.doesNotMatch(lesson,/Name the subject:/,"Old generic template must not reappear");
  assert.match(lesson,/no automatic grades or mastery/,"Developmental practice cannot award mastery");
  assert.match(lesson,/80%/,"Existing formal mastery threshold remains described");
  for(const href of ["../../weekly-plans/week-05.html","../../printables/week-05-packet.html"]){
    assert.ok(lesson.includes('href="'+href+'"'),"Original navigation preserved "+href);
    assert.ok(fs.existsSync(path.resolve(root,prefix,"subjects/language-arts",href)),"Linked page exists "+href);
  }
  assert.ok(fs.existsSync(path.join(root,prefix+"assessments/week-05-assessment.html")),"Grade "+grade+" formal assessment preserved");
  assert.ok(plan.includes("../assessments/week-05-assessment.html"),"Grade "+grade+" original assessment route preserved");
  for(const name of ["khaemenes-middle-focus-map.js","khaemenes-middle-question-factory.js","khaemenes-middle-learning-ledger.js","khaemenes-middle-learning-context.js"]){
    assert.ok(lesson.includes(name),"Grade "+grade+" lost established learning resource "+name);
  }
  console.log("PASS Grade "+grade+" English Week 05: five original daily lessons, twenty tasks, intact formal assessment link");
}
const g6=read("grades/grade-06/subjects/language-arts/week-05.html");
const g7=read("grades/grade-07/subjects/language-arts/week-05.html");
const g8=read("grades/grade-08/subjects/language-arts/week-05.html");
for(const phrase of ["3/4 ÷ 1/4 = 3","2/3 ÷ 1/6 = 4","4 × 1/6 = 4/6 = 2/3"]){
  assert.ok(g6.includes(phrase),"Grade 6 fractional procedure / verification: "+phrase);
}
assert.equal((3/4)/(1/4),3);
assert.equal((2/3)/(1/6),4);
for(const phrase of ["-2.5°C","+1.5°C","-0.5°C","4.0°C","2.0°C"]){
  assert.ok(g7.includes(phrase),"Grade 7 signed observation integrity: "+phrase);
}
assert.equal(1.5-(-2.5),4);
assert.equal(-0.5-1.5,-2);
for(const phrase of ["p + m = 18","2p + m = 26","p = 8","m = 10"]){
  assert.ok(g8.includes(phrase),"Grade 8 archival conditions: "+phrase);
}
assert.equal(8+10,18);
assert.equal(2*8+10,26);
assert.equal(2*10+8,28,"Rejected summary satisfies only the folder count");
console.log("PASS English Grades 6–8 Week 05: fractions, rational-number changes, and two-condition evidentiary truthfulness");
