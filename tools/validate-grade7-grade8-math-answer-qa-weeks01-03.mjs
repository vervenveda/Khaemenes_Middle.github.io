import assert from "node:assert/strict";
import fs from "node:fs";

// Independently reviewed, problem-indexed mathematical expectations;
// these are purposefully held apart from the HTML answer keys.
const expected={
  "07": {
    "01": [
      [
        "$3",
        "$24",
        "yes, $3 per item",
        "$0"
      ],
      [
        "9 km/h",
        "36 km",
        "5 hours",
        "km/h"
      ],
      [
        "25",
        "35",
        "yes",
        "0"
      ],
      [
        "12",
        "18",
        "A",
        "4"
      ],
      [
        "63",
        "$6",
        "$30",
        "zero boxes produce zero items"
      ]
    ],
    "02": [
      [
        "75%",
        "12",
        "equal at 60%",
        "40%"
      ],
      [
        "25%",
        "20%",
        "20%",
        "50"
      ],
      [
        "15 percentage points",
        "37.5%",
        "5 percentage points",
        "10%"
      ],
      [
        "50%",
        "60%",
        "equal at 75%",
        "27"
      ],
      [
        "$8",
        "$72",
        "18",
        "60%"
      ]
    ],
    "03": [
      [
        "−1/2",
        "0.75",
        "−1/2",
        "5"
      ],
      [
        "−4",
        "−15",
        "2",
        "14"
      ],
      [
        "−6",
        "−4",
        "2",
        "−1/3"
      ],
      [
        "+9",
        "−9",
        "9",
        "−0.75"
      ],
      [
        "1/4",
        "−1/2",
        "−10",
        "−0.4"
      ]
    ]
  },
  "08": {
    "01": [
      [
        "5",
        "11",
        "2",
        "5"
      ],
      [
        "11",
        "−5",
        "8",
        "4"
      ],
      [
        "4",
        "1",
        "13",
        "16"
      ],
      [
        "x=5",
        "x=5",
        "x=4",
        "27=27"
      ],
      [
        "34",
        "6",
        "4",
        "x=6"
      ]
    ],
    "02": [
      [
        "−3",
        "7",
        "no",
        "−5"
      ],
      [
        "7",
        "10",
        "4",
        "9"
      ],
      [
        "5",
        "9",
        "−3",
        "x=2"
      ],
      [
        "8",
        "2",
        "17",
        "17"
      ],
      [
        "19",
        "−1",
        "8",
        "4"
      ]
    ],
    "03": [
      [
        "2",
        "2",
        "0",
        "undefined"
      ],
      [
        "−4",
        "3",
        "2",
        "2"
      ],
      [
        "y=2x+5",
        "y=−3x+1",
        "y=4",
        "11"
      ],
      [
        "−5",
        "−2",
        "−12",
        "8"
      ],
      [
        "−2",
        "13",
        "x=4",
        "9 over 3"
      ]
    ]
  }
};
const normalize=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/[−–]/g,"-").replace(/^\+(?=\d)/,"").replace(/\s+/g," ").trim().toLowerCase();
let verified=0,days=0;
for(const grade of ["07","08"])for(const week of ["01","02","03"]){
 const file="grades/grade-"+grade+"/subjects/mathematics/week-"+week+".html",html=fs.readFileSync(file,"utf8");
 const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(x=>x[0]);
 assert.equal(articles.length,5,file+" must retain all five daily lessons");
 for(let d=0;d<5;d++){
  const id="g"+grade+"-math-w"+week+"-d"+(d+1);
  const block=articles[d].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(block,id+" absent");
  const questionHTML=block.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
  const keyHTML=block.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(questionHTML&&keyHTML,id+" questions or solutions missing");
  const q=[...questionHTML.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const answers=[...keyHTML.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const truth=expected[grade][week][d];
  assert.equal(q.length,4,id+" must retain 4 independent prompts");
  assert.equal(answers.length,4,id+" must retain 4 teacher keys");
  assert.equal(new Set(q).size,4,id+" repeated prompt");
  assert.ok(block.includes('<label for="'+id+'-response"'),id+" accessible label");
  assert.ok(block.includes('<textarea id="'+id+'-response"'),id+" response field");
  assert.ok(block.includes("not automatically saved"),id+" formative storage guard");
  assert.ok(block.includes("official assessment engine may record verified 80% mastery"),id+" progression authority");
  for(let i=0;i<4;i++){
   assert.equal(normalize(answers[i]),normalize(truth[i]),id+" wrong answer for Q"+(i+1)+": "+q[i]);
   verified++;
  }
  days++;
 }
}
const file="grades/grade-07/subjects/mathematics/week-01.html",fixed=fs.readFileSync(file,"utf8");
assert.ok(fixed.includes("A pack of 3 identical items costs $18; what is the cost per item?"),"Unit rate question must ask per item");
assert.ok(fixed.includes("At that unit price, find the cost of 5 identical items."),"Application must ask five items not five packs");
assert.ok(fixed.includes("A journey covers 9 km in 1 hour."),"Rate question must state distance units");
for(const old of ["A pack of 3 costs $18; cost per pack?","Find cost of 5 identical packs."])assert.ok(!fixed.includes(old),"Incorrect unit ambiguity recurred");
assert.equal(days,30);
assert.equal(verified,120);
console.log("PASS Grade 7/8 Weeks 01–03 academic editorial: 30 daily labs, all 120 item-indexed expected teacher answers, original formative controls and three Grade 7 unit-rate wording repairs.");
