import assert from "node:assert/strict";
import fs from "node:fs";
const expectedFocus={"07":["proportional relationships and unit rates","unit rates, percentages and percent change","signed rational-number operations","percent increase, decrease and comparative data","rational-number arithmetic with fractions and decimals","algebraic expressions, distribution and like terms","equations, inequalities and whole-number constraints","scale drawings, proportional lengths and geometric design","circle circumference, area and composite design","prism volume, surface area and geometric modeling","theoretical and experimental probability, fair games","statistical centers, variability, sampling and inference"],"08":["linear relationships, rates and intercepts","functions, notation and linear-versus-nonlinear patterns","slope, line equations and intercepts","slope, graphical evidence and linear comparisons","systems of equations, substitution and elimination","exponents, scientific notation and magnitude","rigid transformations and congruence","dilations, similarity and scale factors","Pythagorean theorem and coordinate distance","cylinders, cones, spheres and volume scaling","bivariate data, residuals and linear models","probability, conditional events, expected value and risk"]};
const answerOracle={"07":{"10":["72 cm³","62 cm²","72 cm³","60 cm³","58 cm³"],"11":["1/6","3/5","1/4","+$1","1/4"],"12":["6","13","9","60%","4"]},"08":{"10":["28π cm³","18π cm³","36π cubic units","96","72π"],"11":["9","5","+3","10","17"],"12":["1/6","1/4","4/5","30%","+$2"]}};
const normalize=s=>String(s).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").trim().toLowerCase().replace(/\s+/g," ");
let aligned=0,checked=0;
for(const grade of ["07","08"]){
 const dir="grades/grade-"+grade+"/subjects/mathematics/";
 const html=fs.readFileSync(dir+"index.html","utf8");
 const cards=[...html.matchAll(/<article class="card week-card">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(cards.length,36,"Keep all original "+grade+" course cards");
 for(let n=1;n<=36;n++)assert.ok(cards[n-1].includes('href="week-'+String(n).padStart(2,"0")+'.html"'),"Grade "+grade+" week link "+n);
 for(let n=1;n<=12;n++){
  const card=cards[n-1],focus=card.match(/<strong>Focus:<\/strong>\s*([^<]+)/)?.[1];
  assert.equal(focus,expectedFocus[grade][n-1],"Grade "+grade+" Week "+n+" course topic drift");
  const week=fs.readFileSync(dir+"week-"+String(n).padStart(2,"0")+".html","utf8");
  assert.ok(week.includes('<h1'),"Missing week heading");
  aligned++;
 }
 for(const weekNumber of [10,11,12]){
  const week=String(weekNumber).padStart(2,"0");
  const content=fs.readFileSync(dir+"week-"+week+".html","utf8");
  const articles=[...content.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(m=>m[0]);
  assert.equal(articles.length,5,"Week "+week+" keeps five lessons");
  for(let d=0;d<5;d++){
   const id="g"+grade+"-math-w"+week+"-d"+(d+1);
   const panel=articles[d].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
   assert.ok(panel,"Missing "+id);
   const student=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
   const teacher=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
   assert.ok(student&&teacher,"Missing original mathematical items for "+id);
   const q=[...student.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
   const a=[...teacher.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
   assert.equal(q.length,4);assert.equal(a.length,4);
   const first=answerOracle[grade][week][d];
   assert.ok(normalize(a[0]).includes(normalize(first)),"Math oracle mismatch: "+id+" "+q[0]+" expected "+first+" got "+a[0]);
   checked++;
  }
 }
}
assert.equal(aligned,24);
assert.equal(checked,30);
console.log("PASS Grade 7/8 mathematics: 24 catalog focus labels match authored Weeks 01–12; 72 week links preserved; 30 independently calculated first-problem mathematical-key expectations passed for Weeks 10–12. Remaining 450 of 480 new keys still require independent editorial review.");
