import fs from "node:fs";
import assert from "node:assert/strict";

const contract=JSON.parse(fs.readFileSync("mentor-contract.json","utf8"));
const bridge=fs.readFileSync("assets/khaemenes-middle-naib-bridge.js","utf8");
const continuity=fs.readFileSync("assets/khaemenes-grade-continuity.js","utf8");
const breakaway=fs.readFileSync("assets/khaemenes-middle-breakaway.js","utf8");

assert.equal(contract.version,3,"Middle mentor contract must use synchronized one-Mentor schema v3");
assert.equal(contract.stage,"middle","Middle mentor contract must declare the middle stage");
assert.equal(contract.mentorAuthority,"academy-archaemenes","Archaemenes must remain the Academy Mentor authority");
assert.equal(contract.mentorIdentityAuthority,"academy-family-registry","Academy Family Registry must remain mentor identity authority");
assert.equal(contract.routingAuthority,"NAIB","NAIB must remain routing/delegation authority without becoming a second Mentor");
assert.equal(contract.masteryThresholdMinimum,80,"Middle mentor contract must publish the Academy 80% minimum");
assert.equal(contract.progressionAuthority,"course-engine","mentor must not become progression authority");
for(const key of ["awardsMastery","changesGrades","changesPlacement","changesLearnerIdentity","bypassesPrerequisites","revealsLockedAssessments","manufacturesUnlocks"]){
  assert.equal(contract.authority?.[key],false,`Middle mentor authority ${key} must be false`);
}

assert.equal(contract.primary?.length,1,"Middle School must preserve one primary educational Mentor identity");
assert.equal(contract.primary?.[0]?.id,"archaemenes","Archaemenes must remain the single primary educational Mentor");
assert.ok(contract.primary?.[0]?.scope?.includes("support handoff"),"Archaemenes must retain support-handoff scope");
assert.ok(contract.primary?.[0]?.not_authorized?.includes("award mastery"),"Archaemenes must remain unable to award mastery");

const hope=contract.studentSupport?.find(m=>m.id==="hope");
assert.ok(hope,"Hope must remain available as School Counselor & Student Support");
assert.equal(hope.mentorIdentity,false,"Hope must remain a support role rather than a competing Mentor identity");
assert.ok(hope.not_authorized?.includes("award mastery"),"Hope must remain unable to award mastery");

for(const id of ["eiren","zelle","moirai","arshif","aurora","naib"]){
  const specialist=contract.specialists?.find(m=>m.id===id);
  assert.ok(specialist,`specialist ${id} must be preserved`);
  assert.equal(specialist.mentorIdentity,false,`specialist ${id} must not become a competing Mentor identity`);
}
const naib=contract.specialists?.find(m=>m.id==="naib");
assert.equal(naib?.role,"Navigation & Delegation","NAIB must remain Navigation & Delegation rather than a Mentor identity");
assert.ok(contract.principles?.some(p=>p.includes("single continuous educational Mentor")),"Contract must explicitly preserve the one-Mentor Academy model");
assert.ok(contract.principles?.some(p=>p.includes("NAIB routes, matches, and delegates support without becoming a second Mentor")),"Contract must explicitly preserve NAIB's routing-only authority");

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

console.log("Khaemenes Middle NAIB one-Mentor contract v3: PASS");
