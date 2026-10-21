/*
 * Khaemenes Middle School Question Factory v1.0.0
 * Grades 06–08 · first-party Monte Carlo assessment generation
 */
(function attachMiddleQuestionFactory(global){
"use strict";

const VERSION="1.0.0";
const SUBJECTS=["language-arts","mathematics","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];

function hash(text){let h=2166136261>>>0;for(const ch of String(text||"")){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=(Number(seed)>>>0)||0x9e3779b9;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function int(r,min,max){return Math.floor(r()*(max-min+1))+min}
function pick(r,arr){return arr[Math.floor(r()*arr.length)]}
function shuffle(r,arr){const out=arr.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function uniq(arr){return [...new Set(arr.map(v=>String(v)))]}
function normalizeSubject(v){
  const s=String(v||"").toLowerCase().replace(/[^a-z]+/g,"-").replace(/^-|-$/g,"");
  if(s==="world-languages"||/world-language|language-culture|global-culture/.test(s))return"world-languages";
  if(/language|reading|writing|literacy|ela/.test(s))return"language-arts";
  if(/math/.test(s))return"mathematics";
  if(/science|engineering/.test(s))return"science";
  if(/social|civic|history|geograph|economic/.test(s))return"social-studies";
  if(/world-language|language-culture/.test(s))return"world-languages";
  if(/art|music|media/.test(s))return"arts-music";
  if(/health|physical|pe|sel|wellness/.test(s))return"health-pe-sel";
  if(/tech|digital|computer|design/.test(s))return"technology-design";
  if(/project|integrat|research|capstone/.test(s))return"integrated-projects";
  return SUBJECTS.includes(s)?s:"integrated-projects";
}
function makeQuestion(prompt,correct,wrongs,meta){
  meta=meta||{};
  const options=uniq([correct].concat(wrongs)).slice(0,4);
  if(options.length!==4)throw new Error("Question requires four distinct options: "+prompt);
  return {
    id:meta.id||("mq-"+hash(prompt+"|"+correct).toString(36)),
    prompt:String(prompt),
    correct:String(correct),
    options,
    subject:normalizeSubject(meta.subject),
    skill:String(meta.skill||""),
    grade:String(meta.grade||""),
    focus:String(meta.focus||""),
    rationale:String(meta.rationale||"")
  };
}
function finalize(q,r){const options=shuffle(r,q.options);return Object.assign({},q,{options,answer:options.indexOf(q.correct)})}
function numberWrongs(c,step){const n=Number(c),s=Math.max(1,Number(step)||1);return uniq([n-s,n+s,n+2*s,n-2*s,n+10,n-10].filter(x=>Number.isFinite(x)&&x!==n)).slice(0,3)}

/* Mathematics */
function qRatio(r,g,focus){
  const a=int(r,2,9),b=int(r,2,9),scale=int(r,2,6),ca=a*scale,cb=b*scale;
  return makeQuestion("Which ratio is equivalent to "+a+":"+b+"?",ca+":"+cb,[a+":"+(b+scale),(a+scale)+":"+b,ca+":"+b],{subject:"mathematics",skill:"ratios",grade:g,focus,rationale:"Equivalent ratios multiply both terms by the same nonzero factor."});
}
function qPercent(r,g,focus){
  const base=pick(r,[40,50,60,80,100,120,150,200]),pct=pick(r,[10,20,25,30,40,50,60,75]),ans=base*pct/100;
  return makeQuestion("What is "+pct+"% of "+base+"?",ans,numberWrongs(ans,Math.max(2,base/20)),{subject:"mathematics",skill:"percent",grade:g,focus,rationale:"Percent means per hundred: "+pct+"/100 × "+base+" = "+ans+"."});
}
function qRational(r,g,focus){
  const a=int(r,-12,12),b=int(r,-12,12)||3,ans=a+b;
  return makeQuestion("Evaluate "+a+" + ("+b+").",ans,numberWrongs(ans,2),{subject:"mathematics",skill:"rational-number operations",grade:g,focus,rationale:"Apply signed-number addition rules and check the result on a number line."});
}
function qEquation(r,g,focus){
  const x=int(r,-8,12),a=int(r,2,9),b=int(r,-12,12),c=a*x+b;
  return makeQuestion("Solve "+a+"x + "+b+" = "+c+".",x,numberWrongs(x,2),{subject:"mathematics",skill:"linear equations",grade:g,focus,rationale:"Undo the constant, then divide by the coefficient."});
}
function qProportion(r,g,focus){
  const rate=int(r,2,12),units=int(r,3,9),ans=rate*units;
  return makeQuestion("A quantity changes at a constant rate of "+rate+" per unit. What is the value after "+units+" units?",ans,numberWrongs(ans,rate),{subject:"mathematics",skill:"proportional relationships",grade:g,focus,rationale:"A constant rate model is y = rate × units."});
}
function qProbability(r,g,focus){
  const red=int(r,2,8),blue=int(r,2,8),total=red+blue,correct=red+"/"+total;
  return makeQuestion("A bag has "+red+" red and "+blue+" blue counters. What is the probability of drawing red?",correct,[blue+"/"+total,red+"/"+blue,total+"/"+red],{subject:"mathematics",skill:"probability",grade:g,focus,rationale:"Probability = favorable outcomes ÷ total outcomes."});
}
function qAreaCirc(r,g,focus){
  const radius=int(r,2,9),correct=(Math.PI*radius*radius).toFixed(1);
  const wrong1=(2*Math.PI*radius).toFixed(1),wrong2=(Math.PI*radius).toFixed(1),wrong3=(radius*radius).toFixed(1);
  return makeQuestion("Using π ≈ 3.1416, what is the area of a circle with radius "+radius+"? Round to the nearest tenth.",correct,[wrong1,wrong2,wrong3],{subject:"mathematics",skill:"circle area",grade:g,focus,rationale:"Area of a circle is πr²."});
}
function qSlope(r,g,focus){
  const m=int(r,-5,6)||2,x1=int(r,-4,4),x2=x1+int(r,2,6),y1=int(r,-6,6),y2=y1+m*(x2-x1);
  return makeQuestion("What is the slope through ("+x1+", "+y1+") and ("+x2+", "+y2+")?",m,numberWrongs(m,1),{subject:"mathematics",skill:"slope",grade:g,focus,rationale:"Slope = change in y ÷ change in x."});
}
function qScientific(r,g,focus){
  const coeff=int(r,2,9),pow=int(r,3,7),expanded=coeff*Math.pow(10,pow);
  return makeQuestion("Which scientific notation represents "+expanded.toLocaleString("en-US")+"?",coeff+" × 10^"+pow,[coeff+" × 10^"+(pow-1),(coeff+1)+" × 10^"+pow,coeff+" × 10^-"+pow],{subject:"mathematics",skill:"scientific notation",grade:g,focus,rationale:"Move the decimal until one nonzero digit remains to its left; the move count gives the exponent."});
}
function qPythagorean(r,g,focus){
  const triple=pick(r,[[3,4,5],[5,12,13],[8,15,17],[7,24,25]]),a=triple[0],b=triple[1],c=triple[2];
  return makeQuestion("A right triangle has legs "+a+" and "+b+". What is the hypotenuse?",c,[a+b,Math.abs(a-b),c+2],{subject:"mathematics",skill:"Pythagorean theorem",grade:g,focus,rationale:"For a right triangle, a² + b² = c²."});
}
function mathGenerators(g,focus){
  const list=[qRatio,qPercent,qRational,qEquation,qProportion];
  if(g>=7)list.push(qProbability,qAreaCirc);
  if(g>=8)list.push(qSlope,qScientific,qPythagorean);
  const f=String(focus||"").toLowerCase();
  const boosts=[];
  if(/ratio|rate|proportion/.test(f))boosts.push(qRatio,qProportion);
  if(/percent/.test(f))boosts.push(qPercent,qPercent);
  if(/rational|integer/.test(f))boosts.push(qRational,qRational);
  if(/equation|linear|function|slope/.test(f))boosts.push(qEquation,g>=8?qSlope:qEquation);
  if(/probab|stat/.test(f)&&g>=7)boosts.push(qProbability);
  if(/circle|geometry/.test(f)&&g>=7)boosts.push(qAreaCirc);
  if(/scientific|exponent/.test(f)&&g>=8)boosts.push(qScientific);
  if(/pythag/.test(f)&&g>=8)boosts.push(qPythagorean);
  return boosts.concat(list);
}

/* Language Arts */
const PASSAGES=[
 {t:"A city council proposed extending library hours. Supporters cited attendance data showing that many students arrived after sports practices. Opponents argued that staffing costs would rise. The council requested a six-week pilot before voting on a permanent schedule.",claim:"The council is using a pilot to gather evidence before making a permanent decision.",evidence:"The council requested a six-week pilot before voting on a permanent schedule."},
 {t:"In a lab report, Mina wrote that the metal sample became warmer after exposure to light. She repeated the trial three times, measured temperature at equal intervals, and reported one trial that did not match the others.",claim:"Mina strengthens the report by including repeated measurements and an inconsistent result.",evidence:"She repeated the trial three times and reported one trial that did not match the others."},
 {t:"An article about urban trees explains that tree cover can reduce surface temperature, slow stormwater runoff, and provide habitat. It also notes that planting plans must consider water supply, roots, maintenance, and local species.",claim:"Urban tree planning involves both benefits and practical constraints.",evidence:"The article lists cooling, runoff, and habitat benefits but also water, root, maintenance, and species constraints."},
 {t:"Two historians describe the same protest differently. One emphasizes economic pressures; the other emphasizes legal restrictions and political organization. Both cite letters and newspaper accounts from the period.",claim:"Historical interpretation can differ even when writers use overlapping primary evidence.",evidence:"The historians emphasize different causes while both citing letters and newspapers from the period."}
];
function qTextEvidence(r,g,focus){
 const p=pick(r,PASSAGES);
 return makeQuestion("Read: “"+p.t+"” Which statement is best supported by the passage?",p.claim,[p.evidence,"The passage proves that every expert agrees.","The passage gives no evidence for any conclusion."],{subject:"language-arts",skill:"text evidence",grade:g,focus,rationale:"The best answer states an inference supported by the passage as a whole."});
}
function qDirectEvidence(r,g,focus){
 const p=pick(r,PASSAGES);
 return makeQuestion("Read: “"+p.t+"” Which sentence is the strongest direct evidence?",p.evidence,[p.claim,"The author must prefer the first idea.","The topic can be solved without evidence."],{subject:"language-arts",skill:"citing evidence",grade:g,focus,rationale:"Direct evidence is explicitly stated in the source."});
}
function qClaimEvidence(r,g,focus){
 return makeQuestion("Which evidence most strongly supports the claim that a school should test a schedule change before making it permanent?","A pilot program produced attendance and transportation data for several weeks.",["Several students said they like changes.","The schedule was printed in a different font.","A nearby school has a different mascot."],{subject:"language-arts",skill:"claim and evidence",grade:g,focus,rationale:"Strong evidence is relevant, specific, and capable of testing the claim."});
}
function qSourceCred(r,g,focus){
 return makeQuestion("Which source is strongest for verifying a current statistical claim about local water use?","A dated public-utility dataset with methods and units explained.",["An undated anonymous post with no sources.","A fictional story set in the city.","A product advertisement that gives no data source."],{subject:"language-arts",skill:"source evaluation",grade:g,focus,rationale:"A verifiable source identifies origin, date, method, and relevant evidence."});
}
function qRevision(r,g,focus){
 return makeQuestion("Which revision most improves academic precision?","The data show a 14% decrease over three measured trials.",["Things got way better.","It was basically a huge change.","The results were awesome and obvious."],{subject:"language-arts",skill:"revision and precision",grade:g,focus,rationale:"Precise academic writing names the evidence and avoids vague intensifiers."});
}
function qCounterclaim(r,g,focus){
 return makeQuestion("What is the strongest way to address a counterclaim in an argument?","State it fairly, evaluate its evidence, and explain why the original claim remains stronger or needs qualification.",["Ignore it so readers do not notice it.","Misstate it so it is easier to attack.","Replace evidence with a personal insult."],{subject:"language-arts",skill:"argument and counterclaim",grade:g,focus,rationale:"Strong argumentation represents competing views fairly and responds with evidence and reasoning."});
}
function elaGenerators(g,focus){
 const list=[qTextEvidence,qDirectEvidence,qClaimEvidence,qSourceCred,qRevision];
 if(g>=7)list.push(qCounterclaim,qSourceCred);
 const f=String(focus||"").toLowerCase(),boosts=[];
 if(/evidence|annotat|source|research/.test(f))boosts.push(qDirectEvidence,qSourceCred,qTextEvidence);
 if(/argument|claim|counter/.test(f))boosts.push(qClaimEvidence,g>=7?qCounterclaim:qClaimEvidence);
 if(/revision|grammar|precision/.test(f))boosts.push(qRevision);
 return boosts.concat(list);
}

/* Curated domain banks */
const SCIENCE=[
 {tags:"matter particle atom",p:"Which model best explains why a gas can be compressed more than a liquid?",c:"Gas particles are much farther apart, leaving more empty space between them.",w:["Gas particles have no mass.","Liquid particles do not move.","Compression destroys matter."]},
 {tags:"energy transfer thermal",p:"Which observation is strongest evidence of thermal energy transfer?",c:"A cooler metal spoon warms after sitting in hot water.",w:["A ruler changes units from centimeters to meters.","A shadow moves as the Sun appears to move.","A sealed container keeps the same mass."]},
 {tags:"force motion newton",p:"Two carts have different masses but experience the same net force. Which cart has greater acceleration?",c:"The cart with less mass.",w:["The cart with more mass.","They must have identical acceleration regardless of mass.","Neither cart can accelerate."]},
 {tags:"ecosystem food-web",p:"A drought sharply reduces plant growth in an ecosystem. Which effect is most directly expected first?",c:"Less energy is available to primary consumers.",w:["Decomposers stop existing immediately.","All predators increase at once.","The water cycle ends."]},
 {tags:"cell system",p:"Why are specialized cells important in multicellular organisms?",c:"Different cell structures support different functions within larger systems.",w:["Every cell performs every function equally.","Specialization prevents cells from using energy.","Specialized cells contain no genetic material."]},
 {tags:"genetics heredity",p:"Which statement best distinguishes genotype from phenotype?",c:"Genotype describes genetic information; phenotype describes observable traits influenced by genes and environment.",w:["Genotype is always visible; phenotype never is.","Phenotype is DNA only.","They mean exactly the same thing."]},
 {tags:"earth plate tectonics",p:"Which evidence most strongly supports plate tectonics?",c:"Matching fossils, seafloor patterns, earthquake belts, and measured plate motion.",w:["Daily weather changes.","The phases of the Moon.","Seasonal daylight changes."]},
 {tags:"climate weather data",p:"Which dataset is best suited to studying climate rather than one day's weather?",c:"Temperature and precipitation records collected over several decades.",w:["One afternoon temperature reading.","A single thunderstorm photo.","Today's wind direction only."]},
 {tags:"cer evidence",p:"In claim-evidence-reasoning, what makes evidence scientifically useful?",c:"It is relevant data or observation that can be connected to the claim through reasoning.",w:["It agrees with the student no matter how it was collected.","It is always a personal opinion.","It replaces the need for reasoning."]},
 {tags:"waves",p:"A wave's frequency increases while wave speed stays constant. What happens to wavelength?",c:"Wavelength decreases.",w:["Wavelength increases.","Wavelength becomes zero automatically.","Frequency and wavelength are unrelated."]},
 {tags:"engineering variable",p:"Why should an engineering test change one major design variable at a time when possible?",c:"It makes it easier to connect performance changes to that variable.",w:["It guarantees the design cannot fail.","It eliminates the need to collect data.","It makes every prototype identical."]},
 {tags:"evolution selection",p:"Which condition is necessary for natural selection to change trait frequencies over generations?",c:"Heritable variation affects survival or reproduction.",w:["All organisms are genetically identical.","Traits change because organisms need them.","No offspring inherit traits."]}
];
const SOCIAL=[
 {tags:"primary source evidence",p:"Which source is primary evidence for studying a historical debate?",c:"A letter written by a participant during the debate.",w:["A modern encyclopedia summary.","A fictional movie based loosely on the period.","A present-day advertisement."]},
 {tags:"civics constitution rights",p:"What is the main purpose of constitutional limits on government power?",c:"To define authority and protect rights through enforceable rules.",w:["To eliminate all disagreement.","To allow officials unlimited power.","To prevent citizens from participating."]},
 {tags:"economics opportunity-cost",p:"A city can fund either a new park or a road repair project with the same limited money. What is the opportunity cost of choosing the park?",c:"The benefits of the road repair project that is not chosen.",w:["The total amount of money in every city account.","Any benefit produced by the park.","A cost that disappears because a choice was made."]},
 {tags:"geography migration",p:"Which pair best represents a push factor and a pull factor in migration?",c:"Conflict pushing people away; employment opportunity attracting people elsewhere.",w:["A map legend and a compass rose.","A law and a calendar.","A river and a mountain only."]},
 {tags:"history causation",p:"Which statement best reflects historical causation?",c:"Major events often result from interacting economic, political, social, and environmental factors.",w:["Every major event has one simple cause.","Chronology alone proves causation.","Sources are unnecessary if the outcome is known."]},
 {tags:"civics federalism",p:"Federalism divides governing authority primarily between:",c:"National and state or regional governments.",w:["Courts and newspapers.","Citizens and private companies only.","Cities and foreign governments only."]},
 {tags:"economics inflation",p:"If prices generally rise while income stays the same, what happens to purchasing power?",c:"Purchasing power falls.",w:["Purchasing power always doubles.","Purchasing power is unrelated to prices.","Every good becomes free."]},
 {tags:"source perspective bias",p:"Why compare multiple sources about the same historical event?",c:"Different sources may reveal different evidence, perspectives, purposes, or omissions.",w:["The first source is always wrong.","Multiple sources guarantee complete agreement.","Comparison removes the need to evaluate credibility."]}
];
const WORLD=[
 {tags:"cognate language",p:"What is a cognate?",c:"A word in two languages with related origin and similar form or meaning.",w:["A word that has no meaning.","A sentence copied without understanding.","Any two words with opposite meanings."]},
 {tags:"translation context",p:"Why can word-for-word translation produce errors?",c:"Meaning can depend on grammar, idiom, context, and culture.",w:["Every language uses identical word order.","Context never affects meaning.","Translation is only a spelling task."]},
 {tags:"culture communication",p:"What is the strongest approach when comparing cultural practices?",c:"Describe evidence carefully and avoid treating one culture as the default standard.",w:["Rank cultures from best to worst.","Assume every person follows every tradition.","Use stereotypes instead of sources."]},
 {tags:"register communication",p:"What does register refer to in language use?",c:"The level of formality and style chosen for a situation and audience.",w:["The number of letters in a word.","A map of language families only.","A translation that ignores audience."]},
 {tags:"language learning",p:"Which practice best builds long-term language proficiency?",c:"Frequent retrieval, meaningful use, listening/reading input, and feedback over time.",w:["Memorizing one list once.","Avoiding speaking until every sentence is perfect.","Using translation only and never context."]},
 {tags:"script transliteration",p:"What is transliteration?",c:"Representing words from one writing system using characters of another system.",w:["Changing the meaning of a text on purpose.","Translating every cultural reference.","Replacing grammar with numbers."]}
];
const ARTS=[
 {tags:"composition design",p:"In visual composition, what does hierarchy help a viewer understand?",c:"Which elements should attract attention first, second, and later.",w:["How much the materials cost.","The artist's age only.","Whether every element has equal emphasis."]},
 {tags:"music rhythm meter",p:"What does meter organize in music?",c:"Recurring patterns of strong and weak beats.",w:["Only pitch names.","The color of an instrument.","The audience seating chart."]},
 {tags:"critique evidence",p:"Which critique is most useful?",c:"The focal point is hard to identify because contrast is similar across the page; increasing value contrast could clarify hierarchy.",w:["I hate it.","Make it better somehow.","It is perfect because no revision is needed."]},
 {tags:"media literacy",p:"Why should a media creator consider framing and editing choices?",c:"Those choices influence what information audiences notice and how they interpret it.",w:["Framing has no effect on meaning.","Editing automatically makes content factual.","Audience interpretation never changes."]},
 {tags:"artist statement",p:"What makes an artist statement academically useful?",c:"It explains intention, process, evidence of revision, and relevant artistic choices.",w:["It lists only the price of supplies.","It says only that the work is good.","It avoids discussing decisions."]}
];
const HEALTH=[
 {tags:"fitness principle",p:"Which principle best supports safe improvement in fitness?",c:"Increase challenge gradually while allowing recovery and monitoring form.",w:["Increase intensity as fast as possible every day.","Ignore pain and fatigue.","Avoid recovery because it slows progress."]},
 {tags:"nutrition evidence",p:"Which statement best reflects evidence-based nutrition reasoning?",c:"Evaluate overall patterns, nutrient needs, portions, and credible guidance rather than a single miracle food.",w:["One food can meet every nutritional need.","Package color proves health value.","Skipping hydration improves performance."]},
 {tags:"sel regulation",p:"Which response best demonstrates emotional regulation?",c:"Notice the emotion, pause, choose a strategy, and respond in a way consistent with goals and safety.",w:["Act immediately on every impulse.","Pretend emotions do not exist.","Blame another person before checking facts."]},
 {tags:"executive function",p:"Which strategy most directly supports executive function for a large project?",c:"Break the project into dated steps, track materials, and review progress regularly.",w:["Wait until the final night.","Keep all deadlines in memory only.","Avoid revising the plan when conditions change."]},
 {tags:"digital wellness",p:"Which practice supports digital wellness during long study sessions?",c:"Use purposeful breaks, posture changes, distance vision, and notification boundaries.",w:["Keep every notification active.","Avoid movement for hours.","Use screens until sleep without interruption."]}
];
const TECH=[
 {tags:"algorithm debugging",p:"What is the best first step when a program produces the wrong output?",c:"Reproduce the problem, inspect inputs and steps, and isolate where actual behavior differs from expected behavior.",w:["Change many unrelated lines at once.","Delete the test that fails.","Assume the computer is random."]},
 {tags:"data spreadsheet",p:"Why use formulas instead of typing calculated spreadsheet results manually?",c:"Formulas can update consistently when source values change and make calculations auditable.",w:["Formulas prevent all errors automatically.","Manual values cannot ever be read.","Formulas remove the need to verify units."]},
 {tags:"digital citizenship privacy",p:"Which practice best protects account security?",c:"Use unique strong credentials and multi-factor authentication when available.",w:["Reuse one password everywhere.","Share credentials with friends.","Post recovery codes publicly."]},
 {tags:"ai ethics data",p:"Why should an AI-generated claim be verified with evidence?",c:"Generated output can be incomplete, inaccurate, biased, or unsupported even when it sounds confident.",w:["AI output is always a primary source.","Confident wording guarantees truth.","Verification is unnecessary for schoolwork."]},
 {tags:"accessibility design",p:"Which design choice most improves accessibility?",c:"Use meaningful headings, sufficient contrast, keyboard access, and text alternatives where needed.",w:["Communicate information by color alone.","Remove labels from form controls.","Require precise mouse movement for all actions."]},
 {tags:"source metadata",p:"Why record source metadata during research?",c:"It supports attribution, traceability, evaluation, and later verification.",w:["It makes every source automatically reliable.","It replaces reading the source.","It hides where information came from."]}
];
const PROJECTS=[
 {tags:"research question",p:"Which research question is most workable?",c:"How did two documented policy choices affect water use in the city between 2015 and 2025?",w:["Why is everything unfair?","What is the best thing ever?","Can I finish this project?"]},
 {tags:"evidence synthesis",p:"What does synthesis require?",c:"Connect evidence from multiple sources to build or refine an explanation rather than merely listing summaries.",w:["Copy one source repeatedly.","Use only sources that agree.","Avoid explaining relationships among evidence."]},
 {tags:"project revision",p:"A prototype fails one test but succeeds in two others. What is the strongest next step?",c:"Analyze the failed condition, revise a specific design feature, and retest while documenting the change.",w:["Declare the whole project useless.","Erase the failed result.","Change every variable without notes."]},
 {tags:"citation integrity",p:"Why cite evidence in a research product?",c:"To credit sources and let readers trace claims to supporting evidence.",w:["To make weak evidence automatically strong.","To avoid original analysis.","To replace explanation with links."]},
 {tags:"presentation defense",p:"During an oral defense, what is the strongest response to a challenging question?",c:"Clarify the question, refer to evidence, explain reasoning, and acknowledge limits when appropriate.",w:["Invent a fact quickly.","Attack the questioner.","Pretend uncertainty never exists."]},
 {tags:"portfolio reflection",p:"Which reflection best demonstrates growth?",c:"My first model assumed constant speed; after comparing the data, I revised the equation and explained why the new model fits better.",w:["I finished the assignment.","The project was fine.","I used a blue heading."]}
];

function scenarioSource(subject){
  if(subject==="science")return SCIENCE;
  if(subject==="social-studies")return SOCIAL;
  if(subject==="world-languages")return WORLD;
  if(subject==="arts-music")return ARTS;
  if(subject==="health-pe-sel")return HEALTH;
  if(subject==="technology-design")return TECH;
  return PROJECTS;
}
function scenarioQuestion(r,g,subject,focus){
  const src=scenarioSource(subject),f=String(focus||"").toLowerCase();
  const preferred=src.filter(x=>x.tags.split(/\s+/).some(tag=>tag.length>3&&f.includes(tag)));
  const item=pick(r,preferred.length?preferred.concat(src):src);
  return makeQuestion(item.p,item.c,item.w,{subject,skill:item.tags.split(" ")[0],grade:g,focus,rationale:"The correct choice best matches the evidence, concept, or reasoning rule being assessed."});
}
function generators(subject,g,focus){
  if(subject==="mathematics")return mathGenerators(g,focus);
  if(subject==="language-arts")return elaGenerators(g,focus);
  return [function(r,grade,f){return scenarioQuestion(r,grade,subject,f)}];
}
function makePool(opts){
  opts=opts||{};
  const g=Math.max(6,Math.min(8,Number(opts.grade)||6)),subject=normalizeSubject(opts.subject),focus=String(opts.focus||""),count=Math.max(1,Number(opts.count)||12);
  const r=rng(hash(String(opts.seed||1)+"|"+g+"|"+subject+"|"+focus)),gens=generators(subject,g,focus),out=[],seen=new Set();
  let guard=0;
  while(out.length<count&&guard<count*60){
    guard++;
    let q;
    try{q=pick(r,gens)(r,g,focus)}catch{continue}
    if(!q||seen.has(q.prompt))continue;
    seen.add(q.prompt);out.push(finalize(q,r));
  }
  return out;
}
function makeBalanced(opts){
  opts=opts||{};
  const g=Math.max(6,Math.min(8,Number(opts.grade)||6)),focus=String(opts.focus||""),count=Math.max(1,Number(opts.count)||18),r=rng(hash("balanced|"+String(opts.seed||1)+"|"+g+"|"+focus)),out=[];
  let cursor=0,guard=0;
  while(out.length<count&&guard<count*80){
    guard++;
    const subject=SUBJECTS[cursor++%SUBJECTS.length];
    const candidates=makePool({grade:g,subject,focus,seed:Math.floor(r()*1e9),count:8});
    const next=candidates.find(q=>!out.some(existing=>existing.prompt===q.prompt));
    if(next)out.push(next);
  }
  return shuffle(r,out).slice(0,count);
}
function validateQuestion(q){
  return !!(q&&typeof q.prompt==="string"&&q.prompt.trim()&&Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4&&q.options[q.answer]===q.correct);
}


/* Six concept-specific questions per Grade 6 weekly mathematics assessment, Weeks 1–6.
 * Questions are freshly parameterized per seed; answer positions are randomized by finalize(). */
function makeGrade6MathWeek(opts){
 const week=Number(opts.week),count=Number(opts.count)||6;
 if(!(week>=1&&week<=6)||count!==6)return[];
 const r=rng(hash("g6w|"+week+"|"+String(opts.seed||1))),out=[];let taskNumber=0;
 function add(prompt,correct,wrong,skill,explanation){
  const correctText=String(correct),alternatives=[...new Set(wrong.map(String).filter(v=>v!==correctText))];
  for(let i=1;alternatives.length<3;i++){const candidate=Number.isFinite(Number(correct))?String(Number(correct)+i*7):"Not equivalent (option "+i+")";if(candidate!==correctText&&!alternatives.includes(candidate))alternatives.push(candidate)}
  const q=makeQuestion("Task "+(++taskNumber)+": "+prompt,correctText,alternatives.slice(0,3),{subject:"mathematics",skill,grade:6,focus:"week "+week,rationale:explanation});
  out.push(finalize(q,r));
 }
 for(let k=0;k<6;k++){
  const n=int(r,2,9),m0=int(r,2,8),m=m0===n?m0+1:m0,factor=int(r,2,5);
  if(week===1){
   if(k%2===0)add("Complete the equivalent ratio "+n+":"+m+" = "+(n*factor)+": ?",m*factor,[m+factor,m*factor+1,n*factor],"ratios","Multiply both ratio terms by the same factor.");
   else add("A group travels "+(n*m)+" kilometers in "+m+" hours. What is the rate in km/hour?",n,[n+1,n*m,m],"unit rates","Divide distance by time.");
  }else if(week===2){
   if(k%2===0)add("There are "+n+" red and "+m+" blue counters. What is red to TOTAL?",n+":"+(n+m),[n+":"+m,m+":"+(n+m),(n+m)+":"+n],"part-to-whole","Total means red plus blue.");
   else add("Which ratio is equivalent to "+n+":"+m+"?",(n*factor)+":"+(m*factor),[(n*factor)+":"+m,n+":"+(m*factor),(n+factor)+":"+(m+factor)],"equivalent ratios","Scale both quantities equally.");
  }else if(week===3){
   if(k%2===0)add("A pump fills "+(n*m)+" liters in "+m+" minutes. How many liters in ONE minute?",n,[m,n+1,n*m],"unit rates","Divide liters by minutes.");
   else add("At "+n+" liters per minute, how many liters after "+m+" minutes?",n*m,[n+m,n*m+1,m],"rate tables","Multiply rate by elapsed minutes.");
  }else if(week===4){
   const pct=[10,20,25,50][k%4],base=20*n;
   if(k%2===0)add("Find "+pct+"% of "+base+".",pct*base/100,[pct*base/100+5,pct*base/100+10,base-pct*base/100],"percent","Multiply the whole by percent divided by 100.");
   else {const divisor=[2,4,5][k%3];add("In a survey, "+n+" of "+(n*divisor)+" people chose A. What percent is that?",100/divisor+"%",[divisor+"%",n+"%",(100/divisor+10)+"%"],"survey proportions","Part divided by whole times 100.");}
  }else if(week===5){
   if(k%2===0)add("How many 1/"+m+"-size pieces fit into "+n+" whole units?",n*m,[n+m,n,m],"fraction division","Dividing by 1/m counts m pieces per whole.");
   else add("Compute "+n+"/"+m+" ÷ 1/"+m+".",n,[n*m,m,n+1],"fraction division","There are n copies of 1/m in n/m.");
  }else{
   if(k%3===0)add("Which value is greater: -"+n+" or -"+m+"?","-"+Math.min(n,m),["-"+Math.max(n,m),"0",String(Math.max(n,m))],"integer ordering","The negative number closer to zero is greater.");
   else if(k%3===1)add("What is the absolute value of -"+n+"?",n,[-n,0,n+1],"absolute value","Absolute value is distance from zero.");
   else add("In base 60, positional digits (1, "+n+") represent what decimal quantity?",60+n,[10+n,100+n,60*n],"historical place value","One group of sixty plus n units.");
  }
 }
 return shuffle(r,out);
}


function makeGrade6CoordinateWeek(opts){
 const r=rng(hash("g6coordinates|"+String(opts.seed||1))),out=[];
 const p=(x,y)=>"("+x+", "+y+")";
 const a=int(r,2,6),b=int(r,1,5),t=int(r,1,5),scale=pick(r,[100,200,250,500]);
 function add(prompt,correct,wrong,skill,rationale){
   const options=[String(correct),...wrong.map(String)];
   if(new Set(options).size!==4)throw new Error("Ambiguous coordinate choices: "+prompt);
   out.push(finalize(makeQuestion(prompt,correct,wrong,{subject:"mathematics",grade:6,skill,focus:"week 7 coordinates",rationale}),r));
 }
 add("Starting at the origin, move "+a+" left and "+b+" up. Which point do you reach?",p(-a,b),[p(a,b),p(-a,-b),p(a,-b)],"plotting","Horizontal x first, vertical y second.");
 add("Which quadrant contains "+p(-a,-b)+"?","III",["I","II","IV"],"quadrants","Both coordinates negative means Quadrant III.");
 add("The point "+p(0,-b)+" lies where?","On the y-axis",["On the x-axis","Quadrant III","Quadrant IV"],"axes","x=0 means the y-axis; axis points are not inside quadrants.");
 add("Reflect "+p(-a,b)+" across the x-axis. Which point results?",p(-a,-b),[p(a,b),p(-a,b),p(a,-b)],"reflection x","Keep x, reverse y.");
 add("Reflect "+p(-a,b)+" across the y-axis. Which point results?",p(a,b),[p(-a,-b),p(-a,b),p(a,-b)],"reflection y","Reverse x, keep y.");
 add("Points "+p(-a,t)+" and "+p(b,t)+" share a straight horizontal map street, with "+scale+" meters per grid interval. How far apart are they?",String((a+b)*scale)+" meters",[String(Math.abs(a-b)*scale)+" meters",String(a+b)+" meters",String((a+b+1)*scale)+" meters"],"map scale","Subtract x-coordinates and multiply the separation by meters per interval.");
 return shuffle(r,out);
}


function makeGrade6ExpressionsWeek(opts){
 const r=rng(hash("g6expressions|"+String(opts.seed||1))),out=[],v=int(r,2,8),a=int(r,2,6),b=int(r,2,9);
 function add(prompt,correct,wrong,skill,reason){
 const good=String(correct),alt=[...new Set(wrong.map(String).filter(x=>x!==good))];
 for(let i=1;alt.length<3;i++){const extra=Number.isFinite(Number(correct))?String(Number(correct)+7*i):skill==="translation"?(a+i)+"n + "+b:skill==="distributive property"?a+"x + "+(a*b+i):(a+b+i)+"y - 3";if(extra!==good&&!alt.includes(extra))alt.push(extra)}
 const q=makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 8 expressions",skill,rationale:reason});
 out.push(finalize(q,r));
 }
 add("Evaluate "+a+"x + "+b+" when x = "+v+".",a*v+b,[a+v+b,a*v+b+1,a*(v+b)],"substitution","Replace x with its value and multiply before adding.");
 add("Which expression represents "+b+" more than "+a+" times n?",a+"n + "+b,[a+"(n + "+b+")",b+"n + "+a,a+"n - "+b],"translation","Multiply n by a, then add b.");
 add("Evaluate "+a+"p² + "+b+" when p = "+v+".",a*v*v+b,[a*v+b,(a*v)*(a*v)+b,a*(v+b)],"order of operations","Apply the exponent before multiplication.");
 add("Expand "+a+"(x + "+b+").",a+"x + "+a*b,[a+"x + "+b,"x + "+a*b,(a+b)+"x"],"distributive property","Multiply both terms inside parentheses by a.");
 add("Simplify "+a+"y + "+b+"y - 3.",(a+b)+"y - 3",[(a*b)+"y - 3",(a+b)+"y + 3",a+"y + "+b+"y + 3"],"like terms","Add coefficients of matching y terms.");
 const visits=int(r,2,8),fee=int(r,8,15),unit=int(r,2,6),ans=fee+unit*visits;
 add("A club has a $"+fee+" enrollment fee and charges $"+unit+" per visit. What is the total for "+visits+" visits?","$"+ans,["$"+(fee+unit+visits),"$"+((fee+unit)*visits),"$"+(ans+unit)],"applied expressions","Charge the enrollment fee once, then multiply the visit rate by visits.");
 return shuffle(r,out);
}


function makeGrade6EquationsWeek(opts){
 const r=rng(hash("g6equations|"+String(opts.seed||1))),out=[],n=int(r,2,12),a=int(r,2,8),b=int(r,3,13);
 function add(prompt,correct,wrong,skill,reason){
  const answer=String(correct),alternatives=[...new Set(wrong.map(String).filter(x=>x!==answer))];
  for(let k=1;alternatives.length<3;k++){const extra=String(Number(correct)+17*k);if(extra!==answer&&!alternatives.includes(extra))alternatives.push(extra)}
  out.push(finalize(makeQuestion(prompt,answer,alternatives.slice(0,3),{subject:"mathematics",grade:6,focus:"week 9 equations",skill,rationale:reason}),r));
 }
 add("Solve x + "+a+" = "+(n+a)+".",n,[n+a,n-a,a],"addition equation","Subtract a from both sides and check.");
 add("Solve x - "+a+" = "+n+".",n+a,[n-a,n,a],"subtraction equation","Add a to both sides and check.");
 add("Solve "+a+"x = "+(a*n)+".",n,[a*n,n+a,a],"multiplication equation","Divide both sides by a.");
 add("Solve x / "+a+" = "+n+".",a*n,[n,n+a,a],"division equation","Multiply both sides by a.");
 add("A club charges $"+a+" once plus $"+b+" per visit, totaling $"+(a+b*n)+". How many visits were made?",n,[n+a,n+b,a+b],"word equations","Subtract the one-time fee, then divide by the per-visit price.");
 const negative=-int(r,2,9),positive=int(r,2,12),right=negative+positive;
 add("Solve x - ("+negative+") = "+positive+".",right,[positive-negative,positive,negative],"signed equations","Subtracting a negative adds its opposite; isolate x and substitute to verify.");
 return shuffle(r,out);
}


function makeGrade6InequalitiesWeek(opts){
 const r=rng(hash("g6inequalities|"+String(opts.seed||1))),out=[];
 const n=int(r,3,12),a=int(r,2,7),b=int(r,2,8);
 function add(prompt,correct,wrong,skill,reason){
  const good=String(correct),alt=[...new Set(wrong.map(String).filter(x=>x!==good))];
  if(alt.length!==3)throw Error("Ambiguous inequality alternatives");
  out.push(finalize(makeQuestion(prompt,good,alt,{subject:"mathematics",grade:6,focus:"week 10 inequalities",skill,rationale:reason}),r));
 }
 add("Which graph represents x > "+n+"?","Open circle at "+n+", shade right",["Closed circle at "+n+", shade right","Open circle at "+n+", shade left","Closed circle at "+n+", shade left"],"strict inequality","A strict greater-than uses an open endpoint and rightward shading.");
 add("What is the solution set of x - "+a+" ≤ "+n+"?","x ≤ "+(n+a),["x ≥ "+(n+a),"x < "+(n+a),"x ≤ "+(n-a)],"addition-subtraction","Add the same number to both sides.");
 add("What is the solution set of "+a+"x > "+(a*n)+"?","x > "+n,["x ≥ "+n,"x < "+n,"x > "+(a*n)],"positive multiplication","Divide by positive a; do not reverse the symbol.");
 add("Solve -"+a+"x ≥ "+(a*b)+".","x ≤ -"+b,["x ≥ -"+b,"x ≤ "+b,"x < -"+b],"negative coefficient","Divide by a negative and reverse the inequality.");
 const budget=int(r,50,90),fixed=int(r,5,15),rate=int(r,2,6),capacity=Math.floor((budget-fixed)/rate);
 add("A trip has at most $"+budget+". It costs $"+fixed+" plus $"+rate+" per person. What is the greatest whole-number group size?",capacity,[capacity+1,capacity-1,capacity+2],"budget constraint","Subtract the fixed cost then divide by the per-person rate, rounding down.");
 add("Which statement is represented by age ≥ "+b+"?","Age "+b+" or older",["Older than "+b+" only","Younger than "+b,"Exactly age "+b+" only"],"inclusive boundary","The greater-than-or-equal symbol includes the boundary.");
 return shuffle(r,out);
}


function makeGrade6StatisticsWeek(opts){
 const r=rng(hash("g6statistics|"+String(opts.seed||1))),out=[],a=int(r,2,7),d=int(r,1,6),k=int(r,1,4);
 function add(prompt,correct,wrongs,skill,reason){
  const good=String(correct),wrong=[...new Set(wrongs.map(String).filter(x=>x!==good))];
  if(wrong.length!==3)throw Error("Ambiguous statistics choices: "+prompt);
  out.push(finalize(makeQuestion(prompt,good,wrong,{subject:"mathematics",grade:6,focus:"week 11 statistics",skill,rationale:reason}),r));
 }
 add("Which question is statistical?","How many minutes do students in a class read each day?",["How old is the school principal today?","How many minutes did one named student read yesterday?","What is the name of the school library?"],"statistical question","Statistical questions anticipate variability in collected responses.");
 add("For the ordered data "+[a,a+d,a+d,a+2*d,a+4*d].join(", ")+", what is the median?",a+d,[a,a+2*d,a+4*d],"median","In five ordered values, the third is the median.");
 add("For the values "+[a,a,a+d,a+2*d,a+2*d,a+2*d].join(", ")+", what is the mode?",a+2*d,[a,a+d,a+3*d],"mode","The mode occurs most frequently.");
 add("For the data "+[a,a+d,a+2*d,a+4*d].join(", ")+", what is the range?",4*d,[3*d,2*d,4*d+a],"range","Subtract the minimum from the maximum.");
 add("What is the mean of "+[a,a+2*d,a+4*d].join(", ")+"?",a+2*d,[a+d,a+4*d,a+3*d],"mean","Add the three values and divide by three.");
 const low=10*k,hi=low+10;
 add("A histogram has bins ["+low+", "+hi+") and ["+hi+", "+(hi+10)+"). Where does a value of "+hi+" belong?","Second bin",["First bin","Both bins","Neither bin"],"histogram bins","The first bin excludes its upper endpoint; the second includes its lower endpoint.");
 return shuffle(r,out);
}


function makeGrade6GeometryWeek(opts){
 const r=rng(hash("g6geometry|"+String(opts.seed||1))),out=[],a=int(r,3,10),b=int(r,2,8),h=int(r,2,7);
 function add(prompt,correct,wrongs,skill,rationale){
  const right=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==right))];
  for(let k=1;alt.length<3;k++){const extra=String(Number(correct)+13*k);if(extra!==right&&!alt.includes(extra))alt.push(extra)}
  out.push(finalize(makeQuestion(prompt,right,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 12 geometry",skill,rationale}),r));
 }
 add("What is the area of a "+a+" cm by "+b+" cm rectangle in cm²?",a*b,[a+b,2*(a+b),a*b+h],"rectangle area","Multiply length by width; use square centimeters.");
 add("What is the area of a triangle with base "+(2*a)+" cm and perpendicular height "+b+" cm in cm²?",a*b,[2*a*b,2*a+b,a+b],"triangle area","Area is base times perpendicular height divided by two.");
 const outerL=a+4,outerW=b+3,cutHeight=Math.min(h,outerW-1),removed=2*cutHeight,composite=outerL*outerW-removed;
 add("A "+outerL+" m by "+outerW+" m rectangle has a 2 m by "+cutHeight+" m corner removed. What area remains in m²?",composite,[outerL*outerW,composite+removed,composite-removed],"composite area","Subtract the missing area from the full rectangle.");
 const closed=2*(a*b+a*h+b*h);
 add("Find the total surface area in cm² of a CLOSED box measuring "+a+" by "+b+" by "+h+" cm.",closed,[a*b*h,a*b+a*h+b*h,closed+a*b],"closed prism","A closed rectangular prism has two of each of three face areas.");
 const lidless=a*b+2*a*h+2*b*h;
 add("Find the material area in cm² of a box WITHOUT A LID, measuring "+a+" by "+b+" by "+h+" cm.",lidless,[closed,a*b*h,lidless+a*b+h],"lidless prism","Count the base and four side faces only.");
 add("Which unit correctly describes the surface area of a box measured in centimeters?","cm²",["cm","cm³","meters per second"],"units","Area is measured in square units rather than length or volume.");
 return shuffle(r,out);
}


function makeGrade6VolumeWeek(opts){
 const r=rng(hash("g6volume|"+String(opts.seed||1))),out=[],a=int(r,3,9),b=int(r,2,7),h=int(r,2,6);
 function add(prompt,correct,wrong,skill,reason){
  const good=String(correct),alt=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let i=1;alt.length<3;i++){const extra=String(Number(correct)+11*i);if(extra!==good&&!alt.includes(extra))alt.push(extra);}
  out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 13 volume",skill,rationale:reason}),r));
 }
 const vol=a*b*h;
 add("A rectangular prism measures "+a+" cm by "+b+" cm by "+h+" cm. What is its volume in cm³?",vol,[a*b+a*h+b*h,2*(a*b+a*h+b*h),vol+h],"whole-number volume","Multiply length, width and height.");
 add("A rectangular prism measures 1/2 m by "+(2*a)+" m by "+b+" m. Find its volume in m³.",a*b,[2*a*b,a+b,2*a+b],"fractional length","One-half of an even whole-number length gives an integer product.");
 add("A rectangular prism has volume "+vol+" cm³, length "+a+" cm, and width "+b+" cm. What is its height in cm?",h,[a+b,a*h,b*h],"unknown dimension","Divide volume by base area.");
 const other=int(r,2,5),sum=vol+other*2*3;
 add("Two NONOVERLAPPING prisms have dimensions "+a+"×"+b+"×"+h+" cm and "+other+"×2×3 cm. What is their combined volume in cm³?",sum,[vol,vol*other*2*3,sum+6],"composite volume","Add the volumes because the prisms do not overlap.");
 add("A prism's base area is "+(a*b)+" cm² and its height is "+h+" cm. What is its volume in cm³?",vol,[a*b,2*a*b,vol+b],"base area times height","Volume equals base area times perpendicular height.");
 add("What units measure the VOLUME of a prism with edges given in centimeters?","cm³",["cm","cm²","meters per second"],"cubic units","Volume is measured in cubic units, not surface-area units.");
 return shuffle(r,out);
}


function makeGrade6MatterMathWeek(opts){
 const r=rng(hash("g6matter|"+String(opts.seed||1))),out=[],rate=int(r,2,8),volume=int(r,2,9),other=int(r,2,8);
 function add(prompt,correct,wrong,skill,reason){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let i=1;alts.length<3;i++){const candidate=Number.isFinite(Number(correct))?String(Number(correct)+i*13):"Different answer "+i;if(candidate!==good&&!alts.includes(candidate))alts.push(candidate)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 14 matter measurement",skill,rationale:reason}),r));
 }
 add("A fictional sample has mass "+(rate*volume)+" g and volume "+volume+" cm³. What is its mass-per-volume unit rate in g/cm³?",rate,[rate*volume,rate+volume,volume],"unit rates","Divide mass by volume, not the reverse.");
 add("At constant "+rate+" g/cm³, what is the modeled mass of "+volume+" cm³ in grams?",rate*volume,[rate+volume,rate*volume+rate,volume],"ratio tables","Multiply the unit rate by the volume.");
 add("For the model mass = "+rate+" × volume, what ordered pair is plotted for volume "+volume+" cm³?","("+volume+", "+(rate*volume)+")",["("+(rate*volume)+", "+volume+")","("+volume+", "+rate+")","("+rate+", "+volume+")"],"graphing","Volume is the horizontal coordinate, mass vertical.");
 add("Sample A is "+(rate*volume)+" g in "+volume+" cm³; sample B is "+(other*(volume+1))+" g in "+(volume+1)+" cm³. Which unit rate is larger?",rate===other?"Equal":rate>other?"A":"B",rate===other?["A","B","Cannot compare"]:["Equal",rate>other?"B":"A","Cannot compare"],"comparing rates","Compute each mass divided by its corresponding volume.");
 add("Which measurement unit is mass divided by volume when mass is in grams and volume in cm³?","g/cm³",["g","cm³","cm²"],"measurement units","Preserve both units as a quotient.");
 add("For constant rate "+rate+" g/cm³, mass = "+(rate*volume)+" g. What volume in cm³ does this represent?",volume,[rate*volume,rate+volume,volume+1],"inverse unit rates","Divide mass by the unit rate.");
 return shuffle(r,out);
}


function makeGrade6ThermalMathWeek(opts){
 const r=rng(hash("g6thermal|"+String(opts.seed||1))),out=[],start=-int(r,2,9),rise=int(r,4,12),duration=int(r,2,8),plateau=int(r,-2,8);
 function add(prompt,correct,wrong,skill,rationale){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let i=1;alts.length<3;i++){const candidate=Number.isFinite(Number(correct))?String(Number(correct)+i*11):"Other interpretation "+i;if(candidate!==good&&!alts.includes(candidate))alts.push(candidate)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 15 temperature graphs",skill,rationale}),r));
 }
 const end=start+rise;
 add("A temperature changes from "+start+"°C to "+end+"°C. What is its signed change in °C?",rise,[-rise,end,start],"temperature difference","Final temperature minus initial temperature.");
 add("A temperature moves from "+end+"°C back to "+start+"°C. What is the signed change in °C?",-rise,[rise,start,end],"negative change","Final temperature minus initial temperature can be negative.");
 const rate=int(r,2,6),change=rate*duration;
 add("The temperature rises "+change+"°C in "+duration+" minutes. What is its average rise in °C per minute?",rate,[change,rate+duration,duration],"average rate","Divide temperature difference by elapsed minutes.");
 add("On a graph with time on x and temperature on y, which ordered pair shows "+end+"°C at minute "+duration+"?","("+duration+", "+end+")",["("+end+", "+duration+")","("+duration+", "+start+")","("+start+", "+duration+")"],"coordinate graph","Time is horizontal and temperature is vertical.");
 add("A temperature graph records "+plateau+"°C at minutes 4 and 6. What is its average rate over that interval?","0°C/min",["2°C/min",plateau+"°C/min","Cannot calculate"],"plateau rate","Unchanged temperature divided by two elapsed minutes is zero.");
 add("A graph has a flat temperature interval. What does the graph alone establish?","The recorded temperature did not change in that interval",["A phase change definitely occurred","The sample was definitely freezing","The material's identity is known"],"data interpretation","The temperature observations alone do not prove a physical mechanism.");
 return shuffle(r,out);
}


function makeGrade6MotionMathWeek(opts){
 const r=rng(hash("g6motion|"+String(opts.seed||1))),out=[],rate=int(r,2,9),time=int(r,3,10),other=int(r,2,8),distance=rate*time;
 function add(prompt,correct,wrong,skill,rationale){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let k=1;alts.length<3;k++){const extra=Number.isFinite(Number(correct))?String(Number(correct)+11*k):skill==="ordered pairs"?"("+(time+k)+", "+distance+")":"Unclear from the measurement "+k;if(extra!==good&&!alts.includes(extra))alts.push(extra)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 16 motion",skill,rationale}),r));
 }
 add("A cart travels "+distance+" m in "+time+" s. What is its average speed in m/s?",rate,[distance,time,rate+1],"average speed","Divide distance by time.");
 add("A cart moves at a modeled steady "+rate+" m/s for "+time+" s. How many meters does it travel?",distance,[rate+time,distance+rate,distance-time],"distance model","Multiply speed by time.");
 add("Solve "+rate+"t = "+distance+" for time t in seconds.",time,[rate,distance,time+rate],"unknown time","Divide both sides by the steady speed.");
 add("Which (time, distance) point represents "+time+" s and "+distance+" m?","("+time+", "+distance+")",["("+distance+", "+time+")","("+time+", "+rate+")","("+rate+", "+time+")"],"ordered pairs","Time is the x-coordinate; distance is the y-coordinate.");
 const secondTime=time+1,secondDistance=other*secondTime;
 add("Cart A travels "+distance+" m in "+time+" s. Cart B travels "+secondDistance+" m in "+secondTime+" s. Which has the greater average speed?",rate===other?"Equal":rate>other?"A":"B",rate===other?["A","B","Cannot compare"]:["Equal",rate>other?"B":"A","Cannot compare"],"compare average speeds","Divide each distance by its own time.");
 add("What units describe distance divided by time, with meters and seconds?","m/s",["m","m²","s/m"],"rate units","A speed rate is distance per unit time.");
 return shuffle(r,out);
}


function makeGrade6PortfolioWeek(opts){
 const r=rng(hash("g6portfolio|"+String(opts.seed||1))),out=[],a=int(r,2,8),b=int(r,2,8),h=int(r,2,7),factor=int(r,2,6);
 function add(prompt,correct,wrong,skill,rationale){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let k=1;alts.length<3;k++){const extra=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Not equivalent "+k;if(extra!==good&&!alts.includes(extra))alts.push(extra)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 17 cumulative portfolio",skill,rationale}),r));
 }
 add("Complete the equivalent ratio "+a+":"+b+" = "+(a*factor)+": ?",b*factor,[b+factor,a*factor,b*factor+1],"ratio evidence","Scale both terms of a ratio by the same factor.");
 add("Solve x - "+a+" = "+b+".",a+b,[b-a,b,a],"equation defense","Add the same value to both sides and check.");
 add("Find the area of a triangle with base "+(2*a)+" cm and perpendicular height "+b+" cm in cm².",a*b,[2*a*b,a+b,a*b+2],"area units","Multiply base and perpendicular height and divide by two.");
 const v=a*b*h,sa=2*(a*b+a*h+b*h);
 add("Find the volume in cm³ of a rectangular prism "+a+" by "+b+" by "+h+" cm.",v,[a*b+h,sa,v+h],"volume evidence","Multiply the three edge lengths; report cubic units.");
 add("Find the total surface area in cm² of a CLOSED prism "+a+" by "+b+" by "+h+" cm.",sa,[v,a*b+a*h+b*h,sa+a*b],"surface area evidence","Double the sum of the three different face areas.");
 const m=int(r,2,8),d=int(r,1,6);
 add("What is the median of the ordered values "+[m,m+d,m+d,m+2*d,m+3*d].join(", ")+"?",m+d,[m,m+2*d,m+3*d],"statistics defense","The middle of five ordered observations is the third.");
 return shuffle(r,out);
}


function makeGrade6WaveMathWeek(opts){
 const r=rng(hash("g6waves|"+String(opts.seed||1))),out=[],amp=int(r,2,9),pulses=int(r,3,8),seconds=int(r,3,9),rate=int(r,2,8);
 function add(prompt,correct,wrong,skill,rationale){
   const good=String(correct),alt=[...new Set(wrong.map(String).filter(x=>x!==good))];
   for(let k=1;alt.length<3;k++){const candidate=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Other unsupported inference "+k;if(candidate!==good&&!alt.includes(candidate))alt.push(candidate)}
   out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 18 waves data",skill,rationale}),r));
 }
 add("A simulated graph has minimum −"+amp+" and maximum +"+amp+". What is its numerical range?",2*amp,[amp,amp*amp,2*amp+1],"range","Maximum minus minimum includes the negative distance.");
 add("A model shows "+(rate*seconds)+" pulses in "+seconds+" seconds. What is the average count rate in pulses per second?",rate,[rate*seconds,seconds,rate+seconds],"pulse unit rate","Divide the pulse count by elapsed seconds.");
 add("At a steady modeled "+rate+" pulses per second, how many pulses occur in "+seconds+" seconds?",rate*seconds,[rate+seconds,rate*seconds+rate,seconds],"rate prediction","Multiply rate by elapsed time.");
 add("Which point represents sample index "+seconds+" and displacement −"+amp+"?", "("+seconds+", −"+amp+")",["(−"+amp+", "+seconds+")","("+seconds+", "+amp+")","("+amp+", "+seconds+")"],"signed plotting","Put sample time on x and signed displacement on y.");
 const low=int(r,2,9),step=int(r,1,5);
 add("Find the median of the ordered signal readings "+[low,low+step,low+step,low+2*step,low+4*step].join(", ")+".",low+step,[low,low+2*step,low+4*step],"statistics","The third of five ordered readings is the median.");
 add("What does a repeating numeric pattern alone establish?","The recorded numbers repeat in the observed sample",["The exact sound source is identified","The measured signal is necessarily a musical note","The waveform must come from a particular material"],"model limitation","A numerical pattern is not enough to identify its physical cause.");
 return shuffle(r,out);
}


function makeGrade6MidtermMath(opts){
 const seed=String((opts||{}).seed||1),r=rng(hash("g6midterm|"+seed));
 const makers={7:makeGrade6CoordinateWeek,8:makeGrade6ExpressionsWeek,9:makeGrade6EquationsWeek,10:makeGrade6InequalitiesWeek,11:makeGrade6StatisticsWeek,12:makeGrade6GeometryWeek,13:makeGrade6VolumeWeek,14:makeGrade6MatterMathWeek,15:makeGrade6ThermalMathWeek,16:makeGrade6MotionMathWeek,17:makeGrade6PortfolioWeek,18:makeGrade6WaveMathWeek};
 const result=[];
 for(let week=1;week<=18;week++){
  const drawSeed=seed+"|week-"+week;
  const pool=week<=6?makeGrade6MathWeek({week,seed:drawSeed,count:6}):makers[week]({seed:drawSeed});
  if(pool.length!==6||pool.some(q=>!validateQuestion(q)))return[];
  const selected=pool[Math.floor(r()*pool.length)];
  result.push(Object.assign({},selected,{focus:"midterm review · week "+week,sourceWeek:week}));
 }
 if(new Set(result.map(q=>q.prompt)).size!==18)return[];
 return shuffle(r,result);
}


function makeGrade6VisualRatioWeek(opts){
 const r=rng(hash("g6visual|"+String(opts.seed||1))),out=[],a=int(r,3,9),b=int(r,2,8),scale=int(r,2,6),seconds=int(r,3,9),fps=int(r,4,12);
 function add(prompt,correct,wrong,skill,reason){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let i=1;alts.length<3;i++){const x=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Different comparison "+i;if(x!==good&&!alts.includes(x))alts.push(x)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 19 media ratios",skill,rationale:reason}),r));
 }
 add("An image has "+(a*scale)+" light and "+(b*scale)+" dark pixels. Which ratio gives light to dark in simplest terms?",a+":"+b,[a+":"+(a+b),b+":"+a,(a*scale)+":"+b],"part-to-part ratios","Compare light to dark and divide both terms by the same scale factor.");
 add("A model is "+a+" cm wide and enlarged by scale factor "+scale+". How wide is the image in cm?",a*scale,[a+scale,a*scale+scale,a],"scale factor","Multiply the original width by the scale factor.");
 add("A display presents "+(fps*seconds)+" frames in "+seconds+" seconds. How many frames per second on average?",fps,[fps*seconds,seconds,fps+seconds],"unit rate","Divide total frames by time.");
 add("At "+fps+" frames per second for "+(seconds+2)+" seconds, how many frames are expected?",fps*(seconds+2),[fps+seconds+2,fps*seconds,seconds+2],"rate model","Multiply unit rate and elapsed time.");
 const x=int(r,2,8);
 add("An illustration reports "+(3*x)+" successes among "+(4*x)+" responses. What percent is successful?","75%",["25%","60%","80%"],"part-to-whole percent","Three fourths equals 75 percent.");
 add("Two posters show 15 of 20 and 18 of 30. Which has the larger proportion?","15 of 20",["18 of 30","Both equal","Cannot calculate proportions"],"visual claims","Compare 75 percent against 60 percent, not raw counts.");
 return shuffle(r,out);
}


function makeGrade6CellPercentWeek(opts){
 const r=rng(hash("g6cells|"+String(opts.seed||1))),out=[],n=int(r,2,9),whole=20*n,rate=int(r,2,8)*10;
 function add(prompt,correct,wrong,skill,rationale){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let k=1;alts.length<3;k++){const x=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Another percentage "+k;if(x!==good&&!alts.includes(x))alts.push(x)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 20 cell model percentages",skill,rationale}),r));
 }
 add("In a model, "+(n*5)+" of "+whole+" objects are highlighted. What percent is this?","25%",["20%","40%","75%"],"fraction to percent","Five of every twenty equals one quarter, or 25%.");
 add("What is "+rate+"% of "+whole+" model cells?",rate*whole/100,[whole/rate,rate+whole,rate*whole/100+n],"percent of whole","Multiply the whole by the percent divided by 100.");
 add("A simulated sample has "+(n*3)+" objects of interest among "+(n*10)+" total. What is the percentage?","30%",["3%","70%","10%"],"proportional fraction","Three tenths equals thirty percent.");
 add("Two samples have "+(n*2)+" of "+(n*8)+" and "+(n*3)+" of "+(n*12)+" highlighted. How do the percentages compare?","They are equal at 25%",["The first is larger","The second is larger","Neither percentage can be calculated"],"compare samples","Both simplify to one fourth.");
 const prediction=rate*2;
 add("A 10×10 model grid represents 100 cells. If "+rate+"% are marked, how many are marked?",rate,[100-rate,rate+10,rate/10],"percent grid","A 100-cell grid maps percent directly to cells.");
 add("A fictional image sample has 25% highlighted objects. What can it support?","25% of that observed sample was highlighted",["Exactly 25% of every future sample must be highlighted","The model proves every living cell is identical","No other sample could differ"],"sampling limits","A sample percentage is an observation, not a guarantee for a population.");
 return shuffle(r,out);
}


function makeGrade6EcosystemFractionsWeek(opts){
 const r=rng(hash("g6eco21|"+String(opts.seed||1))),out=[],n=int(r,2,9),d=int(r,2,9),part=int(r,2,8);
 function add(prompt,correct,wrong,skill,reason){
  const good=String(correct),alts=[...new Set(wrong.map(String).filter(x=>x!==good))];
  for(let i=1;alts.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Other fraction "+i;if(v!==good&&!alts.includes(v))alts.push(v)}
  out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 21 divide fractions",skill,rationale:reason}),r));
 }
 add("A model has "+n+" liters and each portion holds 1/"+d+" liter. How many portions fit?",n*d,[n/d,n+d,n*d+d],"whole by unit fraction","Multiply the whole by the denominator of the unit fraction.");
 add("How many 1/"+d+"-liter portions fit in "+part+"/"+d+" liter?",part,[part*d,d,part+d],"fraction by unit fraction","The numerator counts the unit fractions.");
 add("Compute ("+n+"/"+d+") ÷ (1/"+d+").",n,[n*d,n/d,d],"fraction division","Multiply by the reciprocal of the divisor.");
 add("A quantity is "+n+"/"+d+" kilograms and each portion is 1/"+(2*d)+" kilogram. How many portions fit?",2*n,[n,n*d,2*d],"fraction by fraction","Multiply by the reciprocal; the denominators cancel.");
 const total=n*d,portion=d;
 add("There are "+total+" units split into groups of "+portion+". How many complete groups?",n,[total,total+portion,portion],"quotient meaning","Divide the total by the size of one group.");
 add("A division calculation gives 3⅓ container capacities. How many FULL containers can be filled?","3",["4","1","10"],"interpret quotient","A fractional container capacity is not a fourth full container.");
 return shuffle(r,out);
}


function makeGrade6EarthRationalWeek(opts){
 const r=rng(hash("g6earth22|"+String(opts.seed||1))),out=[],a=int(r,2,9),b=int(r,2,9),d=int(r,2,8);
 function add(prompt,correct,wrong,skill,rationale){const good=String(correct),alt=[...new Set(wrong.map(String).filter(x=>x!==good))];for(let k=1;alt.length<3;k++){const x=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Other signed quantity "+k;if(x!==good&&!alt.includes(x))alt.push(x)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 22 signed Earth data",skill,rationale}),r));}
 add("What is the distance on a number line from −"+a+" to +"+b+" meters?",a+b,[a-b,a*b,b],"distance between signs","Subtract the negative endpoint: positive minus negative.");
 add("A temperature changes from +"+a+"°C to −"+b+"°C. What is the signed change in °C?",-(a+b),[a+b,a-b,-b],"signed change","Final temperature minus initial temperature.");
 add("Evaluate −"+a+" + "+(a+b)+".",b,[a,a+b,-b],"integer sum","Move right on a number line.");
 add("Compute −"+d+"/4 + "+d+"/2. What is the result?",d+"/4",["−"+d+"/4",d+"/2","−"+d+"/2"],"fractional rational numbers","Convert halves to fourths before adding.");
 add("Four simulated rainfall deviations are −"+a+", +"+b+", +"+a+", −"+b+" millimeters. What is their mean deviation?","0",["1",a+b,4],"mean deviations","The four signed deviations sum to zero.");
 add("Which statement is justified by a rainfall departure of −"+a+" mm?","Rainfall is "+a+" mm below the stated baseline",["Actual rainfall was negative","Rainfall was zero everywhere","All stations had the same departure"],"interpreting signed units","A negative departure is relative to a baseline.");
 return shuffle(r,out);
}


function makeGrade6WeatherCoordinatesWeek(opts){
 const r=rng(hash("g6weather23|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,8),d=int(r,2,7);
 function add(prompt,correct,wrongs,skill,rationale){
  const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];
  for(let k=1;alt.length<3;k++){const candidate=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Another location "+k;if(candidate!==good&&!alt.includes(candidate))alt.push(candidate)}
  out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 23 weather coordinates",skill,rationale}),r));
 }
 add("Which quadrant contains (−"+a+", +"+b+")?","II",["I","III","IV"],"quadrant signs","Negative x and positive y are in Quadrant II.");
 add("What is the horizontal grid distance from (−"+a+", "+d+") to (+"+b+", "+d+")?",a+b,[Math.abs(a-b),a,b],"horizontal distance","Subtract the left x-coordinate from the right x-coordinate.");
 add("What is the vertical grid distance from ("+d+", −"+a+") to ("+d+", +"+b+")?",a+b,[Math.abs(a-b),a,b],"vertical distance","The x-values agree; subtract vertical endpoints.");
 add("Reflect ("+a+", −"+b+") across the y-axis.","(−"+a+", −"+b+")",["("+a+", "+b+")","(−"+a+", "+b+")","("+b+", −"+a+")"],"y-axis reflection","Change x sign and keep y.");
 add("Reflect (−"+a+", "+b+") across the x-axis.","(−"+a+", −"+b+")",["("+a+", +"+b+")","("+a+", −"+b+")","(−"+b+", +"+a+")"],"x-axis reflection","Change y sign and keep x.");
 add("Three fictional weather stations share the same y-coordinate. What does that establish?","They share a horizontal position line on this map",["They have identical temperatures","They have identical rainfall","They experience the same climate"],"spatial evidence","A coordinate location does not provide weather measurements.");
 return shuffle(r,out);
}


function makeGrade6RiverExpressionsWeek(opts){
 const r=rng(hash("g6river24|"+String((opts||{}).seed||1))),out=[],a=int(r,2,9),b=int(r,2,9),n=int(r,2,8);
 function add(prompt,correct,wrongs,skill,rationale){
  const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];
  for(let k=1;alt.length<3;k++){const x=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Another expression "+k;if(x!==good&&!alt.includes(x))alt.push(x)}
  out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 24 river settlement expressions",skill,rationale}),r));
 }
 add("A fictional settlement stores "+a+" baskets per family and "+b+" shared baskets. Which expression represents f families?",a+"f + "+b,[a+" + "+b+"f",a+"f × "+b,b+"f + "+a],"verbal to expression","Multiply the variable family count by baskets per family and add the constant.");
 add("Evaluate "+a+"x + "+b+" when x = "+n+".",a*n+b,[a+n+b,a*n,b*n+a],"substitution","Substitute n for x and perform multiplication first.");
 add("Expand "+a+"(y + "+b+").",a+"y + "+(a*b),[a+"y + "+b,(a+b)+"y",a+"y × "+b],"distributive property","Multiply both terms in the parentheses by the outer factor.");
 add("Simplify "+a+"m + "+b+"m + "+n+".",(a+b)+"m + "+n,[a+"m + "+(b+n),(a+b+n)+"m",(a*b)+"m + "+n],"combine like terms","Combine variable terms with identical letters, keeping the constant separate.");
 add("Simplify "+(a+b)+"p − "+b+"p + "+n+".",a+"p + "+n,[b+"p + "+n,a+"p − "+n,(a+b)+"p + "+n],"subtract like terms","Subtract coefficients of like terms.");
 add("Two fictional resource models agree at one trip count. What can we conclude?","They have equal values at that input only",["They are equivalent for all input values","They describe historically verified resource records","Their coefficients must be identical"],"interpret models","One matching value does not prove two expressions are equivalent.");
 return shuffle(r,out);
}


function makeGrade6CultureEquationsWeek(opts){
 const r=rng(hash("g6culture25|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,9),x=int(r,2,9);
 function add(prompt,correct,wrongs,skill,rationale){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(z=>z!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Other rule "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 25 fictional community rules",skill,rationale}),r));}
 add("Solve "+a+"x + "+b+" = "+(a*x+b)+".",x,[x+a,x+b,a*x+b],"one-variable equations","Subtract the constant and divide by the coefficient.");
 add("Solve "+a+"y − "+b+" = "+(a*x-b)+".",x,[x+b,x+a,a*x],"inverse operations","Add the constant then divide by the coefficient.");
 add("Solve "+a+"n + "+b+" ≤ "+(a*x+b)+".","n ≤ "+x,["n ≥ "+x,"n < "+x,"n = "+x],"positive inequality","Divide by a positive coefficient; retain the inequality direction.");
 add("Solve −"+a+"z ≥ "+(a*x)+".","z ≤ −"+x,["z ≥ −"+x,"z ≤ "+x,"z = −"+x],"negative multiplier","Dividing by a negative reverses the inequality.");
 add("A fictional hall has at most "+(a*x+b)+" seats; "+b+" are reserved. Which guest limit follows?","g ≤ "+(a*x),["g ≥ "+(a*x),"g < "+(a*x),"g ≤ "+(a*x+b)],"constraints","Subtract reserved seats from total capacity.");
 add("Which statement describes the solution to g ≤ "+x+" for nonnegative whole-number guest counts?","0 through "+x+" guests inclusive",["Only "+x+" guests","More than "+x+" guests","All negative numbers only"],"solution set","At most includes the boundary and all smaller feasible values.");
 return shuffle(r,out);
}


function makeGrade6ClassicalGeometryWeek(opts){
 const r=rng(hash("g6classical26|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,7),h=int(r,2,6);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alts=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let i=1;alts.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Different measure "+i;if(v!==good&&!alts.includes(v))alts.push(v)}out.push(finalize(makeQuestion(prompt,good,alts.slice(0,3),{subject:"mathematics",grade:6,focus:"week 26 surface area and volume",skill,rationale:reason}),r));}
 add("A model hall has floor length "+a+" m and width "+b+" m. What is its floor area in m²?",a*b,[a+b,2*(a+b),a*b*h],"rectangle area","Multiply length and width; report square meters.");
 add("A rectangular-prism model is "+a+" m by "+b+" m by "+h+" m. What is its volume in m³?",a*b*h,[a*b,2*(a*b+a*h+b*h),a+b+h],"prism volume","Multiply all three dimensions.");
 add("A CLOSED box has dimensions "+a+" cm × "+b+" cm × "+h+" cm. Its surface area in cm² is:",2*(a*b+a*h+b*h),[a*b*h,a*b+a*h+b*h,2*(a+b+h)],"surface area","Add areas of all six faces, counting each opposite pair twice.");
 add("A RIGHT TRIANGLE has perpendicular base "+(2*a)+" cm and height "+b+" cm. What is its area in cm²?",a*b,[2*a*b,2*a+b,a+b],"triangle area","Triangle area = base × height ÷ 2.");
 add("A triangular-prism model has triangle base area "+(a*b)+" cm² and length "+h+" cm. What is its volume in cm³?",a*b*h,[a*b,a*b+h,2*a*b*h],"triangular prism","Multiply triangle base area by prism length.");
 add("Which statement is accurate for a rectangular container with its top REMOVED?","Its surface area excludes the top face, but volume formula is unchanged",["Its volume must equal its surface area","Its surface area includes both top faces","Its volume is always zero"],"open-top model","Surface area counts exposed faces; volume describes capacity.");
 return shuffle(r,out);
}


function makeGrade6TradeStatisticsWeek(opts){
 const r=rng(hash("g6trade27|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,8),d=int(r,1,5);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let k=1;alt.length<3;k++){let v=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Different interpretation "+k;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 27 simulated trade data",skill,rationale:reason}),r));}
 add("Fictional travel times are "+(a-1)+", "+a+", "+(a+1)+" days. What is their mean?",a,[a+1,a-1,3*a],"mean","The symmetric values have mean their middle value.");
 add("Sorted fictional quantities are "+a+", "+a+", "+(a+b)+", "+(a+b+2)+", "+(a+b+4)+". What is their median?",a+b,[a,a+b+2,a+b+4],"median","For five ordered values, the third is the median.");
 add("Data are "+a+", "+a+", "+b+", "+(a+b+3)+" units. What is the mode?",a,[b,a+b+3,a+b],"mode","The repeated value is the mode.");
 add("The lowest travel time is "+a+" days and highest is "+(a+b)+" days. What is the range?",b,[a,a+b,2*b],"range","Range is maximum minus minimum.");
 add("Two sets are A: "+a+", "+(a+1)+", "+(a+2)+" and B: "+(a-2)+", "+(a+1)+", "+(a+4)+". Which range is larger?","B",["A","Both are equal","Neither has a range"],"compare spread","Set B has a wider spread despite the same center.");
 add("Two hypothetical route samples have equal means but different ranges. Which conclusion is justified?","Their averages agree but their variability differs",["Every travel time is equal","Both have identical distributions","The samples prove historical travel patterns"],"interpret data","Means alone do not capture spread or prove population behavior.");
 return shuffle(r,out);
}


function makeGrade6LanguageRatioWeek(opts){
 const r=rng(hash("g6language28|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,9),k=int(r,2,6),minutes=int(r,3,9),speed=int(r,4,12);
 function add(prompt,correct,wrongs,skill,rationale){
  const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];
  for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Different comparison "+i;if(v!==good&&!alt.includes(v))alt.push(v)}
  out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 28 fictional communication ratios",skill,rationale}),r));
 }
 add("A fictional project includes "+a*k+" illustrated and "+b*k+" text-only cards. What is illustrated to text-only in simplest terms?",(function(){const gcd=(x,y)=>y?gcd(y,x%y):x;const z=gcd(a,b);return(a/z)+":"+(b/z)})(),[a+":"+(a+b),b+":"+a,(a*k)+":"+b],"simplify ratio","Divide both counts by their greatest common factor.");
 add("A model has "+a+" illustrated and "+b+" text-only cards. Which is illustrated to TOTAL?",a+":"+(a+b),[a+":"+b,b+":"+(a+b),(a+b)+":"+a],"part to whole","The whole includes both categories.");
 add("Complete the equivalent ratio "+a+":"+b+" = "+a*k+":?",b*k,[b+k,a*k,b],"equivalent ratios","Multiply both parts by the same factor.");
 add("A fictional team labels "+speed*minutes+" cards in "+minutes+" minutes. What is its average cards per minute?",speed,[speed*minutes,minutes,speed+minutes],"unit rate","Divide total cards by minutes.");
 add("A fictional team maintains "+speed+" cards per minute for "+(minutes+2)+" minutes. How many cards is that?",speed*(minutes+2),[speed+minutes+2,speed*minutes,minutes+2],"proportional rate","Multiply the unit rate by elapsed time.");
 add("Practice A has 15/20 accurate labels; Practice B has 18/30. Which has a higher accuracy proportion?","Practice A: 75%",["Practice B: 60%","Both equal","Counts alone prove Practice B"],"fair percentage comparisons","Compare 75 percent with 60 percent instead of only raw successes.");
 return shuffle(r,out);
}


function makeGrade6ResearchPercentWeek(opts){
 const r=rng(hash("g6research29|"+String((opts||{}).seed||1))),out=[],a=int(r,2,9),b=int(r,2,9),k=int(r,2,7);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Different claim "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 29 research sample percentages",skill,rationale:reason}),r));}
 add("A fictional team reviewed "+(3*a)+" of "+(4*a)+" records. What percentage was reviewed?","75%",["25%","60%","80%"],"fraction to percentage","Three quarters equals 75 percent.");
 add("What is "+(b*10)+"% of "+(a*10)+" fictional notes?",a*b,[a*10+b,a*b*10,b*10],"percent of whole","Multiply the whole by the percent in decimal form.");
 add("Sample A checks 16 of 20 records; B checks 24 of 40. Which has the higher checked proportion?","A: 80%",["B: 60%","Both 60%","B because 24 is larger"],"compare denominators","Compare proportions rather than raw counts.");
 add("A fictional record count rises from "+(4*k)+" to "+(5*k)+". What is the percent increase?","25%",["20%","50%","125%"],"percent increase","The increase is one quarter of the original.");
 add("A fictional report increases from "+(2*a)+" reviewed notes to "+(3*a)+". What is its percentage increase?","50%",["33%","150%","25%"],"relative change","Increase divided by original is one half.");
 add("A sample has 90% of its notes checked. Which claim is justified?","90% of that sample was checked",["Every checked note is accurate","The source must be trustworthy","All research everywhere is 90% correct"],"limits of sample evidence","Checking rates do not verify source validity.");
 return shuffle(r,out);
}


function makeGrade6DebateFractionWeek(opts){
 const r=rng(hash("g6debate30|"+String((opts||{}).seed||1))),out=[],a=int(r,2,9),d=int(r,2,8),n=int(r,2,8);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let i=1;alt.length<3;i++){let v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Other interpretation "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 30 debate fraction division",skill,rationale:reason}),r));}
 add("A fictional discussion has "+a+" minutes; each speaking turn is 1/"+d+" minute. How many whole turns fit?",a*d,[a/d,a+d,a],"whole by unit fraction","Divide by a unit fraction by multiplying by its denominator.");
 add("How many 1/"+d+"-minute turns fit into "+n+"/"+d+" minute?",n,[n*d,d,n+d],"unit fractions","The numerator counts how many equal unit portions are present.");
 add("Evaluate ("+a+"/"+d+") ÷ (1/"+d+").",a,[a*d,d,a/d],"fraction quotient","Multiplying by the divisor's reciprocal cancels the denominator.");
 add("A debate has "+a+"/"+d+" minute available; each speaking segment lasts 1/"+(2*d)+" minute. How many segments fit?",2*a,[a,2*d,a*d],"fraction by fraction","The segment is half of one over d, so twice as many fit.");
 add("A hypothetical allocation has "+(a*d)+" seconds total and each turn lasts "+d+" seconds. How many complete turns fit?",a,[a*d,a+d,d],"units and quotient","Divide the available time by duration per turn.");
 add("The exact quotient is 3⅓ speaking turns. How many COMPLETE turns does this represent?","3",["4","1","10"],"contextual remainder","One third of a turn does not count as a fourth complete turn.");
 return shuffle(r,out);
}


function makeGrade6ArtsRationalWeek(opts){
 const r=rng(hash("g6arts31|"+String((opts||{}).seed||1))),out=[],a=int(r,2,9),b=int(r,2,8),d=int(r,2,7);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let k=1;alt.length<3;k++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Other interpretation "+k;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 31 signed design data",skill,rationale:reason}),r));}
 add("A fictional editing slider starts at −"+a+" and increases by "+(a+b)+". What is its new setting?",b,[a+b,-b,a],"signed addition","Moving to the right by a+b from −a gives b.");
 add("A setting moves from −"+a+" to +"+b+". What is its signed change?",a+b,[a-b,-(a+b),b],"signed change","Final minus initial equals b−(−a).");
 add("What is the number-line distance between −"+a+" and +"+b+"?",a+b,[Math.abs(a-b),a,b],"distance","Distance between a negative and a positive position is their absolute sum.");
 add("Evaluate −"+d+"/4 + "+d+"/2.",d+"/4",["−"+d+"/4",d+"/2","−"+d+"/2"],"signed fractions","Write halves as fourths and combine.");
 add("Four hypothetical adjustments are −"+a+", +"+b+", +"+a+", −"+b+". What is the mean?","0",["1",a+b,4],"mean of signed data","The signed adjustments sum to zero.");
 add("A fictional sound adjustment is −"+a+" relative to zero. What does the negative sign establish?","It is "+a+" units below the defined reference",["Physical sound has negative energy","All sound becomes silent","Every listener hears the same change"],"reference values","A signed setting describes a value relative to a reference.");
 return shuffle(r,out);
}


function makeGrade6WellnessCoordinatesWeek(opts){
 const r=rng(hash("g6wellness32|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,8),d=int(r,2,7);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let k=1;alt.length<3;k++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*k):"Other interpretation "+k;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 32 fictional wellness planning coordinates",skill,rationale:reason}),r));}
 add("Which quadrant contains (−"+a+", +"+b+")?","II",["I","III","IV"],"quadrants","Negative x and positive y means quadrant II.");
 add("A fictional planning grid has points (−"+a+", "+d+") and (+"+b+", "+d+"). Their horizontal distance is:",a+b,[Math.abs(a-b),a,b],"horizontal distance","The equal y-values show horizontal separation; subtract the x coordinates.");
 add("Two points are ("+d+", −"+a+") and ("+d+", +"+b+"). Their vertical distance is:",a+b,[Math.abs(a-b),a,b],"vertical distance","Subtract signed y positions.");
 add("Reflect ("+a+", −"+b+") across the y-axis.","(−"+a+", −"+b+")",["("+a+", +"+b+")","(−"+a+", +"+b+")","("+b+", −"+a+")"],"y-axis reflection","Change x sign only.");
 add("Reflect (−"+a+", +"+b+") across the x-axis.","(−"+a+", −"+b+")",["("+a+", +"+b+")","("+a+", −"+b+")","(−"+b+", +"+a+")"],"x-axis reflection","Change y sign only.");
 add("Two fictional activity-plan locations share a y-coordinate. What is justified?","They lie on the same horizontal grid line",["The people involved have identical health needs","Every activity is equally safe for everyone","All participants have the same identity"],"limits of coordinate models","Positions alone do not establish personal information.");
 return shuffle(r,out);
}


function makeGrade6TechnologyExpressionsWeek(opts){
 const r=rng(hash("g6technology33|"+String((opts||{}).seed||1))),out=[],a=int(r,2,9),b=int(r,2,9),k=int(r,2,8);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(x=>x!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Another expression "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 33 fictional software expressions",skill,rationale:reason}),r));}
 add("A fictional tool takes "+a+" seconds per file plus "+b+" seconds setup. Which expression models n files?",a+"n + "+b,[b+"n + "+a,a+" + "+b+"n",a+"n × "+b],"verbal models","Multiply the number of files by time per file and add the fixed setup cost.");
 add("Evaluate "+a+"x + "+b+" for x = "+k+".",a*k+b,[a+k+b,a*k,b*k+a],"substitution","Substitute the input count, multiply, then add setup.");
 add("Expand "+a+"(x + "+b+").",a+"x + "+a*b,[a+"x + "+b,(a+b)+"x",a+"x × "+b],"distribution","Multiply the factor by both parenthesized terms.");
 add("Simplify "+a+"m + "+b+"m + "+k+".",(a+b)+"m + "+k,[a+"m + "+(b+k),(a+b+k)+"m",a*b+"m + "+k],"like terms","Combine identical variable terms, not the constant.");
 add("Simplify "+(a+b)+"p − "+b+"p + "+k+".",a+"p + "+k,[b+"p + "+k,a+"p − "+k,(a+b)+"p + "+k],"subtract like terms","Subtract coefficients and retain the constant.");
 add("Two hypothetical timing expressions match at one input. What does this prove?","They agree for that input only",["They are equivalent for all inputs","Both tools are accessible and secure","They have the same coefficients"],"model limitations","One observed matching output does not prove algebraic equivalence or usability.");
 return shuffle(r,out);
}


function makeGrade6CapstoneEquationWeek(opts){
 const r=rng(hash("g6capstone34|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,9),x=int(r,2,8);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(z=>z!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Other model "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 34 capstone equations inequalities",skill,rationale:reason}),r));}
 add("Solve "+a+"n + "+b+" = "+(a*x+b)+" for n.",x,[x+b,x+a,a*x+b],"solve equation","Subtract setup cost, then divide by the per-item cost.");
 add("A capstone has "+b+" fixed resource units plus "+a+" per project, budget "+(a*x+b)+". Which condition applies?","n ≤ "+x,["n ≥ "+x,"n < "+x,"n = "+x],"resource inequality","Apply at most and solve the positive-coefficient inequality.");
 add("Solve "+a+"t − "+b+" > "+(a*x-b)+".","t > "+x,["t ≥ "+x,"t < "+x,"t = "+x],"strict inequality","Add b and divide by a positive coefficient.");
 add("Solve −"+a+"y ≥ "+(a*x)+".","y ≤ −"+x,["y ≥ −"+x,"y ≤ "+x,"y = −"+x],"reverse inequality","Divide by a negative coefficient and reverse direction.");
 add("With "+(a*x+b)+" available units, "+b+" for setup and "+a+" per whole model, the maximum number is:",x,[x+1,a*x+b,x-1],"feasible integer domain","Subtract setup and divide by cost per model.");
 add("A formula predicts a feasible capstone budget. Which claim is supported?","The fictional plan satisfies the stated mathematical assumptions",["Actual resource costs have been independently verified","All projects are equally effective","The prototype is guaranteed to succeed"],"model limitations","Mathematical feasibility does not verify empirical assumptions.");
 return shuffle(r,out);
}


function makeGrade6CapstoneGeometryWeek(opts){
 const r=rng(hash("g6capstone35|"+String((opts||{}).seed||1))),out=[],a=int(r,2,8),b=int(r,2,7),h=int(r,2,6);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(v=>v!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Other value "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 35 geometry capstone",skill,rationale:reason}),r));}
 add("A fictional display has length "+a+" cm and width "+b+" cm. Find floor area in cm².",a*b,[a+b,2*(a+b),a*b*h],"rectangle area","Multiply length and width for square centimeters.");
 add("A rectangular model is "+a+" cm by "+b+" cm by "+h+" cm. What is its capacity in cm³?",a*b*h,[a*b,2*(a*b+a*h+b*h),a+b+h],"prism volume","Multiply all three dimensions.");
 add("A CLOSED prism is "+a+" cm by "+b+" cm by "+h+" cm. Find surface area in cm².",2*(a*b+a*h+b*h),[a*b*h,a*b+a*h+b*h,2*(a+b+h)],"six-face surface area","Count all three opposite pairs of rectangular faces.");
 add("A triangular base measures "+(2*a)+" cm by "+b+" cm perpendicular height. Its area in cm² is:",a*b,[2*a*b,2*a+b,a+b],"triangle area","Triangle area is base times height divided by two.");
 add("A triangular prism has triangular base area "+(a*b)+" cm² and length "+h+" cm. Find volume in cm³.",a*b*h,[a*b,2*a*b*h,a*b+h],"triangular prism","Volume is area of base multiplied by length.");
 add("For a rectangular prototype with the top removed, which model statement is true?","Exclude the top face from surface area, but use the same volume formula",["Volume equals area numerically","The top still counts as a physical face","Its geometric capacity becomes zero"],"open-top models","An absent cover changes surface material but not geometric capacity.");
 return shuffle(r,out);
}


function makeGrade6ReadinessStatisticsWeek(opts){
 const r=rng(hash("g6readiness36|"+String((opts||{}).seed||1))),out=[],a=int(r,3,10),b=int(r,2,7);
 function add(prompt,correct,wrongs,skill,reason){const good=String(correct),alt=[...new Set(wrongs.map(String).filter(v=>v!==good))];for(let i=1;alt.length<3;i++){const v=Number.isFinite(Number(correct))?String(Number(correct)+11*i):"Different interpretation "+i;if(v!==good&&!alt.includes(v))alt.push(v)}out.push(finalize(makeQuestion(prompt,good,alt.slice(0,3),{subject:"mathematics",grade:6,focus:"week 36 statistics and Grade 7 readiness",skill,rationale:reason}),r));}
 add("A fictional practice set is "+(a-2)+", "+a+", "+(a+2)+". What is its mean?",a,[a+2,a-2,3*a],"mean","The three equally spaced scores average to their center.");
 add("A sorted data set is "+a+", "+(a+1)+", "+(a+2)+", "+(a+3)+", "+(a+4)+". What is its median?",a+2,[a,a+1,a+4],"median","The middle (third) value of five observations is the median.");
 add("Data are "+a+", "+a+", "+(a+b)+", "+(a+b+1)+" and "+(a+b+2)+". What is the mode?",a,[a+b,a+b+1,a+b+2],"mode","The value appearing twice is most frequent.");
 add("A fictional data set runs from "+a+" to "+(a+b)+" minutes. What is its range?",b,[a,a+b,b+1],"range","Maximum minus minimum equals range.");
 add("Data set A is "+(a-1)+", "+a+", "+(a+1)+"; B is "+(a-3)+", "+a+", "+(a+3)+". Which has greater range?","B",["A","They have the same range","Neither has a median"],"comparing spread","B has range 6; A has range 2, although both share a center.");
 add("Two fictional samples have equal means and different ranges. Which claim is justified?","The samples have the same average but different spread",["Their individual values are identical","Everyone is equally ready for the next grade","The samples prove future scores"],"interpret sample limits","A common mean does not prove identical distributions or individual readiness.");
 return shuffle(r,out);
}


/* Grade 6 Week 1: lesson-aligned first-party subject knowledge checks.
   Twelve non-mathematics questions per draw; eight subject halls represented. */
function makeGrade6Week1Subjects(opts){
 const r=rng(hash("g6w1-subjects|"+String((opts||{}).seed||1)));
 const bank=[
 ["language-arts","text evidence","Which evidence best supports the claim that Mina is prepared?","She checks her assignment list.",["She has a red notebook.","The classroom has a window.","Her friend likes maps."],"A specific action from the passage directly supports the claim."],
 ["language-arts","inference","Which statement is an inference rather than a directly reported observation?","Mina probably planned ahead.",["Mina arrived early.","Mina labeled the map symbols.","Mina wrote a question."],"An inference interprets details; the other choices restate events."],
 ["science","matter","Which statement describes a scientific particle model of a gas?","Particles move widely through available space.",["Particles are fixed in a rigid pattern.","Gas has no mass.","All gas particles are visible."],"Gas is matter and particles are mobile and widely spaced."],
 ["science","measurement","Why should a science data table write 100 mL instead of only 100?","The unit tells what was measured.",["Units change the physical quantity.","Units guarantee no errors.","A unit proves a hypothesis."],"A number without its measurement unit is ambiguous."],
 ["social-studies","map orientation","Which map feature explains the meanings of its symbols?","Legend",["Compass direction","Scale bar","Date line"],"A legend or key defines map symbols."],
 ["social-studies","source analysis","Which question best checks whether a historical map is reliable for a purpose?","Who made it, when, and for what purpose?",["Is its paper colorful?","Does it have the most symbols?","Is it the oldest available map?"],"Authorship, date, purpose, and omissions guide source evaluation."],
 ["world-languages","greetings","Which Spanish phrase means My name is Ana?","Me llamo Ana.",["Buenos días.","Mucho gusto.","¿Cómo te llamas?"],"Me llamo introduces one's name; the other phrases greet or ask a name."],
 ["world-languages","culture","Why should a student check the setting before choosing a greeting?","Greetings can vary by context and community.",["Every country uses one greeting.","Words translate exactly every time.","Politeness never changes."],"Language use depends on situation, region, and people."],
 ["arts-music","composition","What is the best description of visual balance?","Distribution of visual weight in a design.",["Using only one color.","Making every line the same length.","Avoiding a focal point."],"Symmetry and asymmetry can both produce balance."],
 ["arts-music","rhythm","What creates rhythm in music and visual art?","Organized repetition and variation.",["Only loudness.","Only straight lines.","Removing repeated patterns."],"Rhythm is built through recurring and varied events."],
 ["health-pe-sel","accessible planning","Which movement plan best supports inclusive participation?","An activity with a safe seated alternative.",["The same intense activity for everyone.","Grading students by body type.","Ignoring discomfort to finish."],"Planning should include safe and accessible options."],
 ["health-pe-sel","self regulation","When assignments feel overwhelming, what is a constructive first step?","Choose a manageable task and ask for support if needed.",["Hide all unfinished work.","Compare scores publicly.","Avoid every trusted adult."],"Manageable actions and support can help organize stress."],
 ["technology-design","keyboard navigation","Which key commonly moves keyboard focus to the next control?","Tab",["Caps Lock","Escape","Print Screen"],"Tab commonly navigates between focusable controls."],
 ["technology-design","file privacy","Which file-naming practice is safest for student work?","Use clear subject names without private passwords.",["Put passwords in public filenames.","Include classmates' addresses.","Post login tokens in a folder name."],"Descriptive filenames must not expose personal credentials."],
 ["integrated-projects","inquiry","Which is the strongest focused project question?","How could a 4 m by 3 m room support quiet study?",["Is all design good?","What is everything about school?","Can any plan solve every problem?"],"A bounded question can be answered with evidence."],
 ["integrated-projects","scale drawing","At 1 cm per 1 m, how long is a 4 m wall on the drawing?","4 cm",["1 cm","8 cm","16 cm"],"The stated scale represents every meter as one centimeter."]
 ];
 const subjectOrder=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const bySubject=subjectOrder.map(subject=>shuffle(r,bank.filter(x=>x[0]===subject)));
 const chosen=bySubject.map(a=>a[0]);
 const extras=shuffle(r,bySubject.map(a=>a[1])).slice(0,4);
 return shuffle(r,chosen.concat(extras).map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 1 Scholar Launch",rationale}),r)));
}


/* Grade 6 Week 2: original lesson-aligned, eight-subject question selection. */
function makeGrade6Week2Subjects(opts){
 const r=rng(hash("g6w2-subjects|"+String((opts||{}).seed||1)));
 const bank=[
 ["language-arts","quotation","Which practice uses a source's exact words responsibly?","Use quotation marks and identify the source.",["Change a few words without citing.","Invent a matching quotation.","Treat an inference as a quotation."],"Quotations preserve the source's words and identify their origin."],
 ["language-arts","paraphrase","What makes a paraphrase different from a quotation?","It restates the source's meaning in new words with attribution.",["It removes the need for attribution.","It reproduces every word exactly.","It adds facts not found in the source."],"A paraphrase restates meaning while retaining attribution."],
 ["science","data","Which heading correctly identifies temperature measurements?","Temperature (°C)",["Temperature","Numbers measured","Degrees of time"],"A measurement table should specify the quantity and its unit."],
 ["science","inference","Two simulated cups warmed by 4 °C and 2 °C. What is supported?","The first cup's recorded increase was greater.",["Sunlight definitely caused both increases.","The first cup has more mass.","All cups warm at the same rate."],"Observed changes support a comparison, not an untested causal explanation."],
 ["social-studies","primary source","Which item is a primary source for a study of a fictional 1910 bridge?","A diary written by a bridge user in 1910.",["A 2026 history summary.","A modern classroom quiz.","A present-day encyclopedia overview."],"A contemporary firsthand diary can serve as a primary source for the event."],
 ["social-studies","perspective","Why compare two accounts of the same historical event?","They can reveal different experiences and omissions.",["The longest account is always correct.","Different accounts must both be false.","Only one person's experience matters."],"Comparison helps identify perspective and limitations."],
 ["world-languages","cognates","Which English and Spanish pair is a close cognate?","animal / animal",["library / librería","embarrassed / embarazada","exit / éxito"],"These two words share form and meaning; the alternatives are false-friend examples."],
 ["world-languages","translation","Why should a learner verify a similar-looking word?","Similar spelling does not guarantee the same meaning.",["Identical spelling always means identical usage.","Every cognate is a false friend.","Context never matters."],"Cognates and false friends require meaning and context checks."],
 ["arts-music","rhythm","What distinguishes rhythm from a steady beat?","Rhythm arranges sounds and rests against a pulse.",["Rhythm is always one unchanging note.","A beat is the pitch of a melody.","Rhythm only exists in drawings."],"Rhythm is an organized pattern over time."],
 ["arts-music","contour","A melody moves low, high, then lower. What describes its contour?","Rising and then falling.",["Always repeating.","Only rising.","No pitch change."],"Contour describes changes in pitch direction."],
 ["health-pe-sel","inclusion","Which activity plan is most inclusive?","A coordinated sequence with seated alternatives.",["One difficult move required of everyone.","Public comparisons of classmates' health.","Ignoring requests to stop."],"Safe movement plans include accessible alternatives."],
 ["health-pe-sel","safety","If a movement causes dizziness, what is the appropriate response?","Stop and seek suitable help from a trusted adult.",["Push through the discomfort.","Increase intensity.","Hide the symptom from everyone."],"Safety takes priority over completing a planned activity."],
 ["technology-design","versions","Why keep a revision history for school work?","To compare changes and recover earlier versions.",["To publish passwords.","To make filenames meaningless.","To erase all original evidence."],"Versions document the development of work."],
 ["technology-design","metadata","Which example is suitable public document metadata?","Subject and creation date without private details.",["A learner's password.","A classmate's home address.","A private login token."],"Useful metadata must not reveal sensitive credentials or personal information."],
 ["integrated-projects","data interpretation","A fictional data series changes from 8 to 3. What is the difference?","A decrease of 5.",["An increase of 5.","A decrease of 11.","No change."],"Subtract 3 from 8 to find a drop of 5."],
 ["integrated-projects","research","Which research question is most testable?","Does a labeled folder system reduce misplaced worksheets?",["Are all folders perfect?","Is organization always good?","Can any plan solve every problem?"],"A focused question defines an observable outcome."]
 ];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const grouped=subjects.map(subject=>shuffle(r,bank.filter(item=>item[0]===subject)));
 const questions=grouped.map(group=>group[0]).concat(shuffle(r,grouped.map(group=>group[1])).slice(0,4));
 return shuffle(r,questions.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 2 Evidence and Ratios",rationale}),r)));
}

global.KhaemenesMiddleQuestionFactory=Object.freeze({
  version:VERSION,
  subjects:SUBJECTS.slice(),
  normalizeSubject,
  makePool,
  makeBalanced,
  makeGrade6Week1Subjects,
  makeGrade6Week2Subjects,
  makeGrade6MathWeek,
  makeGrade6CoordinateWeek,
  makeGrade6ExpressionsWeek,
  makeGrade6EquationsWeek,
  makeGrade6InequalitiesWeek,
  makeGrade6StatisticsWeek,
  makeGrade6GeometryWeek,
  makeGrade6VolumeWeek,
  makeGrade6MatterMathWeek,
  makeGrade6ThermalMathWeek,
  makeGrade6MotionMathWeek,
  makeGrade6PortfolioWeek,
  makeGrade6WaveMathWeek,
  makeGrade6MidtermMath,
  makeGrade6VisualRatioWeek,
  makeGrade6CellPercentWeek,
  makeGrade6EcosystemFractionsWeek,
  makeGrade6EarthRationalWeek,
  makeGrade6WeatherCoordinatesWeek,
  makeGrade6RiverExpressionsWeek,
  makeGrade6CultureEquationsWeek,
  makeGrade6ClassicalGeometryWeek,
  makeGrade6TradeStatisticsWeek,
  makeGrade6LanguageRatioWeek,
  makeGrade6ResearchPercentWeek,
  makeGrade6DebateFractionWeek,
  makeGrade6ArtsRationalWeek,
  makeGrade6WellnessCoordinatesWeek,
  makeGrade6TechnologyExpressionsWeek,
  makeGrade6CapstoneEquationWeek,
  makeGrade6CapstoneGeometryWeek,
  makeGrade6ReadinessStatisticsWeek,
  validateQuestion
});
})(typeof globalThis!=="undefined"?globalThis:window);
