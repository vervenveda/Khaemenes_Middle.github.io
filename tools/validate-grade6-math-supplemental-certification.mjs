import assert from "node:assert/strict";
import fs from "node:fs";

const root="grades/grade-06/subjects/mathematics";
const days=["Monday","Tuesday","Wednesday","Thursday","Friday"];
let panels=0,problems=0,fields=0,keys=0;
for(let week=4;week<=36;week++){
  const n=String(week).padStart(2,"0");
  const html=fs.readFileSync(`${root}/week-${n}.html`,"utf8");
  const marker=week===4?"grade6-week04-rigor":`grade6-block-${n}-rigor`;
  const panelRegex=new RegExp(`<section class="${marker}"[\\s\\S]*?<\\/section>`,"g");
  const found=[...html.matchAll(panelRegex)].map(m=>m[0]);
  assert.equal(found.length,5,`Week ${n}: expected five independent day panels`);
  const externalScripts=(html.match(/<script[^>]*src=/g)||[]).length;
  assert.equal(externalScripts,8,`Week ${n}: original script references drifted`);
  for(let day=0;day<5;day++){
    const name=days[day];
    const article=html.match(new RegExp(`<article class="lesson"><h2>${name}[\\s\\S]*?<\\/article>`));
    assert.ok(article,`Week ${n}: missing ${name} lesson article`);
    const content=article[0];
    const inside=content.match(new RegExp(`<section class="${marker}"[\\s\\S]*?<\\/section>`));
    assert.ok(inside,`Week ${n} ${name}: panel absent from original daily article`);
    assert.equal((content.match(new RegExp(`class="${marker}"`,"g"))||[]).length,1,`Week ${n} ${name}: duplicate panel`);
    const panel=inside[0];
    const li=[...panel.matchAll(/<li>.*?<\/li>/g)];
    assert.ok(li.length>=4&&li.length<=5,`Week ${n} ${name}: expected 4–5 independent problems`);
    assert.equal((panel.match(/<textarea /g)||[]).length,1,`Week ${n} ${name}: response area missing`);
    assert.equal((panel.match(/<details/g)||[]).length,1,`Week ${n} ${name}: teacher key disclosure missing`);
    const textarea=panel.match(/<textarea id="([^"]+)"/),label=panel.match(/<label for="([^"]+)"/);
    assert.ok(textarea&&label&&textarea[1]===label[1],`Week ${n} ${name}: unassociated response label`);
    assert.ok(/not automatically saved|not automatically save|not autosaved/i.test(panel),`Week ${n} ${name}: persistence warning absent`);
    assert.ok(/80% mastery/i.test(panel),`Week ${n} ${name}: official mastery boundary unclear`);
    panels++;problems+=li.length;fields++;keys++;
  }
  assert.ok(html.includes(`week-${n}-assessment.html`),`Week ${n}: weekly assessment link missing`);
}
const final=fs.readFileSync(`${root}/week-36.html`,"utf8");
assert.ok(final.includes("assessments/final-exam.html"),"Final cumulative exam link missing");
assert.equal(panels,165);
assert.equal(fields,165);
assert.equal(keys,165);
assert.equal(problems,694,"Original enhanced question count must not drift unexpectedly");
console.log(`Grade 6 supplemental mathematics certification structural PASS: ${panels} weekday sections, ${problems} problems, ${fields} labelled response areas, ${keys} teacher keys, 33 weeks, unchanged script count and official exam links. Not a browser, correctness or learner-outcome certification.`);
