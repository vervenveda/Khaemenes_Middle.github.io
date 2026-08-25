import fs from "node:fs";
import vm from "node:vm";

const read=p=>fs.readFileSync(p,"utf8");
const fail=m=>{throw new Error(m)};
const expect=(c,m)=>{if(!c)fail(m)};
const load=(path,name)=>{
  const context={window:{}};
  vm.createContext(context);
  vm.runInContext(read(path),context,{filename:path});
  return context.window[name];
};

const course=load("grades/grade-06/data/course-data.js","KHAE_GRADE6_DATA");
const crosswalk=load("grades/grade-06/data/subject-week-crosswalk.js","KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK");
const source=read("grades/grade-06/data/subject-week-crosswalk.js");

expect(course?.weeks?.length===36,"Canonical Grade 6 course must contain 36 weeks.");
expect(course?.subjects?.length===9,"Canonical Grade 6 course must contain nine subject halls.");
expect(course?.course?.passingScore===80,"Canonical Grade 6 mastery threshold must remain 80%.");
expect(crosswalk?.grade==="06","Crosswalk must identify Grade 06.");
expect(crosswalk?.masteryThreshold===80,"Crosswalk mastery threshold must remain 80%.");
expect(crosswalk?.weeks?.length===36,"Crosswalk must contain exactly 36 weeks.");
expect(crosswalk?.subjects?.length===9,"Crosswalk must contain exactly nine subject definitions.");

const subjectIds=course.subjects.map(s=>s.id);
expect(JSON.stringify(crosswalk.subjects.map(s=>s.id))===JSON.stringify(subjectIds),"Crosswalk subject order/IDs must match canonical Grade 6 course data.");

let cells=0;
for(const canonical of course.weeks){
  const row=crosswalk.weeks.find(w=>w.week===canonical.week);
  expect(row,`Missing crosswalk week ${canonical.week}.`);
  expect(row.title===canonical.title,`Week ${canonical.week} title drift: crosswalk must match canonical course title.`);
  expect(row.subjects&&typeof row.subjects==="object",`Week ${canonical.week} must define subject cells.`);
  expect(Object.keys(row.subjects).length===9,`Week ${canonical.week} must define exactly nine subject cells.`);
  for(const id of subjectIds){
    const cell=row.subjects[id];
    expect(cell,`Week ${canonical.week} missing ${id} crosswalk cell.`);
    for(const field of ["focus","objective","evidenceTask","assessmentTarget"]){
      expect(typeof cell[field]==="string"&&cell[field].trim().length>=18,`Week ${canonical.week} ${id} ${field} must be substantive.`);
    }
    cells++;
  }
}
expect(cells===324,"Crosswalk must contain exactly 324 Grade 6 subject-week cells.");

const math=w=>crosswalk.weeks.find(x=>x.week===w).subjects.mathematics.focus.toLowerCase();
for(const [week,tokens] of new Map([
  [2,["ratio"]],
  [3,["unit rate"]],
  [4,["percent"]],
  [5,["fraction division"]],
  [6,["rational"]],
  [7,["coordinate"]],
  [8,["expression"]],
  [9,["equation"]],
  [10,["inequal"]],
  [11,["statistical"]],
  [12,["surface area"]],
  [13,["volume"]]
])) for(const token of tokens) expect(math(week).includes(token),`Grade 6 Mathematics Week ${week} must align to ${token}, not a rotating strand.`);

const science=w=>crosswalk.weeks.find(x=>x.week===w).subjects.science.focus.toLowerCase();
for(const [week,token] of [[14,"particle"],[15,"thermal"],[16,"forces"],[18,"wave"],[19,"light"],[20,"cells"],[21,"ecosystem"],[22,"hydrosphere"],[23,"climate"]]) expect(science(week).includes(token),`Grade 6 Science Week ${week} must explicitly align to ${token}.`);

const social=w=>crosswalk.weeks.find(x=>x.week===w).subjects["social-studies"].focus.toLowerCase();
for(const [week,token] of [[24,"mesopotamia"],[25,"ancient laws"],[26,"greece"],[27,"trade routes"]]) expect(social(week).includes(token),`Grade 6 Social Studies Week ${week} must explicitly align to ${token}.`);

const integrated=w=>crosswalk.weeks.find(x=>x.week===w).subjects["integrated-projects"].focus.toLowerCase();
expect(integrated(29).includes("research question"),"Week 29 integrated work must launch research-question/thesis work.");
expect(integrated(34).includes("capstone research plan"),"Week 34 integrated work must define the capstone research plan.");
expect(integrated(35).includes("orally defending"),"Week 35 integrated work must require capstone oral defense.");
expect(integrated(36).includes("grade 7 readiness"),"Week 36 integrated work must culminate in Grade 7 readiness.");

for(const forbidden of ["localStorage.setItem","writeState(","clearState(","awardMastery","setPlacement","studentName"]){
  expect(!source.includes(forbidden),`Crosswalk must remain curriculum-only and may not contain record authority: ${forbidden}`);
}

console.log(`Grade 6 subject-week crosswalk validation passed: ${cells} aligned cells across 36 weeks and nine subjects; canonical titles and 80% authority preserved; known rotating-focus defects are blocked.`);
