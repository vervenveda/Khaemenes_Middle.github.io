(function attachKhaemenesMiddleBreakaway(global){
  "use strict";

  const VERSION="1.0.0";
  const HUB="https://vervenveda.com/Khaemenes_Middle.github.io/breakaway/";
  const ARCADE="https://vervenveda.com/arcade.github.io/";

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

  function createButton(){
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

  global.KhaemenesMiddleBreakaway=Object.freeze({version:VERSION,hub:HUB,activities,recommend,createButton});
  if(global.document?.readyState==="loading")global.document.addEventListener("DOMContentLoaded",createButton,{once:true});else createButton();
})(window);
