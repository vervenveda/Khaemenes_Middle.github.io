(function attachKhaemenesGradeContinuity(global){
  "use strict";

  const VERSION="1.4.0";
  const cfg=global.KHAEMENES_GRADE_CONTEXT||{};
  const EXPECTED_GRADE=String(cfg.grade||"").padStart(2,"0");
  const EXPECTED_STAGE=cfg.stage||"middle";
  const COURSE_ID=cfg.courseId||`middle-grade-${EXPECTED_GRADE}`;
  const LEGACY_KEY=cfg.legacyKey||"";
  const MASTERY_THRESHOLD=80;

  const readJSON=(k,f=null)=>{try{const r=k&&global.localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}};
  const writeJSON=(k,v)=>{try{if(!k)return false;global.localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
  const registry=()=>global.KhaemenesFamilyRegistry||null;
  const learner=()=>registry()?.getLearner?.()||null;
  const ng=v=>registry()?.normalizeGrade?.(v)||String(v||"").replace(/[^0-9]/g,"").padStart(2,"0");
  const ns=v=>registry()?.normalizeStage?.(v)||String(v||"").trim().toLowerCase();

  function ensureBetaProgramLink(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-vnv-beta-link],script[src="https://vervenveda.com/assets/vnv-beta-link.js"],script[src="/assets/vnv-beta-link.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/assets/vnv-beta-link.js";
    script.defer=true;
    script.dataset.vnvBetaLink="middle";
    global.document.head.appendChild(script);
  }

  function ensureBreakaway(){
    if(!global.document)return;
    if(global.document.querySelector('script[data-khaemenes-breakaway],script[src="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-breakaway.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-breakaway.js";
    script.defer=true;
    script.dataset.khaemenesBreakaway="middle";
    global.document.head.appendChild(script);
  }

  function ensureNAIBBridge(){
    if(!global.document||global.KhaemenesMiddleNAIBBridge)return;
    if(global.document.querySelector('script[data-khaemenes-middle-naib],script[src="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-naib-bridge.js"]'))return;
    const script=global.document.createElement("script");
    script.src="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-naib-bridge.js";
    script.defer=true;
    script.dataset.khaemenesMiddleNaib="1";
    global.document.head.appendChild(script);
  }

  function authority(){
    return Object.freeze({
      changesPlacement:false,
      changesIdentity:false,
      awardsMastery:false,
      silentlyChangesGrade:false,
      bypassesPrerequisites:false,
      revealsLockedAssessments:false,
      manufacturesUnlocks:false
    });
  }

  function status(){
    const l=learner();
    if(!l)return Object.freeze({
      version:VERSION,status:"no-active-learner",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,learner:null,placementMatch:false,
      masteryThresholdMinimum:MASTERY_THRESHOLD,authority:authority()
    });
    const match=ng(l.grade)===EXPECTED_GRADE&&ns(l.stage)===EXPECTED_STAGE;
    return Object.freeze({
      version:VERSION,status:match?"ready":"placement-mismatch",grade:EXPECTED_GRADE,stage:EXPECTED_STAGE,placementMatch:match,
      learner:Object.freeze({learnerId:l.learnerId,nickname:l.nickname,grade:l.grade||null,stage:l.stage||null,studentId:l.studentId||l.institutionalId||null}),
      masteryThresholdMinimum:MASTERY_THRESHOLD,authority:authority()
    });
  }

  function scopedKey(){
    const l=learner();
    return l?.learnerId?`khaemenes.course:${l.learnerId}:${COURSE_ID}`:null;
  }

  function unwrap(v){
    return v&&typeof v==="object"&&v.format==="khaemenes-course-state-v1"&&v.state?v.state:v;
  }

  function readState(f=null){
    const s=status();
    const k=scopedKey();
    if(s.status==="ready"&&k){
      const scoped=unwrap(readJSON(k,null));
      if(scoped)return scoped;
      const legacy=readJSON(LEGACY_KEY,null);
      if(legacy){
        writeJSON(k,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source:"legacy-middle-grade-migration",updatedAt:new Date().toISOString(),state:legacy});
        return legacy;
      }
      return f;
    }
    if(s.status==="placement-mismatch")return f;
    return readJSON(LEGACY_KEY,f);
  }

  function writeState(state,source="middle-grade-runtime"){
    const s=status();
    const k=scopedKey();
    if(s.status==="placement-mismatch")return false;
    if(s.status==="no-active-learner")return writeJSON(LEGACY_KEY,state);
    if(s.status!=="ready"||!k)return false;
    const ok=writeJSON(k,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source,updatedAt:new Date().toISOString(),state});
    if(ok)global.dispatchEvent(new CustomEvent("khaemenes-middle-grade-continuity-synced",{detail:{learnerId:s.learner.learnerId,grade:EXPECTED_GRADE,courseKey:k}}));
    return ok;
  }

  function clearState(){
    const s=status();
    const k=scopedKey();
    if(s.status==="placement-mismatch")return false;
    if(s.status==="no-active-learner"){
      try{if(LEGACY_KEY)global.localStorage.removeItem(LEGACY_KEY);return true}catch{return false}
    }
    if(s.status==="ready"&&k){
      try{global.localStorage.removeItem(k);return true}catch{return false}
    }
    return false;
  }

  function mentorContext(){
    return global.KhaemenesMiddleNAIBBridge?.courseContext?.(COURSE_ID,{surface:global.location?.pathname||"middle-grade"})||Object.freeze({
      contract:"khaemenes.middle.naib-context",
      contractVersion:1,
      stage:EXPECTED_STAGE,
      grade:EXPECTED_GRADE,
      courseId:COURSE_ID,
      masteryThresholdMinimum:MASTERY_THRESHOLD,
      mentorAssignment:null,
      authority:authority()
    });
  }

  function activate(){
    ensureBetaProgramLink();
    ensureBreakaway();
    ensureNAIBBridge();
    const s=status();
    if(s.status==="ready"){
      const legacy=readJSON(LEGACY_KEY,null),k=scopedKey();
      if(k&&legacy!==null&&readJSON(k,null)===null){
        writeJSON(k,{format:"khaemenes-course-state-v1",learnerId:s.learner.learnerId,courseId:COURSE_ID,source:"legacy-middle-grade-migration",updatedAt:new Date().toISOString(),state:legacy});
      }
    }
    global.dispatchEvent(new CustomEvent("khaemenes-middle-grade-continuity-ready",{detail:{...s,mentorContext:mentorContext()}}));
    return s;
  }

  global.KhaemenesGradeContinuity=Object.freeze({
    version:VERSION,
    expectedGrade:EXPECTED_GRADE,
    expectedStage:EXPECTED_STAGE,
    courseId:COURSE_ID,
    masteryThresholdMinimum:MASTERY_THRESHOLD,
    status,
    scopedKey,
    readState,
    writeState,
    clearState,
    mentorContext,
    activate,
    ensureBetaProgramLink,
    ensureBreakaway,
    ensureNAIBBridge
  });
  const boot=()=>{ensureBetaProgramLink();ensureBreakaway();ensureNAIBBridge();};
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})(window);
