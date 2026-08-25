import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const expect=(condition,message)=>{if(!condition)throw new Error(message)};
const pad=n=>String(Number(n)).padStart(2,"0");
function load(p,name){
  const sandbox={window:{}};
  vm.createContext(sandbox);
  vm.runInContext(read(p),sandbox,{filename:p,timeout:1000});
  return sandbox.window[name];
}

const course=load("grades/grade-06/data/course-data.js","KHAE_GRADE6_DATA");
const crosswalk=load("grades/grade-06/data/subject-week-crosswalk.js","KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK");
const enginePath="grades/grade-06/assets/canonical-cumulative-assessment.js";
const engine=read(enginePath);
const navigator=read("assets/khaemenes-middle-learning-navigator.js");
const assessmentIndex=read("grades/grade-06/assessments/weekly-assessments.html");

expect(course?.weeks?.length===36,"Grade 6 cumulative assessment requires the canonical 36-week course.");
expect(course?.subjects?.length===9,"Grade 6 cumulative assessment requires nine canonical subjects.");
expect(Number(course?.course?.passingScore)===80,"Grade 6 cumulative assessment must preserve the 80% mastery threshold.");
expect(crosswalk?.weeks?.length===36,"Grade 6 cumulative assessment requires the canonical 36-week crosswalk.");
expect(Number(crosswalk?.masteryThreshold)===80,"Grade 6 crosswalk must preserve the 80% threshold.");

const midMarker=course.weeks.find(w=>/midyear|midterm/i.test(`${w.title||""} ${w.theme||""}`));
expect(Number(midMarker?.week)===17,`Canonical Grade 6 curriculum must place the Midyear Portfolio and Assessment at Week 17; found ${midMarker?.week??"none"}.`);
expect(/Midyear Portfolio and Assessment/i.test(midMarker?.title||""),"Week 17 must remain the explicit canonical midyear assessment marker.");
expect(Number(course?.assessments?.midterm?.itemCount)===120,"Grade 6 Midterm must preserve 120 items.");
expect(Number(course?.assessments?.final?.itemCount)===140,"Grade 6 Final must preserve 140 items.");
expect(Number(course?.assessments?.midterm?.passingScore)===80,"Grade 6 Midterm must preserve 80% passing.");
expect(Number(course?.assessments?.final?.passingScore)===80,"Grade 6 Final must preserve 80% passing.");

for(const token of [
  'const VERSION="1.0.0"',
  'const MIN=80',
  'const MODE=document.body?.dataset?.cumulativeMode||"midterm-review"',
  'function midyearBoundary()',
  '/midyear|midterm/i',
  'const coverageEnd=isMidterm?midyearBoundary():Number(DATA?.course?.weeks||36)',
  'const itemCount=Number(DATA?.assessments?.[examType]?.itemCount)||(isMidterm?120:140)',
  'const passingItems=Math.ceil(itemCount*MIN/100)',
  'function buildPool(limit=coverageEnd)',
  'function selectEven(pool,count)',
  'assessmentTarget',
  'evidenceTask',
  'Midyear Review Center',
  'Final Course Review',
  'recommended, non-graded review space',
  'Study-focus weeks',
  'Open Integrated Week',
  'Evidence Packet',
  'Official adult-reviewed cumulative assessment',
  'Each item is worth one point',
  'Authorized Adult Review',
  'Print / Save PDF',
  'Download Review Guide',
  'Download Assessment Copy',
  '"Name:"',
  '"Date:"',
  'Adult reviewer:',
  'The Grade 6 learner record remains the score authority',
  'KhaemenesGrade6CumulativeAssessment'
]) expect(engine.includes(token),`Canonical Grade 6 cumulative engine contract missing: ${token}`);

for(const forbidden of [
  "localStorage.setItem(","localStorage.removeItem(","writeState(","clearState(","setPlacement(","awardMastery(","state.midterm=", "state.final="
]) expect(!engine.includes(forbidden),`Grade 6 cumulative review/assessment must remain read-only; forbidden token: ${forbidden}`);
expect(engine.includes("localStorage.getItem(LEGACY_KEY)"),"Cumulative review may read the legacy local record only as a compatibility fallback.");
expect(engine.includes('if(status?.status==="placement-mismatch")return blank()'),"Placement mismatch must fail closed for score-aware review display.");

function pool(limit){
  const out=[];
  for(const week of course.weeks.filter(w=>Number(w.week)<=limit)){
    const map=crosswalk.weeks.find(w=>Number(w.week)===Number(week.week));
    for(const subject of course.subjects){
      const cell=map?.subjects?.[subject.id];
      expect(cell,`Missing cumulative source: Week ${pad(week.week)} ${subject.id}.`);
      out.push({week:Number(week.week),subjectId:subject.id,prompt:cell.assessmentTarget,evidence:cell.evidenceTask});
    }
  }
  return out;
}
function selectEven(items,count){return Array.from({length:count},(_,i)=>items[Math.floor(i*items.length/count)])}
function verifySelection(label,limit,count,required){
  const source=pool(limit);
  expect(source.length===limit*9,`${label} source pool must be ${limit*9} cells; found ${source.length}.`);
  const selected=selectEven(source,count);
  expect(selected.length===count,`${label} must expose ${count} items.`);
  expect(new Set(selected.map(x=>x.week)).size===limit,`${label} selection must represent every covered week 01–${pad(limit)}.`);
  expect(new Set(selected.map(x=>x.subjectId)).size===9,`${label} selection must represent all nine subjects.`);
  expect(selected.every(x=>x.week>=1&&x.week<=limit),`${label} selection escaped its coverage boundary.`);
  expect(selected.every(x=>String(x.prompt||"").trim().length>20),`${label} selected item is missing a substantive canonical mastery prompt.`);
  expect(selected.every(x=>String(x.evidence||"").trim().length>20),`${label} selected item is missing a substantive evidence direction.`);
  expect(Math.ceil(count*.8)===required,`${label} passing item count must be ${required}/${count}.`);
}
verifySelection("Midterm",17,120,96);
verifySelection("Final",36,140,112);

const shells=[
  ["grades/grade-06/assessments/midterm-review.html","midterm-review"],
  ["grades/grade-06/assessments/final-review.html","final-review"],
  ["grades/grade-06/assessments/midterm.html","midterm"],
  ["grades/grade-06/assessments/final-exam.html","final"]
];
for(const [file,mode] of shells){
  expect(exists(file),`Missing Grade 6 cumulative surface: ${file}`);
  const html=read(file);
  expect(html.includes(`data-cumulative-mode="${mode}"`),`${file} must declare cumulative mode ${mode}.`);
  expect(html.includes('../data/course-data.js'),`${file} must load canonical course data.`);
  expect(html.includes('../data/subject-week-crosswalk.js'),`${file} must load canonical crosswalk data.`);
  expect(html.includes('../assets/canonical-cumulative-assessment.js'),`${file} must load the canonical cumulative engine.`);
  expect(html.includes('../../../assets/khaemenes-grade-continuity.js'),`${file} must load learner-scoped Grade continuity.`);
  expect(html.includes('id="canonicalCumulativeMount"'),`${file} must expose the canonical cumulative mount.`);
}
expect(!read("grades/grade-06/assessments/midterm.html").includes("Demonstrate Grade 6 A++ mastery in"),"Official Midterm must not retain the generic repeated legacy prompt.");
expect(!read("grades/grade-06/assessments/final-exam.html").includes("Demonstrate Grade 6 A++ mastery in"),"Official Final must not retain the generic repeated legacy prompt.");

for(const token of [
  'buildReviewCard("Midyear Review Center"',
  'const hasCanonicalReviews=grade==="06"||grade==="07"',
  'hasCanonicalReviews?"assessments/midterm-review.html":null',
  'buildReviewCard("Final Course Review"',
  'hasCanonicalReviews?"assessments/final-review.html":null',
  'if(reviewHref)actions.append(link("Open Review Center",reviewHref,"button"))'
]) expect(navigator.includes(token),`Learning Navigator cumulative Grade 6 route contract missing: ${token}`);
expect(navigator.includes('"assessments/midterm.html","Open Official Midterm"'),"Learning Navigator must retain the official Midterm doorway.");
expect(navigator.includes('"assessments/final-exam.html","Open Official Final"'),"Learning Navigator must retain the official Final doorway.");

for(const token of ["midterm-review.html","Official Midterm","final-review.html","Official Final"]){
  expect(assessmentIndex.includes(token),`Grade 6 assessment directory cumulative route missing: ${token}`);
}

const grade7Engine=read("grades/grade-07/assets/canonical-cumulative-assessment.js");
expect(grade7Engine.includes("KHAE_GRADE7_DATA"),"Grade 7 may use its own independent canonical cumulative engine after migration.");
const grade7Mid=read("grades/grade-07/assessments/midterm.html");
const grade7Final=read("grades/grade-07/assessments/final-exam.html");
expect(grade7Mid.includes("canonicalCumulativeMount")&&grade7Final.includes("canonicalCumulativeMount"),"Grade 7 may expose its own canonical cumulative surfaces after independent migration.");

const grade8App=read("grades/grade-08/assets/app.js");
expect(!grade8App.includes("canonical-cumulative-assessment"),"Grade 8 must not inherit Grade 6 or Grade 7 cumulative engines before its own migration.");
const grade8Mid=read("grades/grade-08/assessments/midterm.html");
const grade8Final=read("grades/grade-08/assessments/final-exam.html");
expect(!grade8Mid.includes("canonicalCumulativeMount")&&!grade8Final.includes("canonicalCumulativeMount"),"Grade 8 cumulative pages must remain unchanged until its own migration.");

for(const file of [enginePath,"assets/khaemenes-middle-learning-navigator.js"]){
  const result=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  expect(result.status===0,`${file} failed JavaScript syntax validation:\n${result.stderr||result.stdout}`);
}

console.log("Grade 6 cumulative assessment validation passed: Week 17 canonical midyear boundary, 17-week/120-item Midterm coverage with 96 required, 36-week/140-item Final coverage with 112 required, all nine subjects represented, Grade 6 canonical reviews, independent Grade 7 cumulative migration, official adult-review authority, and Grade 8 isolation are intact.");
