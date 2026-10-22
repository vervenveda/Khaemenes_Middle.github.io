import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const required=["index.html","grades/grade-06/index.html","grades/grade-07/index.html","grades/grade-08/index.html","grades/grade-06/subjects/mathematics/week-10.html","grades/grade-07/subjects/science/week-12.html","grades/grade-08/assessments/week-12-assessment.html","grades/grade-06/printables/week-10-packet.html"];
const canonical="https://vervenveda.com/assets/vnv-language.js";
let htmlCount=0,issues=[];
function walk(dir){for(const x of fs.readdirSync(dir,{withFileTypes:true})){if(x.isDirectory()){if(![".git","node_modules","vendor"].includes(x.name))walk(path.join(dir,x.name));}else if(x.isFile()&&/\.html?$/i.test(x.name)){htmlCount++;const p=path.relative(root,path.join(dir,x.name)),s=fs.readFileSync(path.join(dir,x.name),"utf8"),matches=[...s.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']*vnv-language\.js(?:[?#][^"']*)?)["'][^>]*>/gi)];if(matches.length!==1||matches[0][1]!==canonical)issues.push(p+" canonical script count/url "+matches.length);}}}
walk(root);
for(const p of required)if(!fs.existsSync(p))issues.push("missing representative page: "+p);
if(htmlCount<1300)issues.push("unexpected HTML count "+htmlCount);
const source=fs.readFileSync("scripts/rollout-official-page-translator.mjs","utf8");
for(const term of ["--apply","VNV_OFFICIAL_SITE_TRANSLATOR","vnv-language.js"])if(!source.includes(term))issues.push("rollout contract missing "+term);
if(issues.length){console.error(issues.slice(0,40).join("\n"));process.exitCode=1;}
else console.log("PASS canonical translator present exactly once across "+htmlCount+" Middle School HTML pages; representative routes exist.");
