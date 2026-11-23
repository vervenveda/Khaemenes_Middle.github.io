/* Khaemenes Academy · Middle School Social Studies Engine v1.0.0
 * Architecture adapted from High School Social Studies historical inquiry systems.
 * Existing Grade 6–8 Social Studies week pages remain curriculum authority.
 * Practice/inquiry workspace only: no mastery, grade, placement, or assessment writes.
 */
(function(global){"use strict";
if(global.KhaemenesMiddleSocialStudiesEngine)return;
const VERSION="1.0.0";
const ROUTINE=Object.freeze(["Question","Source","Context","Corroborate","Map/Data","Claim","Counterclaim","Qualify"]);
const DAY_STAGES=Object.freeze([
 {day:1,key:"source",label:"Question & Source",prompt:"State the week’s historical or civic question, then identify what kind of source or evidence would help answer it."},
 {day:2,key:"context",label:"Context & Corroborate",prompt:"Place evidence in context, then compare it with another source, perspective, record, or account."},
 {day:3,key:"systems",label:"Map, Data & Systems",prompt:"Use geography, chronology, quantitative evidence, or a systems relationship to test an explanation."},
 {day:4,key:"argument",label:"Claim & Counterclaim",prompt:"Write a defensible claim, then challenge it with a serious alternative explanation or counterclaim."},
 {day:5,key:"qualify",label:"Defend, Qualify & Reflect",prompt:"Defend the strongest conclusion the evidence supports, name an uncertainty, and identify what additional evidence would improve confidence."}
]);
const path=String(global.location?.pathname||"");
const match=path.match(/\/grades\/grade-(0[6-8])\/subjects\/social-studies\/week-(\d{1,2})\.html$/i);
if(!match)return;
const GRADE=match[1],WEEK=Math.max(1,Math.min(36,Number(match[2])||1));
const ACTIVE_KEY="khaemenes_active_learner_v1";
function text(n){return String(n?.textContent||"").replace(/\s+/g," ").trim()}
function readJSON(k,f=null){try{const r=global.localStorage?.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function activeLearner(){
 const raw=readJSON(ACTIVE_KEY,null),id=typeof raw==="string"?raw:raw?.learnerId||null;
 if(!id)return null;
 const registry=readJSON("khaemenes_family_registry_v1",null),l=registry?.learners?.[id]||null;
 if(!l)return {learnerId:id,grade:null,stage:null};
 return {learnerId:id,grade:String(l.grade||"").replace(/\D/g,"").padStart(2,"0"),stage:String(l.stage||"").toLowerCase(),nickname:l.nickname||null};
}
function learnerReady(){const l=activeLearner();if(!l)return null;if(l.grade&&l.grade!==GRADE)return null;if(l.stage&&l.stage!=="middle")return null;return l}
function key(day){const l=learnerReady();return l?"khaemenes.middle.social-studies.engine:v1:"+l.learnerId+":grade-"+GRADE+":week-"+String(WEEK).padStart(2,"0")+":day-"+day:null}
function safeRead(k){try{return k?global.localStorage?.getItem(k)||"":""}catch{return ""}}
function safeWrite(k,v){if(!k)return false;try{global.localStorage?.setItem(k,String(v));return true}catch{return false}}
function download(name,data){const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function line(article,label){const p=[...article.querySelectorAll("p")].find(x=>text(x.querySelector("strong")).replace(/:$/,"").toLowerCase()===label.toLowerCase());return p?text(p).replace(new RegExp("^"+label+":?\\s*","i"),""):""}
function headingInfo(){const h=document.querySelector("main .heading"),ps=h?[...h.querySelectorAll("p")]:[];return {title:text(h?.querySelector("h1")),essentialQuestion:text(ps.find(p=>!p.classList.contains("kicker")))};
}
function mount(){
 if(document.body?.dataset.middleSocialStudiesEngineMounted==="true")return true;
 const host=document.querySelector("main .shell"),articles=[...document.querySelectorAll("main article.lesson")].slice(0,5);
 if(!host||articles.length!==5)return false;
 document.body.dataset.middleSocialStudiesEngine="middle-social-studies-v1";
 document.body.dataset.middleSocialStudiesEngineMounted="true";
 const info=headingInfo();
 const studio=document.createElement("section");
 studio.className="middle-ss-engine-studio";
 studio.setAttribute("aria-label","Social Studies inquiry routine");
 studio.innerHTML='<p class="middle-ss-engine-eyebrow">Social Studies Engine</p><h2>Question → Source → Context → Corroborate → Map/Data → Claim → Counterclaim → Qualify</h2><p>This inquiry engine organizes the existing Grade '+Number(GRADE)+' curriculum. It does not replace lesson content, weekly mastery assessments, or official learner records.</p><div class="middle-ss-engine-routine">'+ROUTINE.map((x,i)=>'<span><b>'+(i+1)+'</b>'+x+'</span>').join("")+'</div><div class="middle-ss-engine-actions"><button type="button" id="middleSSExport">Export Inquiry Evidence</button><a href="https://vervenveda.com/Arshif.github.io/">ARSHIF Archives</a><a href="https://vervenveda.com/theverifier.github.io/">The Verifier</a></div><p id="middleSSEngineStatus" role="status" aria-live="polite"></p>';
 document.querySelector("main .heading")?.insertAdjacentElement("afterend",studio);
 articles.forEach((article,i)=>{
   const stage=DAY_STAGES[i],focus=line(article,"Focus"),objective=line(article,"Objective"),activity=line(article,"Activity"),evidence=line(article,"Evidence");
   article.dataset.middleSocialStudiesStage=stage.key;article.classList.add("middle-ss-engine-day");
   const badge=document.createElement("div");badge.className="middle-ss-engine-stage";badge.textContent=stage.label;article.insertBefore(badge,article.firstChild);
   const workspace=document.createElement("section");workspace.className="middle-ss-engine-workspace";
   workspace.innerHTML='<h5>'+stage.label+' Inquiry Notebook</h5><p class="middle-ss-engine-prompt">'+stage.prompt+'</p><p class="middle-ss-engine-context">'+[focus&&("Focus: "+focus),objective&&("Objective: "+objective),activity&&("Application: "+activity),evidence&&("Evidence target: "+evidence)].filter(Boolean).join(" · ")+'</p><label for="middleSSDraft'+(i+1)+'">Your inquiry note</label><textarea id="middleSSDraft'+(i+1)+'" rows="5" placeholder="Use evidence, source context, geography/data, or qualified reasoning as appropriate."></textarea><p class="middle-ss-engine-save" id="middleSSSave'+(i+1)+'"></p>';
   article.append(workspace);
   const area=workspace.querySelector("textarea"),status=workspace.querySelector(".middle-ss-engine-save"),k=key(i+1),saved=safeRead(k);
   if(saved)area.value=saved;
   status.textContent=k?(saved?"Recovered learner-scoped inquiry note · Practice evidence only.":"Learner-scoped inquiry note ready · Practice evidence only."):"Preview mode · Select the matching Academy learner to save on this device.";
   area.addEventListener("input",()=>{const current=key(i+1);if(!current){status.textContent="Preview mode · Note is not being saved.";return}status.textContent=safeWrite(current,area.value)?"Saved on this device · Practice evidence only.":"Saving unavailable · Export your inquiry evidence before leaving.";});
 });
 document.getElementById("middleSSExport")?.addEventListener("click",()=>{
   const l=learnerReady(),days=articles.map((article,i)=>({day:i+1,stage:DAY_STAGES[i].key,label:DAY_STAGES[i].label,lessonTitle:text(article.querySelector("h4")),focus:line(article,"Focus"),inquiryNote:article.querySelector("textarea")?.value||""}));
   download("grade-"+GRADE+"-social-studies-week-"+String(WEEK).padStart(2,"0")+"-inquiry.json",{schema:"khaemenes-middle-social-studies-inquiry-v1",engineVersion:VERSION,learnerId:l?.learnerId||null,grade:GRADE,week:WEEK,title:info.title,essentialQuestion:info.essentialQuestion,routine:ROUTINE,days,guardrails:["Source usefulness depends on the question.","Simulation or model output is not historical proof by itself.","Correlation does not establish causation.","Claims must be proportional to evidence.","Uncertainty and missing voices must be named."],authoritative:false,affectsGrade:false,unlocksCurriculum:false,changesPlacement:false,exportedAt:new Date().toISOString()});
   const s=document.getElementById("middleSSEngineStatus");if(s)s.textContent="Inquiry export requested. This file is practice/portfolio evidence, not an official mastery record.";
 });
 document.dispatchEvent(new CustomEvent("khaemenes:middle-social-studies-engine-mounted",{detail:{version:VERSION,grade:GRADE,week:WEEK,days:articles.length,mastery:false,persistence:"learner-scoped-inquiry-notes",assessmentAuthority:false}}));
 return true;
}
global.KhaemenesMiddleSocialStudiesEngine=Object.freeze({version:VERSION,routine:ROUTINE,stages:DAY_STAGES,mount});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
