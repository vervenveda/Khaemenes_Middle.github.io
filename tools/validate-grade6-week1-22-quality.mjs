import fs from "node:fs";
import assert from "node:assert/strict";
const root="grades/grade-06";
const read=p=>fs.readFileSync(p,"utf8");
const cross=JSON.parse(read(root+"/data/subject-week-crosswalk.js").replace(/^window\.KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK\s*=\s*/,"").replace(/;\s*$/,""));
const encode=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
let lessons=0,portfolios=0,subjects=0;
for(let week=1;week<=22;week++){
 const w=String(week).padStart(2,"0");
 const plan=read(root+"/weekly-plans/week-"+w+".html");
 const packet=read(root+"/printables/week-"+w+"-packet.html");
 const companion=read(root+"/printables/week-"+w+"-subject-evidence.html");
 const canonical=cross.weeks.find(x=>x.week===week);
 assert(canonical,"Missing canonical week "+w);
 assert(plan.includes("week-"+w+"-packet.html"),"Weekly plan missing printable route "+w);
 assert(plan.includes("week-"+w+"-assessment.html"),"Weekly plan missing assessment route "+w);
 assert(packet.includes('href="week-'+w+'-subject-evidence.html"'),"Printable packet missing portfolio route "+w);
 assert(companion.includes("Week "+w),"Portfolio week identity missing "+w);
 assert.equal((companion.match(/<section class="sheet">/g)||[]).length,9,"Nine portfolio sheets required "+w);
 assert.equal((companion.match(/<h1>Khaemenes Academy<\/h1>/g)||[]).length,9,"Printable school heading missing "+w);
 assert.equal((companion.match(/Student: /g)||[]).length,9,"Printable student identity missing "+w);
 assert.equal((companion.match(/<h2>Original lesson evidence<\/h2>/g)||[]).length,9,"Original task missing "+w);
 portfolios++;
 for(const s of cross.subjects){
   let link="../subjects/"+s.id+"/week-"+w+".html";
   assert(plan.includes(link),"Broken weekly plan subject route "+w+" "+s.id);
   assert(plan.includes("<td>"+encode(canonical.subjects[s.id].focus)+"</td>"),"Stale focus "+w+" "+s.id);
   assert(plan.includes("<td>"+encode(canonical.subjects[s.id].objective)+"</td>"),"Stale objective "+w+" "+s.id);
   const lesson=read(root+"/subjects/"+s.id+"/week-"+w+".html");
   const units=lesson.match(/<article class="lesson">[\s\S]*?<\/article>/g)||[];
   assert(units.length>=5,"Insufficient instructional sections "+w+" "+s.id);
   if(s.id!=="mathematics"){
     assert.equal(units.length,5,"Expected five daily lessons "+w+" "+s.id);
     for(const [i,unit] of units.entries()){
       assert(unit.includes(["Monday:","Tuesday:","Wednesday:","Thursday:","Friday:"][i]),"Misordered day "+w+" "+s.id);
       assert(unit.includes("Learn:"),"Missing instruction "+w+" "+s.id);
       assert(unit.includes("Practice and evidence:"),"Missing evidence task "+w+" "+s.id);
     }
   }
   lessons+=units.length;subjects++;
 }
}
assert.equal(subjects,198);
console.log("Grade 6 Weeks 1-22 audit PASS: 198 linked subject pages, "+lessons+" instructional blocks, 22 printable portfolios, 198 subject crosswalk mappings, 22 exam links.");
