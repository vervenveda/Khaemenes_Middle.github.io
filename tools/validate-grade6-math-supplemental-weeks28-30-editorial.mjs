import assert from "node:assert/strict";
import fs from "node:fs";

// Question-indexed editorial checkpoint of Grade 6 math Weeks 28–30.
// null = explanation/creative answer for separate qualified teacher review.
const answers={
  "28": [
    [
      "3:4",
      "3:7",
      "18:42=3:7",
      "6 in first category and 15 in second"
    ],
    [
      "32",
      "20:24",
      "yes, factor 3",
      "2/3 differs from 4/5"
    ],
    [
      "9 labels/min",
      "84 labels",
      "12 minutes",
      null
    ],
    [
      "80% versus 60%",
      "40% versus 50%",
      null,
      "median 6"
    ],
    [
      "2:3",
      "x=35",
      "88 labels",
      "52 cm²",
      null
    ]
  ],
  "29": [
    [
      "60%",
      "0.6 and 60%",
      "18/30=60%",
      "20 verified of 50 total"
    ],
    [
      "29",
      "10",
      "60",
      null
    ],
    [
      "50% versus 60%",
      "70% versus 60%",
      null,
      null
    ],
    [
      "25% increase",
      "25% decrease",
      "15 percentage points and 30% relative",
      "8 cards/minute"
    ],
    [
      "75%",
      "42",
      "75% versus 60%",
      "6",
      null
    ]
  ],
  "30": [
    [
      "6",
      "32",
      null,
      null
    ],
    [
      "9/2",
      "1/2",
      "8/3",
      "quotient 2"
    ],
    [
      "3 full with 1/4 minute left",
      "7 full",
      "4 full with 1/4 minute left",
      null
    ],
    [
      "18 versus 36",
      null,
      "must multiply by reciprocal, so 6",
      "30"
    ],
    [
      "6",
      "10",
      "2:3",
      "60 cm³",
      null
    ]
  ]
};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const normalize=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").toLowerCase().replace(/\s+/g," ").trim();
let computed=0,teacherReview=0,all=0;
for(const w of [28,29,30]){
 const html=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+w+".html","utf8");
 for(let i=0;i<5;i++){
  const day=days[i],where="Week "+w+" "+day;
  const article=html.match(new RegExp('<article class="lesson"><h2>'+day+'[\\s\\S]*?<\\/article>'))?.[0];
  assert.ok(article,where+" missing lesson");
  const section=article.match(new RegExp('<section class="grade6-block-'+w+'-rigor"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(section,where+" missing deep practice");
  const prompts=[...section.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const key=section.match(/<summary>Teacher solution key[^<]*<\/summary><p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(key,where+" missing teacher key");
  const segments=key.split(";").map(x=>x.trim());
  const expected=answers[w][i];
  assert.equal(prompts.length,expected.length,where+" question count mismatch");
  assert.equal(segments.length,prompts.length,where+" teacher key answer count mismatch");
  for(let j=0;j<expected.length;j++){
   all++;
   if(expected[j]===null){teacherReview++;continue;}
   assert.ok(normalize(segments[j]).includes(normalize(expected[j])),where+" problem "+(j+1)+" incorrect key: "+segments[j]+"; prompt "+prompts[j]);
   computed++;
  }
 }
}
assert.equal(all,63);
console.log("PASS Grade 6 Weeks 28–30 supplemental answer audit: "+computed+" indexed numerical/symbolic key expectations across 63 problems; "+teacherReview+" open-ended reasoning tasks require separate qualified teacher review. Does not prove full academic certification.");
