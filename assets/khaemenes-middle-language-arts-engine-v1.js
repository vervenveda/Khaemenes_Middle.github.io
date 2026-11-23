/* Khaemenes Academy · Middle School Language Arts Engine v1.0.0
 * Architecture adapted from the High School English evidence/daily-lesson system.
 * Curriculum authority remains the existing Grade 6–8 Language Arts week pages.
 * Practice/evidence workspace only: no mastery, grade, placement, or assessment writes.
 */
(function(global){"use strict";
if(global.KhaemenesMiddleLanguageArtsEngine)return;
const VERSION="1.0.0";
const ROUTINE=Object.freeze(["Read","Annotate","Analyze","Draft","Revise","Defend"]);
const DAY_STAGES=Object.freeze([
 {day:1,key:"prepare",label:"Read & Prepare",prompt:"Record the most important idea, vocabulary, or question from today’s reading and launch work."},
 {day:2,key:"analyze",label:"Annotate & Analyze",prompt:"Name one piece of evidence and explain what it shows, not merely what it says."},
 {day:3,key:"compose",label:"Draft & Apply",prompt:"Draft a response that applies this week’s language-arts skill to the text, source, or task."},
 {day:4,key:"revise",label:"Revise & Defend",prompt:"Revise one idea for precision, then explain why the revision is stronger."},
 {day:5,key:"reflect",label:"Publish & Reflect",prompt:"Identify the strongest evidence of your growth this week and the next skill you need to strengthen."}
]);
const path=String(global.location?.pathname||"");
const match=path.match(/\/grades\/grade-(0[6-8])\/subjects\/language-arts\/week-(\d{1,2})\.html$/i);
if(!match)return;
const GRADE=match[1],WEEK=Math.max(1,Math.min(36,Number(match[2])||1));
const ACTIVE_KEY="khaemenes_active_learner_v1";
function text(n){return String(n?.textContent||"").replace(/\s+/g," ").trim()}
function readJSON(k,f=null){try{const r=global.localStorage?.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function activeLearner(){
 const raw=readJSON(ACTIVE_KEY,null);
 const id=typeof raw==="string"?raw:raw?.learnerId||null;
 if(!id)return null;
 const registry=readJSON("khaemenes_family_registry_v1",null),l=registry?.learners?.[id]||null;
 if(!l)return {learnerId:id,grade:null,stage:null};
 const grade=String(l.grade||"").replace(/\D/g,"").padStart(2,"0");
 return {learnerId:id,grade,stage:String(l.stage||"").toLowerCase(),nickname:l.nickname||null};
}
function learnerReady(){
 const l=activeLearner();if(!l)return null;
 if(l.grade&&l.grade!==GRADE)return null;
 if(l.stage&&l.stage!=="middle")return null;
 return l;
}
function key(day){const l=learnerReady();return l?"khaemenes.middle.ela.engine:v1:"+l.learnerId+":grade-"+GRADE+":week-"+String(WEEK).padStart(2,"0")+":day-"+day:null}
function safeRead(k){try{return k?global.localStorage?.getItem(k)||"":""}catch{return ""}}
function safeWrite(k,v){if(!k)return false;try{global.localStorage?.setItem(k,String(v));return true}catch{return false}}
function download(name,data){const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function headingInfo(){
 const h=document.querySelector("main .heading");
 return {title:text(h?.querySelector("h1")),essentialQuestion:text([...h?.querySelectorAll("p")||[]].find(p=>!p.classList.contains("kicker")))};
}
function line(article,label){
 const aliases={
  "Focus":["Focus","Learning target"],
  "Objective":["Objective","Learning target"],
  "Activity":["Activity","Student practice"],
  "Evidence":["Evidence","Practice and evidence","Today’s portfolio evidence","Today's portfolio evidence"],
  "Worked example":["Worked example","Think-aloud example","Worked reading","Reading model","Model paraphrase","Worked note","Revision model","Worked correction","Worked caption","Claim audit","Self-check model"]
 };
 const wanted=(aliases[label]||[label]).map(x=>x.toLowerCase());
 const p=[...article.querySelectorAll("p")].find(x=>wanted.includes(text(x.querySelector("strong")).replace(/:$/,"").toLowerCase()));
 if(p){
   const strong=text(p.querySelector("strong")).replace(/:$/,"");
   return text(p).slice(strong.length).replace(/^:\s*/,"").trim();
 }
 if(label==="Activity"){
   const ol=article.querySelector(".ela-workshop ol, ol");
   return ol?text(ol):"";
 }
 if(label==="Worked example"){
   const worked=article.querySelector(".ela-worked");
   return worked?text(worked).replace(/^[^:]+:\s*/,""):"";
 }
 return "";
}
function mount(){
 if(document.body?.dataset.middleElaEngineMounted==="true")return true;
 const host=document.querySelector("main .shell"),articles=[...document.querySelectorAll("main article.lesson")].slice(0,5);
 if(!host||articles.length!==5)return false;
 document.body.dataset.middleElaEngine="middle-ela-v1";
 document.body.dataset.middleElaEngineMounted="true";
 const info=headingInfo();

 const studio=document.createElement("section");
 studio.className="middle-ela-engine-studio";
 studio.setAttribute("aria-label","Language Arts learning routine");
 studio.innerHTML='<p class="middle-ela-engine-eyebrow">Language Arts Engine</p><h2>Read → Annotate → Analyze → Draft → Revise → Defend</h2><p>This weekly studio organizes the existing Grade '+Number(GRADE)+' curriculum. It does not replace the lesson text, weekly mastery assessment, or official learner record.</p><div class="middle-ela-engine-routine">'+ROUTINE.map((x,i)=>'<span><b>'+(i+1)+'</b>'+x+'</span>').join("")+'</div><div class="middle-ela-engine-actions"><button type="button" id="middleElaExport">Export Weekly Evidence</button><a href="../../../../grades/vocabulary-studio/index.html?grade='+Number(GRADE)+'&week='+WEEK+'">Vocabulary Studio</a></div><p id="middleElaEngineStatus" role="status" aria-live="polite"></p>';
 const heading=document.querySelector("main .heading");heading?.insertAdjacentElement("afterend",studio);

 articles.forEach((article,i)=>{
   const stage=DAY_STAGES[i],focus=line(article,"Focus"),objective=line(article,"Objective"),activity=line(article,"Activity"),evidence=line(article,"Evidence");
   article.dataset.middleElaStage=stage.key;
   article.classList.add("middle-ela-engine-day");
   const badge=document.createElement("div");badge.className="middle-ela-engine-stage";badge.textContent=stage.label;article.insertBefore(badge,article.firstChild);
   const workspace=document.createElement("section");workspace.className="middle-ela-engine-workspace";
   workspace.innerHTML='<h5>'+stage.label+' Evidence Workspace</h5><p class="middle-ela-engine-prompt">'+stage.prompt+'</p><p class="middle-ela-engine-context">'+[focus&&("Focus: "+focus),objective&&("Objective: "+objective),activity&&("Application: "+activity),evidence&&("Evidence target: "+evidence)].filter(Boolean).join(" · ")+'</p><label for="middleElaDraft'+(i+1)+'">Your evidence note</label><textarea id="middleElaDraft'+(i+1)+'" rows="5" placeholder="Write in your own words. Include specific evidence when the task calls for it."></textarea><p class="middle-ela-engine-save" id="middleElaSave'+(i+1)+'"></p>';
   article.append(workspace);
   const area=workspace.querySelector("textarea"),status=workspace.querySelector(".middle-ela-engine-save"),k=key(i+1),saved=safeRead(k);
   if(saved)area.value=saved;
   if(!k){status.textContent="Preview mode · Select the matching Academy learner to save on this device."}
   else status.textContent=saved?"Recovered learner-scoped draft · Practice evidence only.":"Learner-scoped draft ready · Practice evidence only.";
   area.addEventListener("input",()=>{const current=key(i+1);if(!current){status.textContent="Preview mode · Draft is not being saved.";return}status.textContent=safeWrite(current,area.value)?"Saved on this device · Practice evidence only.":"Saving unavailable · Export your work before leaving.";});
 });
 document.getElementById("middleElaExport")?.addEventListener("click",()=>{
   const l=learnerReady(),days=articles.map((article,i)=>({day:i+1,stage:DAY_STAGES[i].key,label:DAY_STAGES[i].label,lessonTitle:text(article.querySelector("h4")),focus:line(article,"Focus"),evidenceNote:article.querySelector("textarea")?.value||""}));
   download("grade-"+GRADE+"-language-arts-week-"+String(WEEK).padStart(2,"0")+"-evidence.json",{schema:"khaemenes-middle-language-arts-evidence-v1",engineVersion:VERSION,learnerId:l?.learnerId||null,grade:GRADE,week:WEEK,title:info.title,essentialQuestion:info.essentialQuestion,routine:ROUTINE,days,authoritative:false,affectsGrade:false,unlocksCurriculum:false,changesPlacement:false,exportedAt:new Date().toISOString()});
   const s=document.getElementById("middleElaEngineStatus");if(s)s.textContent="Evidence export requested. This backup is practice/portfolio evidence, not an official mastery record.";
 });
 document.dispatchEvent(new CustomEvent("khaemenes:middle-language-arts-engine-mounted",{detail:{version:VERSION,grade:GRADE,week:WEEK,days:articles.length,mastery:false,persistence:"learner-scoped-drafts",assessmentAuthority:false}}));
 return true;
}
global.KhaemenesMiddleLanguageArtsEngine=Object.freeze({version:VERSION,routine:ROUTINE,stages:DAY_STAGES,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
