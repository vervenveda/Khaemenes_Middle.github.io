(function attachGrade6CurriculumAlignment(global){
  "use strict";

  const VERSION="1.0.0";
  const SCRIPT=global.document?.currentScript||null;
  const CROSSWALK_URL=SCRIPT?.src?new URL("../grades/grade-06/data/subject-week-crosswalk.js",SCRIPT.src).href:"../../data/subject-week-crosswalk.js";
  const SUBJECT_PATH=/\/grades\/grade-06\/subjects\/([^/]+)(?:\/(?:index\.html)?)?\/?$/i;
  const WEEK_PATH=/\/grades\/grade-06\/subjects\/([^/]+)\/week-(\d{2})\.html$/i;

  function text(value){return String(value??"").trim()}
  function strongLabel(label,value){
    const frag=global.document.createDocumentFragment();
    const strong=global.document.createElement("strong");
    strong.textContent=label;
    frag.append(strong,global.document.createTextNode(" "+text(value)));
    return frag;
  }
  function replaceLabeledParagraph(root,label,value){
    for(const p of root.querySelectorAll("p")){
      const s=p.querySelector(":scope > strong:first-child");
      if(s&&text(s.textContent).toLowerCase()===label.toLowerCase()){
        p.replaceChildren(strongLabel(label,value));
        p.dataset.grade6Aligned="true";
        return p;
      }
    }
    return null;
  }
  function ensureStyles(){
    if(global.document.getElementById("khaemenesGrade6AlignmentStyles"))return;
    const style=global.document.createElement("style");
    style.id="khaemenesGrade6AlignmentStyles";
    style.textContent=`
      .grade6-assignment-card{max-width:920px;margin:0 auto 24px;padding:22px;border:1px solid rgba(21,35,57,.18);border-radius:7px;background:#fffdf8;box-shadow:0 10px 28px rgba(21,35,57,.08);text-align:left}
      .grade6-assignment-card .grade6-kicker{margin:0 0 6px;text-align:center;font-weight:800;letter-spacing:.14em;text-transform:uppercase;font-size:.76rem;color:#6a5525}
      .grade6-assignment-card h2{margin:.15rem 0 .65rem;text-align:center;color:var(--navy,#172033)}
      .grade6-assignment-focus{margin:0 auto 16px;max-width:760px;text-align:center;font-size:1.06rem}
      .grade6-assignment-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
      .grade6-assignment-box{padding:14px;border:1px solid rgba(21,35,57,.14);border-radius:7px;background:#f8f5ee}
      .grade6-assignment-box h3{margin:0 0 7px;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase;color:#6a5525}
      .grade6-assignment-box p{margin:0;line-height:1.55}
      details.grade6-teacher-guidance{margin:10px 0 0;padding:8px 10px;border:1px dashed rgba(21,35,57,.22);border-radius:7px;background:#faf8f3}
      details.grade6-teacher-guidance summary{cursor:pointer;font-weight:700;color:#4e596b}
      details.grade6-teacher-guidance p{margin:8px 0 0}
      .grade6-crosswalk-note{margin:.5rem 0 0;font-size:.82rem;color:#667085}
      @media(max-width:700px){.grade6-assignment-grid{grid-template-columns:1fr}.grade6-assignment-card{padding:18px 14px}}
      @media print{details.grade6-teacher-guidance{display:none!important}.grade6-assignment-card{box-shadow:none}}
    `;
    global.document.head.appendChild(style);
  }
  function getCrosswalk(){return global.KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK||null}
  function findSubject(crosswalk,id){return crosswalk?.subjects?.find(s=>s.id===id)||null}
  function findCell(crosswalk,week,id){
    const row=crosswalk?.weeks?.find(w=>Number(w.week)===Number(week));
    return row?{row,cell:row.subjects?.[id]||null}:null;
  }
  function renderSubjectIndex(crosswalk,subjectId){
    if(!findSubject(crosswalk,subjectId))return;
    let aligned=0;
    for(const card of global.document.querySelectorAll(".week-card")){
      const link=card.querySelector('a[href*="week-"]');
      const match=text(link?.getAttribute("href")).match(/week-(\d{2})\.html/i);
      if(!match)continue;
      const data=findCell(crosswalk,Number(match[1]),subjectId);
      if(!data?.cell)continue;
      replaceLabeledParagraph(card,"Focus:",data.cell.focus);
      card.dataset.grade6CrosswalkWeek=String(data.row.week);
      aligned++;
    }
    if(aligned){
      const heading=global.document.querySelector("main .heading");
      if(heading&&!heading.querySelector(".grade6-crosswalk-note")){
        const note=global.document.createElement("p");
        note.className="grade6-crosswalk-note";
        note.textContent="Weekly focus labels are aligned to the canonical Grade 6 subject-by-week curriculum map.";
        heading.appendChild(note);
      }
    }
  }
  function buildAssignmentCard(row,cell,subjectTitle){
    const card=global.document.createElement("section");
    card.className="grade6-assignment-card";
    card.dataset.grade6CrosswalkWeek=String(row.week);
    const kicker=global.document.createElement("p");
    kicker.className="grade6-kicker";
    kicker.textContent="Weekly Subject Assignment";
    const h2=global.document.createElement("h2");
    h2.textContent=`Week ${String(row.week).padStart(2,"0")} · ${subjectTitle}`;
    const focus=global.document.createElement("p");
    focus.className="grade6-assignment-focus";
    focus.appendChild(strongLabel("Focus:",cell.focus));
    const grid=global.document.createElement("div");
    grid.className="grade6-assignment-grid";
    const boxes=[
      ["What you are learning",cell.objective],
      ["Evidence to keep",cell.evidenceTask],
      ["Mastery target",cell.assessmentTarget],
      ["Mastery standard",`Adult-reviewed weekly evidence remains governed by the existing Grade 6 record. The course mastery threshold remains ${global.KHAE_GRADE6_SUBJECT_WEEK_CROSSWALK.masteryThreshold}%.`]
    ];
    for(const [title,body] of boxes){
      const box=global.document.createElement("div");
      box.className="grade6-assignment-box";
      const heading=global.document.createElement("h3");heading.textContent=title;
      const p=global.document.createElement("p");p.textContent=body;
      box.append(heading,p);grid.appendChild(box);
    }
    card.append(kicker,h2,focus,grid);
    return card;
  }
  function collapseTeacherGuidance(article){
    const p=[...article.querySelectorAll("p")].find(el=>text(el.querySelector(":scope > strong:first-child")?.textContent).toLowerCase()==="teacher script:");
    if(!p||p.closest("details.grade6-teacher-guidance"))return;
    const details=global.document.createElement("details");
    details.className="grade6-teacher-guidance";
    const summary=global.document.createElement("summary");summary.textContent="Teacher Guidance";
    p.before(details);details.append(summary,p);
  }
  function renderWeekPage(crosswalk,subjectId,week){
    const subject=findSubject(crosswalk,subjectId);
    const data=findCell(crosswalk,week,subjectId);
    if(!subject||!data?.cell)return;
    ensureStyles();
    const heading=global.document.querySelector("main .heading");
    if(heading&&!global.document.querySelector(".grade6-assignment-card"))heading.after(buildAssignmentCard(data.row,data.cell,subject.title));
    for(const article of global.document.querySelectorAll("article.lesson")){
      replaceLabeledParagraph(article,"Focus:",data.cell.focus);
      replaceLabeledParagraph(article,"Objective:",data.cell.objective);
      replaceLabeledParagraph(article,"Evidence:",data.cell.evidenceTask);
      collapseTeacherGuidance(article);
    }
    global.document.documentElement.dataset.grade6CurriculumAligned="true";
  }
  function apply(){
    const pathname=String(global.location?.pathname||"");
    const weekMatch=pathname.match(WEEK_PATH);
    const subjectMatch=pathname.match(SUBJECT_PATH);
    const crosswalk=getCrosswalk();
    if(!crosswalk)return;
    ensureStyles();
    if(weekMatch)return renderWeekPage(crosswalk,weekMatch[1],Number(weekMatch[2]));
    if(subjectMatch)return renderSubjectIndex(crosswalk,subjectMatch[1]);
  }
  function ensureCrosswalk(){
    if(getCrosswalk())return Promise.resolve(getCrosswalk());
    if(!global.document)return Promise.resolve(null);
    return new Promise(resolve=>{
      let script=global.document.querySelector('script[data-grade6-subject-crosswalk]');
      if(script){script.addEventListener("load",()=>resolve(getCrosswalk()),{once:true});script.addEventListener("error",()=>resolve(null),{once:true});return;}
      script=global.document.createElement("script");
      script.src=CROSSWALK_URL;
      script.async=false;
      script.dataset.grade6SubjectCrosswalk="1";
      script.onload=()=>resolve(getCrosswalk());
      script.onerror=()=>resolve(null);
      (global.document.head||global.document.documentElement).appendChild(script);
    });
  }
  async function boot(){await ensureCrosswalk();apply()}

  global.KhaemenesGrade6CurriculumAlignment=Object.freeze({version:VERSION,apply,boot});
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})(window);
