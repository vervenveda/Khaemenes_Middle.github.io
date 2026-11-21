import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const sb={};vm.runInNewContext(fs.readFileSync("assets/khaemenes-middle-question-factory.js","utf8"),sb,{timeout:4000});
const f=sb.KhaemenesMiddleQuestionFactory;
const choose=(p,re)=>{const m=p.match(re);assert.ok(m,"Cannot parse displayed question: "+p);return m.slice(1).map(x=>Number(String(x).replace("−","-")))};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const signed=s=>Number(s.replace("−","-"));
const fmt=x=>String(x);
const table=[[14,"makeGrade6MatterMathWeek"],[15,"makeGrade6ThermalMathWeek"],[16,"makeGrade6MotionMathWeek"],[17,"makeGrade6PortfolioWeek"],[18,"makeGrade6WaveMathWeek"],[19,"makeGrade6VisualRatioWeek"]];
function evaluate(week,q){
 const p=q.prompt,k=q.skill;
 if(week===14){
  if(k==="unit rates"){const [mass,vol]=choose(p,/mass (\d+) g and volume (\d+) cm³/);return fmt(mass/vol);}
  if(k==="ratio tables"){const [rate,vol]=choose(p,/constant (\d+) g\/cm³.*?mass of (\d+) cm³/);return fmt(rate*vol);}
  if(k==="graphing"){const [rate,vol]=choose(p,/mass = (\d+) × volume.*?volume (\d+) cm³/);return "("+vol+", "+(rate*vol)+")";}
  if(k==="comparing rates"){const [am,av,bm,bv]=choose(p,/Sample A is (\d+) g in (\d+) cm³; sample B is (\d+) g in (\d+) cm³/);const x=am/av,y=bm/bv;return x===y?"Equal":x>y?"A":"B";}
  if(k==="measurement units")return "g/cm³";
  if(k==="inverse unit rates"){const [rate,mass]=choose(p,/constant rate (\d+) g\/cm³, mass = (\d+) g/);return fmt(mass/rate);}
 }
 if(week===15){
  if(k==="temperature difference"||k==="negative change"){const [start,end]=choose(p,/from ([−-]?\d+)°C (?:to|back to) ([−-]?\d+)°C/);return fmt(end-start);}
  if(k==="average rate"){const [change,time]=choose(p,/rises (\d+)°C in (\d+) minutes/);return fmt(change/time);}
  if(k==="coordinate graph"){const [temperature,time]=choose(p,/shows ([−-]?\d+)°C at minute (\d+)/);return "("+time+", "+temperature+")";}
  if(k==="plateau rate")return "0°C/min";
  if(k==="data interpretation")return null;
 }
 if(week===16){
  if(k==="average speed"){const [distance,time]=choose(p,/travels (\d+) m in (\d+) s/);return fmt(distance/time);}
  if(k==="distance model"){const [rate,time]=choose(p,/steady (\d+) m\/s for (\d+) s/);return fmt(rate*time);}
  if(k==="unknown time"){const [rate,distance]=choose(p,/Solve (\d+)t = (\d+)/);return fmt(distance/rate);}
  if(k==="ordered pairs"){const [time,distance]=choose(p,/represents (\d+) s and (\d+) m/);return "("+time+", "+distance+")";}
  if(k==="compare average speeds"){const [a,ta,b,tb]=choose(p,/Cart A travels (\d+) m in (\d+) s.*?Cart B travels (\d+) m in (\d+) s/);return a/ta===b/tb?"Equal":a/ta>b/tb?"A":"B";}
  if(k==="rate units")return "m/s";
 }
 if(week===17){
  if(k==="ratio evidence"){const [a,b,c]=choose(p,/ratio (\d+):(\d+) = (\d+): \?/);return fmt(b*c/a);}
  if(k==="equation defense"){const [sub,result]=choose(p,/x - (\d+) = (\d+)/);return fmt(sub+result);}
  if(k==="area units"){const [base,h]=choose(p,/base (\d+) cm and perpendicular height (\d+) cm/);return fmt(base*h/2);}
  if(k==="volume evidence"||k==="surface area evidence"){const [a,b,h]=choose(p,/prism (\d+) by (\d+) by (\d+) cm/);return fmt(k==="volume evidence"?a*b*h:2*(a*b+a*h+b*h));}
  if(k==="statistics defense"){const m=p.match(/ordered values ([\d, ]+)/);assert.ok(m,"Cannot parse portfolio data "+p);const a=m[1].split(",").map(x=>Number(x.trim()));return fmt(a.sort((x,y)=>x-y)[2]);}
 }
 if(week===18){
  if(k==="range"){const [lower,upper]=choose(p,/minimum −(\d+) and maximum \+(\d+)/);return fmt(lower+upper);}
  if(k==="pulse unit rate"){const [pulses,time]=choose(p,/shows (\d+) pulses in (\d+) seconds/);return fmt(pulses/time);}
  if(k==="rate prediction"){const [rate,time]=choose(p,/steady modeled (\d+) pulses per second.*?in (\d+) seconds/);return fmt(rate*time);}
  if(k==="signed plotting"){const [index,displacement]=choose(p,/sample index (\d+) and displacement −(\d+)/);return "("+index+", −"+displacement+")";}
  if(k==="statistics"){const m=p.match(/ordered signal readings ([\d, ]+)/);assert.ok(m,"Cannot parse wave data "+p);const a=m[1].split(",").map(x=>Number(x.trim()));return fmt(a.sort((x,y)=>x-y)[2]);}
  if(k==="model limitation")return null;
 }
 if(week===19){
  if(k==="part-to-part ratios"){const [light,dark]=choose(p,/image has (\d+) light and (\d+) dark pixels/),div=gcd(light,dark);return light/div+":"+dark/div;}
  if(k==="scale factor"){const [size,factor]=choose(p,/model is (\d+) cm wide and enlarged by scale factor (\d+)/);return fmt(size*factor);}
  if(k==="unit rate"){const [frames,seconds]=choose(p,/presents (\d+) frames in (\d+) seconds/);return fmt(frames/seconds);}
  if(k==="rate model"){const [fps,seconds]=choose(p,/At (\d+) frames per second for (\d+) seconds/);return fmt(fps*seconds);}
  if(k==="part-to-whole percent"){const [a,b]=choose(p,/reports (\d+) successes among (\d+) responses/);return fmt(a/b*100)+"%";}
  if(k==="visual claims")return "15 of 20";
 }
 throw Error("No oracle for Week "+week+" skill "+k+" prompt "+p);
}
let numeric=0,conceptual=0,draws=0;
for(const [week,method] of table){
 assert.equal(typeof f[method],"function");
 for(let seed=0;seed<500;seed++){
  const bank=f[method]({seed:"grade6-week-14-19-math-verified-"+week+"-"+seed});
  assert.equal(bank.length,6);
  for(const q of bank){
   assert.equal(q.subject,"mathematics");
   assert.ok(f.validateQuestion(q),"Invalid option structure "+q.prompt);
   const answer=evaluate(week,q);
   if(answer===null){conceptual++;continue;}
   assert.equal(String(q.correct),String(answer),"Wrong mathematical answer: W"+week+" / "+q.skill+" / "+q.prompt);
   numeric++;
  }
  draws++;
 }
}
console.log("PASS "+numeric+" independently computed official mathematics answers, "+conceptual+" conceptual prompts structurally reviewed, "+draws+" randomized draws for Grade 6 Weeks 14–19.");
