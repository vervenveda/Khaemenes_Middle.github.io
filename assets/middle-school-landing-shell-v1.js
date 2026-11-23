/* Khaemenes Middle · Canonical Landing Shell v1.0.0 */
(()=>{"use strict";
if(window.KhaemenesMiddleLandingShell)return;
const ROOT="https://vervenveda.com/Khaemenes_Middle.github.io/";
const path=location.pathname;
const gradeMatch=path.match(/\/grades\/grade-(06|07|08)\/(?:index\.html)?$/i);
const subjectMatch=path.match(/\/grades\/grade-(06|07|08)\/subjects\/([^/]+)\/(?:index\.html)?$/i);
if(!gradeMatch&&!subjectMatch)return;
const grade=(gradeMatch||subjectMatch)[1],subjectSlug=subjectMatch?subjectMatch[2]:"";
const subjectNames={"language-arts":"Language Arts","mathematics":"Mathematics","science":"Science","social-studies":"Social Studies & Civics","arts-music":"Arts & Music","health-pe-sel":"Health, PE & SEL","integrated-projects":"Integrated Projects","technology-design":"Technology, Design & Tools","world-languages":"World Languages"};
const gradeNames={"06":"Sixth Grade","07":"Seventh Grade","08":"Eighth Grade"};
const title=subjectSlug?(subjectNames[subjectSlug]||subjectSlug.replace(/-/g," ")):gradeNames[grade];
const descriptor=subjectSlug?("Middle School · Grade "+Number(grade)+" Subject Hall"):("Middle School · Grade "+Number(grade));
function load(src,key){return new Promise(resolve=>{const old=[...document.scripts].find(s=>s.src&&s.src.includes(key));if(old){if(old.dataset.loaded==="1"||old.readyState==="complete")resolve();else old.addEventListener("load",resolve,{once:true});return}const s=document.createElement("script");s.src=src;s.dataset.middleLandingShell="v1";s.onload=()=>{s.dataset.loaded="1";resolve()};s.onerror=resolve;(document.head||document.documentElement).append(s)})}
function removeCompetingChrome(){document.querySelectorAll("header[data-khae-header],header.khae-global-campus-header,header.header,.grade-quick-links").forEach(n=>n.remove());document.querySelectorAll("#vnvHeaderAutoPopulate").forEach((n,i)=>{if(i)n.remove()})}
function removeLegacyScripts(){document.querySelectorAll('script[src*="khaemenes-global-header.js"],script[src*="vnv-ecosystem-menu.js"],script[src*="khaemenes-landing-toolbar.js"]').forEach(n=>n.remove())}
function existingIntro(){
 if(subjectSlug){const h=document.querySelector("main .heading");if(!h)return "";const p=[...h.querySelectorAll("p")].find(x=>!x.classList.contains("kicker"));const text=p?p.textContent.trim():"";h.remove();return text}
 const hero=document.querySelector("body > section.hero");if(!hero)return "";const lead=hero.querySelector(".lead");const text=lead?lead.textContent.trim():"";const learner=hero.querySelector("#learnerContext");if(learner)learner.remove();hero.remove();return text;
}
function ensureBreadcrumb(){
 if(document.querySelector(".middle-canonical-breadcrumbs"))return;
 const nav=document.createElement("nav");nav.className="middle-canonical-breadcrumbs";nav.setAttribute("aria-label","Breadcrumb");
 nav.innerHTML=subjectSlug?('<a href="'+ROOT+'">Middle School</a><span>›</span><a href="'+ROOT+'grades/grade-'+grade+'/">Grade '+Number(grade)+'</a><span>›</span><strong aria-current="page">'+title+'</strong>'):('<a href="'+ROOT+'">Middle School</a><span>›</span><strong aria-current="page">'+gradeNames[grade]+'</strong>');
 const header=document.getElementById("vnvHeaderAutoPopulate");(header&&header.parentNode?header.parentNode:document.body).insertBefore(nav,header?header.nextSibling:document.body.firstChild);
}
function ensureHero(intro){
 if(document.querySelector(".middle-canonical-hero"))return;
 const hero=document.createElement("section");hero.className="middle-canonical-hero";
 hero.innerHTML='<div class="middle-canonical-hero-inner"><p class="middle-canonical-academy">Khaemenes Academy</p><h1>'+title+'</h1><p class="middle-canonical-descriptor">'+descriptor+'</p><p class="middle-canonical-lead">'+(intro||"A connected Middle School learning pathway with evidence, revision, mastery, and learner-centered progression.")+'</p><nav class="middle-canonical-access" aria-label="Academy access"><a class="middle-canonical-button charcoal" href="https://vervenveda.com/Khaemenes_Academy.github.io/student/">Learner Profile</a><a class="middle-canonical-button" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/">Parent Profile</a><a class="middle-canonical-button" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/enroll/">Enrollment</a></nav></div>';
 const crumb=document.querySelector(".middle-canonical-breadcrumbs");if(crumb)crumb.insertAdjacentElement("afterend",hero);
}
function ensureAboutAndFeatures(){
 if(document.querySelector(".middle-canonical-overview"))return;
 const gradeHome=ROOT+"grades/grade-"+grade+"/",subjectHome=subjectSlug?location.href:gradeHome;
 const featureData=subjectSlug?[
  ["36-Week Path","Open the complete subject sequence and move week by week through the course.",subjectHome+"week-01.html","Begin Week 01"],
  ["Assessments","Open grade-level weekly assessments and mastery evidence without changing protected records.",gradeHome+"assessments/weekly-assessments.html","Open Assessments"],
  ["Teacher Tools","Open the grade-level teacher support surface for planning and review.",gradeHome+"teacher-tools/","Teacher Tools"],
  ["Certificate & Records","Review the grade-level certificate and learner-record pathway.",gradeHome+"records/certificate.html","Open Records"]
 ]:[
  ["Subject Halls","Open the nine Grade "+Number(grade)+" subject pathways.","#subjects","Open Subjects"],
  ["36 Weeks","Browse the full Grade "+Number(grade)+" weekly sequence.","#weeks","Open Weeks"],
  ["Assessments","Review grade-level assessment access and mastery checkpoints.","assessments/weekly-assessments.html","Open Assessments"],
  ["Teacher Tools","Open planning and instructional support for Grade "+Number(grade)+".","teacher-tools/","Teacher Tools"]
 ];
 const about=document.createElement("section");about.className="middle-canonical-overview";
 const aboutText=subjectSlug?(title+" is one of nine Grade "+Number(grade)+" subject halls. The existing curriculum, weekly lessons, assessment rules, and subject-specific engines remain authoritative beneath this shared landing shell."):(gradeNames[grade]+" connects nine subject halls, 36 weeks of study, learner records, assessments, electives, and readiness evidence under one Middle School pathway.");
 about.innerHTML='<div class="middle-canonical-shell"><article class="middle-canonical-about"><h2>About</h2><p>'+aboutText+'</p></article><section class="middle-canonical-features" aria-labelledby="middleFeaturesTitle"><h2 id="middleFeaturesTitle">Course Features</h2><div class="middle-canonical-feature-grid">'+featureData.map((f,i)=>'<button type="button" class="middle-canonical-feature" data-middle-feature="'+i+'"><h3>'+f[0]+'</h3><p>'+f[1]+'</p><span>More Information</span></button>').join("")+'</div></section></div>';
 const hero=document.querySelector(".middle-canonical-hero");if(hero)hero.insertAdjacentElement("afterend",about);
 featureData.forEach((f,i)=>{const d=document.createElement("dialog");d.className="middle-canonical-dialog";d.id="middle-feature-"+i;d.innerHTML='<div><h2>'+f[0]+'</h2><p>'+f[1]+'</p><div class="middle-canonical-dialog-actions"><a href="'+f[2]+'" class="middle-canonical-button charcoal">'+f[3]+'</a><button type="button" class="middle-canonical-button" data-middle-feature-close>Close</button></div></div>';document.body.append(d)});
}
function ensureFooter(){const foot=document.querySelector("footer");if(foot)foot.classList.add("middle-canonical-footer")}
function bindFeatures(){document.addEventListener("click",e=>{const b=e.target.closest("[data-middle-feature]");if(b){const d=document.getElementById("middle-feature-"+b.dataset.middleFeature);if(d&&d.showModal)d.showModal();return}if(e.target.closest("[data-middle-feature-close]"))e.target.closest("dialog")?.close()})}
async function mount(){
 if(!document.body)return;document.body.dataset.middleLandingShell="v1";const intro=existingIntro();removeCompetingChrome();removeLegacyScripts();
 await load("https://vervenveda.com/assets/vnv-333-ticker.js","vnv-333-ticker.js");
 await load("https://vervenveda.com/assets/vnv-ticker-autopopulate.js","vnv-ticker-autopopulate.js");
 try{window.VNV_TICKER?.autoPopulate?.({label:subjectSlug?("Grade "+Number(grade)+" · "+title):("Grade "+Number(grade)+" Quick Links"),max:14})}catch{}
 if(!document.querySelector("[data-vnv-header-legacy]")){const a=document.createElement("header");a.hidden=true;a.setAttribute("aria-hidden","true");a.setAttribute("data-vnv-header-legacy","");document.body.prepend(a)}
 await load("https://vervenveda.com/assets/vnv-header-autopopulate.js","vnv-header-autopopulate.js");
 try{window.VNV_HEADER?.mount?.({replaceLegacy:true,title:"Khaemenes Academy",subtitle:"Middle School · "+(subjectSlug?("Grade "+Number(grade)+" · "+title):gradeNames[grade]),icon:"K",home:ROOT,actions:[]})}catch{}
 let rail=document.getElementById("vnv-language-rail");if(!rail){rail=document.createElement("div");rail.id="vnv-language-rail";rail.hidden=true;rail.setAttribute("role","group");rail.setAttribute("aria-label","Page translation tools");document.body.append(rail)}
 await load("https://vervenveda.com/assets/khaemenes-campus-phrases.js","khaemenes-campus-phrases.js");
 await load("https://vervenveda.com/assets/khaemenes-interlingual-core.js","khaemenes-interlingual-core.js");
 await load("https://vervenveda.com/Khaemenes_Linguistics.github.io/assets/khaemenes-translator-loader.js?v=1.1.1","khaemenes-translator-loader.js");
 await load("https://vervenveda.com/assets/vnv-language.js?v=20261121-half-height","vnv-language.js");
 await load(ROOT+"assets/middle-school-landing-class-tools-v1.js","middle-school-landing-class-tools-v1.js");
 await load("https://vervenveda.com/assets/vnv-class-tools-toolbar.js?v=1.6.1","vnv-class-tools-toolbar.js");
 await load("https://vervenveda.com/assets/vnv-ecosystem-toolbar.js","vnv-ecosystem-toolbar.js");
 ensureBreadcrumb();ensureHero(intro);ensureAboutAndFeatures();ensureFooter();bindFeatures();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
window.KhaemenesMiddleLandingShell=Object.freeze({version:"1.0.0",mount});
})();