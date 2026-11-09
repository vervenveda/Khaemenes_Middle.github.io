"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const publisher=fs.readFileSync(path.join(root,"assets/khaemenes-middle-continuation-publisher.js"),"utf8");
test("middle publisher produces canonical grade codes and retains learner scope",()=>{
 new vm.Script(publisher,{filename:"middle-publisher.js"});
 assert.match(publisher,/stage:"middle",grade:conf\.grade,subject:/);
 assert.match(publisher,/learnerId:ctx\.learner\.learnerId/);
 assert.match(publisher,/return g===conf\.grade&&stage==="middle"\?learner:null/);
 for(const grade of ["06","07","08"]){
  const html=fs.readFileSync(path.join(root,"grades/grade-"+grade+"/index.html"),"utf8");
  assert.match(html,/khaemenes-middle-continuation-publisher\.js/);
  assert.match(html,/khaemenes-learning-continuation\.js/);
  assert.match(html,new RegExp('grade:"'+grade+'"'));
 }
});
test("publisher keeps academic grade state authoritative",()=>{
 assert.doesNotMatch(publisher,/KhaemenesGradeContinuity\.writeState\s*\(/);
 assert.doesNotMatch(publisher,/KhaemenesFamilyRegistry\.registerLearner\s*\(/);
 assert.match(publisher,/C\.publish\(\{/);
});
