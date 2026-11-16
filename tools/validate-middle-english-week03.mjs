/* Khaemenes Academy — Middle School English Grades 6–8 Week 03 parity.
 * Usage: node tools/validate-middle-english-week03.mjs
 * Static, native Node, read-only. Does not access learner data.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=relative=>fs.readFileSync(path.join(root,relative),"utf8");
const texts={
  6:{
    title:"Rates, Unit Rates, and Informational Text",
    sources:["Two Afternoons on the Trail","How a Report Guides the Reader","Questions and Evidence","Distance Per Hour"],
    skills:["central idea","sequence","comparison","paraphrase","unit rate"],
    writing:"160–210"
  },
  7:{
    title:"Unit Rates, Slope Foundations, and Informational Text",
    sources:["A Cart Full of Questions","Book-Cart Delivery Comparison","The Bigger Pile Wins","A Different Question"],
    skills:["point of view","central idea","books per trip","counterclaim","rhetorical"],
    writing:"200–280"
  },
  8:{
    title:"Equations, Functions, and Informational Text",
    sources:["A Room for Everyone?","Two Study-Room Models","The Cheapest Plan Is Obvious","Ask How Many Sessions"],
    skills:["point of view","function","fixed fee","assumption","oral defense"],
    writing:"270–370"
  }
};
const css=read("assets/khaemenes-middle-ela-week01.css");
assert.match(css,/\.ela-week-guide/);
assert.match(css,/\.ela-workshop/);
assert.match(css,/font:400 17px/);
assert.match(css,/border-radius:7px/);

for(const [gradeString,goal] of Object.entries(texts)){
  const g=Number(gradeString);
  const base="grades/grade-0"+g+"/";
  const source=read(base+"subjects/language-arts/week-03.html");
  const plan=read(base+"weekly-plans/week-03.html");
  const curriculum=JSON.parse(read(base+"data/course-data.json"));
  assert.equal(curriculum.weeks.length,36,"36-week course architecture for Grade "+g);
  assert.ok(source.includes(goal.title)&&plan.includes(goal.title),"Week title preserved for Grade "+g);
  for(const word of goal.sources)assert.ok(source.includes(word),"Grade "+g+" missing original source "+word);
  for(const word of goal.skills)assert.ok(source.toLowerCase().includes(word.toLowerCase()),"Grade "+g+" missing skill "+word);
  assert.ok(source.includes(goal.writing),"Grade "+g+" writing target missing");
  for(const [pattern,count,label] of [
    [/<article class="lesson">/g,5,"daily lesson cards"],
    [/<details class="ela-workshop"/g,5,"expandable workshops"],
    [/<h5>Student practice<\/h5>/g,5,"student practice sections"],
    [/<li>/g,20,"specific student activities"],
    [/<details class="ela-week-mentor"/g,5,"educator guidance panels"],
    [/<p class="ela-deliverable"/g,5,"portfolio evidence tasks"]
  ])assert.equal((source.match(pattern)||[]).length,count,"Grade "+g+" must have "+count+" "+label);
  for(const day of ["Monday","Tuesday","Wednesday","Thursday","Friday"])assert.ok(source.includes(day),"Grade "+g+" missing "+day);
  assert.match(source,/khaemenes-middle-ela-week01\.css/,"Grade "+g+" CSS parity");
  assert.doesNotMatch(source,/Name the subject:/,"No generic seminar template");
  assert.match(source,/not automatic grades or mastery/,"No automatic grades or mastery");
  for(const link of ["../../weekly-plans/week-03.html","../../printables/week-03-packet.html"]){
    assert.ok(source.includes('href="'+link+'"'),"Grade "+g+" navigation "+link);
    assert.ok(fs.existsSync(path.resolve(root,base,"subjects/language-arts",link)),"Link file exists "+link);
  }
  const assessment=base+"assessments/week-03-assessment.html";
  assert.ok(fs.existsSync(path.join(root,assessment)),"Grade "+g+" assessment present");
  assert.ok(plan.includes("../assessments/week-03-assessment.html"),"Grade "+g+" formal assessment remains linked");
  for(const shared of ["khaemenes-middle-focus-map.js","khaemenes-middle-question-factory.js","khaemenes-middle-learning-ledger.js","khaemenes-middle-learning-context.js"]){
    assert.ok(source.includes(shared),"Grade "+g+" learning infrastructure "+shared);
  }
  console.log("PASS Grade "+g+" English Week 03: five days, twenty tasks, four original source sections and formal assessment preserved");
}
const g6=read("grades/grade-06/subjects/language-arts/week-03.html");
const g7=read("grades/grade-07/subjects/language-arts/week-03.html");
const g8=read("grades/grade-08/subjects/language-arts/week-03.html");
assert.ok(g6.includes("12 ÷ 3 = 4")&&g6.includes("15 ÷ 3 = 5"),"Grade 6 rate comparisons correct");
assert.ok(g7.includes("18 ÷ 3 = 6")&&g7.includes("20 ÷ 4 = 5"),"Grade 7 rate comparisons correct");
assert.ok(g8.includes("A(n) = 6 + 2n")&&g8.includes("B(n) = 4n"),"Grade 8 function rules preserved");
for(const n of [1,2,3,4]){
  const a=6+2*n,b=4*n;
  assert.ok(Number.isInteger(a)&&Number.isInteger(b));
  if(n===3)assert.equal(a,b,"Plans tie at three sessions");
  if(n<=2)assert.ok(b<a,"Plan B costs less for one or two sessions");
  if(n===4)assert.ok(a<b,"Plan A costs less for four sessions");
}
console.log("PASS English 6–8 Week 03 grade-level evidence and numerical consistency checks");
