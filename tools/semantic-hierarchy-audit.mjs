#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT=process.cwd();
const INCLUDE_CORES=false;

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
const strip=s=>String(s||"").replace(/<[^>]*>/g," ").replace(/&nbsp;/gi," ").replace(/&amp;/gi,"&").replace(/&#39;|&apos;/gi,"'").replace(/&quot;/gi,'"').replace(/\s+/g," ").trim();
const words=s=>strip(s).split(/\s+/).filter(Boolean);
const brandLike=s=>/^(?:verve\s*n\s*veda|khaemenes academy)(?:\b|\s*[·|—-])/i.test(strip(s));
const titleLike=s=>{const t=strip(s),w=words(t);return !!t&&t.length<=100&&w.length>=1&&w.length<=10&&!/[.!?…]$/.test(t)};
const sentenceLike=s=>{const t=strip(s),w=words(t);return /[.!?…]$/.test(t)||w.length>=9||(w.length>=6&&/[,;:]/.test(t))};

const files=walk(ROOT).filter(f=>/\.html?$/i.test(f)||(INCLUDE_CORES&&/(^|\/)index-core\.txt$/i.test(f))).sort();
const re=/<(?:p|span|div)\b[^>]*class=["'][^"']*(?:eyebrow|kicker)[^"']*["'][^>]*>([\s\S]*?)<\/(?:p|span|div)>\s*<h([1-6])\b[^>]*>([\s\S]*?)<\/h\2>/gi;
let pairs=0,reversed=0,brandReview=0,correct=0;
const samples=[];
for(const file of files){
  const s=fs.readFileSync(path.join(ROOT,file),"utf8");
  let m;
  while((m=re.exec(s))){
    pairs++;
    const eyebrow=strip(m[1]),heading=strip(m[3]);
    if(sentenceLike(heading)&&titleLike(eyebrow)){
      if(brandLike(eyebrow)){
        brandReview++;
        if(samples.length<25)samples.push({type:"review",file,eyebrow,heading});
      }else{
        reversed++;
        if(samples.length<25)samples.push({type:"auto-repair",file,eyebrow,heading});
      }
    }else correct++;
  }
}
const guards=walk(path.join(ROOT,"assets")).filter(f=>/global|chrome|standard/i.test(f)&&/\.js$/i.test(f));
let authorityPresent=false;
for(const rel of guards){
  const p=path.join(ROOT,"assets",rel);
  if(fs.readFileSync(p,"utf8").includes('khaemenesHierarchy="title-description-v1"'))authorityPresent=true;
}
console.log(JSON.stringify({
  scannedFiles:files.length,
  eyebrowHeadingPairs:pairs,
  clearReversedPairs:reversed,
  ambiguousBrandPairs:brandReview,
  alreadyTitleLikePairs:correct,
  runtimeSemanticAuthority:authorityPresent,
  rule:"eyebrow = category/brand; title = heading; description = paragraph",
  samples
},null,2));
if(!authorityPresent)process.exitCode=1;
