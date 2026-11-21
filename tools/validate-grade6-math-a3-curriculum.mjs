import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const src=fs.readFileSync("assets/khaemenes-grade6-math-depth-a3-v1.js","utf8");
const loader=fs.readFileSync("assets/khaemenes-middle-learning-context.js","utf8");
const studio=fs.readFileSync("assets/khaemenes-middle-math-portal-studio-v1.js","utf8");
new vm.Script(src,{filename:"grade6-math-depth-a3-v1.js"});
new vm.Script(loader,{filename:"khaemenes-middle-learning-context.js"});
const found=src.match(/const bank=(\[[\s\S]*?\]);\nconst row=/);
assert.ok(found,"Grade 6 A+++ curriculum bank missing");
const bank=JSON.parse(found[1]);
const vocabulary=src.match(/const glossary=(\{[^\n]+\});\nconst weekdays=/);
assert.ok(vocabulary,"The 36-week mathematics glossary is missing");
const glossary=JSON.parse(vocabulary[1]);
const unitsMatch=src.match(/const units=(\[[^\n]+\]);\nconst unit=/);
assert.ok(unitsMatch,"The six Grade 6 curricular units are missing");
const units=JSON.parse(unitsMatch[1]);
assert.equal(units.length,6,"Grade 6 must have six coherent mathematics units");
for(let index=0;index<6;index++){
 const unit=units[index];
 assert.equal(unit.start,index*6+1,"Unit "+(index+1)+" begins at the wrong week");
 assert.equal(unit.end,(index+1)*6,"Unit "+(index+1)+" finishes at the wrong week");
 assert.ok(unit.title.length>25&&unit.performance.length>45&&unit.bridge.length>75);
}
assert.match(src,/End-of-unit synthesis/,"Every unit must culminate in a formative synthesis");
assert.equal(bank.length,36,"Need one curriculum entry for each week");
let problems=0;
const unique=new Set();
const daily=["Monday","Tuesday","Wednesday","Thursday","Friday"];
for(let week=1;week<=36;week++){
 const data=bank[week-1];
 assert.equal(data.length,5,"Week "+week+" is missing the curriculum fields");
 const [topic,terms,worked,misconception,days]=data;
 for(const [label,content] of [["topic",topic],["vocabulary",terms],["worked example",worked],["misconception",misconception]])
  assert.ok(content.length>(label==="vocabulary"?8:label==="topic"?10:20),"Week "+week+" missing developed "+label);
 assert.ok(terms.split("|").length>=3,"Week "+week+" needs three vocabulary concepts");
 for(const term of terms.split("|"))assert.ok(glossary[term]?.length>=20,"Week "+week+" is missing a teaching definition for "+term);
 assert.equal(days.length,5,"Week "+week+" needs five original daily problems");
 const source=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+String(week).padStart(2,"0")+".html","utf8");
 for(let day=0;day<5;day++){
  const [question,answer]=days[day];
  assert.ok(question.length>=10,"Week "+week+" "+daily[day]+" question too short");
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
assert.match(studio,/curriculumReasoning:grade==="06"/,"Grade 6 weekly export must preserve deeper written mathematical evidence");
assert.ok(!/localStorage|sessionStorage|writeScore|saveState|mastered\s*=/.test(src),
 "Curriculum practice must never write official academic records");
assert.match(src,/aria-label/,"Written reasoning controls need accessible labels");
assert.match(src,/Check the solution only after your independent attempt/);
assert.match(src,/in seven days revisit/,"Delayed retrieval guidance must remain");
assert.match(src,/article\.append\(card\)/,"Original teaching must be retained and supplemented");
assert.match(src,/return true/);

class FakeNode{
 constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.textContent="";this.className="";}
 append(...nodes){this.children.push(...nodes)}
 setAttribute(key,value){this.attributes[key]=String(value)}
 querySelector(selector){if(selector==="h2,h3,h4")return this.heading||null;if(selector===".g6-depth-card")return this.children.find(n=>n.className==="g6-depth-card")||null;return null}
}
for(let week=1;week<=36;week++){
 const weekdays=["Monday","Tuesday","Wednesday","Thursday","Friday"];
 const articles=weekdays.map(day=>{const node=new FakeNode("article");node.heading={textContent:day+" — lesson"};return node});
 const host={querySelectorAll:selector=>selector==="article.lesson"?articles:[]};
 const document={
  readyState:"complete",
  head:new FakeNode("head"),
  querySelector:selector=>selector==="main"?host:null,
  createElement:tag=>new FakeNode(tag)
 };
 const window={};
 const location={pathname:"/Khaemenes_Middle.github.io/grades/grade-06/subjects/mathematics/week-"+String(week).padStart(2,"0")+".html"};
 vm.runInNewContext(src,{document,window,location},{timeout:2000,filename:"grade6-math-runtime.js"});
 assert.equal(window.KhaemenesGrade6MathDepthA3?.week,week,"Week "+week+" runtime not initialized");
 for(let d=0;d<5;d++){
  const card=articles[d].querySelector(".g6-depth-card");
  assert.ok(card,"Week "+week+" "+weekdays[d]+" did not receive content");
  assert.equal(card.dataset.day,weekdays[d]);
  assert.equal(card.dataset.week,String(week));
  const reveal=card.children.find(node=>node.tagName==="details");
  assert.ok(reveal,"Week "+week+" "+weekdays[d]+" missing delayed answer reveal");
  assert.ok(card.children.some(node=>node.tagName==="label"),"Week "+week+" "+weekdays[d]+" missing typed reasoning input");
 }
 if((week-1)%6===0){
  const monday=articles[0].children[0];
  assert.ok(monday.children.some(node=>node.tagName==="section"),"Week "+week+" glossary did not render");
 }
 if(week%6===0){
  const friday=articles[4].children[0];
  assert.ok(friday.children.filter(node=>node.tagName==="details").length>=2,
   "Week "+week+" missing end-of-unit performance task");
 }
}

console.log("PASS Grade 6 mathematics deep curriculum: "+bank.length+" weeks, "+problems+" unique daily mathematical challenges, worked models, vocabulary, misconceptions, retrieval guidance and safe loader");
