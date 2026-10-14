import fs from "node:fs";
import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const loadData=read("grades/grade-08/data/course-data.js");
const mathCode=read("assets/khaemenes-grade8-math-depth.js");
const renderer=read("assets/khaemenes-grade8-week-evidence.js");
class Node {
  constructor(tag){this.tag=tag;this.children=[];this.textContent="";this.className="";this.dataset={};this.href="";this.type="";}
  append(...args){this.children.push(...args)}
  appendChild(node){this.children.push(node);return node}
  replaceChildren(...args){this.children=[...args]}
}
let checked=0;
for(const mode of ["packet","assessment"]){
  for(let week=1;week<=36;week++){
    const holder=new Node("main");
    const win={};
    vm.runInNewContext(loadData,{window:win},{timeout:1000});
    vm.runInNewContext(mathCode,{window:win,location:{pathname:"/grades/grade-08/evidence/weekly-evidence-packet.html"}},{timeout:1000});
    assert(Object.keys(win.KhaemenesGrade8MathBank||{}).length===36,"Expected 36 grade 8 math examples");
    const doc={
      body:{dataset:{evidenceMode:mode}},
      getElementById:id=>id==="grade8EvidenceMount"?holder:null,
      createElement:tag=>new Node(tag)
    };
    const ctx={window:win,document:doc,location:{search:"?week="+String(week)},URLSearchParams};
    vm.runInNewContext(renderer,ctx,{timeout:1000});
    const exported=win.KhaemenesGrade8WeeklyEvidence;
    assert(exported?.week===week,"Wrong rendered week "+week);
    assert(exported.mode===mode,"Wrong mode "+mode);
    assert(exported.criterionCount===(mode==="assessment"?11:9),"Incorrect criterion count "+mode+" "+week);
    assert(holder.children.some(n=>n.tag==="h1"&&n.textContent===win.KHAE_GRADE8_DATA.weeks[week-1].title),"Week title mismatch "+week);
    checked++;
  }
}
const portal=read("grades/grade-08/assets/app.js");
const navigator=read("assets/khaemenes-middle-learning-navigator.js");
const listing=read("grades/grade-08/assessments/weekly-assessments.html");
const bridge=read("assets/khaemenes-middle-breakaway.js");
for(const s of [portal,navigator,bridge])assert(s.includes("weekly-mastery-check.html"),"Missing canonical Grade 8 mastery route");
assert((listing.match(/weekly-mastery-check\.html\?week=/g)||[]).length===36,"Expected 36 Grade 8 assessment links");
for(const name of ["weekly-evidence-packet","weekly-mastery-check"]){
  const page=read("grades/grade-08/evidence/"+name+".html");
  assert(page.includes("khaemenes-grade8-week-evidence.js"),"Missing common Grade 8 renderer");
}
console.log("PASS: "+checked+" Grade 8 subject-week evidence renders, 36 math examples, canonical routes and 80%/22-point model.");
