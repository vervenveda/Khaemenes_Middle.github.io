/*
 * Khaemenes Middle School Formal Assessment Engine v1.0.0
 * Verified randomized knowledge mastery + preserved performance evidence.
 */
(function attachMiddleAssessmentEngine(global){
"use strict";
const VERSION="1.0.0",PASS=80;
const REGISTRY_KEY="khaemenes_family_registry_v1",ACTIVE_KEY="khaemenes_active_learner_v1";
const ATTEMPT_PREFIX="khaemenes.middle.assessment.attempts";
const MENTOR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/mentor/";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{const encoded=JSON.stringify(v);localStorage.setItem(k,encoded);return localStorage.getItem(k)===encoded}catch{return false}};
const uid=()=>("msa-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10));

function grade(){const m=location.pathname.match(/\/grades\/grade-(0[6-8])\//i);return m?m[1]:null}
function kind(){if(/\/midterm\.html$/i.test(location.pathname))return"midterm";if(/\/final-exam\.html$/i.test(location.pathname))return"final";if(/\/week-\d+-assessment\.html$/i.test(location.pathname))return"weekly";return null}
function week(){const m=location.pathname.match(/\/week-(\d+)-assessment\.html$/i);return m?Math.max(1,Math.min(36,Number(m[1])||1)):null}
function learner(){
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null),l=id&&registry?.learners?.[id]?registry.learners[id]:null;
  if(!l)return null;
  const g=String(l.grade||"").replace(/[^0-9]/g,"").padStart(2,"0"),stage=String(l.stage||"").trim().toLowerCase();
  return stage==="middle"&&g===grade()?Object.assign({},l,{grade:g}):null;
}
function courseKey(){const l=learner();return l?.learnerId?("khaemenes.course:"+l.learnerId+":middle-grade-"+grade()):null}
function blank(){return{weekly:{},midterm:0,final:0,portfolio:false,transition:false,assessmentMeta:{}}}
function state(){
  const key=courseKey();if(!key)return blank();
  const raw=read(key,null);
  if(raw?.format==="khaemenes-course-state-v1"&&raw.state)return raw.state;
  return raw&&typeof raw==="object"?raw:blank();
}
function saveState(s){
  const key=courseKey(),l=learner();if(!key||!l)return false;
  return write(key,{format:"khaemenes-course-state-v1",learnerId:l.learnerId,courseId:"middle-grade-"+grade(),source:"middle-assessment-engine-v1",updatedAt:new Date().toISOString(),state:s});
}
function weekScore(s,n){const v=s?.weekly?.[n]??s?.weekly?.[String(n)]??0;return Math.max(0,Math.min(100,Number(v)||0))}
function completed(s,end){let n=0;for(let i=1;i<=end;i++)if(weekScore(s,i)>=PASS)n++;return n}
function bestScore(){const s=state();return kind()==="weekly"?weekScore(s,week()):Math.max(0,Math.min(100,Number(s?.[kind()]||0)))}
function gate(){
  const l=learner(),s=state(),k=kind(),w=week();
  if(!l)return{open:true,preview:true,reason:"Preview attempt. Select the matching Middle School learner to save verified mastery."};
  if(k==="weekly"){
    if(w===1)return{open:true,preview:false,reason:"Week 01 is open."};
    if(grade()==="06"&&w>=19&&Number(s.midterm||0)<PASS)return{open:false,preview:false,reason:"The verified Grade 6 midterm must reach 80% before Week 19 and later examinations open."};
    const prior=weekScore(s,w-1);
    return prior>=PASS?{open:true,preview:false,reason:"Week "+String(w-1).padStart(2,"0")+" is mastered at "+prior+"%."}:{open:false,preview:false,reason:"Week "+String(w-1).padStart(2,"0")+" must reach 80% before this assessment opens."};
  }
  if(k==="midterm"){
    const done=completed(s,18);
    return done===18?{open:true,preview:false,reason:"Weeks 01–18 are mastered."}:{open:false,preview:false,reason:(18-done)+" of the first 18 weekly mastery gates remain."};
  }
  if(k==="final"){
    const done=completed(s,36),mid=Number(s.midterm||0);
    if(done<36)return{open:false,preview:false,reason:(36-done)+" weekly mastery gate"+(36-done===1?"":"s")+" remain before the final."};
    if(mid<PASS)return{open:false,preview:false,reason:"The verified midterm must reach 80% before the final opens."};
    return{open:true,preview:false,reason:"All weekly mastery gates and the midterm are complete."};
  }
  return{open:false,preview:false,reason:"This page is not a formal Middle School assessment."};
}
function focus(){
  const map=global.KhaemenesMiddleFocusMap,g=grade(),w=week();
  if(w&&map?.[g]?.[String(w)])return map[g][String(w)];
  const label=g==="08"?"high school readiness":"cumulative middle school mastery";
  return "Grade "+Number(g||6)+" "+label;
}
function displayCount(){
  const g=Number(grade())||6,k=kind();
  if(k==="weekly")return g===6?18:g===7?20:22;
  if(k==="midterm")return g===6?36:g===7?40:44;
  return g===6?45:g===7?50:55;
}
function candidateCount(){return Math.max(displayCount()*2,kind()==="weekly"?45:90)}
function questions(seed){
  const f=global.KhaemenesMiddleQuestionFactory;if(!f)return[];
  // Grade 6 final: choose one mathematics question from each two-week block.
  // Alternate which week supplies the item across attempts for full 36-week bank coverage.
  if(grade()==="06"&&kind()==="final"){
    const math=[];
    const parity=Array.from(String(seed)).reduce((total,ch)=>total+ch.charCodeAt(0),0)%2;
    function poolFor(w){
      if(w<=6)return f.makeGrade6MathWeek?.({week:w,seed:seed+"|final|"+w,count:6})||[];
      switch(w){
        case 7:return f.makeGrade6CoordinateWeek?.({seed:seed+"|final|"+w})||[];
        case 8:return f.makeGrade6ExpressionsWeek?.({seed:seed+"|final|"+w})||[];
        case 9:return f.makeGrade6EquationsWeek?.({seed:seed+"|final|"+w})||[];
        case 10:return f.makeGrade6InequalitiesWeek?.({seed:seed+"|final|"+w})||[];
        case 11:return f.makeGrade6StatisticsWeek?.({seed:seed+"|final|"+w})||[];
        case 12:return f.makeGrade6GeometryWeek?.({seed:seed+"|final|"+w})||[];
        case 13:return f.makeGrade6VolumeWeek?.({seed:seed+"|final|"+w})||[];
        case 14:return f.makeGrade6MatterMathWeek?.({seed:seed+"|final|"+w})||[];
        case 15:return f.makeGrade6ThermalMathWeek?.({seed:seed+"|final|"+w})||[];
        case 16:return f.makeGrade6MotionMathWeek?.({seed:seed+"|final|"+w})||[];
        case 17:return f.makeGrade6PortfolioWeek?.({seed:seed+"|final|"+w})||[];
        case 18:return f.makeGrade6WaveMathWeek?.({seed:seed+"|final|"+w})||[];
        case 19:return f.makeGrade6VisualRatioWeek?.({seed:seed+"|final|"+w})||[];
        case 20:return f.makeGrade6CellPercentWeek?.({seed:seed+"|final|"+w})||[];
        case 21:return f.makeGrade6EcosystemFractionsWeek?.({seed:seed+"|final|"+w})||[];
        case 22:return f.makeGrade6EarthRationalWeek?.({seed:seed+"|final|"+w})||[];
        case 23:return f.makeGrade6WeatherCoordinatesWeek?.({seed:seed+"|final|"+w})||[];
        case 24:return f.makeGrade6RiverExpressionsWeek?.({seed:seed+"|final|"+w})||[];
        case 25:return f.makeGrade6CultureEquationsWeek?.({seed:seed+"|final|"+w})||[];
        case 26:return f.makeGrade6ClassicalGeometryWeek?.({seed:seed+"|final|"+w})||[];
        case 27:return f.makeGrade6TradeStatisticsWeek?.({seed:seed+"|final|"+w})||[];
        case 28:return f.makeGrade6LanguageRatioWeek?.({seed:seed+"|final|"+w})||[];
        case 29:return f.makeGrade6ResearchPercentWeek?.({seed:seed+"|final|"+w})||[];
        case 30:return f.makeGrade6DebateFractionWeek?.({seed:seed+"|final|"+w})||[];
        case 31:return f.makeGrade6ArtsRationalWeek?.({seed:seed+"|final|"+w})||[];
        case 32:return f.makeGrade6WellnessCoordinatesWeek?.({seed:seed+"|final|"+w})||[];
        case 33:return f.makeGrade6TechnologyExpressionsWeek?.({seed:seed+"|final|"+w})||[];
        case 34:return f.makeGrade6CapstoneEquationWeek?.({seed:seed+"|final|"+w})||[];
        case 35:return f.makeGrade6CapstoneGeometryWeek?.({seed:seed+"|final|"+w})||[];
        case 36:return f.makeGrade6ReadinessStatisticsWeek?.({seed:seed+"|final|"+w})||[];
        default:return[];
      }
    }
    for(let pair=0;pair<18;pair++){
      const w=pair*2+1+((pair+parity)%2),pool=poolFor(w);
      if(pool.length!==6)return[];
      math.push(pool[(pair+parity)%6]);
    }
    const others=f.makeBalanced({grade:6,focus:focus(),seed:seed+"|final|general",count:candidateCount()}).filter(q=>q.subject!=="mathematics").slice(0,27);
    return math.length===18&&others.length===27?math.concat(others):[];
  }
  // Grade 6 midterm: exactly one mathematics question from each of Weeks 1–18,
  // plus 18 questions from the non-mathematics strands.
  if(grade()==="06"&&kind()==="midterm"){
    const math=f.makeGrade6MidtermMath?.({seed:seed+"|math"})||[];
    const others=f.makeBalanced({grade:6,focus:focus(),seed:seed+"|general",count:candidateCount()}).filter(q=>q.subject!=="mathematics").slice(0,18);
    return math.length===18&&others.length===18?math.concat(others):[];
  }
  // Grade 6 Weeks 1–36 require a substantial aligned mathematics strand.
  if(grade()==="06"&&kind()==="weekly"&&week()>=1&&week()<=36){
    const math=week()===36?(f.makeGrade6ReadinessStatisticsWeek?.({seed:seed+"|math"})||[]):week()===35?(f.makeGrade6CapstoneGeometryWeek?.({seed:seed+"|math"})||[]):week()===34?(f.makeGrade6CapstoneEquationWeek?.({seed:seed+"|math"})||[]):week()===33?(f.makeGrade6TechnologyExpressionsWeek?.({seed:seed+"|math"})||[]):week()===32?(f.makeGrade6WellnessCoordinatesWeek?.({seed:seed+"|math"})||[]):week()===31?(f.makeGrade6ArtsRationalWeek?.({seed:seed+"|math"})||[]):week()===30?(f.makeGrade6DebateFractionWeek?.({seed:seed+"|math"})||[]):week()===29?(f.makeGrade6ResearchPercentWeek?.({seed:seed+"|math"})||[]):week()===28?(f.makeGrade6LanguageRatioWeek?.({seed:seed+"|math"})||[]):week()===27?(f.makeGrade6TradeStatisticsWeek?.({seed:seed+"|math"})||[]):week()===26?(f.makeGrade6ClassicalGeometryWeek?.({seed:seed+"|math"})||[]):week()===25?(f.makeGrade6CultureEquationsWeek?.({seed:seed+"|math"})||[]):week()===24?(f.makeGrade6RiverExpressionsWeek?.({seed:seed+"|math"})||[]):week()===23?(f.makeGrade6WeatherCoordinatesWeek?.({seed:seed+"|math"})||[]):week()===22?(f.makeGrade6EarthRationalWeek?.({seed:seed+"|math"})||[]):week()===21?(f.makeGrade6EcosystemFractionsWeek?.({seed:seed+"|math"})||[]):week()===20?(f.makeGrade6CellPercentWeek?.({seed:seed+"|math"})||[]):week()===19?(f.makeGrade6VisualRatioWeek?.({seed:seed+"|math"})||[]):week()===18?(f.makeGrade6WaveMathWeek?.({seed:seed+"|math"})||[]):week()===17?(f.makeGrade6PortfolioWeek?.({seed:seed+"|math"})||[]):week()===16?(f.makeGrade6MotionMathWeek?.({seed:seed+"|math"})||[]):week()===15?(f.makeGrade6ThermalMathWeek?.({seed:seed+"|math"})||[]):week()===14?(f.makeGrade6MatterMathWeek?.({seed:seed+"|math"})||[]):week()===13?(f.makeGrade6VolumeWeek?.({seed:seed+"|math"})||[]):week()===12?(f.makeGrade6GeometryWeek?.({seed:seed+"|math"})||[]):week()===11?(f.makeGrade6StatisticsWeek?.({seed:seed+"|math"})||[]):week()===10?(f.makeGrade6InequalitiesWeek?.({seed:seed+"|math"})||[]):week()===9?(f.makeGrade6EquationsWeek?.({seed:seed+"|math"})||[]):week()===8?(f.makeGrade6ExpressionsWeek?.({seed:seed+"|math"})||[]):week()===7?(f.makeGrade6CoordinateWeek?.({seed:seed+"|math"})||[]):(f.makeGrade6MathWeek?.({week:week(),seed:seed+"|math",count:6})||[]);
    const others=week()===1?(f.makeGrade6Week1Subjects?.({seed:seed+"|general"})||[]):week()===2?(f.makeGrade6Week2Subjects?.({seed:seed+"|general"})||[]):week()===3?(f.makeGrade6Week3Subjects?.({seed:seed+"|general"})||[]):week()===4?(f.makeGrade6Week4Subjects?.({seed:seed+"|general"})||[]):week()===5?(f.makeGrade6Week5Subjects?.({seed:seed+"|general"})||[]):week()===6?(f.makeGrade6Week6Subjects?.({seed:seed+"|general"})||[]):week()===7?(f.makeGrade6Week7Subjects?.({seed:seed+"|general"})||[]):week()===8?(f.makeGrade6Week8Subjects?.({seed:seed+"|general"})||[]):week()===9?(f.makeGrade6Week9Subjects?.({seed:seed+"|general"})||[]):week()===10?(f.makeGrade6Week10Subjects?.({seed:seed+"|general"})||[]):week()===11?(f.makeGrade6Week11Subjects?.({seed:seed+"|general"})||[]):week()===12?(f.makeGrade6Week12Subjects?.({seed:seed+"|general"})||[]):week()===13?(f.makeGrade6Week13Subjects?.({seed:seed+"|general"})||[]):week()===14?(f.makeGrade6Week14Subjects?.({seed:seed+"|general"})||[]):week()===15?(f.makeGrade6Week15Subjects?.({seed:seed+"|general"})||[]):week()===16?(f.makeGrade6Week16Subjects?.({seed:seed+"|general"})||[]):f.makeBalanced({grade:6,focus:focus(),seed:seed+"|general",count:candidateCount()}).filter(q=>q.subject!=="mathematics").slice(0,12);
    return math.length===6&&others.length===12?math.concat(others):[];
  }
  return f.makeBalanced({grade:Number(grade()),focus:focus(),seed,count:candidateCount()}).slice(0,displayCount());
}
function attemptsKey(){return ATTEMPT_PREFIX+":"+(learner()?.learnerId||"preview")+":grade-"+grade()}
function attempts(){const v=read(attemptsKey(),[]);return Array.isArray(v)?v:[]}
function append(snapshot){const list=attempts();list.push(snapshot);return write(attemptsKey(),list.slice(-220))}
function writeScore(snapshot){
  const l=learner();if(!l)return false;
  const s=state(),k=kind(),w=week();s.assessmentMeta||={};
  if(k==="weekly"){
    s.weekly||={};s.assessmentMeta.weekly||={};
    const prior=Number(s.weekly[w]||0),best=Math.max(prior,snapshot.score),meta=s.assessmentMeta.weekly[w]||{};
    s.weekly[w]=best;s.assessmentMeta.weekly[w]={attempts:Number(meta.attempts||0)+1,latestScore:snapshot.score,bestScore:best,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"middle-assessment-engine-v1",lastAttemptId:snapshot.id};
  }else{
    const prior=Number(s[k]||0),best=Math.max(prior,snapshot.score),meta=s.assessmentMeta[k]||{};
    s[k]=best;s.assessmentMeta[k]={attempts:Number(meta.attempts||0)+1,latestScore:snapshot.score,bestScore:best,mastered:best>=PASS,completedAt:snapshot.completedAt,verifiedBy:"middle-assessment-engine-v1",lastAttemptId:snapshot.id};
  }
  const ok=saveState(s);
  if(ok)global.dispatchEvent(new CustomEvent("khaemenes-middle-assessment-recorded",{detail:{learnerId:l.learnerId,grade:grade(),kind:k,week:w,score:snapshot.score,attemptId:snapshot.id}}));
  return ok;
}
function nextHref(){
  const w=week();
  if(kind()==="weekly"&&w<36)return"../weekly-plans/week-"+String(w+1).padStart(2,"0")+".html";
  if(kind()==="weekly"&&w===36)return"final-exam.html";
  if(kind()==="midterm")return"../index.html";
  if(kind()==="final")return"../records/certificate.html";
  return"../index.html";
}
function label(){return kind()==="weekly"?"Week "+String(week()).padStart(2,"0")+" Verified Knowledge Assessment":kind()==="midterm"?"Verified Midyear Knowledge Assessment":"Verified Final Knowledge Assessment"}
function style(){
  if(document.getElementById("middleAssessmentEngineStyle"))return;
  const s=document.createElement("style");s.id="middleAssessmentEngineStyle";
  s.textContent=".middle-assessment-engine{margin:20px auto;padding:20px;border:1px solid rgba(16,47,77,.2);border-radius:14px;background:linear-gradient(145deg,#fff,#f2f7fa);box-shadow:0 14px 34px rgba(16,47,77,.09)}.middle-assessment-engine h2{margin:0;color:#102f4d;font-family:Georgia,serif}.middle-assessment-badges{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}.middle-assessment-badge{padding:5px 8px;border-radius:999px;background:#e9f1f6;color:#315b76;font-size:.72rem;font-weight:800}.middle-assessment-q{margin:13px 0;padding:14px;border:1px solid rgba(16,47,77,.14);border-radius:10px;background:#fff}.middle-assessment-q legend{font-weight:800;color:#203b52;padding:0 5px}.middle-assessment-option{display:block;margin:7px 0;padding:7px;border-radius:7px}.middle-assessment-option:hover{background:#f5f8fa}.middle-assessment-feedback{margin-top:8px;padding:8px;border-radius:8px;background:#f5f7f8;font-size:.82rem}.middle-assessment-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.middle-assessment-actions button,.middle-assessment-actions a{min-height:42px;padding:9px 13px;border:1px solid rgba(16,47,77,.18);border-radius:8px;background:#fff;color:#102f4d;text-decoration:none;font:inherit;font-weight:800;cursor:pointer}.middle-assessment-actions .primary{background:#102f4d;color:#fff}.middle-assessment-result{margin-top:14px;padding:13px;border-radius:10px;background:#eef7f1;color:#28543a}.middle-assessment-result.review{background:#fff5df;color:#70541f}.middle-assessment-gate{padding:15px;border:1px solid #d8c27b;border-radius:10px;background:#fff8dd}.middle-performance-note{margin:18px 0 10px;padding:12px;border-left:4px solid #9a7932;background:#faf7ef;font-size:.88rem}@media print{.middle-assessment-actions{display:none!important}.middle-assessment-engine{box-shadow:none;background:#fff}}";
  document.head.appendChild(s);
}
function performanceAnchor(){
  return document.querySelector("#canonicalCumulativeMount")||document.querySelector("main .worksheet")||document.querySelector("main .shell");
}
function mount(){
  if(!kind()||document.getElementById("middleAssessmentEngine"))return;
  style();const anchor=performanceAnchor();if(!anchor)return;
  const root=document.createElement("section");root.id="middleAssessmentEngine";root.className="middle-assessment-engine";
  if(anchor.id==="canonicalCumulativeMount")anchor.insertAdjacentElement("beforebegin",root);
  else if(anchor.matches?.(".worksheet"))anchor.insertAdjacentElement("beforebegin",root);
  else anchor.prepend(root);
  renderStart(root);
  const note=document.createElement("div");note.className="middle-performance-note";note.innerHTML="<strong>Performance evidence remains part of this course.</strong> The existing teacher-reviewed rubric, written response, oral defense, lab, project, or portfolio evidence on this page is preserved below. It supplements the verified knowledge score; it does not overwrite it.";
  if(anchor.id==="canonicalCumulativeMount"||anchor.matches?.(".worksheet"))anchor.insertAdjacentElement("beforebegin",note);else root.insertAdjacentElement("afterend",note);
}
function renderStart(root){
  const access=gate(),prior=bestScore(),closed=kind()!=="weekly";
  root.innerHTML='<h2>'+esc(label())+'</h2><p><strong>Assessment record:</strong> '+(learner()?'Active learner ID: '+esc(learner().learnerId):'Preview only — no matching active learner')+'</p><div class="middle-assessment-badges"><span class="middle-assessment-badge">Grade '+esc(grade())+'</span><span class="middle-assessment-badge">'+(closed?"Closed-book":"Open-book")+'</span><span class="middle-assessment-badge">80% mastery</span><span class="middle-assessment-badge">'+displayCount()+' questions drawn from '+candidateCount()+'+ candidates</span><span class="middle-assessment-badge">New draw on retake</span></div><p>'+esc(access.reason)+'</p>'+(prior?'<p><strong>Best verified score:</strong> '+prior+'%</p>':'')+(access.open?'<div class="middle-assessment-actions"><button type="button" class="primary" data-start>Begin New Randomized Attempt</button></div><div data-body></div>':'<div class="middle-assessment-gate"><strong>Assessment locked.</strong><p>'+esc(access.reason)+'</p><a href="../index.html">Return to Grade Home</a></div>');
  root.querySelector("[data-start]")?.addEventListener("click",()=>begin(root.querySelector("[data-body]")));
}
function begin(body){
  const seed=Date.now()+"|"+Math.random()+"|"+location.pathname,qs=questions(seed);
  if(qs.length!==displayCount()){body.innerHTML="<p>The question pool did not produce a complete attempt. Refresh and try again.</p>";return}
  const attemptId=uid(),startedAt=new Date().toISOString(),startedLearnerId=learner()?.learnerId||null;
  body.innerHTML='<form data-middle-formal>'+qs.map((q,i)=>'<fieldset class="middle-assessment-q"><legend>'+(i+1)+'. '+esc(q.prompt)+'</legend>'+q.options.map((o,j)=>'<label class="middle-assessment-option"><input type="radio" name="msaq'+i+'" value="'+j+'"> '+esc(o)+'</label>').join("")+'<div class="middle-assessment-feedback" data-feedback="'+i+'" hidden></div></fieldset>').join("")+'<div class="middle-assessment-actions"><button type="submit" class="primary">Submit Verified Attempt</button><button type="button" data-restart>Discard & Draw New Attempt</button></div><div aria-live="polite" data-status></div></form>';
  body.querySelector("[data-restart]").onclick=()=>begin(body);
  body.querySelector("[data-middle-formal]").onsubmit=event=>{
    event.preventDefault();const form=event.currentTarget,status=form.querySelector("[data-status]"),responses=[];let correct=0,answered=0;
    if(form.dataset.submitted==="true"){status.textContent="This attempt has already been graded. Draw a fresh attempt to retry.";return}
    if((learner()?.learnerId||null)!==startedLearnerId){status.textContent="The active learner changed during this attempt. Discard it and begin a fresh attempt for the selected learner.";return}
    qs.forEach((q,i)=>{
      const chosen=form.querySelector('input[name="msaq'+i+'"]:checked'),selected=chosen?Number(chosen.value):null,ok=selected===q.answer;
      if(selected!==null)answered++;if(ok)correct++;
      responses.push({id:q.id,prompt:q.prompt,options:q.options,selected,answer:q.answer,correct:ok,subject:q.subject,skill:q.skill});
    });
    // Never reveal explanations or correct answers until the entire attempt is answered.
    if(answered<qs.length){status.textContent="Answer all "+qs.length+" questions before submitting.";return}
    // Revalidate progression immediately before writing a completed attempt.
    if(!gate().open){status.textContent="The progression gate is no longer open. Reload the assessment.";return}
    // Freeze this form before persistence, so repeated submit events cannot record the same draw twice.
    form.dataset.submitted="true";
    qs.forEach((q,i)=>{
      const fb=form.querySelector('[data-feedback="'+i+'"]');
      fb.hidden=false;fb.textContent=q.rationale||"Review this concept before the next attempt.";
    });
    const rawScore=Math.round(correct/qs.length*100),completedAt=new Date().toISOString(),l=learner();
    const aligned=grade()==="06"&&((kind()==="weekly"&&week()>=1&&week()<=36)||kind()==="midterm"||kind()==="final");
    const mathResponses=responses.filter(r=>r.subject==="mathematics");
    const mathCorrect=mathResponses.filter(r=>r.correct).length;
    const mathScore=mathResponses.length?Math.round(mathCorrect/mathResponses.length*100):0;
    // Aligned weekly and Grade 6 midterm mastery requires both 80% overall and 80% mathematics.
    // Preserve raw score for transparent reporting; cap the gate score only when math mastery is absent.
    const score=aligned&&mathScore<PASS?Math.min(rawScore,79):rawScore;
    const snapshot={schema:"khaemenes-middle-assessment-attempt-v1",id:attemptId,engineVersion:VERSION,factoryVersion:global.KhaemenesMiddleQuestionFactory?.version||null,learnerId:l?.learnerId||null,preview:!l,grade:grade(),kind:kind(),week:week(),page:location.pathname,seed,startedAt,completedAt,questionCount:qs.length,correct,rawScore,mathCorrect,mathQuestionCount:mathResponses.length,mathScore,score,masteryThreshold:PASS,mastered:score>=PASS&&!!l,responses};
    const stored=append(snapshot),formal=stored&&l?writeScore(snapshot):false;
    form.querySelectorAll("input,button").forEach(el=>el.disabled=true);
    const result=document.createElement("section");result.className="middle-assessment-result"+(score>=PASS&&(!l||formal)?"":" review");
    result.innerHTML="<strong>"+(score>=PASS&&l&&formal?"Verified mastery reached":!l?"Preview attempt completed":!formal?"Score not saved — retry required":"Review and retry")+"</strong><p>Overall: "+rawScore+"% · "+correct+"/"+qs.length+" correct. "+(aligned?"Mathematics: "+mathCorrect+"/"+mathResponses.length+" ("+mathScore+"%). Both strands require 80%. ":"")+(score!==rawScore?"Mastery not yet reached. ":"")+(!stored?"The attempt could not be saved. Do not treat this result as verified.":l?(formal?"This verified attempt was written to the learner’s formal course record.":"The attempt was preserved, but the formal score write failed."):"Preview mode: no formal learner record was changed.")+"</p><div class=\"middle-assessment-actions\"><button type=\"button\" data-new>Draw New Attempt</button><a href=\""+MENTOR_URL+"\">Review with Archaemenes</a>"+(score>=PASS&&l&&formal?'<a href="'+esc(nextHref())+'">Continue →</a>':"")+"</div>";
    form.appendChild(result);result.querySelector("[data-new]").onclick=()=>begin(body);result.scrollIntoView({behavior:"smooth",block:"center"});
  };
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
global.KhaemenesMiddleAssessmentEngine=Object.freeze({version:VERSION,masteryThreshold:PASS,grade,kind,week,learner,gate,attempts,bestScore,state,authority:Object.freeze({formalScoreWriter:true,attemptSnapshotsImmutable:true,manualScoreEntry:false,performanceEvidencePreserved:true})});
})(window);
