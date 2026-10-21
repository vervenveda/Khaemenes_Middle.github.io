import fs from "node:fs";
import assert from "node:assert/strict";
const read=p=>fs.readFileSync(p,"utf8");
const root="grades/grade-06";
const subjects=["language-arts","mathematics","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
let lessons=0;
for(let week=1;week<=36;week++){
 const n=String(week).padStart(2,"0");
 const plan=read(root+"/weekly-plans/week-"+n+".html");
 const packet=read(root+"/printables/week-"+n+"-packet.html");
 const companion=read(root+"/printables/week-"+n+"-subject-evidence.html");
 assert(plan.includes("week-"+n+"-packet.html"),"Plan packet missing at "+n);
 assert(plan.includes("week-"+n+"-assessment.html"),"Plan assessment missing at "+n);
 assert(packet.includes('href="week-'+n+'-subject-evidence.html"'),"Packet missing companion "+n);
 const canonical=companion.match(/weekly-evidence-packet\.html\?week=(\d+)/);
 assert(canonical&&Number(canonical[1])===week,"Canonical evidence route mismatch "+n);
 assert.equal((companion.match(/<h2>Original lesson evidence<\/h2>/g)||[]).length,9,"Subject companion sheets "+n);
 for(const subject of subjects){
  const h=read(root+"/subjects/"+subject+"/week-"+n+".html");
  const sections=(h.match(/<article class="lesson">/g)||[]).length;
  assert(sections>=5,"Insufficient daily instruction "+n+" "+subject);
  lessons+=sections;
 }
}
const cert=read(root+"/assets/certificate.js");
for(const contract of ['done===36','avg>=80','Number(state.midterm||0)>=80','Number(state.final||0)>=80','!!state.portfolio','context.status==="ready"','grade-07'])assert(cert.includes(contract),"Certificate or transition safeguard absent: "+contract);
const app=read(root+"/assets/app.js");
assert(app.includes('completedWeeks()===DATA.weeks.length'),"Dashboard full-year completion contract absent");
assert(!app.includes('state.portfolio=$("portfolio").checked'),"Learner dashboard must not self-approve portfolio");
assert(app.includes('$("portfolio").disabled=true'),"Portfolio approval must be read-only in learner dashboard");
const engine=read("assets/khaemenes-middle-assessment-engine.js");
for(const contract of ['PASS=80','completed(s,18)','completed(s,36)','performanceEvidencePreserved:true','manualScoreEntry:false'])assert(engine.includes(contract),"Formal assessment contract missing: "+contract);
for(let week=25;week<=36;week++)assert(engine.includes("makeGrade6Week"+week+"Subjects"),"Subject assessment bank routing missing: "+week);
console.log("Grade 6 end-of-year source contracts PASS: 36 weeks, 324 subject halls, "+lessons+" instruction blocks, 36 correct evidence routes, mastery/certificate/Grade 7 transition checks.");
