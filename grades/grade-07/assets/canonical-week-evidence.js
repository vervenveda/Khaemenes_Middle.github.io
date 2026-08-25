(()=>{
  "use strict";

  const DATA=window.KHAE_GRADE7_DATA;
  const CROSSWALK=window.KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK;
  const MIN=80;
  const TOTAL_POINTS=22;
  const PASSING_POINTS=18;
  const mode=document.body?.dataset?.evidenceMode||"packet";
  const params=new URLSearchParams(location.search);
  const requested=Number(params.get("week")||1);
  const weekNumber=Number.isInteger(requested)&&requested>=1&&requested<=36?requested:1;
  const pad=n=>String(Number(n)).padStart(2,"0");
  const row=DATA?.weeks?.find(w=>Number(w.week)===weekNumber);
  const map=CROSSWALK?.weeks?.find(w=>Number(w.week)===weekNumber);
  const subjects=DATA?.subjects||[];

  function node(tag,className,text){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=String(text);
    return el;
  }
  function link(label,href,className="button"){
    const a=node("a",className,label);a.href=href;return a;
  }
  function addStyles(){
    const style=node("style");
    style.textContent=`
      .canonical-evidence-shell{max-width:1040px;margin:0 auto}
      .canonical-evidence-head{text-align:center;margin-bottom:14px}
      .canonical-evidence-head h1{margin:.25rem 0;color:var(--navy,#172033)}
      .canonical-evidence-head .week-label{font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#6a5525;font-size:.78rem}
      .canonical-evidence-head .essential{max-width:78ch;margin:.65rem auto 0;color:var(--muted,#5d6572)}
      .canonical-identity{max-width:760px;margin:0 auto 18px}
      .canonical-evidence-actions{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin:0 0 20px}
      .canonical-evidence-note{max-width:82ch;margin:0 auto 20px;padding:12px 14px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#faf8f3;line-height:1.55}
      .canonical-subject-list{display:grid;gap:18px}
      .canonical-subject-card{padding:20px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#fff}
      .canonical-subject-card h2{margin:0 0 7px;color:var(--navy,#172033)}
      .canonical-subject-card .focus{margin:.15rem 0 12px;font-weight:750;color:#6a5525}
      .canonical-subject-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .canonical-subject-box{padding:12px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#faf8f3}
      .canonical-subject-box h3{margin:0 0 6px;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#5d6572}
      .canonical-subject-box p{margin:0;line-height:1.5}
      .canonical-evidence-space{min-height:95px;margin-top:14px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:repeating-linear-gradient(to bottom,#fff 0,#fff 30px,#d9dce3 31px)}
      .canonical-rubric{width:100%;border-collapse:collapse;background:#fff}
      .canonical-rubric th,.canonical-rubric td{border:1px solid var(--line,#cfd4dd);padding:10px;vertical-align:top;text-align:left}
      .canonical-rubric th{background:#f3efe6;color:var(--navy,#172033)}
      .canonical-rubric .points{width:78px;text-align:center}
      .canonical-score-box{margin-top:18px;padding:16px;border:2px solid var(--navy,#172033);border-radius:7px;background:#fff}
      .canonical-score-line{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:10px}
      .canonical-score-line div{min-height:46px;border:1px solid var(--line,#d8dbe3);border-radius:7px;padding:10px}
      .canonical-reviewer{margin:14px 0 4px;font-weight:700}
      @media(max-width:720px){.canonical-subject-grid,.canonical-score-line{grid-template-columns:1fr}.canonical-rubric{font-size:.88rem}.canonical-rubric th,.canonical-rubric td{padding:7px}}
      @media print{.no-print,.canonical-evidence-actions{display:none!important}.canonical-subject-card{break-inside:avoid;box-shadow:none}.canonical-evidence-space{min-height:115px}.canonical-rubric{font-size:10pt}.canonical-evidence-note{border-color:#999}}
    `;
    document.head.appendChild(style);
  }
  function subjectCell(id){return map?.subjects?.[id]||null}
  function titleBlock(root,label){
    const header=node("div","canonical-evidence-head");
    header.append(node("p","week-label",`Grade 7 · Week ${pad(weekNumber)} · ${label}`));
    header.append(node("h1","",row?.title||`Week ${pad(weekNumber)}`));
    const essential=node("p","essential",row?.essentialQuestion?`Essential question: ${row.essentialQuestion}`:"");
    header.appendChild(essential);root.appendChild(header);
    const identity=node("div","name-date canonical-identity");
    identity.append(node("div","fill-box","Name:"),node("div","fill-box","Date:"));
    root.appendChild(identity);
  }
  function downloadText(filename,content){
    const blob=new Blob([content],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function packetText(){
    const lines=[`Khaemenes Academy Grade 7 · Week ${pad(weekNumber)} Weekly Evidence Packet`,row?.title||"",row?.essentialQuestion?`Essential question: ${row.essentialQuestion}`:"",""];
    for(const subject of subjects){
      const cell=subjectCell(subject.id);if(!cell)continue;
      lines.push(subject.title,`Focus: ${cell.focus}`,`Objective: ${cell.objective}`,`Evidence to keep: ${cell.evidenceTask}`,`Mastery target: ${cell.assessmentTarget}`,"");
    }
    lines.push(`Mastery authority: adult-reviewed weekly record; course threshold ${MIN}%.`);
    return lines.join("\n");
  }
  function assessmentRows(){
    const ela=subjectCell("language-arts"),math=subjectCell("mathematics"),science=subjectCell("science"),social=subjectCell("social-studies"),world=subjectCell("world-languages"),arts=subjectCell("arts-music"),health=subjectCell("health-pe-sel"),tech=subjectCell("technology-design"),integrated=subjectCell("integrated-projects");
    return [
      ["ELA Reading & Evidence",ela?.assessmentTarget],
      ["Writing & Research",ela?.evidenceTask],
      ["Mathematics Computation",math?.assessmentTarget],
      ["Mathematical Modeling",math?.evidenceTask],
      ["Science / Engineering",science?.assessmentTarget],
      ["Social Studies / Civics",social?.assessmentTarget],
      ["World Languages / Culture",world?.assessmentTarget],
      ["Arts / Music / Media",arts?.assessmentTarget],
      ["Health / PE / SEL",health?.assessmentTarget],
      ["Technology / Design",tech?.assessmentTarget],
      ["Integrated Portfolio",integrated?.assessmentTarget]
    ];
  }
  function assessmentText(){
    const lines=[`Khaemenes Academy Grade 7 · Week ${pad(weekNumber)} Weekly Mastery Check`,row?.title||"",`Adult review: 11 domains × 2 points = ${TOTAL_POINTS}; passing ${PASSING_POINTS}/${TOTAL_POINTS} = 81.8% (meets ${MIN}% minimum).`,""];
    assessmentRows().forEach(([domain,prompt],i)=>lines.push(`${i+1}. ${domain} (0–2): ${prompt||""}`));
    lines.push("","Total: ____ / 22","Percent: ____ %","Adult reviewer: ____________________","Feedback / next step: ______________________________");
    return lines.join("\n");
  }
  function controls(root,downloadLabel,downloadHandler){
    const actions=node("div","canonical-evidence-actions no-print");
    actions.append(link("Back to Week",`../weekly-plans/week-${pad(weekNumber)}.html`,`button`));
    const print=node("button","button gold","Print / Save PDF");print.type="button";print.addEventListener("click",()=>window.print());
    const download=node("button","button",downloadLabel);download.type="button";download.addEventListener("click",downloadHandler);
    actions.append(print,download);root.appendChild(actions);
  }
  function renderPacket(root){
    titleBlock(root,"Weekly Evidence Packet");
    controls(root,"Download Study Guide",()=>downloadText(`grade-07-week-${pad(weekNumber)}-evidence-guide.txt`,packetText()));
    root.append(node("p","canonical-evidence-note","This packet follows the canonical Grade 7 subject-by-week curriculum map. Use it beside the daily subject lessons to collect evidence for adult review and the learner portfolio. It does not award mastery or change the learner record."));
    const list=node("div","canonical-subject-list");
    for(const subject of subjects){
      const cell=subjectCell(subject.id);if(!cell)continue;
      const card=node("section","canonical-subject-card");
      card.append(node("h2","",subject.title),node("p","focus",`Focus: ${cell.focus}`));
      const grid=node("div","canonical-subject-grid");
      for(const [label,value] of [["What you are learning",cell.objective],["Evidence to keep",cell.evidenceTask],["Mastery target",cell.assessmentTarget]]){
        const box=node("div","canonical-subject-box");box.append(node("h3","",label),node("p","",value));grid.appendChild(box);
      }
      const lessonBox=node("div","canonical-subject-box");lessonBox.append(node("h3","","Daily lessons"),link("Open this week's subject lessons",`../subjects/${subject.id}/week-${pad(weekNumber)}.html`,"button"));grid.appendChild(lessonBox);
      card.append(grid,node("div","canonical-evidence-space"));list.appendChild(card);
    }
    root.appendChild(list);
  }
  function renderAssessment(root){
    titleBlock(root,"Weekly Mastery Check");
    controls(root,"Download Review Copy",()=>downloadText(`grade-07-week-${pad(weekNumber)}-mastery-check.txt`,assessmentText()));
    root.append(node("p","canonical-evidence-note",`Adult-reviewed evidence check. Score each domain 0, 1, or 2 points. Total possible: ${TOTAL_POINTS}. Passing: ${PASSING_POINTS}/${TOTAL_POINTS} = 81.8%, which meets the Academy minimum of ${MIN}%. This page does not write the student's grade; the authorized adult/Academy record remains authoritative.`));
    const table=node("table","canonical-rubric");
    const head=node("thead");const hr=node("tr");["#","Domain","Week-specific evidence target","Score 0–2"].forEach(t=>hr.appendChild(node("th","",t)));head.appendChild(hr);table.appendChild(head);
    const body=node("tbody");
    assessmentRows().forEach(([domain,prompt],i)=>{
      const tr=node("tr");tr.append(node("td","points",i+1),node("td","",domain),node("td","",prompt||""),node("td","points","____"));body.appendChild(tr);
    });
    table.appendChild(body);root.appendChild(table);
    const score=node("section","canonical-score-box");
    score.append(node("h2","","Adult Review Record"),node("p","",`Use the course record after review. The student-facing page itself cannot submit or change a grade.`));
    const line=node("div","canonical-score-line");line.append(node("div","","Total: ____ / 22"),node("div","","Percent: ____ %"),node("div","","Mastery: ☐ Met  ☐ Not yet"));score.appendChild(line);
    score.append(node("p","canonical-reviewer","Adult reviewer: ____________________________________"),node("div","canonical-evidence-space"));root.appendChild(score);
  }

  addStyles();
  const mount=document.getElementById("canonicalEvidenceMount");
  if(!mount||!DATA||!CROSSWALK||!row||!map){
    if(mount)mount.textContent="This Grade 7 weekly evidence page could not load its canonical curriculum data.";
    return;
  }
  document.title=`Grade 7 Week ${pad(weekNumber)} · ${mode==="assessment"?"Weekly Mastery Check":"Weekly Evidence Packet"}`;
  const shell=node("div","canonical-evidence-shell");
  if(mode==="assessment")renderAssessment(shell);else renderPacket(shell);
  mount.replaceChildren(shell);
})();
