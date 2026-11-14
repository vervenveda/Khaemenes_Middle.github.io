#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Middle.github.io/assets/middle-school-global-typography-v1.js" defer data-middle-typography="16-33-66"></script>\n';
const LOADER=/middle-school-global-typography-v1\.js/i;

function walk(dir){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if([".git","node_modules"].includes(e.name))continue;
    const full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...walk(full));
    else out.push(path.relative(ROOT,full).split(path.sep).join("/"));
  }
  return out;
}
function inject(source){
  if(LOADER.test(source))return source;
  if(/<\/head>/i.test(source))return source.replace(/<\/head>/i,TAG+"</head>");
  if(/<body\b/i.test(source))return source.replace(/<body\b/i,TAG+"<body");
  return TAG+source;
}

const files=walk(ROOT).filter(f=>/\.html?$/i.test(f)).sort();
let changed=0,covered=0;
for(const file of files){
  const abs=path.join(ROOT,file);
  let source=fs.readFileSync(abs,"utf8");
  if(LOADER.test(source)){covered++;continue}
  if(WRITE){
    source=inject(source);
    fs.writeFileSync(abs,source);
    changed++;covered++;
  }
}
const guard=fs.readFileSync(path.join(ROOT,"assets/middle-school-global-typography-v1.js"),"utf8");
const checks=[
 ["16px floor",/size<16[\s\S]{0,180}font-size","16px","important"/],
 ["33px heading",/font-size:33px!important/],
 ["66px primary",/font-size:66px!important/],
 ["primary marker",/data-khaemenes-primary-title/],
 ["dataset marker",/khaemenesMiddleTypography="16-33-66"/]
];
const failed=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);
console.log(JSON.stringify({
  mode:WRITE?"write":"check",
  htmlFiles:files.length,
  loaderCovered:covered,
  changed,
  missing:files.length-covered,
  typographyAssertionFailures:failed,
  standard:{minimumReadableTextPx:16,ordinaryTitlePx:33,primaryHeroTitlePx:66}
},null,2));
if(files.length!==covered||failed.length)process.exitCode=1;
