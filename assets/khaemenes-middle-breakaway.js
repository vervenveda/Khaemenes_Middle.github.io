(function attachKhaemenesMiddleBreakaway(global){
  "use strict";

  const VERSION="1.3.0";
  const HUB="https://vervenveda.com/Khaemenes_Middle.github.io/breakaway/";
  const ARCADE="https://vervenveda.com/arcade.github.io/";
  const NAIB_BRIDGE="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-middle-naib-bridge.js";
  const GRADE6_ALIGNMENT="https://vervenveda.com/Khaemenes_Middle.github.io/assets/khaemenes-grade6-curriculum-alignment.js";

  const activities=Object.freeze({
    mathematics:Object.freeze({label:"Math Reset",title:"Sudoku · logic and number reasoning",href:ARCADE+"Jenny's_Sudoku_index.html"}),
    geometry:Object.freeze({label:"Geometry Reset",title:"Mandala Rings · visual-spatial reasoning",href:ARCADE+"Geometry/mandala_rings_game_index.html"}),
    language:Object.freeze({label:"Word Reset",title:"AffixSix · vocabulary and morphology",href:ARCADE+"AffixSix%E2%84%A2_index.html"}),
    writing:Object.freeze({label:"Word Reset",title:"Hangman · spelling and vocabulary",href:ARCADE+"Hangman_index.html"}),
    science:Object.freeze({label:"Logic Reset",title:"IQ Mini · patterns and problem solving",href:ARCADE+"IQ-mini_index.html"}),
    technology:Object.freeze({label:"Logic Reset",title:"IQ Quantum · systems thinking",href:ARCADE+"IQ-Quantum_index.html"}),
    social:Object.freeze({label:"Strategy Reset",title:"Chess Studio · planning and decision making",href:ARCADE+"Chess_Studio_index.html"}),
    wellness:Object.freeze({label:"Brain Break",title:"15-minute Breakaway Studio",href:HUB}),
    general:Object.freeze({label:"15-Min Break",title:"Middle School Breakaway Studio",href:HUB})
  });

  function inferActivity(pathname){
    const p=String(pathname||global.location?.pathname||"").toLowerCase();
    if(/geometry/.test(p))return activities.geometry;
    if(/mathemat|algebra|ratio|number|statistic/.test(p))return activities.mathematics;
    if(/language-arts|english|reading|grammar|vocab/.test(p))return activities.language;
    if(/writing|cursive/.test(p))return activities.writing;
    if(/science|biology|chem|physics|earth|space/.test(p))return activities.science;
    if(/technology|coding|computer|digital/.test(p))return activities.technology;
    if(/social|history|civics|geograph|government/.test(p))return activities.social;
    if(/health|wellness|pe-|physical|sel/.test(p))return activities.wellness;
    return activities.general;
  }

  function ensureNAIBBridge(){
    if(!global.document||global.KhaemenesMiddleNAIBBridge)return;
    if(global.document.querySelector(`script[data-khaemenes-middle-naib],script[src="${NAIB_BRIDGE}"]`))return;
    const script=global.document.createElement("script");
    script.src=NAIB_BRIDGE;
    script.async=false;
    script.dataset.khaemenesMiddleNaib="1";
    (global.document.head||global.document.documentElement).appendChild(script);
  }

  function ensureGrade6Alignment(){
    if(!global.document||global.KhaemenesGrade6CurriculumAlignment)return;
    const pathname=String(global.location?.pathname||"");
    if(!/\/grades\/grade-06\/(?:subjects|weekly-plans)\//i.test(pathname))return;
    if(global.document.querySelector(`script[data-khaemenes-grade6-alignment],script[src="${GRADE6_ALIGNMENT}"]`))return;
    const script=global.document.createElement("script");
    script.src=GRADE6_ALIGNMENT;
    script.async=false;
    script.dataset.khaemenesGrade6Alignment="1";
    (global.document.head||global.document.documentElement).appendChild(script);
  }

  function createButton(){
    ensureNAIBBridge();
    if(!global.document||global.document.getElementById("khaemenesBreakawayButton"))return;
    const a=inferActivity();
    const link=global.document.createElement("a");
    link.id="khaemenesBreakawayButton";
    link.href=HUB+"?from="+encodeURIComponent(global.location?.pathname||"")+"&suggest="+encodeURIComponent(a.href);
    link.textContent="⏱ 15-Min Break";
    link.title=a.title;
    link.setAttribute("aria-label","Open a timed fifteen minute Breakaway session");
    link.style.cssText="position:fixed;right:18px;bottom:68px;z-index:2140;display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:8px 12px;border:1px solid rgba(8,11,15,.28);border-radius:7px;background:#f7f3eb;color:#080b0f;box-shadow:0 10px 30px rgba(8,11,15,.14);font:600 11px/1.2 'Avenir Next',Avenir,'Segoe UI',Arial,sans-serif;letter-spacing:.05em;text-decoration:none;white-space:nowrap";
    link.dataset.khaemenesBreakaway="true";
    global.document.body.appendChild(link);

    const style=global.document.createElement("style");
    style.textContent="@media print{#khaemenesBreakawayButton{display:none!important}}@media(max-width:620px){#khaemenesBreakawayButton{right:10px;bottom:62px;padding:7px 10px;font-size:10px}}";
    global.document.head.appendChild(style);
  }

  function recommend(){return inferActivity();}

  global.KhaemenesMiddleBreakaway=Object.freeze({version:VERSION,hub:HUB,activities,recommend,createButton,ensureNAIBBridge,ensureGrade6Alignment});
  const boot=()=>{ensureNAIBBridge();ensureGrade6Alignment();createButton();};
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})(window);
