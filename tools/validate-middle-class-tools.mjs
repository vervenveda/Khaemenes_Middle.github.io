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
for(const p of gradePages){
  const src=fs.readFileSync(path.join(root,p),"utf8");
  if(!src.includes("vnv-ecosystem-toolbar.js"))throw Error("Official VNV ecosystem toolbar missing: "+p);
  if(!src.includes("vnv-333-ticker.js"))throw Error("Official 333 ticker missing: "+p);
}
const main=fs.readFileSync(path.join(root,"index.html"),"utf8");
for(const name of ["vnv-header-autopopulate.js","vnv-ticker-autopopulate.js","vnv-ecosystem-toolbar.js"]){
  if(!main.includes(name))throw Error("Canonical campus component missing: "+name);
}
if(oldReferences)process.exit(1);
console.log(JSON.stringify({status:"PASS",htmlPages,oldReferences,gradeLandings:gradePages.length,canonicalHomepage:true},null,2));
