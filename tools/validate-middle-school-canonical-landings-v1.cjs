#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const grades=["06","07","08"],subjects=["arts-music","health-pe-sel","integrated-projects","language-arts","mathematics","science","social-studies","technology-design","world-languages"];
const pages=[];
for(const g of grades){pages.push("grades/grade-"+g+"/index.html");for(const s of subjects)pages.push("grades/grade-"+g+"/subjects/"+s+"/index.html")}
assert.equal(pages.length,30);
const shell=read("assets/middle-school-landing-shell-v1.js");
const css=read("assets/middle-school-landing-shell-v1.css");
const tools=read("assets/middle-school-landing-class-tools-v1.js");
const breakaway=read("assets/khaemenes-middle-breakaway.js");
for(const token of ["vnv-333-ticker.js","vnv-ticker-autopopulate.js","vnv-header-autopopulate.js","khaemenes-campus-phrases.js","khaemenes-interlingual-core.js","khaemenes-translator-loader.js","vnv-language.js?v=20261121-half-height","vnv-class-tools-toolbar.js?v=1.6.1","vnv-ecosystem-toolbar.js"])assert(shell.includes(token),"canonical shell missing "+token);
for(const token of ['title:"Khaemenes Academy"',"Learner Profile","Parent Profile","Enrollment","Course Features","middle-canonical-feature-grid"])assert(shell.includes(token),"shell missing "+token);
for(const token of ["font:400 33px","font:400 66px","font:400 24px","font-size:14px","border-radius:7px","grid-template-columns:repeat(2","font-size:16px!important","grid-template-columns:repeat(4"])assert(css.includes(token),"visual contract missing "+token);
assert(tools.includes("middle-school-landings")&&tools.includes("Translate"),"lower-left tools configuration missing");
assert(breakaway.includes("isLandingPage")&&breakaway.includes("if(!isLandingPage())"),"Breakaway landing collision guard missing");
for(const p of pages){
 const html=read(p);
 for(const token of ['data-middle-landing-shell="v1"','middle-school-landing-shell-v1.css','middle-school-landing-shell-v1.js'])assert(html.includes(token),p+" missing "+token);
 assert(!/khaemenes-global-header\.css|vnv-ecosystem-menu\.css|khaemenes-landing-standard\.css|khaemenes-landing-toolbar\.css|data-khae-header|khae-global-campus-header|class="header no-print"/i.test(html),p+" contains competing legacy landing chrome");
 assert(!/vnv-ecosystem-menu\.js|khaemenes-landing-toolbar\.js|vnv-333-ticker\.js|vnv-ticker-autopopulate\.js|VNV_TICKER\.autoPopulate|<script[^>]+vnv-language\.js|<script[^>]+vnv-ecosystem-toolbar\.js/i.test(html),p+" directly loads canonical chrome instead of shared shell");
}
console.log("PASS Middle School canonical landing topology: 30 pages · 3 grades · 27 subject halls · one canonical VNV chrome owner · no competing landing UI · even grids · protected learning engines preserved.");
