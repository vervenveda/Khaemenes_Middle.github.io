/* Khaemenes Academy Middle School · canonical global chrome guard v1.0.0
   Grades 6–8. Idempotent shared authority:
   333 ticker -> AutoPopulate ticker -> official header/menu -> lower-right ecosystem toolbar.
*/
(()=>{"use strict";
if(window.__KHAEMENES_MIDDLE_GLOBAL_CHROME_V1__)return;
window.__KHAEMENES_MIDDLE_GLOBAL_CHROME_V1__=true;

const VNV="https://vervenveda.com/assets/";
const ROOT="https://vervenveda.com/Khaemenes_Middle.github.io/";
const SCRIPTS={
  ticker333:VNV+"vnv-333-ticker.js",
  tickerAuto:VNV+"vnv-ticker-autopopulate.js",
  header:VNV+"vnv-header-autopopulate.js",
  toolbar:VNV+"vnv-ecosystem-toolbar.js"
};

function hasScript(pathname){
  return [...document.scripts].some(s=>{
    try{return new URL(s.src,location.href).pathname===pathname}catch{return false}
  });
}
function load(src,key){
  const url=new URL(src,location.href);
  if(hasScript(url.pathname))return Promise.resolve();
  return new Promise(resolve=>{
    const s=document.createElement("script");
    s.src=url.href;s.defer=true;s.dataset[key]="true";
    s.addEventListener("load",resolve,{once:true});
    s.addEventListener("error",resolve,{once:true});
    (document.head||document.documentElement).append(s);
  });
}
function mount333(){
  try{window.VNV333Ticker?.mount?.()}catch{}
}
function mountAuto(){
  try{
    if(!document.getElementById("vnvTickerAutoPopulate")){
      window.VNV_TICKER?.autoPopulate?.({mode:"auto"});
    }
  }catch{}
  mount333();
}
function gradeFromPath(){
  const m=location.pathname.match(/\/grade-(06|07|08)(?:\/|$)/i);
  return m?m[1]:"";
}
function profileHref(){
  const grade=gradeFromPath();
  return grade?ROOT+"grades/grade-"+grade+"/":ROOT+"#start";
}
function mountHeader(){
  try{
    window.VNV_HEADER?.mount?.({
      title:"Khaemenes Academy",
      subtitle:"Middle School · Grades 6–8",
      icon:"K",
      home:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
      actions:[
        {label:"Start",href:ROOT+"#start"},
        {label:"Grades 6–8",href:ROOT+"#grades"},
        {label:"My Grade",href:profileHref()},
        {label:"Ecosystem",href:"https://vervenveda.com/#directory"},
        {label:"Family",href:"https://vervenveda.com/Khaemenes_Academy.github.io/family/"}
      ]
    });
  }catch{}
}
function mountToolbar(){
  try{window.VNVEcosystemToolbar?.mount?.()}catch{}
  const dock=document.getElementById("vnvEcosystemUtilityDock");
  if(dock){
    dock.style.setProperty("left","auto","important");
    dock.style.setProperty("right","max(12px, env(safe-area-inset-right))","important");
    dock.dataset.khaemenesMiddleCanonicalToolbar="true";
  }
}
async function start(){
  if(!document.body)return;

  await load(SCRIPTS.ticker333,"khaemenesMiddle333");
  mount333();

  await load(SCRIPTS.tickerAuto,"khaemenesMiddleAutoTicker");
  mountAuto();

  await load(SCRIPTS.header,"khaemenesMiddleHeader");
  mountHeader();

  await load(SCRIPTS.toolbar,"khaemenesMiddleToolbar");
  mountToolbar();

  document.documentElement.dataset.khaemenesMiddleChrome="333-auto-header-menu-toolbar";

  if(typeof MutationObserver==="function"){
    new MutationObserver(()=>{
      mount333();mountAuto();mountHeader();mountToolbar();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();
/* Khaemenes semantic hierarchy authority v1
   Eyebrow = category/brand. Title = heading. Description = paragraph.
   Conservative inversion repair: only clear sentence-like heading reversals are changed. */
(()=>{"use strict";
if(window.__KHAEMENES_SEMANTIC_HIERARCHY_V1__)return;
window.__KHAEMENES_SEMANTIC_HIERARCHY_V1__=true;

const BRAND="Khaemenes Academy";
const LABELS=".eyebrow,.kicker,[data-eyebrow],[data-kicker]";
const clean=s=>String(s||"").replace(/\s+/g," ").trim();
const words=s=>clean(s).split(/\s+/).filter(Boolean);
const brandLike=s=>/^(?:verve\s*n\s*veda|khaemenes academy)(?:\b|\s*[·|—-])/i.test(clean(s));
const titleLike=s=>{
  const t=clean(s),w=words(t);
  return !!t&&t.length<=100&&w.length>=1&&w.length<=10&&!/[.!?…]$/.test(t);
};
const sentenceLike=s=>{
  const t=clean(s),w=words(t);
  return /[.!?…]$/.test(t)||w.length>=9||(w.length>=6&&/[,;:]/.test(t));
};
function normalizeLabel(label){
  if(!label||label.dataset.khaemenesHierarchyChecked==="true")return;
  label.dataset.khaemenesHierarchyChecked="true";
  if(label.closest("nav,footer,[data-khaemenes-no-semantic-normalize]"))return;
  const heading=label.nextElementSibling;
  if(!heading||!/^H[1-6]$/.test(heading.tagName))return;
  if(label.children.length||heading.children.length)return;

  const eyebrowText=clean(label.textContent);
  const headingText=clean(heading.textContent);
  if(!sentenceLike(headingText)||!titleLike(eyebrowText))return;

  if(brandLike(eyebrowText)){
    heading.dataset.khaemenesHierarchyReview="brand-eyebrow-sentence-heading";
    return;
  }

  const desc=document.createElement("p");
  desc.className="khaemenes-section-description";
  desc.textContent=headingText;
  desc.dataset.khaemenesDemotedFromHeading="true";

  heading.dataset.khaemenesOriginalHeading=headingText;
  heading.dataset.khaemenesPromotedFromEyebrow=eyebrowText;
  heading.textContent=eyebrowText;

  label.dataset.khaemenesOriginalEyebrow=eyebrowText;
  label.textContent=BRAND;

  heading.insertAdjacentElement("afterend",desc);
  heading.closest("section,article,header,main,div")?.setAttribute("data-khaemenes-hierarchy-normalized","true");
}
function normalizeHierarchy(root=document){
  root.querySelectorAll?.(LABELS).forEach(normalizeLabel);
  document.documentElement.dataset.khaemenesHierarchy="title-description-v1";
}
let pending=false;
function scheduleHierarchy(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{pending=false;normalizeHierarchy(document)});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>normalizeHierarchy(document),{once:true});
else normalizeHierarchy(document);
if(typeof MutationObserver==="function"){
  new MutationObserver(scheduleHierarchy).observe(document.documentElement,{childList:true,subtree:true});
}
})();
