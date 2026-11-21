import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const normalize=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/[−–]/g,"-").trim().toLowerCase().replace(/\s+/g," ");
const gcd=(a,b)=>b===0?Math.abs(a):gcd(b,a%b);
const isqrt=n=>{const x=Math.sqrt(n);assert.ok(Number.isInteger(x),"Not a square: "+n);return x;};
function oracle(type,p){
 const [a,b,c,d]=p;
 switch(type){
 case "diam":return 2*a;
 case "circ":return 2*a+"π";
 case "area":return a*a+"π";
 case "half":return a*a/2+"π";
 case "boxvol":return a*b*c;
 case "boxarea":return 2*(a*b+a*c+b*c);
 case "openarea":return 2*(a*b+a*c+b*c)-a*b;
 case "frac":{const den=gcd(a,b);return [a+"/"+b,(a/den)+"/"+(b/den)];}
 case "percent":return a/b*100+"%";
 case "mean4":return a+3;
 case "range4":return 9;
 case "mul":return a*b;
 case "div":return a/b;
 case "quarter":return a/4;
 case "increase10":return a*1.1;
 case "decrease20":return a*0.8;
 case "signedadd":case "sum":return a+b;
 case "signedsub":case "difference":return a-b;
 case "expr":return a*c+b;
 case "expand":return a+"x+"+(a*b);
 case "combine":return a+b+"x-2";
 case "solveexpr":return "x="+c;
 case "upper":return "x≤"+(b-a);
 case "lowerprod":return "x≥"+b/a;
 case "flip":return "x>-"+b/a;
 case "maxvisits":return Math.floor((c-a)/b);
 case "square":return a*a;
 case "mult3":return 3*a;
 case "mult4":return 4*a;
 case "coords2":return "("+(2*a)+","+(2*b)+")";
 case "pyth":return isqrt(a*a+b*b);
 case "leg":return isqrt(b*b-a*a);
 case "pythyes":return a*a+b*b===c*c?"yes":"no";
 case "slope":return (d-b)/(c-a);
 case "intercept":return b;
 case "interceptslope":return a;
 case "func":return a*c-b;
 case "funcsolve":return "x="+c;
 case "systemx":return a;
 case "systemy":return b;
 case "thousands":return a*1000;
 case "tenthousands":return a+"×10⁴";
 case "scienceconstant":return "6×10⁵";
 case "sciencequot":return "10⁴";
 case "translate":return "("+(a+c)+","+(b+d)+")";
 case "reflectx":return "("+a+",-"+b+")";
 case "reflecty":return "(-"+a+","+b+")";
 case "rotate180":return "(-"+a+",-"+b+")";
 default:throw Error("Unknown mathematical oracle type: "+type);
 }
}
function verifyAnswer(answer,type,params,id){
 const candidates=[oracle(type,params)].flat().map(normalize);
 const actual=normalize(answer);
 const satisfied=candidates.some(c=>actual===c||actual.startsWith(c+" ")||actual.startsWith(c+";"));
 assert.ok(satisfied,id+" expected "+candidates.join(" or ")+" got "+actual);
}
const grades=["07","08"],days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
let weeks=0,lessons=0,questions=0,checked=0;
for(const grade of grades){
 const dir="grades/grade-"+grade+"/subjects/mathematics/";
 const catalog=fs.readFileSync(dir+"index.html","utf8");
 const cards=[...catalog.matchAll(/<article class="card week-card">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(cards.length,36,"Grade "+grade+" must preserve 36 course cards");
 for(let w=16;w<=36;w++){
  const week=String(w).padStart(2,"0");
  const file=dir+"week-"+week+".html",html=fs.readFileSync(file,"utf8");
  assert.ok(html.includes("khaemenes-middle-learning-context.js"),file+" must preserve approved learning loader");
  if(grade==="07")assert.ok(html.includes("grade-07-mathematics-studio-v1.js"),file+" must retain grade 7 studio owner");
  assert.ok(cards[w-1].includes('href="week-'+week+'.html"'),file+" missing original course route");
  const pageTitle=html.match(/<main[^>]*>[\s\S]*?<h1[^>]*>([^<]+)<\/h1>/)?.[1];
  assert.ok(pageTitle&&cards[w-1].includes("<h3>"+pageTitle+"</h3>"),file+" title and catalog diverge");
  const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(m=>m[0]);
  assert.equal(articles.length,5,file+" must preserve five daily articles");
  for(let d=0;d<5;d++){
   const day=days[d],lesson=articles[d],labid="g"+grade+"-math-w"+week+"-d"+(d+1);
   assert.match(lesson,new RegExp("<h4>"+day+"(?:\\s|:|\\s*[—-])"),labid+" day title");
   const block=lesson.match(new RegExp('<section class="khae-math-depth" data-math-depth="'+labid+'"[\\s\\S]*?<\\/section>'))?.[0];
   assert.ok(block,labid+" missing deep lab");
   assert.equal((lesson.match(/data-math-depth=/g)||[]).length,1,labid+" duplicate lab");
   for(const marker of ["Vocabulary in context:","Worked mathematical model:","Misconception checkpoint:","Independent reasoning challenges:","Independent self-check:","Teacher solution key (open after attempting)"]){
    assert.ok(block.includes(marker),labid+" missing "+marker);
   }
   assert.ok(block.includes('<label for="'+labid+'-response"'),labid+" label mismatch");
   assert.ok(block.includes('<textarea id="'+labid+'-response"'),labid+" response input mismatch");
   assert.match(block,/not automatically saved/);
   assert.match(block,/official assessment engine may record verified 80% mastery/);
   assert.ok(!/<script|localStorage|sessionStorage|fetch\(|mastery_met|authoritative:true/.test(block),labid+" unauthorized interaction or grade writer");
   const qs=block.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
   const key=block.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
   assert.ok(qs&&key,labid+" problem/key section absent");
   const promptList=[...qs.matchAll(/<li data-math-check="([^"]+)" data-params="([^"]*)">([\s\S]*?)<\/li>/g)];
   const answers=[...key.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
   assert.equal(promptList.length,4,labid+" must contain four parameterized independent tasks");
   assert.equal(answers.length,4,labid+" must contain four corresponding teacher answers");
   assert.equal(new Set(promptList.map(x=>x[3])).size,4,labid+" duplicated prompt");
   for(let i=0;i<4;i++){
    const p=promptList[i],params=p[2]?p[2].split(",").map(Number):[];
    assert.ok(params.every(Number.isFinite),labid+" has invalid operands");
    verifyAnswer(answers[i],p[1],params,labid+" item "+(i+1)+" "+p[3]);
    checked++;
   }
   questions+=4;lessons++;
  }
  weeks++;
 }
}
assert.deepEqual({weeks,lessons,questions,checked},{weeks:42,lessons:210,questions:840,checked:840});
for(const engine of ["assets/khaemenes-middle-math-lesson-engine-v1.js","assets/grade-07-mathematics-studio-v1.js","assets/khaemenes-middle-math-portal-studio-v1.js","assets/khaemenes-middle-math-week-practice-v1.js"]){
 new vm.Script(fs.readFileSync(engine,"utf8"),{filename:engine});
}
console.log("PASS Grade 7/8 Weeks 16–36: 42 topic-aligned weekly pages, 210 day laboratories, 840 source-parameter-recalculated teacher keys, 42 catalog routes, original studio owners and formative-only mastery boundary. No claim of human-reviewed reasoning quality or live-browser learning outcomes.");
