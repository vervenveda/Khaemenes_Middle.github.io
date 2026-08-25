import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=path.resolve(".");
const fail=message=>{throw new Error(message)};
const expect=(condition,message)=>{if(!condition)fail(message)};
const read=relative=>fs.readFileSync(path.join(root,relative),"utf8");
const exists=relative=>fs.existsSync(path.join(root,relative));
const pad=n=>String(Number(n)).padStart(2,"0");

function gradeData(grade){
  const relative=`grades/grade-${pad(grade)}/data/course-data.js`;
  const sandbox={window:{}};
  vm.runInNewContext(read(relative),sandbox,{filename:relative,timeout:1000});
  return sandbox.window[`KHAE_GRADE${Number(grade)}_DATA`];
}

const scorebook=read("assets/khaemenes-middle-study-scorebook.js");
for(const token of [
  "KHAEMENES_GRADE_CONTEXT",
  "KhaemenesGradeContinuity",
  "placement-mismatch",
  "const MIN=Number(DATA.course?.passingScore)||80",
  "DATA.weeks.map",
  "recordedRows.filter(r=>r.score<MIN)",
  "Read-Only Study Scorebook",
  "Study Focus",
  "one adult-reviewed score for each week",
  "does not submit, reset, lower, replace, or certify any score",
  "Official Midterm",
  "Official Final & Completion Evidence",
  "assessments/midterm.html",
  "assessments/final-exam.html",
  "records/certificate.html",
  "The certificate page and authorized Academy/adult review remain the completion authority",
  "gradeNumber===8?!!state.transition:true"
]) expect(scorebook.includes(token),`Study Scorebook contract is missing: ${token}`);

for(const forbidden of ["localStorage.setItem(","localStorage.removeItem(","writeState(","clearState("]){
  expect(!scorebook.includes(forbidden),`Study Scorebook must remain read-only; forbidden write token found: ${forbidden}`);
}
expect(scorebook.includes('if(status?.status==="placement-mismatch")return blank()'),"Placement mismatch must fail closed for score display.");
expect(scorebook.includes("hasScore(state,week)"),"Weekly score display must distinguish an unrecorded week from a recorded numeric score.");
expect(scorebook.includes("recordedRows.filter(r=>r.score>=MIN).length"),"Mastered-week count must derive from the existing 80% weekly record.");
expect(scorebook.includes("mastered===36&&recordedRows.length===36"),"Completion snapshot must still require all 36 weekly records.");
expect(scorebook.includes("mid>=MIN&&fin>=MIN&&portfolio&&transition"),"Completion snapshot must mirror Midterm, Final, portfolio, and Grade 8 transition gates without becoming authority.");

for(const grade of [6,7,8]){
  const g=pad(grade),base=`grades/grade-${g}`;
  const data=gradeData(grade);
  expect(data&&data.weeks?.length===36,`Grade ${g} must expose 36 canonical weeks.`);
  expect(Number(data.course?.passingScore)===80,`Grade ${g} must preserve the 80% threshold.`);

  const index=read(`${base}/index.html`);
  const appIndex=index.indexOf('assets/app.js');
  const navigatorIndex=index.indexOf('khaemenes-middle-learning-navigator.js');
  const scorebookIndex=index.indexOf('khaemenes-middle-study-scorebook.js');
  expect(appIndex>=0&&navigatorIndex>appIndex&&scorebookIndex>navigatorIndex,`Grade ${g} must load app → Learning Navigator → Study Scorebook in that order.`);

  const app=read(`${base}/assets/app.js`);
  expect(app.includes("KhaemenesGradeContinuity"),`Grade ${g} must continue using learner-scoped grade continuity.`);
  expect(app.includes("weekly:{}"),`Grade ${g} learner record must retain the canonical weekly score map.`);
  expect(app.includes("state.weekly"),`Grade ${g} app must remain the weekly score writer/authority.`);
  expect(app.includes("DATA.course.passingScore"),`Grade ${g} app must retain its canonical passing-score reference.`);
  expect(app.includes("completedWeeks()===DATA.weeks.length"),`Grade ${g} completion must require all weeks at mastery.`);
  expect(app.includes("Number(state.midterm||0)>=DATA.course.passingScore"),`Grade ${g} completion must require Midterm mastery.`);
  expect(app.includes("Number(state.final||0)>=DATA.course.passingScore"),`Grade ${g} completion must require Final mastery.`);
  expect(app.includes("!!state.portfolio"),`Grade ${g} completion must retain portfolio evidence.`);
  if(grade===8)expect(app.includes("!!state.transition"),"Grade 08 completion must retain the high-school transition-plan gate.");

  expect(exists(`${base}/assessments/midterm.html`),`Grade ${g} official Midterm must exist.`);
  expect(exists(`${base}/assessments/final-exam.html`),`Grade ${g} official Final must exist.`);
  expect(exists(`${base}/records/certificate.html`),`Grade ${g} certificate record must exist.`);
}

const syntax=spawnSync(process.execPath,["--check",path.join(root,"assets/khaemenes-middle-study-scorebook.js")],{encoding:"utf8"});
expect(syntax.status===0,`Shared Study Scorebook failed JavaScript syntax validation:\n${syntax.stderr||syntax.stdout}`);

console.log("Middle School Study Scorebook validation passed: Grades 6–8 share a learner-safe read-only 36-week score view, below-80 study focus, official Midterm/Final doorways, portfolio evidence, Grade 8 transition semantics, and certificate authority separation.");
