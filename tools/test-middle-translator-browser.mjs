import { chromium } from "playwright";
import path from "node:path";
const failures=[];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const samples=["index.html","grades/grade-06/index.html","grades/grade-07/subjects/mathematics/week-10.html","grades/grade-08/assessments/week-12-assessment.html","grades/grade-06/printables/week-10-packet.html"];
for(const rel of samples){
 const page=await browser.newPage({viewport:{width:255,height:740}});
 try{
  await page.goto("file://"+path.join(process.cwd(),rel),{waitUntil:"domcontentloaded",timeout:25000});
  await page.waitForFunction(()=>!!window.VNVLanguage,{timeout:25000});
  const first=await page.evaluate(()=>({select:document.querySelectorAll("#vnv-language-select").length,langs:window.VNVLanguage.availableLanguages().length,initial:window.VNVLanguage.getLanguage()}));
  if(first.select!==1||first.langs!==13)failures.push(rel+" selector/count "+JSON.stringify(first));
  await page.evaluate(()=>window.VNVLanguage.setLanguage("ar"));
  const ar=await page.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,selected:document.querySelector("#vnv-language-select")?.value,overflow:document.documentElement.scrollWidth>window.innerWidth+16}));
  if(ar.lang!=="ar"||ar.dir!=="rtl"||ar.selected!=="ar")failures.push(rel+" Arabic control "+JSON.stringify(ar));
  if(ar.overflow)failures.push(rel+" 255px horizontal overflow");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>!!window.VNVLanguage,{timeout:25000});
  const persisted=await page.evaluate(()=>({lang:window.VNVLanguage.getLanguage(),dir:document.documentElement.dir}));
  if(persisted.lang!=="ar"||persisted.dir!=="rtl")failures.push(rel+" language persistence "+JSON.stringify(persisted));
  await page.evaluate(()=>window.VNVLanguage.setLanguage("en"));
  console.log("BROWSER_SAMPLE",rel,JSON.stringify({first,ar,persisted}));
 }catch(e){failures.push(rel+": "+e.message)}finally{await page.close();}
}
await browser.close();
if(failures.length){console.error("TRANSLATOR_BROWSER_FAILURES",JSON.stringify(failures));process.exitCode=1;}else console.log("TRANSLATOR_BROWSER_SMOKE_PASS",samples.length);
