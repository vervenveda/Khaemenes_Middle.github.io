(()=>{
  "use strict";
  const CONTRACT_URL = new URL("../mentor-contract.json", document.currentScript?.src || location.href).href;
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const context=()=>{
    const p=location.pathname.toLowerCase();
    if(p.includes("arts-music")) return "arts-music";
    if(p.includes("language-arts")) return "language-arts";
    if(p.includes("visual-art")||p.includes("/art/")) return "visual-art";
    if(p.includes("music")) return "music";
    if(p.includes("history")||p.includes("social")) return "history";
    if(p.includes("research")) return "research";
    return "general";
  };
  function style(){
    if(document.getElementById("khaeMentorStyle"))return;
    const s=document.createElement("style");s.id="khaeMentorStyle";s.textContent=`
    .khae-mentor-section{padding:56px 20px;background:#f8f5ee;border-block:1px solid rgba(18,23,19,.14)}
    .khae-mentor-shell{width:min(calc(100% - 20px),1100px);margin:auto;text-align:center}
    .khae-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px}
    .khae-mentor-card{padding:22px;border:1px solid rgba(18,23,19,.14);border-radius:11px;background:#fff;box-shadow:0 11px 33px rgba(27,34,29,.07)}
    .khae-mentor-card h3{margin:0 0 8px;color:#15251f;font-family:Georgia,serif;font-size:24px}
    .khae-mentor-card p{margin:7px 0;color:#4e5c57}
    .khae-mentor-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px}
    .khae-mentor-button{min-height:42px;padding:9px 14px;border:1px solid #243d33;border-radius:7px;background:#243d33;color:#fff;font-weight:700;cursor:pointer}
    .khae-mentor-button.secondary{background:#fff;color:#243d33}
    .khae-mentor-note{margin-top:18px;color:#66716c;font-size:12px}
    .khae-mentor-panel{margin:18px auto 0;max-width:820px;padding:16px;border-left:3px solid #b48b45;border-radius:7px;background:#fff;text-align:left}
    @media(max-width:720px){.khae-mentor-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }
  function specialists(contract,ctx){
    if(ctx==="arts-music") return contract.specialists.filter(x=>(x.contexts||[]).includes("visual-art")||(x.contexts||[]).includes("music"));
    return contract.specialists.filter(x=>(x.contexts||[]).includes(ctx));
  }
  function render(contract){
    if(document.getElementById("khaeMentors"))return;
    style();
    const host=document.createElement("section");host.id="khaeMentors";host.className="khae-mentor-section no-print";
    const ss=specialists(contract,context());
    host.innerHTML=`<div class="khae-mentor-shell">
      <p style="margin:0;color:#b48b45;letter-spacing:.14em;text-transform:uppercase;font-size:11px;font-weight:700">Middle School Mentor Team</p>
      <h2 style="margin:8px 0 0;color:#15251f;font-family:Georgia,serif;font-size:clamp(32px,4vw,48px)">Support without taking over.</h2>
      <p style="max-width:760px;margin:12px auto;color:#4e5c57">Archaemenes supports academic growth. Hope supports the student. When another specialty is a better fit, the mentor team hands off without changing identities or authority.</p>
      <div class="khae-mentor-grid">
        <article class="khae-mentor-card"><h3>Archaemenes</h3><p><strong>Educational Mentor</strong></p><p>Study strategy, lesson support, mastery reflection, planning, and high-school readiness.</p><div class="khae-mentor-actions"><button class="khae-mentor-button" data-mentor="archaemenes">Ask for academic guidance</button></div></article>
        <article class="khae-mentor-card"><h3>Hope</h3><p><strong>School Counselor & Student Support</strong></p><p>School stress, belonging, friendship concerns, family circumstances affecting school, transitions, encouragement, and support navigation.</p><div class="khae-mentor-actions"><button class="khae-mentor-button" data-mentor="hope">Open student support</button></div></article>
      </div>
      ${ss.length?`<div class="khae-mentor-panel"><strong>Contextual specialist${ss.length>1?"s":""}:</strong> ${ss.map(s=>`${esc(s.name)} · ${esc(s.role)}`).join(" &nbsp;|&nbsp; ")}. ${ss.length>1?"These specialists are":"This specialist is"} suggested because of the current subject context.</div>`:""}
      <div id="khaeMentorResponse" class="khae-mentor-panel" hidden></div>
      <p class="khae-mentor-note">Mentors do not change grades, placement, discipline, certificates, or protected records. Mastery comes from recorded course evidence.</p>
    </div>`;
    const main=document.querySelector("main");
    if(main) main.insertBefore(host,main.firstChild); else document.body.appendChild(host);
    host.querySelectorAll("[data-mentor]").forEach(btn=>btn.addEventListener("click",()=>{
      const box=host.querySelector("#khaeMentorResponse"),id=btn.dataset.mentor;
      box.hidden=false;
      box.innerHTML=id==="archaemenes"?`<strong>Archaemenes:</strong> Start with the course evidence. What lesson, skill, or assignment are you working on, and what part is unclear? I can help organize the next academic step without changing your grade or record.`:`<strong>Hope:</strong> You can start with one sentence about what is making school harder today. I can help you organize the concern, find a manageable next step, or point toward another appropriate support doorway. This page does not create a counseling record.`;
      box.scrollIntoView({behavior:"smooth",block:"nearest"});
    }));
  }
  fetch(CONTRACT_URL,{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(render).catch(()=>{});
})();