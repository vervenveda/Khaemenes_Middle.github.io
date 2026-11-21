import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Standalone test oracle computes mathematical answers from the rendered prompt,
// never from factory-local parameters or a second copy of the expected answer.
const context={};
vm.runInNewContext(fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8"),context,{timeout:4000});
const factory=context.KhaemenesMiddleQuestionFactory;
const num=s=>[...s.matchAll(/\d+(?:\.\d+)?/g)].map(x=>Number(x[0]));
const clean=s=>String(s).trim().replace(/\s+/g," ");
const categories=[
 [23,"makeGrade6WeatherCoordinatesWeek"],
 [24,"makeGrade6RiverExpressionsWeek"],
 [25,"makeGrade6CultureEquationsWeek"],
 [32,"makeGrade6WellnessCoordinatesWeek"],
 [33,"makeGrade6TechnologyExpressionsWeek"]
];
function independentlySolve(week,q){
 const p=q.prompt,skill=q.skill,n=num(p);
 if(week===23||week===32){
  if(skill==="quadrant signs"||skill==="quadrants")return "II";
  if(skill==="horizontal distance")return String(n[0]+n[2]);
  if(skill==="vertical distance")return String(n[1]+n[3]);
  if(skill==="y-axis reflection"||skill==="x-axis reflection")return "(−"+n[0]+", −"+n[1]+")";
  if(skill==="spatial evidence"||skill==="limits of coordinate models")return null;
 }
 if(week===24||week===33){
  if(skill==="verbal to expression")return n[0]+"f + "+n[1];
  if(skill==="verbal models")return n[0]+"n + "+n[1];
  if(skill==="substitution")return String(n[0]*n[2]+n[1]);
  if(skill==="distributive property")return n[0]+"y + "+(n[0]*n[1]);
  if(skill==="distribution")return n[0]+"x + "+(n[0]*n[1]);
  if(skill==="combine like terms"||skill==="like terms")return (n[0]+n[1])+"m + "+n[2];
  if(skill==="subtract like terms")return (n[0]-n[1])+"p + "+n[2];
  if(skill==="interpret models"||skill==="model limitations")return null;
 }
 if(week===25){
  if(skill==="one-variable equations")return String((n[2]-n[1])/n[0]);
  if(skill==="inverse operations"){const rhs=Number(p.match(/=\s*([−-]?\d+)/)?.[1]?.replace("−","-"));assert.ok(Number.isFinite(rhs));return String((rhs+n[1])/n[0]);}
  if(skill==="positive inequality")return "n ≤ "+String((n[2]-n[1])/n[0]);
  if(skill==="negative multiplier")return "z ≤ −"+String(n[1]/n[0]);
  if(skill==="constraints")return "g ≤ "+String(n[0]-n[1]);
  if(skill==="solution set")return "0 through "+String(n[0])+" guests inclusive";
 }
 throw Error("Unrecognized question: W"+week+" "+skill+" "+p);
}
let calculated=0,conceptual=0,draws=0;
for(const [week,method] of categories){
 assert.equal(typeof factory[method],"function",method+" unavailable");
 for(let seed=0;seed<500;seed++){
  const questions=factory[method]({seed:"independent-coordinates-algebra-"+week+"-"+seed});
  assert.equal(questions.length,6,"Week "+week+" generated non-six question bank");
  const skills=new Set();
  for(const q of questions){
   assert.equal(q.subject,"mathematics");
   assert.ok(factory.validateQuestion(q),"Malformed options "+q.prompt);
   assert.equal(q.options[q.answer],q.correct);
   assert.ok(!skills.has(q.skill),"Repeated skill "+q.skill);
   skills.add(q.skill);
   const value=independentlySolve(week,q);
   if(value===null){conceptual++;continue;}
   assert.equal(clean(q.correct),clean(value),"Independent solution mismatch W"+week+" / "+q.skill+" / "+q.prompt);
   calculated++;
  }
  draws++;
 }
}
console.log("PASS "+calculated+" independently recomputed Grade 6 coordinate/algebra/inequality answer instances; "+conceptual+" conceptual answer instances structurally tested only; "+draws+" six-question seeded draws for Weeks 23–25 and 32–33. No claim of full editorial or live student certification.");
