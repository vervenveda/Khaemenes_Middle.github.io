import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const load=file=>fs.readFileSync(file,"utf8");
const learningContext=load("assets/khaemenes-middle-learning-context.js");
const studio=load("assets/khaemenes-middle-math-portal-studio-v1.js");
const practice=load("assets/khaemenes-middle-math-week-practice-v1.js");
const grade7Studio=load("assets/grade-07-mathematics-studio-v1.js");
for(const [file,source] of [
  ["assets/khaemenes-middle-learning-context.js",learningContext],
  ["assets/khaemenes-middle-math-portal-studio-v1.js",studio],
  ["assets/khaemenes-middle-math-week-practice-v1.js",practice],
  ["assets/grade-07-mathematics-studio-v1.js",grade7Studio]
])new vm.Script(source,{filename:file});
assert.match(learningContext,/khaemenes-middle-math-week-practice-v1\.js/);
assert.match(learningContext,/khaemenes-middle-math-portal-studio-v1\.js/);
assert.match(studio,/grades\\\/grade-\(06\|08\)/);
assert.match(studio,/allArticles=\$\$\('main article\.lesson'\)/);
assert.match(studio,/shell=\$\('main \.shell\.section'\)\|\|\$\('main \.shell'\)/);
assert.match(studio,/authoritative:false/);
assert.match(practice,/factory\.validateQuestion/);
assert.ok(!/localStorage\.setItem\(|mastery_met\s*=|unlocksCurriculum\s*=/.test(practice),
  "Interactive practice may not write authoritative learner records");
const sandbox={};
vm.runInNewContext(load("assets/khaemenes-middle-question-factory.js"),sandbox,{filename:"question-factory.js",timeout:2000});
const factory=sandbox.KhaemenesMiddleQuestionFactory;
assert.ok(factory?.makePool&&factory?.validateQuestion);
const stats={weeks:0,days:0,questions:0};
for(const grade of ["06","07","08"]){
  const dir="grades/grade-"+grade+"/subjects/mathematics/";
  const weeks=fs.readdirSync(dir).filter(x=>/^week-(0[1-9]|[12]\d|3[0-6])\.html$/.test(x)).sort();
  assert.equal(weeks.length,36,"Grade "+grade+" must contain 36 mathematics weeks");
  for(let n=1;n<=36;n++){
    const path=dir+"week-"+String(n).padStart(2,"0")+".html";
    assert.ok(fs.existsSync(path),"Missing mathematics week "+path);
    const html=load(path);
    for(const day of ["Monday","Tuesday","Wednesday","Thursday","Friday"]){
      assert.match(html,new RegExp("<h[234][^>]*>"+day+"(?:\\s|:|\\s*[—-])","i"),
        path+" missing "+day+" instructional content");
      stats.days++;
    }
    assert.match(html,/khaemenes-middle-learning-context\.js/,
      path+" missing shared mathematics loader entry");
    if(grade==="07")assert.match(html,/grade-07-mathematics-studio-v1\.js/,
      path+" missing approved Grade 7 weekly studio");
    const title=(html.match(/<h1[^>]*>([^<]+)/i)||[])[1]||"Mathematics";
    const questions=factory.makePool({grade:Number(grade),subject:"mathematics",focus:title,
      seed:"middle-math-weekly-practice-"+Number(grade)+"-"+n,count:4});
    assert.equal(questions.length,4,path+" practice question count");
    assert.ok(questions.every(q=>factory.validateQuestion(q)),path+" invalid four-choice practice item");
    stats.questions+=questions.length;stats.weeks++;
  }
  const index=load(dir+"index.html");
  assert.equal((index.match(/href="week-\d\d\.html"/g)||[]).length,36,
    "Grade "+grade+" must link all 36 mathematics weeks");
  if(grade!=="07"){
    assert.ok(fs.existsSync(dir+"studio.html"),"Grade "+grade+" missing weekly studio route");
    const studioHtml=load(dir+"studio.html");
    assert.ok(studioHtml.includes("days.map(function(day)")&&studioHtml.includes("articles.forEach(function(a)"),
      "Grade "+grade+" alternate studio must select Monday through Friday explicitly");
    assert.ok(!studioHtml.includes("articles.slice(-5)"),
      "Grade "+grade+" alternate studio must not include stray answer key in daily lessons");
    assert.equal((index.match(/href="studio\.html\?week=\d\d"/g)||[]).length,36,
      "Grade "+grade+" must preserve 36 existing alternate studio entries");
  }
}
assert.deepEqual(stats,{weeks:108,days:540,questions:432});
console.log("PASS "+stats.weeks+" mathematics weeks; "+stats.days+" original daily lessons; "+
 stats.questions+" valid formative practice items; six-part studio scripts and assessment isolation");
