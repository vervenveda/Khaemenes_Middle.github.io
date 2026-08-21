(() => {
  "use strict";
  const CONT=window.KhaemenesGradeContinuity;
  const context=CONT?.status?.()||{status:"no-active-learner",learner:null};
  let state={};
  try{state=CONT?.readState?.({})||{};}catch{}

  const vals=Object.values(state.weekly||{}).map(Number).filter(v=>Number.isFinite(v)&&v>0);
  const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
  const done=Object.values(state.weekly||{}).filter(v=>Number(v)>=80).length;
  const placementOK=context.status!=="placement-mismatch";
  const gatesOK=done===36&&vals.length===36&&avg>=80&&Number(state.midterm||0)>=80&&Number(state.final||0)>=80&&!!state.portfolio&&!!state.transition;
  const ok=placementOK&&gatesOK;
  const rawName=context.status==="ready"?context.learner.nickname:(state.student||"Eighth Grade Scholar");
  const name=String(rawName).replace(/[<>&]/g,"");
  const studentId=context.status==="ready"&&context.learner.studentId?String(context.learner.studentId).replace(/[<>&]/g,""):"";
  const identityLine=studentId?`<p><strong>Student ID:</strong> ${studentId}</p>`:context.status==="no-active-learner"?`<p class="no-print"><strong>Local legacy record:</strong> enroll/select the learner in the Academy Student Portal to bind this certificate to a permanent learner identity.</p>`:"";

  const out=document.getElementById("out");
  if(context.status==="placement-mismatch"){
    out.innerHTML=`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#0b223f;text-transform:none">Certificate Locked</h1><p>The active Academy learner is not registered in Grade 08. This page never changes placement and will not issue another learner's certificate.</p><a class="button" href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Open Student Portal</a></section>`;
    return;
  }

  out.innerHTML=ok?`<section class="worksheet" style="text-align:center;border:12px double #c17e27"><p style="letter-spacing:.16em;text-transform:uppercase">Khaemenes Academy</p><h1 style="font-family:Georgia,serif;color:#0b223f;text-transform:none">Certificate of Eighth Grade Completion</h1><p>This certifies that</p><h2>${name}</h2>${identityLine}<p>has completed the Khaemenes Academy Eighth Grade Middle School A++ High School Readiness Curriculum.</p><p><strong>Weekly Average:</strong> ${avg}% · <strong>Weeks at 80%+:</strong> ${done}/36 · <strong>Midterm:</strong> ${state.midterm}% · <strong>Final:</strong> ${state.final}%</p><p>The learner completed subject halls, A++ lesson blocks, printables, workshops, assessments, portfolio evidence, high school transition planning, and adult mentor review.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:50px;margin-top:70px"><div class="primary-line">Adult Mentor / Teacher</div><div class="primary-line">Date</div></div><p style="margin-top:50px">Jennifer Kay Pearl · Khaemenes Academy · 2026</p><button class="button no-print" onclick="window.print()">Print Certificate</button></section>`:`<section class="worksheet" style="text-align:center"><h1 style="font-family:Georgia,serif;color:#0b223f;text-transform:none">Certificate Locked</h1>${identityLine}<p>The certificate opens only after all 36 weekly assessments are recorded at 80%+, the weekly average is 80%+, the midterm and final are each 80%+, portfolio approval is complete, and the high school transition plan is complete.</p><p><strong>Weeks at 80%+:</strong> ${done}/36 · <strong>Weekly Average:</strong> ${avg}% · <strong>Midterm:</strong> ${state.midterm||0}% · <strong>Final:</strong> ${state.final||0}% · <strong>Portfolio:</strong> ${state.portfolio?"Approved":"Pending"} · <strong>Transition Plan:</strong> ${state.transition?"Complete":"Pending"}</p><a class="button" href="../index.html">Return to Portal</a></section>`;
})();
