/* Khaemenes Academy Middle English Week 07 (Grades 06–08).
 * Run: node tools/validate-middle-english-week07.mjs
 * Native Node, source-only regression; no writes to learner records or gradebooks.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const specs={
  6:{
    title:"Coordinate Planes and Geography",
    sources:["The Map With Two Norths","Where Is","The Garden Delivery Note","Directions Without Guessing","The Shortcut Nobody Checked"],
    skills:["map-text","spatial","coordinate","reference","revision"],
    writing:"170–230"
  },
  7:{
    title:"Equations and Inequalities",
    sources:["The Puzzle Club's Missing Step","At Least Is Not More Than","Solving Without Skipping","Precision Is Part of the Evidence","The Poster That Changed the Rules"],
    skills:["grammar","inequality","equivalent","source","revision"],
    writing:"220–300"
  },
  8:{
    title:"Transformations and Congruence",
    sources:["The Triangle That Moved","Same Shape, Different Claim","Every Move Preserves Everything","What Counts as a Proof?","The Reviewer's Challenges"],
    skills:["translation","reflection","dilation","congruence","counterexample"],
    writing:"300–400"
  }
};
const css=read("assets/khaemenes-middle-ela-week01.css");
assert.match(css,/\.ela-week-guide/);
assert.match(css,/\.ela-workshop/);
assert.match(css,/font:400 17px/);
assert.match(css,/border-radius:7px/);

for(const [raw,spec] of Object.entries(specs)){
  const grade=Number(raw);
  const base="grades/grade-0"+grade+"/";
  const html=read(base+"subjects/language-arts/week-07.html");
  const plan=read(base+"weekly-plans/week-07.html");
  const curriculum=JSON.parse(read(base+"data/course-data.json"));
  assert.equal(curriculum.weeks.length,36,"Grade "+grade+": 36-week course retained");
  assert.ok(html.includes(spec.title)&&plan.includes(spec.title),"Grade "+grade+": existing week title retained");
  for(const source of spec.sources)assert.ok(html.includes(source),"Grade "+grade+": original reading "+source);
  for(const skill of spec.skills)assert.ok(html.toLowerCase().includes(skill.toLowerCase()),"Grade "+grade+": skill "+skill);
  assert.ok(html.includes(spec.writing),"Grade "+grade+": writing task depth");
  for(const [rx,count,label] of [
    [/<article class="lesson">/g,5,"daily lesson elements"],
    [/<details class="ela-workshop"/g,5,"expandable workshops"],
    [/<h5>Student practice<\/h5>/g,5,"practice headings"],
    [/<li>/g,20,"specific student exercises"],
    [/<details class="ela-week-mentor"/g,5,"teacher support panels"],
    [/<p class="ela-deliverable"/g,5,"portfolio evidence products"]
  ])assert.equal((html.match(rx)||[]).length,count,"Grade "+grade+": "+label);
  assert.match(html,/<details class="ela-workshop" open>/,"Monday opens by default");
  for(const day of ["Monday","Tuesday","Wednesday","Thursday","Friday"])assert.ok(html.includes(day),"Grade "+grade+": "+day+" missing");
  assert.match(html,/khaemenes-middle-ela-week01\.css/,"Canonical shared English lesson styling");
  assert.doesNotMatch(html,/Name the subject:/,"Old generic weekly scaffold is prohibited");
  assert.match(html,/no automatic grades or mastery/i,"Formative literacy work is not official mastery");
  assert.match(html,/80%/,"Formal mastery threshold remains");
  for(const href of ["../../weekly-plans/week-07.html","../../printables/week-07-packet.html"]){
    assert.ok(html.includes('href="'+href+'"'),"Grade "+grade+": missing original navigation "+href);
    assert.ok(fs.existsSync(path.resolve(root,base,"subjects/language-arts",href)),"Grade "+grade+": broken link "+href);
  }
  assert.ok(plan.includes("../assessments/week-07-assessment.html"),"Grade "+grade+": assessment route remains");
  assert.ok(fs.existsSync(path.join(root,base+"assessments/week-07-assessment.html")),"Grade "+grade+": formal assessment file remains");
  for(const shared of [
    "khaemenes-middle-focus-map.js",
    "khaemenes-middle-question-factory.js",
    "khaemenes-middle-learning-ledger.js",
    "khaemenes-middle-learning-context.js"
  ])assert.ok(html.includes(shared),"Grade "+grade+": shared learning script "+shared);
  assert.doesNotMatch(html,/<\/em\s+Academy-/,"Source labels must have valid HTML closing tags");
  console.log("PASS English Grade "+grade+" Week 07: five deep lesson days, twenty tasks, original texts, intact mastery links");
}
const g6=read("grades/grade-06/subjects/language-arts/week-07.html");
const g7=read("grades/grade-07/subjects/language-arts/week-07.html");
const g8=read("grades/grade-08/subjects/language-arts/week-07.html");

for(const word of ["(2,3)","(-1,2)","(-2,1)","(1,1)"]){
  assert.ok(g6.includes(word),"Grade 6 coordinate source integrity: "+word);
}
assert.deepEqual([2-(-1),3-2],[3,1],"Library-school coordinate displacement");
assert.deepEqual([1-(-2),1-1],[3,0],"Garden-club first map movement");
for(const word of ["x + 5 = 13","x = 8","2x + 3 = 11","d ≥ 4","d &gt; 4","c ≤ 8"]){
  assert.ok(g7.includes(word),"Grade 7 math-language boundary: "+word);
}
assert.equal(8+5,13);
assert.equal(2*4+3,11);
assert.ok(4>=4&&!(4>4),"At least includes four, more than excludes four");
const original=[[0,0],[2,0],[0,1]];
const translated=[[2,-1],[4,-1],[2,0]];
const reflected=[[0,0],[-2,0],[0,1]];
const dilated=[[0,0],[4,0],[0,2]];
const dsq=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
for(const pair of [[0,1],[0,2],[1,2]]){
  const [a,b]=pair;
  assert.equal(dsq(original[a],original[b]),dsq(translated[a],translated[b]),"Translation preserves distance");
  assert.equal(dsq(original[a],original[b]),dsq(reflected[a],reflected[b]),"Reflection preserves distance");
  assert.equal(dsq(dilated[a],dilated[b]),4*dsq(original[a],original[b]),"Scale factor two multiplies squared lengths by four");
}
for(const token of ["A′(2,-1)","B′(4,-1)","C′(2,0)","B″(-2,0)","similar to the original but is not congruent"]){
  assert.ok(g8.includes(token),"Grade 8 transformation claim: "+token);
}
console.log("PASS Week 07 cross-grade numerical/source truth: coordinates, equation boundaries, translation/reflection/dilation");
