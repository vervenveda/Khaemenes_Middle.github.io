/* Khaemenes Middle Grade 8 · canonical weekly evidence and mastery tasks. */
(function(){
"use strict";
const mount=document.getElementById("grade8EvidenceMount");
if(!mount)return;
const DATA=window.KHAE_GRADE8_DATA;
const MATH=window.KhaemenesGrade8MathBank||{};
const raw=Number(new URLSearchParams(location.search).get("week"));
const number=Number.isInteger(raw)&&raw>=1&&raw<=36?raw:1;
const week=DATA?.weeks?.find(w=>Number(w.week)===number);
const mode=document.body.dataset.evidenceMode==="assessment"?"assessment":"packet";
const pad=n=>String(n).padStart(2,"0");
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n};
const link=(label,href)=>{const a=el("a",label,"button");a.href=href;return a};
if(!week){mount.append(el("p","Unable to read this week's curriculum. Return to the Grade 8 portal."));return}
const theme=String(week.theme||week.title);
const model=MATH[number]||null;
function task(subject){
 const title=week.title;
 const common={
 "language-arts":`Write a clear claim about the question: "${week.essentialQuestion}" Give at least two reasons, identify what kind of source would test your claim, and write a counterclaim. Label invented examples as invented.`,
 "science":`Plan a fair investigation inspired by "${title}". State one testable question, independent and dependent variables, controls, a four-row data table, and a claim that could be supported or rejected.`,
 "social-studies":`Create a four-row evidence organizer for "${title}": claim, source type, historical or civic context, and limitation. Compare at least two perspectives without presenting an invented quotation as historical evidence.`,
 "world-languages":`Choose five useful words related to "${title}". Write a language-learning table with word, meaning, pronunciation note, sentence, and one cross-cultural caution. Verify unfamiliar translations before publishing.`,
 "arts-music":`Create two visual or musical representations of "${title}". Label three design choices and explain how changing one choice changes the audience's interpretation.`,
 "health-pe-sel":`Write a safe, adaptable five-day routine supporting study, rest, movement, and emotional regulation for a learner exploring "${title}". Include one measurable goal and one accessibility adjustment; do not disclose private health information.`,
 "technology-design":`Design a simple data or file workflow for a project on "${title}". Write input, process, output, two test cases, a privacy rule, and a failure-recovery step.`,
 "integrated-projects":`Combine one math/data model and one language/science/history artifact into a small project answering "${week.essentialQuestion}". Identify assumptions, a revision, and the portfolio evidence you would keep.`
 };
 if(subject.id==="mathematics"&&model)return `Independent Algebra readiness task: ${model[2]} Show calculations, a check, and a labeled explanation.`;
 return common[subject.id]||`Produce one evidence-based artifact aligned with "${title}" and explain your reasoning.`
}
function info(title,text){const section=el("section",undefined,"evidence-card");section.append(el("h2",title),el("p",text));return section}
mount.append(el("p",`Week ${pad(number)} · Grade 8 · ${mode==="packet"?"Independent Study Packet":"Adult-Reviewed Weekly Mastery Check"}`,"kicker"));
mount.append(el("h1",week.title));
mount.append(el("p",week.theme,"evidence-intro"));
mount.append(info("Essential Question",week.essentialQuestion));
const nav=el("nav",undefined,"evidence-actions no-print");
nav.append(link("Grade 8","../index.html"),link("Full Week",`../weekly-plans/week-${pad(number)}.html`),link("Study Packet",`weekly-evidence-packet.html?week=${pad(number)}`),link("Mastery Check",`weekly-mastery-check.html?week=${pad(number)}`));
const print=el("button","Print / Save PDF","button gold");print.type="button";print.onclick=()=>window.print();nav.append(print);mount.append(nav);
const ident=el("section",undefined,"evidence-card");ident.append(el("h2","Learner Details"),el("p","Name: __________________________   Date: ______________   Reviewer: __________________"));mount.append(ident);
if(mode==="packet"&&model){
 const math=info("Worked Mathematics Example — Learn First",model[1]);
 math.append(el("p",`Focus: ${model[0]}`));
 math.append(el("p",`Watch for: ${model[4]}`));
 mount.append(math);
}
const section=el("section",undefined,"evidence-card");
section.append(el("h2",mode==="assessment"?"11 Evidence Criteria · 22 Points":"Nine Subject Evidence Assignments"));
section.append(el("p",mode==="assessment"?"An authorized adult scores each criterion 0 (not yet), 1 (developing), or 2 (demonstrated). At least 18 of 22 points meets the 80% mastery requirement. This worksheet does not write any grades.":"Complete subject tasks and keep the work as portfolio evidence for adult review. Revisions and multiple attempts are encouraged."));
const subjects=DATA.subjects||[];
const tasks=subjects.map(subject=>({title:subject.title,task:task(subject)}));
if(mode==="assessment"){
 tasks.splice(1,0,{title:"ELA Source Evidence & Revision",task:`Revise the language-arts response after checking a real source. Cite the source accurately, distinguish observation from inference, and explain one improvement.`});
 tasks.splice(3,0,{title:"Mathematical Reasoning & Verification",task:`For the Algebra-readiness task, independently verify your answer by substitution, an alternative strategy, a table, or a diagram, and clearly label units where appropriate.`});
}
tasks.forEach((item,i)=>{
 const card=el("article",undefined,"evidence-item");
 card.append(el("h3",`${i+1}. ${item.title}`),el("p",item.task));
 if(mode==="assessment")card.append(el("p","Adult rating: □ 0 not yet   □ 1 developing   □ 2 demonstrated"));
 card.append(el("div",undefined,"response-lines"));section.append(card)
});
mount.append(section);
if(mode==="assessment"){
 mount.append(info("Authorized Review",`Add all eleven ratings. Passing requires 18/22 or higher (81.8%). Reviewer score: ____ /22. Official percentage: ______. Record the result only through the Academy's authorized review process; this printable is not a grade writer.`));
}else{
 mount.append(info("Reflection and Portfolio",`Describe a correction you made, the most convincing evidence, one unresolved question, and what you will improve next week. Keep your independent draft and the reviewed version.`));
}
window.KhaemenesGrade8WeeklyEvidence=Object.freeze({version:"1.0.0",week:number,mode,criterionCount:tasks.length});
})();
