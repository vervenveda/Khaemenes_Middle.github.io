import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
const fail=m=>{throw new Error(m)};
const expect=(c,m)=>{if(!c)fail(m)};
const load=(p,name)=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(read(p),context,{filename:p});
  return context.window[name];
};

const course=load("grades/grade-06/data/course-data.js","KHAE_GRADE6_DATA");
const crosswalk=load("grades/grade-06/data/subject-week-crosswalk.js","KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK");
const rendererPath="assets/khaemenes-grade6-curriculum-alignment.js";
const bootstrapPath="assets/khaemenes-middle-breakaway.js";
const renderer=read(rendererPath);
const bootstrap=read(bootstrapPath);

expect(course?.weeks?.length===36,"Grade 6 renderer validation requires the canonical 36-week course.");
expect(course?.subjects?.length===9,"Grade 6 renderer validation requires nine canonical subjects.");
expect(crosswalk?.weeks?.length===36,"Grade 6 renderer requires the 36-week canonical crosswalk.");
expect(crosswalk?.masteryThreshold===80,"Grade 6 renderer must preserve the 80% mastery standard.");

for(const token of [
  'const VERSION="1.1.1"',
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
  'grade6CurriculumAligned',
  'grade6WeeklyPlanAligned',
  'WEEK_PLAN_PATH',
  'rewriteEvidenceLinks(global.document,week,"../../")',
  'rewriteEvidenceLinks(global.document,week,"../")',
  'weekly-evidence-packet.html?week=',
  'weekly-mastery-check.html?week=',
  'grade6-assignment-card'
]) expect(renderer.includes(token),`Grade 6 alignment renderer contract missing: ${token}`);

expect(renderer.includes('WEEK_PATH=/\\/grades\\/grade-06\\/subjects\\/([^/]+)\\/week-(\\d{2})\\.html$/i'),"Renderer must recognize canonical Grade 6 subject-week pages.");
expect(renderer.includes('SUBJECT_PATH=/\\/grades\\/grade-06\\/subjects\\/([^/]+)'),"Renderer must recognize canonical Grade 6 subject landing pages.");
expect(renderer.includes('WEEK_PLAN_PATH=/\\/grades\\/grade-06\\/weekly-plans\\/week-(\\d{2})\\.html$/i'),"Renderer must recognize Grade 6 integrated weekly plans.");

for(const forbidden of ["localStorage.setItem","writeState(","clearState(","setPlacement","awardMastery","studentName"]){
  expect(!renderer.includes(forbidden),`Grade 6 alignment renderer must remain read-only: ${forbidden}`);
}

for(const token of [
  'const VERSION="1.3.0"',
  'khaemenes-grade6-curriculum-alignment.js',
  'function ensureGrade6Alignment()',
  'grade-06\\/(?:subjects|weekly-plans)',
  'ensureGrade6Alignment();createButton()',
  'ensureGrade6Alignment'
]) expect(bootstrap.includes(token),`Middle School bootstrap does not safely wire Grade 6 alignment: ${token}`);

expect(!bootstrap.includes('/grades/grade-07/subjects/'),"Grade 6 alignment loader must not target Grade 7.");
expect(!bootstrap.includes('/grades/grade-08/subjects/'),"Grade 6 alignment loader must not target Grade 8.");

const breakawayToken="khaemenes-middle-breakaway.js";
let checked=0;
for(const subject of course.subjects){
  const index=`grades/grade-06/subjects/${subject.id}/index.html`;
  expect(exists(index),`Missing Grade 6 subject landing: ${index}`);
  expect(read(index).includes(breakawayToken),`Grade 6 subject landing cannot receive canonical alignment because shared bootstrap is missing: ${index}`);
  checked++;
  for(const week of course.weeks){
    const w=String(week.week).padStart(2,"0");
    const file=`grades/grade-06/subjects/${subject.id}/week-${w}.html`;
    expect(exists(file),`Missing Grade 6 subject-week page: ${file}`);
    expect(read(file).includes(breakawayToken),`Grade 6 subject-week page cannot receive canonical alignment because shared bootstrap is missing: ${file}`);
    checked++;
  }
}
expect(checked===333,`Expected 333 Grade 6 subject surfaces (9 landings + 324 week pages), checked ${checked}.`);

let plans=0;
for(const week of course.weeks){
  const w=String(week.week).padStart(2,"0");
  const file=`grades/grade-06/weekly-plans/week-${w}.html`;
  expect(exists(file),`Missing Grade 6 weekly plan: ${file}`);
  expect(read(file).includes(breakawayToken),`Grade 6 weekly plan cannot receive canonical alignment because shared bootstrap is missing: ${file}`);
  plans++;
}
expect(plans===36,"Expected all 36 Grade 6 weekly plans to receive canonical alignment.");

const legacyWeek2=read("grades/grade-06/subjects/mathematics/week-02.html");
expect(legacyWeek2.includes("<strong>Focus:</strong> percent"),"Representative legacy Mathematics Week 02 mismatch changed unexpectedly; renderer migration boundary should remain explicit in this repair.");
const canonicalMath2=crosswalk.weeks.find(w=>w.week===2)?.subjects?.mathematics?.focus?.toLowerCase()||"";
expect(canonicalMath2.includes("ratio")&&!canonicalMath2.startsWith("percent"),"Canonical Mathematics Week 02 must override the legacy rotating percent focus with ratio reasoning.");

const legacyPlan2=read("grades/grade-06/weekly-plans/week-02.html");
expect(legacyPlan2.includes("<td>Mathematics</td><td>percent</td>"),"Representative legacy weekly-plan mismatch changed unexpectedly; runtime alignment boundary should remain explicit.");

for(const grade of ["07","08"]){
  const gradeIndex=read(`grades/grade-${grade}/index.html`);
  expect(!gradeIndex.includes("khaemenes-grade6-curriculum-alignment.js"),`Grade ${grade} portal must not directly load Grade 6 alignment.`);
}

for(const file of [rendererPath,bootstrapPath]){
  const check=spawnSync(process.execPath,["--check",path.join(root,file)],{encoding:"utf8"});
  expect(check.status===0,`${file} failed JavaScript syntax validation:\n${check.stderr||check.stdout}`);
}

console.log(`Grade 6 crosswalk renderer validation passed: canonical assignment and weekly-plan rendering are read-only; all ${checked} subject surfaces plus ${plans} weekly plans receive aligned curriculum and canonical evidence routes.`);
