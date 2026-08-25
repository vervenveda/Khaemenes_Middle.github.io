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
  const source=read(relative);
  const sandbox={window:{}};
  vm.runInNewContext(source,sandbox,{filename:relative,timeout:1000});
  const data=sandbox.window[`KHAE_GRADE${Number(grade)}_DATA`];
  expect(data&&typeof data==="object",`Grade ${pad(grade)} course data must expose its canonical data object.`);
  return data;
}

const navigator=read("assets/khaemenes-middle-learning-navigator.js");
for(const token of [
  "KHAEMENES_GRADE_CONTEXT",
  "KhaemenesGradeContinuity",
  "placement-mismatch",
  "const MIN=Number(DATA.course?.passingScore)||80",
  "DATA.weeks.find(w=>/midyear|midterm/i.test",
  "36-Week Learning Navigator",
  "Open Integrated Week",
  "Printable Packet",
  "Weekly Assessment",
  "Subject lessons for this week",
  "Midyear Review Center",
  "Final Course Review",
  "assessments/midterm.html",
  "assessments/final-exam.html",
  "subjects/${subject.id}/week-${pad(w.week)}.html",
  "does not award mastery, change placement, or alter scores"
]) expect(navigator.includes(token),`Shared navigator contract is missing: ${token}`);

for(const forbidden of ["localStorage.setItem(","localStorage.removeItem(","writeState(","clearState("]){
  expect(!navigator.includes(forbidden),`Shared navigator must remain read-only; forbidden write token found: ${forbidden}`);
}
expect(navigator.includes('if(status?.status==="placement-mismatch")return blank()'),"Placement mismatch must fail closed for learner score display.");

let totalSubjectWeekRoutes=0;
let totalCoreWeekRoutes=0;
for(const grade of [6,7,8]){
  const g=pad(grade);
  const base=`grades/grade-${g}`;
  const data=gradeData(grade);
  expect(Number(data.course?.weeks)===36,`Grade ${g} must remain a 36-week program.`);
  expect(Number(data.course?.subjects)===9,`Grade ${g} must remain a nine-subject program.`);
  expect(Number(data.course?.passingScore)===80,`Grade ${g} must preserve the 80% mastery standard.`);
  expect(Array.isArray(data.weeks)&&data.weeks.length===36,`Grade ${g} must expose exactly 36 canonical week records.`);
  expect(Array.isArray(data.subjects)&&data.subjects.length===9,`Grade ${g} must expose exactly nine canonical subjects.`);
  expect(data.weeks.every((w,i)=>Number(w.week)===i+1),`Grade ${g} weeks must remain contiguous 01–36.`);

  const mid=data.weeks.find(w=>/midyear|midterm/i.test(`${w.title||""} ${w.theme||""}`));
  expect(mid&&Number(mid.week)>=15&&Number(mid.week)<=20,`Grade ${g} must expose a real midyear curriculum marker rather than relying on a hard-coded midpoint.`);

  const index=read(`${base}/index.html`);
  expect(index.includes('../../assets/khaemenes-middle-learning-navigator.js'),`Grade ${g} portal must load the shared learning navigator after its grade app.`);
  expect(index.indexOf('assets/app.js')<index.indexOf('khaemenes-middle-learning-navigator.js'),`Grade ${g} navigator must load after the authoritative grade app.`);

  expect(exists(`${base}/assessments/midterm.html`),`Grade ${g} official Midterm must exist.`);
  expect(exists(`${base}/assessments/final-exam.html`),`Grade ${g} official Final must exist.`);

  for(const week of data.weeks){
    const w=pad(week.week);
    for(const relative of [
      `${base}/weekly-plans/week-${w}.html`,
      `${base}/printables/week-${w}-packet.html`,
      `${base}/assessments/week-${w}-assessment.html`
    ]){
      expect(exists(relative),`Navigator route is missing: ${relative}`);
      totalCoreWeekRoutes++;
    }
    for(const subject of data.subjects){
      const relative=`${base}/subjects/${subject.id}/week-${w}.html`;
      expect(exists(relative),`Subject review route is missing: ${relative}`);
      totalSubjectWeekRoutes++;
    }
  }

  const app=read(`${base}/assets/app.js`);
  expect(app.includes("KhaemenesGradeContinuity"),`Grade ${g} must continue using learner-scoped grade continuity.`);
  expect(app.includes("completedWeeks()===DATA.weeks.length"),`Grade ${g} completion must still require all 36 weekly mastery records.`);
  expect(app.includes("Number(state.midterm||0)>=DATA.course.passingScore"),`Grade ${g} completion must still require the Midterm threshold.`);
  expect(app.includes("Number(state.final||0)>=DATA.course.passingScore"),`Grade ${g} completion must still require the Final threshold.`);
}

expect(totalSubjectWeekRoutes===972,`Expected 972 subject-week review routes, found ${totalSubjectWeekRoutes}.`);
expect(totalCoreWeekRoutes===324,`Expected 324 integrated week/printable/assessment routes, found ${totalCoreWeekRoutes}.`);

const syntax=spawnSync(process.execPath,["--check",path.join(root,"assets/khaemenes-middle-learning-navigator.js")],{encoding:"utf8"});
expect(syntax.status===0,`Shared learning navigator failed JavaScript syntax validation:\n${syntax.stderr||syntax.stdout}`);

console.log(`Middle School Learning Navigator validation passed: Grades 6–8, 108 canonical weeks, ${totalSubjectWeekRoutes} subject-week lesson routes, ${totalCoreWeekRoutes} integrated review routes, curriculum-derived midyear boundaries, official cumulative assessment doors, learner-safe read-only behavior, and 80% record authority are intact.`);
