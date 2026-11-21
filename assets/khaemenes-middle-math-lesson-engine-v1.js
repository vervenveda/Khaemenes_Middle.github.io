/* Khaemenes Middle School Mathematics lesson engine v1.0.0
 * Exact interaction runtime extracted from the approved Grade 07 Lesson 01.
 * Initial consumer: grades/grade-07/subjects/mathematics/lesson-01.html
 * Practice-only: no official mastery, grade, placement or account mutations.
 * Grade-specific question content is preserved in this first canonical version.
 */

(function(){'use strict';
var config=window.KhaemenesMiddleMathLessonConfig||{};
var $=function(s){return document.querySelector(s)}, $=function(s){return Array.prototype.slice.call(document.querySelectorAll(s))};
if($('#fallbackToggle')&&$('#fallbackNav'))$('#fallbackToggle').addEventListener('click',function(){var n=$('#fallbackNav'),o=n.classList.toggle('open');this.setAttribute('aria-expanded',String(o))});
var tasks=$$('details.task'),seen=new Set([0]);function progress(){var n=seen.size;$('#progressFill').style.width=(n*100/tasks.length)+'%';$('#progress').setAttribute('aria-valuenow',String(n));$('#progressText').textContent=n+' of '+tasks.length+' sections explored · Practice only'}
tasks.forEach(function(d,i){d.addEventListener('toggle',function(){if(d.open){seen.add(i);tasks.forEach(function(other){if(other!==d)other.open=false});progress();if(d.contains($('#draw')))requestAnimationFrame(resizeCanvas)}})});progress();
$('#revealRemember').addEventListener('click',function(){$('#rememberFeedback').hidden=!$('#rememberFeedback').hidden});
function numeric(raw){var v=String(raw).trim().replace(/[$,]/g,'');return v!==''&&Number.isFinite(Number(v))?Number(v):null}
function check(input,out,answer,units){var v=numeric($(input).value);$(out).textContent=v===null?'Enter a number first.':Math.abs(v-answer)<.001?'Correct: '+answer+' '+units+'. Explain why it works.':'Try again: '+(config.retryHint||'divide the total amount by the number of equal units.')}
$('#guidedCheck').addEventListener('click',function(){check('#guidedInput','#guidedFeedback',config.guidedAnswer??1.5,config.guidedUnits||'dollars per marker')});$('#cycleCheck').addEventListener('click',function(){check('#cycleRate','#cycleFeedback',config.cycleAnswer??12,config.cycleUnits||'kilometers per hour')});
var questions=config.questions||[['Three apples cost $2.40. What is the price per apple, in dollars?',.8],['Five notebooks cost $7.50. How many dollars per notebook?',1.5],['48 kilometers in four hours. How many kilometers per hour?',12],['Six cups make 18 servings. How many servings per cup?',3]],qi=0,solved=new Set();
function question(){$('#gameQuestion').textContent='Challenge '+(qi+1)+': '+questions[qi][0];$('#gameInput').value='';$('#gameFeedback').textContent=''}
$('#gameCheck').addEventListener('click',function(){var v=numeric($('#gameInput').value);if(v===null){$('#gameFeedback').textContent='Enter an answer first.';return}if(Math.abs(v-questions[qi][1])<.001){solved.add(qi);$('#gameFeedback').textContent='Correct. Explain your units in the writing space.'}else $('#gameFeedback').textContent='Not yet. Compare the total quantity to one unit.';$('#gameCount').textContent=solved.size+' of 4 challenges solved · Practice only'});
$('#gameNext').addEventListener('click',function(){qi=(qi+1)%questions.length;question()});
var canvas=$('#draw'),ctx=canvas.getContext('2d'),strokes=[],stroke=null,pointer=null,erasing=false;
function point(e){var r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
function paint(){var r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;ctx.clearRect(0,0,r.width,r.height);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,r.width,r.height);strokes.concat(stroke?[stroke]:[]).forEach(function(s){if(!s.points.length)return;ctx.beginPath();ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=s.erase?'#ffffff':s.color;ctx.lineWidth=s.width;ctx.moveTo(s.points[0].x*r.width,s.points[0].y*r.height);if(s.points.length===1)ctx.lineTo(s.points[0].x*r.width+.1,s.points[0].y*r.height+.1);s.points.slice(1).forEach(function(p){ctx.lineTo(p.x*r.width,p.y*r.height)});ctx.stroke()})}
function resizeCanvas(){var r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;var d=Math.min(3,window.devicePixelRatio||1);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);paint()}
canvas.addEventListener('pointerdown',function(e){if(pointer!==null)return;pointer=e.pointerId;canvas.setPointerCapture(pointer);stroke={color:$('#inkColor').value,width:Number($('#inkWidth').value)*(erasing?4:1),erase:erasing,points:[point(e)]};paint()});
canvas.addEventListener('pointermove',function(e){if(e.pointerId!==pointer||!stroke)return;stroke.points.push(point(e));paint()});
function end(e){if(e.pointerId!==pointer)return;if(stroke)strokes.push(stroke);stroke=null;pointer=null;paint()}canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
$('#eraser').addEventListener('click',function(){erasing=!erasing;this.setAttribute('aria-pressed',String(erasing));this.textContent=erasing?'Use Pen':'Eraser'});$('#undo').addEventListener('click',function(){strokes.pop();paint()});$('#clear').addEventListener('click',function(){if(confirm('Clear all handwriting?')){strokes=[];paint()}});
if(window.ResizeObserver)new ResizeObserver(resizeCanvas).observe(canvas);window.addEventListener('resize',resizeCanvas);requestAnimationFrame(resizeCanvas);
function download(name,blob){var a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(function(){URL.revokeObjectURL(url)},3000)}
$('#savePng').addEventListener('click',function(){resizeCanvas();canvas.toBlob(function(blob){if(blob)download((config.handwritingFilename||'grade-07-math-lesson-01-handwriting.png'),blob)},'image/png')});
$('#export').addEventListener('click',function(){var fields={};$$('textarea,input').forEach(function(el){if(el.id)fields[el.id]=el.value});var data={format:'khaemenes-middle-math-lesson-01-practice-v1',scope:(config.scope||'grade-07-week-01'),authoritative:false,exportedAt:new Date().toISOString(),fields:fields,drawings:strokes,solvedChallenges:Array.from(solved)};download((config.exportFilename||'grade-07-math-lesson-01-practice.json'),new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))});
$('#finish').addEventListener('click',function(){$('#finishStatus').textContent='Practice reviewed. Use Export work to keep your notes. Official mastery is recorded only through Academy assessments.'});
})();

