/* Khaemenes Academy Middle School · canonical typography standard v1.0.0
   Grades 6–8 · 16px readable-text floor · 33px titles · one 66px primary page title.
*/
(()=>{"use strict";
if(window.__KHAEMENES_MIDDLE_TYPOGRAPHY_V1__)return;
window.__KHAEMENES_MIDDLE_TYPOGRAPHY_V1__=true;

const STYLE_ID="khaemenesMiddleTypographyStandardV1";
const PRIMARY_ATTR="data-khaemenes-primary-title";

function visible(el){
  if(!el||!el.isConnected||el.hidden||el.getAttribute("aria-hidden")==="true")return false;
  const cs=getComputedStyle(el);
  return cs.display!=="none"&&cs.visibility!=="hidden";
}
function candidates(){
  return [...document.querySelectorAll(
    'main .hero h1,main h1,.hero h1,[data-hero] h1,[data-page-hero] h1,h1,.hero-title,.main-title,.page-title'
  )];
}
function markPrimary(){
  const current=document.querySelector('['+PRIMARY_ATTR+'="true"]');
  if(current&&visible(current))return current;
  document.querySelectorAll('['+PRIMARY_ATTR+']').forEach(el=>el.removeAttribute(PRIMARY_ATTR));
  const chosen=candidates().find(visible)||null;
  if(chosen)chosen.setAttribute(PRIMARY_ATTR,"true");
  return chosen;
}
function hasReadableText(el){
  if(!el||el.nodeType!==1)return false;
  if(el.matches("script,style,noscript,template,svg,svg *,canvas,iframe,br,hr,source,track,meta,link"))return false;
  const text=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&String(n.nodeValue||"").trim());
  return text||el.matches("input,select,textarea,button,option");
}
function enforceFloor(root=document.body){
  if(!root)return;
  const nodes=[];
  if(root.nodeType===1)nodes.push(root);
  if(root.querySelectorAll)nodes.push(...root.querySelectorAll("*"));
  for(const el of nodes){
    if(!hasReadableText(el))continue;
    if(el.matches("h1,h2,h3,h4,h5,h6,[role=heading],["+PRIMARY_ATTR+"]"))continue;
    const size=parseFloat(getComputedStyle(el).fontSize||"0");
    if(size>0&&size<16){
      el.style.setProperty("font-size","16px","important");
      el.dataset.khaemenesMinText="16";
    }
  }
}
function install(){
  if(!document.head||!document.body)return;
  let style=document.getElementById(STYLE_ID);
  if(!style){
    style=document.createElement("style");
    style.id=STYLE_ID;
    style.textContent=`
html:root body{font-size:16px!important}
html:root body :is(
  p,li,dt,dd,blockquote,figcaption,caption,legend,label,
  a,button,input,select,textarea,option,output,
  td,th,summary,small,strong,em,b,i,u,s,mark,time,
  .eyebrow,.kicker,.subtitle,.subheading,.lead,.description,
  .breadcrumbs,.breadcrumb,.badge,.chip,.pill,.status,.meta,
  .caption,.note,.helper,.hint,.message,.toast,
  .brand-name,.brand-sub,.menu-group,.menu-link,.menu-link small,.menu-link strong
){font-size:max(16px,1em)!important}
html:root body :is(
  h1,h2,h3,h4,h5,h6,[role="heading"],
  .page-title,.hero-title,.main-title,.section-title,.card-title,
  .display-title,.site-title,.brand-title,.modal-title,.dialog-title
){
  font-size:33px!important;
  line-height:1.2!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance
}
html:root body [${PRIMARY_ATTR}="true"]{
  font-size:66px!important;
  line-height:1.05!important;
  font-weight:400!important;
  overflow-wrap:anywhere;
  text-wrap:balance
}
@media(max-width:560px){
  html:root body [${PRIMARY_ATTR}="true"]{font-size:66px!important}
}
@media print{html:root body{font-size:16px!important}}
`;
    document.head.append(style);
  }
  markPrimary();
  enforceFloor();
  document.documentElement.dataset.khaemenesMiddleTypography="16-33-66";
}
let pending=false;
function schedule(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{pending=false;install()});
}
function start(){
  install();
  if(typeof MutationObserver==="function"){
    new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  }
  window.addEventListener("resize",schedule,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();