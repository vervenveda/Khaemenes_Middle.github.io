#!/usr/bin/env node
import fs from "node:fs";
const regulators=[
 "assets/middle-school-global-chrome-v1.js",
 "assets/middle-school-global-typography-v1.js"
];
const banned=[
 "tools/middle-school-chrome-audit.mjs",
 "tools/middle-school-typography-audit.mjs",
 ".github/workflows/middle-school-canonical-chrome.yml",
 ".github/workflows/middle-school-typography.yml"
];
const problems=[];
for(const p of banned) if(fs.existsSync(p)) problems.push("forbidden retired regulator authority exists: "+p);
for(const regulator of regulators){
 if(!fs.existsSync(regulator)){problems.push("compatibility shim missing: "+regulator);continue}
 const src=fs.readFileSync(regulator,"utf8");
 if(!/Regulator="retired"/.test(src)) problems.push("Middle School compatibility shim is not marked retired: "+regulator);
 for(const token of ["MutationObserver","VNV_HEADER","VNVEcosystemToolbar","vnv-333-ticker.js","vnv-ticker-autopopulate.js","enforceFloor","normalizeHierarchy"]){
  if(src.includes(token)) problems.push("active regulator token returned in "+regulator+": "+token);
 }
}
if(problems.length){console.error(JSON.stringify({status:"FAIL",problems},null,2));process.exit(1)}
console.log(JSON.stringify({status:"PASS",school:"Middle School",policy:"chrome and typography regulators retired; reinjection authority absent"},null,2));
