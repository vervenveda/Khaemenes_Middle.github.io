/** Khaemenes Academy: randomized Week 1 Grade 6 assessment certification. */
import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const src=fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8");
const context={};vm.createContext(context);vm.runInContext(src,context,{filename:"khaemenes-middle-question-factory.js"});
const factory=context.KhaemenesMiddleQuestionFactory;
assert.equal(typeof factory.makeGrade6Week1Subjects,"function","Week 1 generator must be exported");
const expected=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
const fingerprints=new Set(),answerLocations=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week1Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Must draw 12 non-mathematics questions");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Repeated question within the same attempt");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Missing "+subject);
 for(const q of draw){
  assert(factory.validateQuestion(q),"Invalid answer/options for "+q.prompt);
  assert(q.rationale&&q.rationale.length>15,"Missing meaningful answer rationale");
  assert.equal(q.grade,"6","Wrong grade metadata");
  answerLocations.add(q.answer);
 }
 fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(fingerprints.size>=3,"Retakes must draw different question combinations");
assert(answerLocations.size===4,"Correct-answer positions must vary");
const engine=fs.readFileSync("assets/khaemenes-middle-assessment-engine.js","utf8");
assert(engine.includes("f.makeGrade6Week1Subjects?.({seed:seed+\"|general\"})"),"Week 1 must use aligned generator");
assert(engine.includes('const PASS=80')||engine.includes("PASS=80"),"Preserve 80% mastery");

const week2Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week2Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 2 must draw 12 non-mathematics questions");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 2 duplicate questions");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 2 missing "+subject);
 for(const q of draw){
  assert(factory.validateQuestion(q),"Week 2 invalid answer: "+q.prompt);
  assert(q.rationale&&q.rationale.length>15,"Week 2 missing rationale");
  assert.equal(q.grade,"6","Week 2 grade mismatch");
 }
 week2Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week2Fingerprints.size>=3,"Week 2 retakes require varied question combinations");
assert(engine.includes('f.makeGrade6Week2Subjects?.({seed:seed+"|general"})'),"Week 2 must use its aligned generator");
console.log("Grade 6 Week 2 assessment certified: 120 valid draws, eight subjects represented, 12 unique nonmath prompts, varied retakes.");

const week3Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week3Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 3 question count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 3 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 3 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 3 invalid answer: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 3 missing rationale");}
 week3Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week3Fingerprints.size>=3,"Week 3 retake selection must vary");
assert(engine.includes('f.makeGrade6Week3Subjects?.({seed:seed+"|general"})'),"Week 3 engine route missing");
console.log("Grade 6 Week 3 assessment certified: 120 valid balanced draws.");
console.log("Grade 6 Week 1 assessment certified: 120 valid draws, all eight subjects represented, 12 unique nonmath prompts per attempt, four answer positions, varied retakes.");
