(function attachKhaemenesMiddleCoursePins(global){
  "use strict";

  const VERSION="1.0.0";
  const PIN_KEY="khaemenes_course_pins_v1";
  const MAX_PINS=24;

  function registry(){return global.KhaemenesFamilyRegistry||null}
  function clean(v,max=180){return String(v??"").trim().slice(0,max)}
  function read(){
    try{
      const parsed=JSON.parse(localStorage.getItem(PIN_KEY)||"null");
      return parsed&&typeof parsed==="object"&&parsed.learners&&typeof parsed.learners==="object"?parsed:{version:1,learners:{}};
    }catch{return {version:1,learners:{}}}
  }
  function write(state){
    try{localStorage.setItem(PIN_KEY,JSON.stringify(state));return true}catch{return false}
  }
  function activeLearner(){return registry()?.getLearner?.()||null}
  function learnerPins(learnerId=activeLearner()?.learnerId){
    if(!learnerId)return [];
    const list=read().learners?.[learnerId];
    return Array.isArray(list)?list.filter(x=>x&&typeof x==="object").slice(0,MAX_PINS):[];
  }
  function normalizePin(pin={}){
    return {
      id:clean(pin.id||pin.courseId||pin.href,120),
      title:clean(pin.title||"Course",120),
      subtitle:clean(pin.subtitle||"Middle School elective",160),
      href:clean(pin.href||location.href,300),
      stage:"middle",
      grade:clean(pin.grade||activeLearner()?.grade||"",8)||null,
      type:clean(pin.type||"course",40),
      pinnedAt:new Date().toISOString()
    };
  }
  function isPinned(id,learnerId=activeLearner()?.learnerId){
    const key=clean(id,120);
    return Boolean(key&&learnerPins(learnerId).some(p=>p.id===key));
  }
  function pin(pinData,learner=activeLearner()){
    if(!learner?.learnerId)return {ok:false,reason:"missing-learner"};
    const pin=normalizePin(pinData);
    if(!pin.id)return {ok:false,reason:"missing-course-id"};
    const state=read();
    const current=Array.isArray(state.learners[learner.learnerId])?state.learners[learner.learnerId].filter(Boolean):[];
    const next=[pin,...current.filter(p=>p?.id!==pin.id)].slice(0,MAX_PINS);
    state.learners[learner.learnerId]=next;
    if(!write(state))return {ok:false,reason:"storage-unavailable"};
    global.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed",{detail:{learnerId:learner.learnerId,pins:next}}));
    return {ok:true,pin};
  }
  function unpin(id,learner=activeLearner()){
    if(!learner?.learnerId)return {ok:false,reason:"missing-learner"};
    const key=clean(id,120),state=read();
    const current=Array.isArray(state.learners[learner.learnerId])?state.learners[learner.learnerId]:[];
    state.learners[learner.learnerId]=current.filter(p=>p?.id!==key);
    if(!write(state))return {ok:false,reason:"storage-unavailable"};
    global.dispatchEvent(new CustomEvent("khaemenes-course-pins-changed",{detail:{learnerId:learner.learnerId,pins:state.learners[learner.learnerId]}}));
    return {ok:true};
  }
  function toggle(pinData,learner=activeLearner()){
    return isPinned(pinData?.id||pinData?.courseId,learner?.learnerId)?unpin(pinData?.id||pinData?.courseId,learner):pin(pinData,learner);
  }
  function bindButton(button,pinData){
    if(!button)return;
    function refresh(){
      const learner=activeLearner(),on=Boolean(learner&&isPinned(pinData.id||pinData.courseId,learner.learnerId));
      button.disabled=!learner;
      button.textContent=!learner?"Choose learner to pin":(on?"★ Pinned to Profile":"☆ Pin to Profile");
      button.setAttribute("aria-pressed",on?"true":"false");
      button.title=!learner?"Choose an active Academy learner first":(on?"Remove this class from the active learner profile":"Pin this class to the active learner profile");
    }
    button.addEventListener("click",()=>{toggle(pinData);refresh()});
    global.addEventListener("khaemenes-family-changed",refresh);
    global.addEventListener("khaemenes-course-pins-changed",refresh);
    refresh();
  }

  global.KhaemenesMiddleCoursePins=Object.freeze({version:VERSION,key:PIN_KEY,read,learnerPins,isPinned,pin,unpin,toggle,bindButton});
})(window);
