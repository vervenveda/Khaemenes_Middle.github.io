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
const evidencePath="grades/grade-06/assets/canonical-week-evidence.js";
const packetPath="grades/grade-06/evidence/weekly-evidence-packet.html";
const masteryPath="grades/grade-06/evidence/weekly-mastery-check.html";
const appPath="grades/grade-06/assets/app.js";
const navigatorPath="assets/khaemenes-middle-learning-navigator.js";
const alignmentPath="assets/khaemenes-grade6-curriculum-alignment.js";
const assessmentIndexPath="grades/grade-06/assessments/weekly-assessments.html";
const evidence=read(evidencePath);
const packet=read(packetPath);
const mastery=read(masteryPath);
const app=read(appPath);
const navigator=read(navigatorPath);
const alignment=read(alignmentPath);
const assessmentIndex=read(assessmentIndexPath);

expect(course?.weeks?.length===36,"Grade 6 weekly evidence requires exactly 36 canonical weeks.");
expect(course?.subjects?.length===9,"Grade 6 weekly evidence requires exactly nine canonical subjects.");
expect(Number(course?.course?.passingScore)===80,"Grade 6 course authority must remain 80%.");
expect(crosswalk?.weeks?.length===36,"Grade 6 weekly evidence requires the 36-week crosswalk.");
expect(Number(crosswalk?.masteryThreshold)===80,"Grade 6 crosswalk mastery authority must remain 80%.");
for(const week of crosswalk.weeks){
  expect(Object.keys(week.subjects||{}).length===9,`Week ${pad(week.week)} must expose all nine subject evidence cells.`);
}

for(const file of [packetPath,masteryPath,evidencePath])expect(exists(file),`Missing canonical Grade 6 weekly evidence component: ${file}`);
for(const [html,mode] of [[packet,"packet"],[mastery,"assessment"]]){
  expect(html.includes(`data-evidence-mode="${mode}"`),`${mode} page must declare its evidence mode.`);
  expect(html.includes("../data/course-data.js"),`${mode} page must load canonical Grade 6 course data.`);
  expect(html.includes("../data/subject-week-crosswalk.js"),`${mode} page must load the canonical crosswalk.`);
  expect(html.includes("../assets/canonical-week-evidence.js"),`${mode} page must load the canonical evidence renderer.`);
  expect(html.includes('id="canonicalEvidenceMount"'),`${mode} page must expose the canonical evidence mount.`);
}

for(const token of [
  'const MIN=80',
  'const TOTAL_POINTS=22',
  'const PASSING_POINTS=18',
  'const mode=document.body?.dataset?.evidenceMode||"packet"',
  'requested>=1&&requested<=36',
  'Weekly Evidence Packet',
  'Weekly Mastery Check',
  'canonical-identity',
  '"Name:"',
  '"Date:"',
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
]) expect(evidence.includes(token),`Canonical weekly evidence contract missing: ${token}`);

for(const forbidden of [
  "localStorage.setItem(","localStorage.removeItem(","writeState(","clearState(","setPlacement(","awardMastery(","state.weekly["
]) expect(!evidence.includes(forbidden),`Canonical evidence pages must remain read-only; forbidden write token: ${forbidden}`);

const domainCount=[...evidence.matchAll(/\["(?:ELA Reading & Evidence|Writing & Research|Mathematics Computation|Mathematical Modeling|Science \/ Engineering|Social Studies \/ Civics|World Languages \/ Culture|Arts \/ Music \/ Media|Health \/ PE \/ SEL|Technology \/ Design|Integrated Portfolio)"/g)].length;
expect(domainCount===11,`Weekly Mastery Check must expose exactly 11 review domains, found ${domainCount}.`);

for(const token of [
  'evidence/weekly-evidence-packet.html?week=${pad(w.week)}',
  'evidence/weekly-mastery-check.html?week=${pad(w.week)}',
  'Evidence Packet',
  'Mastery Check'
]) expect(app.includes(token),`Grade 6 dashboard must route weekly work to canonical evidence: ${token}`);

for(const token of [
  'const packetHref=week=>grade==="06"?',
  'const weeklyAssessmentHref=week=>grade==="06"?',
  'evidence/weekly-evidence-packet.html?week=',
  'evidence/weekly-mastery-check.html?week=',
  '`evidence/weekly-evidence-packet.html?week=${pad(week)}`',
  '`evidence/weekly-mastery-check.html?week=${pad(week)}`'
]) expect(navigator.includes(token),`Middle School navigator Grade 6/7/8 route contract missing: ${token}`);

for(const token of [
  'WEEK_PLAN_PATH',
  'rewriteEvidenceLinks(global.document,week,"../../")',
  'rewriteEvidenceLinks(global.document,week,"../")',
  'a.textContent="Weekly Evidence Packet"',
  'a.textContent="Weekly Mastery Check"'
]) expect(alignment.includes(token),`Grade 6 alignment renderer must close legacy weekly evidence routes: ${token}`);

expect(assessmentIndex.includes("36 Weekly Mastery Checks"),"Grade 6 assessment directory must present the canonical 36-week mastery sequence.");
expect(assessmentIndex.includes('../evidence/weekly-mastery-check.html?week=${w}'),"Grade 6 assessment directory must route to the canonical weekly mastery page.");
expect(!assessmentIndex.includes('href="week-01-assessment.html"'),"Grade 6 assessment directory must not expose legacy weekly assessment links.");
expect(assessmentIndex.includes("at least 80% overall and 80% in their aligned mathematics questions")&&assessmentIndex.includes("Adult-reviewed 22-point evidence rubrics are supplemental"),"Grade 6 assessment directory must distinguish verified weekly mastery from supplemental adult evidence.");

let weeklyPlans=0;
for(const week of course.weeks){
  const w=pad(week.week);
  const plan=`grades/grade-06/weekly-plans/week-${w}.html`;
  expect(exists(plan),`Missing Grade 6 weekly plan ${w}.`);
  expect(read(plan).includes("khaemenes-middle-breakaway.js"),`Grade 6 weekly plan ${w} must load the alignment bootstrap.`);
  weeklyPlans++;
}
expect(weeklyPlans===36,"Expected all 36 Grade 6 weekly plans.");

let subjectWeeks=0;
for(const subject of course.subjects){
  for(const week of course.weeks){
    const w=pad(week.week);
    const file=`grades/grade-06/subjects/${subject.id}/week-${w}.html`;
    expect(exists(file),`Missing Grade 6 ${subject.id} week ${w}.`);
    expect(read(file).includes("khaemenes-middle-breakaway.js"),`${file} must load the Grade 6 alignment bootstrap.`);
    subjectWeeks++;
  }
}
expect(subjectWeeks===324,"Expected all 324 Grade 6 subject-week pages.");

// Forensic guard: the nine-subject companion must never point to another week's canonical evidence.
for(let n=10;n<=21;n++){
  const w=pad(n);
  const companion=`grades/grade-06/printables/week-${w}-subject-evidence.html`;
  expect(exists(companion),`Missing nine-subject evidence companion for Week ${w}`);
  const page=read(companion);
  expect(page.includes(`weekly-evidence-packet.html?week=${w}`),`Week ${w} printable routes to wrong canonical evidence week`);
  expect((page.match(/<section class="sheet">/g)||[]).length===9,`Week ${w} must include nine subject evidence sheets`);
  const weeklyPacket=read(`grades/grade-06/printables/week-${w}-packet.html`);
  expect(weeklyPacket.includes(`week-${w}-subject-evidence.html`),`Week ${w} printable packet missing companion link`);
}
const ecosystemPlan=read("grades/grade-06/weekly-plans/week-21.html");
const ecosystemCrosswalk=crosswalk.weeks.find(w=>Number(w.week)===21);
for(const subject of course.subjects){
 const focus=ecosystemCrosswalk.subjects[subject.id].focus;
 expect(ecosystemPlan.includes(focus.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;")),`Week 21 weekly plan has stale subject focus: ${subject.id}`);
}

const grade7App=read("grades/grade-07/assets/app.js");
expect(grade7App.includes("evidence/weekly-evidence-packet.html"),"Grade 7 may use its own canonical evidence routing after its independent migration.");
expect(grade7App.includes("evidence/weekly-mastery-check.html"),"Grade 7 may use its own canonical mastery routing after its independent migration.");

const grade8App=read("grades/grade-08/assets/app.js");
expect(grade8App.includes("evidence/weekly-evidence-packet.html"),"Grade 8 uses its independently implemented canonical printable.");
expect(grade8App.includes("evidence/weekly-mastery-check.html"),"Grade 8 uses its independently implemented canonical mastery check.");
expect(read("grades/grade-08/evidence/weekly-mastery-check.html").includes("khaemenes-grade8-week-evidence.js"),"Grade 8 independent evidence renderer must exist.");

for(const file of [evidencePath,navigatorPath,alignmentPath,appPath]){
  const result=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  expect(result.status===0,`${file} failed JavaScript syntax validation:\n${result.stderr||result.stdout}`);
}

console.log(`Grade 6 weekly evidence validation passed: 36 canonical weeks, 324 subject-week sources, nine aligned subjects per week, read-only printable evidence, 11-domain/22-point adult review, 18-point passing threshold, Grade 6 canonical routes, independent Grade 7 canonical migration, and Grade 8 route isolation.`);
