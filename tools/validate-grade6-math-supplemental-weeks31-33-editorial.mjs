import assert from "node:assert/strict";
import fs from "node:fs";

// Editorial answer-key regression for mathematics Weeks 31–33.
// Derived mathematical results are matched by corresponding prompt order;
// null entries need human review for validity and teaching depth.
const checks={
  "31": [
    [
      "4",
      "−5",
      "−3",
      null
    ],
    [
      "+6",
      "−5.5",
      "−3.75",
      null
    ],
    [
      "−5/8",
      "−1/6",
      "3/4",
      "5/12"
    ],
    [
      "+1",
      "+1",
      null,
      "6"
    ],
    [
      "2.5",
      "7",
      "−1/4",
      "30",
      "11"
    ]
  ],
  "32": [
    [
      "I, II, III, IV",
      "(−4,−2)",
      null,
      "negative y-axis"
    ],
    [
      "9 units",
      "9 units",
      "11 steps",
      null
    ],
    [
      "(4,7)",
      "(6,3)",
      "(3,5)",
      null
    ],
    [
      "(−2,2),(0,2),(4,2)",
      null,
      "8 grid units",
      null
    ],
    [
      "(−4,−5)",
      "8 units",
      "−1/4",
      "2:3",
      null
    ]
  ],
  "33": [
    [
      "T=3n+7",
      "34",
      "coefficient 8 and constant 11",
      "5r+45"
    ],
    [
      "4y+20",
      "6p−8",
      "x=0 gives 6 versus 2",
      "both equal 2"
    ],
    [
      "5n+6",
      "5x+6",
      "27",
      null
    ],
    [
      "A26 vs B30",
      "A50 vs B46",
      "t=4",
      null
    ],
    [
      "3a+8",
      "11",
      "(3,4)",
      "5/2",
      null
    ]
  ]
};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const normalized=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").toLowerCase().replace(/\s+/g," ").trim();
let checked=0,teacherReview=0,questions=0;
for (const w of [31,32,33]) {
 const html=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+w+".html","utf8");
 for (let i=0;i<5;i++) {
  const day=days[i], context="Week "+w+" "+day;
  const article=html.match(new RegExp('<article class="lesson"><h2>'+day+'[\\s\\S]*?<\\/article>'))?.[0];
  assert.ok(article,context+" missing article");
  const panel=article.match(new RegExp('<section class="grade6-block-'+w+'-rigor"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,context+" missing supplemental panel");
  const prompts=[...panel.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const key=panel.match(/<summary>Teacher solution key[^<]*<\/summary><p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(key,context+" missing solution key");
  const answers=key.split(";").map(x=>x.trim());
  const expected=checks[w][i];
  assert.equal(prompts.length,expected.length,context+" problem count mismatch");
  assert.equal(answers.length,prompts.length,context+" solution count mismatch");
  for (let j=0;j<expected.length;j++) {
   questions++;
   if(expected[j]===null){teacherReview++;continue;}
   assert.ok(normalized(answers[j]).includes(normalized(expected[j])),context+" answer #"+(j+1)+" mismatch: "+prompts[j]+"; expected "+expected[j]+", found "+answers[j]);
   checked++;
  }
 }
}
assert.equal(questions,63);
assert.equal(checked+teacherReview,63);
console.log("PASS Grade 6 mathematics Weeks 31–33 editorial checkpoint: "+checked+" numerical/symbolic teacher-key expectations matched their individual prompts among "+questions+" problems, "+teacherReview+" open-ended prompts explicitly retained for separate teacher review. Not evidence of full course learning outcomes.");
