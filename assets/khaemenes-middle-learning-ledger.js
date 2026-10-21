/*
 * Khaemenes Middle School Learning Ledger v1.0.0
 * Randomized formative lesson evidence for Grades 06–08.
 */
(function attachMiddleLearningLedger(global){
"use strict";
const VERSION="1.0.0";
const LEDGER_KEY="khaemenes_middle_learning_ledger_v1";
const REGISTRY_KEY="khaemenes_family_registry_v1";
const ACTIVE_KEY="khaemenes_active_learner_v1";
const MAX_RECORDS=900;
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=(k,f=null)=>{try{const raw=localStorage.getItem(k);return raw?JSON.parse(raw):f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const uid=()=>("msl-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9));

function grade(){const m=location.pathname.match(/\/grades\/grade-(0[6-8])\//i);return m?m[1]:null}
function week(){const m=location.pathname.match(/week-(\d{1,2})/i);return m?Math.max(1,Math.min(36,Number(m[1])||1)):null}
function subject(){
  const m=location.pathname.match(/\/subjects\/([^/]+)\//i);
  return m?(global.KhaemenesMiddleQuestionFactory?.normalizeSubject?.(decodeURIComponent(m[1]))||m[1]):"integrated-projects";
}
function learner(){
  const id=read(ACTIVE_KEY,null),registry=read(REGISTRY_KEY,null),l=id&&registry?.learners?.[id]?registry.learners[id]:null;
  if(!l)return null;
  const g=String(l.grade||"").replace(/[^0-9]/g,"").padStart(2,"0");
  return String(l.stage||"").trim().toLowerCase()==="middle"&&g===grade()?Object.assign({},l,{grade:g}):null;
}
function ownerId(){return learner()?.learnerId||"preview"}
function all(){const v=read(LEDGER_KEY,{});return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}
function records(){const a=all(),id=ownerId();return Array.isArray(a[id])?a[id]:[]}
function saveRecord(record){
  const a=all(),id=ownerId(),list=Array.isArray(a[id])?a[id]:[];
  list.push(record);a[id]=list.slice(-MAX_RECORDS);
  const ok=write(LEDGER_KEY,a);
  if(ok)global.dispatchEvent(new CustomEvent("khaemenes-middle-ledger-recorded",{detail:{learnerId:id,record}}));
  return ok;
}
function recent(days=7){const cutoff=Date.now()-Math.max(1,Number(days)||7)*86400000;return records().filter(r=>Date.parse(r.completedAt||"")>=cutoff)}
function focusFor(article){
  const p=[...article.querySelectorAll("p")].find(x=>/^\s*Focus:/i.test(x.textContent||""));
  if(p)return p.textContent.replace(/^\s*Focus:\s*/i,"").trim();
  return (document.querySelector(".heading h1")?.textContent||document.querySelector("h1")?.textContent||"").trim();
}
function dayFor(article,index){return (article.querySelector("h4")?.textContent||("Lesson "+(index+1))).split(":")[0].trim()}

function style(){
  if(document.getElementById("middleLearningLedgerStyle"))return;
  const s=document.createElement("style");s.id="middleLearningLedgerStyle";
  s.textContent=".middle-formative{margin-top:16px;padding:15px;border:1px solid rgba(18,50,78,.17);border-radius:12px;background:linear-gradient(145deg,#fff,#f3f7fa)}.middle-formative h5{margin:0;color:#102f4d;font:600 1rem Georgia,serif}.middle-formative p{margin:.4rem 0;color:#65717b;font-size:.86rem}.middle-formative button{min-height:40px;padding:8px 11px;border:1px solid rgba(16,47,77,.2);border-radius:8px;background:#fff;color:#102f4d;font:inherit;font-weight:700;cursor:pointer}.middle-formative .primary{background:#102f4d;color:#fff}.middle-check-grid{display:grid;gap:12px;margin-top:12px}.middle-check-q{padding:12px;border:1px solid rgba(16,47,77,.13);border-radius:10px;background:#fff}.middle-check-q strong{display:block;margin-bottom:8px}.middle-check-option{display:block;margin:6px 0;font-size:.88rem}.middle-check-feedback{margin-top:8px;padding:8px;border-radius:8px;background:#f5f7f8;font-size:.82rem}.middle-check-reflection{width:100%;min-height:84px;margin-top:8px;padding:9px;border:1px solid rgba(16,47,77,.18);border-radius:8px;font:inherit;resize:vertical}.middle-check-status{margin-top:9px;font-size:.82rem;font-weight:700;color:#315b76}.middle-week-review{margin:20px 0;padding:16px;border:1px solid rgba(16,47,77,.17);border-radius:12px;background:#f8fbfd}@media print{.middle-formative button,.middle-check-reflection,.middle-week-review button{display:none!important}}";
  document.head.appendChild(s);
}
function render(container,questions,ctx){
  container.innerHTML='<div class="middle-check-grid">'+questions.map((q,i)=>'<section class="middle-check-q"><strong>'+(i+1)+'. '+esc(q.prompt)+'</strong>'+q.options.map((o,j)=>'<label class="middle-check-option"><input type="radio" name="middle-check-'+ctx.key+'-'+i+'" value="'+j+'"> '+esc(o)+'</label>').join("")+'<div class="middle-check-feedback" data-feedback="'+i+'" hidden></div></section>').join("")+'<label><strong>Optional scholar reflection</strong><textarea class="middle-check-reflection" placeholder="What evidence or strategy was strongest? What still needs revision?"></textarea></label><div><button type="button" class="primary" data-save-check>Save Formative Evidence</button> <button type="button" data-new-check>Draw New Practice</button></div><div class="middle-check-status" aria-live="polite"></div></div>';
  const status=container.querySelector(".middle-check-status");
  container.querySelector("[data-new-check]").onclick=()=>start(container,ctx,questions.length);
  container.querySelector("[data-save-check]").onclick=()=>{
    let correct=0,answered=0;const responses=[];
    const selectedAll=questions.every((q,i)=>!!container.querySelector('input[name="middle-check-'+ctx.key+'-'+i+'"]:checked'));
    if(!selectedAll){status.textContent="Answer all checkpoint questions before checking explanations.";return;}
    if(container.dataset.saved==="true"){status.textContent="This practice attempt is already saved. Draw New Practice for another challenge.";return;}
    questions.forEach((q,i)=>{
      const chosen=container.querySelector('input[name="middle-check-'+ctx.key+'-'+i+'"]:checked'),selected=chosen?Number(chosen.value):null,ok=selected===q.answer,fb=container.querySelector('[data-feedback="'+i+'"]');
      if(selected!==null)answered++;if(ok)correct++;
      responses.push({id:q.id,subject:q.subject,skill:q.skill,selected,correct:ok});
      fb.hidden=false;fb.textContent=selected===null?"Not answered.":(ok?(q.rationale||"That reasoning fits."):(q.rationale||"Review the underlying concept and try a new example."));
    });
    if(answered<questions.length){status.textContent="Answer each checkpoint question before saving.";return}
    const score=Math.round(correct/questions.length*100),l=learner(),reflection=container.querySelector(".middle-check-reflection").value.trim();
    const record={schema:"khaemenes-middle-learning-ledger-record-v1",id:uid(),learnerId:l?.learnerId||null,preview:!l,grade:grade(),week:week(),subject:subject(),day:ctx.day,focus:ctx.focus,page:location.pathname,kind:ctx.kind||"lesson-formative-checkpoint",questionCount:questions.length,correct,score,responses,reflection:reflection.slice(0,1600),masteryAuthority:false,affectsGrade:false,unlocksCurriculum:false,changesPlacement:false,completedAt:new Date().toISOString()};
    const stored=saveRecord(record);
    if(stored){container.dataset.saved="true";container.querySelector("[data-save-check]").disabled=true;}
    status.textContent=stored?("Saved formative evidence: "+correct+"/"+questions.length+" ("+score+"%). Practice does not change formal mastery."):"This browser could not save the checkpoint.";
  };
}
function start(container,ctx,count){
  const f=global.KhaemenesMiddleQuestionFactory;
  if(!f){container.innerHTML="<p>Practice questions are still loading.</p>";return}
  const opts={grade:Number(grade()),focus:ctx.focus,seed:Date.now()+"|"+location.pathname+"|"+ctx.key,count};
  const qs=ctx.balanced?f.makeBalanced(opts):f.makePool(Object.assign(opts,{subject:subject()}));
  render(container,qs,ctx);
}
function enhance(article,index){
  if(article.dataset.middleLedgerEnhanced==="true")return;
  article.dataset.middleLedgerEnhanced="true";
  const focus=focusFor(article),day=dayFor(article,index),key=grade()+"-"+week()+"-"+subject()+"-"+(index+1);
  const box=document.createElement("section");box.className="middle-formative";
  box.innerHTML='<h5>Scholar Checkpoint · '+esc(day)+'</h5><p>Four randomized practice questions plus an optional reflection. This is formative evidence only; formal mastery comes from the verified assessment engine.</p><button type="button" class="primary">Start 4-Question Check</button><div data-middle-check-body></div>';
  article.appendChild(box);box.querySelector("button").onclick=()=>start(box.querySelector("[data-middle-check-body]"),{focus,day,key,kind:"lesson-formative-checkpoint",balanced:false},4);
}
function weeklyReview(){
  if(!/\/weekly-plans\/week-\d+\.html$/i.test(location.pathname)||document.getElementById("middleWeeklyFormativeReview"))return;
  const shell=document.querySelector("main .shell")||document.querySelector("main");if(!shell)return;
  const map=global.KhaemenesMiddleFocusMap,focus=map?.[grade()]?.[String(week())]||document.querySelector(".heading")?.textContent||"Middle School weekly review";
  const box=document.createElement("section");box.id="middleWeeklyFormativeReview";box.className="middle-week-review";
  box.innerHTML='<h3 style="margin-top:0;color:#102f4d">Integrated Weekly Review</h3><p>Six randomized questions across the Middle School domains. Use this before the formal weekly assessment; it records practice evidence only.</p><button type="button" class="primary">Start 6-Question Review</button><div data-middle-check-body></div>';
  shell.appendChild(box);box.querySelector("button").onclick=()=>start(box.querySelector("[data-middle-check-body]"),{focus,day:"Weekly Integrated Review",key:grade()+"-"+week()+"-weekly",kind:"weekly-formative-review",balanced:true},6);
}
function scan(){style();[...document.querySelectorAll(".lesson")].forEach(enhance);weeklyReview()}
let timer=0;function schedule(){clearTimeout(timer);timer=setTimeout(scan,60)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule,{once:true});else schedule();
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
global.addEventListener("khaemenes-family-changed",schedule);
global.KhaemenesMiddleLearningLedger=Object.freeze({version:VERSION,key:LEDGER_KEY,records,recent,saveRecord,refresh:schedule,authority:Object.freeze({awardsMastery:false,changesScore:false,unlocksCurriculum:false,changesPlacement:false})});
})(window);
