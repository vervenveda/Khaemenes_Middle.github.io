/* Khaemenes Academy Middle English Grade 06–08 Week 06 source regression.
 * node tools/validate-middle-english-week06.mjs
 * Read-only native Node; never writes learner or assessment state.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.resolve(root,p),"utf8");
const syllabus={
  6:{
    title:"Rational Numbers and Ancient Number Systems",
    sources:["The Same Twelve, Different Symbols","The Meaning of Position","A Label Is Not an Artifact","Opposites on a Modern Number Line","A Misleading Exhibit Label"],
    skills:["compare","place value","provenance","absolute value","historical"],
    writing:"160–220"
  },
  7:{
    title:"Expressions, Properties, and Academic Precision",
    sources:["Three Exhibition Kits","A Parenthesis Changes the Story","Notebook, Poster, and Interview","Explain the Kit Plan","A Confident Summary"],
    skills:["research writing","expression","source credibility","counterclaim","revision"],
    writing:"220–300"
  },
  8:{
    title:"Exponents and Scientific Notation",
    sources:["Two Scales in One Exhibit","The Digits We Choose","Small Means Unimportant","Values Are Not Importance","Three Editor Questions"],
    skills:["research synthesis","scientific notation","exponent","approximation","oral defense"],
    writing:"300–400"
  }
};
const stylesheet=read("assets/khaemenes-middle-ela-week01.css");
assert.match(stylesheet,/\.ela-week-guide/);
assert.match(stylesheet,/\.ela-workshop/);
assert.match(stylesheet,/font:400 17px/);
assert.match(stylesheet,/border-radius:7px/);
for(const [gradeText,expected] of Object.entries(syllabus)){
  const g=Number(gradeText);
  const base="grades/grade-0"+g+"/";
  const html=read(base+"subjects/language-arts/week-06.html");
  const week=read(base+"weekly-plans/week-06.html");
  const course=JSON.parse(read(base+"data/course-data.json"));
  assert.equal(course.weeks.length,36,"Grade "+g+" 36-week course architecture preserved");
  assert.ok(html.includes(expected.title)&&week.includes(expected.title),"Existing original title retained in Grade "+g);
  for(const src of expected.sources)assert.ok(html.includes(src),"Grade "+g+" missing original instructional source "+src);
  for(const skill of expected.skills)assert.ok(html.toLowerCase().includes(skill.toLowerCase()),"Grade "+g+" missing skill "+skill);
  assert.ok(html.includes(expected.writing),"Grade "+g+" writing target missing");
  for(const [rx,count,label] of [
    [/<article class="lesson">/g,5,"daily lesson cards"],
    [/<details class="ela-workshop"/g,5,"expandable workshops"],
    [/<h5>Student practice<\/h5>/g,5,"practice sections"],
    [/<li>/g,20,"specific student exercises"],
    [/<p class="ela-deliverable"/g,5,"portfolio evidence products"],
    [/<details class="ela-week-mentor"/g,5,"teacher/family coaching panels"]
  ])assert.equal((html.match(rx)||[]).length,count,"Grade "+g+" requires "+count+" "+label);
  for(const name of ["Monday","Tuesday","Wednesday","Thursday","Friday"])assert.ok(html.includes(name),"Grade "+g+" missing "+name);
  assert.ok(html.includes('<details class="ela-workshop" open>'),"Monday opens by default in Grade "+g);
  assert.ok(html.includes("khaemenes-middle-ela-week01.css"),"Grade "+g+" shared VNV/KA styling intact");
  assert.doesNotMatch(html,/Name the subject:/,"Old repetitive scaffold must not return");
  assert.match(html,/no automatic grades or mastery/,"Writing does not auto-award grades or mastery");
  assert.ok(html.includes("80%"),"Grade "+g+" verified mastery threshold remains stated");
  for(const href of ["../../printables/week-06-packet.html","../../weekly-plans/week-06.html"]){
    assert.ok(html.includes('href="'+href+'"'),"Grade "+g+" missing original link "+href);
    assert.ok(fs.existsSync(path.resolve(root,base,"subjects/language-arts",href)),"Missing navigation destination "+href);
  }
  const assessment=base+"assessments/week-06-assessment.html";
  assert.ok(fs.existsSync(path.join(root,assessment)),"Grade "+g+" assessment exists");
  assert.ok(week.includes("../assessments/week-06-assessment.html"),"Grade "+g+" official assessment still linked");
  for(const script of ["khaemenes-middle-focus-map.js","khaemenes-middle-question-factory.js","khaemenes-middle-learning-ledger.js","khaemenes-middle-learning-context.js"]){
    assert.ok(html.includes(script),"Grade "+g+" original study infrastructure missing "+script);
  }
  console.log("PASS English Grade "+g+" Week 06: five days / twenty tasks / source-specific instruction / original assessment paths");
}
const grade6=read("grades/grade-06/subjects/language-arts/week-06.html");
const grade7=read("grades/grade-07/subjects/language-arts/week-06.html");
const grade8=read("grades/grade-08/subjects/language-arts/week-06.html");
for(const term of ["XII","decimal 12","Roman","IV","|-3| = 3"]){
  assert.ok(grade6.includes(term),"Grade 6 numeral/modern notation term "+term);
}
for(const term of ["3(x + 4)","3x + 12","3x + 4","27","19"]){
  assert.ok(grade7.includes(term),"Grade 7 expression/source term "+term);
}
assert.equal(3*(5+4),27);
assert.equal(3*5+4,19);
assert.equal(3*(5+4),3*5+12);
for(const term of ["3.2 × 10^6","4.5 × 10^-4","3,200,000","0.00045","hypothetical"]){
  assert.ok(grade8.includes(term),"Grade 8 notation and scope term "+term);
}
assert.equal(3.2*10**6,3200000);
assert.equal(4.5*10**-4,0.00045);
console.log("PASS Week 06 source constraints: Grade 6 contextualized notation, Grade 7 grouped quantities, Grade 8 precise hypothetical scale");
