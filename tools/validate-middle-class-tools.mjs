import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const chromeFile=path.join(root,"assets","middle-school-global-chrome-v1.js");
const legacyFile=path.join(root,"assets","khaemenes-middle-resource-toolbar.js");
const chrome=fs.readFileSync(chromeFile,"utf8");
const legacy=fs.readFileSync(legacyFile,"utf8");

const must=[
  'vnv-class-tools-presets.js',
  'vnv-class-tools-toolbar.js',
  'VNVSelectClassToolsPreset?.("middle")',
  'function middleLearnerSurface()',
  'assessments?',
  'records?',
  'teacher-tools?',
  'printables?',
  'khaeMiddleResourceToolbar',
  'vnvClassToolsToolbar',
  'vnvEcosystemUtilityDock'
];
for(const needle of must){
  if(!chrome.includes(needle)){
    console.error("FAIL: Middle global chrome missing learner-toolbar contract:",needle);
    process.exit(1);
  }
}

if(!legacy.includes('retired-to-class-tools')||legacy.includes('LEARNING RESOURCES')){
  console.error("FAIL: legacy Middle resource toolbar is not a compatibility shim.");
  process.exit(1);
}

const gradeIndexes=["06","07","08"].map(g=>path.join(root,"grades",`grade-${g}`,"index.html"));
for(const file of gradeIndexes){
  const html=fs.readFileSync(file,"utf8");
  if(!html.includes("middle-school-global-chrome-v1.js")){
    console.error("FAIL: Middle grade landing missing shared chrome:",path.relative(root,file));
    process.exit(1);
  }
}

let htmlCount=0,directClassToolbar=0;
function walk(dir){
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    if(entry.name===".git"||entry.name==="node_modules")continue;
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()){walk(full);continue}
    if(!entry.name.endsWith(".html"))continue;
    htmlCount++;
    const html=fs.readFileSync(full,"utf8");
    if(/<script[^>]+vnv-class-tools-toolbar\.js/i.test(html))directClassToolbar++;
  }
}
walk(root);
if(directClassToolbar!==0){
  console.error("FAIL: Middle HTML should not directly embed the class toolbar. Direct embeds:",directClassToolbar);
  process.exit(1);
}

const protectedSamples=[
  "grades/grade-06/assessments/week-01-assessment.html",
  "grades/grade-07/records/certificate.html",
  "grades/grade-08/teacher-tools/index.html",
  "grades/grade-06/printables/week-01-packet.html"
].map(p=>path.join(root,p)).filter(fs.existsSync);

for(const file of protectedSamples){
  const rel=path.relative(root,file).replaceAll(path.sep,"/");
  const excluded=/(?:\/|^)(?:assessments?|records?|teacher-tools?|teacher|teachers|admin|printables?)(?:\/|$)/i.test("/Khaemenes_Middle.github.io/"+rel);
  if(!excluded){
    console.error("FAIL: protected Middle sample is not excluded:",rel);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  status:"PASS",
  htmlPages:htmlCount,
  gradeLandingCoverage:gradeIndexes.length,
  directClassToolbarEmbeds:directClassToolbar,
  protectedSamplesChecked:protectedSamples.length,
  legacyResourceToolbar:"retired-to-class-tools",
  learnerToolbarOwner:"assets/middle-school-global-chrome-v1.js"
},null,2));
