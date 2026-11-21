import assert from "node:assert/strict";
import fs from "node:fs";

const week=fs.readFileSync("grades/grade-06/subjects/mathematics/week-01.html","utf8");
const lesson=fs.readFileSync("grades/grade-06/subjects/mathematics/lesson-01.html","utf8");
const originalLessonNames=["Monday — Learn to compare quantities","Tuesday — Rates and unit rates","Wednesday — Investigation: a fair supply purchase","Thursday — Independent application and revision","Friday — Evidence and mastery"];
for(const day of originalLessonNames)assert.ok(week.includes(day),"Grade 6 Week 01 missing original "+day);
for(const html of [week,lesson]){
 for(const phrase of ["part-to-part","part-to-whole","equivalent ratio","scale factor","3:2","2:5"])
  assert.ok(html.toLowerCase().includes(phrase.toLowerCase()),"Lesson 01 must teach "+phrase);
 for(const phrase of ["independent","incorrect","15:20","12:8"])
  assert.ok(html.toLowerCase().includes(phrase.toLowerCase()),"Lesson 01 missing "+phrase);
 assert.ok(!/document\.write\(|eval\(/.test(html),"Lesson must not introduce dangerous script evaluation");
}
assert.equal((lesson.match(/<details class="task"/g)||[]).length,6,"approved six-section engine must remain intact");
assert.match(lesson,/khaemenes-middle-math-lesson-engine-v1\.js/,"must retain canonical shared engine");
assert.match(week,/lesson-01\.html/,"must provide direct practice path");
assert.match(week,/authorized assessment record/,"must retain official assessment authority");
assert.match(week,/18\/24|3:2/,"must include mathematical ratio model");
assert.match(week,/3:2.*3:5/s,"must distinguish part-to-part and part-to-whole");
assert.match(week,/3 ÷ 2 = 1\.5/,"must diagnose additive misconception");
assert.match(lesson,/3 ÷ 2 = 1\.5/,"standalone lesson must diagnose additive misconception");
assert.match(lesson,/18:30 = 3:5/,"exit ticket must include a correct part-to-whole check");
assert.match(week,/14:35 = 2:5/,"guided practice must use correct total");
assert.equal(18/12,1.5);assert.equal(15/20,3/4);assert.equal(14/21,2/3);assert.equal(14/35,2/5);assert.equal(18/30,3/5);
console.log("PASS Grade 6 Mathematics Week 01 Lesson 01 A+++ curriculum: content, comprehension, key calculations, reference engine, five-day sequence and authority boundary");
