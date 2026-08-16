/*
 * Khaemenes Grade 07 · Continuity Bridge v1.0.0
 * ------------------------------------------------
 * Academy Family Registry owns learner identity and formal grade placement.
 * NAIB handles intake/resource direction/delegation.
 * Khaemenes Academy provides Archaemenes as the institutional mentor.
 * Grade 07 owns its course records; adult-reviewed evidence determines mastery.
 */
(function attachGrade7Continuity(global){
  "use strict";

  const LEGACY_KEY="khaemenes_grade7_middle_school_36_aplusplus_v1";
  const RECORDS_KEY="khaemenes_grade7_records_by_learner_v1";
  const ACTIVE_KEY="khaemenes_grade7_active_learner_v1";
  const MIGRATION_KEY="khaemenes_grade7_legacy_migration_claim_v1";
  const PRESENTATION="academy-scholar";

  const FALLBACK_MENTOR=Object.freeze({
    id:"archaemenes",name:"Archaemenes",title:"Scholar of Khaemenes Academy",avatar:"🦉",
    presentationMode:PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"fallback",
    intro:"I am Archaemenes. We can examine the evidence, connect the ideas, and choose a thoughtful next step."
  });

  const clean=(value,max=120)=>String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
  function readJSON(key,fallback=null){try{const raw=global.localStorage.getItem(key);return raw?JSON.parse(raw):fallback}catch{return fallback}}
  function writeJSON(key,value){try{global.localStorage.setItem(key,JSON.stringify(value));return true}catch{return false}}
  function remove(key){try{global.localStorage.removeItem(key);return true}catch{return false}}
  function activeRegistryLearner(){try{return global.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}}

  function normalizeGrade(value){
    const raw=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    const match=raw.match(/(?:grade-?)?0?([7])\b/);
    return match?"grade-07":"";
  }

  function learner(){
    const raw=activeRegistryLearner();
    if(!raw)return null;
    const stage=clean(raw.stage,40).toLowerCase();
    const grade=normalizeGrade(raw.grade||raw.gradeLevel);
    if(stage!=="middle"||grade!=="grade-07")return null;
    const learnerId=clean(raw.learnerId,120);
    if(!learnerId)return null;
    return Object.freeze({
      learnerId,familyId:clean(raw.familyId,120)||null,
      nickname:clean(raw.nickname||raw.displayName||"Seventh Grade Scholar",80),
      stage:"middle",grade:"grade-07",ageBand:clean(raw.ageBand,40)||null,
      interests:Object.freeze(Array.isArray(raw.interests)?raw.interests.slice(0,16).map(v=>clean(v,80)).filter(Boolean):[]),
      familyManaged:true
    });
  }

  function resolveMentor(l=learner()){
    if(!l)return null;
    const router=global.KhaemenesNAIB||null;
    let delegated=null;
    try{delegated=router?.delegate?.({stage:"middle",grade:"grade-07",ageBand:l.ageBand||undefined,interests:[...l.interests],surface:"khaemenes-middle-grade07",intent:"academy learning"})||null}catch{}
    if(delegated?.status==="delegated"&&delegated?.specialist?.id==="archaemenes"){
      return Object.freeze({...delegated.specialist,id:"archaemenes",name:"Archaemenes",presentationMode:delegated.specialist.presentationMode||PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"NAIB",delegationId:delegated.delegationId||null});
    }
    try{
      const legacy=router?.assignMentor?.({stage:"middle",ageBand:l.ageBand||undefined,interests:[...l.interests],surface:"khaemenes-middle-grade07",intent:"academy mentor"})||null;
      if(legacy?.status==="assigned"&&legacy?.mentor?.id==="archaemenes")return Object.freeze({...legacy.mentor,id:"archaemenes",name:"Archaemenes",presentationMode:legacy.mentor.presentationMode||PRESENTATION,providedBy:"Khaemenes Academy",delegatedBy:"NAIB"});
    }catch{}
    return FALLBACK_MENTOR;
  }

  function normalizeState(value={}){
    const source=value&&typeof value==="object"?value:{};const weekly={};
    for(let i=1;i<=36;i++){const score=Number(source.weekly?.[i]??source.weekly?.[String(i)]??0);if(Number.isFinite(score)&&score>0)weekly[i]=Math.max(0,Math.min(100,score));}
    return {student:clean(source.student||"Seventh Grade Scholar",80),weekly,midterm:Math.max(0,Math.min(100,Number(source.midterm||0))),final:Math.max(0,Math.min(100,Number(source.final||0))),portfolio:Boolean(source.portfolio),learnerId:clean(source.learnerId,120)||null,linkedAt:source.linkedAt||null,updatedAt:source.updatedAt||null,recordVersion:"5.0"};
  }
  function allRecords(){const value=readJSON(RECORDS_KEY,{});return value&&typeof value==="object"?value:{}}
  function migrateLegacyOnce(id){
    const records=allRecords();if(!id||records[id])return records;const legacy=readJSON(LEGACY_KEY,null);if(!legacy)return records;
    const claim=readJSON(MIGRATION_KEY,null);if(claim?.claimedBy&&claim.claimedBy!==id)return records;
    records[id]={...normalizeState(legacy),learnerId:id,linkedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),migration:{source:LEGACY_KEY,mode:"one-time-non-destructive-copy",migratedAt:new Date().toISOString()}};
    writeJSON(RECORDS_KEY,records);writeJSON(MIGRATION_KEY,{claimedBy:id,claimedAt:new Date().toISOString(),source:LEGACY_KEY});return records;
  }
  function loadState(){
    const l=learner();if(!l)return normalizeState({});const records=migrateLegacyOnce(l.learnerId);const state=normalizeState(records[l.learnerId]||{});
    state.student=l.nickname;state.learnerId=l.learnerId;state.linkedAt=state.linkedAt||new Date().toISOString();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);writeJSON(ACTIVE_KEY,{learnerId:l.learnerId,nickname:l.nickname,activatedAt:new Date().toISOString()});return normalizeState(state);
  }
  function saveState(value){const l=learner();const state=normalizeState(value);if(!l)return state;state.student=l.nickname;state.learnerId=l.learnerId;state.updatedAt=new Date().toISOString();const records=allRecords();records[l.learnerId]=state;writeJSON(RECORDS_KEY,records);return normalizeState(state);}
  function clearActive(){const l=learner();if(!l)return false;const records=allRecords();delete records[l.learnerId];writeJSON(RECORDS_KEY,records);remove(ACTIVE_KEY);return true;}
  function summary(){
    const raw=activeRegistryLearner();const l=learner();const state=loadState();const scores=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);const mastered=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;const average=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
    let next=1;for(let i=1;i<=36;i++){if(Number(state.weekly?.[i]||0)<80){next=i;break}next=36}
    let reason="ok";if(!raw)reason="no-active-learner";else if(clean(raw.stage,40).toLowerCase()!=="middle")reason="stage-mismatch";else if(normalizeGrade(raw.grade||raw.gradeLevel)!=="grade-07")reason="grade-mismatch";
    return Object.freeze({connected:Boolean(global.KhaemenesFamilyRegistry),eligible:Boolean(l),reason,learner:l,mentor:l?resolveMentor(l):null,state,mastered,average,next,certificateReady:Boolean(l)&&mastered===36&&Number(state.midterm)>=80&&Number(state.final)>=80&&Boolean(state.portfolio)});
  }
  function subscribe(listener){
    if(typeof listener!=="function")throw new TypeError("A listener function is required.");const emit=()=>listener(summary());const storageHandler=event=>{if([RECORDS_KEY,LEGACY_KEY,"khaemenes_family_registry_v1","khaemenes_active_family_v1","khaemenes_active_learner_v1"].includes(event.key))emit();};
    global.addEventListener("storage",storageHandler);global.addEventListener("khaemenes-family-changed",emit);global.addEventListener("khaemenes-naib-ready",emit);
    return ()=>{global.removeEventListener("storage",storageHandler);global.removeEventListener("khaemenes-family-changed",emit);global.removeEventListener("khaemenes-naib-ready",emit)};
  }
  global.KhaemenesGrade7Continuity=Object.freeze({version:"1.0.0",legacyKey:LEGACY_KEY,recordsKey:RECORDS_KEY,activeKey:ACTIVE_KEY,migrationKey:MIGRATION_KEY,presentationMode:PRESENTATION,getLearner:learner,getMentor:()=>resolveMentor(learner()),loadState,saveState,clearActive,getSummary:summary,normalizeGrade,subscribe});
})(window);
