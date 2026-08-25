import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const expect=(condition,message)=>{if(!condition)throw new Error(message)};
function load(p,name){
  const sandbox={window:{}};
  vm.createContext(sandbox);
  vm.runInContext(read(p),sandbox,{filename:p,timeout:1000});
  return sandbox.window[name];
}

const course=load("grades/grade-07/data/course-data.js","KHAE_GRADE7_DATA");
const crosswalk=load("grades/grade-07/data/subject-week-crosswalk.js","KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK");
const source=read("grades/grade-07/data/subject-week-crosswalk.js");
const ids=course.subjects.map(s=>s.id);

expect(course?.weeks?.length===36,"Grade 7 canonical course must contain 36 weeks.");
expect(course?.subjects?.length===9,"Grade 7 canonical course must contain nine subjects.");
expect(Number(course?.course?.passingScore)===80,"Grade 7 course must preserve the 80% mastery standard.");
expect(crosswalk?.version==="1.0.0","Grade 7 crosswalk must use version 1.0.0.");
expect(crosswalk?.grade==="07","Grade 7 crosswalk must identify Grade 07.");
expect(Number(crosswalk?.masteryThreshold)===80,"Grade 7 crosswalk must preserve the 80% mastery standard.");
expect(Array.isArray(crosswalk?.subjects)&&crosswalk.subjects.length===9,"Grade 7 crosswalk must expose nine subjects.");
expect(Array.isArray(crosswalk?.weeks)&&crosswalk.weeks.length===36,"Grade 7 crosswalk must expose 36 weeks.");
expect(JSON.stringify(crosswalk.subjectOrder)===JSON.stringify(ids),"Grade 7 crosswalk subject order must match canonical course data.");
expect(crosswalk.subjects.every((s,i)=>s.id===course.subjects[i].id&&s.title===course.subjects[i].title),"Grade 7 crosswalk subject identities/titles must match canonical course data.");

let cells=0;
for(let i=0;i<36;i++){
  const week=crosswalk.weeks[i],canonical=course.weeks[i];
  expect(Number(week.week)===i+1,`Crosswalk Week ${i+1} numbering is not contiguous.`);
  expect(week.title===canonical.title,`Crosswalk Week ${i+1} title does not match canonical course data.`);
  const keys=Object.keys(week.subjects||{});
  expect(keys.length===9,`Week ${i+1} must expose nine subject cells.`);
  expect(ids.every(id=>keys.includes(id)),`Week ${i+1} is missing a canonical subject cell.`);
  for(const id of ids){
    const cell=week.subjects[id];cells++;
    expect(typeof cell.focus==="string"&&cell.focus.trim().length>=24,`Week ${i+1} ${id} focus is not substantive.`);
    expect(typeof cell.objective==="string"&&cell.objective.trim().length>=90,`Week ${i+1} ${id} objective is not substantive.`);
    expect(typeof cell.evidenceTask==="string"&&cell.evidenceTask.trim().length>=80,`Week ${i+1} ${id} evidence task is not substantive.`);
    expect(typeof cell.assessmentTarget==="string"&&cell.assessmentTarget.trim().length>=100,`Week ${i+1} ${id} assessment target is not substantive.`);
    expect(cell.assessmentTarget.includes("80% mastery standard"),`Week ${i+1} ${id} assessment target must preserve explicit 80% mastery language.`);
  }
}
expect(cells===324,`Expected 324 Grade 7 subject-week alignment cells; found ${cells}.`);

const cell=(week,id)=>crosswalk.weeks[week-1].subjects[id];
const has=(week,id,...terms)=>terms.every(term=>cell(week,id).focus.toLowerCase().includes(term.toLowerCase()));
expect(has(2,"mathematics","proportional relationships","ratios"),"Week 02 Mathematics must center proportional relationships and ratios rather than jumping ahead to later strands.");
expect(has(3,"mathematics","unit rates","slope"),"Week 03 Mathematics must center unit rates and slope intuition.");
expect(has(4,"mathematics","percent increase/decrease"),"Week 04 Mathematics must center percent change.");
expect(has(5,"mathematics","rational numbers"),"Week 05 Mathematics must center rational-number operations.");
expect(has(6,"mathematics","distributive property"),"Week 06 Mathematics must center expressions/properties.");
expect(has(7,"mathematics","multi-step equations","inequalities"),"Week 07 Mathematics must center equations and inequalities.");
expect(has(8,"mathematics","scale drawings"),"Week 08 Mathematics must center scale drawings.");
expect(has(9,"mathematics","circumference","area"),"Week 09 Mathematics must center circle geometry.");
expect(has(10,"mathematics","surface area","volume"),"Week 10 Mathematics must center 3D geometry/modeling.");
expect(has(11,"mathematics","probability"),"Week 11 Mathematics must center probability.");
expect(has(12,"mathematics","random sampling","inference"),"Week 12 Mathematics must center statistics/inference.");

const scienceChecks={18:["cell structures","structure-function"],19:["body systems","homeostasis"],20:["inherited traits","variation"],21:["ecosystem","biodiversity"],22:["atoms","molecules"],23:["energy transfer","forces"],24:["plate tectonics","hazards"],25:["weather/climate","long-term data"]};
for(const [week,terms] of Object.entries(scienceChecks))expect(has(Number(week),"science",...terms),`Week ${week} Science is not aligned to its canonical Grade 7 science strand.`);
const socialChecks={26:["medieval","feudalism"],27:["islamic","scholarship"],28:["West African","Indian Ocean"],29:["Renaissance","Reformation"],30:["Scientific Revolution","Enlightenment"],31:["supply/demand","labor"]};
for(const [week,terms] of Object.entries(socialChecks))expect(has(Number(week),"social-studies",...terms),`Week ${week} Social Studies is not aligned to its canonical Grade 7 sequence.`);
expect(has(32,"world-languages","language families","diplomacy"),"Week 32 World Languages must center language/culture/diplomacy.");
expect(has(33,"technology-design","algorithms","data ethics"),"Week 33 Technology must center algorithms and data ethics.");
expect(has(34,"integrated-projects","Big Question","capstone"),"Week 34 Integrated Projects must center capstone research.");
expect(has(35,"integrated-projects","oral defense"),"Week 35 Integrated Projects must center production/oral defense.");
expect(has(36,"integrated-projects","final portfolio defense","Grade 8 readiness"),"Week 36 Integrated Projects must center final portfolio defense and Grade 8 readiness.");

for(const forbidden of ["localStorage","writeState(","clearState(","awardMastery(","setPlacement(","studentName","answerKey"]){
  expect(!source.includes(forbidden),`Grade 7 crosswalk must remain curriculum-only/read-only; forbidden token: ${forbidden}`);
}

const mid=course.weeks.find(w=>/midyear|midterm/i.test(`${w.title||""} ${w.theme||""}`));
expect(Number(mid?.week)===17,"Grade 7 canonical curriculum must retain Week 17 as its Midyear Portfolio and Assessment marker.");

console.log(`Grade 7 subject-week crosswalk validation passed: ${cells} substantive cells across 36 weeks and nine subjects; Grade 7 math, science, world-history/economics, language, technology, capstone, Week 17 midyear marker, and 80% authority are coherent.`);
