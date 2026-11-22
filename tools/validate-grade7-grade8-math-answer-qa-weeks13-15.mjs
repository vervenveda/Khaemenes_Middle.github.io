import assert from "node:assert/strict";
import fs from "node:fs";
// Mathematical expectations are indexed independently of the source lesson keys.
const expected={
  "07": {
    "13": [
      [
        "5x+7",
        "20",
        "6x+3",
        "9"
      ],
      [
        "5y+12",
        "−2a+10",
        "4n+4",
        "22"
      ],
      [
        "yes",
        "20",
        "20",
        "5n+2"
      ],
      [
        "28",
        "8",
        "5",
        "v=5"
      ],
      [
        "29",
        "7n+6",
        "n=10",
        "11"
      ]
    ],
    "14": [
      [
        "n≤20",
        "p>8",
        "e<6",
        "yes"
      ],
      [
        "x>5",
        "x>−5",
        "n≤6",
        "y≤−4"
      ],
      [
        "60%",
        "75%",
        "20 percentage points",
        "20"
      ],
      [
        "6",
        "x<3",
        "6",
        "no"
      ],
      [
        "2≤x≤7",
        "6",
        "x<−3",
        "20>15; yes"
      ]
    ],
    "15": [
      [
        "28 m",
        "4 cm",
        "27 m",
        "15 km"
      ],
      [
        "32 cm²",
        "54 cm",
        "108 cm²",
        "3 cm"
      ],
      [
        "32 m",
        "36 m",
        "3.5 cm",
        "1 cm:5 m"
      ],
      [
        "15 km",
        "12 m and 8 m",
        "96 m²",
        "4"
      ],
      [
        "8 cm",
        "16",
        "4",
        "18 km"
      ]
    ]
  },
  "08": {
    "13": [
      [
        "7",
        "4",
        "11",
        "3"
      ],
      [
        "5",
        "8",
        "4",
        "12"
      ],
      [
        "16",
        "12",
        "n=4",
        "22"
      ],
      [
        "9",
        "3",
        "no",
        "6"
      ],
      [
        "9",
        "8",
        "6",
        "3"
      ]
    ],
    "14": [
      [
        "25%",
        "25%",
        "15 percentage points",
        "36"
      ],
      [
        "60000",
        "7×10⁻⁴",
        "10³",
        "8.5×10⁵"
      ],
      [
        "75%",
        "40%",
        "30%",
        "30%"
      ],
      [
        "30 km/h",
        "75 km",
        "5000 m",
        "5 m"
      ],
      [
        "60%",
        "60%",
        "30",
        "12.5%"
      ]
    ],
    "15": [
      [
        "(5,4)",
        "(−5,5)",
        "6",
        "(4,0)"
      ],
      [
        "(−2,−4)",
        "(2,4)",
        "(−3,2)",
        "(−2,−3)"
      ],
      [
        "(−4,6)",
        "(2,−3)",
        "15",
        "72"
      ],
      [
        "60°",
        "4 cm",
        "16",
        "6"
      ],
      [
        "(−2,−3)",
        "(−2,2)",
        "(−4,−1)",
        "(6,−4)"
      ]
    ]
  }
};
const norm=s=>String(s).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/[−–]/g,"-").replace(/^\+(?=\d)/,"").toLowerCase().replace(/\s+/g," ").trim();
let tested=0,lessons=0;
for(const grade of ["07","08"])for(const week of ["13","14","15"]){
 const file="grades/grade-"+grade+"/subjects/mathematics/week-"+week+".html";
 const html=fs.readFileSync(file,"utf8");
 const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(articles.length,5,file+" daily lesson count drift");
 for(let day=0;day<5;day++){
  const id="g"+grade+"-math-w"+week+"-d"+(day+1);
  const panel=articles[day].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,id+" not found");
  const qhtml=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
  const khtml=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(qhtml&&khtml,id+" questions/key disclosure missing");
  const qs=[...qhtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
  const answers=[...khtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>m[1]);
  assert.equal(qs.length,4,id+" missing practice");assert.equal(answers.length,4,id+" missing answer");
  assert.equal(new Set(qs).size,4,id+" duplicate prompt");
  assert.ok(panel.includes('<label for="'+id+'-response"'),id+" label mismatch");
  assert.ok(panel.includes('<textarea id="'+id+'-response"'),id+" input mismatch");
  assert.ok(panel.includes("not automatically saved"),id+" persistence rule");
  assert.ok(panel.includes("official assessment engine may record verified 80% mastery"),id+" official grading rule");
  assert.ok(!/localStorage|sessionStorage|setItem\(|<script/.test(panel),id+" local execution/writes");
  for(let i=0;i<4;i++){
   assert.equal(norm(answers[i]),norm(expected[grade][week][day][i]),id+" incorrect teacher key at "+(i+1)+" "+qs[i]);
   tested++;
  }
  lessons++;
 }
}
assert.deepEqual({tested,lessons},{tested:120,lessons:30});
const pages={
 g713:fs.readFileSync("grades/grade-07/subjects/mathematics/week-13.html","utf8"),
 g715:fs.readFileSync("grades/grade-07/subjects/mathematics/week-15.html","utf8"),
 g813:fs.readFileSync("grades/grade-08/subjects/mathematics/week-13.html","utf8"),
 g815:fs.readFileSync("grades/grade-08/subjects/mathematics/week-15.html","utf8")
};
assert.ok(pages.g713.includes("x boxes with five items in each box"),"Variable meaning unclarified");
assert.ok(pages.g715.includes("modeled area of a 12 m by 8 m rectangle"),"Geometric area context unclarified");
for(const phrase of ["For x+y=11 and x−y=3, find y.","For y=x+3 and x+y=13, find y.","For y=3x and x+y=16, find y.","For x+y=12 and x−y=6, find y.","For x+y=17 and x−y=1, find y.","For 2x+y=15 and x−y=3, find y."]){
 assert.ok(pages.g813.includes(phrase),"Systems context missing: "+phrase);
}
for(const phrase of ["Dilate (4,−6) by factor 1/2 about the origin.","After reflecting (2,−3) over the y-axis to (−2,−3), translate that point 5 units up.","Dilate (3,−2) by factor 2 about the origin."]){
 assert.ok(pages.g815.includes(phrase),"Transformation context missing: "+phrase);
}
console.log("PASS Grade 7 and 8 Math Weeks 13–15: 120 separately indexed teacher-key answers and 30 daily lesson panels verified, with algebraic domains, geometry and transformation contexts protected; certification still subject to live learner and pedagogy review.");
