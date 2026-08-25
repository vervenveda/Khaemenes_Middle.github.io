import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const expect=(condition,message)=>{if(!condition)throw new Error(message)};
const load=(p,name)=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(read(p),context,{filename:p});
  return context.window[name];
};

const course=load("grades/grade-07/data/course-data.js","KHAE_GRADE7_DATA");
const crosswalk=load("grades/grade-07/data/subject-week-crosswalk.js","KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK");
const rendererPath="assets/khaemenes-grade7-curriculum-alignment.js";
const bootstrapPath="assets/khaemenes-middle-breakaway.js";
const renderer=read(rendererPath);
const bootstrap=read(bootstrapPath);

expect(course?.weeks?.length===36,"Grade 7 renderer validation requires the canonical 36-week course.");
expect(course?.subjects?.length===9,"Grade 7 renderer validation requires nine canonical subjects.");
expect(crosswalk?.weeks?.length===36,"Grade 7 renderer requires the 36-week canonical crosswalk.");
expect(crosswalk?.masteryThreshold===80,"Grade 7 renderer must preserve the 80% mastery standard.");

for(const token of [
  'const VERSION="1.0.0"',
  'subject-week-crosswalk.js',
  'Weekly Subject Assignment',
  'What you are learning',
  'Evidence to keep',
  'Mastery target',
  'Mastery standard',
  'replaceLabeledParagraph(card,"Focus:",data.cell.focus)',
  'replaceLabeledParagraph(article,"Focus:",data.cell.focus)',
  'replaceLabeledParagraph(article,"Objective:",data.cell.objective)',
  'replaceLabeledParagraph(article,"Evidence:",data.cell.evidenceTask)',
  'Teacher Guidance',
  'Model the canonical weekly focus:',
  'grade7CurriculumAligned',
  'grade7WeeklyPlanAligned',
  'WEEK_PLAN_PATH',
  'grade7-assignment-card'
]) expect(renderer.includes(token),`Grade 7 alignment renderer contract missing: ${token}`);

expect(renderer.includes('WEEK_PATH=/\\/grades\\/grade-07\\/subjects\\/([^/]+)\\/week-(\\d{2})\\.html$/i'),"Renderer must recognize canonical Grade 7 subject-week pages.");
expect(renderer.includes('SUBJECT_PATH=/\\/grades\\/grade-07\\/subjects\\/([^/]+)'),"Renderer must recognize canonical Grade 7 subject landing pages.");
expect(renderer.includes('WEEK_PLAN_PATH=/\\/grades\\/grade-07\\/weekly-plans\\/week-(\\d{2})\\.html$/i'),"Renderer must recognize Grade 7 integrated weekly plans.");

for(const forbidden of ["localStorage.setItem","localStorage.removeItem","writeState(","clearState(","setPlacement","awardMastery","studentName"]){
  expect(!renderer.includes(forbidden),`Grade 7 alignment renderer must remain read-only: ${forbidden}`);
}

for(const token of [
  'const VERSION="1.4.0"',
  'khaemenes-grade7-curriculum-alignment.js',
  'function ensureGrade7Alignment()',
  'grade-07\\/(?:subjects|weekly-plans)',
  'ensureGrade7Alignment'
]) expect(bootstrap.includes(token),`Middle School bootstrap does not safely wire Grade 7 alignment: ${token}`);

const grade7Scope=bootstrap.match(/function ensureGrade7Alignment\(\)\{([\s\S]*?)\n  \}/)?.[1]||"";
expect(grade7Scope.includes("grade-07"),"Grade 7 alignment loader must retain an explicit Grade 7 pathname scope.");
expect(!grade7Scope.includes("grade-06")&&!grade7Scope.includes("grade-08"),"Grade 7 alignment loader itself must not target another grade.");

const breakawayToken="khaemenes-middle-breakaway.js";
let checked=0;
for(const subject of course.subjects){
  const index=`grades/grade-07/subjects/${subject.id}/index.html`;
  expect(exists(index),`Missing Grade 7 subject landing: ${index}`);
  expect(read(index).includes(breakawayToken),`Grade 7 subject landing cannot receive canonical alignment because shared bootstrap is missing: ${index}`);
  checked++;
  for(const week of course.weeks){
    const w=String(week.week).padStart(2,"0");
    const file=`grades/grade-07/subjects/${subject.id}/week-${w}.html`;
    expect(exists(file),`Missing Grade 7 subject-week page: ${file}`);
    expect(read(file).includes(breakawayToken),`Grade 7 subject-week page cannot receive canonical alignment because shared bootstrap is missing: ${file}`);
    checked++;
  }
}
expect(checked===333,`Expected 333 Grade 7 subject surfaces (9 landings + 324 week pages), checked ${checked}.`);

let plans=0;
for(const week of course.weeks){
  const w=String(week.week).padStart(2,"0");
  const file=`grades/grade-07/weekly-plans/week-${w}.html`;
  expect(exists(file),`Missing Grade 7 weekly plan: ${file}`);
  expect(read(file).includes(breakawayToken),`Grade 7 weekly plan cannot receive canonical alignment because shared bootstrap is missing: ${file}`);
  plans++;
}
expect(plans===36,"Expected all 36 Grade 7 weekly plans to receive canonical alignment.");

const legacyMath2=read("grades/grade-07/subjects/mathematics/week-02.html");
expect(legacyMath2.includes("<strong>Focus:</strong> unit rates and percent"),"Representative legacy Grade 7 Mathematics Week 02 mismatch changed unexpectedly; runtime migration boundary should remain explicit.");
const canonicalMath2=crosswalk.weeks.find(w=>w.week===2)?.subjects?.mathematics?.focus?.toLowerCase()||"";
expect(canonicalMath2.includes("proportional")&&canonicalMath2.includes("ratio")&&!canonicalMath2.includes("percent"),"Canonical Grade 7 Mathematics Week 02 must focus proportional relationships/ratios without pulling forward percent change.");

const legacyPlan2=read("grades/grade-07/weekly-plans/week-02.html");
expect(legacyPlan2.includes("<td>Mathematics</td><td>unit rates and percent</td>"),"Representative Grade 7 weekly-plan mismatch changed unexpectedly; runtime alignment boundary should remain explicit.");

const grade8Index=read("grades/grade-08/index.html");
expect(!grade8Index.includes("khaemenes-grade7-curriculum-alignment.js"),"Grade 8 portal must not directly load Grade 7 alignment.");

for(const file of [rendererPath,bootstrapPath]){
  const check=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  expect(check.status===0,`${file} failed JavaScript syntax validation:\n${check.stderr||check.stdout}`);
}

console.log(`Grade 7 crosswalk renderer validation passed: canonical assignment and weekly-plan rendering are read-only; all ${checked} subject surfaces plus ${plans} weekly plans receive Grade-7-only alignment while Grade 8 remains isolated.`);
