import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// First-party Grade 6 Mathematics 01–06 generated prompt oracle.
// The right answer is derived solely from the student-facing prompt.
const scope={};
vm.runInNewContext(fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8"),scope,{timeout:4000});
const f=scope.KhaemenesMiddleQuestionFactory;
const norm=s=>String(s).trim().replace(/\s+/g," ");
const parse=(text,re)=>{const match=text.match(re);assert.ok(match,"Unparsed prompt: "+text);return match.slice(1).map(Number)};
function solve(week,q){
 const p=q.prompt,skill=q.skill;
 if(week===1){
  if(skill==="ratios"){const [a,b,c]=parse(p,/ratio (\d+):(\d+) = (\d+): \?/);return String(b*c/a);}
  if(skill==="unit rates"){const [d,h]=parse(p,/travels (\d+) kilometers in (\d+) hours/);return String(d/h);}
 }
 if(week===2){
  if(skill==="part-to-whole"){const [r,b]=parse(p,/There are (\d+) red and (\d+) blue/);return r+":"+(r+b);}
  if(skill==="equivalent ratios"){const [a,b]=parse(p,/equivalent to (\d+):(\d+)/);const correct=q.correct.split(":").map(Number);assert.equal(correct.length,2);assert.ok(correct[0]*b===correct[1]*a,"Incorrect equivalent ratio "+p);return null;}
 }
 if(week===3){
  if(skill==="unit rates"){const [liters,mins]=parse(p,/fills (\d+) liters in (\d+) minutes/);return String(liters/mins);}
  if(skill==="rate tables"){const [rate,mins]=parse(p,/At (\d+) liters per minute.*?after (\d+) minutes/);return String(rate*mins);}
 }
 if(week===4){
  if(skill==="percent"){const [pct,whole]=parse(p,/Find (\d+)% of (\d+)/);return String(pct*whole/100);}
  if(skill==="survey proportions"){const [n,total]=parse(p,/survey, (\d+) of (\d+) people/);return (n/total*100)+"%";}
 }
 if(week===5){
  if(skill==="fraction division"){if(p.includes("pieces fit")){const [denom,whole]=parse(p,/1\/(\d+)-size pieces fit into (\d+) whole/);return String(whole*denom);}
   const [n,d,m]=parse(p,/Compute (\d+)\/(\d+) ÷ 1\/(\d+)/);return String(n/d*m);}
 }
 if(week===6){
  if(skill==="integer ordering"){const [a,b]=parse(p,/greater: -(\d+) or -(\d+)/);return "-"+Math.min(a,b);}
  if(skill==="absolute value"){const [a]=parse(p,/absolute value of -(\d+)/);return String(a);}
  if(skill==="historical place value"){const [a,b]=parse(p,/digits \((\d+), (\d+)\)/);return String(60*a+b);}
 }
 throw Error("Unrecognized Grade 6 official week "+week+" / "+skill+" / "+p);
}
let draws=0,numerical=0,identity=0;
for(let week=1;week<=6;week++){
 for(let seed=0;seed<500;seed++){
  const questions=f.makeGrade6MathWeek({week,seed:"independent-early-math-"+week+"-"+seed,count:6});
  assert.equal(questions.length,6,"Six-question bank required: week "+week);
  for(const q of questions){
   assert.equal(q.subject,"mathematics");
   assert.ok(f.validateQuestion(q),"Invalid choice structure: "+q.prompt);
   const calculated=solve(week,q);
   if(calculated===null){identity++;continue;}
   assert.equal(norm(q.correct),norm(calculated),"Incorrect official answer Week "+week+" "+q.prompt);
   numerical++;
  }
  draws++;
 }
}
console.log("PASS Grade 6 Weeks 01–06 independent official math: "+numerical+" recomputed answers, "+identity+" independently checked equivalent-ratio identities, "+draws+" seeded six-question draws. Not a semantic evaluation of all distractors.");
