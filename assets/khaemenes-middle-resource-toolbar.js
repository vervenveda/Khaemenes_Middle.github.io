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
 // Home page only: extend the existing VNV lower-left Class Tools preset.
 // The Academy family-school bridge remains the sole owner of learner identity.
 const isMiddleHome=/\/Khaemenes_Middle\.github\.io\/(?:index\.html)?$/i.test(location.pathname);
 if(isMiddleHome){
   const preset=window.KhaemenesClassToolsConfigV1;
   if(preset){
     const showStudentId=({root})=>{
       const panel=root.querySelector("#vnvClassToolsPanel");
       if(!panel)return;
       let details=root.querySelector("#middleStudentIdDetails");
       if(!details){
         details=document.createElement("section");
         details.id="middleStudentIdDetails";
         details.className="vct-pop";
         details.hidden=true;
         details.setAttribute("aria-label","Academy student identity");
         panel.append(details);
       }
       const opening=details.hidden;
       root.querySelectorAll(".vct-pop").forEach(pop=>{pop.hidden=true});
       if(!opening)return;
       const heading=document.createElement("h2");
       heading.dataset.middleStudentIdHeading="";
       heading.textContent="Student ID";
       const content=document.createElement("div");
       content.id="middleStudentIdContent";
       const bridge=document.getElementById("khaemenesFamilyBridge");
       if(bridge){
         // Reuse the sanitized, registry-owned view; never generate or store
         // another learner record, ID, placement, or credential.
         content.innerHTML=bridge.innerHTML;
       }else{
         const message=document.createElement("p");
         message.textContent="Academy learner information is not available on this page yet.";
         const link=document.createElement("a");
         link.href="https://vervenveda.com/Khaemenes_Academy.github.io/family/";
         link.textContent="Open Family Profile";
         content.append(message,link);
       }
       details.replaceChildren(heading,content);
       details.hidden=false;
     };
     window.KhaemenesClassToolsConfigV1={
       ...preset,
       id:"middle-school-home",
       match:()=>/\/Khaemenes_Middle\.github\.io\/(?:index\.html)?$/i.test(location.pathname),
       tools:[
         {type:"action",action:"student-id",label:"Student ID",sub:"Academy learner context"},
         ...(preset.tools||[])
       ],
       actions:{...(preset.actions||{}),"student-id":showStudentId}
     };
   }
 }
 await load(VNV+"vnv-class-tools-toolbar.js","khaemenesMiddleClassToolbar");
 try{window.VNVClassToolsToolbar?.mount?.()}catch{}
 document.documentElement.dataset.khaemenesMiddleLegacyResourceToolbar="retired-to-class-tools";
})();
})();
