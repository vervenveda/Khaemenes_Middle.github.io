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
const week4Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week4Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 4 count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 4 duplicate");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 4 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 4 invalid answer: "+q.prompt);assert(q.rationale.length>15,"Week 4 missing rationale");}
 week4Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week4Fingerprints.size>=3,"Week 4 retakes must vary");
assert(engine.includes('f.makeGrade6Week4Subjects?.({seed:seed+"|general"})'),"Week 4 engine route missing");
console.log("Grade 6 Week 4 assessment certified: 120 balanced randomized draws.");
const week5Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week5Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 5 draw length");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 5 duplicates");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 5 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 5 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 5 no rationale");}
 week5Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week5Fingerprints.size>=3,"Week 5 retake combinations must vary");
assert(engine.includes('f.makeGrade6Week5Subjects?.({seed:seed+"|general"})'),"Week 5 engine route missing");
console.log("Grade 6 Week 5 assessment certified: 120 valid balanced draws.");
const week6Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week6Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 6 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 6 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 6 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 6 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 6 missing rationale");}
 week6Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week6Fingerprints.size>=3,"Week 6 retake variation missing");
assert(engine.includes('f.makeGrade6Week6Subjects?.({seed:seed+"|general"})'),"Week 6 engine route missing");
console.log("Grade 6 Week 6 assessment certified: 120 balanced valid draws.");
const week7Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week7Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 7 count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 7 duplicate");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 7 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 7 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 7 missing rationale");}
 week7Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week7Fingerprints.size>=3,"Week 7 retakes need variation");
assert(engine.includes('f.makeGrade6Week7Subjects?.({seed:seed+"|general"})'),"Week 7 engine branch missing");
console.log("Grade 6 Week 7 assessment certified: 120 balanced randomized draws.");
const week8Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week8Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 8 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 8 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 8 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 8 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 8 missing rationale");}
 week8Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week8Fingerprints.size>=3,"Week 8 retake variation missing");
assert(engine.includes('f.makeGrade6Week8Subjects?.({seed:seed+"|general"})'),"Week 8 engine route missing");
console.log("Grade 6 Week 8 assessment certified: 120 balanced draws.");
const week9Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week9Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 9 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 9 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 9 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 9 invalid answer: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 9 missing rationale");}
 week9Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week9Fingerprints.size>=3,"Week 9 retake combinations must vary");
assert(engine.includes('f.makeGrade6Week9Subjects?.({seed:seed+"|general"})'),"Week 9 assessment route missing");
console.log("Grade 6 Week 9 assessment certified: 120 balanced seeded draws.");
const week10Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week10Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 10 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 10 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 10 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 10 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 10 missing rationale");}
 week10Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week10Fingerprints.size>=3,"Week 10 retakes must vary");
assert(engine.includes('f.makeGrade6Week10Subjects?.({seed:seed+"|general"})'),"Week 10 engine route missing");
console.log("Grade 6 Week 10 assessment certified: 120 balanced seeded draws.");
const week11Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week11Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 11 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 11 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 11 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 11 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 11 missing rationale");}
 week11Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week11Fingerprints.size>=3,"Week 11 retake draws must vary");
assert(engine.includes('f.makeGrade6Week11Subjects?.({seed:seed+"|general"})'),"Week 11 route missing");
console.log("Grade 6 Week 11 assessment certified: 120 balanced draws.");
const week12Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week12Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 12 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 12 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 12 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 12 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 12 missing rationale");}
 week12Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week12Fingerprints.size>=3,"Week 12 retakes must vary");
assert(engine.includes('f.makeGrade6Week12Subjects?.({seed:seed+"|general"})'),"Week 12 route missing");
console.log("Grade 6 Week 12 assessment certified: 120 balanced seeded draws.");
const week13Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week13Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 13 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 13 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 13 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 13 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 13 missing rationale");}
 week13Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week13Fingerprints.size>=3,"Week 13 retake variation missing");
assert(engine.includes('f.makeGrade6Week13Subjects?.({seed:seed+"|general"})'),"Week 13 assessment route missing");
console.log("Grade 6 Week 13 assessment certified: 120 balanced draws.");
const week14Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week14Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 14 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 14 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 14 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 14 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 14 missing rationale");}
 week14Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week14Fingerprints.size>=3,"Week 14 retake variation missing");
assert(engine.includes('f.makeGrade6Week14Subjects?.({seed:seed+"|general"})'),"Week 14 assessment route missing");
console.log("Grade 6 Week 14 assessment certified: 120 balanced draws.");
const week15Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week15Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 15 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 15 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 15 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 15 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 15 missing rationale");}
 week15Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week15Fingerprints.size>=3,"Week 15 retake variation missing");
assert(engine.includes('f.makeGrade6Week15Subjects?.({seed:seed+"|general"})'),"Week 15 assessment route missing");
console.log("Grade 6 Week 15 assessment certified: 120 balanced draws.");
const week16Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week16Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 16 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 16 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 16 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 16 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 16 missing rationale");}
 week16Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week16Fingerprints.size>=3,"Week 16 retake variation missing");
assert(engine.includes('f.makeGrade6Week16Subjects?.({seed:seed+"|general"})'),"Week 16 assessment route missing");
console.log("Grade 6 Week 16 assessment certified: 120 balanced draws.");
const week17Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week17Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 17 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 17 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 17 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 17 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 17 missing rationale");}
 week17Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week17Fingerprints.size>=3,"Week 17 retake variation missing");
assert(engine.includes('f.makeGrade6Week17Subjects?.({seed:seed+"|general"})'),"Week 17 assessment route missing");
console.log("Grade 6 Week 17 midyear assessment certified: 120 balanced draws.");
const week18Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week18Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 18 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 18 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 18 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 18 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 18 missing rationale");}
 week18Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week18Fingerprints.size>=3,"Week 18 retake variation missing");
assert(engine.includes('f.makeGrade6Week18Subjects?.({seed:seed+"|general"})'),"Week 18 assessment route missing");
console.log("Grade 6 Week 18 assessment certified: 120 balanced draws.");
const week19Fingerprints=new Set();
for(let seed=1;seed<=120;seed++){
 const draw=factory.makeGrade6Week19Subjects({seed:"audit-"+seed});
 assert.equal(draw.length,12,"Week 19 draw count");
 assert.equal(new Set(draw.map(q=>q.prompt)).size,12,"Week 19 duplicate prompts");
 for(const subject of expected)assert(draw.some(q=>q.subject===subject),"Week 19 missing "+subject);
 for(const q of draw){assert(factory.validateQuestion(q),"Week 19 invalid: "+q.prompt);assert(q.rationale&&q.rationale.length>15,"Week 19 missing rationale");}
 week19Fingerprints.add(draw.map(q=>q.id).sort().join("|"));
}
assert(week19Fingerprints.size>=3,"Week 19 retake variation missing");
assert(engine.includes('f.makeGrade6Week19Subjects?.({seed:seed+"|general"})'),"Week 19 assessment route missing");
console.log("Grade 6 Week 19 assessment certified: 120 balanced draws.");
console.log("Grade 6 Week 1 assessment certified: 120 valid draws, all eight subjects represented, 12 unique nonmath prompts per attempt, four answer positions, varied retakes.");
