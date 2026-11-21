import fs from "node:fs";
import assert from "node:assert/strict";

// Deep-learning guidance is an integral part of each existing daily lesson.
// It may not introduce independent assessment gates, persistence or scripts.
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
let count=0,problems=0;
for(const week of [22,23,24]){
 const html=fs.readFileSync("grades/grade-06/subjects/mathematics/week-"+week+".html","utf8");
 assert.equal((html.match(/<script[^>]*src=/g)||[]).length,8,"Week "+week+" canonical script count drift");
 for(let d=1;d<=5;d++){
  const lesson=html.match(new RegExp('<article class="lesson"><h2>'+days[d-1]+'[\\s\\S]*?<\\/article>'))?.[0];
  assert.ok(lesson,"Week "+week+" "+days[d-1]+" daily lesson missing");
  const panel=lesson.match(new RegExp('<section class="grade6-block-'+week+'-rigor"[\\s\\S]*?<\\/section>'))?.[0];
  assert.ok(panel,"Week "+week+" day "+d+" existing supplement absent");
  const guidance=panel.match(new RegExp('<div data-guidance="g6-w'+week+'-day'+d+'"[\\s\\S]*?<\\/div>'))?.[0];
  assert.ok(guidance,"Week "+week+" day "+d+" guidance absent");
  for(const label of ["Guided pathway:","Misconception to avoid:","Self-check before the teacher key:"])assert.ok(guidance.includes(label),"Week "+week+" day "+d+" missing "+label);
  assert.equal((panel.match(/data-guidance=/g)||[]).length,1,"Duplicate daily guidance");
  assert.equal((panel.match(/<textarea /g)||[]).length,1,"Original answer field ownership drift");
  assert.equal((panel.match(/<details/g)||[]).length,1,"Original teacher-key disclosure drift");
  assert.ok(/not automatically saved|do not save automatically/i.test(panel),"Nonpersistent formative warning drift");
  assert.ok(/80% mastery/i.test(panel),"Mastery ownership reminder drift");
  const questionCount=[...panel.matchAll(/<li>[\s\S]*?<\/li>/g)].length;
  assert.ok(questionCount>=4&&questionCount<=5,"Original day question count drift");
  const teacher=panel.match(/<summary>Teacher solution key[^<]*<\/summary><p>([\s\S]*?)<\/p>/)?.[1];
  assert.ok(teacher,"Week "+week+" day "+d+" teacher answer missing");
  const raw=teacher.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&");
  assert.equal(raw.split(";").length,questionCount,"Problem-answer coverage drift");
  assert.ok(panel.indexOf("Guided pathway:")<panel.indexOf("<strong>Independent reasoning:"),"Guide must precede independent problems");
  assert.ok(panel.indexOf("Self-check before the teacher key:")<panel.indexOf("<summary>Teacher solution key"),"Guide must precede teacher key");
  count++;problems+=questionCount;
 }
}
assert.equal(count,15);
assert.equal(problems,62);
console.log("PASS Grade 6 mathematics Weeks 22–24: "+count+" original lessons include reasoning scaffold, misconception and independent self-check, with "+problems+" original problems and unchanged key, response and grading boundaries.");
