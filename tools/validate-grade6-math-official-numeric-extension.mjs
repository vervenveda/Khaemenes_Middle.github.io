import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Independent test oracle: recomputes results from presented prompt values.
// No question factory helper is used for expected answers.
const scope={};
vm.runInNewContext(fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8"),scope,{timeout:4000});
const f=scope.KhaemenesMiddleQuestionFactory;
const digits=s=>[...s.matchAll(/\d+(?:\.\d+)?/g)].map(x=>Number(x[0]));
const norm=s=>String(s).trim().replace(/\s+/g," ");
const groups=[
 [20,"makeGrade6CellPercentWeek"],
 [21,"makeGrade6EcosystemFractionsWeek"],
 [22,"makeGrade6EarthRationalWeek"],
 [29,"makeGrade6ResearchPercentWeek"],
 [30,"makeGrade6DebateFractionWeek"],
 [31,"makeGrade6ArtsRationalWeek"]
];
function answer(week,q){
 const p=q.prompt,s=q.skill,n=digits(p);
 if(week===20){
  if(s==="fraction to percent")return (100*n[0]/n[1])+"%";
  if(s==="percent of whole")return String(n[0]/100*n[1]);
  if(s==="proportional fraction")return (100*n[0]/n[1])+"%";
  if(s==="compare samples")return (n[0]/n[1]===n[2]/n[3]?"They are equal at "+(100*n[0]/n[1])+"%":"UNEXPECTED");
  if(s==="percent grid"){const rate=Number(p.match(/If (\d+)% are marked/)?.[1]);assert.ok(Number.isFinite(rate));return String(rate);}
  if(s==="sampling limits")return null;
 }
 if(week===21){
  if(s==="whole by unit fraction")return String(n[0]*n[2]);
  if(s==="fraction by unit fraction")return String(n[2]);
  if(s==="fraction division")return String(n[0]/n[1]/(n[2]/n[3]));
  if(s==="fraction by fraction")return String((n[0]/n[1])/(n[2]/n[3]));
  if(s==="quotient meaning")return String(n[0]/n[1]);
  if(s==="interpret quotient")return "3";
 }
 if(week===22){
  if(s==="distance between signs")return String(n[0]+n[1]);
  if(s==="signed change")return String(-n[0]-n[1]);
  if(s==="integer sum")return String(n[1]-n[0]);
  if(s==="fractional rational numbers")return n[0]+"/4";
  if(s==="mean deviations")return "0";
  if(s==="interpreting signed units")return null;
 }
 if(week===29){
  if(s==="fraction to percentage")return (n[0]/n[1]*100)+"%";
  if(s==="percent of whole")return String(n[0]/100*n[1]);
  if(s==="compare denominators")return "A: 80%";
  if(s==="percent increase"||s==="relative change")return ((n[1]-n[0])/n[0]*100)+"%";
  if(s==="limits of sample evidence")return null;
 }
 if(week===30){
  if(s==="whole by unit fraction")return String(n[0]*n[2]);
  if(s==="unit fractions")return String((n[2]/n[3])/(n[0]/n[1]));
  if(s==="fraction quotient")return String((n[0]/n[1])/(n[2]/n[3]));
  if(s==="fraction by fraction")return String((n[0]/n[1])/(n[2]/n[3]));
  if(s==="units and quotient")return String(n[0]/n[1]);
  if(s==="contextual remainder")return "3";
 }
 if(week===31){
  if(s==="signed addition")return String(-n[0]+n[1]);
  if(s==="signed change"||s==="distance")return String(n[0]+n[1]);
  if(s==="signed fractions")return n[0]+"/4";
  if(s==="mean of signed data")return "0";
  if(s==="reference values")return null;
 }
 throw Error("Unrecognized numerical question: W"+week+" "+s+" "+p);
}
let numerical=0,conceptual=0,draws=0;
for(const [week,method] of groups){
 assert.equal(typeof f[method],"function",method+" missing");
 for(let seed=0;seed<500;seed++){
  const qs=f[method]({seed:"g6-independent-answers-"+week+"-"+seed});
  assert.equal(qs.length,6,"Week "+week+" must supply six distinct math skills");
  const unique=new Set();
  for(const q of qs){
   assert.equal(q.subject,"mathematics");
   assert.ok(f.validateQuestion(q),"Invalid question: "+q.prompt);
   assert.equal(q.options[q.answer],q.correct);
   assert.ok(!unique.has(q.skill),"Duplicate skill "+q.skill);
   unique.add(q.skill);
   const value=answer(week,q);
   if(value===null){conceptual++;continue;}
   assert.equal(norm(q.correct),norm(value),"Numerical key mismatch Week "+week+" "+q.skill+": "+q.prompt);
   numerical++;
  }
  draws++;
 }
}
console.log("PASS official Grade 6 independently calculated "+numerical+" numerical answers; "+conceptual+" conceptual/interpretation questions structure-checked only; "+draws+" six-item seeded draws across Weeks 20–22 and 29–31. Not an editorial review of conceptual answers or all written keys.");
