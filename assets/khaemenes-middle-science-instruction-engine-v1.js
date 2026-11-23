/* Khaemenes Academy · Middle School Science Instruction Engine v1.0.0
 * Adapted from the High School Science 9 instruction-engine contract.
 * Existing Grade 6–8 Science week pages remain the curriculum authority.
 * Instructional staging only: no storage, mastery, grade, placement, assessment,
 * page chrome, translator, ticker, toolbar, or record ownership.
 */
(function(global){"use strict";
if(global.KhaemenesMiddleScienceInstructionEngine)return;
const VERSION="1.0.0";
const PATH=String(global.location?.pathname||"");
const MATCH=PATH.match(/\/grades\/grade-(0[6-8])\/subjects\/science\/week-(\d{1,2})\.html$/i);
if(!MATCH)return;
const GRADE=MATCH[1],WEEK=Math.max(1,Math.min(36,Number(MATCH[2])||1));
const DAY_STAGES=Object.freeze([
 {day:1,key:"prepare",label:"Observe & Prepare"},
 {day:2,key:"model",label:"Model & Explain"},
 {day:3,key:"investigate",label:"Investigate & Analyze"},
 {day:4,key:"revise",label:"Check & Revise"},
 {day:5,key:"transfer",label:"CER & Transfer"}
]);
const CONTRACT=Object.freeze({
 "focus":"prepare","objective":"prepare","vocabulary":"prepare","phenomenon":"prepare","safety":"prepare",
 "learn":"model","model":"model","worked-example":"model","concept":"model",
 "practice":"investigate","investigation":"investigate","data":"investigate","measurement":"investigate","engineering":"investigate",
 "evidence":"revise","misconception":"revise","formative-check":"revise","revision":"revise",
 "cer":"transfer","claim":"transfer","reasoning":"transfer","reflection":"transfer","portfolio":"transfer"
});
function text(node){return String(node?.textContent||"").replace(/\s+/g," ").trim()}
function line(article,label){
 const p=[...article.querySelectorAll("p")].find(x=>text(x.querySelector("strong")).replace(/:$/,"").toLowerCase()===label.toLowerCase());
 return p?text(p).replace(new RegExp("^"+label+":?\\s*","i"),""):"";
}
function inspectContract(scope=document){
 const articles=[...scope.querySelectorAll("main article.lesson")].slice(0,5);
 const found={
   fiveDaySequence:articles.length===5,
   focus:articles.every(a=>Boolean(line(a,"Focus"))),
   directInstruction:articles.some(a=>Boolean(line(a,"Learn")||line(a,"Objective"))),
   practiceEvidence:articles.some(a=>Boolean(line(a,"Practice and evidence")||line(a,"Evidence"))),
   modeling:/model/i.test(text(scope.querySelector("main"))),
   quantitative:/data|measure|calculate|graph|table|unit/i.test(text(scope.querySelector("main"))),
   reasoning:/claim|evidence|reasoning|CER|explain|defend|limitation/i.test(text(scope.querySelector("main")))
 };
 const missing=Object.entries(found).filter(([,ok])=>!ok).map(([k])=>k);
 return Object.freeze({version:VERSION,grade:GRADE,week:WEEK,found:Object.freeze(found),missing:Object.freeze(missing),complete:missing.length===0});
}
function mount(){
 if(document.body?.dataset.middleScienceEngineMounted==="true")return true;
 const host=document.querySelector("main .shell"),articles=[...document.querySelectorAll("main article.lesson")].slice(0,5);
 if(!host||articles.length!==5)return false;
 document.body.dataset.middleScienceEngine="middle-science-v1";
 document.body.dataset.middleScienceEngineMounted="true";
 articles.forEach((article,i)=>{
   const stage=DAY_STAGES[i];
   article.dataset.scienceStage=stage.key;
   article.dataset.middleScienceDay=String(stage.day);
   if(!article.querySelector(".middle-science-stage")){
     const badge=document.createElement("div");
     badge.className="middle-science-stage";
     badge.textContent=stage.label;
     article.insertBefore(badge,article.firstChild);
   }
 });
 const heading=document.querySelector("main .heading");
 if(heading&&!document.getElementById("middleScienceEngineContract")){
   const note=document.createElement("section");
   note.id="middleScienceEngineContract";
   note.className="middle-science-engine-contract";
   note.innerHTML='<p class="middle-science-engine-eyebrow">Science Instruction Engine</p><h2>Observe → Model → Investigate → Check → Explain</h2><p>The existing Grade '+Number(GRADE)+' Science curriculum remains authoritative. This engine organizes the five-day inquiry flow and exposes curriculum structure without changing mastery or learner records.</p>';
   heading.insertAdjacentElement("afterend",note);
 }
 const audit=inspectContract(document);
 document.dispatchEvent(new CustomEvent("khaemenes:middle-science-engine-mounted",{detail:{version:VERSION,grade:GRADE,week:WEEK,mastery:false,persistence:false,assessmentAuthority:false,chrome:false,storage:false,curriculum:audit}}));
 return true;
}
global.KhaemenesMiddleScienceInstructionEngine=Object.freeze({version:VERSION,mount,inspectContract,contract:CONTRACT,stages:DAY_STAGES});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})(window);
