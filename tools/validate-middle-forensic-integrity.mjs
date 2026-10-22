import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import {spawnSync} from "node:child_process";

const root=process.cwd();
const errors=[];
const check=(ok,description)=>{if(!ok)errors.push(description)};
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const exists=p=>fs.existsSync(path.join(root,p));
function walk(dir="."){
  return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(entry=>{
    if(entry.name===".git")return [];
    const p=path.posix.join(dir,entry.name);
    return entry.isDirectory()?walk(p):[p];
  });
}
const files=walk();
const html=files.filter(f=>f.endsWith(".html"));
let refs=0,remote=0,fragmentRefs=0;
for(const filename of html){
  const source=read(filename);
  const ids=new Set([...source.matchAll(/\bid\s*=\s*["']([^"'<>]+)["']/g)].map(m=>m[1]));
  for(const match of source.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g)){
    const ref=match[1].trim();
    if(!ref||ref==="#"||ref.includes("${")||/^(mailto:|tel:|data:|javascript:)/i.test(ref))continue;
    if(/^https?:\/\//i.test(ref)||ref.startsWith("//")){remote++;continue}
    if(ref.startsWith("#")){fragmentRefs++;check(ids.has(decodeURIComponent(ref.slice(1))),filename+" missing anchor "+ref);continue}
    const target=ref.split(/[?#]/)[0];
    if(!target)continue;
    if(target.startsWith("/")){
      // Root-relative shared-site resources are hosted by the central Academy.
      if(target==="/assets/vnv-beta-link.js")continue;
      const local=target.slice(1);
      check(exists(local)||exists(local+"/index.html"),filename+" missing rooted reference "+ref);
      continue;
    }
    refs++;
    const normalized=path.posix.normalize(path.posix.join(path.posix.dirname(filename),target));
    check(exists(normalized)||exists(path.posix.join(normalized,"index.html")),filename+" missing local reference "+ref);
  }
}
for(const grade of ["06","07","08"]){
  const base="grades/grade-"+grade;
  for(let i=1;i<=36;i++){
    const w=String(i).padStart(2,"0");
    check(exists(base+"/weekly-plans/week-"+w+".html"),grade+" missing week "+w);
    check(exists(base+"/printables/week-"+w+"-packet.html"),grade+" missing print "+w);
    check(exists(base+"/assessments/week-"+w+"-assessment.html"),grade+" missing assessment "+w);
  }
  const app=read(base+"/assets/app.js");
  const cert=read(base+"/assets/certificate.js");
  check(app.includes("readState()"),grade+" missing record reader");
  check(!app.includes("Math.min(100,Number(raw))"),grade+" silently coerces invalid scores");
  check(cert.includes("validWeeks")&&cert.includes("Array.from({length:36}"),grade+" missing strict certificate gate");
  const valid=Object.fromEntries(Array.from({length:36},(_,i)=>[String(i+1),85]));
  const invalid={...valid};delete invalid["36"];invalid["37"]=85;
  for(const [name,weekly] of [["valid",valid],["invalid",invalid]]){
    const out={innerHTML:""};
    const state={weekly,midterm:90,final:90,portfolio:true,transition:true,student:"Test"};
    const context={window:{KhaemenesGradeContinuity:{status:()=>({status:"ready",learner:{grade,nickname:"Test",studentId:""}}),readState:()=>state}},document:{getElementById:()=>out}};
    vm.runInNewContext(cert,context,{filename:base+"/assets/certificate.js",timeout:1000});
    check(name==="valid"?out.innerHTML.includes("Certificate of"):out.innerHTML.includes("Certificate Locked"),grade+" "+name+" certificate outcome incorrect");
  }
}
const main=read("index.html");
check(main.includes("safeResourceURL")&&main.includes("escapeHTML(r.url)"),"resource directory does not validate and escape URLs");
check(main.includes("middleMoreResources")&&main.includes("displayed.length"),"resource pagination missing");
const scripts=files.filter(p=>/\.(?:m?js)$/.test(p));
for(const script of scripts){
  const r=spawnSync(process.execPath,["--check",script],{cwd:root,encoding:"utf8"});
  check(r.status===0,script+" JavaScript syntax: "+(r.stderr||"").slice(0,240));
}
// Week 7 curriculum accuracy and student-record isolation regression.
for(const [g,subject,focus] of [["07","science","measuring Earth-system change with equations and inequalities"],["08","mathematics","rigid transformations and congruence proofs"]]){
 const file=`grades/grade-${g}/subjects/${subject}/week-07.html`,source=read(file);
 check((source.match(new RegExp("Focus:</strong> "+focus,"g"))||[]).length===5,file+" has inconsistent daily objectives");
 for(let day=1;day<=5;day++)check(source.includes("Week 07 Subject Depth Lab · Day "+day),file+" missing depth lab "+day);
}
const navigator=read("assets/khaemenes-middle-learning-navigator.js");
check(!navigator.includes("localStorage.getItem(ctx.legacyKey)"),"Middle learning navigator must not display unowned legacy student progress");
const congruenceGuide=read("grades/grade-08/assessments/week-07-assessment.html");
check(congruenceGuide.includes('aria-label="Week 07 congruence evidence guide"'),"Grade 8 missing weekly congruence evidence guide");
check(congruenceGuide.includes("Passing: 18/22 = 81.8%"),"Grade 8 original assessment scoring changed");
console.log(JSON.stringify({htmlPages:html.length,localReferences:refs,fragmentReferences:fragmentRefs,remoteReferences:remote,javascriptFiles:scripts.length,issues:errors.length},null,2));
if(errors.length){console.error(errors.slice(0,80).join("\n"));process.exit(1)}
console.log("PASS: Middle School forensic integrity and internal-link validation.");
