import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const src=fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8");
const scope={};
vm.runInNewContext(src,scope,{filename:"question-factory.js",timeout:4000});
const f=scope.KhaemenesMiddleQuestionFactory;
assert.ok(f&&typeof f.validateQuestion==="function");
const nums=s=>[...s.matchAll(/\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));
const gcd=(a,b)=>b?gcd(b,a%b):a;
const norm=s=>String(s).replace(/\s+/g," ").trim();
const categories=[
 [26,"makeGrade6ClassicalGeometryWeek"],
 [27,"makeGrade6TradeStatisticsWeek"],
 [28,"makeGrade6LanguageRatioWeek"],
 [34,"makeGrade6CapstoneEquationWeek"],
 [35,"makeGrade6CapstoneGeometryWeek"],
 [36,"makeGrade6ReadinessStatisticsWeek"]
];
let numerical=0,conceptual=0,draws=0;
function expected(week,q){
 const p=q.prompt,skill=q.skill;
 let a;
 if(week===26||week===35){
   if(skill==="rectangle area"){a=nums(p);return String(a[0]*a[1]);}
   if(skill==="prism volume"){a=nums(p);return String(a[0]*a[1]*a[2]);}
   if(skill==="surface area"||skill==="six-face surface area"){a=nums(p);return String(2*(a[0]*a[1]+a[0]*a[2]+a[1]*a[2]));}
   if(skill==="triangle area"){a=nums(p);return String(a[0]*a[1]/2);}
   if(skill==="triangular prism"){a=nums(p);return String(a[0]*a[1]);}
   if(skill==="open-top model"||skill==="open-top models")return null;
 }
 if(week===27){
   if(skill==="mean"){a=nums(p);return String(a.slice(0,3).reduce((x,y)=>x+y,0)/3);}
   if(skill==="median"){a=nums(p);return String([...a.slice(0,5)].sort((x,y)=>x-y)[2]);}
   if(skill==="mode"){a=nums(p);const counts=new Map();for(const n of a.slice(0,4))counts.set(n,(counts.get(n)||0)+1);return String([...counts].sort((x,y)=>y[1]-x[1])[0][0]);}
   if(skill==="range"){a=nums(p);return String(a[1]-a[0]);}
   if(skill==="compare spread")return "B";
   if(skill==="interpret data")return null;
 }
 if(week===36){
   if(skill==="mean"){a=nums(p);return String(a.slice(0,3).reduce((x,y)=>x+y,0)/3);}
   if(skill==="median"){a=nums(p);return String([...a.slice(0,5)].sort((x,y)=>x-y)[2]);}
   if(skill==="mode"){a=nums(p);const counts=new Map();for(const n of a.slice(0,5))counts.set(n,(counts.get(n)||0)+1);return String([...counts].sort((x,y)=>y[1]-x[1])[0][0]);}
   if(skill==="range"){a=nums(p);return String(a[1]-a[0]);}
   if(skill==="comparing spread")return "B";
   if(skill==="interpret sample limits")return null;
 }
 if(week===28){
   if(skill==="simplify ratio"){a=nums(p);const d=gcd(a[0],a[1]);return (a[0]/d)+":"+(a[1]/d);}
   if(skill==="part to whole"){a=nums(p);return a[0]+":"+(a[0]+a[1]);}
   if(skill==="equivalent ratios"){a=nums(p);return String(a[2]/a[0]*a[1]);}
   if(skill==="unit rate"){a=nums(p);return String(a[0]/a[1]);}
   if(skill==="proportional rate"){a=nums(p);return String(a[0]*a[1]);}
   if(skill==="fair percentage comparisons")return "Practice A: 75%";
 }
 if(week===34){
   if(skill==="solve equation"){a=nums(p);return String((a[2]-a[1])/a[0]);}
   if(skill==="resource inequality"){a=nums(p);return "n ≤ "+String((a[2]-a[0])/a[1]);}
   if(skill==="strict inequality"){a=nums(p);return "t > "+String((a[2]+a[1])/a[0]);}
   if(skill==="reverse inequality"){a=nums(p);return "y ≤ −"+String(a[1]/a[0]);}
   if(skill==="feasible integer domain"){a=nums(p);return String(Math.floor((a[0]-a[1])/a[2]));}
   if(skill==="model limitations")return null;
 }
 throw Error("Unhandled quantitative generator: week "+week+" skill "+skill+" prompt "+p);
}
for(const [week,method] of categories){
 assert.equal(typeof f[method],"function",method+" missing");
 for(let seed=0;seed<500;seed++){
  const questions=f[method]({seed:"independent-numeric-grade6-"+week+"-"+seed});
  assert.equal(questions.length,6,"Week "+week+" returned non-six question bank");
  const skills=new Set();
  for(const q of questions){
    assert.equal(q.subject,"mathematics");
    assert.ok(f.validateQuestion(q),"Invalid options in "+q.prompt);
    assert.equal(q.options[q.answer],q.correct,"Incorrect answer slot "+q.prompt);
    assert.ok(!skills.has(q.skill),"Duplicated skill "+q.skill);
    skills.add(q.skill);
    const computed=expected(week,q);
    if(computed===null){conceptual++;continue;}
    assert.equal(norm(q.correct),norm(computed),"Incorrect calculated solution: Week "+week+" / "+q.skill+" / "+q.prompt);
    numerical++;
  }
  draws++;
 }
}
console.log("PASS independently recalculated "+numerical+" generated numerical mathematics answers, "+conceptual+" structure-validated conceptual answers, from "+draws+" seeded bank draws across Grade 6 Weeks 26, 27, 28, 34, 35 and 36. Other weeks and teacher keys still require review.");
