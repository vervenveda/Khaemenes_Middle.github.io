import assert from "node:assert/strict";
import fs from "node:fs";

// Mathematical expectations independently curated by question position from
// original arithmetic, algebra, percent, coordinate, and science-notation models.
const expected={
  "07": {
    "04": [
      [
        "30%",
        "25%",
        "100",
        "15 percentage points"
      ],
      [
        "$12",
        "$68",
        "$2",
        "$42"
      ],
      [
        "60%",
        "60%",
        "80% versus 70%",
        "40"
      ],
      [
        "120",
        "$100",
        "100",
        "25%"
      ],
      [
        "25%",
        "20%",
        "75%",
        "30"
      ]
    ],
    "05": [
      [
        "−1/4",
        "−3/10",
        "0.75",
        "−5/6"
      ],
      [
        "−3/2",
        "−6",
        "5/2",
        "−3"
      ],
      [
        "−6",
        "−2",
        "4",
        "2"
      ],
      [
        "+12",
        "−11",
        "12",
        "−5.75"
      ],
      [
        "−1/3",
        "6",
        "−3/2",
        "−2.25"
      ]
    ],
    "06": [
      [
        "7n+4",
        "3(x+2)",
        "24",
        "8"
      ],
      [
        "3x+15",
        "8y−6",
        "−2a−8",
        "18"
      ],
      [
        "10a−3",
        "5p−5",
        "5x+6",
        "15"
      ],
      [
        "3y+8",
        "2a+11",
        "22",
        "5n−3"
      ],
      [
        "22",
        "20",
        "n=4",
        "30"
      ]
    ]
  },
  "08": {
    "04": [
      [
        "4",
        "−7",
        "2",
        "3"
      ],
      [
        "3",
        "−2",
        "0",
        "undefined"
      ],
      [
        "5",
        "5.26%",
        "7",
        "2"
      ],
      [
        "x=3",
        "16",
        "16",
        "9"
      ],
      [
        "18",
        "20",
        "5",
        "5"
      ]
    ],
    "05": [
      [
        "3",
        "5",
        "yes",
        "yes"
      ],
      [
        "6",
        "3",
        "4",
        "3"
      ],
      [
        "0",
        "infinitely many",
        "3",
        "7"
      ],
      [
        "20",
        "17",
        "n=3",
        "24"
      ],
      [
        "4",
        "5",
        "9",
        "3"
      ]
    ],
    "06": [
      [
        "100000",
        "4000",
        "7×10³",
        "0.01"
      ],
      [
        "8.3×10⁴",
        "4.5×10⁻³",
        "6×10⁻⁴",
        "9.2×10⁶"
      ],
      [
        "10⁷",
        "10⁴",
        "6×10⁵",
        "4×10³"
      ],
      [
        "2×10⁻³",
        "0.05",
        "2×10⁶",
        "8×10⁻⁵"
      ],
      [
        "5×10⁴",
        "3×10⁶",
        "3×10³",
        "3.2×10⁻⁴"
      ]
    ]
  }
};
const norm=s=>String(s).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/[−–]/g,"-").replace(/^\+(?=\d)/,"").toLowerCase().replace(/\s+/g," ").trim();
let checked=0,lessons=0;
for(const grade of ["07","08"])for(const week of ["04","05","06"]){
 const file="grades/grade-"+grade+"/subjects/mathematics/week-"+week+".html",html=fs.readFileSync(file,"utf8");
 const articles=[...html.matchAll(/<article class="lesson">[\s\S]*?<\/article>/g)].map(x=>x[0]);
 assert.equal(articles.length,5,file+" five lesson articles must remain");
 for(let d=0;d<5;d++){
  const id="g"+grade+"-math-w"+week+"-d"+(d+1);
  const panel=articles[d].match(new RegExp('<section class="khae-math-depth" data-math-depth="'+id+'"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,id+" section missing");
  const qhtml=panel.match(/<strong>Independent reasoning challenges:<\/strong><\/p><ol>([\s\S]*?)<\/ol>/)?.[1];
  const ahtml=panel.match(/<summary>Teacher solution key \(open after attempting\)<\/summary><ol>([\s\S]*?)<\/ol>/)?.[1];
  assert.ok(qhtml&&ahtml,id+" prompts/teacher keys absent");
  const prompts=[...qhtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  const answers=[...ahtml.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1]);
  assert.equal(prompts.length,4,id+" four independent problems required");
  assert.equal(answers.length,4,id+" four keyed solutions required");
  assert.equal(new Set(prompts).size,4,id+" repeated prompt");
  assert.ok(panel.includes('<label for="'+id+'-response"'),id+" response accessibility");
  assert.ok(panel.includes('<textarea id="'+id+'-response"'),id+" response linkage");
  assert.ok(panel.includes("not automatically saved"),id+" persistence boundary");
  assert.ok(panel.includes("official assessment engine may record verified 80% mastery"),id+" grading authority");
  assert.ok(!/localStorage|sessionStorage|<script|setItem\(/.test(panel),id+" unauthorized storage/script");
  for(let i=0;i<4;i++){
    assert.equal(norm(answers[i]),norm(expected[grade][week][d][i]),id+" item "+(i+1)+" incorrect key for prompt "+prompts[i]);
    checked++;
  }
  lessons++;
 }
}
assert.equal(lessons,30);
assert.equal(checked,120);
const g7=fs.readFileSync("grades/grade-07/subjects/mathematics/week-04.html","utf8");
const g8=fs.readFileSync("grades/grade-08/subjects/mathematics/week-05.html","utf8");
for(const phrase of ["An $80 item has a 15% discount. Find the sale price.","Find the final price of a $40 purchase after adding 5% sales tax."])assert.ok(g7.includes(phrase),"Grade 7 percent context safeguard "+phrase);
for(const phrase of ["For y=x+2 and y=−x+8, find y at the intersection.","For x+y=9 and 2x−y=3, find y.","For y=x+4 and y=−x+10, find the intersection y-coordinate."])assert.ok(g8.includes(phrase),"Grade 8 system context safeguard "+phrase);
console.log("PASS Grade 7/8 math Weeks 04–06: 30 lesson sections; 120 independent item-indexed answer expectations; explicit percent and system context; existing grade safety and accessibility preserved.");
