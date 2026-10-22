import { chromium } from "playwright";

const failures=[];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const samples=["index.html","grades/grade-06/index.html","grades/grade-07/subjects/mathematics/week-10.html","grades/grade-08/assessments/week-12-assessment.html","grades/grade-06/printables/week-10-packet.html"];
for(const rel of samples){
 const page=await browser.newPage({viewport:{width:255,height:740}});
 try{
  await page.goto("http://127.0.0.1:8765/"+rel,{waitUntil:"domcontentloaded",timeout:25000});
  await page.waitForFunction(()=>!!window.VNVLanguage,{timeout:25000});
  const first=await page.evaluate(()=>({select:document.querySelectorAll("#vnv-language-select").length,langs:window.VNVLanguage.availableLanguages().length,initial:window.VNVLanguage.getLanguage()}));
  if(first.select!==1||first.langs!==13)failures.push(rel+" selector/count "+JSON.stringify(first));
  await page.evaluate(()=>window.VNVLanguage.setLanguage("ar"));
  const ar=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,selected:document.querySelector("#vnv-language-select")?.value,overflow:[...document.querySelectorAll("body *")].filter(el=>!el.closest(".drawer,#vnvEcosystemMenuDrawer")&&getComputedStyle(el).display!=="none"&&getComputedStyle(el).visibility!=="hidden").some(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+16||r.left< -16)})}));
  if(ar.lang!=="ar"||ar.dir!=="rtl"||ar.selected!=="ar")failures.push(rel+" Arabic control "+JSON.stringify(ar));
  if(ar.overflow){const offenders=await page.evaluate(()=>[...document.querySelectorAll("body *")].map(el=>({tag:el.tagName,cl:String(el.className||"").slice(0,70),id:el.id,rect:el.getBoundingClientRect(),scroll:el.scrollWidth})).filter(x=>x.rect.right>window.innerWidth+14||x.rect.left< -14).sort((a,b)=>b.rect.right-a.rect.right).slice(0,8).map(x=>({tag:x.tag,cl:x.cl,id:x.id,left:Math.round(x.rect.left),right:Math.round(x.rect.right),scroll:x.scroll})));console.log("OVERFLOW_DIAGNOSTIC",rel,JSON.stringify(offenders));failures.push(rel+" 255px horizontal overflow");}
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>!!window.VNVLanguage,{timeout:25000});
  const persisted=await page.evaluate(()=>({lang:window.VNVLanguage.getLanguage(),dir:document.documentElement.dir}));
  if(persisted.lang!=="ar"||persisted.dir!=="rtl")failures.push(rel+" language persistence "+JSON.stringify(persisted));
  // Mathematics, form values and semantic formula nodes must never be translated or replaced.
  const integrity=await page.evaluate(()=>{
    const input=document.createElement("input");input.value="Student response: x² + 3 = 12";input.setAttribute("data-student","1");
    const math=document.createElement("math");math.textContent="x² + 3 = 12";
    document.body.append(input,math);
    const original={input:input.value,math:math.textContent};
    window.VNVLanguage.setLanguage("ar");
    const after={input:input.value,math:math.textContent};
    input.remove();math.remove();
    return {original,after};
  });
  if(JSON.stringify(integrity.original)!==JSON.stringify(integrity.after))failures.push(rel+" student response/formula mutated");
  await page.evaluate(()=>window.VNVLanguage.setLanguage("en"));
  console.log("BROWSER_SAMPLE",rel,JSON.stringify({first,ar,persisted}));
 }catch(e){failures.push(rel+": "+e.message)}finally{await page.close();}
}
await browser.close();
if(failures.length){console.error("TRANSLATOR_BROWSER_FAILURES",JSON.stringify(failures));process.exitCode=1;}else console.log("TRANSLATOR_BROWSER_SMOKE_PASS",samples.length);
