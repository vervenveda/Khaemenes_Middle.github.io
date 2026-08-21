import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const grades=['06','07','08'];
const failures=[];
const notes=[];
const exists=p=>fs.existsSync(path.join(root,p));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const fail=(msg)=>failures.push(msg);

for(const g of grades){
  const base=`grades/grade-${g}`;
  if(!exists(`${base}/index.html`)) fail(`Grade ${g}: missing index.html`);
  for(const dir of ['assessments','assets','data','printables','records','subjects','teacher-tools','weekly-plans']){
    if(!exists(`${base}/${dir}`)) fail(`Grade ${g}: missing ${dir}/`);
  }
  for(let w=1;w<=36;w++){
    const n=String(w).padStart(2,'0');
    if(!exists(`${base}/assessments/week-${n}-assessment.html`)) fail(`Grade ${g}: missing Week ${n} assessment`);
    if(!exists(`${base}/weekly-plans/week-${n}.html`)) fail(`Grade ${g}: missing Week ${n} plan`);
  }
  if(!exists(`${base}/assessments/midterm.html`)) fail(`Grade ${g}: missing midterm`);
  if(!exists(`${base}/assessments/final-exam.html`)) fail(`Grade ${g}: missing final`);

  if(exists(`${base}/assets/app.js`)){
    const app=read(`${base}/assets/app.js`);
    if(!/passingScore/.test(app)) fail(`Grade ${g}: app.js does not reference course passingScore`);
    if(!/>=\s*DATA\.course\.passingScore/.test(app)) fail(`Grade ${g}: completed-week logic is not visibly derived from passingScore`);
    if(!/Math\.max\(0,Math\.min\(100/.test(app)) notes.push(`Grade ${g}: review score normalization/clamping.`);
  }
}

if(!exists('mentor-contract.json')) fail('Missing mentor-contract.json');
if(!exists('assets/khaemenes-middle-mentors.js')) fail('Missing Middle School mentor router');
else {
  const mentor=read('assets/khaemenes-middle-mentors.js');
  for(const name of ['Archaemenes','Hope']) if(!mentor.includes(name)) fail(`Mentor router missing ${name}`);
  for(const boundary of ['change grades','placement','protected records']) if(!mentor.toLowerCase().includes(boundary)) fail(`Mentor router missing boundary phrase: ${boundary}`);
}

console.log('KHAEMENES MIDDLE SCHOOL VALIDATION');
console.log(`Grades checked: ${grades.join(', ')}`);
console.log(`Expected weekly assessments: ${grades.length*36}`);
console.log(`Expected weekly plans: ${grades.length*36}`);
if(notes.length){console.log('\nREVIEW NOTES');notes.forEach(x=>console.log(`- ${x}`));}
if(failures.length){
  console.error(`\nFAIL (${failures.length})`);
  failures.forEach(x=>console.error(`- ${x}`));
  process.exitCode=1;
}else{
  console.log('\nPASS: structural, mastery-reference, and mentor-boundary checks passed.');
}
