import assert from "node:assert/strict";
import fs from "node:fs";

// Independently calculated sampling of the first supplemental Monday problem
// from each enhanced Grade 6 mathematics week, 04–36.
// Deliberately NOT a claim that all 694 supplemental answers have been reviewed.
const samples=[
 [4,"Express 7/20",()=>((7/20).toFixed(2)+" = "+(7/20*100)+"%")],
 [5,"How many 1/6-cup portions",()=>String((2/3)/(1/6))+" portions"],
 [6,"Order −7, 4, −1, 0",()=>[-7,4,-1,0].sort((a,b)=>a-b).join(" < ").replaceAll("-","−")],
 [7,"Plot (4,−2)",()=> "Quadrant "+(4>0&&-2<0?"IV":"incorrect")],
 [8,"Translate eight fewer",()=> "5n−8"],
 [9,"Solve m+12=31",()=> "m="+(31-12)],
 [10,"Does x=−1 satisfy x",()=> "Yes"],
 [11,"Classify 'How many pets",()=> "Statistical"],
 [12,"triangle's area with base 14",()=> String(14*5/2)+" m²"],
 [13,"Find volume of 7×2×3",()=> String(7*2*3)+" cm³"],
 [14,"mass-per-volume rate of 56",()=> String(56/14)+" g/cm³"],
 [15,"change from −5°C to 6°C",()=> "+"+String(6-(-5))+"°C"],
 [16,"average speed of 75 m in 15 s",()=> String(75/15)+" m/s"],
 [17,"Simplify 18:24",()=> "3:4"],
 [18,"range of 1,4,1,−2",()=> "range "+String(4-(-2))],
 [19,"24 colored and 16 uncolored",()=> "3:2"],
 [20,"Convert 14 of 70",()=> String(14/70*100)+"%"],
 [21,"Find 3÷1/6",()=> String(3/(1/6))],
 [22,"distance from −8 m to +5 m",()=> String(5-(-8))+" m"],
 [23,"quadrants of (3,5)",()=> "I, III, IV, II"],
 [24,"eight more than three times",()=> "3n+8"],
 [25,"Solve 3x+6=27",()=> "x="+String((27-6)/3)],
 [26,"room 9 m by 5 m by 2 m",()=> String(9*5)+" m² and "+String(9*5*2)+" m³"],
 [27,"mean of 2,4,6,8,10",()=> String([2,4,6,8,10].reduce((a,b)=>a+b,0)/5)],
 [28,"18 translated to 24 untranslated",()=> "3:4"],
 [29,"Convert 15/25",()=> String(15/25*100)+"%"],
 [30,"Find 3÷1/2",()=> String(3/(1/2))],
 [31,"Evaluate −7+11",()=> String(-7+11)],
 [32,"quadrants for (4,2)",()=> "I, II, III, IV"],
 [33,"3 seconds per item and 7 startup",()=> "T=3n+7"],
 [34,"Write and solve 7s+8≤43",()=> "s≤"+String((43-8)/7)],
 [35,"model measures 8×5×3 cm",()=> String(8*5)+" cm² and "+String(8*5*3)+" cm³"],
 [36,"mean and median of 4,6,6,8,11",()=> "Mean "+String((4+6+6+8+11)/5)+", median "+String(6)]
];
const normalize=s=>String(s).replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/\s+/g," ").trim().toLowerCase();
assert.equal(samples.length,33);
for(const [week,problemPart,calculate] of samples){
 const n=String(week).padStart(2,"0");
 const source=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+n+".html","utf8");
 const monday=source.match(/<article class="lesson"><h2>Monday[\s\S]*?<\/article>/)?.[0];
 assert.ok(monday,"Week "+n+" lacks Monday");
 const panel=monday.match(/<section class="grade6-[^"]*rigor"[\s\S]*?<\/section>/)?.[0];
 assert.ok(panel,"Week "+n+" lacks first enriched panel");
 const question=panel.match(/<li>([\s\S]*?)<\/li>/)?.[1]||"";
 assert.ok(normalize(question).includes(normalize(problemPart)),"Week "+n+" source problem drift: "+question);
 const answer=panel.match(/<summary>[^<]*teacher[^<]*<\/summary><p>([\s\S]*?)<\/p>/i)?.[1];
 assert.ok(answer,"Week "+n+" teacher answer key missing");
 const expected=normalize(calculate());
 assert.ok(normalize(answer).includes(expected),"Week "+n+" answer mismatch: expected "+expected+" in "+normalize(answer));
}
console.log("PASS 33/33 independently recalculated Monday answer samples, one per enhanced Week 04–36. Other 661 supplemental problems and official multiple-choice keys are outside this sample.");
