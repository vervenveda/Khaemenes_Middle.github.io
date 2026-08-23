import fs from "node:fs";
import assert from "node:assert/strict";

const contract=JSON.parse(fs.readFileSync("mentor-contract.json","utf8"));
const bridge=fs.readFileSync("assets/khaemenes-middle-naib-bridge.js","utf8");
const continuity=fs.readFileSync("assets/khaemenes-grade-continuity.js","utf8");
const breakaway=fs.readFileSync("assets/khaemenes-middle-breakaway.js","utf8");

assert.equal(contract.version,2,"Middle mentor contract must use synchronized schema v2");
assert.equal(contract.stage,"middle","Middle mentor contract must declare the middle stage");
assert.equal(contract.assignmentAuthority,"NAIB","NAIB must be mentor assignment authority");
assert.equal(contract.masteryThresholdMinimum,80,"Middle mentor contract must publish the Academy 80% minimum");
assert.equal(contract.progressionAuthority,"course-engine","mentor must not become progression authority");
for(const key of ["awardsMastery","changesGrades","changesPlacement","changesLearnerIdentity","bypassesPrerequisites","revealsLockedAssessments","manufacturesUnlocks"]){
  assert.equal(contract.authority?.[key],false,`Middle mentor authority ${key} must be false`);
}
for(const id of ["archaemenes","hope"]){assert.ok(contract.primary.some(m=>m.id===id),`primary mentor ${id} must be preserved`)}
for(const id of ["eiren","zelle","moirai","arshif","aurora","naib"]){assert.ok(contract.specialists.some(m=>m.id===id),`specialist ${id} must be preserved`)}

assert.ok(bridge.includes('EXPECTED_STAGE="middle"'),"bridge must use canonical middle stage");
assert.ok(bridge.includes("KhaemenesNAIB"),"bridge must consume Academy NAIB");
assert.ok(bridge.includes("KhaemenesFamilyRegistry"),"bridge must consume canonical Family Registry");
assert.ok(bridge.includes("MASTERY_THRESHOLD=80"),"bridge must publish Academy mastery minimum");
assert.ok(bridge.includes("bypassesPrerequisites:false"),"bridge must prohibit prerequisite bypass");
assert.ok(bridge.includes("revealsLockedAssessments:false"),"bridge must prohibit locked-assessment disclosure");
assert.ok(bridge.includes("manufacturesUnlocks:false"),"bridge must prohibit mentor-created unlocks");

assert.ok(continuity.includes("ensureNAIBBridge"),"grade continuity must load the Middle NAIB bridge");
assert.ok(continuity.includes("masteryThresholdMinimum:MASTERY_THRESHOLD"),"grade continuity must expose Academy mastery minimum");
assert.ok(continuity.includes("mentorContext"),"grade continuity must expose mentor context");
assert.ok(breakaway.includes("ensureNAIBBridge"),"shared Middle runtime must load the NAIB bridge");

for(const grade of ["06","07","08"]){
  const path=`grades/grade-${grade}/index.html`;
  const html=fs.readFileSync(path,"utf8");
  assert.ok(html.includes("khaemenes-grade-continuity.js"),`${path} must load grade continuity`);
  assert.ok(html.includes("khaemenes-middle-mentors.js"),`${path} must preserve the rich Middle mentor engine`);
}

console.log("Khaemenes Middle NAIB mentor contract: PASS");
