(()=>{
  "use strict";

  const VERSION="1.0.0";
  const DATA=window.KHAE_GRADE7_DATA;
  const CROSSWALK=window.KHAE_GRADE7_SUBJECT_WEEK_CROSSWALK;
  const CONT=window.KhaemenesGradeContinuity;
  const MODE=document.body?.dataset?.cumulativeMode||"midterm-review";
  const MIN=80;
  const LEGACY_KEY="khaemenes_grade7_middle_school_36_aplusplus_v1";
  const isMidterm=MODE.startsWith("midterm");
  const isReview=MODE.endsWith("-review");
  const examType=isMidterm?"midterm":"final";
  const pad=n=>String(Number(n)).padStart(2,"0");
  const node=(tag,className,text)=>{const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=String(text);return el};
  const link=(label,href,className="button")=>{const a=node("a",className,label);a.href=href;return a};

  function midyearBoundary(){
    const marker=DATA?.weeks?.find(w=>/midyear|midterm/i.test(`${w.title||""} ${w.theme||""}`));
    return Number(marker?.week)||17;
  }
  const coverageEnd=isMidterm?midyearBoundary():Number(DATA?.course?.weeks||36);
  const itemCount=Number(DATA?.assessments?.[examType]?.itemCount)||(isMidterm?120:140);
  const passingItems=Math.ceil(itemCount*MIN/100);

  function blank(){return {weekly:{},midterm:0,final:0,portfolio:false}}
  function readState(){
    try{
      const status=CONT?.status?.();
      if(status?.status==="placement-mismatch")return blank();
      if(CONT?.readState)return CONT.readState(blank())||blank();
      return JSON.parse(localStorage.getItem(LEGACY_KEY)||"null")||blank();
    }catch{return blank()}
  }
  function scoreFor(state,week){
    const weekly=state?.weekly||{};
    if(!Object.prototype.hasOwnProperty.call(weekly,String(week))&&!Object.prototype.hasOwnProperty.call(weekly,week))return null;
    const n=Number(weekly[week]);
    return Number.isFinite(n)?Math.max(0,Math.min(100,n)):0;
  }
  function weekMap(week){return CROSSWALK?.weeks?.find(w=>Number(w.week)===Number(week))||null}
  function buildPool(limit=coverageEnd){
    const pool=[];
    for(const week of (DATA?.weeks||[]).filter(w=>Number(w.week)<=limit)){
      const map=weekMap(week.week);
      for(const subject of DATA?.subjects||[]){
        const cell=map?.subjects?.[subject.id];
        if(!cell)continue;
        pool.push({week:Number(week.week),weekTitle:week.title,subjectId:subject.id,subjectTitle:subject.title,focus:cell.focus,prompt:cell.assessmentTarget,evidence:cell.evidenceTask});
      }
    }
    return pool;
  }
  function selectEven(pool,count){
    if(!Array.isArray(pool)||!pool.length||count<=0)return [];
    if(count>=pool.length)return pool.slice();
    return Array.from({length:count},(_,i)=>pool[Math.floor(i*pool.length/count)]);
  }
  function assessmentItems(){return selectEven(buildPool(coverageEnd),itemCount).map((item,i)=>({...item,number:i+1}))}

  function styles(){
    const style=node("style");
    style.textContent=`
      .cum-shell{max-width:1120px;margin:0 auto}.cum-head{text-align:center;margin-bottom:18px}.cum-head .kicker{font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#6a5525}.cum-head h1{margin:.3rem 0;color:var(--navy,#172033)}
      .cum-actions{display:flex;justify-content:center;gap:9px;flex-wrap:wrap;margin:0 0 20px}.cum-note{max-width:86ch;margin:0 auto 20px;padding:14px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#faf8f3;line-height:1.55}
      .cum-identity{max-width:760px;margin:0 auto 18px}.cum-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}.cum-stat{padding:15px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#fff;text-align:center}.cum-stat strong{display:block;font-size:1.45rem;color:var(--navy,#172033)}
      .cum-week-list,.cum-subject-sections{display:grid;gap:12px}.cum-week,.cum-subject{border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#fff;overflow:hidden}.cum-week>summary,.cum-subject>summary{cursor:pointer;list-style:none;padding:15px 17px;font-weight:800;display:flex;justify-content:space-between;gap:12px}.cum-week>summary::-webkit-details-marker,.cum-subject>summary::-webkit-details-marker{display:none}.cum-week[open]>summary,.cum-subject[open]>summary{border-bottom:1px solid var(--line,#d8dbe3)}
      .cum-week-body,.cum-subject-body{padding:16px}.cum-focus-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:12px 0}.cum-focus{padding:9px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:#faf8f3;font-size:.9rem}.cum-focus strong{display:block;color:#6a5525;margin-bottom:4px}
      .cum-status{display:inline-flex;border:1px solid var(--line,#d8dbe3);border-radius:999px;padding:.22rem .55rem;font-size:.78rem;white-space:nowrap}.cum-good{color:#246b3a;border-color:#4d9d67}.cum-review{color:#8a5311;border-color:#c98a35}.cum-pending{color:#5d6572}
      .cum-item{padding:16px;border-bottom:1px solid var(--line,#d8dbe3);break-inside:avoid}.cum-item:last-child{border-bottom:0}.cum-item h3{margin:0 0 5px;font-size:1rem}.cum-item .meta{margin:0 0 8px;color:#6a5525;font-weight:700}.cum-item .prompt{font-size:1.02rem;line-height:1.55}.cum-item .evidence-direction{margin:.45rem 0;color:#5d6572}.cum-response{min-height:78px;margin-top:10px;border:1px solid var(--line,#d8dbe3);border-radius:7px;background:repeating-linear-gradient(to bottom,#fff 0,#fff 28px,#d9dce3 29px)}
      .cum-score{margin-top:20px;padding:18px;border:2px solid var(--navy,#172033);border-radius:7px;background:#fff}.cum-score-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.cum-score-grid div{min-height:48px;border:1px solid var(--line,#d8dbe3);border-radius:7px;padding:10px}.cum-subject-nav{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin:12px 0 20px}.cum-subject-nav a{font-size:.78rem;text-decoration:none;border:1px solid var(--line,#d8dbe3);border-radius:999px;padding:.3rem .58rem;color:inherit}
      @media(max-width:800px){.cum-stats,.cum-score-grid{grid-template-columns:1fr 1fr}.cum-focus-grid{grid-template-columns:1fr}.cum-week>summary,.cum-subject>summary{flex-direction:column;align-items:flex-start}}
      @media(max-width:520px){.cum-stats,.cum-score-grid{grid-template-columns:1fr}}
      @media print{.no-print,.cum-actions,.cum-subject-nav{display:none!important}.cum-subject{border:0}.cum-subject>summary{display:block;border-bottom:1px solid #999}.cum-subject:not([open])>.cum-subject-body{display:block!important}.cum-response{min-height:95px}.cum-note{border-color:#999}}
    `;
    document.head.appendChild(style);
  }
  function identity(root){const row=node("div","name-date cum-identity");row.append(node("div","fill-box","Name:"),node("div","fill-box","Date:"));root.appendChild(row)}
  function title(root,titleText,subtitle){
    const head=node("div","cum-head");head.append(node("p","kicker",isMidterm?"Grade 7 · Midyear":"Grade 7 · Final"),node("h1","",titleText),node("p","",subtitle));root.appendChild(head);
  }
  function downloadText(filename,content){const blob=new Blob([content],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
  function reviewText(state){
    const lines=[`${isMidterm?"Grade 7 Midyear":"Grade 7 Final"} Review Guide`,`Coverage: Weeks 01–${pad(coverageEnd)}`,`Mastery standard: ${MIN}%`,""];
    for(const week of (DATA?.weeks||[]).filter(w=>Number(w.week)<=coverageEnd)){
      const score=scoreFor(state,week.week);lines.push(`Week ${pad(week.week)} · ${week.title} · ${score===null?"not yet recorded":`${Math.round(score)}%`}`);
      const map=weekMap(week.week);for(const subject of DATA?.subjects||[]){const cell=map?.subjects?.[subject.id];if(cell)lines.push(`  ${subject.title}: ${cell.focus} — ${cell.assessmentTarget}`)}lines.push("");
    }
    return lines.join("\n");
  }
  function examText(items){
    const lines=[`${isMidterm?"Grade 7 Midterm":"Grade 7 Final"} · Canonical Cumulative Assessment`,`Coverage: Weeks 01–${pad(coverageEnd)}`,`Items: ${itemCount}; passing: ${passingItems}/${itemCount} (${MIN}% minimum).`,""];
    for(const item of items)lines.push(`${item.number}. Week ${pad(item.week)} · ${item.subjectTitle} · ${item.focus}\n${item.prompt}\nEvidence direction: ${item.evidence}\n`);
    lines.push("","Met: ____ / "+itemCount,"Percent: ____ %","Adult reviewer: ______________________________");return lines.join("\n");
  }
  function actions(root,downloadLabel,downloadHandler,examHref){
    const row=node("div","cum-actions no-print");row.append(link("Back to Grade 7","../index.html","button"));
    if(isReview)row.append(link(isMidterm?"Open Official Midterm":"Open Official Final",examHref,"button gold"));
    else row.append(link("Open Review Center",isMidterm?"midterm-review.html":"final-review.html","button"));
    const print=node("button","button gold","Print / Save PDF");print.type="button";print.addEventListener("click",()=>window.print());
    const download=node("button","button",downloadLabel);download.type="button";download.addEventListener("click",downloadHandler);row.append(print,download);root.appendChild(row);
  }
  function statusBadge(score){
    if(score===null)return node("span","cum-status cum-pending","Not yet recorded");
    if(score>=MIN)return node("span","cum-status cum-good",`${Math.round(score)}% · Mastered`);
    return node("span","cum-status cum-review",`${Math.round(score)}% · Study focus`);
  }
  function renderReview(root){
    const state=readState();
    title(root,isMidterm?"Midyear Review Center":"Final Course Review",isMidterm?`Refresh Weeks 01–${pad(coverageEnd)} before the official Midterm.`:`Refresh the full ${coverageEnd}-week Grade 7 course before the official Final.`);
    identity(root);
    actions(root,"Download Review Guide",()=>downloadText(`grade-07-${isMidterm?"midyear":"final"}-review-guide.txt`,reviewText(state)),isMidterm?"midterm.html":"final-exam.html");
    root.append(node("p","cum-note",`This is a recommended, non-graded review space. It reads the existing learner record only to help prioritize study. It cannot award mastery, change grades, alter placement, or unlock the official assessment. The official cumulative score remains adult/Academy-reviewed and must meet ${MIN}%.`));
    const covered=(DATA?.weeks||[]).filter(w=>Number(w.week)<=coverageEnd),scores=covered.map(w=>scoreFor(state,w.week));
    const mastered=scores.filter(s=>s!==null&&s>=MIN).length,focus=scores.filter(s=>s!==null&&s<MIN).length,pending=scores.filter(s=>s===null).length;
    const stats=node("div","cum-stats");for(const [value,label] of [[coverageEnd,"Weeks covered"],[mastered,"Weeks at 80%+"],[focus,"Study-focus weeks"],[pending,"Scores not recorded"]]){const card=node("div","cum-stat");card.append(node("strong","",value),node("span","",label));stats.appendChild(card)}root.appendChild(stats);
    const ordered=covered.slice().sort((a,b)=>{const sa=scoreFor(state,a.week),sb=scoreFor(state,b.week),rank=s=>s===null?1:s<MIN?0:2;return rank(sa)-rank(sb)||a.week-b.week});
    const list=node("div","cum-week-list");
    for(const week of ordered){
      const details=node("details","cum-week");const summary=node("summary");summary.append(node("span","",`Week ${pad(week.week)} · ${week.title}`),statusBadge(scoreFor(state,week.week)));details.appendChild(summary);
      const body=node("div","cum-week-body");body.append(node("p","",week.essentialQuestion?`Essential question: ${week.essentialQuestion}`:""));
      const map=weekMap(week.week),grid=node("div","cum-focus-grid");for(const subject of DATA?.subjects||[]){const cell=map?.subjects?.[subject.id];if(!cell)continue;const box=node("div","cum-focus");box.append(node("strong","",subject.title),node("span","",cell.focus));grid.appendChild(box)}body.appendChild(grid);
      const row=node("div","actions");row.append(link("Open Integrated Week",`../weekly-plans/week-${pad(week.week)}.html`,`button gold`),link("Evidence Packet",`../evidence/weekly-evidence-packet.html?week=${pad(week.week)}`,"button"));body.appendChild(row);details.appendChild(body);list.appendChild(details);
    }
    root.appendChild(list);
    const finish=node("div","cum-actions no-print");finish.style.marginTop="22px";finish.append(link(isMidterm?"I’m Ready for the Official Midterm":"I’m Ready for the Official Final",isMidterm?"midterm.html":"final-exam.html","button gold"));root.appendChild(finish);
  }
  function renderExam(root){
    const items=assessmentItems();
    title(root,isMidterm?"Seventh Grade Midyear Subject Demonstration":"Seventh Grade Final Readiness Demonstration",`Canonical cumulative assessment · Weeks 01–${pad(coverageEnd)} · ${itemCount} items · ${MIN}% minimum`);
    identity(root);
    actions(root,"Download Assessment Copy",()=>downloadText(`grade-07-${examType}-canonical-assessment.txt`,examText(items)),"");
    root.append(node("p","cum-note",`Official adult-reviewed cumulative assessment. Each item is worth one point. Passing requires at least ${passingItems}/${itemCount} items (${MIN}%). This page does not write a score to the learner record. After authorized review, record the official percentage in the Grade 7 learner record.`));
    const nav=node("nav","cum-subject-nav no-print");
    const grouped=new Map();for(const subject of DATA?.subjects||[])grouped.set(subject.id,[]);for(const item of items)grouped.get(item.subjectId)?.push(item);
    for(const subject of DATA?.subjects||[]){const group=grouped.get(subject.id)||[];if(group.length)nav.appendChild(link(`${subject.title} · ${group.length}`,`#cum-${subject.id}`,""))}root.appendChild(nav);
    const sections=node("div","cum-subject-sections");let opened=false;
    for(const subject of DATA?.subjects||[]){
      const group=grouped.get(subject.id)||[];if(!group.length)continue;
      const details=node("details","cum-subject");details.id=`cum-${subject.id}`;if(!opened){details.open=true;opened=true}
      const summary=node("summary");summary.append(node("span","",subject.title),node("span","cum-status",`${group.length} item${group.length===1?"":"s"}`));details.appendChild(summary);
      const body=node("div","cum-subject-body");
      for(const item of group){const q=node("article","cum-item");q.append(node("h3","",`Item ${item.number}`),node("p","meta",`Week ${pad(item.week)} · ${item.focus}`),node("p","prompt",item.prompt),node("p","evidence-direction",`Evidence direction: ${item.evidence}`),node("div","cum-response"));body.appendChild(q)}
      details.appendChild(body);sections.appendChild(details);
    }
    root.appendChild(sections);
    const score=node("section","cum-score");score.append(node("h2","","Authorized Adult Review"),node("p","",`Score one point for each item that satisfactorily demonstrates the stated target. Passing requires ${passingItems}/${itemCount} (${MIN}%).`));
    const grid=node("div","cum-score-grid");grid.append(node("div","",`Met: ____ / ${itemCount}`),node("div","","Percent: ____ %"),node("div","",`Passing: ${passingItems}/${itemCount}`),node("div","","Mastery: ☐ Met  ☐ Not yet"));score.appendChild(grid);score.append(node("p","","Adult reviewer: ____________________________________"),node("p","","Feedback / next step: ______________________________________________________________"));root.appendChild(score);
  }

  styles();
  const mount=document.getElementById("canonicalCumulativeMount");
  if(!mount||!DATA||!CROSSWALK){if(mount)mount.textContent="This Grade 7 cumulative page could not load its canonical curriculum data.";return}
  document.title=`Grade 7 · ${isMidterm?"Midyear":"Final"} · ${isReview?"Review Center":"Official Assessment"}`;
  const shell=node("div","cum-shell");
  if(isReview)renderReview(shell);else renderExam(shell);
  mount.replaceChildren(shell);

  window.KhaemenesGrade7Cumulative=Object.freeze({version:VERSION,midyearBoundary,buildPool,selectEven,assessmentItems,coverageEnd,itemCount,passingItems});
})();
