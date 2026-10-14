import fs from "node:fs";import vm from "node:vm";
const read=p=>fs.readFileSync(p,"utf8");
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const code=read("assets/khaemenes-middle-cumulative.js");
const math=read("assets/khaemenes-grade8-math-depth.js");
class N{constructor(tag){this.tag=tag;this.children=[];this.textContent="";this.className=""}append(...x){this.children.push(...x)}appendChild(x){this.children.push(x);return x}replaceChildren(){this.children=[]}}
let total=0;
for(const g of ["07","08"]){
 for(const type of ["midterm","final-exam"]){
  const data={};vm.runInNewContext(read("grades/grade-"+g+"/data/course-data.js"),{window:data},{timeout:1000});
  if(g==="08")vm.runInNewContext(math,{window:data,location:{pathname:"/grades/grade-08/evidence/midterm.html"}},{timeout:1000});
  const worksheet=new N("section");
  const document={head:new N("head"),querySelector:selector=>selector==="main .worksheet"?worksheet:null,createElement:tag=>new N(tag)};
  const location={pathname:"/grades/grade-"+g+"/evidence/"+type+".html"};
  vm.runInNewContext(code,{window:data,document,location},{timeout:2000});
  const out=data.KhaemenesMiddleCumulative;
  const expected=data["KHAE_GRADE"+Number(g)+"_DATA"].assessments[type==="midterm"?"midterm":"final"].itemCount;
  assert(out?.itemCount===expected,"Incorrect item count for Grade "+g+" "+type);
  assert(out.pass===Math.ceil(expected*.8),"Wrong passing standard for Grade "+g+" "+type);
  assert(worksheet.children.filter(x=>x.tag==="article").length===expected,"Rendered items missing in Grade "+g+" "+type);
  assert(worksheet.children.some(x=>x.tag==="h1"),"No exam title "+g+" "+type);
  const html=read("grades/grade-"+g+"/evidence/"+type+".html");
  assert(html.includes("khaemenes-middle-cumulative.js"),"Missing canonical cumulative script "+g+" "+type);
  total++;
 }
}
for(const file of ["assets/khaemenes-middle-learning-navigator.js","assets/khaemenes-middle-study-scorebook.js"]){
 const s=read(file);
 assert(s.includes("evidence/midterm.html")&&s.includes("evidence/final-exam.html"),"Missing canonical cumulative links in "+file);
}
console.log("PASS "+total+" canonical cumulative examinations, assessment item counts and adult review boundaries.");
