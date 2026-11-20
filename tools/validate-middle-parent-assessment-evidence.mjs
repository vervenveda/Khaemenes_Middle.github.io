import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const source=fs.readFileSync("assets/khaemenes-middle-continuation-publisher.js","utf8");
new vm.Script(source);
for(const grade of ["06","07","08"]){
 const records=new Map(),published=[];
 const storage={getItem:k=>records.has(k)?JSON.stringify(records.get(k)):null};
 const state={weekly:{"1":90},midterm:83,final:86,assessmentMeta:{
  weekly:{"1":{verifiedBy:"middle-assessment-engine-v1",lastAttemptId:"week-a",latestScore:90}},
  midterm:{verifiedBy:"middle-assessment-engine-v1",lastAttemptId:"mid-a",latestScore:83},
  final:{verifiedBy:"middle-assessment-engine-v1",lastAttemptId:"final-a",latestScore:86}
 }};
 const active={learnerId:"student-a",grade,stage:"middle"};
 const attempt=(id,kind,week,correct,total,score,learnerId="student-a")=>({
  schema:"khaemenes-middle-assessment-attempt-v1",id,learnerId,grade,kind,week,
  correct,questionCount:total,score,preview:false,completedAt:"2026-11-20T17:00:00Z"
 });
 const key="khaemenes.middle.assessment.attempts:student-a:grade-"+grade;
 records.set(key,[attempt("week-a","weekly",1,18,20,90),
  attempt("mid-a","midterm",null,30,36,83),
  attempt("final-a","final",null,38,45,86),
  attempt("other-learner","weekly",2,20,20,100,"student-b")]);
 const window={KHAEMENES_GRADE_CONTEXT:{grade},KhaemenesGradeContinuity:{
  status:()=>({status:"ready",learner:active}),readState:()=>state
 },KhaemenesLearningContinuation:{publish:x=>published.push(x)},
 location:{pathname:"/grades/grade-"+grade+"/index.html"},addEventListener:()=>{}};
 const sandbox={window,location:window.location,document:{readyState:"loading",addEventListener:()=>{}},
   localStorage:storage,URL,console,setTimeout,clearTimeout};
 vm.runInNewContext(source,sandbox,{filename:"middle-continuation-publisher.js"});
 assert.equal(await window.KhaemenesMiddleContinuationPublisher.publish(),true);
 assert.equal(published.length,1);
 const p=published[0];
 assert.equal(p.learnerId,"student-a");
 assert.equal(p.assessments.length,3);
 assert.deepEqual(p.assessments.map(x=>[x.id,x.kind,x.earned,x.possible]),[
  ["week-01","quiz",18,20],["midterm","test",30,36],["final","test",38,45]
 ]);
 // Wrong-learner attempt must never be reported, even if it matches a verified ID.
 state.assessmentMeta.weekly["2"]={verifiedBy:"middle-assessment-engine-v1",lastAttemptId:"other-learner",latestScore:100};
 assert.equal(await window.KhaemenesMiddleContinuationPublisher.publish(),true);
 assert.equal(published.at(-1).assessments.length,3);
 // No proof of verification -> no grade item; legacy score is not sufficient.
 state.assessmentMeta.weekly["1"]={lastAttemptId:"week-a",latestScore:90};
 assert.equal(await window.KhaemenesMiddleContinuationPublisher.publish(),true);
 assert.equal(published.at(-1).assessments.length,2);
 // Switched learners must not inherit prior assessment attempts.
 active.learnerId="student-b";
 assert.equal(await window.KhaemenesMiddleContinuationPublisher.publish(),true);
 assert.equal(published.at(-1).learnerId,"student-b");
 assert.equal(published.at(-1).assessments.length,0);
 console.log("PASS Grade "+grade+" parent evidence: correct/possible, scope, attempt identity, provenance, omission of unverified items");
}
