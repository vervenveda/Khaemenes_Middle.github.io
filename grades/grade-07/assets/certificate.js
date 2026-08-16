(() => {
  "use strict";
  const out=document.getElementById("out");
  const printButton=document.getElementById("printCertificate");
  const s=window.KhaemenesGrade7Continuity?.getSummary?.()||null;
  const state=s?.state||{};
  const name=String(s?.learner?.nickname||"Seventh Grade Scholar").replace(/[<>&]/g,"");
  const avg=s?.average||0;
  const done=s?.mastered||0;
  const ready=Boolean(s?.certificateReady);
  if(printButton){printButton.disabled=!ready;printButton.addEventListener("click",()=>{if(ready)window.print();});}
  if(!out)return;
  if(ready){
    out.innerHTML=`<section class="worksheet" style="text-align:center;border:12px double #c4852b"><p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p><h1 style="font-family:Georgia,serif;color:#0d2441;text-transform:none">Certificate of Seventh Grade Completion</h1><p>This certifies that</p><h2>${name}</h2><p>has completed the Khaemenes Academy Seventh Grade Middle School Subject-Based 36 Week A++ Curriculum.</p><p><strong>Weekly Average:</strong> ${avg}% · <strong>Verified Weeks at 80%+:</strong> ${done}/36 · <strong>Midterm:</strong> ${state.midterm||0}% · <strong>Final:</strong> ${state.final||0}%</p><p>The learner completed subject halls, A++ lesson blocks, printables, workshops, verified assessments, portfolio/capstone evidence, Grade 8 readiness work, and adult review.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px"><div class="primary-line">Adult Reviewer / Teacher</div><div class="primary-line">Date</div></div><p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · 2026</p></section>`;
  }else{
    const eligibility=s?.eligible?"The active learner is in Grade 07, but one or more completion gates remain pending.":"Select the Academy learner formally placed in Grade 07 before a certificate can be issued.";
    out.innerHTML=`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#0d2441;text-transform:none">Certificate Locked</h1><p>${eligibility}</p><p>This certificate requires 36/36 verified weekly mastery results at 80%+, midterm 80%+, final 80%+, and approved portfolio/capstone evidence.</p><p><strong>Weeks at 80%+:</strong> ${done}/36 · <strong>Weekly Average:</strong> ${avg}% · <strong>Midterm:</strong> ${state.midterm||0}% · <strong>Final:</strong> ${state.final||0}% · <strong>Portfolio:</strong> ${state.portfolio?"Approved":"Pending"}</p><a class="button" href="../index.html">Return to Portal</a></section>`;
  }
})();
