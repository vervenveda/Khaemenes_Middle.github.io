(function attachKhaemenesMiddleContinuationPublisher(global){
"use strict";
const VERSION="1.0.0",PASS=80;
const CFG={
 "06":{data:"KHAE_GRADE6_DATA",title:"Sixth Grade",courseId:"middle-grade-06",midterm:"assessments/midterm.html",final:"assessments/final-exam.html",transition:false},
 "07":{data:"KHAE_GRADE7_DATA",title:"Seventh Grade",courseId:"middle-grade-07",midterm:"evidence/midterm.html",final:"evidence/final-exam.html",transition:false},
 "08":{data:"KHAE_GRADE8_DATA",title:"Eighth Grade",courseId:"middle-grade-08",midterm:"evidence/midterm.html",final:"evidence/final-exam.html",transition:true}
};
const pad=n=>String(n).padStart(2,"0");
function cfg(){const g=global.KHAEMENES_GRADE_CONTEXT?.grade;return CFG[g]?{...CFG[g],grade:g}:null}
function score(state,n){
 const has=Object.prototype.hasOwnProperty.call(state?.weekly||{},String(n))||Object.prototype.hasOwnProperty.call(state?.weekly||{},n);
 if(!has)return null;
 const v=Number(state.weekly[n]);
 return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0;
}
function masteredThrough(state,n){for(let i=1;i<=n;i++){const s=score(state,i);if(s===null||s<PASS)return false}return true}
function publish(){
 const C=global.KhaemenesLearningContinuation,CONT=global.KhaemenesGradeContinuity,conf=cfg();
 if(!C?.publish||!CONT||!conf)return false;
 const ctx=CONT.status?.();
 if(ctx?.status!=="ready"||!ctx.learner?.learnerId)return false;
 const DATA=global[conf.data],state=CONT.readState?.({weekly:{},midterm:0,final:0,portfolio:false,transition:false})||{};
 const weeks=(DATA?.weeks||[]).map(w=>Number(w.week)).filter(Boolean);
 const total=weeks.length||36,completed=weeks.filter(n=>(score(state,n)??0)>=PASS).length;
 const first=weeks.find(n=>(score(state,n)??-1)<PASS);
 let status="continue",nextLabel="Continue Learning",nextTitle="",nextHref="",summary="",best=null;
 let family={needsAction:false,label:"",summary:"",href:""};

 if(first&&first>18&&masteredThrough(state,18)&&Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));
   status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=conf.midterm;
   summary=best>0?`Midterm best score is ${best}%. Review evidence and retry to reach ${PASS}%.`:"Weeks 01–18 are mastered. The Midyear Assessment is the next formal step.";
 }else if(first){
   best=score(state,first);
   if(best===null){
     status="continue";nextLabel="Continue Learning";nextTitle=`Week ${pad(first)}`;nextHref=`weekly-plans/week-${pad(first)}.html`;summary=`Week ${pad(first)} is the next integrated learning studio.`;
   }else{
     status="corrections";nextLabel="Review & Retry";nextTitle=`Week ${pad(first)} Mastery`;nextHref=`evidence/weekly-mastery-check.html?week=${pad(first)}`;summary=`Week ${pad(first)} is at ${Math.round(best)}%. Review the evidence packet and retry the mastery check to reach ${PASS}%.`;
   }
 }else if(Number(state.midterm||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.midterm||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Midterm":"Open Midterm";nextTitle="Midyear Assessment";nextHref=conf.midterm;summary="Complete the Midyear Assessment at 80% or higher.";
 }else if(Number(state.final||0)<PASS){
   best=Math.max(0,Math.min(100,Number(state.final||0)));status=best>0?"corrections":"assessment";nextLabel=best>0?"Review Final":"Open Final";nextTitle="Final Assessment";nextHref=conf.final;summary="Complete the Final Assessment at 80% or higher.";
 }else if(!state.portfolio){
   status="mastery";nextLabel="Portfolio Review";nextTitle="Portfolio Evidence";nextHref="records/certificate.html";summary="Academic score gates are complete. Adult portfolio approval remains before certification.";
   family={needsAction:true,label:"Portfolio review",summary:"Review the learner's portfolio evidence and confirm completion when the required work is present.",href:"records/certificate.html"};
 }else if(conf.transition&&!state.transition){
   status="mastery";nextLabel="Transition Review";nextTitle="High School Transition Plan";nextHref="records/certificate.html";summary="Grade 8 academic and portfolio requirements are complete. The high-school transition plan remains.";
   family={needsAction:true,label:"High school transition",summary:"Review the Grade 8 transition plan. This planning step does not itself change the learner's High School placement.",href:"records/certificate.html"};
 }else{
   status="complete";nextLabel="Open Certificate";nextTitle=`${conf.title} Complete`;nextHref="records/certificate.html";summary="All recorded completion gates are satisfied.";best=100;
 }
 try{
   C.publish({
     learnerId:ctx.learner.learnerId,courseId:conf.courseId,school:"Khaemenes Middle School",stage:"middle",grade:conf.title,
     subject:"Integrated Middle School Program",courseTitle:`Khaemenes ${conf.title}`,status,nextLabel,nextTitle,nextHref,summary,
     progress:{completed,total,percent:Math.round(completed/Math.max(1,total)*100)},
     mastery:{best,threshold:PASS,mastered:status==="complete"},
     family,source:`middle-${conf.courseId}-continuity`
   });
   return true;
 }catch{return false}
}
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(publish,80)};
function boot(){
 publish();
 ["input","change"].forEach(t=>document.addEventListener(t,schedule,true));
 ["khaemenes-middle-grade-continuity-synced","khaemenes-family-changed"].forEach(t=>global.addEventListener(t,schedule));
 global.addEventListener("pageshow",schedule);global.addEventListener("storage",schedule);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
global.KhaemenesMiddleContinuationPublisher=Object.freeze({version:VERSION,publish});
})(window);