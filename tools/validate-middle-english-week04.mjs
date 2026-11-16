/* Khaemenes Academy — Middle School English Week 04, Grades 06–08.
 * Run: node tools/validate-middle-english-week04.mjs
 * Static, read-only regression. No student accounts or gradebooks are accessed.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const expectations={
  6:{
    title:"Percent, Proportion, and Civic Decisions",
    sources:["The Library Hours Question","A Different Survey","Every Student Wants More Hours","Numbers Need Context","60% of Everyone?"],
    skills:["claim","respondents","denominator","civic recommendation","limitation"],
    writing:"160–220"
  },
  7:{
    title:"Percent Change and Civic Data",
    sources:["The Reading Corner Follow-Up","Two Ways to Describe Change","The Pilot Settled Everything","Keep Studying Access","Did Everyone Change Their Mind?"],
    skills:["argument analysis","percentage points","relative increase","voluntary","counterargument"],
    writing:"210–290"
  },
  8:{
    title:"Slope, Intercept, and Argument Claims",
    sources:["Two Community Notice Plans","A Fair Time Comparison","Faster Means Fairer","Start Strong, Decide Now","What Would Count as Success?"],
    skills:["argument evaluation","intercept","slope","projected","oral defense"],
    writing:"280–380"
  }
};
const stylesheet=read("assets/khaemenes-middle-ela-week01.css");
assert.match(stylesheet,/\.ela-week-guide/);
assert.match(stylesheet,/\.ela-workshop/);
assert.match(stylesheet,/font:400 17px/);
assert.match(stylesheet,/border-radius:7px/);

for(const [raw,guidance] of Object.entries(expectations)){
  const grade=Number(raw);
  const base="grades/grade-0"+grade+"/";
  const lesson=read(base+"subjects/language-arts/week-04.html");
  const weekly=read(base+"weekly-plans/week-04.html");
  const curriculum=JSON.parse(read(base+"data/course-data.json"));
  assert.equal(curriculum.weeks.length,36,"Grade "+grade+" preserves its 36-week course");
  assert.ok(lesson.includes(guidance.title)&&weekly.includes(guidance.title),"Original week title retained");
  for(const source of guidance.sources)assert.ok(lesson.includes(source),"Grade "+grade+" missing source "+source);
  for(const skill of guidance.skills)assert.ok(lesson.toLowerCase().includes(skill.toLowerCase()),"Grade "+grade+" missing skill "+skill);
  assert.ok(lesson.includes(guidance.writing),"Grade "+grade+" writing task is missing");
  for(const [rx,expected,description] of [
    [/<article class="lesson">/g,5,"daily lesson cards"],
    [/<details class="ela-workshop"/g,5,"expandable daily workshops"],
    [/<h5>Student practice<\/h5>/g,5,"student practice headings"],
    [/<li>/g,20,"original tasks"],
    [/<details class="ela-week-mentor"/g,5,"teacher/family advice"],
    [/<p class="ela-deliverable"/g,5,"portfolio deliverables"]
  ])assert.equal((lesson.match(rx)||[]).length,expected,"Grade "+grade+" needs "+expected+" "+description);
  assert.match(lesson,/<details class="ela-workshop" open>/,"Monday opens by default");
  for(const day of ["Monday","Tuesday","Wednesday","Thursday","Friday"])assert.ok(lesson.includes(day),"Grade "+grade+" missing "+day);
  assert.match(lesson,/khaemenes-middle-ela-week01\.css/,"Uses canonical shared design without a duplicate stylesheet");
  assert.doesNotMatch(lesson,/Name the subject:/,"Do not restore generic scaffold");
  assert.match(lesson,/no automatic grades or mastery/i,"Practice work cannot award official mastery");
  assert.match(lesson,/80%/,"Verified 80% boundary retained");
  for(const href of ["../../weekly-plans/week-04.html","../../printables/week-04-packet.html"]){
    assert.ok(lesson.includes('href="'+href+'"'),"Original navigation retained "+href);
    assert.ok(fs.existsSync(path.resolve(root,base,"subjects/language-arts",href)),"Referenced page exists "+href);
  }
  assert.ok(weekly.includes("../assessments/week-04-assessment.html"),"Official weekly assessment link retained");
  assert.ok(fs.existsSync(path.join(root,base+"assessments/week-04-assessment.html")),"Official weekly assessment file exists");
  for(const shared of [
    "khaemenes-middle-focus-map.js",
    "khaemenes-middle-question-factory.js",
    "khaemenes-middle-learning-ledger.js",
    "khaemenes-middle-learning-context.js"
  ])assert.ok(lesson.includes(shared),"Original learning script retained: "+shared);
  console.log("PASS Middle English Grade "+grade+" Week 04: 5 days, 20 tasks, 5 evidence products and unchanged formal assessment links");
}
const g6=read("grades/grade-06/subjects/language-arts/week-04.html");
const g7=read("grades/grade-07/subjects/language-arts/week-04.html");
const g8=read("grades/grade-08/subjects/language-arts/week-04.html");
assert.ok(g6.includes("30 out of 50")&&g6.includes("60%"),"Grade 6 library survey percentages");
assert.ok(/10 out of forty/i.test(g6)&&g6.includes("25%"),"Grade 6 separate survey interpretation");
assert.equal((30/50)*100,60);
assert.equal((10/40)*100,25);
assert.ok(g7.includes("40 out of 80")||g7.includes("40 selected"),"Grade 7 first survey");
assert.ok(g7.includes("54 selected")&&g7.includes("60%"),"Grade 7 second survey");
assert.equal((40/80)*100,50);
assert.equal((54/90)*100,60);
assert.equal(60-50,10,"Difference in percentage points");
assert.equal(((60-50)/50)*100,20,"Relative percent change");
assert.equal(((50-40)/40)*100,25,"Separate signup count change");
assert.ok(g8.includes("A(w) = 12 + 6w")&&g8.includes("B(w) = 24 + 3w"),"Grade 8 fictional outreach rules");
for(const [w,expectedA,expectedB] of [[0,12,24],[2,24,30],[4,36,36],[6,48,42]]){
  assert.equal(12+6*w,expectedA,"Plan A week "+w);
  assert.equal(24+3*w,expectedB,"Plan B week "+w);
}
assert.ok(g8.includes("distribution")||g8.includes("distributed"),"Grade 8 separates modeled notices and actual civic outcomes");
console.log("PASS Week 04 numerical truthfulness: grade-appropriate ratios, percentage points and slope/intercept interpretations");
