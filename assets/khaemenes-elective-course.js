(function attachKhaemenesElectiveCourse(global){
  "use strict";

  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const cfg=global.KHAEMENES_ELECTIVE||{};
  const root=document.getElementById("electiveApp");
  const pinButton=document.getElementById("pinCourse");
  const learnerStatus=document.getElementById("learnerStatus");

  function learner(){return global.KhaemenesFamilyRegistry?.getLearner?.()||null}
  function renderLearner(){
    if(!learnerStatus)return;
    const l=learner();
    if(!l){learnerStatus.textContent="No active Academy learner is selected. You may preview this class, but pinning requires a learner profile.";return}
    learnerStatus.textContent=`Active learner: ${l.nickname||"Learner"}${l.grade?` · Grade ${String(l.grade).replace(/^0/,"")}`:""}. This elective does not change placement or mastery by itself.`;
  }
  function bindPin(){
    const P=global.KhaemenesMiddleCoursePins;
    if(!P||!pinButton)return;
    P.bindButton(pinButton,{
      id:cfg.courseId,
      title:cfg.title,
      subtitle:cfg.subtitle||"13-week Middle School elective",
      href:location.href,
      type:"elective"
    });
  }
  function weekCard(w){
    const title=w.title||w.theme||w.week_title||`Week ${w.week||""}`;
    const focus=w.essential_question||w.essentialQuestion||w.focus||w.overview||w.objective||"";
    const lessons=Array.isArray(w.lessons)?w.lessons:[];
    return `<article class="week-card"><p class="kicker">Week ${esc(w.week||"")}</p><h3>${esc(title)}</h3>${focus?`<p>${esc(focus)}</p>`:""}${lessons.length?`<details><summary>Open ${lessons.length} lesson${lessons.length===1?"":"s"}</summary><ol>${lessons.map(l=>`<li><strong>${esc(l.title||l.lesson_title||l.day||"Lesson")}</strong>${l.objective?` — ${esc(l.objective)}`:""}</li>`).join("")}</ol></details>`:""}</article>`;
  }
  async function load(){
    renderLearner();
    bindPin();
    if(!root)return;
    root.innerHTML='<div class="notice">Loading course plan…</div>';
    try{
      const response=await fetch(cfg.json,{cache:"no-store"});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      const m=data.metadata||{};
      const goals=Array.isArray(data.course_goals)?data.course_goals:[];
      const weeks=Array.isArray(data.weeks)?data.weeks:[];
      root.innerHTML=`
        <section class="course-overview">
          <div class="stat-grid">
            <div class="stat"><strong>${esc(m.duration_weeks||weeks.length||13)}</strong><span>Weeks</span></div>
            <div class="stat"><strong>${esc(m.total_lessons||"")}</strong><span>Lessons</span></div>
            <div class="stat"><strong>${esc(m.weekly_quizzes||"")}</strong><span>Weekly Checks</span></div>
            <div class="stat"><strong>${esc(m.final_assessment||1)}</strong><span>Final</span></div>
          </div>
          ${goals.length?`<div class="panel"><h2>Course Goals</h2><ul>${goals.map(g=>`<li>${esc(g)}</li>`).join("")}</ul></div>`:""}
        </section>
        <section><div class="section-heading"><p class="kicker">Course Map</p><h2>13-week learning path</h2><p>Open each week to review the course sequence. Formal grading remains with the course assessment rules and teacher/Academy process.</p></div><div class="weeks">${weeks.map(weekCard).join("")}</div></section>`;
    }catch(err){
      root.innerHTML=`<div class="notice error"><strong>Course plan unavailable.</strong><br>${esc(err.message||"Unable to load course JSON.")}</div>`;
    }
  }
  global.addEventListener("khaemenes-family-changed",renderLearner);
  load();
})(window);
