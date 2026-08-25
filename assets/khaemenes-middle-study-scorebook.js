(()=>{
  "use strict";

  const ctx=window.KHAEMENES_GRADE_CONTEXT;
  if(!ctx)return;
  const grade=String(ctx.grade||"").padStart(2,"0");
  const gradeNumber=Number(grade);
  const DATA=window[`KHAE_GRADE${gradeNumber}_DATA`];
  const CONT=window.KhaemenesGradeContinuity;
  if(!DATA?.weeks)return;

  const MIN=Number(DATA.course?.passingScore)||80;
  const pad=n=>String(Number(n)).padStart(2,"0");
  const node=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=String(text);return el};
  const link=(label,href,className="button")=>{const a=node("a",className,label);a.href=href;return a};
  const blank=()=>({weekly:{},midterm:0,final:0,portfolio:false,transition:false});

  function readState(){
    try{
      const status=CONT?.status?.();
      if(status?.status==="placement-mismatch")return blank();
      if(CONT?.readState)return CONT.readState(blank())||blank();
      if(status?.status==="ready")return blank();
      return JSON.parse(localStorage.getItem(ctx.legacyKey)||"null")||blank();
    }catch{return blank()}
  }
  function hasScore(state,week){
    const weekly=state?.weekly||{};
    return Object.prototype.hasOwnProperty.call(weekly,String(week))||Object.prototype.hasOwnProperty.call(weekly,week);
  }
  function scoreFor(state,week){
    if(!hasScore(state,week))return null;
    const score=Number(state.weekly[week]);
    return Number.isFinite(score)?Math.max(0,Math.min(100,score)):0;
  }
  function rows(state){
    return DATA.weeks.map(w=>({week:Number(w.week),title:w.title,score:scoreFor(state,w.week)}));
  }
  function recorded(rows){return rows.filter(r=>r.score!==null)}
  function average(values){return values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0}
  function numericScore(value){const n=Number(value||0);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):0}
  function displayCumulative(value){const n=numericScore(value);return n>0?`${Math.round(n)}%`:"—"}
  function learnerLabel(){
    const status=CONT?.status?.();
    if(status?.status==="ready")return `${status.learner.nickname} · Grade ${grade}`;
    if(status?.status==="placement-mismatch")return `Preview mode · Grade ${grade} scores hidden`;
    return `Grade ${grade} local compatibility record`;
  }

  function installStyles(){
    if(document.getElementById("khaemenesMiddleStudyScorebookStyles"))return;
    const style=node("style");
    style.id="khaemenesMiddleStudyScorebookStyles";
    style.textContent=`
      .middle-study-scorebook .middle-score-note{max-width:84ch;margin:.45rem auto 1rem;color:var(--muted,#5d6572)}
      .middle-score-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}
      .middle-score-kpi{border:1px solid var(--line,#d8dbe3);border-radius:14px;padding:16px;text-align:center;background:var(--card,#fff)}
      .middle-score-kpi strong{display:block;font-size:1.8rem}.middle-score-kpi span{font-size:.82rem;color:var(--muted,#5d6572)}
      .middle-study-focus{border:1px solid var(--line,#d8dbe3);border-radius:14px;padding:16px;margin:16px 0;background:var(--card,#fff)}
      .middle-score-table-wrap{overflow:auto;border:1px solid var(--line,#d8dbe3);border-radius:14px;background:var(--card,#fff)}
      .middle-score-table{width:100%;border-collapse:collapse;min-width:680px}
      .middle-score-table th,.middle-score-table td{padding:11px 12px;border-bottom:1px solid var(--line,#d8dbe3);text-align:left;vertical-align:top}
      .middle-score-table tr:last-child td{border-bottom:0}.middle-score-table th{font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}
      .middle-score-pill{display:inline-flex;border:1px solid var(--line,#d8dbe3);border-radius:999px;padding:.23rem .55rem;font-size:.78rem;font-weight:750}
      .middle-score-good{border-color:#4d9d67;color:#246b3a;background:rgba(77,157,103,.09)}
      .middle-score-review{border-color:#c98a35;color:#8a5311;background:rgba(201,138,53,.10)}
      .middle-score-cumulative{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:20px}
      .middle-score-card{border:1px solid var(--line,#d8dbe3);border-radius:14px;padding:17px;background:var(--card,#fff)}
      @media(max-width:800px){.middle-score-kpis{grid-template-columns:repeat(2,minmax(0,1fr))}.middle-score-cumulative{grid-template-columns:1fr}}
      @media print{.middle-study-scorebook .no-print{display:none!important}.middle-score-table-wrap{overflow:visible}.middle-score-table{min-width:0;font-size:10pt}}
    `;
    document.head.appendChild(style);
  }

  function addHeroDoorway(){
    const actions=document.querySelector(".hero .actions");
    if(!actions||document.getElementById("middleStudyScorebookDoor"))return;
    const a=link("Study Scorebook","#study-scorebook","btn");
    a.id="middleStudyScorebookDoor";
    actions.appendChild(a);
  }

  function scoreStatus(score){
    if(score===null)return {label:"Not recorded",className:"middle-score-pill"};
    if(score>=MIN)return {label:"Mastered",className:"middle-score-pill middle-score-good"};
    return {label:"Study focus",className:"middle-score-pill middle-score-review"};
  }

  function render(){
    installStyles();
    addHeroDoorway();
    document.getElementById("study-scorebook")?.remove();

    const state=readState();
    const allRows=rows(state);
    const recordedRows=recorded(allRows);
    const mastered=recordedRows.filter(r=>r.score>=MIN).length;
    const weak=recordedRows.filter(r=>r.score<MIN);
    const avg=average(recordedRows.map(r=>r.score));
    const mid=numericScore(state.midterm),fin=numericScore(state.final);
    const portfolio=!!state.portfolio;
    const transition=gradeNumber===8?!!state.transition:true;
    const recordComplete=mastered===36&&recordedRows.length===36&&avg>=MIN&&mid>=MIN&&fin>=MIN&&portfolio&&transition;

    const section=node("section","section alt middle-study-scorebook");
    section.id="study-scorebook";
    const shell=node("div","shell");
    const heading=node("div","heading");
    heading.append(node("p","kicker","Read-Only Study Scorebook"),node("h2","","Use recorded results to decide what to revisit next."));
    heading.appendChild(node("p","middle-score-note",`Record: ${learnerLabel()}. Middle School currently preserves one adult-reviewed score for each week rather than per-attempt machine-scored history. This scorebook reads that existing evidence only; it does not submit, reset, lower, replace, or certify any score.`));
    const printActions=node("div","actions no-print");
    const printButton=node("button","button","Print Study Scorebook");
    printButton.type="button";printButton.addEventListener("click",()=>window.print());
    printActions.appendChild(printButton);heading.appendChild(printActions);shell.appendChild(heading);

    const kpis=node("div","middle-score-kpis");
    for(const [value,label] of [[`${mastered}/36`,"Weeks at 80%+"],[`${avg}%`,`Average of ${recordedRows.length} recorded`],[displayCumulative(mid),"Recorded Midterm"],[displayCumulative(fin),"Recorded Final"]]){
      const card=node("article","middle-score-kpi");card.append(node("strong","",value),node("span","",label));kpis.appendChild(card);
    }
    shell.appendChild(kpis);

    const focus=node("article","middle-study-focus");
    focus.appendChild(node("h3","","Study Focus"));
    if(weak.length){
      focus.appendChild(node("p","",`Recorded weeks below ${MIN}%: ${weak.map(r=>`Week ${pad(r.week)} (${Math.round(r.score)}%)`).join(", ")}. These are review priorities, not erased attempts.`));
      const actions=node("div","actions");
      weak.slice(0,12).forEach(r=>{const a=link(`Review Week ${pad(r.week)}`,`#middle-week-${pad(r.week)}`,"button");a.dataset.openWeek=pad(r.week);actions.appendChild(a)});
      focus.appendChild(actions);
    }else if(recordedRows.length){focus.appendChild(node("p","",`No recorded weekly score is currently below ${MIN}%. Earlier mastered weeks remain open in the Learning Navigator for review.`));}
    else{focus.appendChild(node("p","","No weekly scores are recorded yet. As adult-reviewed results are entered, this panel will identify review priorities."));}
    shell.appendChild(focus);

    const tableWrap=node("div","middle-score-table-wrap");
    const table=node("table","middle-score-table");
    const thead=node("thead"),headRow=node("tr");
    ["Week","Curriculum focus","Recorded score","Status","Study"].forEach(label=>headRow.appendChild(node("th","",label)));thead.appendChild(headRow);table.appendChild(thead);
    const tbody=node("tbody");
    allRows.forEach(row=>{
      const tr=node("tr");
      tr.appendChild(node("td","",pad(row.week)));
      tr.appendChild(node("td","",row.title));
      tr.appendChild(node("td","",row.score===null?"—":`${Math.round(row.score)}%`));
      const status=scoreStatus(row.score),statusCell=node("td"),pill=node("span",status.className,status.label);statusCell.appendChild(pill);tr.appendChild(statusCell);
      const study=node("td"),a=link("Open week",`#middle-week-${pad(row.week)}`,"");a.dataset.openWeek=pad(row.week);study.appendChild(a);tr.appendChild(study);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);tableWrap.appendChild(table);shell.appendChild(tableWrap);

    const cumulative=node("div","middle-score-cumulative");
    const midCard=node("article","middle-score-card");
    midCard.append(node("h3","","Official Midterm"),node("p","",`Recorded score: ${displayCumulative(mid)} · ${mid>=MIN?"mastery threshold met":mid>0?`below ${MIN}% — review recommended`:"not yet recorded"}.`));
    const midActions=node("div","actions");midActions.append(link("Open Midyear Review","#learning-navigator","button"),link("Open Official Midterm","assessments/midterm.html","button gold"));midCard.appendChild(midActions);
    const finalCard=node("article","middle-score-card");
    finalCard.append(node("h3","","Official Final & Completion Evidence"),node("p","",`Recorded final: ${displayCumulative(fin)} · Portfolio: ${portfolio?"complete":"pending"}${gradeNumber===8?` · High School transition plan: ${transition?"complete":"pending"}`:""}. Record completion snapshot: ${recordComplete?"all current grade gates met":"one or more grade gates remain"}.`),node("p","",`The certificate page and authorized Academy/adult review remain the completion authority. This scorebook is a study view of the same learner record.`));
    const finalActions=node("div","actions");finalActions.append(link("Open Final Review","#learning-navigator","button"),link("Open Official Final","assessments/final-exam.html","button gold"),link("Certificate Record","records/certificate.html","button"));finalCard.appendChild(finalActions);
    cumulative.append(midCard,finalCard);shell.appendChild(cumulative);
    section.appendChild(shell);

    const navigator=document.getElementById("learning-navigator");
    if(navigator)navigator.after(section);else document.getElementById("subjects")?.before(section);

    section.querySelectorAll("[data-open-week]").forEach(a=>a.addEventListener("click",()=>{
      const details=document.getElementById(`middle-week-${a.dataset.openWeek}`);
      if(details)details.open=true;
    }));
  }

  document.addEventListener("DOMContentLoaded",()=>{
    render();
    document.addEventListener("change",event=>{
      if(event.target?.matches?.("[data-score],#midtermScore,#finalScore,#portfolio,#transition"))setTimeout(render,0);
    });
    document.getElementById("saveProfile")?.addEventListener("click",()=>setTimeout(render,0));
    document.getElementById("clearRecords")?.addEventListener("click",()=>setTimeout(render,0));
    window.addEventListener("storage",()=>render());
  });
})();
