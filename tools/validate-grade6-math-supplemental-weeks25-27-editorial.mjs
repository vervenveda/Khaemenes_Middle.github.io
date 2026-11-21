import assert from "node:assert/strict";
import fs from "node:fs";

// Prompt-indexed Grade 6 mathematical solution verification, Weeks 25–27.
// null marks independent conceptual/explanatory items requiring teacher review.
const checks={
  "25": [
    [
      "x=7",
      "y=5",
      "a=−5",
      null
    ],
    [
      "d≥17",
      "a<12",
      "0≤p≤18",
      null
    ],
    [
      "n>3",
      "p≥−5",
      "x≤−8",
      "open circle at −2 shaded right"
    ],
    [
      "A12 and B9",
      "A24 and B27",
      "max 8",
      null
    ],
    [
      "y=4",
      "x≤−3",
      "5a+10",
      "7",
      null
    ]
  ],
  "26": [
    [
      "45 m² and 90 m³",
      "48 m²",
      null,
      "volume doubles from 24 to 48 cm³"
    ],
    [
      "76 cm²",
      "7×3,7×2,3×2",
      "closed 52−12=40 cm²",
      null
    ],
    [
      "140 cm³",
      "5 cm",
      null,
      "both 60 cm³"
    ],
    [
      "Open area 40 cm², volume 24 cm³",
      "12 cm² lid",
      null,
      "t=0,1,2,3,4,5,6"
    ],
    [
      "24 m² and 120 m³",
      "54 cm²",
      "94 cm²",
      "−1/4",
      null
    ]
  ],
  "27": [
    [
      "6",
      "5",
      "9 days",
      null
    ],
    [
      "Mean 6, median 4, mode 4",
      "median 6",
      "bimodal: 3 and 5",
      null
    ],
    [
      "14",
      "mean 5, range 8",
      null,
      "range 6 versus zero"
    ],
    [
      "2→2,3→1,4→3,5→1",
      "median 7, range 6",
      "median 7, range 0",
      null
    ],
    [
      "Mean 5, median 3",
      "range 10, mode 2",
      "60 cm³",
      "Quadrant III",
      null
    ]
  ]
};
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
const norm=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").toLowerCase().replace(/\s+/g," ").trim();
let verified=0,open=0,problems=0;
for(const week of [25,26,27]){
 const html=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+week+".html","utf8");
 for(let d=0;d<5;d++){
  const context="Week "+week+" "+days[d];
  const article=html.match(new RegExp('<article class="lesson"><h2>'+days[d]+'[\\s\\S]*?<\\/article>'))?.[0];
  assert.ok(article,context+" lesson missing");
  const panel=article.match(new RegExp('<section class="grade6-block-'+week+'-rigor"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,context+" supplemental panel missing");
  const questions=[...panel.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const teacher=panel.match(/<summary>Teacher solution key[^<]*<\/summary><p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(teacher,context+" teacher key missing");
  const answers=teacher.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").split(";").map(x=>x.trim());
  const expected=checks[week][d];
  assert.equal(questions.length,expected.length,context+" question count changed");
  assert.equal(answers.length,questions.length,context+" answer segment count changed");
  for(let j=0;j<expected.length;j++){
   problems++;
   if(expected[j]===null){open++;continue;}
   assert.ok(norm(answers[j]).includes(norm(expected[j])),context+" problem "+(j+1)+" answer mismatch; expected "+expected[j]+" for "+questions[j]+"; got "+answers[j]);
   verified++;
  }
 }
}
assert.equal(problems,63);
assert.equal(verified+open,problems);
console.log("PASS Grade 6 mathematics Weeks 25–27 supplemental editorial checks: "+verified+" prompt-indexed numerical/symbolic key expectations among "+problems+" problems, "+open+" open-response teacher-review items. No full academic or learning-outcome certification.");
