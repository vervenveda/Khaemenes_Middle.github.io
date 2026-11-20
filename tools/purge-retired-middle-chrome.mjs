import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const legacyName=["middle-school","global","chrome-v1.js"].join("-");
const expression=new RegExp("^[ \\t]*<script\\b(?=[^>]*\\bsrc\\s*=\\s*[\"'][^\"']*"+legacyName.replaceAll(".","\\.")+"[\"'])[^>]*>\\s*<\\/script>[ \\t]*(?:\\r?\\n)?","gmi");
let scanned=0,modified=0,removed=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const p=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(p);continue}
    if(!entry.name.endsWith(".html"))continue;
    scanned++;
    const original=fs.readFileSync(p,"utf8");
    let count=0;
    const cleaned=original.replace(expression,()=>{count++;return "";});
    if(cleaned.includes(legacyName))throw Error("Unrecognized legacy reference: "+p);
    if(count){fs.writeFileSync(p,cleaned);modified++;removed+=count}
  }
}
walk(root);
console.log(JSON.stringify({status:"PASS",scanned,modified,removed,legacyScriptAbsent:true},null,2));
