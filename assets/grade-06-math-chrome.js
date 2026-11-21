/* Grade 6 mathematics configuration for the canonical VNV page components. */
(()=>{"use strict";
  const BASE="https://vervenveda.com/";
  const ACADEMY=BASE+"Khaemenes_Academy.github.io/";
  const path=location.pathname;
  const onMath=/\/grades\/grade-06\/subjects\/mathematics\/(?:week-01|lesson-01)\.html$/i.test(path);
  if(!onMath)return;

  window.KhaemenesClassToolsConfigV1=Object.freeze({
    id:"middle-math",
    match:()=>onMath,
    toggleLabel:"Tools",
    ariaLabel:"Grade 6 mathematics tools",
    tools:[
      {type:"link",label:"Learner Profile",sub:"Academy profile",href:ACADEMY+"student/"},
      {type:"link",label:"Parent Profile",sub:"Family portal",href:ACADEMY+"family/"},
      {type:"link",label:"Search",sub:"Ecosystem search",href:BASE+"PLERASearch.github.io/"},
      {type:"ecosystem-list",label:"Learning",sub:"Learning resources",filter:{category:"education",limit:12}},
      {type:"ecosystem-list",label:"Research",sub:"Research resources",filter:{category:"research",limit:12}},
      {type:"link",label:"Calculator",sub:"Scientific calculator",href:"https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/"},
      {type:"action",action:"translator",label:"Translator",sub:"Public page languages"},
      {type:"help",label:"Instructions",sub:"How the tools work"}
    ],
    actions:{translator({root}){
      const panel=root.querySelector("[data-vct-translator-panel]");
      if(!panel)return;
      const open=panel.hidden;
      root.querySelectorAll(".vct-pop").forEach(pop=>{pop.hidden=true});
      panel.hidden=!open;
      root.querySelector('[data-vct-action="translator"]')?.setAttribute("aria-expanded",String(open));
    }},
    help:{title:"Mathematics tools",paragraphs:[
      "Use the Academy profile and approved ecosystem resources while studying.",
      "The Translator changes public page text; written answers and grades are not sent to it by this menu."
    ]}
  });

  const style=document.createElement("style");
  style.id="grade06MathChromeStyle";
  style.textContent=`
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"]{width:min(320px,calc(100vw - 24px))}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnvClassToolsPanel{max-height:min(66dvh,560px);overflow-y:auto;overscroll-behavior:contain}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] .vct-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] .vct-tool{min-height:48px;white-space:normal!important;overflow:visible!important;background:#243038;color:#fff8e9;border-radius:7px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] .vct-tool strong{white-space:normal;color:#fff8e9}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] [data-vct-translator-panel]{padding:10px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnv-language-switch{width:100%;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:7px;text-align:left;font-size:16px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnv-language-switch label{align-self:center;font-size:16px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnv-language-switch select{min-width:0;width:100%;font-size:16px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnv-language-switch :is(button,select){min-height:44px;font-size:16px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] #vnv-language-switch [data-vnv-coverage]{grid-column:1/-1;font-size:13px}
    #vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"] [data-vct-translator-panel][hidden]{display:none!important}
    @media(max-width:370px){#vnvClassToolsToolbar[data-vnv-class-tools-config="middle-math"]{width:min(300px,calc(100vw - 24px))}}
  `;
  document.head.append(style);

  function placeTranslator(){
    const panel=document.getElementById("vnvClassToolsPanel");
    const language=document.getElementById("vnv-language-switch");
    if(!panel||!language)return false;
    let holder=panel.querySelector("[data-vct-translator-panel]");
    if(!holder){
      holder=document.createElement("section");
      holder.className="vct-pop";
      holder.hidden=true;
      holder.setAttribute("data-vct-translator-panel","");
      holder.innerHTML='<h2>Translator</h2><div data-vnv-language-mount></div>';
      panel.append(holder);
    }
    const mount=holder.querySelector("[data-vnv-language-mount]");
    if(language.parentElement!==mount)mount.append(language);
    document.getElementById("vnv-language-rail")?.remove();
    return true;
  }
  function watch(){
    placeTranslator();
    const observer=new MutationObserver(placeTranslator);
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watch,{once:true});
  else watch();
})();
