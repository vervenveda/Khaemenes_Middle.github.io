import fs from "node:fs";
import assert from "node:assert/strict";

// Separately curated mathematical expectations for all items Weeks 07–09.
// Answer strings remain in course HTML; this file guards against key drift.
const expected={
  "07": {
    "07": [
      [
        "x=7",
        "y=5",
        "a=−4",
        "26=26"
      ],
      [
        "x>8",
        "y≤6",
        "n≥5",
        "yes"
      ],
      [
        "x≤−5",
        "y>−2",
        "a≥−3",
        "12≥10; yes"
      ],
      [
        "6 visits",
        "7+8v≤55",
        "v≤6",
        "0"
      ],
      [
        "x=8",
        "x≤−4",
        "n=5",
        "21=21"
      ]
    ],
    "08": [
      [
        "30 m",
        "7 km",
        "9 cm",
        "12 cm"
      ],
      [
        "108 cm²",
        "56 cm",
        "48 square units",
        "3"
      ],
      [
        "28 m",
        "8 m",
        "4 cm",
        "5 cm"
      ],
      [
        "8 m and 20 m",
        "160 m²",
        "225 square units",
        "4"
      ],
      [
        "14 m",
        "15 cm",
        "80",
        "54"
      ]
    ],
    "09": [
      [
        "12 cm",
        "12π cm",
        "10π cm",
        "7 cm"
      ],
      [
        "25π cm²",
        "16π cm²",
        "4π cm²",
        "6 cm"
      ],
      [
        "9π/2 cm²",
        "3π cm",
        "3π+6 cm",
        "4π cm²"
      ],
      [
        "49π cm²",
        "14π cm",
        "4",
        "2"
      ],
      [
        "8π",
        "16π",
        "40π",
        "10 cm"
      ]
    ]
  },
  "08": {
    "07": [
      [
        "(6,2)",
        "(−3,4)",
        "(−2,2)",
        "(+3,−2)"
      ],
      [
        "(−3,−5)",
        "(3,5)",
        "(−5,2)",
        "(−2,−5)"
      ],
      [
        "yes",
        "yes",
        "no",
        "translation"
      ],
      [
        "(1,−2)",
        "(4,−2)",
        "(−3,1)",
        "(0,4)"
      ],
      [
        "5 cm",
        "60°",
        "15",
        "9"
      ]
    ],
    "08": [
      [
        "(4,−6)",
        "(−2,3)",
        "(0,15)",
        "(1.5,1.5)"
      ],
      [
        "21",
        "3",
        "3",
        "40°"
      ],
      [
        "32",
        "44",
        "12.5",
        "162"
      ],
      [
        "2.5",
        "15",
        "yes",
        "no"
      ],
      [
        "10",
        "4",
        "35°",
        "81"
      ]
    ],
    "09": [
      [
        "5",
        "13",
        "17",
        "25"
      ],
      [
        "8",
        "15",
        "24",
        "4"
      ],
      [
        "yes",
        "no",
        "yes",
        "no"
      ],
      [
        "10",
        "5",
        "7",
        "5"
      ],
      [
        "13",
        "17",
        "41",
        "15"
      ]
    ]
  }
};
const norm=s=>String(s).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/[−–]/g,"-").replace(/^\+(?=\d)/,"").trim().toLowerCase().replace(/\s+/g," ");
let questions=0,lessons=0;
for(const grade of ["07","08"])for(const week of ["07","08","09"]){
 const file="grades/grade-"+grade+"/subjects/mathematics/week-"+week+".html",html=fs.readFileSync(file,"utf8");
 const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(x=>x[0]);
 assert.equal(articles.length,5,"Five days in "+file);
 for(let d=0;d<5;d++){
 const id="g"+grade+"-math-w"+week+"-d"+(d+1);
 const panel=articles[d].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
 assert.ok(panel,id+" missing");
 const qhtml=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
 const ahtml=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
 assert.ok(qhtml&&ahtml,id+" answer/practice group missing");
 const prompts=[...qhtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
 const answers=[...ahtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
 assert.equal(prompts.length,4,id+" four problems");
 assert.equal(answers.length,4,id+" four teacher solutions");
 assert.equal(new Set(prompts).size,4,id+" duplicate prompts");
 assert.ok(panel.includes('<label for="'+id+'-response"'),id+" input label missing");
 assert.ok(panel.includes('<textarea id="'+id+'-response"'),id+" response missing");
 assert.ok(panel.includes("not automatically saved"),id+" nonpersistent practice boundary missing");
 assert.ok(panel.includes("official assessment engine may record verified 80% mastery"),id+" authoritative mastery boundary drift");
 for(let i=0;i<4;i++){
  assert.equal(norm(answers[i]),norm(expected[grade][week][d][i]),id+" item "+(i+1)+" expected math answer mismatch for "+prompts[i]);
  questions++;
 }
 lessons++;
 }
}
assert.deepEqual({lessons,questions},{lessons:30,questions:120});
const grade8w7=fs.readFileSync("grades/grade-08/subjects/mathematics/week-07.html","utf8");
const grade8w8=fs.readFileSync("grades/grade-08/subjects/mathematics/week-08.html","utf8");
assert.ok(grade8w7.includes("After reflecting (1,2) across the x-axis to (1,−2), translate the image 3 units right."));
assert.ok(grade8w7.includes("What translation vector maps (1,1) to (4,−1)?"));
for(const p of ["(2,−3) by factor 2","(−4,6) by factor 1/2","(0,5) by factor 3","(3,3) by factor 0.5"])assert.ok(grade8w8.includes("Dilate "+p+" about the origin."),"Center of dilation missing for "+p);
console.log("PASS Grades 7/8 mathematics Weeks 07–09: 30 labs, 120 independent indexed mathematics expectations, transformation center and sequential instruction clarity, preserved formative mastery boundary.");
