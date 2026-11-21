import assert from "node:assert/strict";
import fs from "node:fs";
// Editorial test: numerically checked key entries; null = open-response teacher review.
const answerChecks={
34:[
["s≤5","7 trials",null,"total 75 exceeds 65"],
["x=8","y=6","t=−6",null],
["x≤5","t>5",null,"0 through 19"],
["x>−4","y≥−4",null,"5a+10"],
["s=5","0≤s≤5","Quadrant III","29",null]
],
35:[
["40 cm² and 120 cm³","volume 72 versus 144 cm³",null,"n=0 through 5"],
["72 cm²","two faces each 4×3, 4×2, 3×2","56 cm²",null],
["168 cm³","6 cm",null,"both volumes are 60 cm³"],
["Volume 60 cm³","add 20 cm²",null,"ranges 4 and 8"],
["94 cm² and 60 cm³","36 cm²","5x+12","24",null]
],
36:[
["Mean 7, median 6","both 6","(4+8)/2",null],
["Mean 5, median 4, mode 2, range 8","two modes 3 and 5","6.2 to 21/5=4.2",null],
["Both mean and median 6; range 4","second mean 6, median 6, range 10","A range 2, B range 4",null],
["45","−1/4","x=6","72 square units","6"],
["Median 3 and range 7","4, check 4×1/6=2/3","x≤−4","76 cm²",null]
]};
const tidy=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").toLowerCase().replace(/\s+/g," ").trim();
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
let calculated=0,teacherReview=0,all=0;
for(const week of [34,35,36]){
 const html=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+week+".html","utf8");
 for(let i=0;i<5;i++){
  const day=days[i],context="Week "+week+" "+day;
  const article=html.match(new RegExp('<article class="lesson"><h2>'+day+'[\\s\\S]*?<\\/article>'))?.[0];
  assert.ok(article,context+" missing article");
  const panel=article.match(new RegExp('<section class="grade6-block-'+week+'-rigor"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,context+" missing panel");
  const prompts=[...panel.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const key=panel.match(/<summary>Teacher solution key[^<]*<\/summary><p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(key,context+" missing teacher key");
  const expected=answerChecks[week][i];
  assert.equal(prompts.length,expected.length,context+" prompt count drift");
  for(let j=0;j<expected.length;j++){
   all++;
   if(expected[j]===null){teacherReview++;continue;}
   assert.ok(tidy(key).includes(tidy(expected[j])),context+" #"+(j+1)+" expected "+expected[j]+" for "+prompts[j]);
   calculated++;
  }
 }
}
assert.equal(all,64);
console.log("PASS Grade 6 Weeks 34–36 editorial checkpoint: "+calculated+" independent numeric/symbolic key expectations across "+all+" problems; "+teacherReview+" open-response explanations reserved for teacher review. This is not full academic certification.");
