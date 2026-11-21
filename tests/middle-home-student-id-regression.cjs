const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const root=path.resolve(__dirname,"..");
const home=fs.readFileSync(path.join(root,"index.html"),"utf8");
const shim=fs.readFileSync(path.join(root,"assets/khaemenes-middle-resource-toolbar.js"),"utf8");

assert.match(home,/<p class="eyebrow middle-academy-eyebrow">Khaemenes Academy<\/p>/);
assert.match(home,/<h1 class="middle-school-title">Middle School<\/h1>/);
assert.doesNotMatch(home,/<p class="eyebrow">Verve N Veda Educational Network<\/p>/);
assert.match(home,/body \.hero \.middle-academy-eyebrow\{font:400 33px\/1\.3/);
assert.match(home,/body \.hero h1\.middle-school-title\{font:400 clamp\(44px,7vw,66px\)/);
assert.match(home,/body > #khaemenesFamilyBridge\{display:none!important\}/);
assert.match(home,/#vnvClassToolsToolbar\[data-vnv-class-tools-config="middle-school-home"\]/);
assert.match(home,/\.vct-grid>\[data-vct-action="student-id"\]\{grid-column:1\/-1!important/);
assert.match(home,/khaemenes-family-school-bridge\.js/,"Shared Academy bridge still owns learner identity");
assert.match(home,/assets\/khaemenes-middle-resource-toolbar\.js/,"Canonical Middle tools shim remains loaded");
assert.match(home,/vnv-ecosystem-toolbar\.js/,"Official VNV ecosystem dock remains intact");
assert.match(home,/id="middleContinue"/,"Continuation link retained");
assert.match(home,/id="middleEnrolledTools"/,"Student entry remains intact");
assert.match(home,/id="middlePinSchool"/,"Course pinning remains intact");
assert.match(home,/id="middleSaveSchool"/,"Save-to-device remains intact");

new vm.Script(shim,{filename:"assets/khaemenes-middle-resource-toolbar.js"});
assert.match(shim,/content\.innerHTML=bridge\.innerHTML/,"Student ID must reuse the Academy bridge view");
assert.match(shim,/window\.KhaemenesClassToolsConfigV1=\{/,"Use existing canonical VNV toolbar config");
assert.doesNotMatch(shim,/localStorage|sessionStorage|indexedDB/,"Student ID may not create separate storage");
assert.doesNotMatch(shim,/createElement\(["'](?:dialog|aside)["']\)/,"No duplicate floating card or toolbar");

async function configFor(pathname){
  const window={};
  const document={
    scripts:[],
    documentElement:{dataset:{}},
    getElementById:()=>null,
    createElement:()=>({
      dataset:{},events:{},
      addEventListener(name,fn){this.events[name]=fn;}
    }),
    head:{append(node){
      if(node.src.endsWith("vnv-class-tools-presets.js")){
        window.VNVSelectClassToolsPreset=()=>{
          const p={id:"middle-school",match:()=>/\/grades\/grade-(06|07|08)\//.test(pathname),tools:[
            {type:"help",label:"Instructions"},
            {type:"link",label:"Parent",href:"/family/"}
          ]};
          window.KhaemenesClassToolsConfigV1=p;return p;
        };
      }
      if(node.src.endsWith("vnv-class-tools-toolbar.js")){
        window.VNVClassToolsToolbar={mount:()=>true};
      }
      queueMicrotask(()=>node.events.load?.());
    }}
  };
  const context={window,document,location:{pathname},URL,console};
  vm.runInNewContext(shim,context,{filename:"assets/khaemenes-middle-resource-toolbar.js"});
  await new Promise(resolve=>setImmediate(resolve));
  return window.KhaemenesClassToolsConfigV1;
}
(async()=>{
  const homeConfig=await configFor("/Khaemenes_Middle.github.io/");
  assert.equal(homeConfig.id,"middle-school-home");
  assert.equal(homeConfig.match(),true);
  assert.equal(homeConfig.tools[0].label,"Student ID");
  assert.equal(homeConfig.tools[0].action,"student-id");
  assert.equal(typeof homeConfig.actions["student-id"],"function");
  assert.equal(homeConfig.tools[1].label,"Instructions","Retain original preset tools");
  const gradeConfig=await configFor("/Khaemenes_Middle.github.io/grades/grade-06/");
  assert.equal(gradeConfig.id,"middle-school");
  assert.equal(gradeConfig.tools.some(t=>t.label==="Student ID"),false,"No grade-page changes");
  console.log("PASS Middle hero hierarchy, bridge ownership, featured Student ID action, home-only scope");
})().catch(error=>{console.error(error);process.exitCode=1});
