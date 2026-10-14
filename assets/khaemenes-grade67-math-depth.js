/* Khaemenes Grades 6–7 · canonical-focus mathematics lesson practice. */
(function(){
"use strict";
const match=String(location.pathname).match(/\/grades\/grade-(0[67])\/subjects\/mathematics\/week-(\d{2})\.html$/i);
if(!match)return;
const grade=match[1],week=Number(match[2]);
let rendered=false;
const node=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);if(cls)n.className=cls;return n};
function practice(focus){
 const f=focus.toLowerCase(),n=week%7+3,advanced=grade==="07";
 if(/unit rate|rates|rate of change|proportional|proportions/.test(f)){
  const rate=n,base=3;
  return {concept:"Compare quantities using the same unit.",worked:`${base} notebooks cost $${base*rate}. Unit price = ${base*rate} ÷ ${base} = $${rate} each.`,try:`At that same price, what do 5 notebooks cost?`,answer:`5 × $${rate} = $${5*rate}.`,mis:"A unit rate uses ONE unit in the denominator, not the entire group."};
 }
 if(/percent|discount|percentage/.test(f)){
  const base=100+20*(week%5),pct=10*(week%4+1);
  return {concept:"Percent means parts out of one hundred.",worked:`${pct}% of ${base} = (${pct}/100) × ${base} = ${base*pct/100}.`,try:"Find 25% of "+(60+20*(week%5))+".",answer:String((60+20*(week%5))/4)+". One quarter is 25%.",mis:"Percent increase and percent of a quantity use different starting values."};
 }
 if(/fraction|division|rational/.test(f)){
  return advanced
   ?{concept:"Operate with signed rational numbers using a consistent model.",worked:"−3/4 + 1/2 = −3/4 + 2/4 = −1/4.",try:"Compute −5/6 + 1/3.",answer:"−5/6 + 2/6 = −3/6 = −1/2.",mis:"A negative sign belongs to the quantity; do not erase it when making denominators common."}
   :{concept:"Use equivalent fractions to combine quantities.",worked:"1/2 + 1/4 = 2/4 + 1/4 = 3/4.",try:"Compute 2/3 + 1/6.",answer:"4/6 + 1/6 = 5/6.",mis:"Add numerators after converting to a common denominator; do not add denominators."};
 }
 if(/equation|expression|inequal|algebra|variable/.test(f)){
  const x=n+2,k=n*2;
  return advanced
   ?{concept:"Solve equations using inverse operations on both sides.",worked:`2x + ${k} = ${2*x+k}. Subtract ${k}, then divide by 2: x=${x}.`,try:`Solve 3x + ${k} = ${3*x+k}.`,answer:`Subtract ${k}; divide by 3. x=${x}.`,mis:"When distributing, multiply every term inside parentheses."}
   :{concept:"Undo operations to isolate an unknown.",worked:`x + ${k} = ${x+k}. Subtract ${k} from both sides: x=${x}.`,try:`Solve x − ${k} = ${x-k}.`,answer:`Add ${k} to both sides: x=${x}.`,mis:"Use the same operation on both sides to preserve equality."};
 }
 if(/circle|circumference|radius|area|surface|volume|geometry|polygon|perimeter/.test(f)){
  const length=n+4,width=n;
  return advanced
   ?{concept:"Relate geometric measurements to the correct units.",worked:`For a circle of radius ${n}, area = πr² = ${n*n}π square units.`,try:`Find circumference when r=${n}.`,answer:`C=2πr=${2*n}π units.`,mis:"Circumference is a length; area is measured in square units."}
   :{concept:"Area counts square units inside a figure.",worked:`Rectangle ${length} by ${width}: A = length × width = ${length*width} square units.`,try:`Find the perimeter of the same rectangle.`,answer:`2(${length}+${width})=${2*(length+width)} units.`,mis:"Perimeter measures distance around, not the area inside."};
 }
 if(/probabil|chance|risk|sample/.test(f)){
  const red=n,blue=2;
  return {concept:"Probability compares favorable outcomes with all equally likely outcomes.",worked:`A bag with ${red} red and 2 blue tokens: P(red)=${red}/${red+2}.`,try:"What is P(blue) for the same bag?",answer:`2/${red+2}.`,mis:"A probability describes likelihood, not certainty on a single draw."};
 }
 if(/statistic|mean|median|data|graph|distribution/.test(f)){
  return {concept:"Summarize data without losing the context of its measurements.",worked:`Mean of ${n}, ${n+2}, ${n+4} is (${3*n+6})/3 = ${n+2}.`,try:`Find the mean of ${n+1}, ${n+5}, ${n+9}.`,answer:`(${3*n+15})/3=${n+5}.`,mis:"Always divide by the number of observations, not the largest observation."};
 }
 if(/negative|integer|coordinate|plane|quadrant/.test(f)){
  return {concept:"The sign of each number affects the result.",worked:`At position −${n}, moving right ${n+4} units ends at +4.`,try:`Evaluate −${n} + ${n+7}.`,answer:"7.",mis:"Moving right on a number line increases a value, even when starting negative."};
 }
 if(/scale|similar|ratio/.test(f)){
  return {concept:"Use multiplicative relationships when comparing scaled measurements.",worked:"On a map 1 cm represents 4 km, so 6 cm represents 24 km.",try:"How far does 8 cm represent at 1 cm = 3 km?",answer:"8 × 3 = 24 km.",mis:"Scale changes sizes multiplicatively, not by adding a fixed amount."};
 }
 return advanced
 ?{concept:"Use number relationships and defend your method.",worked:"2(3+4)=2×7=14; distributive check: 2×3+2×4=6+8=14.",try:"Expand and evaluate 3(2+5).",answer:"3×2+3×5=6+15=21.",mis:"Distribute over every term inside the grouping."}
 :{concept:"Compare different strategies for a precise answer.",worked:"3/4 of 20 = 20÷4×3 = 15.",try:"Find 2/5 of 30.",answer:"30÷5×2=12.",mis:"A fraction of a quantity means multiply by the fraction."};
}
function render(){
 if(rendered)return;
 const cross=window["KHAE_GRADE"+Number(grade)+"_SUBJECT_WEEK_CROSSWALK"];
 const row=cross?.weeks?.find(x=>Number(x.week)===week);
 const focus=row?.subjects?.mathematics?.focus;
 if(!focus)return;
 const articles=[...document.querySelectorAll("main article.lesson")];
 if(articles.length<5)return;
 rendered=true;
 const lesson=practice(String(focus));
 const style=node("style");
 style.textContent=".grade67-math-study{background:#fbf9f4;border:1px solid #d5c9b4;border-radius:7px;padding:15px;margin:13px 0;color:#111827;text-align:left}.grade67-math-study h5{font-weight:600;font-size:1rem;margin:0 0 8px}.grade67-math-study details{margin-top:8px;padding:8px;border:1px solid #bbc4cc;border-radius:7px}.grade67-math-study summary{cursor:pointer}.grade67-math-study p{line-height:1.6;margin:7px 0}";
 document.head.appendChild(style);
 const add=(article,heading,paragraphs,answer)=>{
  const card=node("section",undefined,"grade67-math-study");
  card.append(node("h5",heading));
  for(const content of paragraphs)card.append(node("p",content));
  if(answer){const d=node("details");d.append(node("summary","Reveal the worked answer"),node("p",answer));card.append(d)}
  article.append(card);
 };
 add(articles[0],"Concept + worked example",["Curriculum focus: "+focus,lesson.concept,lesson.worked],null);
 add(articles[1],"Guided independent exercise",[lesson.try,"Show each mathematical step, then check the units."],lesson.answer);
 add(articles[2],"Represent the idea",["Draw a model, number line, graph, or labeled table of the worked example. Explain what your model proves."],null);
 add(articles[3],"Misconception check",[lesson.mis,"Explain how you would correct a mistaken solution."],null);
 add(articles[4],"Mastery evidence",[lesson.try,"Solve again without revealing the answer. Verify using a second method and preserve your explanation for authorized adult review."],null);
 window.KhaemenesGrade67MathDepth=Object.freeze({version:"1.0.0",grade,week,focus:String(focus)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
function boot(){
 render();
 const script=document.querySelector(grade==="06"?"script[data-grade6-subject-crosswalk]":"script[data-grade7-subject-crosswalk]");
 if(!rendered&&script)script.addEventListener("load",render,{once:true});
}
})();
