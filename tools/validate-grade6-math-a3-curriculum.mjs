import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const src=fs.readFileSync("assets/khaemenes-grade6-math-depth-a3-v1.js","utf8");
const loader=fs.readFileSync("assets/khaemenes-middle-learning-context.js","utf8");
new vm.Script(src,{filename:"grade6-math-depth-a3-v1.js"});
new vm.Script(loader,{filename:"khaemenes-middle-learning-context.js"});
const found=src.match(/const bank=(\[[\s\S]*?\]);\nconst row=/);
assert.ok(found,"Grade 6 A+++ curriculum bank missing");
const bank=JSON.parse(found[1]);
const vocabulary=src.match(/const glossary=(\{[^\n]+\});\nconst weekdays=/);
assert.ok(vocabulary,"The 36-week mathematics glossary is missing");
const glossary=JSON.parse(vocabulary[1]);
assert.equal(bank.length,36,"Need one curriculum entry for each week");
let problems=0;
const unique=new Set();
const daily=["Monday","Tuesday","Wednesday","Thursday","Friday"];
for(let week=1;week<=36;week++){
 const data=bank[week-1];
 assert.equal(data.length,5,"Week "+week+" is missing the curriculum fields");
 const [topic,terms,worked,misconception,days]=data;
 for(const [label,content] of [["topic",topic],["vocabulary",terms],["worked example",worked],["misconception",misconception]])
  assert.ok(content.length>16,"Week "+week+" missing developed "+label);
 assert.ok(terms.split("|").length>=3,"Week "+week+" needs three vocabulary concepts");
 for(const term of terms.split("|"))assert.ok(glossary[term]?.length>=20,"Week "+week+" is missing a teaching definition for "+term);
 assert.equal(days.length,5,"Week "+week+" needs five original daily problems");
 const source=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+String(week).padStart(2,"0")+".html","utf8");
 for(let day=0;day<5;day++){
  const [question,answer]=days[day];
  assert.ok(question.length>=20,"Week "+week+" "+daily[day]+" question too short");
  assert.ok(answer.length>=2,"Week "+week+" "+daily[day]+" answer missing");
  assert.ok(!unique.has(question),"Duplicate Grade 6 question: "+question);
  unique.add(question);problems++;
  const heading=new RegExp("<h[234][^>]*>"+daily[day]+"(?:\\s|:|\\s*[—-])","i");
  assert.match(source,heading,"Week "+week+" original "+daily[day]+" missing");
 }
}
assert.equal(problems,180);
assert.match(loader,/khaemenes-grade6-math-depth-a3-v1\.js/);
assert.match(loader,/grade==="06"/);
assert.ok(!/localStorage|sessionStorage|writeScore|saveState|mastered\s*=/.test(src),
 "Curriculum practice must never write official academic records");
assert.match(src,/aria-label/,"Written reasoning controls need accessible labels");
assert.match(src,/Check the solution only after your independent attempt/);
assert.match(src,/in seven days revisit/,"Delayed retrieval guidance must remain");
assert.match(src,/article\.append\(card\)/,"Original teaching must be retained and supplemented");
assert.match(src,/return true/);
console.log("PASS Grade 6 mathematics deep curriculum: "+bank.length+" weeks, "+problems+" unique daily mathematical challenges, worked models, vocabulary, misconceptions, retrieval guidance and safe loader");
