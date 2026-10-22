/* Khaemenes Middle Resource Toolbar v1 — read-only, no student state or scores. */
(function(win){
"use strict";
if(!win.document||win.document.getElementById("khaeMiddleResourceToolbar"))return;
const BASE="https://vervenveda.com/Khaemenes_Middle.github.io/";
const ARCADE="https://vervenveda.com/arcade.github.io/";
const path=decodeURIComponent(win.location.pathname||"");
const gradeMatch=path.match(/\/grades\/grade-(06|07|08)\//);
const subjectMatch=path.match(/\/subjects\/([a-z-]+)\//);
const weekMatch=path.match(/\/week-(\d\d)\.html/);
const grade=gradeMatch?gradeMatch[1]:null, subject=subjectMatch?subjectMatch[1]:null, week=weekMatch?weekMatch[1]:null;
const gradeRoot=grade?BASE+"grades/grade-"+grade+"/":BASE;
const arcadeItems={
 math:[["Sudoku · number logic",ARCADE+"Jenny's_Sudoku_index.html"],["Chess Studio · strategic reasoning",ARCADE+"Chess_Studio_index.html"]],
 language:[["AffixSix · vocabulary and word forms",ARCADE+"AffixSix%E2%84%A2_index.html"]],
 science:[["IQ Mini · logical problem solving",ARCADE+"IQ-mini_index.html"]],
 social:[["Chess Studio · decision strategies",ARCADE+"Chess_Studio_index.html"]],
 design:[["IQ Mini · reasoning practice",ARCADE+"IQ-mini_index.html"]]
};
const subjectGroup={"mathematics":"math","language-arts":"language","science":"science","social-studies":"social","technology-design":"design","integrated-projects":"design","world-languages":"language","arts-music":"design","health-pe-sel":"science"};
const gameList=arcadeItems[subjectGroup[subject]]||[...arcadeItems.math.slice(0,1),...arcadeItems.language,...arcadeItems.science];
const menus=[
["My Classes",[
["Middle School campus",BASE],
...(grade?[["My grade dashboard",gradeRoot],["All nine subject halls",gradeRoot+"#subjects"],["Weekly studios",gradeRoot+"#weeks"]]:[["Grade 6",BASE+"grades/grade-06/"],["Grade 7",BASE+"grades/grade-07/"],["Grade 8",BASE+"grades/grade-08/"]]),
...(grade&&week?[["This week's plan",gradeRoot+"weekly-plans/week-"+week+".html"],["Weekly printable",gradeRoot+"printables/week-"+week+"-packet.html"]]:[])]],
["Games & Logic",gameList],
["Study & Create",[
["Learning profile","https://vervenveda.com/Khaemenes_Academy.github.io/student/"],
["Academy mathematics resources","https://vervenveda.com/Khaemenes_High.github.io/courses/mathematics/"],
["Middle School electives",BASE+"grades/electives/"],
["15-minute Breakaway",BASE+"breakaway/"]]],
["Lesson Support",[
...(grade&&week?[["Current week's lessons",gradeRoot+"weekly-plans/week-"+week+".html"],["Practice and printable",gradeRoot+"printables/week-"+week+"-packet.html"],["Official weekly assessment",gradeRoot+"assessments/week-"+week+"-assessment.html"]]:[]),
["Breakaway and brain breaks",BASE+"breakaway/"],
["Academy course library","https://vervenveda.com/Khaemenes_Academy.github.io/"]]]
];
const doc=win.document;
const style=doc.createElement("style");
style.textContent='#khaeMiddleResourceToolbar{position:relative;z-index:85;box-sizing:border-box;width:100%;background:#f5f0e6;color:#24332f;border-top:1px solid #d3c8b4;border-bottom:1px solid #c6b9a2;font:400 14px/1.45 "Nunito","Avenir Next",Arial,sans-serif}#khaeMiddleResourceToolbar .khae-resource-inner{max-width:1250px;margin:auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 16px}#khaeMiddleResourceToolbar .khae-resource-caption{font-size:12px;letter-spacing:.045em;color:#485650;margin-right:12px}#khaeMiddleResourceToolbar details{position:relative}#khaeMiddleResourceToolbar summary{list-style:none;cursor:pointer;border:1px solid #b8aa91;border-radius:7px;background:#fffcf6;padding:7px 12px;min-height:20px;font-weight:500}#khaeMiddleResourceToolbar summary::-webkit-details-marker{display:none}#khaeMiddleResourceToolbar summary:after{content:" ▾"}#khaeMiddleResourceToolbar details[open] summary{background:#e9dfcd}#khaeMiddleResourceToolbar .khae-resource-options{position:absolute;left:0;top:100%;margin-top:4px;min-width:230px;max-width:min(340px,90vw);max-height:60vh;overflow:auto;border:1px solid #b8aa91;border-radius:7px;background:#fffdf9;box-shadow:0 9px 24px #17252026;padding:6px;display:grid;gap:2px}#khaeMiddleResourceToolbar a{display:block;color:#1f423b;text-decoration:none;padding:8px;border-radius:5px;font-size:13px}#khaeMiddleResourceToolbar a:hover,#khaeMiddleResourceToolbar a:focus-visible{background:#eee6d7;outline-offset:2px}#khaeMiddleResourceToolbar .khae-resource-note{font-size:11px;color:#5c6862;margin-left:auto}@media(max-width:680px){#khaeMiddleResourceToolbar .khae-resource-inner{gap:5px;padding:8px}#khaeMiddleResourceToolbar .khae-resource-caption{width:100%;font-size:11px}#khaeMiddleResourceToolbar summary{padding:6px 8px;font-size:12px}#khaeMiddleResourceToolbar .khae-resource-options{position:fixed;left:10px;right:10px;top:auto;min-width:0;max-width:none;z-index:200}}@media print{#khaeMiddleResourceToolbar{display:none!important}}';
doc.head.appendChild(style);
const bar=doc.createElement("nav");bar.id="khaeMiddleResourceToolbar";bar.setAttribute("aria-label","Middle School learning resources");
const inner=doc.createElement("div");inner.className="khae-resource-inner";
const cap=doc.createElement("span");cap.className="khae-resource-caption";cap.textContent="LEARNING RESOURCES";inner.appendChild(cap);
menus.forEach(([name,items])=>{
const details=doc.createElement("details"),summary=doc.createElement("summary");summary.textContent=name;details.appendChild(summary);
const box=doc.createElement("div");box.className="khae-resource-options";items.forEach(([title,url])=>{const a=doc.createElement("a");a.textContent=title;a.href=url;if(url.startsWith(ARCADE)){a.target="_blank";a.rel="noopener noreferrer";a.title="Optional practice game; does not award course mastery"}box.appendChild(a)});details.appendChild(box);inner.appendChild(details);details.addEventListener("toggle",()=>{if(details.open)inner.querySelectorAll("details").forEach(d=>{if(d!==details)d.open=false})});
});
const note=doc.createElement("span");note.className="khae-resource-note";note.textContent="Practice tools never change mastery scores.";inner.appendChild(note);bar.appendChild(inner);
const headers=doc.querySelectorAll("body > header");const lastHeader=headers[headers.length-1];
if(lastHeader)lastHeader.insertAdjacentElement("afterend",bar);
else (doc.querySelector("main")||doc.body.firstChild)?.parentNode?.insertBefore(bar,doc.querySelector("main")||doc.body.firstChild);
})(window);
