/* Khaemenes Grade 08 · Continuity Bridge v1.0.0 */
(function attachGrade8Continuity(global){
  "use strict";
  const LEGACY_KEY="khaemenes_grade8_high_school_readiness_36_aplusplus_v1";
  const RECORDS_KEY="khaemenes_grade8_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade8_active_learner_v1";
  const MIGRATION_KEY="khaemenes_grade8_legacy_migration_claim_v1";
  const PRESENTATION="academy-scholar";
  const FALLBACK_MENTOR=Object.freeze({id:"archaemenes",name:"Archaemenes",title:"Scholar of Khaemenes Academy",avatar:"🦉",presentationMode:PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"fallback",intro:"I am Archaemenes. We can examine the evidence, strengthen the argument, and prepare thoughtfully for the next level."});
  const clean=(v,m=120)=>String(v??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,m);
  const read=(k,f=null)=>{try{const r=global.localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}};
  const write=(k,v)=>{try{global.localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
  const remove=k=>{try{global.localStorage.removeItem(k);return true}catch{return false}};
  function registryLearner(){try{return global.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}}
  function normalizeGrade(value){const raw=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");return /(?:grade-?)?0?8\b/.test(raw)?"grade-08":"";}
  function learner(){
    const raw=registryLearner(); if(!raw)return null;
    if(clean(raw.stage,40).toLowerCase()!=="middle"||normalizeGrade(raw.grade||raw.gradeLevel)!=="grade-08")return null;
    const learnerId=clean(raw.learnerId); if(!learnerId)return null;
    return Object.freeze({learnerId,familyId:clean(raw.familyId)||null,nickname:clean(raw.nickname||raw.displayName||"Eighth Grade Scholar",80),stage:"middle",grade:"grade-08",ageBand:clean(raw.ageBand,40)||null,interests:Object.freeze(Array.isArray(raw.interests)?raw.interests.slice(0,16).map(v=>clean(v,80)).filter(Boolean):[]),familyManaged:true});
  }
  function resolveMentor(l=learner()){
    if(!l)return null; const router=global.KhaemenesNAIB||null;
    try{const d=router?.delegate?.({stage:"middle",grade:"grade-08",ageBand:l.ageBand||undefined,interests:[...l.interests],surface:"khaemenes-middle-grade08",intent:"high school readiness"})||null;if(d?.status==="delegated"&&d?.specialist?.id==="archaemenes")return Object.freeze({...d.specialist,id:"archaemenes",name:"Archaemenes",presentationMode:d.specialist.presentationMode||PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"NAIB",delegationId:d.delegationId||null});}catch{}
    try{const a=router?.assignMentor?.({stage:"middle",ageBand:l.ageBand||undefined,interests:[...l.interests],surface:"khaemenes-middle-grade08",intent:"academy mentor"})||null;if(a?.status==="assigned"&&a?.mentor?.id==="archaemenes")return Object.freeze({...a.mentor,id:"archaemenes",name:"Archaemenes",presentationMode:a.mentor.presentationMode||PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"NAIB"});}catch{}
    return FALLBACK_MENTOR;
  }
  function normalizeState(v={}){const s=v&&typeof v==="object"?v:{};const weekly={};for(let i=1;i<=36;i++){const n=Number(s.weekly?.[i]??s.weekly?.[String(i)]??0);if(Number.isFinite(n)&&n>0)weekly[i]=Math.max(0,Math.min(100,n));}return {student:clean(s.student||"Eighth Grade Scholar",80),weekly,midterm:Math.max(0,Math.min(100,Number(s.midterm||0))),final:Math.max(0,Math.min(100,Number(s.final||0))),portfolio:Boolean(s.portfolio),transition:Boolean(s.transition),learnerId:clean(s.learnerId)||null,linkedAt:s.linkedAt||null,updatedAt:s.updatedAt||null,recordVersion:"5.0"};}
  function allRecords(){const v=read(RECORDS_KEY,{});return v&&typeof v==="object"?v:{}}
  function migrateLegacyOnce(id){const r=allRecords();if(!id||r[id])return r;const legacy=read(LEGACY_KEY,null);if(!legacy)return r;const claim=read(MIGRATION_KEY,null);if(claim?.claimedBy&&claim.claimedBy!==id)return r;r[id]={...normalizeState(legacy),learnerId:id,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"one-time-non-destructive-copy",migratedAt:new Date().toISOString()}};write(RECORDS_KEY,r);write(MIGRATION_KEY,{claimedBy:id,claimedAt:new Date().toISOString(),source:LEGACY_KEY});return r;}
  function loadState(){const l=learner();if(!l)return normalizeState({});const r=migrateLegacyOnce(l.learnerId);const s=normalizeState(r[l.learnerId]||{});s.student=l.nickname;s.learnerId=l.learnerId;s.linkedAt=s.linkedAt||new Date().toISOString();r[l.learnerId]=s;write(RECORDS_KEY,r);write(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});return normalizeState(s);}
  function saveState(v){const l=learner();const s=normalizeState(v);if(!l)return s;s.student=l.nickname;s.learnerId=l.learnerId;s.updatedAt=new Date().toISOString();const r=allRecords();r[l.learnerId]=s;write(RECORDS_KEY,r);return normalizeState(s);}
  function clearActive(){const l=learner();if(!l)return false;const r=allRecords();delete r[l.learnerId];write(RECORDS_KEY,r);remove(ACTIVE_KEY);return true;}
  function summary(){const raw=registryLearner(),l=learner(),state=loadState();const vals=Object.values(state.weekly||{}).map(Number).filter(n=>Number.isFinite(n)&&n>0);const mastered=Object.values(state.weekly||{}).filter(n=>Number(n)>=80).length;const average=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;let next=1;for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}let reason="ok";if(!raw)reason="no-active-learner";else if(clean(raw.stage,40).toLowerCase()!=="middle")reason="stage-mismatch";else if(normalizeGrade(raw.grade||raw.gradeLevel)!=="grade-08")reason="grade-mismatch";return Object.freeze({connected:Boolean(global.KhaemenesFamilyRegistry),eligible:Boolean(l),reason,learner:l,mentor:l?resolveMentor(l):null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered===36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)&&Boolean(state.transition)});}
  function subscribe(fn){if(typeof fn!=="function")throw new TypeError("A listener function is required.");const emit=()=>fn(summary());const sh=e=>{if([RECORDS_KEY,LEGACY_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(e.key))emit()};global.addEventListener("storage",sh);global.addEventListener("khaemenes-family-changed",emit);global.addEventListener("khaemenes-naib-ready",emit);return()=>{global.removeEventListener("storage",sh);global.removeEventListener("khaemenes-family-changed",emit);global.removeEventListener("khaemenes-naib-ready",emit)}}
  global.KhaemenesGrade8Continuity=Object.freeze({version:"1.0.0",legacyKey:LEGACY_KEY,recordsKey:RECORDS_KEY,activeKey:ACTIVE_KEY,migrationKey:MIGRATION_KEY,presentationMode:PRESENTATION,getLearner:learner,getMentor:()=>resolveMentor(learner()),loadState,saveState,clearActive,getSummary:summary,normalizeGrade,subscribe});
})(window);
