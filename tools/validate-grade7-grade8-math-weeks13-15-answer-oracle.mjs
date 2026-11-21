import assert from "node:assert/strict";
import fs from "node:fs";
const expected={"07":{"13":["5x+7","5y+12","yes","28","29"],"14":["n≤20","x>5","60%","6","2≤x≤7"],"15":["28 m","32 cm²","32 m","15 km","8 cm"]},"08":{"13":["7","5","16","9","9"],"14":["25%","60000","75%","30 km/h","60%"],"15":["(5,4)","(−2,−4)","(−4,6)","60°","(−2,−3)"]}};
const titles={"07":["Algebraic Expressions and Model Interpretation","Inequalities, Data Claims and Constraints","Scale Drawings and Research Evidence"],"08":["Systems of Equations and Decision Models","Quantitative Claims and Scientific Notation","Transformations, Congruence and Similarity"]};
const norm=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").toLowerCase().replace(/\s+/g," ").trim();
let tested=0;
for(const grade of ["07","08"]){
 const dir="grades/grade-"+grade+"/subjects/mathematics/";
 const catalog=fs.readFileSync(dir+"index.html","utf8");
 const cards=[...catalog.matchAll(/<article class="card week-card">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(cards.length,36);
 for(const week of ["13","14","15"]){
  const idx=Number(week)-13,html=fs.readFileSync(dir+"week-"+week+".html","utf8"),title=titles[grade][idx];
  assert.ok(html.includes(">"+title+"</h1>"),"week heading "+grade+" "+week);
  assert.ok(cards[Number(week)-1].includes("<h3>"+title+"</h3>"),"catalog title "+grade+" "+week);
  assert.ok(cards[Number(week)-1].includes('href="week-'+week+'.html"'),"catalog route "+grade+" "+week);
  const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(m=>m[0]);assert.equal(articles.length,5);
  for(let day=0;day<5;day++){
   const labId="g"+grade+"-math-w"+week+"-d"+(day+1);
   const panel=articles[day].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+labId+'"[\s\S]*?<\/section>'))?.[0];
   assert.ok(panel,"missing "+labId);
   const problems=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
   const key=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
   assert.ok(problems&&key,labId);
   const qs=[...problems.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
   const answers=[...key.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
   assert.equal(qs.length,4);assert.equal(answers.length,4);
   const oracle=expected[grade][week][day];
   assert.ok(norm(answers[0]).includes(norm(oracle)),"Independent answer expectation mismatch "+labId+" expected "+oracle+" got "+answers[0]+" for "+qs[0]);
   tested++;
  }
 }
}
assert.equal(tested,30);
console.log("PASS Grade 7/8 math Weeks 13–15: 6 topic-matched catalog routes, 30 independently established first-problem answer expectations. Other 90 of 120 new teacher keys remain for independent mathematical review.");
