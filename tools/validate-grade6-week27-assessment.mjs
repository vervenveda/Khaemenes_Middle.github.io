import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const sandbox={};sandbox.window=sandbox;sandbox.globalThis=sandbox;
vm.runInNewContext(read("assets/khaemenes-middle-question-factory.js"),sandbox);
const factory=sandbox.KhaemenesMiddleQuestionFactory;
assert.equal(typeof factory.makeGrade6Week27Subjects,"function");
const expected=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
const engine=read("assets/khaemenes-middle-assessment-engine.js");
assert(engine.includes("week()===27?(f.makeGrade6Week27Subjects?.({seed:seed+\"|general\"})||[])"),"Week 27 engine routing missing");
assert(engine.includes("makeGrade6ClassicalGeometryWeek"),"Mathematics route removed");
assert(engine.includes("PASS=80"),"80% gate changed");
const unique=new Set(); let draws=0;
for(let seed=0;seed<3000;seed++){
 const questions=factory.makeGrade6Week27Subjects({seed:"w27-regression-"+seed});
 assert.equal(questions.length,12,"Expected 12 questions");
 const subjects=new Set(questions.map(q=>q.subject));
 for(const subject of expected)assert(subjects.has(subject),"Missing "+subject+" for seed "+seed);
 for(const q of questions){assert(factory.validateQuestion(q),"Invalid question: "+q.prompt);assert.equal(new Set(q.options).size,4);assert.equal(q.options[q.answer],q.correct);unique.add(q.prompt);draws++;}
}
assert.equal(unique.size,16,"Week 27 bank must expose 16 distinct prompts");
console.log("Grade 6 Week 27 PASS: "+draws+" generated questions across 3000 seeded assessments; eight-subject coverage, 16 originals, math route and 80% mastery preserved.");
