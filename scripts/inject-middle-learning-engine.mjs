import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const MARKER="<!-- KHAEMENES_MIDDLE_LEARNING_ENGINE_V1 -->";
const ASSETS={
  focus:"assets/khaemenes-middle-focus-map.js",
  factory:"assets/khaemenes-middle-question-factory.js",
  ledger:"assets/khaemenes-middle-learning-ledger.js",
  assessment:"assets/khaemenes-middle-assessment-engine.js",
  context:"assets/khaemenes-middle-learning-context.js"
};
const SKIP=new Set([".git","node_modules","archive","archives","backup","backups","vendor","private"]);
const posix=p=>p.split(path.sep).join("/");

function walk(dir,out=[]){
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(SKIP.has(e.name.toLowerCase()))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())walk(full,out);
    else if(e.isFile()&&/\.html$/i.test(full))out.push(full);
  }
  return out;
}
function classify(rel){
  const p="/"+posix(rel);
  const lesson=
    /^\/grades\/grade-0[6-8]\/subjects\/[^/]+\/week-\d+\.html$/i.test(p) ||
    /^\/grades\/grade-0[6-8]\/weekly-plans\/week-\d+\.html$/i.test(p);
  const assessment=
    /^\/grades\/grade-0[6-8]\/assessments\/(?:week-\d+-assessment|midterm|final-exam)\.html$/i.test(p);
  return lesson?"lesson":assessment?"assessment":null;
}
function ref(file,target){
  let r=posix(path.relative(path.dirname(file),path.join(ROOT,target)));
  if(!r.startsWith("."))r="./"+r;
  return r;
}
function block(file,type){
  return MARKER+"\n"+
    '<script src="'+ref(file,ASSETS.focus)+'"></script>\n'+
    '<script src="'+ref(file,ASSETS.factory)+'"></script>\n'+
    '<script src="'+ref(file,type==="lesson"?ASSETS.ledger:ASSETS.assessment)+'"></script>\n'+
    '<script src="'+ref(file,ASSETS.context)+'"></script>';
}
function inject(file,type){
  let html=fs.readFileSync(file,"utf8");
  const beta="<!-- VNV_BETA_PROGRAM_V1 -->";
  if(html.includes(MARKER)){
    if(html.includes("khaemenes-middle-learning-context.js"))return{changed:false,reason:"already"};
    const contextTag='<script src="'+ref(file,ASSETS.context)+'"></script>';
    if(html.includes(beta))html=html.replace(beta,contextTag+"\n"+beta);
    else if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,contextTag+"\n</body>");
    else return{changed:false,reason:"no-body"};
    fs.writeFileSync(file,html,"utf8");
    return{changed:true,reason:"context-added"};
  }
  const snippet=block(file,type);
  if(html.includes(beta))html=html.replace(beta,snippet+"\n"+beta);
  else if(/<\/body>/i.test(html))html=html.replace(/<\/body>/i,snippet+"\n</body>");
  else return{changed:false,reason:"no-body"};
  fs.writeFileSync(file,html,"utf8");
  return{changed:true,reason:"injected"};
}

const report={lesson:{target:0,changed:0,already:0,skipped:[]},assessment:{target:0,changed:0,already:0,skipped:[]}};
for(const file of walk(ROOT)){
  const rel=path.relative(ROOT,file),type=classify(rel);if(!type)continue;
  report[type].target++;
  const r=inject(file,type);
  if(r.changed)report[type].changed++;
  else if(r.reason==="already")report[type].already++;
  else report[type].skipped.push(posix(rel)+": "+r.reason);
}
report.totalTargets=report.lesson.target+report.assessment.target;
report.totalChanged=report.lesson.changed+report.assessment.changed;
report.totalSkipped=report.lesson.skipped.length+report.assessment.skipped.length;
console.log(JSON.stringify(report,null,2));
if(report.totalSkipped)process.exitCode=2;
