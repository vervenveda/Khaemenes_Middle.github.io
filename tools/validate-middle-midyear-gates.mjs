import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source=fs.readFileSync("assets/khaemenes-middle-assessment-engine.js","utf8");
new vm.Script(source);
const makeStore=()=>new Map();
function runtime(grade,week,weekly,midterm,active=true){
 const storage=makeStore();
 const learnerId="synthetic-learner-"+grade;
 const state={weekly,midterm,final:0,portfolio:false,transition:false};
 const registry={learners:{[learnerId]:{learnerId,grade,stage:"middle"}}};
 const key="khaemenes.course:"+learnerId+":middle-grade-"+grade;
 storage.set("khaemenes_family_registry_v1",registry);
 storage.set("khaemenes_active_learner_v1",active?learnerId:null);
 storage.set(key,{format:"khaemenes-course-state-v1",learnerId,courseId:"middle-grade-"+grade,state});
 const localStorage={
  getItem:k=>storage.has(k)?JSON.stringify(storage.get(k)):null,
  setItem:(k,value)=>storage.set(k,JSON.parse(value))
 };
 const window={};
 const location={pathname:"/Khaemenes_Middle.github.io/grades/grade-"+grade+
   "/assessments/week-"+String(week).padStart(2,"0")+"-assessment.html"};
 const document={readyState:"loading",addEventListener:()=>{}};
 vm.runInNewContext(source,{window,document,location,localStorage,console,Date,Math},
  {filename:"khaemenes-middle-assessment-engine.js",timeout:1000});
 return window.KhaemenesMiddleAssessmentEngine.gate();
}
for(const grade of ["06","07","08"]){
 const weeks=Object.fromEntries(Array.from({length:18},(_,i)=>[i+1,87]));
 const before=runtime(grade,18,weeks,0);
 assert.equal(before.open,true,"Grade "+grade+" Week 18 must remain available before midterm");
 const blocked=runtime(grade,19,weeks,79);
 assert.equal(blocked.open,false,"Grade "+grade+" Week 19 must refuse midterm below 80%");
 assert.match(blocked.reason,/midterm.*80%/i);
 const unblocked=runtime(grade,19,weeks,80);
 assert.equal(unblocked.open,true,"Grade "+grade+" Week 19 opens when midterm is 80%");
 const midtermPassedPriorFailed=runtime(grade,19,{...weeks,"18":79},80);
 assert.equal(midtermPassedPriorFailed.open,false,
  "Grade "+grade+" Week 19 still requires Week 18 mastery");
 const week20=runtime(grade,20,{...weeks,"19":85},79);
 assert.equal(week20.open,false,"Grade "+grade+" Week 20 remains blocked on failed midterm");
 const preview=runtime(grade,19,weeks,79,false);
 assert.equal(preview.open,true,"Anonymous preview may open for practice");
 assert.equal(preview.preview,true,"Anonymous preview must never award verified mastery");
 console.log("PASS Grade "+grade+": pre-midterm week, 79/80 boundary, prior week, later week, preview");
}
