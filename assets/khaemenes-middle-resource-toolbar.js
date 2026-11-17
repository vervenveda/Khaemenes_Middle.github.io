/* Khaemenes Middle Resource Toolbar compatibility shim v2.
   Legacy full-width resource bar retired in favor of the canonical lower-left
   Verve N Veda Class Tools toolbar. Navigation only; no mastery/grade writes. */
(()=>{"use strict";
if(document.getElementById("khaeMiddleResourceToolbar"))document.getElementById("khaeMiddleResourceToolbar").remove();
const VNV="https://vervenveda.com/assets/";
function has(src){const p=new URL(src,location.href).pathname;return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname===p}catch{return false}})}
function load(src,key){
 if(has(src))return Promise.resolve();
 return new Promise(resolve=>{
  const s=document.createElement("script");s.src=src;s.defer=true;s.dataset[key]="1";
  s.addEventListener("load",resolve,{once:true});s.addEventListener("error",resolve,{once:true});
  (document.head||document.documentElement).append(s);
 });
}
(async()=>{
 await load(VNV+"vnv-class-tools-presets.js","khaemenesMiddleClassPresets");
 try{window.VNVSelectClassToolsPreset?.("middle")}catch{}
 await load(VNV+"vnv-class-tools-toolbar.js","khaemenesMiddleClassToolbar");
 try{window.VNVClassToolsToolbar?.mount?.()}catch{}
 document.documentElement.dataset.khaemenesMiddleLegacyResourceToolbar="retired-to-class-tools";
})();
})();
