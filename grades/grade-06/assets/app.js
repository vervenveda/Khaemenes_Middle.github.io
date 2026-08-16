(() => {
  "use strict";
  const DATA=window.KHAE_GRADE6_DATA;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function summary(){return window.KhaemenesGrade6Continuity?.getSummary?.()||null;}

  function renderDashboard(){
    const s=summary();
    const state=s?.state||{};
    const learner=s?.learner;
    const mentor=s?.mentor||{name:"Archaemenes"};
    const status=$("summary");
    if(!status)return;
    status.replaceChildren();

    const grid=document.createElement("div");
    grid.className="grid cols-4";
    const stats=[
      [`${s?.mastered||0}/36`,`Verified weeks at 80%+`],
      [`${s?.average||0}%`,`Weekly average`],
      [`${state.midterm||0}%`,`Midterm`],
      [`${state.final||0}%`,`Final`]
    ];
    for(const [value,label] of stats){
      const article=document.createElement("article");
      article.className="card stat";
      const strong=document.createElement("strong");strong.textContent=value;
      const span=document.createElement("span");span.textContent=label;
      article.append(strong,span);grid.append(article);
    }

    const box=document.createElement("div");
    box.className="profile-box";
    box.style.marginTop="16px";
    const h=document.createElement("h3");
    h.textContent=s?.certificateReady?"Certificate Ready":"Certificate Locked";
    const p=document.createElement("p");
    if(!s?.eligible){
      p.textContent="Select the Academy learner formally placed in Grade 06. Formal mastery records stay unavailable until the correct learner is active.";
    }else if(s.certificateReady){
      p.textContent="All Grade 06 completion gates are met. The learner-scoped certificate may be opened and printed.";
    }else{
      p.textContent="Certification requires 36/36 verified weekly mastery results at 80%+, midterm 80%+, final 80%+, and approved portfolio evidence.";
    }
    const identity=document.createElement("p");
    identity.textContent=s?.eligible
      ?`${learner.nickname} · Grade 06 · ${mentor.name} · Academy Scholar`
      :"No eligible Grade 06 learner is currently connected.";
    const actions=document.createElement("div");actions.className="actions";
    const certificate=document.createElement("a");certificate.className=`button ${s?.certificateReady?"gold":""}`;certificate.href="records/certificate.html";certificate.textContent="Open Certificate";
    const teacher=document.createElement("a");teacher.className="button";teacher.href="teacher-tools/index.html";teacher.textContent="Adult Verification";
    actions.append(certificate,teacher);
    box.append(h,p,identity,actions);
    status.append(grid,box);
  }

  function renderWeeks(){
    const grid=$("weekGrid");
    if(!grid)return;
    grid.replaceChildren();
    const s=summary();
    const weekly=s?.state?.weekly||{};
    for(const w of DATA.weeks){
      const article=document.createElement("article");
      article.className="card week-card";
      const emblem=document.createElement("div");emblem.className="emblem";emblem.textContent=String(w.week).padStart(2,"0");
      const h=document.createElement("h3");h.textContent=w.title;
      const q=document.createElement("p");const qStrong=document.createElement("strong");qStrong.textContent="Question: ";q.append(qStrong,document.createTextNode(w.essentialQuestion));
      const theme=document.createElement("p");theme.textContent=w.theme;
      const badges=document.createElement("div");badges.className="badges";
      ["9 subjects","45 blocks","A++",Number(weekly[w.week]||0)>=80?"Verified mastery":"Evidence pending"].forEach(text=>{const b=document.createElement("span");b.className="badge";b.textContent=text;badges.append(b)});
      const actions=document.createElement("div");actions.className="actions";
      const open=document.createElement("a");open.className="button";open.href=`weekly-plans/week-${String(w.week).padStart(2,"0")}.html`;open.textContent="Open Week";
      const printable=document.createElement("a");printable.className="button light";printable.href=`printables/week-${String(w.week).padStart(2,"0")}-packet.html`;printable.textContent="Printable";
      actions.append(open,printable);
      article.append(emblem,h,q,theme,badges,actions);grid.append(article);
    }
  }

  function renderSubjects(){
    const grid=$("subjectGrid");
    if(!grid)return;
    grid.replaceChildren();
    for(const s of DATA.subjects){
      const article=document.createElement("article");article.className="card";article.style.borderTop=`5px solid ${s.color}`;
      const emblem=document.createElement("div");emblem.className="emblem";emblem.textContent=s.icon;
      const h=document.createElement("h3");h.textContent=s.title;
      const p=document.createElement("p");p.textContent=s.description;
      const a=document.createElement("a");a.className="button";a.href=`subjects/${encodeURIComponent(s.id)}/index.html`;a.textContent="Open Subject Hall";
      article.append(emblem,h,p,a);grid.append(article);
    }
  }

  function render(){renderDashboard();renderSubjects();renderWeeks();}
  document.addEventListener("DOMContentLoaded",()=>{
    if($("year"))$("year").textContent=new Date().getFullYear();
    render();
    window.KhaemenesGrade6Continuity?.subscribe?.(render);
  });
})();
