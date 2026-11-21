import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const scriptPath="assets/khaemenes-middle-math-lesson-engine-v1.js";
const engine=fs.readFileSync(scriptPath,"utf8");
new vm.Script(engine,{filename:scriptPath});
assert.match(engine,/KhaemenesMiddleMathLessonConfig/);
assert.match(engine,/mastery|Practice only|authoritative:false/i);
const ids=["progress","progressFill","progressText","guidedInput","guidedCheck","cycleRate","cycleCheck","gameQuestion","gameInput","gameCheck","gameNext","draw","inkColor","inkWidth","savePng","export","finish","finishStatus"];
for(const grade of ["06","07","08"]){
  const file="grades/grade-"+grade+"/subjects/mathematics/lesson-01.html";
  const html=fs.readFileSync(file,"utf8");
  assert.ok(html.includes('src="../../../../'+scriptPath+'"'),file+" must load approved shared engine");
  for(const id of ids)assert.ok(html.includes('id="'+id+'"'),file+" missing engine control "+id);
  assert.ok(!html.includes("var canvas=$('#draw')"),file+" must not retain duplicate inline runtime");
  if(grade==="06"){
    const match=html.match(/window\.KhaemenesMiddleMathLessonConfig=(\{[^\n]+\});<\/script>/);
    assert.ok(match,file+" missing grade-specific mathematics configuration");
    const c=JSON.parse(match[1]);
    assert.deepEqual(c.questions.map(x=>x[1]),[8,12,3,6]);
    assert.equal(c.guidedAnswer,12);
    assert.equal(c.cycleAnswer,6);
    assert.equal(c.scope,"grade-06-unit-01-week-01");
  }else if(grade==="08"){
    const match=html.match(/window\.KhaemenesMiddleMathLessonConfig=(\{[^\n]+\});<\/script>/);
    assert.ok(match,file+" missing algebra-readiness configuration");
    const c=JSON.parse(match[1]);
    assert.deepEqual(c.questions.map(x=>x[1]),[8,17,6,3]);
    assert.equal(c.guidedAnswer,14);
    assert.equal(c.cycleAnswer,5);
    assert.equal(c.scope,"grade-08-algebra-readiness-week-01");
    const index=fs.readFileSync("grades/grade-08/subjects/mathematics/index.html","utf8");
    assert.match(index,/href="lesson-01\.html"/,"Grade 8 course entry must link its interactive lesson");
  }else{
    assert.match(engine,/Three apples cost \$2\.40/);
  }
}
console.log("PASS shared Grade 7 Mathematics interaction engine: JavaScript syntax, 6/7/8 controls, grade-specific answers, ungraded practice, and no duplicate inline runtime");
