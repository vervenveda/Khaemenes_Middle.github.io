"use strict";
/* Synthetic-only source regressions for Middle Grades 6–8 learner separation.
 * Run: node --test tests/middle-sibling-continuity.test.cjs
 */
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const source=g=>fs.readFileSync(path.join(root,"grades","grade-"+g,"assets","app.js"),"utf8");
for(const grade of ["07","08"]){
 const app=source(grade);
 test("Grade "+grade+" refreshes local evidence after sibling or tab changes",()=>{
  for(const event of ["pageshow","focus","storage","khaemenes-family-changed","khaemenes-middle-grade-continuity-synced","khaemenes-middle-assessment-recorded"])
   assert.ok(app.includes('addEventListener("'+event+'"'),event);
  assert.ok(app.includes("loadedScope=recordScope();state=readState();renderDashboard();renderWeeks()"));
  assert.ok(app.includes('event.key==="khaemenes_active_learner_v1"'));
  assert.ok(app.includes('event.key==="khaemenes_family_registry_v1"'));
 });
 test("Grade "+grade+" clear button fails closed for missing identity or failed deletion",()=>{
  assert.ok(app.includes('if(c?.status!=="ready"||recordScope()!==loadedScope)return'));
  assert.ok(app.includes("cleared=CONT?.clearState?.()===true"));
  assert.ok(app.includes('if(!cleared){alert("No records were cleared.'));
  assert.ok(!app.includes("else localStorage.removeItem(KEY)"));
 });
 test("Grade "+grade+" saves only under stable record scope",()=>{
  assert.ok(app.includes('if(recordScope()!==loadedScope)return false'));
  assert.ok(app.includes('CONT.writeState(state)'));
  assert.ok(app.includes('c?.status==="placement-mismatch"'));
 });
}
test("Grade 06 already uses verified readback for scoped clearing",()=>{
 const app=source("06");
 assert.ok(app.includes("cleared=CONT.clearState()===true"));
 assert.ok(app.includes("refreshFromRecord"));
});
test("no grade automatically adopts legacy grade-wide records when family identity exists",()=>{
 const bridge=fs.readFileSync(path.join(root,"assets/khaemenes-grade-continuity.js"),"utf8");
 assert.ok(bridge.includes("Legacy data stays under LEGACY_KEY"));
 assert.ok(bridge.includes('if(s.status==="no-active-learner")return false'));
 for(const grade of ["06","07","08"])assert.ok(source(grade).includes("CONT?.readState"));
});
