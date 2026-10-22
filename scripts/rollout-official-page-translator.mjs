#!/usr/bin/env node
// One canonical language selector on every Middle School HTML page.
// Changes only an additive script tag; never reads or writes student data.
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const APPLY=process.argv.includes("--apply");
const EXPECTED="https://vervenveda.com/assets/vnv-language.js";
const excluded=new Set([".git","node_modules","vendor","dist","build"]);
const files=[];
function walk(dir){
 for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  if(e.isDirectory()){if(!excluded.has(e.name))walk(path.join(dir,e.name));}
  else if(e.isFile()&&/\.html?$/i.test(e.name))files.push(path.join(dir,e.name));
 }
}
walk(root);
const missing=[],unsupported=[],present=[],changed=[];
for(const file of files){
 const source=fs.readFileSync(file,"utf8"),relative=path.relative(root,file).split(path.sep).join("/");
 if(/<script\b[^>]*\bsrc\s*=\s*["'][^"']*vnv-language\.js(?:[?#][^"']*)?["'][^>]*><\/script\s*>/i.test(source)){present.push(relative);continue;}
 if(!/<\/body\s*>/i.test(source)){unsupported.push(relative);continue;}
 missing.push(relative);
 if(APPLY){
  const injected=source.replace(/<\/body\s*>/i,'<!-- VNV_OFFICIAL_SITE_TRANSLATOR -->\n<script defer src="'+EXPECTED+'"></script>\n</body>');
  fs.writeFileSync(file,injected);
  changed.push(relative);
 }
}
const summary={total:files.length,present:present.length,missing:missing.length,unsupported:unsupported.length,changed:changed.length,examples:{missing:missing.slice(0,8),unsupported:unsupported.slice(0,8)}};
console.log(JSON.stringify(summary,null,2));
if(unsupported.length)process.exitCode=1;
if(!APPLY&&missing.length)process.exitCode=1;
