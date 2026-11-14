#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const WRITE=process.argv.includes("--write");
const TAG='  <script src="/Khaemenes_Middle.github.io/assets/middle-school-global-chrome-v1.js" defer data-middle-global-chrome="v1"></script>\n';
const LOADER=/middle-school-global-chrome-v1\.js/i;

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
let covered=0,changed=0;
for(const file of files){
  const abs=path.join(ROOT,file);
  let s=fs.readFileSync(abs,"utf8");
  if(LOADER.test(s)){covered++;continue}
  if(WRITE){
    s=inject(s);fs.writeFileSync(abs,s);covered++;changed++;
  }
}

const guard=fs.readFileSync(path.join(ROOT,"assets/middle-school-global-chrome-v1.js"),"utf8");
const checks=[
 ["333 ticker loader",/vnv-333-ticker\.js/],
 ["AutoPopulate ticker loader",/vnv-ticker-autopopulate\.js/],
 ["official header loader",/vnv-header-autopopulate\.js/],
 ["hamburger\/enriched menu authority",/VNV_HEADER/],
 ["official lower-right toolbar loader",/vnv-ecosystem-toolbar\.js/],
 ["official toolbar dock",/vnvEcosystemUtilityDock/],
 ["canonical stack marker",/khaemenesMiddleChrome="333-auto-header-menu-toolbar"/]
];
const failures=checks.filter(([,re])=>!re.test(guard)).map(([n])=>n);

console.log(JSON.stringify({
  mode:WRITE?"write":"check",
  htmlFiles:files.length,
  chromeCovered:covered,
  changed,
  missing:files.length-covered,
  chromeAssertionFailures:failures,
  canonicalStack:[
    "333 ticker",
    "AutoPopulate ticker",
    "official VNV header",
    "hamburger/enriched ecosystem menu",
    "official 3x2 lower-right ecosystem toolbar"
  ]
},null,2));

if(files.length!==covered||failures.length)process.exitCode=1;
