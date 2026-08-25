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

const course=load("grades/grade-07/data/course-data.js","KHAE_GRADE7_DATA");
const crosswalk=load("grades/grade-07/data/subject-week-crosswalk.js","KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK");
const evidencePath="grades/grade-07/assets/canonical-week-evidence.js";
const packetPath="grades/grade-07/evidence/weekly-evidence-packet.html";
const masteryPath="grades/grade-07/evidence/weekly-mastery-check.html";
const appPath="grades/grade-07/assets/app.js";
const navigatorPath="assets/khaemenes-middle-learning-navigator.js";
const alignmentPath="assets/khaemenes-grade7-curriculum-alignment.js";
const assessmentIndexPath="grades/grade-07/assessments/weekly-assessments.html";
const evidence=read(evidencePath);
const packet=read(packetPath);
const mastery=read(masteryPath);
const app=read(appPath);
const navigator=read(navigatorPath);
const alignment=read(alignmentPath);
const assessmentIndex=read(assessmentIndexPath);

expect(course?.weeks?.length===36,"Grade 7 weekly evidence requires exactly 36 canonical weeks.");
expect(course?.subjects?.length===9,"Grade 7 weekly evidence requires exactly nine canonical subjects.");
expect(Number(course?.course?.passingScore)===80,"Grade 7 course authority must remain 80%.");
expect(crosswalk?.weeks?.length===36,"Grade 7 weekly evidence requires the 36-week crosswalk.");
expect(Number(crosswalk?.masteryThreshold)===80,"Grade 7 crosswalk mastery authority must remain 80%.");
for(const week of crosswalk.weeks)expect(Object.keys(week.subjects||{}).length===9,`Week ${pad(week.week)} must expose all nine subject evidence cells.`);

for(const file of [packetPath,masteryPath,evidencePath])expect(exists(file),`Missing canonical Grade 7 weekly evidence component: ${file}`);
for(const [html,mode] of [[packet,"packet"],[mastery,"assessment"]]){
  expect(html.includes(`data-evidence-mode="${mode}"`),`${mode} page must declare its evidence mode.`);
  expect(html.includes("../data/course-data.js"),`${mode} page must load canonical Grade 7 course data.`);
  expect(html.includes("../data/subject-week-crosswalk.js"),`${mode} page must load the canonical crosswalk.`);
  expect(html.includes("../assets/canonical-week-evidence.js"),`${mode} page must load the canonical evidence renderer.`);
  expect(html.includes('id="canonicalEvidenceMount"'),`${mode} page must expose the canonical evidence mount.`);
}

for(const token of [
  'const DATA=window.KHAE_GRADE7_DATA',
  'const CROSSWALK=window.KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK',
  'const MIN=80',
  'const TOTAL_POINTS=22',
  'const PASSING_POINTS=18',
  'requested>=1&&requested<=36',
  'Weekly Evidence Packet',
  'Weekly Mastery Check',
  'Name:',
  'Date:',
  'Adult reviewer:',
  'Print / Save PDF',
  'Download Study Guide',
  'Download Review Copy',
  'What you are learning',
  'Evidence to keep',
  'Mastery target',
  '11 domains × 2 points',
  'PASSING_POINTS}/${TOTAL_POINTS} = 81.8%',
  'ELA Reading & Evidence',
  'Writing & Research',
  'Mathematics Computation',
  'Mathematical Modeling',
  'Science / Engineering',
  'Social Studies / Civics',
  'World Languages / Culture',
  'Arts / Music / Media',
  'Health / PE / SEL',
  'Technology / Design',
  'Integrated Portfolio',
  'authorized adult/Academy record remains authoritative'
]) expect(evidence.includes(token),`Canonical Grade 7 weekly evidence contract missing: ${token}`);

for(const forbidden of ["localStorage.setItem(","localStorage.removeItem(","writeState(","clearState(","setPlacement(","awardMastery(","state.weekly["]){
  expect(!evidence.includes(forbidden),`Canonical Grade 7 evidence pages must remain read-only; forbidden write token: ${forbidden}`);
}

const domainNames=["ELA Reading & Evidence","Writing & Research","Mathematics Computation","Mathematical Modeling","Science / Engineering","Social Studies / Civics","World Languages / Culture","Arts / Music / Media","Health / PE / SEL","Technology / Design","Integrated Portfolio"];
for(const name of domainNames)expect(evidence.includes(`["${name}"`),`Missing Grade 7 mastery domain: ${name}`);
expect(domainNames.length===11,"Grade 7 Weekly Mastery Check must retain exactly 11 review domains.");

for(const token of [
  'evidence/weekly-evidence-packet.html?week=${pad(w.week)}',
  'evidence/weekly-mastery-check.html?week=${pad(w.week)}',
  'Evidence Packet',
  'Mastery Check'
]) expect(app.includes(token),`Grade 7 dashboard must route weekly work to canonical evidence: ${token}`);

for(const token of [
  'grade==="07"?`evidence/weekly-evidence-packet.html?week=${pad(week)}`',
  'grade==="07"?`evidence/weekly-mastery-check.html?week=${pad(week)}`',
  'grade==="07"?"Weekly Evidence Packet"',
  'grade==="07"?"Weekly Mastery Check"',
  '`printables/week-${pad(week)}-packet.html`',
  '`assessments/week-${pad(week)}-assessment.html`'
]) expect(navigator.includes(token),`Middle School navigator Grade 7/8 route contract missing: ${token}`);

for(const token of [
  'const VERSION="1.1.0"',
  'rewriteEvidenceLinks(global.document,week,"../../")',
  'rewriteEvidenceLinks(global.document,week,"../")',
  'a.textContent="Weekly Evidence Packet"',
  'a.textContent="Weekly Mastery Check"'
]) expect(alignment.includes(token),`Grade 7 alignment renderer must close legacy weekly evidence routes: ${token}`);

expect(assessmentIndex.includes("36 Weekly Mastery Checks"),"Grade 7 assessment directory must present the canonical 36-week mastery sequence.");
expect(assessmentIndex.includes('../evidence/weekly-mastery-check.html?week=${w}'),"Grade 7 assessment directory must route to the canonical weekly mastery page.");
expect(!assessmentIndex.includes('href="week-01-assessment.html"'),"Grade 7 assessment directory must not expose legacy weekly assessment links.");
expect(assessmentIndex.includes("18/22 points = 81.8%"),"Grade 7 assessment directory must publish the current mastery math.");

let weeklyPlans=0;
for(const week of course.weeks){
  const w=pad(week.week),plan=`grades/grade-07/weekly-plans/week-${w}.html`;
  expect(exists(plan),`Missing Grade 7 weekly plan ${w}.`);
  expect(read(plan).includes("khaemenes-middle-breakaway.js"),`Grade 7 weekly plan ${w} must load the alignment bootstrap.`);
  weeklyPlans++;
}
expect(weeklyPlans===36,"Expected all 36 Grade 7 weekly plans.");

let subjectWeeks=0;
for(const subject of course.subjects){
  for(const week of course.weeks){
    const w=pad(week.week),file=`grades/grade-07/subjects/${subject.id}/week-${w}.html`;
    expect(exists(file),`Missing Grade 7 ${subject.id} week ${w}.`);
    expect(read(file).includes("khaemenes-middle-breakaway.js"),`${file} must load the Grade 7 alignment bootstrap.`);
    subjectWeeks++;
  }
}
expect(subjectWeeks===324,"Expected all 324 Grade 7 subject-week pages.");

const grade8App=read("grades/grade-08/assets/app.js");
expect(grade8App.includes("printables/week-"),"Grade 8 legacy printable routing must remain unchanged in this Grade 7 repair.");
expect(grade8App.includes("assessments/week-"),"Grade 8 legacy weekly assessment routing must remain unchanged in this Grade 7 repair.");
expect(!grade8App.includes("evidence/weekly-evidence-packet.html"),"Grade 8 must not inherit Grade 7 evidence routing.");

for(const file of [evidencePath,navigatorPath,alignmentPath,appPath]){
  const result=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  expect(result.status===0,`${file} failed JavaScript syntax validation:\n${result.stderr||result.stdout}`);
}

console.log(`Grade 7 weekly evidence validation passed: 36 canonical weeks, 324 subject-week sources, nine aligned subjects per week, read-only printable evidence, 11-domain/22-point adult review, 18-point passing threshold, canonical dashboard/navigator/weekly-plan routes, and Grade 8 route isolation.`);
