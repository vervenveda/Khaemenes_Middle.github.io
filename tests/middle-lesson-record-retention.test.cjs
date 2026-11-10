"use strict";
/* Synthetic retention tests. Run node --test tests/middle-lesson-record-retention.test.cjs */
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const ledgerSource=fs.readFileSync(path.join(root,"assets/khaemenes-middle-learning-ledger.js"),"utf8");
const assessmentSource=fs.readFileSync(path.join(root,"assets/khaemenes-middle-assessment-engine.js"),"utf8");
const registry={families:{F:{familyId:"F",learnerIds:["A","B"]}},learners:{
 A:{learnerId:"A",familyId:"F",grade:"07",stage:"middle"},
 B:{learnerId:"B",familyId:"F",grade:"07",stage:"middle"}}};
function fixture(code,pathname){
 const records=new Map([["khaemenes_active_learner_v1",JSON.stringify("A")],
  ["khaemenes_active_family_v1",JSON.stringify("F")],
  ["khaemenes_family_registry_v1",JSON.stringify(registry)]]);
 const localStorage={getItem:key=>records.get(key)??null,setItem:(key,value)=>records.set(key,value),removeItem:key=>records.delete(key)};
 const window={addEventListener(){},dispatchEvent(){}},document={readyState:"loading",documentElement:{},addEventListener(){}};
 const context={window,document,location:{pathname},localStorage,Date,JSON,Math,CustomEvent:class{},MutationObserver:class{observe(){}},setTimeout(){},clearTimeout(){}};
 vm.runInNewContext(code,context);
 return {api:window.KhaemenesMiddleLearningLedger||window.KhaemenesMiddleAssessmentEngine,records,localStorage};
}
const record={schema:"khaemenes-middle-learning-ledger-record-v1",id:"practice-001",learnerId:"A",grade:"07",preview:false,completedAt:"2026-11-10T00:00:00.000Z"};
test("learner-scoped practice record retains one unique checkpoint",()=>{
 const f=fixture(ledgerSource,"/grades/grade-07/weekly-plans/week-01.html");
 assert.equal(f.api.saveRecord({...record}),true);
 assert.equal(f.api.saveRecord({...record}),true);
 assert.equal(f.api.records().length,1);
});
test("unregistered preview or switched sibling cannot claim another learner evidence",()=>{
 const f=fixture(ledgerSource,"/grades/grade-07/weekly-plans/week-01.html");
 assert.equal(f.api.saveRecord({...record,preview:true}),false);
 f.records.set("khaemenes_active_learner_v1",JSON.stringify("B"));
 assert.equal(f.api.saveRecord({...record,id:"practice-002"}),false);
 assert.equal(f.api.records().length,0);
});
test("other-family pointer fails closed before formal or formative record operations",()=>{
 const f=fixture(ledgerSource,"/grades/grade-07/weekly-plans/week-01.html");
 f.records.set("khaemenes_active_family_v1",JSON.stringify("different"));
 assert.equal(f.api.saveRecord({...record}),false);
 assert.equal(f.api.records().length,0);
});
test("formative storage failure is never labeled saved",()=>{
 const f=fixture(ledgerSource,"/grades/grade-07/weekly-plans/week-01.html");
 f.localStorage.setItem=()=>{throw Error("storage full")};
 assert.equal(f.api.saveRecord({...record}),false);
});
test("formal retention distinguishes missing, partial and linked score records",()=>{
 const f=fixture(assessmentSource,"/grades/grade-07/assessments/week-01-assessment.html");
 assert.equal(f.api.latestRetention().status,"no-attempt");
 const snapshot={id:"attempt-01",learnerId:"A",grade:"07",kind:"weekly",week:1,preview:false,score:83};
 f.records.set("khaemenes.middle.assessment.attempts:A:grade-07",JSON.stringify([snapshot]));
 assert.equal(f.api.latestRetention().status,"review-needed");
 f.records.set("khaemenes.course:A:middle-grade-07",JSON.stringify({format:"khaemenes-course-state-v1",state:{weekly:{"1":83},assessmentMeta:{weekly:{"1":{lastAttemptId:"attempt-01"}}}}}));
 const result=f.api.latestRetention();
 assert.equal(result.status,"linked");assert.equal(result.scoreLinked,true);
});
