import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_MIDDLE_LEARNING_ENGINE_V1 -->";
const fail=m=>{throw new Error(m)};
const expect=(v,m)=>{if(!v)fail(m)};
const read=p=>fs.readFileSync(path.join(ROOT,p),"utf8");
const exists=p=>fs.existsSync(path.join(ROOT,p));
const posix=p=>p.split(path.sep).join("/");

const assets=[
  "assets/khaemenes-middle-focus-map.js",
  "assets/khaemenes-middle-question-factory.js",
  "assets/khaemenes-middle-learning-ledger.js",
  "assets/khaemenes-middle-assessment-engine.js"
];
for(const p of assets)expect(exists(p),"Missing shared Middle School asset: "+p);
for(const p of assets.slice(1)){try{new Function(read(p))}catch(e){fail(p+" syntax: "+e.message)}}

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules","archive","archives","backup","backups","vendor","private"].includes(e.name.toLowerCase()))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full,out);
    else if(e.isFile()&&/\.html$/i.test(full))out.push(full);
  }
  return out;
}
function classify(rel){
  const p="/"+posix(rel);
  const lesson=
    /^\/grades\/grade-0[6-8]\/subjects\/[^/]+\/week-\d+\.html$/i.test(p) ||
    /^\/grades\/grade-0[6-8]\/weekly-plans\/week-\d+\.html$/i.test(p);
  const assessment=
    /^\/grades\/grade-0[6-8]\/assessments\/(?:week-\d+-assessment|midterm|final-exam)\.html$/i.test(p);
  return lesson?"lesson":assessment?"assessment":null;
}
function refs(html){return [...html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map(m=>m[1])}

const coverage={lesson:0,assessment:0,missing:[],duplicates:[],performanceMissing:[]};
for(const full of walk(ROOT)){
  const rel=posix(path.relative(ROOT,full)),type=classify(rel);if(!type)continue;
  coverage[type]++;
  const html=fs.readFileSync(full,"utf8"),markers=html.split(MARKER).length-1,scripts=refs(html);
  if(markers!==1)(markers===0?coverage.missing:coverage.duplicates).push(rel+" marker="+markers);
  if(!scripts.some(s=>s.endsWith("khaemenes-middle-focus-map.js")))coverage.missing.push(rel+" focus map");
  if(!scripts.some(s=>s.endsWith("khaemenes-middle-question-factory.js")))coverage.missing.push(rel+" question factory");
  const runtime=type==="lesson"?"khaemenes-middle-learning-ledger.js":"khaemenes-middle-assessment-engine.js";
  if(!scripts.some(s=>s.endsWith(runtime)))coverage.missing.push(rel+" "+runtime);
  if(type==="assessment"&&!/class=["'][^"']*worksheet|id=["']canonicalCumulativeMount/i.test(html))coverage.performanceMissing.push(rel);
}
expect(coverage.lesson===1080,"Expected 1080 Middle School lesson/review surfaces; found "+coverage.lesson);
expect(coverage.assessment===114,"Expected 114 formal assessment surfaces; found "+coverage.assessment);
expect(!coverage.missing.length,"Learning-engine coverage gaps:\n"+coverage.missing.slice(0,40).join("\n"));
expect(!coverage.duplicates.length,"Duplicate engine markers:\n"+coverage.duplicates.slice(0,40).join("\n"));
expect(!coverage.performanceMissing.length,"Performance evidence surface lost:\n"+coverage.performanceMissing.slice(0,30).join("\n"));

// Question factory.
const context={console,globalThis:null};context.globalThis=context;vm.createContext(context);
vm.runInContext(read("assets/khaemenes-middle-question-factory.js"),context);
const factory=context.KhaemenesMiddleQuestionFactory;
expect(factory?.version,"Middle question factory did not expose its API.");
let sampled=0;
for(let grade=6;grade<=8;grade++){
  for(const subject of factory.subjects){
    for(let seed=1;seed<=12;seed++){
      const qs=factory.makePool({grade,subject,focus:subject+" evidence reasoning",seed,count:6});
      expect(qs.length>=4,"Too few generated questions for Grade "+grade+" "+subject+" seed "+seed);
      for(const q of qs){
        expect(factory.validateQuestion(q),"Invalid generated question for Grade "+grade+" "+subject+": "+q?.prompt);
        expect(new Set(q.options).size===4,"Generated question has duplicate options.");
        expect(q.options[q.answer]===q.correct,"Generated answer key mismatch.");
        sampled++;
      }
    }
  }
}
expect(sampled>=1800,"Generated-question sample unexpectedly small: "+sampled);

// Full advertised Monte Carlo pool depth.
let largePoolQuestions=0;
for(let grade=6;grade<=8;grade++){
  const counts={
    weekly:grade===6?18:grade===7?20:22,
    midterm:grade===6?36:grade===7?40:44,
    final:grade===6?45:grade===7?50:55
  };
  for(const [scope,display] of Object.entries(counts)){
    const expected=Math.max(display*2,scope==="weekly"?45:90);
    const pool=factory.makeBalanced({grade,focus:"cumulative algebra evidence science civics research technology",seed:"qa-"+grade+"-"+scope,count:expected});
    expect(pool.length===expected,"Grade "+grade+" "+scope+" pool has "+pool.length+" questions; expected "+expected);
    expect(new Set(pool.map(q=>q.prompt)).size===pool.length,"Grade "+grade+" "+scope+" pool contains duplicate prompts.");
    expect(new Set(pool.map(q=>q.answer)).size===4,"Grade "+grade+" "+scope+" does not distribute answer positions across all four choices.");
    for(const q of pool)expect(factory.validateQuestion(q),"Invalid question in Grade "+grade+" "+scope+" pool.");
    largePoolQuestions+=pool.length;
  }
}

// Formative boundary.
const ledger=read("assets/khaemenes-middle-learning-ledger.js");
expect(ledger.includes("masteryAuthority:false"),"Lesson ledger lost non-mastery boundary.");
expect(ledger.includes("affectsGrade:false"),"Lesson ledger no longer marks practice as non-graded.");
expect(ledger.includes("unlocksCurriculum:false"),"Lesson ledger no longer marks practice as non-unlocking.");
expect(ledger.includes("changesPlacement:false"),"Lesson ledger no longer protects placement.");
expect(!/state\.weekly\s*\[/.test(ledger),"Lesson ledger must not write weekly mastery scores.");

// Formal assessment boundary.
const assessment=read("assets/khaemenes-middle-assessment-engine.js");
expect(assessment.includes("PASS=80"),"Middle assessment threshold is not 80%.");
expect(assessment.includes("khaemenes-middle-assessment-attempt-v1"),"Immutable attempt schema missing.");
expect(assessment.includes('verifiedBy:"middle-assessment-engine-v1"'),"Verified score authority marker missing.");
expect(assessment.includes("completed(s,18)"),"Midterm gate no longer checks Weeks 01–18.");
expect(assessment.includes("completed(s,36)"),"Final gate no longer checks all 36 weeks.");
expect(assessment.includes("performanceEvidencePreserved:true"),"Performance-evidence preservation contract missing.");
expect(assessment.includes("manualScoreEntry:false"),"Manual score authority unexpectedly enabled.");

// Dashboards and certificates.
for(const g of ["06","07","08"]){
  const app=read("grades/grade-"+g+"/assets/app.js");
  expect(/completedWeeks\(\)===DATA\.weeks\.length/.test(app),"Grade "+g+" readiness no longer requires every week.");
  expect(!/state\.weekly\[[^\]]+\]\s*=/.test(app),"Grade "+g+" dashboard still writes weekly scores manually.");
  expect(!/state\.midterm=Math\.max/.test(app),"Grade "+g+" dashboard still writes midterm manually.");
  expect(!/state\.final=Math\.max/.test(app),"Grade "+g+" dashboard still writes final manually.");
  expect(/readOnly=true/.test(app),"Grade "+g+" score fields are not read-only.");
  const cert=read("grades/grade-"+g+"/assets/certificate.js");
  expect(/done===36/.test(cert),"Grade "+g+" certificate does not require 36/36 weeks.");
  expect(/midterm\|\|0\)>=80|midterm\)>=80|midterm\|\|0\)>=DATA/.test(cert)||cert.includes("Number(state.midterm||0)>=80"),"Grade "+g+" certificate midterm gate missing.");
  expect(cert.includes("Number(state.final||0)>=80"),"Grade "+g+" certificate final gate missing.");
  if(g==="08")expect(/transition/.test(cert),"Grade 08 certificate lost high-school transition requirement.");
}

// Continuity must remain learner-scoped and refuse silent legacy assignment.
const continuity=read("assets/khaemenes-grade-continuity.js");
expect(continuity.includes("khaemenes.course:"),"Middle School continuity lost learner-scoped course keys.");
expect(continuity.includes("never silently claim"),"Legacy ownership protection comment/contract missing.");
expect(!/writeState\(legacy/.test(continuity),"Middle School continuity silently migrates legacy data to an active learner.");

console.log("Middle School learning engine regression: PASS");
console.log("  lesson/review surfaces covered: "+coverage.lesson);
console.log("  formal assessment surfaces covered: "+coverage.assessment);
console.log("  generated questions sampled: "+sampled);
console.log("  large-pool questions validated: "+largePoolQuestions);
console.log("  mastery threshold: 80%");
console.log("  performance rubrics preserved: "+coverage.assessment);
console.log("  score authority: verified randomized attempts");
