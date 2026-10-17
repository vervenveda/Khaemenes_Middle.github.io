(function attachKhaemenesMiddleContinuationPublisher(global){
"use strict";
const VERSION="1.1.0",PASS=80;
const CONT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/assets/khaemenes-learning-continuation.js";
const REGISTRY_KEY="khaemenes_family_registry_v1",ACTIVE_KEY="khaemenes_active_learner_v1";
const CFG={
 "06":{title:"Sixth Grade",courseId:"middle-grade-06",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",transition:false},
 "07":{title:"Seventh Grade",courseId:"middle-grade-07",midterm:"evidence/midterm.html",final:"evidence/final-exam.html",transition:false},
 "08":{title:"Eighth Grade",courseId:"middle-grade-08",midterm:"evidence/midterm.html",final:"evidence/final-exam.html",transition:true}
};
const pad=n=>String(n).padStart(2,"0");
const readJSON=(key,fallback=null)=>{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}};
function grade(){const m=String(location.pathname||"").match(/grade-(0[6-8])/i);return m?m[1]:null}
function cfg(){const g=global.KHAEMENES_GRADE_CONTEXT?.grade||grade();return g&&CFG[g]?{...CFG[g],grade:g,base:`https://vervenveda.com/Khaemenes_Middle.github.io/grades/grade-${g}/`}:null}
function activeLearner(conf){
 const registry=readJSON(REGISTRY_KEY,null),id=readJSON(ACTIVE_KEY,null),learner=id&&registry?.learners?.[id]?registry.learners[id]:null;
 if(!learner)return null;
 const g=String(learner.grade||"").replace(/[^0-9]/g,"").padStart(2,"0"),stage=String(learner.stage||"").toLowerCase();
 return g===conf.grade&&stage==="middle"?learner:null;
}
function unwrap(value){return value&&typeof value==="object"&&value.format==="khaemenes-course-state-v1"&&value.state?value.state:value}
function context(conf){
 const CONT=global.KhaemenesGradeContinuity,apiStatus=CONT?.status?.();
 if(apiStatus?.status==="ready"&&apiStatus.learner?.learnerId)return {learner:apiStatus.learner,state:CONT.readState?.({weekly:{},midterm:0,final:0,portfolio:false,transition:false})||{}};
 const learner=activeLearner(conf);if(!learner)return null;
 const state=unwrap(readJSON(`khaemenes.course:${learner.learnerId}:${conf.courseId}`,null));
 return state?{learner,state}:null;
}
function score(state,n){
 const has=Object.prototype.hasOwnProperty.call(state?.weekly||{},String(n))||Object.prototype.hasOwnProperty.call(state?.weekly||{},n);
 if(!has)return null;
 const v=Number(state.weekly[n]);return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0;
}
function masteredThrough(state,n){for(let i=1;i<=n;i++){const s=score(state,i);if(s===null||s<PASS)return false}return true}
async function ensureContract(){
 if(global.KhaemenesLearningContinuation)return global.KhaemenesLearningContinuation;
 const existing=[...document.scripts].find(s=>s.src===CONT_URL);
 if(existing)return new Promise(resolve=>{existing.addEventListener("load",()=>resolve(global.KhaemenesLearningContinuation),{once:true});setTimeout(()=>resolve(global.KhaemenesLearningContinuation),1000)});
 return new Promise(resolve=>{const s=document.createElement("script");s.src=CONT_URL;s.async=false;s.onload=()=>resolve(global.KhaemenesLearningContinuation);s.onerror=()=>resolve(null);document.head.append(s)});
}
async function publish(){
 const conf=cfg();if(!conf)return false;
 const C=await ensureContract();if(!C?.publish)return false;
 const ctx=context(conf);if(!ctx?.learner?.learnerId)return false;
 const state=ctx.state||{},weeks=Array.from({length:36},(_,i)=>i+1),completed=weeks.filter(n=>(score(state,n)??0)>=PASS).length;
 const first=weeks.find(n=>(score(state,n)??-1)<PASS);
 let status="continue",nextLabel="Continue Learning",nextTitle="",nextHref="",summary="",best=null;
 let family={needsAction:false,label:"",summary:"",href:""};
 if(first&&first>18&&masteredThrough(state,18)&&Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=new URL(conf.midterm,conf.base).href;
   summary=best>0?`Midterm best score is ${best}%. Review evidence and retry to reach ${PASS}%.`:"Weeks 01–18 are mastered. The Midyear Assessment is the next formal step.";
 }else if(first){
   best=score(state,first);
   if(best===null){status="continue";nextLabel="Continue Learning";nextTitle=`Week ${pad(first)}`;nextHref=new URL(`weekly-plans/week-${pad(first)}.html`,conf.base).href;summary=`Week ${pad(first)} is the next integrated learning studio.`;}
   else{status="corrections";nextLabel="Review & Retry";nextTitle=`Week ${pad(first)} Mastery`;nextHref=new URL(`evidence/weekly-mastery-check.html?week=${pad(first)}`,conf.base).href;summary=`Week ${pad(first)} is at ${Math.round(best)}%. Review the evidence packet and retry to reach ${PASS}%.`;}
 }else if(Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=new URL(conf.midterm,conf.base).href;summary="Complete the Midyear Assessment at 80% or higher.";
 }else if(Number(state.final||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.final||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Final":"Open Final";nextTitle="Final Assessment";nextHref=new URL(conf.final,conf.base).href;summary="Complete the Final Assessment at 80% or higher.";
 }else if(!state.portfolio){
   status="mastery";nextLabel="Portfolio Review";nextTitle="Portfolio Evidence";nextHref=new URL("records/certificate.html",conf.base).href;summary="Academic score gates are complete. Adult portfolio approval remains before certification.";
   family={needsAction:true,label:"Portfolio review",summary:"Review the learner's portfolio evidence and confirm completion when the required work is present.",href:nextHref};
 }else if(conf.transition&&!state.transition){
   status="mastery";nextLabel="Transition Review";nextTitle="High School Transition Plan";nextHref=new URL("records/certificate.html",conf.base).href;summary="Grade 8 academic and portfolio requirements are complete. The high-school transition plan remains.";
   family={needsAction:true,label:"High school transition",summary:"Review the Grade 8 transition plan. This planning step does not itself change High School placement.",href:nextHref};
 }else{
   status="complete";nextLabel="Open Certificate";nextTitle=`${conf.title} Complete`;nextHref=new URL("records/certificate.html",conf.base).href;summary="All recorded completion gates are satisfied.";best=100;
 }
 try{
   C.publish({learnerId:ctx.learner.learnerId,courseId:conf.courseId,school:"Khaemenes Middle School",stage:"middle",grade:conf.title,subject:"Integrated Middle School Program",courseTitle:`Khaemenes ${conf.title}`,status,nextLabel,nextTitle,nextHref,summary,progress:{completed,total:36,percent:Math.round(completed/36*100)},mastery:{best,threshold:PASS,mastered:status==="complete"},family,source:`middle-${conf.courseId}-continuity`});
   return true;
 }catch{return false}
}
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>publish(),90)};
function boot(){
 publish();
 ["input","change","click"].forEach(t=>document.addEventListener(t,schedule,true));
 ["khaemenes-middle-grade-continuity-synced","khaemenes-family-changed"].forEach(t=>global.addEventListener(t,schedule));
 global.addEventListener("pageshow",schedule);global.addEventListener("storage",schedule);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesMiddleContinuationPublisher=Object.freeze({version:VERSION,publish});
})(window);