import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const oldName=["middle-school","global","chrome-v1.js"].join("-");
let htmlPages=0,oldReferences=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(p);continue}
    if(!entry.name.endsWith(".html"))continue;
    htmlPages++;
    const src=fs.readFileSync(p,"utf8");
    if(src.includes(oldName)){console.error("Retired component reference:",path.relative(root,p));oldReferences++}
  }
}
walk(root);
const gradePages=["06","07","08"].map(g=>"grades/grade-"+g+"/index.html");
const landingShell=fs.readFileSync(path.join(root,"assets/middle-school-landing-shell-v1.js"),"utf8");
for(const name of ["vnv-ecosystem-toolbar.js","vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","vnv-language.js"]){
  if(!landingShell.includes(name))throw Error("Canonical Middle landing shell missing: "+name);
}
for(const p of gradePages){
  const src=fs.readFileSync(path.join(root,p),"utf8");
  if(!src.includes("middle-school-landing-shell-v1.js"))throw Error("Shared Middle landing shell missing: "+p);
  if(!src.includes("middle-school-landing-shell-v1.css"))throw Error("Shared Middle landing style missing: "+p);
  if((src.match(/<header\b/g)||[]).length!==0)throw Error("Page-local grade header must be retired: "+p);
  if(/vnv-ecosystem-toolbar\.js|vnv-333-ticker\.js|vnv-ticker-autopopulate\.js|<script[^>]+vnv-language\.js/i.test(src))throw Error("Page-local canonical chrome loader competes with shared shell: "+p);
}
const main=fs.readFileSync(path.join(root,"index.html"),"utf8");
for(const name of ["vnv-header-autopopulate.js","vnv-ticker-autopopulate.js","vnv-ecosystem-toolbar.js"]){
  if(!main.includes(name))throw Error("Canonical campus component missing: "+name);
}
if(oldReferences)process.exit(1);
console.log(JSON.stringify({status:"PASS",htmlPages,oldReferences,gradeLandings:gradePages.length,canonicalHomepage:true,landingShell:true},null,2));
