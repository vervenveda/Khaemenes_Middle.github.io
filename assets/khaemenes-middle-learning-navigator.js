(()=>{
  "use strict";

  const ctx=window.KHAEMENES_GRADE_CONTEXT;
  if(!ctx)return;
  const grade=String(ctx.grade||"").padStart(2,"0");
  const gradeNumber=Number(grade);
  const DATA=window[`KHAE_GRADE${gradeNumber}_DATA`];
  const CONT=window.KhaemenesGradeContinuity;
  if(!DATA?.weeks||!DATA?.subjects)return;

  const MIN=Number(DATA.course?.passingScore)||80;
  const pad=n=>String(Number(n)).padStart(2,"0");
  const packetHref=week=>grade==="06"?`evidence/weekly-evidence-packet.html?week=${pad(week)}`:`printables/week-${pad(week)}-packet.html`;
  const weeklyAssessmentHref=week=>grade==="06"?`evidence/weekly-mastery-check.html?week=${pad(week)}`:`assessments/week-${pad(week)}-assessment.html`;
  const node=(tag,className,text)=>{
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=String(text);
    return el;
  };
  const link=(label,href,className="button")=>{
    const a=node("a",className,label);
    a.href=href;
    return a;
  };
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
  function statusText(score){
    if(score===null)return "Not yet recorded";
    if(score>=MIN)return `${Math.round(score)}% · Mastered`;
    return `${Math.round(score)}% · Study focus`;
  }
  function statusClass(score){
    if(score===null)return "middle-nav-status";
    return `middle-nav-status ${score>=MIN?"middle-nav-good":"middle-nav-review"}`;
  }
  function midyearBoundary(){
    const marked=DATA.weeks.find(w=>/midyear|midterm/i.test(`${w.title||""} ${w.theme||""}`));
    return Number(marked?.week)||Math.ceil(DATA.weeks.length/2);
  }

  function installStyles(){
    if(document.getElementById("khaemenesMiddleLearningNavigatorStyles"))return;
    const style=node("style");
    style.id="khaemenesMiddleLearningNavigatorStyles";
    style.textContent=`
      .middle-learning-nav .middle-nav-note{max-width:82ch;margin:.4rem auto 1.1rem;color:var(--muted,#5d6572)}
      .middle-nav-list{display:grid;gap:12px;margin-top:18px}
      .middle-nav-week{border:1px solid var(--line,#d8dbe3);border-radius:14px;background:var(--card,#fff);overflow:hidden}
      .middle-nav-week>summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:14px;cursor:pointer;padding:16px 18px;font-weight:750}
      .middle-nav-week>summary::-webkit-details-marker{display:none}
      .middle-nav-week>summary:focus-visible{outline:3px solid #7aa7ff;outline-offset:-3px}
      .middle-nav-week[open]>summary{border-bottom:1px solid var(--line,#d8dbe3)}
      .middle-nav-week-body{padding:18px}
      .middle-nav-status{display:inline-flex;align-items:center;border:1px solid var(--line,#d8dbe3);border-radius:999px;padding:.25rem .6rem;font-size:.78rem;font-weight:750;white-space:nowrap}
      .middle-nav-good{border-color:#4d9d67;color:#246b3a;background:rgba(77,157,103,.09)}
      .middle-nav-review{border-color:#c98a35;color:#8a5311;background:rgba(201,138,53,.10)}
      .middle-nav-subjects{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:14px}
      .middle-nav-subjects a{display:block;text-decoration:none;border:1px solid var(--line,#d8dbe3);border-radius:10px;padding:10px 12px;background:rgba(255,255,255,.45);color:inherit;font-weight:650}
      .middle-nav-subjects a:hover{transform:translateY(-1px)}
      .middle-nav-review-centers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:24px}
      .middle-nav-review-card{border:1px solid var(--line,#d8dbe3);border-radius:16px;padding:18px;background:var(--card,#fff)}
      .middle-nav-review-weeks{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}
      .middle-nav-review-weeks a{border:1px solid var(--line,#d8dbe3);border-radius:999px;padding:.28rem .58rem;text-decoration:none;color:inherit;font-size:.8rem}
      @media(max-width:800px){.middle-nav-subjects{grid-template-columns:1fr}.middle-nav-review-centers{grid-template-columns:1fr}.middle-nav-week>summary{align-items:flex-start;flex-direction:column}}
      @media print{.middle-learning-nav{display:none!important}}
    `;
    document.head.appendChild(style);
  }

  function addHeroDoorway(){
    const actions=document.querySelector(".hero .actions");
    if(!actions||document.getElementById("middleLearningNavigatorDoor"))return;
    const a=link("Learning Navigator","#learning-navigator","btn");
    a.id="middleLearningNavigatorDoor";
    actions.appendChild(a);
  }

  function reviewWeekLinks(limit,state){
    const wrap=node("div","middle-nav-review-weeks");
    DATA.weeks.filter(w=>Number(w.week)<=limit).forEach(w=>{
      const score=scoreFor(state,w.week);
      const a=link(`W${pad(w.week)}${score===null?"":` · ${Math.round(score)}%`}`,`weekly-plans/week-${pad(w.week)}.html`,"");
      if(score!==null&&score<MIN)a.setAttribute("aria-label",`Week ${pad(w.week)} study focus, score ${Math.round(score)} percent`);
      wrap.appendChild(a);
    });
    return wrap;
  }

  function buildReviewCard(title,description,limit,assessmentHref,assessmentLabel,state,reviewHref=null){
    const card=node("article","middle-nav-review-card");
    card.append(node("h3","",title),node("p","",description),reviewWeekLinks(limit,state));
    const actions=node("div","actions");
    if(reviewHref)actions.append(link("Open Review Center",reviewHref,"button"));
    actions.append(link(assessmentLabel,assessmentHref,"button gold"));
    card.appendChild(actions);
    return card;
  }

  function render(){
    installStyles();
    addHeroDoorway();
    const old=document.getElementById("learning-navigator");
    if(old)old.remove();

    const state=readState();
    const section=node("section","section middle-learning-nav");
    section.id="learning-navigator";
    const shell=node("div","shell");
    const heading=node("div","heading");
    heading.append(node("p","kicker","36-Week Learning Navigator"),node("h2","","Open the week you are studying — or return to earlier work for review."));
    const note=node("p","middle-nav-note",`This navigator reads the existing Grade ${grade} learner record. It does not award mastery, change placement, or alter scores. A recorded weekly score of ${MIN}% or higher is shown as mastered; earlier materials remain open for study.`);
    heading.appendChild(note);
    shell.appendChild(heading);

    const list=node("div","middle-nav-list");
    DATA.weeks.forEach(w=>{
      const score=scoreFor(state,w.week);
      const details=node("details","middle-nav-week");
      details.id=`middle-week-${pad(w.week)}`;
      const summary=node("summary");
      const title=node("span","",`Week ${pad(w.week)} · ${w.title}`);
      const badge=node("span",statusClass(score),statusText(score));
      summary.append(title,badge);
      details.appendChild(summary);

      const body=node("div","middle-nav-week-body");
      body.append(node("p","",w.theme||""),node("p","",`Essential question: ${w.essentialQuestion||""}`));
      const actions=node("div","actions");
      actions.append(
        link("Open Integrated Week",`weekly-plans/week-${pad(w.week)}.html`,"button gold"),
        link(grade==="06"?"Weekly Evidence Packet":"Printable Packet",packetHref(w.week),"button"),
        link(grade==="06"?"Weekly Mastery Check":"Weekly Assessment",weeklyAssessmentHref(w.week),"button")
      );
      body.appendChild(actions);

      const subjectHeading=node("h3","","Subject lessons for this week");
      const subjectGrid=node("div","middle-nav-subjects");
      DATA.subjects.forEach(subject=>subjectGrid.appendChild(link(subject.title,`subjects/${subject.id}/week-${pad(w.week)}.html`,"")));
      body.append(subjectHeading,subjectGrid);
      details.appendChild(body);
      list.appendChild(details);
    });
    shell.appendChild(list);

    const mid=midyearBoundary();
    const reviews=node("div","middle-nav-review-centers");
    reviews.append(
      buildReviewCard("Midyear Review Center",`Review Weeks 01–${pad(mid)} from the actual grade curriculum before opening the official Midterm.`,mid,"assessments/midterm.html","Open Official Midterm",state,grade==="06"?"assessments/midterm-review.html":null),
      buildReviewCard("Final Course Review",`Review all ${DATA.weeks.length} weeks, especially any recorded score below ${MIN}%, before opening the official Final.`,DATA.weeks.length,"assessments/final-exam.html","Open Official Final",state,grade==="06"?"assessments/final-review.html":null)
    );
    shell.appendChild(reviews);
    section.appendChild(shell);

    const subjects=document.getElementById("subjects");
    if(subjects)subjects.before(section);else document.querySelector("main")?.appendChild(section);
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
