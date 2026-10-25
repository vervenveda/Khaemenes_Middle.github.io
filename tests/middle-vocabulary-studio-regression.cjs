#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),base="grades/vocabulary-studio/";
const html=fs.readFileSync(path.join(root,base,"index.html"),"utf8");
assert(html.includes('Student Profile</a>'),"Vocabulary Studio must expose student-profile navigation");
assert(html.includes('font-size:12px!important'),"Toolbar controls need readable text");
assert(!html.includes('font-size:7px!important'),"Seven-pixel toolbar text must not return");
assert(html.includes('flex-wrap:wrap;justify-content:center'),"Toolbar must wrap on narrow screens");
assert(html.includes('min-height:44px!important;height:auto!important'),"Toolbar buttons must have accessible height");
// Accessibility audit: learners need explicit steps, source-availability guidance, and distinguishing feedback.
assert(html.includes('let formats=[]'),"Practice must track both retrieval directions");
assert(html.includes('i%2===0?"definition":"term"'),"Three questions each must use reciprocal prompts");
assert(html.includes("Which term matches this meaning?"),"Reverse-retrieval questions must be present");
assert(html.includes('formats[i]==="definition"?choice[1]:choice[0]'),"Choices must match the prompt type");
assert(html.includes('if(v.value===quiz[i][0])score++'),"Both directions must score against original term identities");
assert(html.includes("Read the six term cards first."),"Independent practice instructions must describe the steps");
assert(html.includes('id="independentHelp"'),"Independent-study help must be available");
assert(html.includes("do not invent evidence"),"Unavailable source instructions must not encourage fabrication");
assert(html.includes('aria-label","Application exercise for '),"Application tasks need clear accessible labels");
assert(html.includes('aria-describedby","independentHelp"'),"Quiz questions must reference study support");
assert(html.includes('first.focus()'),"Incomplete submissions must focus the missing answer");
assert(html.includes('Your selection describes'),"Incorrect feedback must distinguish the learner's choice");
assert(html.includes('id="differenceDialog"'),"Concept explanation dialog must exist");
assert(html.includes('aria-labelledby="differenceTitle"'),"Dialog must have an accessible name");
assert(html.includes('differenceDialog.showModal()'),"Dialog must support native modal focus handling");
assert(html.includes('differenceDialog.addEventListener("close"'),"Dialog must return keyboard focus");
assert(html.includes('selected.value!==quiz[i][0]'),"Explanations must appear only after incorrect submissions");
assert(html.includes('button.textContent="Explain the difference"'),"Students must choose when to view concept details");
assert(html.includes('source.find(t=>t[0]===chosen)'),"Comparison must use the current vocabulary bank");
assert(!/localStorage\.setItem|sessionStorage\.setItem/.test(html),"Concept coaching must remain stateless");
// Explicit misconception coaching is scoped to a grade, week, and pair of terms.
assert(html.includes("const misconceptionCoaching={"),"Author-written misconception comparisons are required");
assert(html.includes('misconceptionCoaching[grade.value+":"+Number(week.value)+":"+key]'),"Misconception lookup must use the active grade and week");
assert(html.includes('key=[correct,chosen].sort('),"Confused terms must match in either direction");
assert(html.includes('Why they differ: '),"Dialog must explain the conceptual distinction");
assert(html.includes('else body.append(intro,first,second,application)'),"Other pairs must retain informative generic feedback");
for(const key of ["6:5:sequence|transition","6:22:condensation|evaporation","7:7:equation|inequality","7:18:function|structure","8:7:reflection|translation","8:23:genotype|phenotype","8:26:counterargument|grievance"]){
 assert(html.includes('"'+key+'"'),"Missing authored misconception coaching "+key);
}
// Verify every authored Grade 6 Week 05–12 misconception pair is in its real bank.
const grade6Pairs=[...html.matchAll(/"6:(\d+):([^"]+)":/g)];
const grade6ForPairs=JSON.parse(fs.readFileSync(path.join(root,base,"grade-06-weeks-05-36.json"),"utf8"));
for(const [,week,pair] of grade6Pairs){
 const names=grade6ForPairs.weeks[week]?.map(t=>t[0])||[];
 const terms=pair.split("|");
 assert(terms.length===2&&terms.every(term=>names.includes(term)),"Grade 6 coaching pair missing term in Week "+week+": "+pair);
 assert.equal(pair,[...terms].sort((a,b)=>a.localeCompare(b)).join("|"),"Misconception pair must use sorted lookup: "+pair);
}
assert(grade6Pairs.filter(([,w])=>Number(w)>=5&&Number(w)<=12).length>=16,"Grade 6 Weeks 05–12 should have at least two targeted explanations per week");
for(let week=13;week<=20;week++)assert(grade6Pairs.filter(([,w])=>Number(w)===week).length>=2,"Grade 6 Week "+week+" needs two lesson-specific misconception comparisons");
const learningBridge=fs.readFileSync(path.join(root,"assets/khaemenes-middle-learning-context.js"),"utf8");
assert(learningBridge.includes("installVocabularyEntrance"),"Shared lesson bridge must link to vocabulary practice");
assert(learningBridge.includes("khaemenesVocabularyStudioEntrance"),"Lesson entrance must be idempotent");
assert(learningBridge.includes('?grade="+grade+"&week="+week'),"Lesson entrance must derive current grade and week");
assert(learningBridge.includes('week="+week'),"Lesson entrance must preserve the selected week");
assert(learningBridge.includes("../../../../grades/vocabulary-studio/index.html?grade="),"Lesson link must target the shared Studio with grade and week");
for(const grade of [6,7,8])for(const week of [1,5,16,36]){
 const file=path.join(root,"grades","grade-0"+grade,"subjects","language-arts","week-"+String(week).padStart(2,"0")+".html");
 const lesson=fs.readFileSync(file,"utf8");
 assert(lesson.includes("khaemenes-middle-learning-context.js"),"Grade "+grade+" Week "+week+" missing shared link bridge");
}
console.log("PASS Language Arts lesson-to-Studio shared navigation: 12 representative pages and grade/week routes");

let total=0;
for(const grade of [6,7,8]){
 const file="grade-"+String(grade).padStart(2,"0")+"-weeks-05-36.json";
 assert(html.includes('fetch("'+file+'"'),"Studio must load "+file);
 const d=JSON.parse(fs.readFileSync(path.join(root,base,file),"utf8"));
 assert.equal(d.grade,grade);assert.equal(d.practiceOnly,true);
 assert.equal(Object.keys(d.weeks).length,32);
 for(let week=5;week<=36;week++){
  const terms=d.weeks[week];assert(Array.isArray(terms),"Missing Grade "+grade+" Week "+week);
  assert.equal(terms.length,6,"Grade "+grade+" Week "+week+" must contain six terms");
  assert.equal(new Set(terms.map(t=>t[0].toLowerCase())).size,6,"Duplicate terms");
  assert.equal(new Set(terms.map(t=>t[1].trim().toLowerCase())).size,6,"Duplicate answer definitions");
  for(const t of terms)assert(t.length===3&&t.every(v=>typeof v==="string"&&v.trim()),"Incomplete term");
  total+=6;
 }
 console.log("PASS Grade "+grade+" Weeks 05–36: 192 complete term placements");
}
assert.equal((html.match(/<option value="\d+">Week/g)||[]).length,36);
assert(html.includes('week.addEventListener("change",draw)'));
assert(html.includes('document.querySelectorAll(\'#questions input\').forEach(i=>i.disabled=true)'));
assert(html.includes('$("retry").addEventListener("click",newSet)'));
for(const grade of [6,7,8]){
 assert(html.includes('ready('+grade+')'),"Grade "+grade+" must use guarded async completion");
 assert(html.includes('unavailable('+grade+')'),"Grade "+grade+" must handle unavailable banks");
}
assert(html.includes('&&!attempted)draw()'),"Late requests must not reset attempts already started");
assert(html.includes('input.addEventListener("change",()=>{attempted=true})'),"Selecting an answer must protect current attempt");
assert(html.includes('const validBank='),"All incoming grade banks must be validated");
assert(html.includes('Loading the vocabulary bank'),"Students need a loading state");
assert(html.includes('if(quiz.length!==6)return;'),"Partial data must not be graded");
assert(html.includes('Please answer all six questions before checking.'),"Incomplete attempts must not be scored");
assert(html.includes('if(v.value===quiz[i][0])score++'),"Score must use selected term, not answer position");
assert(html.includes('$(\"check\").disabled=true'),"Submitting must lock scoring");
assert(html.includes('No official grades were changed.'),"Results must remain explicitly formative");
assert(html.includes('quiz=bank.length===6?shuffle(bank):[]'),"Incomplete banks cannot produce practice questions");
assert(html.includes('if(quiz.length!==6)return;'),"Scoring requires six valid questions");
assert(html.includes('id="lessonLink"'),"A contextual path back to the lesson is required");
assert(html.includes('grade-0"+grade.value+"/subjects/language-arts/week-'),"Lesson links must reflect the selected grade and week");
assert(html.includes('answer-explanation'),"Explanations must appear after submitting a complete attempt");
assert(html.includes('quiz[i][2]'),"Application prompts must be available in formative feedback");
assert(!/localStorage\.setItem|sessionStorage\.setItem/.test(html));
const enriched=JSON.parse(fs.readFileSync(path.join(root,base,"grade-06-weeks-05-36.json"),"utf8"));
for(let week=5;week<=36;week++)for(const term of enriched.weeks[week]){
 assert(!term[2].includes("In this week's Language Arts work"),"Generic application prompt in Grade 6 Week "+week);
 assert(term[2].length>=75,"Expected substantive lesson-specific application in Grade 6 Week "+week+" "+term[0]);
}
assert(enriched.weeks[36][0][2].includes("genuine, dated Grade 6"),"Grade 6 portfolio evidence must be authentic");
console.log("PASS Grade 6 Weeks 05–36: 192 lesson-grounded application prompts");
const grade7=JSON.parse(fs.readFileSync(path.join(root,base,"grade-07-weeks-05-36.json"),"utf8"));
for(let week=5;week<=12;week++)for(const term of grade7.weeks[week]){
 assert(!term[2].startsWith("In Grade 7 Week"),"Generic Grade 7 prompt in Week "+week);
 assert(term[2].length>=75,"Grade 7 Week "+week+" application requires specific evidence");
}
console.log("PASS Grade 7 Weeks 05–12: 48 lesson-grounded application prompts");
const grade7Contexts={
 13:["theme","point of view","identity","characterization","argument","textual evidence"],
 14:["central idea","claim","counterclaim","warrant","rhetoric","rebuttal"],
 15:["research question","primary source","secondary source","credibility","annotation","bibliography"],
 16:["narrative voice","stanza","imagery","tone","convention","revision"],
 17:["portfolio","reflection","synthesis","draft","curation","self-assessment"],
 18:["cell","structure","function","scientific communication","diagram","oral explanation"],
 19:["homeostasis","body system","evidence","source","reasoning","summary"],
 20:["inheritance","variation","trait","central idea","comparison","evidence"],
 21:["ecosystem","interdependence","human impact","point of view","environmental claim","corroboration"],
 22:["atom","matter","chemical change","claim","evidence","argument"],
 23:["energy","force","motion","reliability","correlation","causation"],
 24:["plate tectonics","hazard","geological evidence","research question","citation","source reliability"],
 25:["weather","climate","data interpretation","precision","trend","qualification"],
 26:["feudalism","medieval source","hierarchy","historical context","narrative","perspective"],
 27:["Islamic Golden Age","knowledge network","scholarship","translation","historical evidence","discussion"],
 28:["trade network","cultural exchange","migration","primary source","corroboration","synthesis"],
 29:["Renaissance","Reformation","humanism","central idea","comparison","historical context"],
 30:["Scientific Revolution","Enlightenment","empiricism","hypothesis","point of view","evidence"],
 31:["economics","labor","global system","claim","counterargument","data"],
 32:["diplomacy","cultural context","translation","audience","credibility","interpretation"],
 33:["algorithm","data ethics","bias","transparency","research writing","attribution"],
 34:["capstone","inquiry","annotated source","proposal","argument","revision"],
 35:["oral defense","thesis","counterquestion","delivery","evidence","reflection"],
 36:["portfolio","readiness","source evaluation","argument","active listening","transfer"]
};
for(const [week,expected] of Object.entries(grade7Contexts)){
 const terms=grade7.weeks[week];
 assert.deepEqual(terms.map(t=>t[0]),expected,"Grade 7 vocabulary order or six-term bank changed in Week "+week);
 for(const [i,term] of terms.entries()){
  assert(term[2].length>=120,"Week "+week+" term "+term[0]+" requires substantive context");
  assert(!/^In Grade 7 Week/.test(term[2]),"Generic prompt in Week "+week);
  assert(/Week (13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36)/.test(term[2]),"Week-specific context absent: "+week);
  assert(!/invent (an external|a source)|fabricat(e|ed) (a citation|citations)/i.test(term[2]),"Avoid instructing fabricated evidence");
 }
}
assert(grade7.practiceOnly===true,"Vocabulary remains formative only");
console.log("PASS Grade 7 Weeks 13–36: 144 contextual practice prompts; mastery separate");
const grade8=JSON.parse(fs.readFileSync(path.join(root,base,"grade-08-weeks-05-36.json"),"utf8"));
const grade8Context={
 5:["system of equations","competing explanation","source credibility","solution","substitution","justification"],
 6:["exponent","scientific notation","magnitude","research synthesis","precision","paraphrase"],
 7:["transformation","translation","reflection","rotation","congruence","justification"],
 8:["dilation","similarity","scale factor","corresponding sides","proportional reasoning","evidence"],
 9:["Pythagorean theorem","hypotenuse","right triangle","distance","proof","counterexample"],
 10:["cylinder","cone","sphere","volume","capacity","technical evidence"],
 11:["bivariate data","scatter plot","linear model","association","outlier","correlation"],
 12:["probability","risk","statistical inference","sample","uncertainty","qualification"],
 13:["theme","perspective","characterization","modern connection","close reading","textual evidence"],
 14:["media literacy","rhetoric","claim","counterclaim","misinformation","verification"],
 15:["research question","literature review","primary source","secondary source","synthesis","citation"],
 16:["narrative voice","poetic form","imagery","rhetorical choice","tone","revision"],
 17:["portfolio","self-assessment","draft","revision","synthesis","reflection"],
 18:["atom","chemical reaction","reactant","product","scientific model","oral explanation"],
 19:["force","motion","engineering constraint","design tradeoff","textual evidence","causation"],
 20:["energy","wave","information transfer","central idea","analogy","explanation"],
 21:["cosmic scale","orbit","astronomical evidence","perspective","model","inference"],
 22:["geologic time","fossil","evolution","corroboration","scientific argument","limitation"],
 23:["inheritance","genotype","phenotype","bioethics","credibility","consent"],
 24:["sustainability","ecosystem","human impact","tradeoff","research synthesis","environmental claim"],
 25:["constitutional principle","consent of the governed","natural rights","primary source","historical context","civic claim"],
 26:["revolution","independence","rhetoric","grievance","counterargument","historical perspective"],
 27:["constitution","Bill of Rights","amendment","federalism","civic design","deliberation"],
 28:["expansion","reform","conflict","multiple perspectives","textual evidence","corroboration"],
 29:["Civil War","Reconstruction","emancipation","central idea","continuity","historical argument"],
 30:["economic system","labor","civic life","point of view","data interpretation","inequality"],
 31:["diplomacy","cultural protocol","translation","audience","argument evaluation","intercultural communication"],
 32:["algorithm","artificial intelligence","data ethics","algorithmic bias","transparency","source evaluation"],
 33:["transition plan","wellness","academic goal","time management","research synthesis","readiness"],
 34:["capstone","research question","methodology","annotated bibliography","thesis","revision"],
 35:["oral defense","counterquestion","rhetorical voice","delivery","evidence","reflection"],
 36:["high school transition","portfolio","transfer","source evaluation","active listening","readiness"]
};
for(const [week,expected] of Object.entries(grade8Context)){
 const terms=grade8.weeks[week];
 assert.deepEqual(terms.map(t=>t[0]),expected,"Grade 8 Week "+week+" bank changed");
 for(const term of terms){
  assert(term[2].length>=120,"Grade 8 term "+term[0]+" needs a substantive task");
  assert(!/^In Grade 8 Week/.test(term[2]),"Generic Grade 8 Week "+week+" exercise");
  assert(term[2].includes("Week "+String(week).padStart(2,"0")),"Grade 8 task missing week-specific context");
 }
}
assert.equal(grade8.practiceOnly,true,"Grade 8 enrichment cannot alter mastery");
// Five forensic instructional safeguards: precision, sign, geometry, and task alignment.
const g6=JSON.parse(fs.readFileSync(path.join(root,base,"grade-06-weeks-05-36.json"),"utf8"));
assert(g6.weeks[10][0][1].includes("≤")&&g6.weeks[10][0][1].includes("≥"),"Inequality definition must distinguish comparison operators");
assert(g6.weeks[6][3][1].includes("zero is neither positive nor negative"),"Zero must not be described as positive or negative");
assert(grade8.weeks[10][2][1].includes("on or within"),"Sphere solid definition must fit volume task");
assert(grade8.weeks[7][1][1].includes("geometric transformation"),"Translation definition must match geometric assignment");
assert(grade8.weeks[7][2][1].includes("In geometry"),"Reflection definition must match geometric assignment");
assert(grade8.weeks[36][2][2].includes("claim–evidence–reasoning"),"Transfer prompt must apply previous skills to a new context");
assert(grade8.weeks[36][3][2].includes("author's expertise"),"Source evaluation prompt must evaluate a source");
console.log("PASS five forensic curriculum corrections and six-term placement integrity");
console.log("PASS Grade 8 Weeks 05–36: 192 lesson-specific formative applications");
console.log("PASS middle school 3-grade vocabulary static regression: "+total+" additional placements; browser certification outstanding");
