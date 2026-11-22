import assert from "node:assert/strict";
import fs from "node:fs";
// These separately authored mathematical expectations are indexed to each
// original problem. They test the answers rather than trusting key counts.
const expected={
  "07": {
    "10": [
      [
        "72 cm³",
        "90 cm³",
        "6 cm",
        "120 cm³"
      ],
      [
        "62 cm²",
        "96 cm²",
        "40 cm²",
        "24 cm²"
      ],
      [
        "72 cm³",
        "105 cm³",
        "7 cm",
        "25 cm²"
      ],
      [
        "60 cm³",
        "112 cm²",
        "60 cm³",
        "94 cm²"
      ],
      [
        "58 cm³",
        "24 m²",
        "54 cm²",
        "24 cm³"
      ]
    ],
    "11": [
      [
        "1/6",
        "1/2",
        "1/3",
        "1"
      ],
      [
        "3/5",
        "7/25",
        "37.5%",
        "1/2"
      ],
      [
        "1/4",
        "3/4",
        "1/4",
        "1/4"
      ],
      [
        "+$1",
        "1/6",
        "$0",
        "−$1"
      ],
      [
        "1/4",
        "3/4",
        "30%",
        "25"
      ]
    ],
    "12": [
      [
        "6",
        "5",
        "3",
        "4"
      ],
      [
        "13",
        "0",
        "5",
        "5"
      ],
      [
        "9",
        "5",
        "13",
        "8"
      ],
      [
        "60%",
        "60%",
        "60",
        "30%"
      ],
      [
        "4",
        "6",
        "5",
        "0"
      ]
    ]
  },
  "08": {
    "10": [
      [
        "28π cm³",
        "48π cm³",
        "50π cm³",
        "36π cm³"
      ],
      [
        "18π cm³",
        "12π cm³",
        "20π",
        "16π cm³"
      ],
      [
        "36π cubic units",
        "288π cubic units",
        "4.5π cubic units",
        "16π square units"
      ],
      [
        "96",
        "135",
        "8",
        "27"
      ],
      [
        "72π",
        "24π",
        "36π",
        "24π"
      ]
    ],
    "11": [
      [
        "9",
        "4",
        "2",
        "2"
      ],
      [
        "5",
        "12",
        "27",
        "6"
      ],
      [
        "+3",
        "−4",
        "0",
        "13"
      ],
      [
        "10",
        "+2",
        "3",
        "4"
      ],
      [
        "17",
        "3",
        "−7",
        "−3"
      ]
    ],
    "12": [
      [
        "1/6",
        "1/2",
        "1/2",
        "1"
      ],
      [
        "1/4",
        "1/4",
        "3/4",
        "1/36"
      ],
      [
        "4/5",
        "1/4",
        "1/2",
        "3/4"
      ],
      [
        "30%",
        "30%",
        "30",
        "0.7"
      ],
      [
        "+$2",
        "$0",
        "0.35",
        "75%"
      ]
    ]
  }
};
const norm=s=>String(s).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/[−–]/g,"-").replace(/^\+(?=\d)/,"").trim().toLowerCase().replace(/\s+/g," ");
let verified=0,lessons=0;
for(const grade of ["07","08"])for(const week of ["10","11","12"]){
 const file="grades/grade-"+grade+"/subjects/mathematics/week-"+week+".html";
 const html=fs.readFileSync(file,"utf8");
 const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(articles.length,5,file+" original day count");
 for(let day=0;day<5;day++){
  const id="g"+grade+"-math-w"+week+"-d"+(day+1);
  const panel=articles[day].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,id+" missing lab");
  const qlist=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
  const keylist=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(qlist&&keylist,id+" missing problems or keys");
  const questions=[...qlist.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
  const answers=[...keylist.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
  assert.equal(questions.length,4,id+" problems");assert.equal(answers.length,4,id+" keys");
  assert.equal(new Set(questions).size,4,id+" duplicated prompts");
  assert.ok(panel.includes('<label for="'+id+'-response"'),id+" missing accessible label");
  assert.ok(panel.includes('<textarea id="'+id+'-response"'),id+" response association");
  assert.ok(panel.includes("not automatically saved"),id+" formative persistence protection");
  assert.ok(panel.includes("official assessment engine may record verified 80% mastery"),id+" grading boundary");
  for(let j=0;j<4;j++){
   assert.equal(norm(answers[j]),norm(expected[grade][week][day][j]),id+" answer mismatch at "+(j+1)+": "+questions[j]);verified++;
  }lessons++;
 }
}
assert.equal(verified,120);assert.equal(lessons,30);
const q7=fs.readFileSync("grades/grade-07/subjects/mathematics/week-12.html","utf8");
const q8=fs.readFileSync("grades/grade-08/subjects/mathematics/week-12.html","utf8");
const q10=fs.readFileSync("grades/grade-08/subjects/mathematics/week-10.html","utf8");
for(const s of ["find lower-half median Q1","find upper-half median Q3","find the interquartile range"])assert.ok(q7.includes(s),"Quartile context: "+s);
for(const s of ["P(two tails in two fair coin flips)?","P(head then tail in two fair coin flips)?","P(rolling two sixes with two independent fair dice)?"])assert.ok(q8.includes(s),"Compound probability clarity: "+s);
assert.ok(q10.includes("same base and perpendicular height"),"Cone/cylinder comparison assumptions missing");
console.log("PASS Grade 7/8 mathematics Weeks 10–12: 30 daily labs, 120 indexed answer expectations, explicit quartile samples, coin/dice event definitions, cone/cylinder equivalence, intact response and grading authority.");
