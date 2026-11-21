/* Grade 7 Mathematics: move canonical translator controls into existing Class Tools. */
(()=>{"use strict";
if(window.KhaemenesGrade7MathTranslatorPlacement)return;
if(!/\/grades\/grade-07\/subjects\/mathematics\/(?:lesson-01|week-(?:0[1-9]|[12]\d|3[0-6]))\.html$/i.test(location.pathname))return;
const ROOT="vnvClassToolsPanel",PANEL="kg7LanguageToolsPane",BUTTON="kg7LanguageToolsButton";
let observer=null;
function sync(){
 const panel=document.getElementById(ROOT),switcher=document.getElementById("vnv-language-switch");
 if(!panel||!switcher)return false;
 const grid=panel.querySelector(".vct-grid");if(!grid)return false;
 if(!document.getElementById("kg7LanguageToolsStyles")){
  const s=document.createElement("style");s.id="kg7LanguageToolsStyles";
  s.textContent=[
   "#kg7LanguageToolsPane[hidden]{display:none!important}",
   "#kg7LanguageToolsPane{max-height:58vh;overflow:auto;padding:12px;margin-top:8px;border:1px solid #b48b45;border-radius:7px;background:#243038;color:#fff8e9}",
   "#kg7LanguageToolsPane h2{color:#fff8e9;font:400 20px/1.3 Cinzel,Georgia,serif;margin:0 0 10px}",
   "#kg7LanguageToolsPane #vnv-language-switch{position:static!important;margin:0!important;max-width:100%!important;width:100%!important;box-sizing:border-box!important;display:flex!important;flex-wrap:wrap!important;justify-content:center!important}",
   "#kg7LanguageToolsPane #vnv-language-switch :is(button,select){min-height:40px!important;font-size:16px!important;border-radius:7px!important}",
   "#vnv-language-rail:empty{display:none!important}"
  ].join("\n");document.head.append(s);
 }
 let holder=document.getElementById(PANEL);
 if(!holder){holder=document.createElement("section");holder.id=PANEL;holder.hidden=true;holder.setAttribute("aria-label","Translation controls");const h=document.createElement("h2");h.textContent="Translate this lesson";holder.append(h);grid.after(holder)}
 if(switcher.parentElement!==holder)holder.append(switcher);
 const rail=document.getElementById("vnv-language-rail");if(rail&&!rail.childElementCount)rail.hidden=true;
 let button=document.getElementById(BUTTON);
 if(!button){button=document.createElement("button");button.id=BUTTON;button.type="button";button.className="vct-tool";button.innerHTML="<strong>Language</strong><span>Translation tools</span>";button.setAttribute("aria-controls",PANEL);button.setAttribute("aria-expanded","false");
 button.addEventListener("click",()=>{const opening=holder.hidden;holder.hidden=!opening;button.setAttribute("aria-expanded",String(opening))});grid.append(button)}
 return true;
}
function start(){if(sync())return;observer=new MutationObserver(()=>{if(sync())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true})}
window.KhaemenesGrade7MathTranslatorPlacement=Object.freeze({version:"1.0.0",refresh:sync});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();