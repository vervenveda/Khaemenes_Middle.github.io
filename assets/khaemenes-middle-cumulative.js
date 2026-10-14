/* Khaemenes Middle: Grade 7/8 cumulative exam question renderer (print only). */
(function(){
"use strict";
const path=String(location.pathname||"");
const match=path.match(/\/grades\/grade-(0[78])\/assessments\/(midterm|final-exam)\.html$/i);
if(!match)return;
const grade=match[1],isMidterm=match[2]==="midterm";
const DATA=window["KHAE_GRADE"+Number(grade)+"_DATA"];
const bank=window.KhaemenesGrade8MathBank||{};
const worksheet=document.querySelector("main .worksheet");
if(!DATA?.weeks||!DATA?.subjects||!worksheet)return;
const type=isMidterm?"midterm":"final";
const count=Number(DATA.assessments[type]?.itemCount)||(isMidterm?120:140);
const cutoff=isMidterm?Number(DATA.assessments.midterm?.week||18):36;
const pass=Math.ceil(count*0.8);
const pad=x=>String(x).padStart(2,"0");
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n};
function prompt(week,subject){
 const w=Number(week.week),n=w+5,theme=String(week.title),question=String(week.essentialQuestion||"");
 switch(subject.id){
  case "language-arts":
    return `Read this ORIGINAL classroom case (not a historical source): "A team testing ${theme} gathered ${n} observations. They revised their explanation after comparing two contradictory results." State the central claim, cite two details from this case, identify a missing piece of evidence, and revise the argument.`;
  case "mathematics":
    if(Number(grade)===8&&bank[w])return `Solve this independently and show a verification: ${bank[w][2]}`;
    return `A model for "${theme}" uses ${2+w%4} units for ${3+w%5} samples. Find the unit rate and determine the amount needed for ${6+w%4} samples. Explain why the ratio reasoning applies.`;
  case "science":
    return `A model linked to "${theme}" produces results ${n}, ${n+3}, and ${n+6} in three trials. Write one testable question, identify a controlled variable, distinguish pattern from cause, and give a claim supported by this evidence plus a limitation.`;
  case "social-studies":
    return `Consider a HYPOTHETICAL community discussion connected to "${theme}". Two groups disagree about a proposed change. Explain two plausible perspectives, distinguish a primary from a secondary source, describe what evidence would be needed, and avoid presenting an invented quotation as real history.`;
  case "world-languages":
    return `For the context "${theme}", compose a polite two-sentence greeting and request in a language studied in class. Translate each sentence, explain one grammatical choice, and identify one cultural assumption that should be verified.`;
  case "arts-music":
    return `Create a visual sketch or four-measure rhythm reflecting "${theme}". Identify contrast, repetition, and an intentional audience effect, then explain how a change would alter meaning.`;
  case "health-pe-sel":
    return `Prepare a safe and adaptable ${3+w%4}-day wellness or study routine during a project on "${theme}". Include measurable activity/rest balance, a self-regulation strategy, and an accessibility alternative without sharing private health details.`;
  case "technology-design":
    return `Write pseudocode to store ${3+w%5} observations about "${theme}", validate inputs, compute a summary, and handle one invalid or missing value. Describe one privacy consideration.`;
  case "integrated-projects":
    return `Plan an independent short capstone answering "${question}". Combine a mathematical representation and one writing/science/civic artifact, list a required source or dataset, describe an anticipated limitation, and propose a revision.`;
  default:
    return `Construct one defensible evidence-based response about "${theme}", showing a claim, a method, and a correction.`;
 }
}
const pool=[];
for(const w of DATA.weeks.filter(w=>Number(w.week)<=cutoff)){
 for(const subject of DATA.subjects){
  pool.push({week:w,subject,prompt:prompt(w,subject)});
 }
}
if(pool.length<count)return;
const selected=Array.from({length:count},(_,i)=>pool[Math.floor((i+.5)*pool.length/count)]);
const styles=node("style");
styles.textContent=".middle-cum-intro{max-width:80ch;margin:12px auto 26px;text-align:center}.middle-cum-identity{padding:18px;border:1px solid #b6bbc1;margin:20px 0}.middle-cum-item{break-inside:avoid;padding:18px 4px;border-bottom:1px solid #ced3d8;text-align:left}.middle-cum-item h3{font-size:1rem;margin:0 0 7px;font-weight:600}.middle-cum-item p{line-height:1.55;margin:6px 0}.middle-cum-lines{height:100px;margin-top:12px;background:repeating-linear-gradient(#fff 0,#fff 27px,#c6cbd0 28px)}.middle-cum-flag{font-weight:600}.middle-cum-summary{padding:20px;margin:26px 0;border:2px solid #435769;break-inside:avoid}@media print{.middle-cum-item{break-inside:avoid}.no-print{display:none!important}}";
document.head.appendChild(styles);
worksheet.replaceChildren();
worksheet.append(node("p","Khaemenes Academy · Middle School · Grade "+Number(grade),"kicker"));
worksheet.append(node("h1",DATA.assessments[type]?.title||"Cumulative Assessment"));
worksheet.append(node("p",`Adult-supervised, closed-book cumulative assessment. ${count} independent response items selected across ${cutoff} curriculum weeks and nine subjects. Each item is worth one point; at least ${pass}/${count} (${Math.ceil(pass/count*100)}%) meets the 80% threshold.`,"middle-cum-intro"));
worksheet.append(node("p","Learner: __________________________     Date: _________________     Reviewer: __________________________","middle-cum-identity"));
selected.forEach((item,i)=>{
 const card=node("article",undefined,"middle-cum-item");
 card.append(node("h3",`Item ${i+1} · Week ${pad(item.week.week)} · ${item.subject.title}`));
 card.append(node("p",item.prompt));
 card.append(node("p","Adult mark: □ Demonstrated (1)   □ Not yet demonstrated (0)"));
 card.append(node("div",undefined,"middle-cum-lines"));worksheet.append(card);
});
const summary=node("section",undefined,"middle-cum-summary");
summary.append(node("h2","Authorized Evaluation"),node("p",`Total demonstrated: ______ / ${count}. Passing: ${pass} correct. This page does not award mastery or write any academic records; the authorized educator enters the reviewed result in the correct learner's Grade ${Number(grade)} academic record.`),node("p","Review notes and feedback: ____________________________________________"),node("p","Teacher / Authorized Adult: _______________________  Date: ___________"));
worksheet.append(summary);
window.KhaemenesMiddleCumulative=Object.freeze({version:"1.0.0",grade,type,itemCount:selected.length,pass});
})();
