(function(w){ "use strict";
function inspect(p,c){
 if(!p||p.format!=="khaemenes-middle-grade-export-v2"||p.grade!=="06"||!p.state||typeof p.state!=="object")throw Error("Invalid Grade 6 backup");
 if(!c||c.status!=="ready"||!c.learner||String(c.learner.grade).replace(/\D/g,"").padStart(2,"0")!=="06")throw Error("Select a Grade 6 learner");
 if(!p.learner||p.learner.learnerId!==c.learner.learnerId||String(p.learner.grade).replace(/\D/g,"").padStart(2,"0")!=="06"||p.recordAuthority!=="ready")throw Error("Learner identity mismatch");
 const scores=p.state.weekly;
 if(!scores||Array.isArray(scores)||typeof scores!=="object"||Object.entries(scores).some(([k,v])=>!(/^(?:[1-9]|[12][0-9]|3[0-6])$/.test(k))||!Number.isFinite(v)||v<0||v>100))throw Error("Invalid weekly records");
 if(["midterm","final"].some(k=>!Number.isFinite(p.state[k])||p.state[k]<0||p.state[k]>100)||typeof p.state.portfolio!=="boolean")throw Error("Invalid assessment records");
 return {id:c.learner.learnerId,weeks:Object.keys(scores).length,midterm:p.state.midterm,final:p.state.final};
}
function init(){
 const file=document.getElementById("grade6RecoveryFile"),btn=document.getElementById("grade6RecoveryReview"),out=document.getElementById("grade6RecoveryStatus");
 if(!file||!btn||!out)return;
 let pending=null;
 file.addEventListener("change",async()=>{pending=null;btn.disabled=true;const f=file.files?.[0];if(!f)return;
  if(f.size>2097152){out.textContent="Backup exceeds 2 MB";return}
  try{const p=JSON.parse(await f.text()),v=inspect(p,w.KhaemenesGradeContinuity?.status?.());pending={p,id:v.id};out.textContent="Matching Grade 6 backup: "+v.weeks+" weeks; midterm "+v.midterm+"%; final "+v.final+"%. For review only: cannot overwrite verified grades or graduation approval.";btn.disabled=false;}
  catch(e){out.textContent="Import blocked: "+e.message}
 });
 btn.addEventListener("click",()=>{
  if(!pending)return;
  try{const v=inspect(pending.p,w.KhaemenesGradeContinuity?.status?.());if(v.id!==pending.id)throw Error("Learner changed");
  if(!w.confirm("Stage matching backup for educator review? Verified records will remain unchanged."))return;
  const key="khaemenes.grade06.recovery.review:"+v.id,value=JSON.stringify({format:"grade06-recovery-review-v1",learnerId:v.id,backup:pending.p});
  w.localStorage.setItem(key,value);if(w.localStorage.getItem(key)!==value)throw Error("Storage verification failed");
  out.textContent="Backup staged for review. Verified records unchanged.";pending=null;btn.disabled=true;file.value="";}
  catch(e){out.textContent="Import blocked: "+e.message;pending=null;btn.disabled=true}
 });
}
w.KhaemenesGrade6Recovery=Object.freeze({inspect});
document.addEventListener("DOMContentLoaded",init);
})(window);