/* Khaemenes Middle School · Mathematics Weekly Practice v1.0.0
 * Adds four interactive checks inside the approved six-section weekly Mathematics Studio.
 * Uses only the existing first-party math question factory. Strictly formative:
 * no grade, mastery, learner record, account, placement, or progression writes.
 */
(()=>{
"use strict";
const match=String(location.pathname).match(/\/grades\/grade-(06|07|08)\/subjects\/mathematics\/week-(0[1-9]|[12]\d|3[0-6])\.html$/i);
if(!match)return;
const grade=Number(match[1]),week=Number(match[2]);
let installed=false,observer=null;
const make=(tag,label)=>{const el=document.createElement(tag);if(label!==undefined)el.textContent=label;return el;};
function install(){
 if(installed)return true;
 const sections=document.querySelectorAll('#kg7DailyLessons details.kg7-lesson');
 if(sections.length<6)return false;
 const host=sections[4].querySelector('.kg7-content');
 if(!host)return false;
 if(host.querySelector('[data-middle-math-challenge]')){installed=true;return true;}
 const factory=window.KhaemenesMiddleQuestionFactory;
 if(!factory?.makePool||!factory?.validateQuestion)return false;
 const focus=document.querySelector('.kg7-course-focus')?.textContent?.trim()||
   document.querySelector('main .heading h1')?.textContent?.trim()||'mathematics';
 const seed='middle-math-weekly-practice-'+grade+'-'+week;
 let pool=[];
 try{
   if(grade===6&&week<=6&&factory.makeGrade6MathWeek)
     pool=factory.makeGrade6MathWeek({week,count:6,seed}).slice(0,4);
   if(pool.length!==4)pool=factory.makePool({grade,subject:'mathematics',focus,seed,count:4});
   pool=pool.filter(q=>factory.validateQuestion(q));
 }catch(error){console.warn('Middle math practice unavailable; original lesson remains usable.',error);return false;}
 if(pool.length!==4)return false;
 const card=make('section');card.className='kg7-math-check';card.dataset.middleMathChallenge='v1';
 card.style.cssText='margin:20px 0 4px;padding:17px;border:1px solid #b38b36;border-radius:7px;background:#fff9ed;color:#24292d';
 const title=make('h3','Interactive Math Challenge · Practice');title.style.cssText='font:400 22px/1.25 Cinzel,Georgia,serif;margin:0 0 8px';
 const note=make('p','Four fresh practice questions related to this mathematics unit. This is not an official assessment and does not affect grades or unlock lessons.');
 note.style.cssText='font-size:16px;line-height:1.5';
 const question=make('p');question.style.cssText='font-size:18px;line-height:1.5;margin:16px 0 12px';
 const options=make('div');options.style.cssText='display:grid;gap:9px';
 const feedback=make('p');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.style.cssText='font-size:16px;min-height:24px';
 const count=make('p','0 of 4 challenges solved · Practice only');count.style.cssText='font-size:16px';
 const buttons=make('div');buttons.style.cssText='display:flex;flex-wrap:wrap;gap:9px;margin-top:10px';
 const next=make('button','Next challenge');next.type='button';next.style.cssText='padding:10px 15px;background:#24292d;color:#fffdf7;border:0;border-radius:7px;min-height:44px;font-size:16px';
 buttons.append(next);card.append(title,note,question,options,feedback,count,buttons);
 let current=0;const solved=new Set();
 function show(){
   const item=pool[current];question.textContent='Challenge '+(current+1)+': '+item.prompt;
   options.replaceChildren();feedback.textContent='';
   item.options.forEach((value,i)=>{
     const b=make('button',String(value));b.type='button';
     b.style.cssText='text-align:left;padding:10px 14px;background:white;color:#24292d;border:1px solid #8d9086;border-radius:7px;min-height:44px;font-size:16px;cursor:pointer';
     b.addEventListener('click',()=>{
       if(i===item.answer){
         solved.add(current);feedback.textContent='Correct. '+String(item.rationale||'Explain how you reached this answer.');
       }else feedback.textContent='Not yet. Review the worked example and try again.';
       count.textContent=solved.size+' of 4 challenges solved · Practice only';
     });
     options.append(b);
   });
 }
 next.addEventListener('click',()=>{current=(current+1)%pool.length;show();});
 host.append(card);installed=true;show();
 return true;
}
if(install())return;
observer=new MutationObserver(()=>{if(install())observer.disconnect();});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(install())observer.disconnect();},{once:true});
else if(install())observer.disconnect();
})();
