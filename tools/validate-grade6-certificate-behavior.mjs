import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const source=fs.readFileSync("grades/grade-06/assets/certificate.js","utf8");
const all=Object.fromEntries(Array.from({length:36},(_,i)=>[String(i+1),85]));
const base=()=>({weekly:{...all},midterm:88,final:90,portfolio:true});
function render({state=base(),status="ready",grade="06",nickname="Grade 6 Scholar",studentId="G6-DEMO",learnerId="demo"}={}){
 const out={innerHTML:""};
 const learner={grade,nickname,studentId,learnerId};
 const context={status,learner:status==="ready"?learner:null};
 const window={KhaemenesGradeContinuity:{status:()=>context,readState:()=>structuredClone(state)}};
 const document={getElementById:id=>id==="out"?out:null};
 vm.runInNewContext(source,{window,document}, {filename:"certificate.js"});
 return out.innerHTML;
}
function locked(state,reason){
 const html=render({state});
 assert(html.includes("Certificate Locked"),reason);
 assert(!html.includes("Certificate of Sixth Grade Completion"),reason);
 assert(!html.includes("Preview Grade 7 Curriculum"),reason);
}
let html=render();
assert(html.includes("Certificate of Sixth Grade Completion"));
assert(html.includes("36/36"));
assert(html.includes("Grade 7 placement is not automatic"));
assert(html.includes("independent educator verification"));
locked({...base(),weekly:{...all,36:79}},"last week is below mastery");
locked({...base(),weekly:Object.fromEntries(Object.entries(all).slice(0,35))},"missing final week");
locked({...base(),weekly:{...all,37:100}},"unrecognized extra week");
locked({...base(),weekly:{...all,1:"100"}},"unverified string score");
locked({...base(),midterm:79},"midterm below mastery");
locked({...base(),final:79},"final below mastery");
locked({...base(),portfolio:false},"portfolio not reviewed");
locked({...base(),weekly:{...all,1:NaN}},"nonfinite score");
html=render({grade:"07"});
assert(html.includes("Certificate Locked"),"wrong grade must not receive certificate");
assert(!html.includes("Certificate of Sixth Grade Completion"));
html=render({status:"no-active-learner"});
assert(html.includes("Certificate Locked"));
assert(!html.includes("Certificate of Sixth Grade Completion"));
html=render({nickname:"Test <script>alert(1)</script> Learner"});
assert(!html.includes("<script>"),"Untrusted learner name must be escaped");
console.log("Grade 6 certificate behavioral audit PASS: eligible learner; 8 denial cases; missing identity; escaped learner display; Grade 7 preview only.");
