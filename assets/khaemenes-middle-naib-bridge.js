/* Khaemenes Middle · Academy NAIB Mentor Bridge · v1.0.0 */
(function attachKhaemenesMiddleNAIBBridge(global){
  "use strict";

  const VERSION="1.0.0";
  const EXPECTED_STAGE="middle";
  const ACADEMY_BASE="https://vervenveda.com/Khaemenes_Academy.github.io";
  const MASTERY_THRESHOLD=80;

  const clean=(value,max=160)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").trim().slice(0,max);
  const registry=()=>global.KhaemenesFamilyRegistry||null;
  const router=()=>global.KhaemenesNAIB||null;

  function ensureScript(src,marker){
    if(!global.document)return null;
    const selector=`script[data-khaemenes-${marker}],script[src="${src}"]`;
    const existing=global.document.querySelector(selector);
    if(existing)return existing;
    const script=global.document.createElement("script");
    script.src=src;
    script.async=false;
    script.setAttribute(`data-khaemenes-${marker}`,"1");
    (global.document.head||global.document.documentElement).appendChild(script);
    return script;
  }

  function ensureAcademyDependencies(){
    ensureScript(`${ACADEMY_BASE}/assets/khaemenes-family-registry.js`,"family-registry");
    ensureScript(`${ACADEMY_BASE}/assets/khaemenes-naib-mentor-router.js`,"naib-mentor-router");
  }

  function activeLearner(){return registry()?.getLearner?.()||null}

  function pageSubject(){
    const p=String(global.location?.pathname||"").toLowerCase();
    if(/language-arts|english|literature|writing|ela/.test(p))return"language-arts";
    if(/social-studies|history|civics|government/.test(p))return"social-studies";
    if(/mathemat|algebra|geometry|statistics/.test(p))return"mathematics";
    if(/science|biology|earth|physics|chemistry/.test(p))return"science";
    if(/technology|coding|computer|engineering|design/.test(p))return"technology-design";
    if(/world-language|spanish|french|german|linguistic/.test(p))return"world-languages";
    if(/arts-music|visual-art|music/.test(p))return"arts-music";
    if(/health|physical|sel|wellness/.test(p))return"health-pe-sel";
    if(/project|capstone|integrated/.test(p))return"integrated-projects";
    return"general";
  }

  function gradeFromPage(){
    const match=String(global.location?.pathname||"").match(/grade[-_/ ]?0?([678])/i);
    return match?String(match[1]).padStart(2,"0"):null;
  }

  function context(overrides={}){
    const learner=activeLearner();
    const grade=learner?.stage===EXPECTED_STAGE?learner.grade:(gradeFromPage()||null);
    return Object.freeze({
      stage:EXPECTED_STAGE,
      grade,
      learnerId:learner?.stage===EXPECTED_STAGE?learner.learnerId:null,
      ageBand:learner?.stage===EXPECTED_STAGE?learner.ageBand||"":"",
      interests:learner?.stage===EXPECTED_STAGE&&Array.isArray(learner.interests)?learner.interests:[],
      surface:clean(overrides.surface||global.location?.pathname||"middle-school",160),
      subject:clean(overrides.subject||pageSubject(),80),
      courseId:clean(overrides.courseId||"",100),
      intent:clean(overrides.intent||"academic-support",80)
    });
  }

  function assignment(overrides={}){
    const R=router();
    if(!R?.assignMentor)return Object.freeze({
      status:"router-unavailable",
      stage:EXPECTED_STAGE,
      mentor:null,
      masteryThresholdMinimum:MASTERY_THRESHOLD,
      authority:Object.freeze({awardsMastery:false,bypassesPrerequisites:false,revealsLockedAssessments:false})
    });
    return R.assignMentor(context(overrides));
  }

  function courseContext(courseId="",overrides={}){
    const c=context({...overrides,courseId});
    const a=assignment({...overrides,courseId});
    return Object.freeze({
      contract:"khaemenes.middle.naib-context",
      contractVersion:1,
      bridgeVersion:VERSION,
      stage:EXPECTED_STAGE,
      grade:c.grade,
      learnerId:c.learnerId,
      subject:c.subject,
      courseId:c.courseId||null,
      masteryThresholdMinimum:MASTERY_THRESHOLD,
      mentorAssignment:a,
      authority:Object.freeze({
        changesPlacement:false,
        changesIdentity:false,
        awardsMastery:false,
        silentlyChangesGrade:false,
        bypassesPrerequisites:false,
        revealsLockedAssessments:false,
        manufacturesUnlocks:false
      })
    });
  }

  function dispatchReady(){
    const detail={version:VERSION,context:context(),assignment:assignment(),masteryThresholdMinimum:MASTERY_THRESHOLD};
    global.dispatchEvent(new CustomEvent("khaemenes-middle-naib-ready",{detail}));
    return detail;
  }

  function waitForAcademy(attempt=0){
    if(registry()&&router()){dispatchReady();return}
    if(attempt<100){global.setTimeout(()=>waitForAcademy(attempt+1),50);return}
    dispatchReady();
  }

  ensureAcademyDependencies();
  global.addEventListener("khaemenes-family-changed",dispatchReady);
  global.addEventListener("khaemenes-naib-ready",dispatchReady);

  global.KhaemenesMiddleNAIBBridge=Object.freeze({
    version:VERSION,
    stage:EXPECTED_STAGE,
    masteryThresholdMinimum:MASTERY_THRESHOLD,
    ensureAcademyDependencies,
    activeLearner,
    pageSubject,
    gradeFromPage,
    context,
    assignment,
    courseContext,
    dispatchReady
  });

  waitForAcademy();
})(window);
