/*
 * Khaemenes Middle School Learning Context Bridge v1.0.0
 * Publishes a sanitized learner-scoped summary for Archaemenes.
 * Never publishes assessment prompts, options, selections, or answer keys.
 */
(function attachMiddleLearningContext(global){
"use strict";
const VERSION="1.0.0";
const CONTEXT_KEY="khaemenes_middle_mentor_context_v1";
const LEDGER_KEY="khaemenes_middle_learning_ledger_v1";
const ATTEMPT_PREFIX="khaemenes.middle.assessment.attempts";
const REGISTRY_KEY="khaemenes_family_registry_v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const PASS=80;
const read=(k,f=null)=>{try{const raw=global.localStorage?.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{global.localStorage?.setItem(k,JSON.stringify(v));return true}catch{return false}};

function routeGrade(){const m=String(global.location?.pathname||"").match(/\/grades\/grade-(0[6-8])\//i);return m?m[1]:null}
function routeWeek(){const m=String(global.location?.pathname||"").match(/week-(\d{1,2})/i);return m?Math.max(1,Math.min(36,Number(m[1])||1)):null}
function routeSubject(){
  const p=String(global.location?.pathname||"").toLowerCase(),m=p.match(/\/subjects\/([^/]+)\//i);
  if(m)return m[1];
  if(/mathemat/.test(p))return"mathematics";
  if(/science/.test(p))return"science";
  if(/language-arts|english|ela/.test(p))return"language-arts";
  if(/social-studies|history|civics/.test(p))return"social-studies";
  if(/world-language/.test(p))return"world-languages";
  if(/arts-music|visual-art|music/.test(p))return"arts-music";
  if(/health|physical|sel/.test(p))return"health-pe-sel";
  if(/technology|coding|computer|design/.test(p))return"technology-design";
  if(/project|research|capstone/.test(p))return"integrated-projects";
  return"general";
}
function registryLearner(){
  const direct=global.KhaemenesFamilyRegistry?.getLearner?.();
  if(direct)return direct;
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null);
  return id&&registry?.learners?.[id]?registry.learners[id]:null;
}
function learner(){
  const l=registryLearner();if(!l)return null;
  const grade=String(l.grade||"").replace(/[^0-9]/g,"").padStart(2,"0"),stage=String(l.stage||"").trim().toLowerCase(),pageGrade=routeGrade();
  if(stage!=="middle"||!["06","07","08"].includes(grade))return null;
  if(pageGrade&&pageGrade!==grade)return null;
  return Object.assign({},l,{grade});
}
function courseState(l=learner()){
  if(!l)return{};
  const raw=read("khaemenes.course:"+l.learnerId+":middle-grade-"+l.grade,null);
  if(raw?.format==="khaemenes-course-state-v1"&&raw.state)return raw.state||{};
  return raw&&typeof raw==="object"?raw:{};
}
function scoreFor(state,n){const v=state?.weekly?.[n]??state?.weekly?.[String(n)]??0;return Math.max(0,Math.min(100,Number(v)||0))}
function curriculumSummary(l=learner()){
  if(!l)return null;
  const state=courseState(l),scores=Array.from({length:36},(_,i)=>scoreFor(state,i+1)),attempted=scores.filter(v=>v>0);
  return{
    completedWeeks:scores.filter(v=>v>=PASS).length,
    totalWeeks:36,
    weeklyAverage:attempted.length?Math.round(attempted.reduce((a,b)=>a+b,0)/attempted.length):0,
    midterm:Math.max(0,Math.min(100,Number(state.midterm)||0)),
    final:Math.max(0,Math.min(100,Number(state.final)||0)),
    portfolio:Boolean(state.portfolio),
    transition:l.grade==="08"?Boolean(state.transition):null,
    masteryThreshold:PASS
  };
}
function recentLessons(l=learner(),days=7){
  if(!l)return[];
  const all=read(LEDGER_KEY,{}),list=Array.isArray(all?.[l.learnerId])?all[l.learnerId]:[],cutoff=Date.now()-Math.max(1,Number(days)||7)*86400000;
  return list.filter(x=>!x.preview&&x.learnerId===l.learnerId&&Date.parse(x.completedAt||"")>=cutoff).slice(-24).map(x=>({
    grade:x.grade,
    week:x.week,
    subject:x.subject,
    day:x.day,
    focus:String(x.focus||"").slice(0,180),
    score:Math.max(0,Math.min(100,Number(x.score)||0)),
    reflection:String(x.reflection||"").slice(0,260),
    completedAt:x.completedAt||null,
    masteryAuthority:false
  }));
}
function recentAssessments(l=learner(),days=30){
  if(!l)return[];
  const key=ATTEMPT_PREFIX+":"+l.learnerId+":grade-"+l.grade,list=read(key,[]),cutoff=Date.now()-Math.max(1,Number(days)||30)*86400000;
  return (Array.isArray(list)?list:[]).filter(x=>!x.preview&&x.learnerId===l.learnerId&&Date.parse(x.completedAt||"")>=cutoff).slice(-18).map(x=>({
    kind:x.kind,
    week:x.week,
    score:Math.max(0,Math.min(100,Number(x.score)||0)),
    mastered:Boolean(x.mastered),
    questionCount:Math.max(0,Number(x.questionCount)||0),
    reviewSkills:[...new Set((x.responses||[]).filter(r=>r.correct===false).map(r=>r.skill||r.subject).filter(Boolean).map(v=>String(v).slice(0,80)))].slice(0,6),
    completedAt:x.completedAt||null,
    verified:true
  }));
}
function developmentalMode(grade){
  return grade==="06"?"Independent middle-school learning coach":grade==="07"?"Strategic study & evidence coach":"High-school readiness coach";
}
function focusText(l){
  const week=routeWeek(),map=global.KhaemenesMiddleFocusMap;
  return String((week&&map?.[l.grade]?.[String(week)])||global.document?.querySelector?.(".heading")?.textContent||global.document?.querySelector?.("h1")?.textContent||"").replace(/\s+/g," ").trim().slice(0,600);
}
function build(){
  const l=learner();if(!l)return null;
  const lessonEvidence=recentLessons(l,7),assessmentEvidence=recentAssessments(l,30),curriculum=curriculumSummary(l);
  return{
    version:1,
    source:"Khaemenes Middle School",
    stage:"middle",
    learnerId:l.learnerId,
    nickname:l.nickname||null,
    grade:l.grade,
    mentorId:"archaemenes",
    mentorExpression:"Academy Mentor",
    developmentalMode:developmentalMode(l.grade),
    currentFocus:{week:routeWeek(),subject:routeSubject(),text:focusText(l)},
    // The exact released Mathematics lesson identity; no protected bank or key.
    currentLessonContext:l.grade==='07'&&routeWeek()===5&&routeSubject()==='mathematics'?
      {subject:'mathematics',courseId:'middle-grade-07-mathematics',
       lessonId:'week-05',week:5,title:'Operations with Rational Numbers',
       objective:'How do rational numbers extend what we can model and explain?',
       focus:'integer and rational-number operations'}:null,
    curriculum,
    recentLessonEvidence:lessonEvidence,
    recentAssessmentAttempts:assessmentEvidence,
    evidencePrivacy:{
      lessonPromptTextPublished:false,
      assessmentQuestionTextPublished:false,
      assessmentOptionsPublished:false,
      assessmentSelectionsPublished:false,
      assessmentAnswerKeysPublished:false,
      skillSummaryOnly:true
    },
    updatedAt:new Date().toISOString()
  };
}
function publish(){
  const context=build();
  if(!context)return null;
  write(CONTEXT_KEY,context);
  global.dispatchEvent(new CustomEvent("khaemenes-middle-context-updated",{detail:{learnerId:context.learnerId,grade:context.grade,updatedAt:context.updatedAt}}));
  return context;
}
/* Contextual, formative-only Vocabulary Studio entrance on Language Arts lesson pages. */
function installVocabularyEntrance(){
  const pathname=String(global.location?.pathname||"");
  const match=pathname.match(/\/grades\/grade-(0[6-8])\/subjects\/language-arts\/week-(\d{1,2})\.html$/i);
  if(!match||global.document?.getElementById("khaemenesVocabularyStudioEntrance"))return;
  const heading=global.document.querySelector("main .heading");
  if(!heading)return;
  const grade=String(Number(match[1])),week=String(Math.max(1,Math.min(36,Number(match[2]))));
  const wrap=global.document.createElement("p");
  wrap.id="khaemenesVocabularyStudioEntrance";
  const link=global.document.createElement("a");
  link.className="button";
  link.href="../../../../grades/vocabulary-studio/index.html?grade="+grade+"&week="+week;
  link.textContent="Practice this week's six vocabulary terms";
  link.setAttribute("aria-label","Open formative vocabulary practice for Grade "+grade+", Week "+week);
  wrap.append(link);
  heading.append(wrap);
}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",installVocabularyEntrance,{once:true});else installVocabularyEntrance();
let timer=0;function schedule(){clearTimeout(timer);timer=global.setTimeout(publish,70)}
if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
["pageshow","khaemenes-family-changed","khaemenes-middle-ledger-recorded","khaemenes-middle-assessment-recorded","khaemenes-middle-grade-continuity-synced"].forEach(e=>global.addEventListener(e,schedule));
global.addEventListener("storage",e=>{const k=String(e.key||"");if(k.startsWith("khaemenes"))schedule()});
global.KhaemenesMiddleLearningContext=Object.freeze({version:VERSION,key:CONTEXT_KEY,learner,courseState,curriculumSummary,recentLessons,recentAssessments,build,publish});
})(window);
