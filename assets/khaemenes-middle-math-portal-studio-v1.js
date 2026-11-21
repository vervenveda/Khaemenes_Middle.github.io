/* Khaemenes Academy · Grade 07 Mathematics Studio presentation upgrade v1.0.0
 * Enhances the existing five daily articles in each mathematics week without replacing
 * course data, learner identity, grade recording, mastery, or existing formative ledgers.
 * Standalone Grade 7 Week 01 Lesson 01 remains its approved separate page.
 */
(function(){
'use strict';
if(window.KhaemenesMiddleMathPortalV1)return;
var path=String(location.pathname||'');
var gradeMatch=path.match(/\/grades\/grade-(06|08)\/subjects\/mathematics\/(studio|week-(\d{2}))\.html$/i);if(!gradeMatch)return;var grade=gradeMatch[1];
var week=gradeMatch[3]?Number(gradeMatch[3]):Number(new URLSearchParams(location.search).get('week'));if(!Number.isInteger(week)||week<1||week>36)return;
var rootId='khaeGrade7MathStudioStyle',opened=0,drawings=new Map();
var $=function(s,r){return(r||document).querySelector(s)};
var $$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
var css=[
'body.kg7-math{background:#fff9ed;color:#24292d;font:400 17px/1.55 "Brandon Grotesque",Nunito,"Avenir Next",system-ui,sans-serif}',
'body.kg7-math main.section{padding:0 0 32px;background:#fff9ed;overflow-x:clip}',
'body.kg7-math main .shell{width:min(1100px,calc(100% - 30px));margin-inline:auto}',
'body.kg7-math main .heading.kg7-hero{padding:42px 17px 36px;background:linear-gradient(120deg,#214e61,#32675d 30%,#764559 66%,#b1833c);color:#fffdf7!important;text-align:center;margin:0 calc(50% - 50vw) 24px;width:100vw;max-width:100vw}',
'body.kg7-math .kg7-hero h1{font:400 clamp(38px,7vw,77px)/1.09 Cinzel,Georgia,serif!important;color:#fffdf7!important;margin:12px auto!important;max-width:970px}',
'body.kg7-math .kg7-hero .kicker{font:400 clamp(22px,4vw,33px)/1.2 Cinzel,Georgia,serif!important;color:#fffdf7!important;letter-spacing:normal!important}',
'body.kg7-math .kg7-hero p{color:#fffdf7!important;margin:9px auto;max-width:870px}',
'body.kg7-math .kg7-hero p:last-child{font-size:clamp(18px,3vw,24px)!important}',
'.kg7-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:0 0 18px}',
'.kg7-strip a,.kg7-strip button{font:400 16px/1.3 Nunito,Arial,sans-serif;min-height:44px;display:flex;justify-content:center;align-items:center;border:1px solid #bdb09c;background:#fffdf7;color:#24292d;padding:7px 12px;text-align:center;border-radius:7px;text-decoration:none;cursor:pointer}',
'.kg7-note{padding:11px 15px;margin:0 0 19px;border-left:4px solid #b38b36;border-radius:7px;background:#fff0c9;font-size:16px}',
'.kg7-mission{text-align:center;padding:15px 10px 22px;color:#24292d}',
'.kg7-mission h2{font:400 28px/1.2 Cinzel,Georgia,serif;margin:0 0 10px}',
'.kg7-mission p{max-width:790px;margin:0 auto}',
'.kg7-progress{height:8px;margin:16px auto 8px;width:min(100%,650px);background:#fffdf7;border:1px solid #c5b7a4;border-radius:7px;overflow:hidden}',
'.kg7-progress>span{height:100%;display:block;background:#246766;width:16.67%;transition:width .2s}',
'.kg7-progress-label{font-size:15px;color:#5a5a52}',
'.kg7-crumbs{display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;text-align:center;margin:17px auto;color:#24292d;font-size:16px}',
'.kg7-lesson{border:1px solid #797469;border-radius:7px;overflow:hidden;margin:11px 0;background:#fffdf7}',
'.kg7-lesson>summary{display:flex;align-items:center;gap:13px;padding:10px 16px;border-left:7px solid var(--kg7-accent);min-height:53px;list-style:none;cursor:pointer;font-size:18px;color:#24292d}',
'.kg7-lesson>summary::-webkit-details-marker{display:none}',
'.kg7-lesson>summary:after{content:"+";margin-left:auto;font-size:23px;font-weight:400}',
'.kg7-lesson[open]>summary:after{content:"−"}',
'.kg7-step{width:35px;height:35px;flex:0 0 35px;background:#24292d;color:#fffdf7;border-radius:7px;display:grid;place-items:center;font-size:16px}',
'.kg7-content{padding:17px 20px 21px;border-top:1px solid #c5b7a4}',
'body.kg7-math .kg7-content article.lesson{margin:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;padding:0!important;color:#24292d!important}',
'.kg7-content article.lesson>h4:first-child{display:none}',
'.kg7-content article.lesson p,.kg7-content article.lesson li{font-size:17px!important;line-height:1.57;color:#24292d!important}',
'.kg7-work{border:1px solid #c6b59e;background:#fff8ee;border-radius:7px;padding:15px;margin-top:18px}',
'.kg7-work h3{font:400 22px/1.25 Cinzel,Georgia,serif;color:#24292d;margin:0 0 8px}',
'.kg7-work p{margin:6px 0 12px}',
'.kg7-work-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px}',
'.kg7-work textarea{width:100%;min-height:174px;resize:vertical;border:1px solid #3d4b4a;border-radius:7px;padding:11px;color:#24292d;background:white;font:400 17px/1.5 Nunito,Arial,sans-serif}',
'.kg7-canvas-wrap{border:1px solid #3d4b4a;background:#fff;border-radius:7px;overflow:hidden}',
'.kg7-canvas-wrap canvas{width:100%;height:185px;touch-action:none;display:block}',
'.kg7-actions{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}',
'.kg7-actions button,.kg7-actions a{min-height:42px;padding:7px 13px;background:#24292d;border:1px solid #24292d;border-radius:7px;color:#fffdf7;font:400 16px/1.2 Nunito,Arial,sans-serif;cursor:pointer;text-decoration:none}',
'.kg7-actions .kg7-secondary{background:#fffdf7;color:#24292d}',
'.kg7-work small{display:block;font-size:15px;color:#5c5c52}',
'.kg7-resource-shelf{border:1px solid #bfae8a;border-radius:7px;background:#f9efde;padding:19px;margin:24px 0 36px}',
'.kg7-resource-shelf h2{font:400 28px/1.25 Cinzel,Georgia,serif;margin:0 0 8px}',
'.kg7-resource-shelf p{margin:0 0 15px}',
'.kg7-resource-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}',
'.kg7-resource-grid a{min-height:105px;display:flex;gap:9px;align-items:flex-start;padding:11px;border:1px solid #c4b49e;border-radius:7px;background:#fffaf1;color:#24292d;text-decoration:none}',
'.kg7-resource-grid a .kg7-icon{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border-radius:7px;background:var(--kg7-color);color:#fff;font-size:20px}',
'.kg7-resource-grid strong{display:block;font-size:16px;line-height:1.24;font-weight:550}',
'.kg7-resource-grid small{display:block;font-size:15px;line-height:1.36;margin-top:5px}',
'body.kg7-math footer.footer{background:#24292d!important;color:#fffdf7!important;text-align:center!important;padding:27px 14px 95px!important}',
'body.kg7-math footer.footer .shell{text-align:center!important}',
'body.kg7-math .kg7-hero .kg7-subject-title{font-size:clamp(39px,7vw,77px)!important}',
'body.kg7-math .kg7-hero .kg7-course-focus{font-size:17px!important}',
'body.kg7-math :is(button,input,textarea,summary,a):focus-visible{outline:3px solid #297ca3;outline-offset:2px}',
'@media(max-width:850px){.kg7-resource-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.kg7-work-grid{grid-template-columns:1fr}}',
'@media(max-width:570px){.kg7-strip{grid-template-columns:repeat(2,minmax(0,1fr))}.kg7-lesson>summary{padding:9px 11px;font-size:16px}.kg7-content{padding:13px}.kg7-resource-grid a{padding:9px}.kg7-resource-grid{gap:8px}.kg7-hero{padding:33px 13px!important}}',
'@media(max-width:340px){.kg7-resource-grid{grid-template-columns:1fr}}',
'@media print{.kg7-work,.kg7-actions,.kg7-strip,.kg7-resource-shelf{display:none!important}.kg7-lesson .kg7-content{display:block!important}body.kg7-math .heading.kg7-hero{background:white!important;color:black!important}}'
].join('\n');
function node(tag,className,text){var e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e}
function link(label,href){var a=node('a','',label);a.href=href;return a}
function download(name,blob){var a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(u)},2000)}
function drawing(area,day){
var canvas=$('canvas',area),ctx=canvas.getContext('2d');if(!ctx)return;
var lines=[],current=null,id=null;
function pos(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
function paint(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;ctx.clearRect(0,0,w,h);ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);lines.concat(current?[current]:[]).forEach(function(points){if(!points.length)return;ctx.strokeStyle='#24292d';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(points[0].x*w,points[0].y*h);if(points.length===1)ctx.lineTo(points[0].x*w+.2,points[0].y*h+.2);points.slice(1).forEach(function(p){ctx.lineTo(p.x*w,p.y*h)});ctx.stroke()})}
function size(){var w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;var d=Math.min(3,devicePixelRatio||1);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);paint()}
canvas.addEventListener('pointerdown',function(e){if(id!==null)return;id=e.pointerId;canvas.setPointerCapture(id);current=[pos(e)];paint()});
canvas.addEventListener('pointermove',function(e){if(e.pointerId!==id||!current)return;current.push(pos(e));paint()});
function finish(e){if(e.pointerId!==id)return;if(current)lines.push(current);current=null;id=null;paint()}
canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);
$('[data-undo]',area).addEventListener('click',function(){lines.pop();paint()});
$('[data-clear]',area).addEventListener('click',function(){if(confirm('Clear handwriting for this lesson?')){lines=[];paint()}});
$('[data-png]',area).addEventListener('click',function(){size();canvas.toBlob(function(blob){if(blob)download('grade-'+grade+'-week-'+String(week).padStart(2,'0')+'-'+day+'-handwriting.png',blob)},'image/png')});
drawings.set(day,{resize:size,read:function(){return lines.slice()}});return size
}
function work(day,article){
var block=node('section','kg7-work');block.append(node('h3','', 'Your mathematical workspace'));
block.append(node('p','', 'Show your mathematics and explain your reasoning. These notes are practice only and do not change the official assessment.'));
var grid=node('div','kg7-work-grid'),left=node('div'),right=node('div');
var label=node('label','', 'Type your reasoning');var txt=node('textarea');txt.id='kg7-week-'+week+'-'+day+'-notes';txt.placeholder='What did you calculate, discover, or explain?';label.htmlFor=txt.id;left.append(label,txt);
right.append(node('label','', 'Handwriting & sketch workspace'));
var actions=node('div','kg7-actions');
[['Undo','undo'],['Clear','clear'],['Save PNG','png']].forEach(function(v){var b=node('button','kg7-secondary',v[0]);b.type='button';b.setAttribute('data-'+v[1],'');actions.append(b)});
right.append(actions);var holder=node('div','kg7-canvas-wrap'),canvas=node('canvas');canvas.setAttribute('aria-label','Handwriting canvas for '+day);holder.append(canvas);right.append(holder,node('small','', 'Touch, mouse, and Apple Pencil-compatible pointer drawing. Export before navigating away.'));
grid.append(left,right);block.append(grid);article.append(block);return {txt:txt,draw:initDrawing()};
function initDrawing(){return drawing(right,day)}
}
function addShelf(shell){
if($('#kg7Resources'))return;var shelf=node('section','kg7-resource-shelf');shelf.id='kg7Resources';shelf.append(node('h2','', 'Math Tools & Game Shelf'),node('p','', 'Choose optional tools that match your current skill. Games support practice but never replace verified mastery.'));
var entries=[
['Scientific Calculator','Check computations and estimates','▦','#285c5f','https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/'],
['Factor Structure Lab','Explore factors and multiples','⬡','#794452','https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/factors-and-multiples/'],
['Estimate Defender','Check reasonableness','◎','#ae8337','https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/estimate-defender/'],
['Ratio Atelier','Explore proportional reasoning','⚖','#356d6d','https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/ratio-atelier/'],
['Fraction Forge','Strengthen fraction fluency','½','#794452','https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/fraction-forge/'],
['OHMIC CAD Studio','Measurement and spatial reasoning','△','#356d6d','https://vervenveda.github.io/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html'],
['Math Games Library','Strategy and pattern games','♟','#77713d','https://vervenveda.com/arcade.github.io/'],
['Number Line Studio','Reason with inequalities','↔','#794452','https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/assets/learning-games/inequality-number-line/']];
var grid=node('div','kg7-resource-grid');entries.forEach(function(item){var a=link('',item[4]);a.target='_blank';a.rel='noopener noreferrer';var icon=node('span','kg7-icon',item[2]);icon.style.setProperty('--kg7-color',item[3]);var detail=node('span');detail.append(node('strong','',item[0]),node('small','',item[1]));a.append(icon,detail);grid.append(a)});shelf.append(grid);shell.append(shelf)
}
function start(){
if(document.body.dataset.grade7MathStudio==='1')return;
var allArticles=$$('main article.lesson'),heading=$('main .heading'),shell=$('main .shell.section')||$('main .shell');
var days=['Monday','Tuesday','Wednesday','Thursday','Friday'];
var articles=days.map(function(day){return allArticles.find(function(article){var h=$('h2,h3,h4',article);return h&&new RegExp('^'+day+'(?:\\b|\\s*[-—:])','i').test(h.textContent.trim())})});
if(!articles.every(Boolean)||!shell){console.warn('Middle mathematics studio: missing five-day article contract; preserving original page.');return}
if(!heading){heading=node('div','heading');heading.append(node('p','kicker','Khaemenes Academy'),node('h1','', 'Mathematics Week '+String(week).padStart(2,'0')));shell.prepend(heading)}
document.body.dataset.grade7MathStudio='1';document.body.classList.add('kg7-math');
var style=node('style');style.id=rootId;style.textContent=css;document.head.append(style);
heading.classList.add('kg7-hero');
var title=$('h1',heading),topic=title?title.textContent.trim():'Mathematics';if(title){title.textContent='Mathematics Studio';title.classList.add('kg7-subject-title');title.setAttribute('data-math-week-title',String(week));}
var kicker=$('.kicker',heading);if(kicker)kicker.textContent='Khaemenes Academy';
var oldDescription=$('p',heading);oldDescription.forEach(function(p){if(p!==kicker)p.remove()});
var desc=node('p','', 'Grade '+Number(grade)+' · Week '+String(week).padStart(2,'0')+' · Five Daily Lessons');desc.style.fontSize='24px';heading.append(desc);
var focus=node('p','kg7-course-focus',topic+' · Explore, calculate, explain');heading.append(focus);
var crumbs=node('nav','kg7-crumbs');crumbs.setAttribute('aria-label','Breadcrumb');crumbs.append(link('Grade '+Number(grade),'../../index.html'),node('span','', '/'),link('Mathematics','index.html'),node('span','', '/'),node('span','', 'Week '+String(week).padStart(2,'0')));
heading.after(crumbs);
var mission=node('section','kg7-mission');mission.append(node('h2','',"Today's mathematical mission"),node('p','', 'Work through the original five daily lessons. Practice with written reasoning, a handwriting workspace, and optional mathematical games.'));var progressTrack=node('div','kg7-progress'),progressFill=node('span');progressFill.setAttribute('aria-hidden','true');progressTrack.append(progressFill);mission.append(progressTrack);var progressLabel=node('p','kg7-progress-label','1 of 6 sections explored · Practice only');mission.append(progressLabel);crumbs.after(mission);
var nav=node('nav','kg7-strip');nav.setAttribute('aria-label','Week mathematics navigation');nav.append(link('Subject Hall','index.html'),link('Weekly Plan','../../weekly-plans/week-'+String(week).padStart(2,'0')+'.html'),link('Official Assessments','../../assessments/weekly-assessments.html'));
var exportButton=node('button','', 'Export practice');exportButton.type='button';nav.append(exportButton);mission.after(nav);
var note=node('p','kg7-note','This is interactive lesson practice. Existing learner-scoped formative checkpoints remain in each daily lesson. Scores, grades, mastery and certificates continue to be controlled by the official Academy assessment system.');nav.after(note);
var week01=week===1;
var section=node('section');section.id='kg7DailyLessons';section.setAttribute('aria-label','Interactive five-day mathematics lessons');note.after(section);
var states=[],visited=new Set([0]);
function updateProgress(){var count=visited.size;progressFill.style.width=(count/6*100)+'%';progressLabel.textContent=count+' of 6 sections explored · Practice only'}
articles.forEach(function(article,i){
var day=['Monday','Tuesday','Wednesday','Thursday','Friday'][i],h=$('h2,h3,h4',article),titleText=h?h.textContent.trim():day+' Learning';
var details=node('details','kg7-lesson');details.style.setProperty('--kg7-accent',['#246766','#254562','#b38b36','#794452','#246766'][i]);if(i===0)details.open=true;
var summary=node('summary');summary.append(node('span','kg7-step',String(i+1).padStart(2,'0')),node('strong','',titleText));details.append(summary);
var content=node('div','kg7-content');article.parentNode.removeChild(article);content.append(article);
if(week01&&i===0){var p=node('p');p.append(link('Open the approved interactive Lesson 01','lesson-01.html'));p.style.padding='11px';p.style.background='#edf5f0';p.style.borderRadius='7px';article.insertBefore(p,article.firstChild)}
var workArea=work(day.toLowerCase(),article);
states.push({day:day,textarea:workArea.txt,read:workArea.draw?drawings.get(day.toLowerCase()):null});details.append(content);section.append(details);
details.addEventListener('toggle',function(){if(details.open){visited.add(i);updateProgress();$('details.kg7-lesson',section).forEach(function(other){if(other!==details)other.open=false});var d=drawings.get(day.toLowerCase());if(d)requestAnimationFrame(d.resize)}})
});
var review=node('details','kg7-lesson');review.style.setProperty('--kg7-accent','#254562');var rs=node('summary');rs.append(node('span','kg7-step','06'),node('strong','','Reflect · Weekly Evidence & Next Step'));review.append(rs);var rb=node('div','kg7-content');rb.append(node('p','', 'Explain one mathematical idea you understand, one error you corrected, and one question to revisit before the official weekly assessment.'));var reflection=node('textarea');reflection.className='kg7-reflection';reflection.setAttribute('aria-label','Weekly mathematics reflection');reflection.placeholder='I can explain... I need more practice with...';reflection.style.cssText='display:block;width:100%;min-height:120px;border:1px solid #3d4b4a;border-radius:7px;padding:11px;background:white;color:#24292d;font:400 17px/1.5 Nunito,Arial,sans-serif';rb.append(reflection);review.append(rb);section.append(review);review.addEventListener('toggle',function(){if(review.open){visited.add(5);updateProgress();$('details.kg7-lesson',section).forEach(function(other){if(other!==review)other.open=false})}});
var oldActions=$('.actions',shell);if(oldActions){oldActions.classList.add('no-print')}
addShelf(shell);
exportButton.addEventListener('click',function(){var payload={format:'khaemenes-grade'+grade+'-math-practice-v1',grade:grade,week:week,authoritative:false,exportedAt:new Date().toISOString(),days:states.map(function(s){return{day:s.day,notes:s.textarea.value,ink:s.read?s.read.read():[]}}),reflection:reflection.value};download('grade-'+grade+'-math-week-'+String(week).padStart(2,'0')+'-practice.json',new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}))});
}
// Presentation-only helper: place the canonical VNV translator inside the existing Class Tools panel.
if(false&&!document.querySelector('script[data-kg7-translator-placement]')){var tr=document.createElement('script');tr.src='https://vervenveda.com/Khaemenes_Middle.github.io/assets/grade-07-math-translator-tools-v1.js';tr.dataset.kg7TranslatorPlacement='1';document.head.append(tr)}
window.KhaemenesMiddleMathPortalV1=Object.freeze({version:'1.1.0',grades:['06','08'],scope:'practice-only'});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();