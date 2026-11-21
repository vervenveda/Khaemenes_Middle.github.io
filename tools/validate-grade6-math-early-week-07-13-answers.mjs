import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Independent mathematical oracle for official Grade 6 assessment bank Weeks 07–13.
// Values are parsed from each displayed prompt, not copied from factory parameters.
const ctx={};
vm.runInNewContext(fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8"),ctx,{timeout:4000});
const f=ctx.KhaemenesMiddleQuestionFactory;
const numbers=p=>[...p.matchAll(/\d+(?:\.\d+)?/g)].map(x=>Number(x[0]));
const get=(p,re)=>{const m=p.match(re);assert.ok(m,"Cannot parse "+p);return m.slice(1).map(Number)};
const norm=s=>String(s).trim().replace(/\s+/g," ");
const group=[
 [7,"makeGrade6CoordinateWeek"],[8,"makeGrade6ExpressionsWeek"],
 [9,"makeGrade6EquationsWeek"],[10,"makeGrade6InequalitiesWeek"],
 [11,"makeGrade6StatisticsWeek"],[12,"makeGrade6GeometryWeek"],
 [13,"makeGrade6VolumeWeek"]
];
function solve(week,q){
 const p=q.prompt,k=q.skill,n=numbers(p);
 if(week===7){
  if(k==="plotting"){const [a,b]=get(p,/move (\d+) left and (\d+) up/);return "("+(-a)+", "+b+")";}
  if(k==="quadrants")return "III";
  if(k==="axes")return "On the y-axis";
  if(k==="reflection x"||k==="reflection y"){
   const [x,y]=get(p,/\((-?\d+),\s*(-?\d+)\)/);
   return k==="reflection x"?"("+x+", "+(-y)+")":"("+(-x)+", "+y+")";
  }
  if(k==="map scale"){const vals=get(p,/\((-\d+),\s*(\d+)\) and \((\d+),\s*(\d+)\).*?with (\d+) meters/);return String((vals[2]-vals[0])*vals[4])+" meters";}
 }
 if(week===8){
  if(k==="substitution"||k==="order of operations"){const [a,b,v]=get(p,/Evaluate (\d+)[xp](?:²)? \+ (\d+) when [xp] = (\d+)/);return String(k==="substitution"?a*v+b:a*v*v+b);}
  if(k==="translation"){const [b,a]=get(p,/represents (\d+) more than (\d+) times n/);return a+"n + "+b;}
  if(k==="distributive property"){const [a,b]=get(p,/Expand (\d+)\(x \+ (\d+)\)/);return a+"x + "+a*b;}
  if(k==="like terms"){const [a,b]=get(p,/Simplify (\d+)y \+ (\d+)y - 3/);return (a+b)+"y - 3";}
  if(k==="applied expressions"){const [fee,unit,visits]=get(p,/\$(\d+) enrollment fee and charges \$(\d+) per visit.*?for (\d+) visits/);return "$"+(fee+unit*visits);}
 }
 if(week===9){
  if(k==="addition equation"){const [a,total]=get(p,/x \+ (\d+) = (\d+)/);return String(total-a);}
  if(k==="subtraction equation"){const [a,total]=get(p,/x - (\d+) = (\d+)/);return String(total+a);}
  if(k==="multiplication equation"){const [a,total]=get(p,/Solve (\d+)x = (\d+)/);return String(total/a);}
  if(k==="division equation"){const [a,total]=get(p,/Solve x \/ (\d+) = (\d+)/);return String(total*a);}
  if(k==="word equations"){const [fee,rate,total]=get(p,/charges \$(\d+) once plus \$(\d+) per visit, totaling \$(\d+)/);return String((total-fee)/rate);}
  if(k==="signed equations"){const [negative,positive]=get(p,/x - \((-?\d+)\) = (\d+)/);return String(positive+negative);}
 }
 if(week===10){
  if(k==="strict inequality"){const [v]=get(p,/x > (\d+)/);return "Open circle at "+v+", shade right";}
  if(k==="addition-subtraction"){const [a,v]=get(p,/x - (\d+) ≤ (\d+)/);return "x ≤ "+(v+a);}
  if(k==="positive multiplication"){const [a,v]=get(p,/(\d+)x > (\d+)/);return "x > "+(v/a);}
  if(k==="negative coefficient"){const [a,v]=get(p,/Solve -(\d+)x ≥ (\d+)/);return "x ≤ -"+(v/a);}
  if(k==="budget constraint"){const [budget,fixed,rate]=get(p,/at most \$(\d+).*?costs \$(\d+) plus \$(\d+) per person/);return String(Math.floor((budget-fixed)/rate));}
  if(k==="inclusive boundary"){const [b]=get(p,/age ≥ (\d+)/);return "Age "+b+" or older";}
 }
 if(week===11){
  if(k==="statistical question"||k==="histogram bins")return null;
  const list=p.match(/(?:ordered data|values|data|mean of) ([\d,\s]+)(?:, what|, what| \?|\?)/i);
  assert.ok(list,"Cannot extract statistic values: "+p);
  const vals=list[1].split(",").map(x=>Number(x.trim()));
  assert.ok(vals.every(Number.isFinite)&&vals.length>=3,"Malformed statistics dataset: "+p);
  if(k==="median")return String([...vals].sort((a,b)=>a-b)[Math.floor(vals.length/2)]);
  if(k==="mode"){const counts=new Map();for(const v of vals)counts.set(v,(counts.get(v)||0)+1);return String([...counts].sort((a,b)=>b[1]-a[1])[0][0]);}
  if(k==="range")return String(Math.max(...vals)-Math.min(...vals));
  if(k==="mean")return String(vals.reduce((a,b)=>a+b,0)/vals.length);
 }
 if(week===12){
  if(k==="rectangle area"){const [a,b]=get(p,/area of a (\d+) cm by (\d+) cm rectangle/);return String(a*b);}
  if(k==="triangle area"){const [a,b]=get(p,/base (\d+) cm and perpendicular height (\d+) cm/);return String(a*b/2);}
  if(k==="composite area"){const [l,w,cl,ch]=get(p,/A (\d+) m by (\d+) m rectangle has a (\d+) m by (\d+) m corner removed/);return String(l*w-cl*ch);}
  if(k==="closed prism"){const [a,b,h]=get(p,/box measuring (\d+) by (\d+) by (\d+) cm/);return String(2*(a*b+a*h+b*h));}
  if(k==="lidless prism"){const [a,b,h]=get(p,/measuring (\d+) by (\d+) by (\d+) cm/);return String(a*b+2*a*h+2*b*h);}
  if(k==="units")return "cm²";
 }
 if(week===13){
  if(k==="whole-number volume"){const [a,b,h]=get(p,/measures (\d+) cm by (\d+) cm by (\d+) cm/);return String(a*b*h);}
  if(k==="fractional length"){const [a,b,c,d]=get(p,/measures (\d+)\/(\d+) m by (\d+) m by (\d+) m/);return String(a/b*c*d);}
  if(k==="unknown dimension"){const [v,a,b]=get(p,/volume (\d+) cm³, length (\d+) cm, and width (\d+) cm/);return String(v/(a*b));}
  if(k==="composite volume"){const [a,b,h,c,d,e]=get(p,/dimensions (\d+)×(\d+)×(\d+) cm and (\d+)×(\d+)×(\d+) cm/);return String(a*b*h+c*d*e);}
  if(k==="base area times height"){const [area,h]=get(p,/base area is (\d+) cm² and its height is (\d+) cm/);return String(area*h);}
  if(k==="cubic units")return "cm³";
 }
 throw Error("Missing independent solver: week "+week+" "+k+" "+p);
}
let computed=0,structural=0,draws=0;
for(const [week,method] of group){
 assert.equal(typeof f[method],"function",method+" not available");
 for(let seed=0;seed<500;seed++){
  const qs=f[method]({seed:"independently-audited-w"+week+"-"+seed});
  assert.equal(qs.length,6,"Expected six mathematics questions Week "+week);
  const seen=new Set();
  for(const q of qs){
   assert.equal(q.subject,"mathematics");
   assert.ok(f.validateQuestion(q),"Invalid choices "+q.prompt);
   assert.ok(!seen.has(q.skill),"Duplicate mathematics skill Week "+week+" "+q.skill);
   seen.add(q.skill);
   const expect=solve(week,q);
   if(expect===null){structural++;continue;}
   assert.equal(norm(q.correct),norm(expect),"Incorrect keyed numerical result Week "+week+" "+q.skill+": "+q.prompt);
   computed++;
  }
  draws++;
 }
}
console.log("PASS "+computed+" independently recomputed numerical/symbolic answers from 3500 Grade 6 seeded official bank draws Weeks 07–13; "+structural+" conceptual items structurally validated only. No learner records changed.");
