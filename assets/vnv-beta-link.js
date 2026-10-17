/* Verve N Veda · Beta Program + Khaemenes learner rail widget · v1.7.3 */
(() => {
  "use strict";

  const ID="vnvBetaProgramLink";
  const FALLBACK_ID="vnvBetaProgramFallback";
  const STYLE_ID="vnvBetaProgramLinkStyles";
  const SCRIPT_MARK="vnvBetaProgramScript";
  const BETA_URL="https://vervenveda.com/beta/";
  const SCRIPT_URL="https://vervenveda.com/assets/vnv-beta-link.js";
  const BAZAAR_LIVE_URL="https://vervenveda.github.io/333.github.io/app/Bazaar_Art_Live_index.html";
  const HIGH_PROFILE_ID="khaemenesHighStudentProfileLink";
  const HIGH_PROFILE_STYLE_ID="khaemenesHighStudentProfileLinkStyles";
  const EDUCATION_TOOLBAR_ID="khaemenesLearnerUtilityToolbar";
  const EDUCATION_TOOLBAR_STYLE_ID="khaemenesLearnerUtilityToolbarStyles";
  const ACADEMY_STUDENT_URL="https://vervenveda.com/Khaemenes_Academy.github.io/student/";
  const ACADEMY_FAMILY_URL="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
  const HIGHER_SCHOLAR_URL="https://vervenveda.com/Khaemenes_Academy.github.io/adult/";
  const LINGUISTICS_CONTINUATION_URL="https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-linguistics-continuation.js";
  const ELEMENTARY_CONTINUATION_URL="https://vervenveda.com/Khaemenes_Elementary.github.io/assets/khaemenes-elementary-continuation-publisher.js";
  const MIDDLE_CONTINUATION_URL="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-continuation-publisher.js";

  const clean=(value,max)=>String(value??"").replace(/[\u0000-\u001f\u007f]/g,"").slice(0,max);

  const safeSource=()=>{
    try{
      /* Deliberately limited to public routing metadata. Never include query,
         hash, learner IDs, family IDs, form values, course state, or storage. */
      const host=clean(location.hostname||"",120).replace(/[^a-z0-9.:-]/gi,"");
      const path=clean(location.pathname||"/",240);
      return `${host}${path}`.slice(0,320)||"ecosystem";
    }catch{return "ecosystem"}
  };

  const safeSurface=()=>{
    try{
      const path=String(location.pathname||"/").toLowerCase();
      const base=(path.split("/").pop()||"").toLowerCase();
      const indexLike=!base||base==="index.html"||base.endsWith("_index.html")||base.endsWith("-index.html");
      const homeworkLike=/(^|\/)(homework|assignment|assignments|lesson|lessons|unit|units|worksheet|worksheets)(\/|$)/.test(path);
      const assessmentLike=/(^|\/)(assessment|assessments|quiz|quizzes|exam|exams)(\/|$)/.test(path);
      if(indexLike&&homeworkLike)return "homework-index";
      if(indexLike&&assessmentLike)return "assessment-index";
      if(indexLike)return "interactive-index";
      if(homeworkLike)return "homework-surface";
      if(assessmentLike)return "assessment-surface";
      return "interactive-surface";
    }catch{return "interactive-surface"}
  };

  const betaHref=()=>`${BETA_URL}?source=${encodeURIComponent(safeSource())}&surface=${encodeURIComponent(safeSurface())}`;

  const isBazaarLanding=()=>{
    try{
      const host=String(location.hostname||"").toLowerCase();
      const path=String(location.pathname||"/").toLowerCase();
      const base=(path.split("/").pop()||"").toLowerCase();
      const indexLike=!base||base==="index.html";
      const bazaarHost=host.includes("bazaarart");
      const bazaarPath=/(^|\/)bazaarart\.github\.io(\/|$)/.test(path);
      return indexLike&&(bazaarHost||bazaarPath);
    }catch{return false}
  };


  const educationProfileConfig=()=>{
    try{
      const host=String(location.hostname||"").toLowerCase();
      const path=String(location.pathname||"/").toLowerCase();
      const match=(hostNeedle,pathNeedle)=>host.includes(hostNeedle)||path.includes(pathNeedle);

      if(match("khaemenes-preschool","/khaemenes_preschool.github.io/")){
        return {
          label:"Learner Profile",
          mark:"P",
          url:ACADEMY_FAMILY_URL,
          aria:"Open the Khaemenes Academy family learner profile",
          title:"Learner Profile · family-managed child identity and curriculum continuity"
        };
      }
      if(match("khaemenes-kindergarden","/khaemenes_kindergarden.github.io/")){
        return {
          label:"Student Profile",
          mark:"K",
          url:ACADEMY_STUDENT_URL,
          aria:"Open the Khaemenes Academy Student Profile",
          title:"Student Profile · learner identity, pinned learning and curriculum continuity"
        };
      }
      if(match("khaemenes-elementary","/khaemenes_elementary.github.io/")){
        return {
          label:"Student Profile",
          mark:"E",
          url:ACADEMY_STUDENT_URL,
          aria:"Open the Khaemenes Academy Student Profile",
          title:"Student Profile · pinned courses, learning records and next steps"
        };
      }
      if(match("khaemenes-middle","/khaemenes_middle.github.io/")){
        return {
          label:"Student Profile",
          mark:"M",
          url:ACADEMY_STUDENT_URL,
          aria:"Open the Khaemenes Academy Student Profile",
          title:"Student Profile · pinned courses, learning records and next steps"
        };
      }
      if(match("khaemenes-high","/khaemenes_high.github.io/")){
        return {
          label:"Student Profile",
          mark:"S",
          url:ACADEMY_STUDENT_URL,
          aria:"Open Khaemenes Academy Student Profile and pinned courses",
          title:"Student Profile · pinned courses and learning schedule"
        };
      }
      if(match("khaemenes-linguistics","/khaemenes_linguistics.github.io/")){
        return {
          label:"Learner Profile",
          mark:"L",
          url:ACADEMY_STUDENT_URL,
          aria:"Open the Khaemenes Academy learner profile",
          title:"Learner Profile · language pathways, pinned learning and records"
        };
      }
      if(match("khaemenes-higher-learning","/khaemenes_higher_learning.github.io/")){
        return {
          label:"Scholar Profile",
          mark:"H",
          url:HIGHER_SCHOLAR_URL,
          aria:"Open the Khaemenes Academy Adult Learner Portal",
          title:"Scholar Profile · adult learner identity, study preferences and next steps"
        };
      }
      return null;
    }catch{return null}
  };

  function ensureEducationToolbar(){
    if(!educationProfileConfig()||!document.body)return null;
    let toolbar=document.getElementById(EDUCATION_TOOLBAR_ID);
    if(!document.getElementById(EDUCATION_TOOLBAR_STYLE_ID)){
      const style=document.createElement("style");
      style.id=EDUCATION_TOOLBAR_STYLE_ID;
      style.textContent=`
        #${EDUCATION_TOOLBAR_ID}{
          position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));
          z-index:2147482100;display:flex;align-items:stretch;justify-content:flex-end;gap:6px;
          padding:6px;border:1px solid rgba(180,139,69,.48);border-radius:7px;
          background:rgba(255,253,248,.96);box-shadow:0 10px 30px rgba(15,25,37,.16);
          backdrop-filter:blur(10px)
        }
        #${EDUCATION_TOOLBAR_ID}>button,#${EDUCATION_TOOLBAR_ID}>a{
          position:static!important;right:auto!important;bottom:auto!important;z-index:auto!important;
          width:126px!important;height:42px!important;min-height:42px!important;max-height:42px!important;
          display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;
          margin:0!important;padding:7px 9px!important;border-radius:7px!important;
          box-sizing:border-box!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;
          box-shadow:none!important;font:600 10px/1.15 "Avenir Next","Segoe UI",Arial,sans-serif!important;
          letter-spacing:.035em!important;text-decoration:none!important
        }
        #${EDUCATION_TOOLBAR_ID}>#learnerRecordNoticeButton{
          order:10;color:#493719!important;background:#fff4d8!important;border:1px solid #b48b45!important
        }
        #${EDUCATION_TOOLBAR_ID}>#${HIGH_PROFILE_ID}{
          order:20;color:#17392f!important;background:#fffdf8!important;border:1px solid rgba(180,139,69,.72)!important
        }
        #${EDUCATION_TOOLBAR_ID}>#${ID}{
          order:30;color:#f7efe0!important;background:#0f1925!important;border:1px solid rgba(183,147,77,.72)!important
        }
        #${EDUCATION_TOOLBAR_ID}>button:hover,#${EDUCATION_TOOLBAR_ID}>a:hover{transform:translateY(-1px)}
        #${EDUCATION_TOOLBAR_ID}>button:focus-visible,#${EDUCATION_TOOLBAR_ID}>a:focus-visible{outline:3px solid #b48b45;outline-offset:2px}
        @media(max-width:520px){
          #${EDUCATION_TOOLBAR_ID}{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));gap:4px;padding:4px}
          #${EDUCATION_TOOLBAR_ID}>button,#${EDUCATION_TOOLBAR_ID}>a{
            width:96px!important;height:40px!important;min-height:40px!important;max-height:40px!important;
            padding:6px!important;font-size:9px!important;letter-spacing:.01em!important
          }
        }
        @media(max-width:330px){
          #${EDUCATION_TOOLBAR_ID}>button,#${EDUCATION_TOOLBAR_ID}>a{width:90px!important}
        }
        @media print{#${EDUCATION_TOOLBAR_ID}{display:none!important}}
        @media(prefers-reduced-motion:reduce){#${EDUCATION_TOOLBAR_ID}>button,#${EDUCATION_TOOLBAR_ID}>a{transition:none!important;transform:none!important}}
      `;
      (document.head||document.documentElement).append(style);
    }
    if(!toolbar){
      toolbar=document.createElement("nav");
      toolbar.id=EDUCATION_TOOLBAR_ID;
      toolbar.setAttribute("aria-label","Khaemenes learner utilities");
      document.body.append(toolbar);
    }
    return toolbar;
  }

  function dockEducationUtility(control,order){
    const toolbar=ensureEducationToolbar();
    if(!toolbar||!control)return false;
    control.style.order=String(order);
    if(control.parentElement!==toolbar)toolbar.append(control);
    return true;
  }

  function betaStackOffset(){
    const beta=document.getElementById(ID);
    const height=beta?.getBoundingClientRect?.().height||40;
    return Math.max(58,Math.ceil(height)+22);
  }

  function alignHighProfileSurface(){
    const config=educationProfileConfig();
    if(!config||!document.body)return false;
    const bridge=document.getElementById("khaemenesFamilyBridge");
    const quick=document.getElementById(HIGH_PROFILE_ID);
    const beta=document.getElementById(ID);

    if(bridge){
      const toolbar=ensureEducationToolbar();
      if(toolbar&&bridge.parentElement!==toolbar){
        bridge.style.order="20";
        toolbar.append(bridge);
      }
      if(quick)quick.remove();
    }else if(quick){
      dockEducationUtility(quick,20);
    }
    if(beta)dockEducationUtility(beta,30);

    const preserved=[...document.querySelectorAll("button,a")].find(el=>{
      const id=String(el.id||"").toLowerCase();
      const text=String(el.textContent||"").trim().toLowerCase();
      return id==="learnerrecordnoticebutton"||
        /preserv(ed)?[-_ ]?work|legacy[-_ ]?work|work[-_ ]?recovery/.test(id)||
        text==="preserved work"||text.startsWith("preserved work ·");
    });
    if(preserved&&preserved!==quick&&preserved!==beta)dockEducationUtility(preserved,10);

    const panel=document.getElementById("learnerRecordNoticePanel");
    const toolbar=document.getElementById(EDUCATION_TOOLBAR_ID);
    if(panel&&toolbar){
      const h=Math.ceil(toolbar.getBoundingClientRect?.().height||54);
      panel.style.right="max(12px, env(safe-area-inset-right))";
      panel.style.bottom=`calc(max(12px, env(safe-area-inset-bottom)) + ${h+10}px)`;
      panel.style.borderRadius="7px";
    }
    return !!bridge;
  }

  function mountHighStudentProfile(){
    const config=educationProfileConfig();
    if(!config||!document.body)return;

    if(alignHighProfileSurface())return;

    if(!document.getElementById(HIGH_PROFILE_STYLE_ID)){
      const style=document.createElement("style");
      style.id=HIGH_PROFILE_STYLE_ID;
      style.textContent=`
        #${HIGH_PROFILE_ID}{
          display:inline-flex;align-items:center;justify-content:center;gap:8px;
          min-height:40px;padding:8px 12px;border:1px solid rgba(180,139,69,.72);
          border-radius:7px;color:#17392f;background:rgba(255,253,248,.97);
          font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;
          letter-spacing:.045em;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent
        }
        #${HIGH_PROFILE_ID}:hover{transform:translateY(-1px);border-color:#b48b45;background:#fffaf0}
        #${HIGH_PROFILE_ID}:focus-visible{outline:3px solid #b48b45;outline-offset:3px}
        #${HIGH_PROFILE_ID} .khae-profile-mark{
          width:20px;height:20px;display:grid;place-items:center;border-radius:50%;
          color:#fff;background:#17392f;font:600 10px/1 Georgia,serif
        }
        @media(max-width:520px){#${HIGH_PROFILE_ID}{min-height:38px;padding:7px 10px}}
        @media print{#${HIGH_PROFILE_ID}{display:none!important}}
        @media(prefers-reduced-motion:reduce){#${HIGH_PROFILE_ID}{transition:none!important;transform:none!important}}
      `;
      (document.head||document.documentElement).append(style);
    }

    if(!document.getElementById(HIGH_PROFILE_ID)){
      const button=document.createElement("button");
      button.id=HIGH_PROFILE_ID;
      button.type="button";
      button.setAttribute("aria-label",config.aria);
      button.title=config.title;
      const mark=document.createElement("span");
      mark.className="khae-profile-mark";
      mark.setAttribute("aria-hidden","true");
      mark.textContent=config.mark;
      const label=document.createElement("span");
      label.textContent=config.label;
      button.append(mark,label);
      button.addEventListener("click",()=>{
        try{window.location.assign(config.url)}catch{window.location.href=config.url}
      });
      (ensureEducationToolbar()||document.body).append(button);
    }

    dockEducationUtility(document.getElementById(HIGH_PROFILE_ID),20);
    alignHighProfileSurface();

    if(typeof MutationObserver==="function"&&!document.documentElement.dataset.khaeHighProfileStackBound){
      document.documentElement.dataset.khaeHighProfileStackBound="1";
      const observer=new MutationObserver(()=>alignHighProfileSurface());
      observer.observe(document.body,{childList:true,subtree:true});
      window.addEventListener("resize",alignHighProfileSurface,{passive:true});
    }
  }

  function enhanceBazaarLanding(){
    if(!isBazaarLanding()||!document.body)return;
    const BAZAAR_STYLE_ID="vnvBazaarLandingEnhancements";
    const BAZAAR_CTA_ID="vnvBazaarLiveHeroCta";

    if(!document.getElementById(BAZAAR_STYLE_ID)){
      const style=document.createElement("style");
      style.id=BAZAAR_STYLE_ID;
      style.textContent=`
        body .header-actions a[href*="Bazaar_Art_Live_index.html"]{
          color:#fff!important;
          background:linear-gradient(135deg,var(--rose,#d43f70),var(--plum,#4a2944));
          border:1px solid rgba(255,255,255,.18);
          box-shadow:0 7px 18px rgba(74,41,68,.18);
          padding-inline:14px;
        }
        body .header-actions a[href*="Bazaar_Art_Live_index.html"]:hover,
        body .header-actions a[href*="Bazaar_Art_Live_index.html"]:focus-visible{
          color:#fff!important;
          transform:translateY(-1px);
        }
        #${BAZAAR_CTA_ID}{
          position:relative;
          overflow:hidden;
          color:#fff;
          background:linear-gradient(135deg,var(--rose,#d43f70),var(--plum,#4a2944));
          border-color:rgba(255,255,255,.2);
          box-shadow:0 12px 28px rgba(74,41,68,.22);
        }
        #${BAZAAR_CTA_ID}::before{content:"●";margin-right:8px;color:#fff3bd;font-size:.72em}
        #${BAZAAR_CTA_ID}:hover{filter:brightness(1.06)}
        body[data-theme="adult-dark"] .hero-emblem-wrap{
          position:relative;
          overflow:hidden;
          background:#17161e;
          box-shadow:0 0 0 1px #2d2934,0 18px 42px rgba(0,0,0,.22);
        }
        body[data-theme="adult-dark"] .hero-emblem-wrap::after{
          content:"";
          position:absolute;
          inset:0;
          z-index:3;
          pointer-events:none;
          border:3px solid #2d2934;
          box-shadow:inset 0 0 0 1px rgba(0,0,0,.72);
        }
        body[data-theme="adult-dark"] .hero-emblem{
          position:relative;
          z-index:1;
          clip-path:inset(1px);
        }
        body[data-theme="adult-dark"] .brand-mark{
          box-shadow:inset 0 0 0 2px #2d2934;
          border-color:#2d2934!important;
        }
        @media(max-width:760px){
          body .header-actions a[href*="Bazaar_Art_Live_index.html"]{display:inline-flex!important}
        }
        @media print{#${BAZAAR_CTA_ID}{display:none!important}}
      `;
      (document.head||document.documentElement).append(style);
    }

    const heroActions=document.querySelector(".hero-actions");
    if(heroActions&&!document.getElementById(BAZAAR_CTA_ID)){
      const live=document.createElement("a");
      live.id=BAZAAR_CTA_ID;
      live.className="button button-live button-primary";
      live.href=BAZAAR_LIVE_URL;
      live.textContent="Enter Bazaar Art Live";
      live.setAttribute("aria-label","Enter Bazaar Art Live through the 333 Network");
      heroActions.prepend(live);
    }
  }

  function loadOnce(src,marker){
    try{
      if(document.querySelector(`script[data-${marker}],script[src="${src}"]`))return;
      const script=document.createElement("script");
      script.src=src;script.async=false;script.setAttribute(`data-${marker}`,"1");
      (document.head||document.documentElement).append(script);
    }catch{}
  }

  function ensureEducationContinuationPublisher(){
    try{
      const path=String(location.pathname||"").toLowerCase();
      if(path.includes("/khaemenes_elementary.github.io/")&&/\/grades\/grade-0[2-5](\/|$)/.test(path)){
        loadOnce(ELEMENTARY_CONTINUATION_URL,"khaemenes-elementary-continuation");
      }
      if(path.includes("/khaemenes_middle.github.io/")&&/\/grades\/grade-0[6-8](\/|$)/.test(path)){
        loadOnce(MIDDLE_CONTINUATION_URL,"khaemenes-middle-continuation");
      }
    }catch{}
  }

  function ensureLinguisticsContinuation(){
    try{
      const path=String(location.pathname||"").toLowerCase();
      if(!path.includes("/khaemenes_linguistics.github.io/"))return;
      if(!/\/halls\/courses\/(arabic-1|russian-1)(\/|$)/.test(path))return;
      if(document.querySelector('script[data-khaemenes-linguistics-continuation]'))return;
      const script=document.createElement("script");
      script.src=LINGUISTICS_CONTINUATION_URL;
      script.async=false;
      script.dataset.khaemenesLinguisticsContinuation="1";
      (document.head||document.documentElement).append(script);
    }catch{}
  }

  function mount(){
    if(document.getElementById(ID)||!document.body)return;

    if(!document.getElementById(STYLE_ID)){
      const style=document.createElement("style");
      style.id=STYLE_ID;
      style.textContent=`
        #${ID}{position:fixed;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));z-index:2147482000;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:8px 12px;border:1px solid rgba(183,147,77,.72);border-radius:999px;color:#f7efe0;background:rgba(15,25,37,.94);box-shadow:0 8px 24px rgba(0,0,0,.18);font:600 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.045em;text-decoration:none;backdrop-filter:blur(9px);cursor:pointer;-webkit-tap-highlight-color:transparent}
        #${ID}:hover{transform:translateY(-1px);border-color:#dfc48e;background:#152538}
        #${ID}:focus-visible{outline:3px solid #dfc48e;outline-offset:3px}
        #${ID} .vnv-beta-mark{font:600 15px/1 Georgia,serif;color:#dfc48e}
        #${FALLBACK_ID}{display:none!important}
        @media(max-width:520px){#${ID}{right:max(8px,env(safe-area-inset-right));bottom:max(8px,env(safe-area-inset-bottom));min-height:38px;padding:7px 10px}}
        @media print{#${ID},#${FALLBACK_ID}{display:none!important}}
        @media(prefers-reduced-motion:reduce){#${ID}{transition:none!important;transform:none!important}}
      `;
      (document.head||document.documentElement).append(style);
    }

    const fallback=document.getElementById(FALLBACK_ID);
    if(fallback){
      fallback.setAttribute("href",betaHref());
      fallback.setAttribute("aria-hidden","true");
      fallback.tabIndex=-1;
    }

    /* A button is intentional: several Verve N Veda surfaces guard anchor
       navigation. Programmatic same-origin navigation avoids interfering with
       those link policies while remaining keyboard accessible. */
    const button=document.createElement("button");
    button.id=ID;
    button.type="button";
    button.dataset.betaSurface=safeSurface();
    button.setAttribute("aria-label","Open the Verve N Veda Beta Program for this page");

    const mark=document.createElement("span");
    mark.className="vnv-beta-mark";
    mark.setAttribute("aria-hidden","true");
    mark.textContent="β";
    const label=document.createElement("span");
    label.textContent="Beta Program";
    button.append(mark,label);

    button.addEventListener("click",()=>{
      try{window.location.assign(betaHref())}catch{window.location.href=BETA_URL}
    });
    const toolbar=ensureEducationToolbar();
    (toolbar||document.body).append(button);
    if(toolbar)dockEducationUtility(button,30);
  }

  function attachToFrame(frame){
    if(!frame||frame.dataset?.vnvBetaBound==="1")return;
    try{frame.dataset.vnvBetaBound="1"}catch{}
    const install=()=>{
      try{
        const doc=frame.contentDocument;
        if(!doc||!doc.documentElement)return; // cross-origin or unavailable: fail closed
        if(doc.getElementById(ID)||doc.querySelector(`script[data-${SCRIPT_MARK}]`))return;
        const script=doc.createElement("script");
        script.src=SCRIPT_URL;
        script.defer=true;
        script.setAttribute(`data-${SCRIPT_MARK}`,"1");
        (doc.head||doc.documentElement).appendChild(script);
      }catch{/* Cross-origin frames are intentionally untouched. */}
    };
    frame.addEventListener("load",install,{passive:true});
    install();
  }

  function bindVisibleFrames(){
    if(!document.querySelectorAll)return;
    document.querySelectorAll("iframe").forEach(attachToFrame);
    if(typeof MutationObserver!=="function")return;
    const observer=new MutationObserver(records=>{
      for(const record of records){
        for(const node of record.addedNodes||[]){
          if(node?.nodeType!==1)continue;
          if(node.tagName==="IFRAME")attachToFrame(node);
          node.querySelectorAll?.("iframe").forEach(attachToFrame);
        }
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  function start(){mount();mountHighStudentProfile();ensureEducationContinuationPublisher();ensureLinguisticsContinuation();bindVisibleFrames();enhanceBazaarLanding()}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();

  window.VNVBetaProgram=Object.freeze({version:"1.7.3",mount,source:safeSource,surface:safeSurface,href:betaHref,studentProfile:mountHighStudentProfile,educationProfile:educationProfileConfig});
})();
