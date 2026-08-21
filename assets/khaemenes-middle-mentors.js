(()=>{
  "use strict";

  /*
   * Khaemenes Academy Middle School mentor surface
   * v2.0 — responsive conversation layer
   *
   * Important boundary:
   * - This public client never stores passwords, tokens, protected records, or mentor transcripts.
   * - If a protected mentor transport is installed at window.KhaemenesMentorTransport.ask(),
   *   the client may use it. Otherwise it provides an immediate local, context-aware mentor response.
   * - Mentors cannot alter grades, placement, discipline, certificates, or protected records.
   */

  const CONTRACT_URL = new URL("../mentor-contract.json", document.currentScript?.src || location.href).href;
  const MAX_INPUT = 1200;
  const MAX_TURNS = 12;
  const conversations = { archaemenes: [], hope: [] };

  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const clean=v=>String(v??"").replace(/\s+/g," ").trim();

  function context(){
    const p=location.pathname.toLowerCase();
    if(p.includes("mathemat")) return "mathematics";
    if(p.includes("science")) return "science";
    if(p.includes("arts-music")) return "arts-music";
    if(p.includes("language-arts")||p.includes("english")||p.includes("ela")) return "language-arts";
    if(p.includes("visual-art")||p.includes("/art/")) return "visual-art";
    if(p.includes("music")) return "music";
    if(p.includes("history")||p.includes("social")) return "history";
    if(p.includes("research")) return "research";
    if(p.includes("technology")||p.includes("coding")||p.includes("computer")) return "technology";
    if(p.includes("health")||p.includes("physical")||p.includes("sel")) return "health";
    return "general";
  }

  function gradeContext(){
    const m=location.pathname.match(/grade[-_/ ]?0?([678])/i);
    return m ? `grade-0${m[1]}` : "middle-school";
  }

  function pageContext(){
    const heading=clean(document.querySelector("h1")?.textContent || document.title || "").slice(0,160);
    const sub=clean(document.querySelector("main h2, main .subtitle, main .lead")?.textContent || "").slice(0,220);
    return {
      school:"Khaemenes Academy Middle School",
      grade:gradeContext(),
      subject:context(),
      pageTitle:heading,
      pageSummary:sub,
      path:location.pathname
    };
  }

  function style(){
    if(document.getElementById("khaeMentorStyle"))return;
    const s=document.createElement("style");
    s.id="khaeMentorStyle";
    s.textContent=`
    .khae-mentor-section{padding:56px 20px;background:#f8f5ee;border-block:1px solid rgba(18,23,19,.14)}
    .khae-mentor-shell{width:min(calc(100% - 20px),1100px);margin:auto;text-align:center}
    .khae-mentor-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:24px}
    .khae-mentor-card{padding:22px;border:1px solid rgba(18,23,19,.14);border-radius:11px;background:#fff;box-shadow:0 11px 33px rgba(27,34,29,.07)}
    .khae-mentor-card h3{margin:0 0 8px;color:#15251f;font-family:Georgia,serif;font-size:24px}
    .khae-mentor-card p{margin:7px 0;color:#4e5c57}
    .khae-mentor-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:14px}
    .khae-mentor-button{min-height:42px;padding:9px 14px;border:1px solid #243d33;border-radius:7px;background:#243d33;color:#fff;font-weight:700;cursor:pointer}
    .khae-mentor-button.secondary{background:#fff;color:#243d33}
    .khae-mentor-button:disabled{opacity:.58;cursor:wait}
    .khae-mentor-note{margin-top:18px;color:#66716c;font-size:12px;line-height:1.55}
    .khae-mentor-panel{margin:18px auto 0;max-width:820px;padding:16px;border-left:3px solid #b48b45;border-radius:7px;background:#fff;text-align:left}
    .khae-chat{margin:20px auto 0;max-width:880px;padding:18px;border:1px solid rgba(18,23,19,.14);border-radius:11px;background:#fff;text-align:left;box-shadow:0 11px 33px rgba(27,34,29,.06)}
    .khae-chat[hidden]{display:none}
    .khae-chat-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px}
    .khae-chat-head h3{margin:0;color:#15251f;font:700 23px/1.2 Georgia,serif}
    .khae-chat-head p{margin:4px 0 0;color:#66716c;font-size:13px}
    .khae-chat-close{border:0;background:transparent;color:#5d6864;font-size:20px;cursor:pointer;padding:3px 7px}
    .khae-chat-log{display:grid;gap:10px;max-height:420px;overflow:auto;padding:4px 2px 12px;scroll-behavior:smooth}
    .khae-msg{max-width:88%;padding:11px 13px;border-radius:11px;line-height:1.55;font-size:14px;white-space:pre-wrap}
    .khae-msg.student{justify-self:end;background:#edf4f1;color:#24352e;border-bottom-right-radius:3px}
    .khae-msg.mentor{justify-self:start;background:#fbf7ee;color:#28332f;border:1px solid #eadfc9;border-bottom-left-radius:3px}
    .khae-msg .name{display:block;margin-bottom:4px;color:#8a6a34;font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}
    .khae-chat-prompts{display:flex;gap:7px;flex-wrap:wrap;margin:2px 0 12px}
    .khae-prompt-chip{border:1px solid #cfdad5;border-radius:999px;background:#fff;color:#294239;padding:7px 10px;font-size:12px;font-weight:700;cursor:pointer}
    .khae-chat-form{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:end}
    .khae-chat-form textarea{width:100%;min-height:82px;max-height:180px;resize:vertical;padding:11px 12px;border:1px solid #becbc6;border-radius:8px;color:#17241f;background:#fff;font:inherit;line-height:1.45}
    .khae-chat-form textarea:focus{outline:3px solid rgba(180,139,69,.22);border-color:#8c713f}
    .khae-chat-status{min-height:18px;margin:8px 0 0;color:#66716c;font-size:12px}
    .khae-context-pill{display:inline-block;margin:0 4px 4px 0;padding:4px 8px;border-radius:999px;background:#eef3f0;color:#53635d;font-size:11px;font-weight:700}
    @media(max-width:720px){.khae-mentor-grid{grid-template-columns:1fr}.khae-chat-form{grid-template-columns:1fr}.khae-chat-form .khae-mentor-button{width:100%}.khae-msg{max-width:96%}}
    `;
    document.head.appendChild(s);
  }

  function specialists(contract,ctx){
    if(ctx==="arts-music") return contract.specialists.filter(x=>(x.contexts||[]).includes("visual-art")||(x.contexts||[]).includes("music"));
    return contract.specialists.filter(x=>(x.contexts||[]).includes(ctx));
  }

  function subjectLabel(subject){
    return ({
      mathematics:"mathematics",science:"science","language-arts":"language arts",history:"social studies/history",
      research:"research",technology:"technology","arts-music":"arts and music","visual-art":"visual art",music:"music",health:"health and wellness"
    })[subject] || "this course";
  }

  function detectIntent(text){
    const q=text.toLowerCase();
    if(/\b(answer|answers|just give|tell me the answer|do my homework|do this for me)\b/.test(q)) return "answer-seeking";
    if(/\b(test|quiz|exam|assessment|grade|score|failed|failing)\b/.test(q)) return "assessment";
    if(/\b(study|remember|memorize|focus|plan|schedule|behind|catch up|procrastinat)\b/.test(q)) return "study";
    if(/\b(don't understand|dont understand|confused|stuck|help me understand|explain|how do|why does|what does)\b/.test(q)) return "concept";
    if(/\b(project|essay|paragraph|report|presentation|research|source|citation)\b/.test(q)) return "project";
    if(/\b(high school|grade 9|ninth grade|freshman|next year|ready for high)\b/.test(q)) return "readiness";
    if(/\b(friend|bully|bullied|lonely|stress|stressed|anxious|upset|family|home|belong|sad|overwhelmed)\b/.test(q)) return "wellbeing";
    if(/\b(unsafe|hurt me|hurt myself|suicide|kill myself|abuse|threat|weapon|emergency)\b/.test(q)) return "urgent-support";
    return "general";
  }

  function extractTopic(text){
    const t=clean(text)
      .replace(/^(can you|could you|please|help me|i need help|i am|i'm|im|how do i|how do you|what is|what are|why is|why are)\s+/i,"")
      .replace(/[?!.]+$/g,"");
    return (t || "this").slice(0,180);
  }

  function localArchaemenesResponse(question,ctx){
    const intent=detectIntent(question);
    const topic=extractTopic(question);
    const subject=subjectLabel(ctx.subject);
    const grade=ctx.grade.replace("grade-0","Grade ").replace("middle-school","Middle School");

    if(intent==="urgent-support"){
      return `This sounds more important than an ordinary school question. Please bring a trusted adult into the situation now — a parent or guardian, teacher, counselor, or another safe adult near you. I can stay focused on school support, but I should not treat an urgent safety concern like homework. If you are in immediate danger, move toward a safe adult or emergency help right away.`;
    }
    if(intent==="wellbeing"){
      return `That sounds like it may be affecting school more than the assignment itself. Hope is the better mentor for the personal side of this. For the academic part, make the next step very small: open the current task, identify the one thing due first, and do ten focused minutes before deciding what comes next. You do not need to solve the whole week at once.`;
    }
    if(intent==="answer-seeking"){
      return `I can help you get to the answer, but I should not replace your work. For “${topic},” show me what you already know or the first step you tried. Then we can check one step at a time. A good middle-school rule is: understand the move before you copy the result.`;
    }
    if(intent==="assessment"){
      return `For a ${grade} assessment, start with evidence instead of the score. Ask: (1) Which skill was the question testing? (2) What did I do correctly? (3) Where did my reasoning change direction? (4) Can I solve one similar example without notes? If you tell me the skill or paste the question you are reviewing, I can help you diagnose the misunderstanding. I cannot change the recorded grade.`;
    }
    if(intent==="study"){
      return `For ${subject}, use a short three-part study block: 10 minutes reviewing one idea, 15 minutes practicing without looking at the example, then 5 minutes checking mistakes and writing what to remember next time. For “${topic},” choose one concrete target for the first block. Middle school gets easier when “study” becomes a specific action instead of a big vague job.`;
    }
    if(intent==="project"){
      return `For “${topic},” build the work in layers: question → evidence → explanation → revision. First write one sentence saying what your project is trying to show. Then collect only the evidence that supports or challenges that sentence. If this is research, keep source and citation information with each note as you go. Tell me which layer you are on and I can help with the next move.`;
    }
    if(intent==="readiness"){
      return `High-school readiness is less about racing ahead and more about becoming reliable with the habits you already need: reading directions carefully, showing reasoning, correcting mistakes, keeping track of deadlines, and asking a precise question when you are stuck. In ${subject}, pick one of those habits to practice on the current assignment. That is real preparation for Grade 9.`;
    }
    if(intent==="concept"){
      const subjectAdvice={
        mathematics:"Give me the exact problem or skill and your first attempt. I will help separate what is given, what you are trying to find, and the next valid operation.",
        science:"Tell me the phenomenon, vocabulary word, model, or lab step that is unclear. We can separate observation, evidence, and explanation.",
        "language-arts":"Give me the sentence, passage, prompt, or writing goal. We can identify what the text says, what it suggests, and what evidence supports your interpretation.",
        history:"Tell me the event, source, or claim. We can separate chronology, cause, evidence, perspective, and interpretation.",
        research:"Give me the claim you are investigating. We can check what evidence would actually support it and whether the sources are independent and relevant.",
        technology:"Tell me what you expected the program or tool to do, what actually happened, and any error message. We can debug one assumption at a time."
      };
      return `Being stuck is useful information — it tells us where to zoom in. ${subjectAdvice[ctx.subject] || `For “${topic},” tell me the last part that still made sense and the first part that stopped making sense.`} I will help with the reasoning, not quietly do the assignment for you.`;
    }

    return `Let’s make “${topic}” smaller. You are working in ${subject}${ctx.pageTitle?` on “${ctx.pageTitle}”`:""}. Tell me one of these three things: what the assignment asks, what you have tried, or the exact point where you got stuck. I’ll help you choose the next academic step and explain why it works.`;
  }

  function localHopeResponse(question){
    const intent=detectIntent(question);
    const topic=extractTopic(question);
    if(intent==="urgent-support"){
      return `I’m glad you said something. This needs a real person with you, not only a page on a screen. Please tell a trusted adult now — a parent or guardian, teacher, counselor, coach, or another safe adult nearby. If you are in immediate danger, move toward a safe adult or emergency help. You can keep your first sentence simple: “I need help with something serious.”`;
    }
    if(intent==="assessment"){
      return `A grade can feel huge in the moment, but one score is information, not your identity. First separate the feeling from the plan: name what you are feeling, then decide on one school action — review the missed skill, ask the teacher one question, or make a short catch-up plan. Archaemenes can help with the academic part when you are ready.`;
    }
    if(intent==="wellbeing"){
      return `Thank you for putting that into words. For “${topic},” try to sort it into two boxes: what you can do today, and what needs help from another person. If another student, family situation, or school problem is making you feel unsafe or unable to cope, tell a trusted adult directly rather than carrying it alone. If it is ordinary stress, choose one small action for the next 10 minutes and then check in with yourself again.`;
    }
    return `You do not have to make this sound perfect. Tell me what has been making school harder, what happened most recently, or what you wish an adult understood. I can help you organize the concern and identify a sensible next support step. This page does not create a counseling record.`;
  }

  async function protectedResponse(mentorId,question,ctx,history){
    const transport=window.KhaemenesMentorTransport;
    if(!transport || typeof transport.ask!=="function") return null;
    const payload={
      mentor:mentorId,
      audience:"middle-school",
      context:ctx,
      message:question,
      history:history.slice(-6).map(x=>({role:x.role,text:x.text.slice(0,800)})),
      boundaries:{mayChangeGrades:false,mayChangePlacement:false,mayEditRecords:false}
    };
    const result=await transport.ask(payload);
    const text=clean(result?.text || result?.message || "");
    return text ? text.slice(0,4000) : null;
  }

  async function answer(mentorId,question){
    const ctx=pageContext();
    const history=conversations[mentorId] || [];
    let text=null,source="local";
    try{
      text=await protectedResponse(mentorId,question,ctx,history);
      if(text) source="protected";
    }catch(_err){
      text=null;
    }
    if(!text) text=mentorId==="hope" ? localHopeResponse(question,ctx) : localArchaemenesResponse(question,ctx);
    return {text,source};
  }

  function promptSet(id,ctx){
    if(id==="hope") return ["I feel overwhelmed with school.","A friendship problem is affecting class.","I am worried about a grade."];
    const bySubject={
      mathematics:["Help me understand this math step.","How should I study for this math unit?","I got a problem wrong. Help me find why."],
      science:["Help me understand this science idea.","How do I study for this science unit?","Help me separate evidence from explanation."],
      "language-arts":["Help me understand this reading.","Help me plan my paragraph or essay.","How do I use evidence without copying?"],
      history:["Help me understand cause and effect here.","How should I evaluate this source?","Help me study this history unit."],
      technology:["Help me debug what went wrong.","Help me plan this coding task.","Explain this technology idea step by step."]
    };
    return bySubject[ctx.subject] || ["I am stuck on an assignment.","Help me make a study plan.","How can I get ready for high school?"];
  }

  function addMessage(log,role,text,name){
    const d=document.createElement("div");
    d.className=`khae-msg ${role}`;
    if(name){const n=document.createElement("span");n.className="name";n.textContent=name;d.appendChild(n)}
    const body=document.createElement("span");body.textContent=text;d.appendChild(body);
    log.appendChild(d);
    log.scrollTop=log.scrollHeight;
  }

  function openChat(host,mentorId){
    const panel=host.querySelector("#khaeMentorChat");
    const log=panel.querySelector("#khaeChatLog");
    const title=panel.querySelector("#khaeChatTitle");
    const intro=panel.querySelector("#khaeChatIntro");
    const prompts=panel.querySelector("#khaeChatPrompts");
    const input=panel.querySelector("#khaeChatInput");
    const ctx=pageContext();
    panel.dataset.mentor=mentorId;
    panel.hidden=false;
    title.textContent=mentorId==="hope"?"Talk with Hope":"Ask Archaemenes";
    intro.textContent=mentorId==="hope"?"Student support for school stress, belonging, transitions, and finding the right human support.":"Academic coaching for understanding, planning, studying, reflection, and high-school readiness.";
    prompts.innerHTML="";
    promptSet(mentorId,ctx).forEach(text=>{
      const b=document.createElement("button");b.type="button";b.className="khae-prompt-chip";b.textContent=text;
      b.addEventListener("click",()=>{input.value=text;input.focus()});
      prompts.appendChild(b);
    });
    log.innerHTML="";
    const prior=conversations[mentorId];
    if(prior.length){prior.forEach(m=>addMessage(log,m.role,m.text,m.role==="mentor"?(mentorId==="hope"?"Hope":"Archaemenes"):"You"));}
    else addMessage(log,"mentor",mentorId==="hope"?"Tell me what is making school harder today. We can sort out one manageable next step.":`You’re in ${ctx.grade.replace("grade-0","Grade ")} ${subjectLabel(ctx.subject)}${ctx.pageTitle?` — ${ctx.pageTitle}`:""}. Tell me what you’re working on and where the thinking gets stuck.`,mentorId==="hope"?"Hope":"Archaemenes");
    input.value="";
    panel.scrollIntoView({behavior:"smooth",block:"nearest"});
    setTimeout(()=>input.focus(),150);
  }

  function wireChat(host){
    const panel=host.querySelector("#khaeMentorChat");
    const form=panel.querySelector("#khaeChatForm");
    const input=panel.querySelector("#khaeChatInput");
    const log=panel.querySelector("#khaeChatLog");
    const status=panel.querySelector("#khaeChatStatus");
    const send=panel.querySelector("#khaeChatSend");
    panel.querySelector("#khaeChatClose").addEventListener("click",()=>{panel.hidden=true});

    form.addEventListener("submit",async e=>{
      e.preventDefault();
      const mentorId=panel.dataset.mentor || "archaemenes";
      const question=clean(input.value).slice(0,MAX_INPUT);
      if(!question){status.textContent="Type a question or choose one of the starters.";input.focus();return}
      const history=conversations[mentorId];
      history.push({role:"student",text:question});
      if(history.length>MAX_TURNS) history.splice(0,history.length-MAX_TURNS);
      addMessage(log,"student",question,"You");
      input.value="";
      send.disabled=true;input.disabled=true;
      status.textContent=mentorId==="hope"?"Hope is considering the best next support step…":"Archaemenes is looking at the question and the current course context…";
      try{
        const result=await answer(mentorId,question);
        history.push({role:"mentor",text:result.text});
        if(history.length>MAX_TURNS) history.splice(0,history.length-MAX_TURNS);
        addMessage(log,"mentor",result.text,mentorId==="hope"?"Hope":"Archaemenes");
        status.textContent=result.source==="protected"?"Connected mentor response · no grade or record authority":"Immediate on-page mentor response · protected AI transport can replace this automatically when connected";
      }catch(_err){
        status.textContent="The mentor response could not be prepared. Try asking the question in a shorter way.";
      }finally{
        send.disabled=false;input.disabled=false;input.focus();
      }
    });
  }

  function render(contract){
    if(document.getElementById("khaeMentors"))return;
    style();
    const host=document.createElement("section");host.id="khaeMentors";host.className="khae-mentor-section no-print";
    const ctx=pageContext();
    const ss=specialists(contract,context());
    host.innerHTML=`<div class="khae-mentor-shell">
      <p style="margin:0;color:#b48b45;letter-spacing:.14em;text-transform:uppercase;font-size:11px;font-weight:700">Middle School Mentor Team</p>
      <h2 style="margin:8px 0 0;color:#15251f;font-family:Georgia,serif;font-size:clamp(32px,4vw,48px)">Ask a real question. Work the next step.</h2>
      <p style="max-width:760px;margin:12px auto;color:#4e5c57">Archaemenes responds to the academic question you type and uses the current grade and subject as context. Hope supports the student side of school. Neither mentor changes grades, placement, discipline, certificates, or protected records.</p>
      <div><span class="khae-context-pill">${esc(ctx.grade.replace("grade-0","Grade "))}</span><span class="khae-context-pill">${esc(subjectLabel(ctx.subject))}</span>${ctx.pageTitle?`<span class="khae-context-pill">${esc(ctx.pageTitle)}</span>`:""}</div>
      <div class="khae-mentor-grid">
        <article class="khae-mentor-card"><h3>Archaemenes</h3><p><strong>Educational Mentor</strong></p><p>Ask about a lesson, difficult concept, study strategy, assignment, assessment review, or high-school readiness.</p><div class="khae-mentor-actions"><button class="khae-mentor-button" data-mentor="archaemenes">Ask Archaemenes</button></div></article>
        <article class="khae-mentor-card"><h3>Hope</h3><p><strong>School Counselor & Student Support</strong></p><p>School stress, belonging, friendship concerns, family circumstances affecting school, transitions, encouragement, and support navigation.</p><div class="khae-mentor-actions"><button class="khae-mentor-button" data-mentor="hope">Talk with Hope</button></div></article>
      </div>
      ${ss.length?`<div class="khae-mentor-panel"><strong>Contextual specialist${ss.length>1?"s":""}:</strong> ${ss.map(s=>`${esc(s.name)} · ${esc(s.role)}`).join(" &nbsp;|&nbsp; ")}. ${ss.length>1?"These specialists are":"This specialist is"} suggested because of the current subject context.</div>`:""}
      <section id="khaeMentorChat" class="khae-chat" hidden aria-live="polite">
        <div class="khae-chat-head"><div><h3 id="khaeChatTitle">Ask Archaemenes</h3><p id="khaeChatIntro"></p></div><button type="button" id="khaeChatClose" class="khae-chat-close" aria-label="Close mentor conversation">×</button></div>
        <div id="khaeChatPrompts" class="khae-chat-prompts" aria-label="Question starters"></div>
        <div id="khaeChatLog" class="khae-chat-log" role="log" aria-label="Mentor conversation"></div>
        <form id="khaeChatForm" class="khae-chat-form">
          <textarea id="khaeChatInput" maxlength="${MAX_INPUT}" aria-label="Your question" placeholder="Type your question here. You can paste the problem or explain what you tried."></textarea>
          <button id="khaeChatSend" class="khae-mentor-button" type="submit">Send</button>
        </form>
        <p id="khaeChatStatus" class="khae-chat-status">Conversation stays in memory for this page session; this public widget does not create a student record.</p>
      </section>
      <p class="khae-mentor-note">Mentors support reasoning rather than silently doing graded work. Academic mastery comes from recorded course evidence. Personal or safety concerns should be brought to an appropriate trusted adult or human support pathway.</p>
    </div>`;

    const main=document.querySelector("main");
    if(main) main.insertBefore(host,main.firstChild); else document.body.appendChild(host);
    host.querySelectorAll("[data-mentor]").forEach(btn=>btn.addEventListener("click",()=>openChat(host,btn.dataset.mentor)));
    wireChat(host);
  }

  fetch(CONTRACT_URL,{cache:"no-store"})
    .then(r=>r.ok?r.json():Promise.reject(new Error("mentor contract unavailable")))
    .then(render)
    .catch(()=>{});
})();