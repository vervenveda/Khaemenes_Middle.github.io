(()=>{"use strict";
if(window.__KHAE_MIDDLE_LANDING_TOOLS_V1__)return;window.__KHAE_MIDDLE_LANDING_TOOLS_V1__=true;
const ROOT="https://vervenveda.com/Khaemenes_Middle.github.io/";
function openTranslator({root}){root.querySelectorAll(".vct-pop").forEach(p=>p.hidden=true);let panel=root.querySelector("[data-vct-middle-translator]");if(!panel){panel=document.createElement("div");panel.className="vct-pop";panel.dataset.vctMiddleTranslator="";panel.hidden=true;panel.innerHTML='<h2>Translate</h2><p>Choose the interface language for this Middle School landing page.</p><div data-vnv-language-mount></div>';root.querySelector("#vnvClassToolsPanel")?.append(panel)}const mount=panel.querySelector("[data-vnv-language-mount]");const sw=document.getElementById("vnv-language-switch");if(mount&&sw&&sw.parentElement!==mount)mount.append(sw);document.getElementById("vnv-language-rail")?.remove();panel.hidden=false;window.VNVLanguage?.refresh?.()}
window.KhaemenesClassToolsConfigV1=Object.freeze({id:"middle-school-landings",match:()=>/\/Khaemenes_Middle\.github\.io\/grades\/grade-(06|07|08)\/(?:index\.html)?$/i.test(location.pathname)||/\/Khaemenes_Middle\.github\.io\/grades\/grade-(06|07|08)\/subjects\/[^/]+\/(?:index\.html)?$/i.test(location.pathname),toggleLabel:"Tools",ariaLabel:"Middle School tools",tools:[
{type:"link",label:"Student",sub:"Learner profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/student/"},
{type:"link",label:"Courses",sub:"Middle School home",href:ROOT},
{type:"link",label:"Search",sub:"Search ecosystem",href:"https://vervenveda.com/PLERASearch.github.io/"},
{type:"action",label:"Translate",sub:"Change language",action:"translate"},
{type:"link",label:"Parent",sub:"Family profile",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"},
{type:"link",label:"Enroll",sub:"Enrollment",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/"}],actions:{translate:openTranslator}});
})();