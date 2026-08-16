(() => {
  "use strict";
  const $=id=>document.getElementById(id);
  const clamp=value=>Math.max(0,Math.min(100,Number(value||0)));
  function continuity(){return window.KhaemenesGrade7Continuity||null;}
  function summary(){return continuity()?.getSummary?.()||null;}
  function fillWeeks(){const select=$("weekSelect");if(!select||select.options.length)return;for(let i=1;i<=36;i++){const option=document.createElement("option");option.value=String(i);option.textContent=`Week ${String(i).padStart(2,"0")}`;select.append(option);}}
  function render(){
    const s=summary(),state=s?.state||{},eligible=Boolean(s?.eligible);const learnerName=s?.learner?.nickname||"No active Grade 07 learner";const mentor=s?.mentor?.name||"Archaemenes";
    $("learnerTitle").textContent=learnerName;$("mentorTitle").textContent=`${mentor} · Khaemenes Academy Mentor · Academy Scholar`;
    $("statusText").textContent=eligible?"Grade 07 learner connected. Record only mastery evidence that has been reviewed.":"Select a Middle School learner formally placed in Grade 07 in the Academy Family Profile before recording mastery.";
    ["saveVerified","exportRecords","weeklyScore","midtermScore","finalScore","portfolio"].forEach(id=>{if($(id))$(id).disabled=!eligible;});
    const week=$("weekSelect").value||"1";$("weeklyScore").value=state.weekly?.[week]||"";$("midtermScore").value=state.midterm||"";$("finalScore").value=state.final||"";$("portfolio").checked=Boolean(state.portfolio);
    if($("masteryStatus"))$("masteryStatus").textContent=eligible?`${s.mastered||0}/36 verified weeks at 80%+ · Midterm ${state.midterm||0}% · Final ${state.final||0}% · Portfolio ${state.portfolio?"approved":"pending"}`:"Formal Grade 07 record unavailable until an eligible learner is selected.";
  }
  function save(){const s=summary();if(!s?.eligible)return;const state={...s.state,weekly:{...(s.state.weekly||{})}};state.weekly[$("weekSelect").value]=clamp($("weeklyScore").value);state.midterm=clamp($("midtermScore").value);state.final=clamp($("finalScore").value);state.portfolio=$("portfolio").checked;continuity().saveState(state);render();alert("Verified Grade 07 record saved for the active learner.");}
  function exportRecord(){const s=summary();if(!s?.eligible)return;const payload={version:1,kind:"khaemenes-grade07-verified-record",course:"Khaemenes Academy Seventh Grade",learner:{nickname:s.learner.nickname,grade:"grade-07",stage:"middle"},mentor:{name:"Archaemenes",presentationMode:"academy-scholar"},state:s.state,completion:{masteredWeeks:s.mastered,weeklyAverage:s.average,certificateReady:s.certificateReady},exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="khaemenes-grade07-verified-record.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  fillWeeks();$("weekSelect")?.addEventListener("change",render);$("saveVerified")?.addEventListener("click",save);$("exportRecords")?.addEventListener("click",exportRecord);window.addEventListener("khaemenes-family-changed",render);window.addEventListener("khaemenes-naib-ready",render);window.addEventListener("storage",render);render();
})();
