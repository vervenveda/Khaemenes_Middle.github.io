(() => {
  "use strict";

  const $=id=>document.getElementById(id);
  const clean=(value,max=120)=>String(value??"").replace(/[\u0000-\u001F\u007F]/g,"").trim().slice(0,max);
  const normalizeGrade=value=>{
    const raw=clean(value,40).toLowerCase().replace(/[_\s]+/g,"-");
    const m=raw.match(/(?:grade-?)?0?([678])\b/);
    return m?`grade-0${m[1]}`:"";
  };
  const params=new URLSearchParams(location.search);
  const entry=clean(params.get("entry"),60);

  function activeLearner(){
    try{return window.KhaemenesFamilyRegistry?.getLearner?.()||null}catch{return null}
  }

  function resolveContext(){
    const learner=activeLearner();
    const stage=clean(learner?.stage,40).toLowerCase();
    const grade=normalizeGrade(learner?.grade||learner?.gradeLevel);
    const nickname=clean(learner?.nickname||learner?.displayName||"Scholar",80);
    const formalMiddle=stage==="middle"&&["grade-06","grade-07","grade-08"].includes(grade);
    const grade05=stage==="elementary"&&grade==="grade-05";
    const preview=entry==="grade05-advanced-preview";
    const transition=entry==="grade05-transition";
    return {learner,stage,grade,nickname,formalMiddle,grade05,preview,transition};
  }

  function resolveMentor(ctx){
    if(!ctx.learner)return {name:"Archaemenes",presentation:"Academy Scholar",delegated:false};
    const router=window.KhaemenesNAIB;
    try{
      const delegated=router?.delegate?.({
        stage:ctx.formalMiddle?"middle":ctx.stage||undefined,
        grade:ctx.grade||undefined,
        ageBand:clean(ctx.learner.ageBand,40)||undefined,
        interests:Array.isArray(ctx.learner.interests)?ctx.learner.interests.slice(0,16):[],
        surface:"khaemenes-middle-home",
        intent:ctx.preview?"advanced middle school preview":"middle school learning"
      });
      if(delegated?.status==="delegated"&&delegated?.specialist?.id==="archaemenes")return {name:"Archaemenes",presentation:ctx.preview?"Young Scholar → Academy Scholar Preview":"Academy Scholar",delegated:true};
    }catch{}
    return {name:"Archaemenes",presentation:ctx.preview?"Young Scholar → Academy Scholar Preview":"Academy Scholar",delegated:false};
  }

  function routeForGrade(grade){
    return grade==="grade-06"?"grades/grade-06/":grade==="grade-07"?"grades/grade-07/":grade==="grade-08"?"grades/grade-08/":"#grades";
  }

  function renderEntry(){
    const ctx=resolveContext();
    const mentor=resolveMentor(ctx);
    const card=$("entryStatus"),title=$("entryTitle"),text=$("entryText"),primary=$("entryPrimary"),secondary=$("entrySecondary");
    if(!card||!title||!text||!primary||!secondary)return;
    card.dataset.mode="neutral";

    if(ctx.preview){
      card.dataset.mode="preview";
      title.textContent=ctx.grade05?`Welcome to your Grade 06 preview, ${ctx.nickname}.`:"Advanced Grade 06 Preview";
      text.textContent="This is enrichment and readiness exploration only. Formal placement remains unchanged, Grade 06 mastery records stay locked unless the Academy Family Registry later reports Middle School / Grade 06, and no promotion occurs from this page.";
      primary.href="grades/grade-06/";primary.textContent="Preview Grade 06 Curriculum";
      secondary.href="https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-05/#middle-bridge";secondary.textContent="Return to Grade 05 Bridge";
    }else if(ctx.transition){
      card.dataset.mode="preview";
      title.textContent=ctx.grade05?`Middle School transition center for ${ctx.nickname}`:"Grade 05 → Middle School Transition";
      text.textContent="Use this campus to understand Grade 06 expectations and plan the next step. Formal promotion still happens only through the Academy/family placement process.";
      primary.href="grades/grade-06/";primary.textContent="Explore Grade 06";
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Review Family Profile";
    }else if(ctx.formalMiddle){
      card.dataset.mode="formal";
      const label=ctx.grade.replace("grade-0","");
      title.textContent=`Welcome back, ${ctx.nickname}. Grade ${label} is ready.`;
      text.textContent=`Your Academy Family Profile currently places you in ${ctx.grade}. Archaemenes continues here as Academy Scholar, and formal course records remain inside the Grade ${label} portal.`;
      primary.href=routeForGrade(ctx.grade);primary.textContent=`Enter Grade ${label}`;
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Open Family Profile";
    }else if(ctx.grade05){
      card.dataset.mode="preview";
      title.textContent=`Welcome, ${ctx.nickname}. You are still formally in Grade 05.`;
      text.textContent="Middle School may be explored for planning and challenge, but Grade 06 formal records remain unavailable until placement is deliberately changed in the Academy Family Profile.";
      primary.href="?entry=grade05-advanced-preview#bridge-entry";primary.textContent="Open Grade 06 Preview";
      secondary.href="https://vervenveda.com/Khaemenes_Elementary.github.io/grades/grade-05/#middle-bridge";secondary.textContent="Return to Grade 05";
    }else{
      title.textContent="Choose the correct Middle School doorway.";
      text.textContent="Select an Academy learner in the Family Profile, or browse the Grade 06–08 curriculum. This landing page never invents formal placement and never writes gradebook records.";
      primary.href="#grades";primary.textContent="Choose a Grade";
      secondary.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";secondary.textContent="Open Family Profile";
    }

    const mentorText=$("mentorStatus");
    if(mentorText)mentorText.textContent=`${mentor.name} · ${mentor.presentation}${mentor.delegated?" · delegated through NAIB":""}`;
  }

  const resources=[
    {title:"Khaemenes Academy",kind:"Academy",description:"Family profiles, school-stage continuity, and Academy-wide pathways.",url:"https://vervenveda.com/Khaemenes_Academy.github.io/"},
    {title:"ARSHIF",kind:"Research",description:"History, literature, culture, archives, and deeper research halls.",url:"https://vervenveda.com/Arshif.github.io/"},
    {title:"The Refrain",kind:"Music",description:"Music learning, composition, listening, and creative sound work.",url:"https://vervenveda.com/the_refrain.github.io/"},
    {title:"Arcade",kind:"Practice",description:"Strategy, puzzles, trivia, logic, and playful learning resources.",url:"https://vervenveda.com/arcade.github.io/"},
    {title:"ProReSources",kind:"Tools",description:"Writing, coding, design, productivity, and project tools.",url:"https://vervenveda.com/proresource_hub.github.io/"},
    {title:"The Verifier",kind:"Media Literacy",description:"Source comparison, current events, verification, and information literacy.",url:"https://vervenveda.com/theverifier.github.io/"},
    {title:"PLERA Search",kind:"Research",description:"Research and discovery gateway for public learning resources.",url:"https://vervenveda.com/PLERASearch.github.io/"},
    {title:"Khaemenes High School",kind:"Next Stage",description:"Grades 9–12 courses and the next formal Academy campus.",url:"https://vervenveda.com/Khaemenes_High.github.io/"}
  ];

  function renderResources(){
    const grid=$("resourceGrid"),search=$("resourceSearch"),kind=$("resourceKind"),clear=$("clearResources");
    if(!grid||!search||!kind)return;
    const kinds=[...new Set(resources.map(r=>r.kind))].sort();
    for(const k of kinds){const option=document.createElement("option");option.value=k;option.textContent=k;kind.append(option)}
    const draw=()=>{
      const q=clean(search.value,100).toLowerCase(),k=kind.value;
      const list=resources.filter(r=>(!k||r.kind===k)&&(!q||`${r.title} ${r.kind} ${r.description}`.toLowerCase().includes(q)));
      grid.replaceChildren();
      for(const r of list){
        const article=document.createElement("article");article.className="card resource-card";
        const emblem=document.createElement("div");emblem.className="emblem";emblem.textContent=r.kind.slice(0,2).toUpperCase();
        const h=document.createElement("h3");h.textContent=r.title;
        const p=document.createElement("p");p.textContent=r.description;
        const a=document.createElement("a");a.className="button";a.href=r.url;a.textContent="Open Resource";a.referrerPolicy="no-referrer";
        article.append(emblem,h,p,a);grid.append(article);
      }
      const count=$("resourceCount");if(count)count.textContent=`${list.length} resource${list.length===1?"":"s"} shown`;
    };
    search.addEventListener("input",draw);
    kind.addEventListener("change",draw);
    clear?.addEventListener("click",()=>{search.value="";kind.value="";draw();search.focus();});
    draw();
  }

  function bind(){
    if($("year"))$("year").textContent=String(new Date().getFullYear());
    renderEntry();renderResources();
    window.addEventListener("khaemenes-family-changed",renderEntry);
    window.addEventListener("khaemenes-naib-ready",renderEntry);
    window.addEventListener("storage",renderEntry);
  }
  document.addEventListener("DOMContentLoaded",bind);
})();
