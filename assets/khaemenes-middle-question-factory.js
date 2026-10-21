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


/* Grade 6 Week 3: curriculum-aligned randomized non-mathematics questions. */
function makeGrade6Week3Subjects(opts){
 const r=rng(hash("g6w3-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","main idea","What is a main idea in an informational text?","The central point supported by the details.",["A single unrelated fact.","An unsupported prediction.","Only the longest sentence."],"A main idea connects relevant details."],["language-arts","text evidence","A club traveled 12 km in 3 hours. Which note accurately preserves the evidence?","12 km / 3 h",["3 km / 12 h","12 km / 3 km","The trip was fastest ever."],"Notes should retain figures and units without inventing claims."],["science","rates","A seedling grows from 2 cm to 6 cm over four days. What is its average growth rate?","1 cm/day",["4 cm/day","6 cm/day","2 cm/day"],"Subtract heights then divide by elapsed days."],["science","graphs","Which axis label is appropriate for measuring height over time?","Height (cm)",["Plant happiness","Unlabeled values","Time (cm)"],"Axes must identify quantity and unit."],["social-studies","density","A fictional district has 1,200 residents in 40 km². What is the density?","30 people/km²",["1,160 people/km²","40 people/km²","48,000 people/km²"],"Divide the population by area."],["social-studies","comparison","Why compare rates rather than raw counts when populations differ?","Rates account for different group sizes.",["Raw counts are always incorrect.","Rates establish causes.","Rates need no units."],"A denominator permits fairer comparisons."],["world-languages","frequency","In Spanish, what does por semana mean?","Per week",["At midnight","Yesterday","Before lunch"],"Por semana expresses frequency over a week."],["world-languages","units","Which phrase means kilometers per hour in Spanish?","kilómetros por hora",["kilómetros sin hora","horas por libros","veces por mesa"],"The phrase expresses distance per time."],["arts-music","tempo","At 60 beats per minute, approximately how many beats occur each second?","1",["60","4","120"],"60 beats per 60 seconds equals one beat per second."],["arts-music","beat duration","At 120 BPM, how long do four beats last?","2 seconds",["4 seconds","30 seconds","120 seconds"],"Four beats at two beats per second last two seconds."],["health-pe-sel","pacing","120 fictional steps in 3 minutes equals what rate?","40 steps/min",["360 steps/min","123 steps/min","3 steps/min"],"Steps per minute is total steps divided by minutes."],["health-pe-sel","privacy","Which wellness activity respects student privacy?","Work with fictional pulse data.",["Post classmates' heart rates.","Require disclosure of diagnoses.","Rank students by body characteristics."],"Simulated data avoids unnecessary disclosure of private records."],["technology-design","spreadsheet","If A2 contains distance and B2 time, which formula computes a rate?","=A2/B2",["=A2+B2","=B2-A2","=A2*B2"],"Rate divides distance by time."],["technology-design","data metadata","What should a fictional classroom data chart disclose?","That its observations are simulated.",["Private passwords.","A fabricated claim of real observation.","Nothing about its source."],"Source labels help readers evaluate evidence."],["integrated-projects","unit rate","A route is 18 km in 6 hours. What is its rate?","3 km/h",["12 km/h","24 km/h","108 km/h"],"18 divided by 6 equals 3 kilometers per hour."],["integrated-projects","limits","What can simulated travel data demonstrate reliably?","How to calculate and compare model rates.",["Exactly why real routes differ.","Future actual traffic patterns.","A guaranteed safest route."],"Model data support calculation practice, not untested real-world conclusions."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const grouped=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const draw=grouped.map(g=>g[0]).concat(shuffle(r,grouped.map(g=>g[1])).slice(0,4));
 return shuffle(r,draw.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 3 Unit Rates and Informational Text",rationale}),r)));
}


/* Grade 6 Week 4: eight-subject civic-percent learning bank. */
function makeGrade6Week4Subjects(opts){
 const r=rng(hash("g6w4-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","survey interpretation","30 of 50 people surveyed chose longer library hours. What percentage is that?","60%",["30%","50%","80%"],"30 divided by 50 equals sixty percent of the respondents."],["language-arts","qualified claims","Which statement accurately describes a fictional poll of 50 students?","Thirty of the 50 respondents supported more library hours.",["All students support the idea.","The survey proves it is the best policy.","No students disagreed."],"Careful wording identifies the measured respondents."],["science","composition","A fictional model has 15 blue beads and 5 yellow beads. What percent are blue?","75%",["25%","15%","80%"],"Fifteen of twenty is three quarters or seventy-five percent."],["science","evidence limits","What can a small classroom sample establish?","The percentage within that observed sample.",["What happens everywhere.","The reason every result occurred.","A universal scientific law."],"Sample results alone do not establish universal causes."],["social-studies","survey","A fictional civic poll has 36 yes responses out of 60 total. What percent is yes?","60%",["36%","40%","80%"],"Divide thirty-six by sixty and multiply by one hundred."],["social-studies","minority rights","What is a responsible conclusion when 60% support a proposal?","Consider supporters, opposing views, and missing evidence.",["Ignore everyone who disagrees.","The survey is a binding law.","The decision has no cost."],"Civic reasoning includes fairness and additional evidence."],["world-languages","vocabulary","What does Spanish porcentaje mean in English?","Percentage",["Library","Yesterday","Schedule"],"Porcentaje means percentage."],["world-languages","context","Why identify the respondents in a bilingual preference survey?","To avoid generalizing preferences beyond the sample.",["To prove a culture shares one preference.","To hide the sample size.","To avoid translating the question."],"Survey interpretations must respect context and sample limits."],["arts-music","proportions","20 of 40 fictional survey respondents prefer painting. What percent is that?","50%",["20%","40%","80%"],"Twenty of forty is one half."],["arts-music","visualization","What makes a chart of arts-survey results honest?","Accurate proportions, labels, and sample size.",["Different scales for each category without disclosure.","Omitting unfavorable responses.","Treating opinions as proven facts."],"A trustworthy visualization identifies amounts and source."],["health-pe-sel","goals","Completing 3 of 4 optional planned activities represents what portion?","75%",["25%","50%","100%"],"Three quarters is seventy-five percent of the planned options."],["health-pe-sel","privacy","Which data source is appropriate for introductory wellness-percentage practice?","A clearly labeled fictional preference survey.",["Public diagnoses of classmates.","A list of private medical records.","Unconsented individual measurements."],"Simulated survey data protect learners' privacy."],["technology-design","formulas","Which spreadsheet formula finds a proportion of B2 over total B5?","=B2/$B$5",["=B2+B5","=B5-B2","=B2*B5"],"Dividing a category count by a fixed total gives its proportion."],["technology-design","visual accessibility","What feature improves accessibility of a percentage bar chart?","Readable labels and a text description.",["Color as the only distinction.","Truncated category names.","Tiny unlabelled bars."],"Text alternatives and legible labels communicate quantities."],["integrated-projects","project evidence","12 out of 40 fictional respondents favor more books. What percentage is that?","30%",["12%","40%","70%"],"Twelve divided by forty equals thirty percent."],["integrated-projects","decision limits","Which additional factor matters before acting on a library preference survey?","Cost, accessibility, and who was surveyed.",["Only the tallest bar.","Whether the chart uses bright colors.","Ignoring any dissent."],"A responsible recommendation includes feasibility and fairness."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 4 Percent and Civic Decisions",rationale}),r)));
}


/* Grade 6 Week 5: fraction-and-procedure aligned nonmath assessment. */
function makeGrade6Week5Subjects(opts){
 const r=rng(hash("g6w5-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","sequence","Which instruction is most precise for a fraction-strip model?","Divide the strip into six equal sections.",["Cut some pieces.","Make it look right.","Use several marks."],"Exact counts and equal parts make a procedure reproducible."],["language-arts","revision","What should a student do after a reader cannot repeat written steps?","Revise ambiguous steps and test them again.",["Hide the issue.","Remove all measurements.","Assume the reader is wrong."],"Testing and revision improve procedural clarity."],["science","measurement","How many 1/4 cm segments fit in a 3/4 cm paper strip?","3",["1","4","12"],"Three quarters divided by one quarter equals three."],["science","replication","What belongs in a reproducible measurement procedure?","Materials, units, steps, and recording method.",["Only a conclusion.","Unexplained guesses.","Missing measurement units."],"Repeatable procedures identify materials, method and units."],["social-studies","resource division","A fictional village reserves 1/4 of 12 baskets. How many baskets is that?","3",["2","4","8"],"One quarter of twelve is three."],["social-studies","historical sources","How should a fictional village distribution account be labeled?","As a classroom simulation, not an authentic historical record.",["As newly discovered primary evidence.","As proof all villages acted alike.","As a verified government source."],"Invented scenarios must not be represented as historical sources."],["world-languages","sequence","What is the English meaning of Spanish primero?","First",["Finally","Half","Never"],"Primero indicates an initial step."],["world-languages","quantities","What does Spanish un cuarto describe in a basic fraction lesson?","One quarter",["One whole","Three quarters","One half"],"Un cuarto is one fourth in this context."],["arts-music","rhythms","In common four-beat notation, how many quarter-note beats do two half notes fill?","4",["1","2","8"],"Each half note lasts two quarter-note beats."],["arts-music","pattern","Which is a valid way to show 3/4 of a four-panel poster?","Mark three of four equal panels.",["Mark three of ten panels.","Mark one of four panels.","Mark four of three panels."],"Three of four equal sections represents three quarters."],["health-pe-sel","time","One quarter of a 12-minute optional activity plan is how long?","3 minutes",["2 minutes","4 minutes","6 minutes"],"Twelve divided by four is three."],["health-pe-sel","safety","What belongs in inclusive activity instructions?","Safe modifications and optional rest.",["Mandatory participation despite pain.","Public medical disclosures.","One difficulty for every learner."],"Access and safety are essential to activity planning."],["technology-design","algorithm","Which quality makes an algorithm easier to test?","Clearly defined inputs, steps, and expected outputs.",["Unspecified input.","Random steps without labels.","Removing error checks."],"Clear input-output descriptions support debugging."],["technology-design","fraction debugging","How many 1/6 units fit in 2/3 of a whole?","4",["2","3","6"],"Two thirds equals four sixths."],["integrated-projects","fraction modeling","What is 2/3 ÷ 1/6?","4",["2","3","9"],"Four sixth-sized units fit into two thirds."],["integrated-projects","evidence","What best shows an original fraction model is repeatable?","A labeled diagram, ordered procedure, and test log.",["An unsupported claim.","A final number with no work.","Only a decorative cover."],"Evidence connects model, procedure and reproducibility."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 5 Fraction Division and Procedural Writing",rationale}),r)));
}


/* Grade 6 Week 6: rational numbers and historical notation. */
function makeGrade6Week6Subjects(opts){
 const r=rng(hash("g6w6-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","comparison","Which statement accurately compares XII and 12?","They represent the same quantity using different notation.",["They always have different values.","XII is a modern decimal positional numeral.","Roman notation has identical place values to decimal."],"The symbols differ but both denote twelve."],["language-arts","historical language","What improves a comparison of historical number systems?","Precise examples and source-aware explanations.",["Claims that earlier cultures lacked mathematics.","Invented dates presented as facts.","Confusing symbols with quantities."],"Accurate comparison separates evidence from interpretation."],["science","temperatures","A temperature changes from 2 °C to −3 °C. What is the change?","−5 °C",["+5 °C","−1 °C","+1 °C"],"Final minus initial is −3−2=−5 °C."],["science","absolute value","What is the absolute value of −8?","8",["−8","0","−16"],"Absolute value is distance from zero."],["social-studies","roman numerals","What number does Roman numeral XII represent?","12",["7","15","22"],"X=10 and II=2; together XII=12."],["social-studies","source distinction","Which label is appropriate for a newly invented Roman-style merchant ledger?","Fictional classroom simulation.",["Verified ancient primary source.","Authentic excavation finding.","Proof of how all Romans traded."],"An invented learning scenario is not historical evidence."],["world-languages","number words","What does Spanish tres mean?","Three",["Two","Four","Ten"],"Tres is Spanish for three."],["world-languages","symbols","What value does the Arabic-Indic digit ٣ represent?","3",["1","5","8"],"٣ is a digit used to represent three."],["arts-music","positive space","In visual art, what is positive space?","The subject or occupied region of a composition.",["Every space with a positive integer.","Only the background.","A musical tempo unit."],"Positive space refers to occupied or subject areas."],["arts-music","symbol legend","Why should an invented musical-graphic notation have a legend?","So others can interpret its signs consistently.",["To disguise the meaning.","To prove it is ancient.","To avoid clear instructions."],"A legend defines how symbols map to intended meanings."],["health-pe-sel","baseline","A fictional activity time is 15 minutes compared with a 20-minute baseline. What deviation is this?","−5 minutes",["+5 minutes","−35 minutes","0 minutes"],"Actual minus baseline: 15−20=−5."],["health-pe-sel","interpretation","Which statement correctly interprets a negative activity-time deviation?","It indicates a value below the chosen baseline, not personal failure.",["It proves poor health.","It requires punishment.","It means the measurement is invalid."],"A signed deviation is mathematical, not a health judgment."],["technology-design","validation","Which input should a signed-temperature field accept?","−10 °C",["A password","An unrelated address","An unlabelled string"],"The input uses a signed number and a temperature unit."],["technology-design","roman conversion","What number does XIV represent?","14",["16","11","9"],"X=10 and IV=4, totaling fourteen."],["integrated-projects","opposites","Which numbers are opposites on a number line?","−4 and +4",["−4 and −4","0 and 4","3 and 4"],"Opposites have the same distance from zero in opposite directions."],["integrated-projects","museum evidence","What makes a number-systems exhibit responsible?","Accurate examples and clear distinctions between simulation and historical source.",["Made-up history presented as verified.","Unlabelled diagrams.","No visitor explanations."],"An educational exhibit must distinguish mathematics and verified history."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 6 Rational Numbers and Ancient Number Systems",rationale}),r)));
}


/* Grade 6 Week 7: coordinates and geography, eight-subject randomized assessment. */
function makeGrade6Week7Subjects(opts){
 const r=rng(hash("g6w7-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","spatial writing","Which sentence precisely describes moving from (−2,1) to (1,1)?","Move three units east.",["Move three units north.","Move one unit west.","Move two units south."],"Increasing x by three with y unchanged moves east on the standard grid."],["language-arts","map text","What makes a written route guide independently usable?","A starting point, measurable directions, and a map legend.",["Only 'go over there'.","No scale or orientation.","Unlabeled landmarks."],"Precise instructions require a defined frame of reference."],["science","coordinates","Where is point (−2,3) on a standard coordinate grid?","Left two units and up three units.",["Right two and up three.","Left three and down two.","Right three and down two."],"The x coordinate is horizontal and y is vertical."],["science","inference","What can a plot of simulated sampling sites reliably show?","The locations and counts recorded in that fictional data set.",["What caused every real spatial pattern.","An entire ecosystem's true population.","Exact real geographic coordinates."],"Simulated observations permit practice, not general causal claims."],["social-studies","map scale","A fictional map has a scale of 2 km per square. What does a three-square horizontal span represent?","6 km",["1.5 km","3 km","9 km"],"Three times two kilometers equals six kilometers."],["social-studies","geography","What is latitude used to describe?","North or south position relative to the equator.",["Elevation above sea level only.","A fictional classroom grid's x value.","Distance along a road."],"Latitude expresses an angular position north or south of the equator."],["world-languages","directions","What does Spanish norte mean?","North",["South","East","West"],"Norte translates to north."],["world-languages","directions","What does Spanish oeste mean?","West",["East","North","South"],"Oeste translates to west."],["arts-music","grid design","Which ordered pair is in Quadrant II?","(−3,2)",["(3,2)","(−3,−2)","(3,−2)"],"Quadrant II has negative x and positive y."],["arts-music","scaled design","An artwork grid uses 2 cm per square. Four squares measure what distance?","8 cm",["2 cm","4 cm","6 cm"],"Four times two centimeters equals eight centimeters."],["health-pe-sel","pathways","What makes a coordinate movement activity inclusive?","A seated or paper-tracing alternative.",["Forced physical participation.","No safe route boundaries.","Public disclosure of medical conditions."],"An equivalent accessible learning option protects safety."],["health-pe-sel","displacement","From (0,0) to (2,0), what is the horizontal displacement?","+2 grid units",["−2 grid units","+2 vertical units","0 grid units"],"The x value increases by two while y remains constant."],["technology-design","coordinate validation","Which practice prevents reversed point placement in a map interface?","Explicit x/y labels and input validation.",["Removing the axis labels.","Interpreting values in random order.","Silently accepting malformed input."],"Clearly labeled fields and validation preserve coordinate order."],["technology-design","mobile access","What improves accessibility for a narrow-screen map?","Readable location text and controls independent of color.",["Tiny unlabeled pins.","Only red-green distinctions.","Clipped point labels."],"Text and legible controls enable non-color map use."],["integrated-projects","route distance","A grid route moves from (−2,1) to (1,1), then to (1,3). How long is the horizontal-plus-vertical route?","5 units",["2 units","3 units","6 units"],"Three horizontal units plus two vertical units equals five."],["integrated-projects","source integrity","What label belongs on an invented community-garden coordinate map?","Fictional classroom simulation.",["Verified survey measurements.","Official geographic coordinates.","Observed real garden locations."],"An invented learning grid should not be described as field observations."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 7 Coordinates and Geography",rationale}),r)));
}


/* Grade 6 Week 8: expressions, symbolic language, models, and algorithms. */
function makeGrade6Week8Subjects(opts){
 const r=rng(hash("g6w8-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","notation","Which expression means three more than twice n?","2n+3",["2(n+3)","3n+2","n+6"],"The phrase twice n plus three translates to 2n+3."],["language-arts","syntax","Why do parentheses matter in a mathematical explanation?","They determine what quantities are grouped.",["They never affect meaning.","They are only decorative.","They eliminate the need for units."],"Grouping changes order and meaning."],["science","variables","For a simulated model d=2t, what is d at t=4?","8 meters",["2 meters","4 meters","16 meters"],"Twice four is eight in a model measured in meters."],["science","evidence","What does a fictional d=2t model alone establish?","Predicted outputs under its stated assumptions.",["Proof every object moves at that rate.","The true cause of motion.","Recorded measurements from a real experiment."],"A model is not automatically a real observation."],["social-studies","expressions","Four fictional caravans carry b baskets each. What is the total?","4b",["b+4","b/4","4+b²"],"Four equal groups of b make 4b."],["social-studies","sources","An invented trading ledger should be identified as what?","A fictional classroom simulation.",["Verified ancient evidence.","A newly authenticated document.","A historical census."],"Invented teaching data must not be represented as history."],["world-languages","translation","In Spanish, what does número mean?","Number",["Library","North","River"],"Número is the Spanish word for number."],["world-languages","symbol meaning","What should a bilingual algebra guide preserve?","The grouping and meaning of the original expression.",["Only the appearance of the letters.","An invented result.","A different operation without explanation."],"Translation must preserve mathematical meaning."],["arts-music","pattern","A four-beat pattern repeats n times. How many beats total?","4n",["4+n","n/4","4−n"],"Each repeat contributes four beats."],["arts-music","equivalence","Which sum also represents four beats?","2+2",["2+1","1+1","3+2"],"Two groups of two fill four beats."],["health-pe-sel","planning","If w=6 minutes and r=4 minutes, what is w+r?","10 minutes",["2 minutes","24 minutes","6 minutes"],"The total is the sum of two planned durations."],["health-pe-sel","choice","What makes an algebra-based activity plan safe and inclusive?","Optional alternatives and permission to rest.",["Forced repetition despite discomfort.","Sharing private diagnoses.","Ranking learners by their bodies."],"The model supports planning, not compulsory performance."],["technology-design","precedence","When x=2, what is 3*(x+4)?","18",["10","9","14"],"Parentheses first: 2+4=6, then times three."],["technology-design","formulas","Which spreadsheet formula represents 2n+3 if n is in A2?","=2*A2+3",["=A2/2+3","=2*(A2+3)","=A2+2*3"],"The multiplication applies only to n."],["integrated-projects","models","For 4n+2 garden plants and n=3 rows, how many plants?","14",["12","18","9"],"Four times three plus two is fourteen."],["integrated-projects","equivalent expressions","Which expression is equivalent to 4n+2?","2(2n+1)",["2(2n+2)","4(n+2)","n+6"],"Expanding 2(2n+1) gives 4n+2."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 8 Expressions and Algebraic Thinking",rationale}),r)));
}


/* Grade 6 Week 9: balanced arguments, science models and one-step equations. */
function makeGrade6Week9Subjects(opts){
 const r=rng(hash("g6w9-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","arguments","What is a counterargument?","A reasoned challenge to a claim.",["A repeated unsupported claim.","An unrelated quotation.","A mathematical numeral."],"A counterargument fairly addresses another position."],["language-arts","evidence","Which claim accurately describes 18 supporters among 30 fictional respondents?","18 of 30 respondents support the proposal.",["All residents agree.","The poll proves the policy is best.","No one opposed the change."],"The result applies to the sample, not everyone."],["science","equations","Solve 3t=12 for t.","4",["3","9","36"],"Dividing both sides by three yields four."],["science","model comparison","A simulated d=3t model predicts what distance at t=2 seconds?","6 meters",["3 meters","5 meters","9 meters"],"Three times two equals six, given meters-per-second units."],["social-studies","survey","18 out of 30 fictional survey respondents support a proposal. What percentage is that?","60%",["18%","30%","80%"],"18 divided by 30 is 0.6."],["social-studies","sources","What belongs in a balanced civic policy brief?","Supporting evidence, a fair objection, and limitations.",["Only one viewpoint.","Invented official sources.","A conclusion without data."],"Fair civic reasoning weighs opposing concerns."],["world-languages","agreement","What does Spanish estoy de acuerdo mean?","I agree.",["I am lost.","I disagree.","I am late."],"The phrase communicates agreement."],["world-languages","reasons","Which Spanish word introduces a reason?","porque",["norte","ayer","mitad"],"Porque means because in this context."],["arts-music","equality","Solve x+2=6 for x beats.","4",["2","6","8"],"Subtract two from both sides."],["arts-music","balance","Can an asymmetrical artwork still be visually balanced?","Yes, through intentional distribution of visual emphasis.",["No, balance requires identical halves.","Only if every shape is equal.","Only if a chart is attached."],"Balance does not require symmetry."],["health-pe-sel","time","Solve x+5=15 for optional activity minutes.","10",["5","15","20"],"Subtract five from each side."],["health-pe-sel","access","What is respectful self-advocacy in an activity?","Requesting an accessible option without disclosing private medical details.",["Being forced to share a diagnosis.","Ignoring safe boundaries.","Insulting a different choice."],"Self-advocacy can preserve privacy and choice."],["technology-design","equation testing","What value solves x−5=8?","13",["3","8","40"],"Add five to both sides."],["technology-design","debugging","Which test confirms x=4 solves 3x=12?","Substitute and check 3×4=12.",["Assume all values work.","Change only one side.","Ignore the input."],"Substitution checks equality."],["integrated-projects","budget","Solve the fictional budget constraint x+20=50.","30",["20","50","70"],"Subtract fixed cost twenty from budget fifty."],["integrated-projects","responsible proposal","What strengthens a fictional civic project proposal?","A checked equation, fair counterargument, and evidence limitations.",["Only favorable opinions.","Unlabeled sample numbers.","Made-up official endorsements."],"Reliable project defense combines math and qualified evidence."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 9 Equations and Balanced Arguments",rationale}),r)));
}


/* Grade 6 Week 10: inequalities and real-world decision-rule reasoning. */
function makeGrade6Week10Subjects(opts){
 const r=rng(hash("g6w10-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","precise limits","What does 'at most 20 participants' mean?","20 or fewer.",["Fewer than 20 only.","20 or more.","Exactly 21."],"At most includes the stated upper boundary."],["language-arts","conditional language","Which wording clearly excludes the value 10?","Fewer than 10.",["10 or fewer.","At most 10.","No greater than 10."],"A strict less-than rule excludes its boundary."],["science","target range","A simulated design target is 18≤T≤22. Which reading meets it?","22 °C",["17 °C","23 °C","24 °C"],"Both limits are inclusive."],["science","threshold rule","For a simulated sensor, which condition flags readings outside 18–22 °C?","T<18 or T>22",["T=20 only","T≥18 and T≤22","T=22 only"],"Values below the lower threshold or above the upper threshold are outside."],["social-studies","policy constraints","A fictional grant permits budgets b≤100. Is b=100 eligible?","Yes, the limit includes 100.",["No, 100 is too high.","Only if b>100.","The inequality does not define a maximum."],"Less-than-or-equal includes equality."],["social-studies","source distinctions","Which source most directly establishes an actual law's wording?","The applicable official enacted text.",["A fictional class worksheet.","An unsourced anecdote.","A proposed policy draft alone."],"Legal requirements must be checked against official enacted sources."],["world-languages","permission","What does Spanish 'se permite' indicate?","Something is permitted.",["It is prohibited.","It happened yesterday.","It is north of here."],"Se permite expresses permission."],["world-languages","comparison","What does Spanish 'menos que' generally mean?","Less than.",["Greater than.","Equal to.","Farther north."],"Menos que is a comparison meaning less than."],["arts-music","creative limit","A poster permits s≤4 shapes. Which count meets the rule?","4",["5","6","7"],"The at-most limit includes four."],["arts-music","beat limit","A fictional rhythm rule allows b≤8 beats. Which rhythm violates it?","9 beats",["6 beats","7 beats","8 beats"],"Nine exceeds the maximum of eight."],["health-pe-sel","optional duration","Which duration is allowed by an optional t≤12-minute plan?","12 minutes",["13 minutes","14 minutes","15 minutes"],"The endpoint 12 is permitted."],["health-pe-sel","accessibility","What is a responsible activity decision rule?","Provide rest and accessible alternatives.",["Require disclosure of diagnoses.","Ignore discomfort.","Make participation compulsory."],"Respecting comfort, consent and access supports safe learning."],["technology-design","boundary cases","For x<10, which value passes?","9",["10","11","12"],"Strict inequality excludes 10 and all greater values."],["technology-design","validator design","What should an inequality checker do with nonnumeric input?","Show a readable validation message.",["Silently treat it as zero.","Report success without testing.","Hide the error using only color."],"Clear input validation avoids misleading outcomes."],["integrated-projects","two constraints","Which fictional room design meets s≤20 and b≤100?","18 seats and 95 budget units.",["22 seats and 90 units.","18 seats and 105 units.","21 seats and 101 units."],"Both independent caps must be satisfied."],["integrated-projects","boundary checking","Are s=20 seats and b=100 units allowed by s≤20 and b≤100?","Yes, both inclusive boundaries qualify.",["No, neither boundary is included.","Only if seats exceed 20.","Only if budget exceeds 100."],"Both less-than-or-equal conditions include equality."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 10 Inequalities and Decision Rules",rationale}),r)));
}


/* Grade 6 Week 11: data literacy, statistics and distributions. */
function makeGrade6Week11Subjects(opts){
 const r=rng(hash("g6w11-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","statistical questions","Which question expects varying answers from multiple people?","How many books does each learner read weekly?",["How many pages are in this one copy?","What is the title of this book?","What is the room number?"],"A statistical question anticipates variability among observations."],["language-arts","qualification","Which description appropriately limits a small fictional survey's conclusion?","Three of five surveyed volunteers selected fiction.",["Everyone in town loves fiction.","The five answers prove a universal preference.","No further information could matter."],"Data summaries should name the observed group."],["science","median","For fictional trial times 4,5,5,6,10, what is the median?","5 minutes",["4 minutes","6 minutes","10 minutes"],"The middle of five sorted readings is five."],["science","scientific inference","What does a fictional cooling-time dot plot establish?","The distribution of the recorded simulated times.",["The cause of every difference.","A universal cooling law.","A verified laboratory experiment."],"Simulated plots illustrate variability rather than causation."],["social-studies","survey percentages","12 of 20 fictional respondents support an idea. What fraction as a percent?","60%",["12%","40%","80%"],"Twelve divided by twenty equals sixty percent."],["social-studies","sample interpretation","A poll of 20 volunteers from a town of 200 automatically describes whom?","Only those 20 respondents.",["Every resident with certainty.","All future residents.","Every person who did not respond."],"A volunteer sample can be unrepresentative."],["world-languages","frequency words","What does Spanish a veces mean?","Sometimes",["Always","Never","Yesterday"],"A veces expresses sometimes."],["world-languages","frequency words","What does Spanish nunca mean?","Never",["Often","Always","More than"],"Nunca expresses never."],["arts-music","median of beats","For beat counts 4,4,6,6,8, what is the median?","6 beats",["4 beats","5 beats","8 beats"],"The third ordered value of five is six."],["arts-music","tempo interpretation","Which claim is justified by a fictional tempo distribution alone?","It describes the tempos listed in the observations.",["Faster music is always better.","Everyone prefers the fastest tempo.","Artistic quality is directly proved."],"A tempo distribution does not establish artistic value."],["health-pe-sel","range","For fictional setup durations 2,3,3,4,8 minutes, what is the range?","6 minutes",["3 minutes","5 minutes","8 minutes"],"Maximum eight minus minimum two equals six."],["health-pe-sel","privacy","Which choice protects learner privacy in a statistics exercise?","Use simulated times and voluntary participation.",["Publish medical histories.","Force individuals to rank body performance.","Record diagnoses unnecessarily."],"Invented datasets can support learning without private records."],["technology-design","frequency count","In [2,3,3,4,8], how often does 3 occur?","Twice",["Once","Three times","Four times"],"The value three appears at the second and third positions."],["technology-design","accessible charts","What is an accessible companion to a narrow-screen bar chart?","A labeled text data table.",["Only colors without labels.","Microscopic text.","Unlabeled bars."],"A text table provides another way to understand values."],["integrated-projects","mode","For fictional books read 1,2,2,3,7, what is the mode?","2 books",["1 book","3 books","7 books"],"Two appears more often than the other values."],["integrated-projects","study limitations","What can five invented survey responses establish about a real town?","No verified population-wide conclusion.",["A precise townwide average.","The town's true preferred genre.","Every resident's reading habits."],"Invented small samples are illustrations, not empirical evidence."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 11 Statistics Questions Data and Distribution",rationale}),r)));
}


/* Grade 6 Week 12: geometry, surface area and accessible design. */
function makeGrade6Week12Subjects(opts){
 const r=rng(hash("g6w12-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","area terminology","Which unit correctly describes a rectangle's area?","square centimeters",["centimeters","kilograms","seconds"],"Area measures a two-dimensional region in square units."],["language-arts","procedure","Which explanation accurately computes a 6 cm base and 4 cm height triangle?","One-half times 6 times 4 equals 12 cm².",["6 plus 4 equals 10 cm².","6 times 4 equals 24 cm².","4 divided by 6 equals 1.5 cm²."],"Triangle area equals one half the base times perpendicular height."],["science","cube surface area","What is the surface area of a closed cube with 2 cm sides?","24 cm²",["8 cm²","12 cm²","16 cm²"],"Six faces each have area four square centimeters."],["science","model evidence","What does a drawn solid net establish by itself?","The modeled arrangement and areas of its faces.",["Measured heat transfer from a real experiment.","An object's exact volume without measurements.","A universal material property."],"A geometry diagram supports shape calculations but not experimental causal claims."],["social-studies","land area","A fictional lot is 10 m by 6 m. What is its area?","60 m²",["16 m²","32 m²","120 m²"],"Ten times six equals sixty square meters."],["social-studies","land-use","A 60 m² fictional lot reserves a nonoverlapping 12 m² path. What area remains?","48 m²",["12 m²","60 m²","72 m²"],"Subtract the path area from the total."],["world-languages","shape vocabulary","What does Spanish rectángulo mean?","Rectangle",["Triangle","Circle","Cube"],"Rectángulo translates to rectangle."],["world-languages","measurement vocabulary","What does Spanish centímetro mean?","Centimeter",["Kilogram","Second","Square kilometer"],"Centímetro names a length unit."],["arts-music","design area","What is the area of a 4 cm by 3 cm rectangular collage element?","12 cm²",["7 cm²","14 cm²","24 cm²"],"Multiply four by three for the rectangle's area."],["arts-music","net count","How many equal square faces belong to a closed cube?","6",["4","5","8"],"A cube has six square faces."],["health-pe-sel","room plan","A fictional 6 m by 4 m room covers how much area?","24 m²",["10 m²","20 m²","48 m²"],"Six times four equals twenty-four."],["health-pe-sel","inclusive space","Which planning approach is appropriate for a fictional recreation room?","Include clear paths and seated alternatives.",["Require every learner to perform identical movement.","Assume a diagram guarantees code compliance.","Ignore obstacles and personal boundaries."],"A sketch is a planning aid, not proof of real-world accessibility."],["technology-design","area formula","Which algorithm computes the area of a rectangle?","width × height",["width + height","width − height","width ÷ height"],"Rectangle area multiplies two perpendicular lengths."],["technology-design","input handling","What should an area calculator do with a negative width?","Show a clear input-validation error.",["Calculate an ordinary positive area without warning.","Hide the value and report success.","Treat it as an official measured length."],"Dimensions for this simple geometry model must be valid positive values."],["integrated-projects","garden area","What is the area of an 8 m by 5 m fictional reading garden?","40 m²",["13 m²","26 m²","80 m²"],"Eight times five gives forty."],["integrated-projects","remaining space","A fictional 40 m² garden reserves a nonoverlapping 2 m by 5 m path. What remains?","30 m²",["10 m²","35 m²","50 m²"],"The path covers ten square meters, leaving thirty."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 12 Geometry Area Surface Area and Design",rationale}),r)));
}


/* Grade 6 Week 13: volume, prisms and dimensional models. */
function makeGrade6Week13Subjects(opts){
 const r=rng(hash("g6w13-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","volume units","Which unit is appropriate for rectangular-prism volume?","cubic centimeters",["square centimeters","centimeters","degrees"],"Three-dimensional volume uses cubic units."],["language-arts","technical caption","Which caption accurately describes a 3×2×4 cm prism?","Volume is 24 cm³ from length×width×height.",["Volume is 9 cm² from adding edges.","Volume is 24 cm from multiplying edges.","Surface area must equal 24 cm³."],"Multiply dimensions and use cubic units."],["science","fractional volume","What is the volume of a prism measuring 2×1.5×3 cm?","9 cm³",["6.5 cm³","12 cm³","18 cm³"],"Two times one-and-a-half times three equals nine."],["science","scale","If every edge of a cube doubles, its volume changes by what factor?","8",["2","4","6"],"Three independent dimensions double, so 2³=8."],["social-studies","storeroom volume","What is the modeled volume of a fictional 4×3×2 m storeroom?","24 m³",["9 m³","14 m³","48 m³"],"Four times three times two equals 24 cubic meters."],["social-studies","historical model","Which description responsibly uses an invented historic-style building model?","Clearly labeled fictional reconstruction with dimensions.",["Authenticated measurements without evidence.","Proof of original construction methods.","A verified historic source."],"An invented model cannot establish historical fact."],["world-languages","spanish terminology","What does Spanish cubo mean?","Cube",["Rectangle","Circle","Triangle"],"Cubo means cube."],["world-languages","capacity vocabulary","What does Spanish capacidad mean?","Capacity",["Length","Triangle","Pattern"],"Capacidad is capacity."],["arts-music","sculpture volume","What is the volume of a 2×2×3 cm modeled sculpture prism?","12 cm³",["7 cm³","10 cm³","24 cm³"],"Two times two times three is twelve."],["arts-music","scale sculpture","Doubling all edges of a 12 cm³ sculpture model produces what volume?","96 cm³",["24 cm³","48 cm³","144 cm³"],"Twelve times eight is ninety-six."],["health-pe-sel","storage capacity","What is the external volume of a fictional 2×1×1 m cabinet?","2 m³",["1 m³","3 m³","4 m³"],"Multiply the three edges."],["health-pe-sel","safe access","Which is a responsible storage-room design choice?","Provide clear paths and alternative access methods.",["Require learners to carry heavy items.","Assume exterior volume ensures accessibility.","Ignore obstructions."],"Access depends on more than geometric volume."],["technology-design","volume formula","Which pseudocode expression returns rectangular-prism volume?","length*width*height",["length+width+height","length*width","length/width/height"],"Volume is the product of all three dimensions."],["technology-design","validation","What should an offline volume calculator do with a negative width?","Show an understandable validation error.",["Silently accept an impossible dimension.","Remove units.","Report a positive volume regardless."],"Invalid physical dimensions need explicit feedback."],["integrated-projects","equal volume","Do prisms 3×2×4 and 6×2×2 cm have the same volume?","Yes, both are 24 cm³.",["No, the first is 9 cm³.","No, the second is 12 cm³.","Neither has a definable volume."],"Both products equal twenty-four."],["integrated-projects","scaled volume","What is the volume after doubling every edge of a 3×2×4 cm prism?","192 cm³",["48 cm³","96 cm³","384 cm³"],"24 cm³ times eight equals 192 cm³."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 13 Volume and Three-Dimensional Modeling",rationale}),r)));
}


/* Grade 6 Week 14: matter, particle properties, density and evidence. */
function makeGrade6Week14Subjects(opts){
 const r=rng(hash("g6w14-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","matter definition","Which statement describes matter?","It has mass and occupies space.",["It must be visible.","It has no mass.","It must be a solid."],"Matter possesses mass and occupies space."],["language-arts","evidence versus inference","Which sentence is an observation rather than an untested explanation?","The sample's measured mass is 12 g.",["Its density proves it is copper.","All its particles are motionless.","This sample will never change."],"A stated measured mass is an observation."],["science","density calculation","A fictional sample has mass 12 g and volume 4 cm³. What is its density?","3 g/cm³",["2 g/cm³","4 g/cm³","48 g/cm³"],"Divide twelve grams by four cubic centimeters."],["science","particle models","Which statement about particle diagrams is accurate?","They are simplified representations of matter.",["They are photographs of atoms.","They prove every particle is the same size.","They replace all observations."],"Schematic diagrams communicate selected concepts and have limits."],["social-studies","materials selection","What may influence a fictional community's choice of building material?","Availability, properties, cost and intended use.",["Only the material's color.","Only its name.","Only the first item on a list."],"Communities weigh multiple technical and human needs."],["social-studies","historical evidence","What is needed to establish the actual origin of a historical tool?","Reliable provenance and appropriate evidence.",["A modern invented drawing alone.","A fictional trade story.","An unsupported label."],"Historical material claims require contextual evidence."],["world-languages","materials vocabulary","What does Spanish madera mean?","Wood",["Glass","Metal","Mass"],"Madera translates to wood."],["world-languages","measurement vocabulary","What does Spanish masa mean?","Mass",["Volume","Light","Temperature"],"Masa is mass in this context."],["arts-music","materials model","A fictional sculpture material has mass 10 g and volume 5 cm³. What is its modeled density?","2 g/cm³",["5 g/cm³","10 g/cm³","50 g/cm³"],"Ten divided by five equals two."],["arts-music","model accuracy","What should a schematic particle collage explain?","That it is a model with simplifications.",["That it shows actual atomic photographs.","That its colors prove composition.","That scale is always exact."],"Art can illustrate ideas while stating model limitations."],["health-pe-sel","density and safety","Does density alone determine whether an object is safe for someone to lift?","No, safe handling needs more context.",["Yes, always.","Yes, when density is high.","Yes, when no weight is listed."],"Handling decisions require more than density."],["health-pe-sel","inclusive learning","Which is an appropriate materials-learning alternative?","A paper-based observation and model activity.",["Mandatory physical handling.","Collecting medical histories.","Ignoring object hazards."],"Non-contact alternatives improve access and safety."],["technology-design","density algorithm","Which calculation gives density from mass and volume?","mass/volume",["mass*volume","mass+volume","volume-mass"],"Density is mass divided by volume."],["technology-design","validation","Why should a density calculator reject zero volume?","Division by zero is undefined.",["Zero volume always gives density zero.","Zero is an ordinary divisor.","It makes the result more accurate."],"The denominator cannot be zero."],["integrated-projects","compare densities","Which fictional sample is denser: 12 g/4 cm³ or 10 g/5 cm³?","The first sample, at 3 g/cm³.",["The second, at 5 g/cm³.","They are both 2 g/cm³.","Their densities cannot be calculated."],"The first is three and the second two grams per cubic centimeter."],["integrated-projects","evidence limits","Which conclusion is justified by fictional density values alone?","They describe mass per unit volume in that model.",["They prove the best construction material.","They establish all environmental impacts.","They identify both substances uniquely."],"Density alone cannot establish full suitability."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 14 Matter Particles Properties and Models",rationale}),r)));
}


/* Grade 6 Week 15: thermal energy and phase change. */
function makeGrade6Week15Subjects(opts){
 const r=rng(hash("g6w15-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","CER","What belongs in the evidence portion of a CER paragraph?","Specific observations or data that support the claim.",["An unrelated opinion.","An invented universal rule.","Only the title."],"Evidence supplies observations relevant to the claim."],["language-arts","heating graph","What can be stated from two equal consecutive temperature readings?","The recorded temperature did not change across that interval.",["No energy was transferred.","All matter stopped moving.","The material certainly melted."],"Equal readings alone do not prove a cause."],["science","phase change","Melting describes a change from which state to which?","Solid to liquid",["Liquid to solid","Gas to solid","Liquid to gas"],"Melting changes a solid into a liquid."],["science","energy concepts","During a phase change, can energy be transferred without a large temperature increase?","Yes, under suitable conditions.",["No, transferred energy must always increase temperature.","No, particles stop moving.","No, all materials change identically."],"Energy can contribute to changes in particle arrangement during phase transitions."],["social-studies","energy evidence","A fictional town uses 100,120,90 energy units. Which claim follows directly?","The largest recorded amount is 120 units.",["Refrigeration caused every change.","The town is universally efficient.","Energy costs were identical."],"Data show quantities, not causes or costs."],["social-studies","technology tradeoffs","What is relevant to evaluating community cooling technology?","Costs, access, infrastructure and environmental impacts.",["Only its name.","Only a guessed historic story.","Only one month's temperature."],"Technology choices involve multiple tradeoffs."],["world-languages","temperature vocabulary","What does Spanish frío mean?","Cold",["Hot","Melting","Fast"],"Frío means cold."],["world-languages","phase vocabulary","What does Spanish congelarse mean?","To freeze",["To evaporate","To expand","To illuminate"],"Congelarse refers to freezing."],["arts-music","graph interpretation","Which part of a temperature-time line graph depicts a plateau?","A horizontal segment",["A consistently rising segment","The graph title","An unlabeled legend"],"Constant readings create a flat line."],["arts-music","scientific art","What makes a scientific art infographic clear?","Numeric labels and an explicit artistic-versus-data distinction.",["Only colors without labels.","No measurement units.","A claim that metaphors prove causes."],"Accessible legends and qualified meanings avoid confusion."],["health-pe-sel","safe instruction","Which thermal-energy learning option is safer for a paper activity?","Graph simulated temperature readings.",["Touch an unknown hot surface.","Handle boiling liquid without supervision.","Measure classmates' medical conditions."],"Simulated data avoids unnecessary heat hazards."],["health-pe-sel","health inference","Can a classroom simulated temperature plot diagnose a learner?","No, it describes fictional values.",["Yes, every simulation is diagnostic.","Yes, if the chart has four points.","Yes, without units."],"Fictional classroom data cannot support personal medical conclusions."],["technology-design","rate calculation","A simulated sample rises from 0 to 4 °C over 2 minutes. What is the average rate?","2 °C/min",["1 °C/min","4 °C/min","8 °C/min"],"Four divided by two equals two degrees per minute."],["technology-design","plateau logic","What identifies a flat interval in consecutive recorded readings?","Two adjacent readings that are equal.",["Any positive reading.","Two different readings.","A missing time label."],"Equal consecutive values describe a recorded plateau."],["integrated-projects","temperature change","Fictional room A warms from 16 °C to 20 °C. What is the recorded change?","4 °C",["2 °C","16 °C","36 °C"],"Twenty minus sixteen equals four."],["integrated-projects","qualified conclusions","Do simulated room warming trends alone prove efficiency?","No, more evidence about inputs and conditions is needed.",["Yes, higher temperature always means efficiency.","Yes, two points prove all costs.","Yes, every building has identical conditions."],"Temperature change is not equivalent to energy efficiency."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 15 Thermal Energy and Phase Change",rationale}),r)));
}


/* Grade 6 Week 16: forces, motion and systems. */
function makeGrade6Week16Subjects(opts){
 const r=rng(hash("g6w16-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","speed wording","Which sentence correctly states a fictional object's average speed?","It covered 12 m in 4 s, averaging 3 m/s.",["It traveled 12 m/s for four meters.","Its force was definitely 3 newtons.","It must have accelerated every second."],"Distance divided by elapsed time yields average speed."],["language-arts","claim limits","What does a rising distance-time graph alone establish?","Recorded distance increases with time.",["Which exact force caused motion.","The object's mass.","That every moment had identical acceleration."],"Graph evidence must not be overstated."],["science","speed calculation","A fictional object travels 8 meters in 4 seconds. What is its average speed?","2 m/s",["4 m/s","8 m/s","12 m/s"],"Eight divided by four is two meters per second."],["science","fair test","In an experiment changing ramp height, which factor is the independent variable?","Ramp height",["The outcome distance","The recorded measurement error","The final written conclusion"],"The independent variable is deliberately changed."],["social-studies","route comparison","A fictional 12 km route completed in 3 hours has what average speed?","4 km/h",["3 km/h","9 km/h","36 km/h"],"Twelve kilometers divided by three hours is four kilometers per hour."],["social-studies","transport planning","Which factor matters alongside route speed in public transportation?","Affordability, access and safety.",["Only the route's name.","Only whether it is the fastest.","Only the number of signs."],"Transportation choices depend on community needs."],["world-languages","motion terms","What does Spanish movimiento mean?","Motion",["Weather","Storage","Density"],"Movimiento means movement or motion."],["world-languages","direction words","What does Spanish adelante mean in a direction instruction?","Forward",["Backward","Upward","Stationary"],"Adelante commonly means forward."],["arts-music","kinetic design","Which addition helps explain motion in a static art sequence?","Numbered frames with arrows and captions.",["Unlabeled colors only.","Removing frame order.","Assuming viewers saw the animation."],"Ordered annotated frames can communicate modeled movement."],["arts-music","motion rhythm","For modeled positions 0,3,6,9 meters at successive one-second times, what is the constant speed?","3 m/s",["1 m/s","6 m/s","9 m/s"],"Each one-second interval adds three meters."],["health-pe-sel","access","Which learning method permits participation without physical exertion?","Analyze a fictional motion graph on paper.",["Require a sprint time.","Compare personal medical histories.","Insist on competitive running."],"Paper models enable accessible participation."],["health-pe-sel","model limits","Can a simulated speed of 2 m/s measure an individual learner's fitness?","No, it describes the fictional motion model.",["Yes, it gives a medical diagnosis.","Yes, all speeds prove fitness.","Yes, without recording real motion."],"Fictional motion numbers do not evaluate real learners."],["technology-design","rate algorithm","Which formula gives average speed?","distance / elapsed time",["distance * elapsed time","distance + elapsed time","elapsed time - distance"],"Average speed is total distance divided by elapsed time."],["technology-design","input validation","Why reject zero elapsed time in a basic speed calculator?","Division by zero is undefined.",["It proves no distance was traveled.","It always makes speed negative.","It guarantees infinite real-world speed."],"A zero denominator cannot be used in division."],["integrated-projects","transport comparison","Which fictional route is faster: 12 km in 3 h or 12 km in 2 h?","The two-hour route at 6 km/h.",["The three-hour route at 8 km/h.","Both are 4 km/h.","Both are 12 km/h."],"Twelve divided by two equals six, greater than four."],["integrated-projects","decision evidence","Does fastest average speed alone prove a route is best for all residents?","No, accessibility, cost and safety also matter.",["Yes, all residents have identical needs.","Yes, no additional facts are relevant.","Yes, the graph proves affordability."],"Public design decisions weigh competing criteria."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 16 Forces Motion and Systems",rationale}),r)));
}


/* Grade 6 Week 17: midyear cumulative evidence and portfolio reasoning. */
function makeGrade6Week17Subjects(opts){
 const r=rng(hash("g6w17-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","portfolio selection","Which item best documents revision growth?","A dated first draft paired with a corrected revision.",["Only a decorative title.","An uncredited sample.","A grade with no artifact."],"A before-and-after comparison makes learning changes visible."],["language-arts","claim evidence","Which statement gives specific portfolio evidence?","My revised paragraph adds two data-supported explanations.",["I improved at everything.","The portfolio proves universal mastery.","A colorful cover establishes accuracy."],"Specific revisions demonstrate a defined skill."],["science","density review","A fictional sample has mass 12 g and volume 4 cm³. What is its density?","3 g/cm³",["2 g/cm³","4 g/cm³","48 g/cm³"],"Density is mass divided by volume."],["science","model limits","Which statement treats science models appropriately?","A particle diagram represents selected features and has limitations.",["It is always a microscopic photograph.","Its colors prove composition.","It replaces measured observations."],"Models are simplified representations."],["social-studies","source credibility","What strengthens a factual historical claim?","A source with verified context and provenance.",["An invented citation.","A fictional map presented as fact.","An unsupported assertion."],"A claim needs accountable source context."],["social-studies","balanced evaluation","Which consideration belongs in a civic route comparison?","Accessibility and cost alongside travel time.",["Only shortest travel time.","Only route names.","Only invented historic claims."],"Civic decisions weigh different community needs."],["world-languages","vocabulary review","What is Spanish movimiento?","Motion",["Volume","Wood","Triangle"],"Movimiento means motion."],["world-languages","clarification","How should a bilingual portfolio handle uncertain translation?","Mark the term for checking and clarify its context.",["Present a guess as verified.","Remove all units.","Claim identical meanings always."],"Accurate communication includes clarification."],["arts-music","creative evidence","Which artifact clearly documents original creative growth?","An early sketch, revised sketch and dated process notes.",["Only a score.","Only an unsigned image.","Only another creator's art."],"Dated drafts and reasoning can show artistic development."],["arts-music","artist statement","What belongs in an artist statement?","Explanation of the creator's specific design choices.",["An invented audience reaction.","Unsupported claims of universal preference.","Only the artwork's file size."],"Artist statements document intentions and choices."],["health-pe-sel","safe learning","Which is appropriate for a midyear learning portfolio?","A privacy-respecting safety plan and reflection.",["Mandatory health records.","Public peer fitness rankings.","Required diagnosis information."],"Reflecting on safety need not disclose sensitive information."],["health-pe-sel","inclusive participation","What supports equitable midyear evidence?","Equivalent paper or seated participation options.",["A compulsory sprint.","A single movement-only test.","Sharing classmates' private records."],"Multiple equivalent ways to demonstrate knowledge support access."],["technology-design","test evidence","What shows a program repair was verified?","A reproducible failing case and a passing retest.",["A new button color only.","An unsupported success claim.","Deleting all error cases."],"Repeatable tests document an effective fix."],["technology-design","accessible interfaces","Which choice improves a 255px screen design?","Readable wrapping labels and keyboard-compatible controls.",["Unlabeled tiny buttons.","Color-only errors.","Clipped words."],"Clear labels and responsive layouts improve usability."],["integrated-projects","evidence synthesis","Which set best demonstrates an interdisciplinary capstone?","An evidence index, corrected artifact and reasoned reflection.",["Only a cover illustration.","Only an unverified score.","Only a blank presentation."],"A capstone connects multiple subject artifacts and reasoning."],["integrated-projects","limitations","What should a learner say about a fictional transport dataset?","It supports calculations but cannot establish real town conditions.",["It proves authentic historical travel patterns.","It gives verified public costs.","It applies to every person."],"Simulated examples require an explicit limitation."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 17 Midyear Portfolio and Assessment",rationale}),r)));
}


/* Grade 6 Week 18: waves, sound, communication and access. */
function makeGrade6Week18Subjects(opts){
 const r=rng(hash("g6w18-subjects|"+String((opts||{}).seed||1)));
 const bank=[["language-arts","communication model","What belongs in a basic communication pathway?","Sender, channel, and receiver",["Only a receiver","Only a microphone","Only a loud signal"],"Communication requires a message to move through some channel between participants."],["language-arts","source evaluation","Which feature improves a fictional public announcement?","A named source and a way to verify its claim",["Anonymous certainty","Unlabeled repetition","An unexplained rumor"],"Source identification and verification support reliable communication."],["science","frequency","A fictional signal repeats 12 cycles in 3 seconds. Its frequency is:","4 Hz",["3 Hz","9 Hz","36 Hz"],"Frequency is cycles divided by seconds, giving four hertz."],["science","sound medium","Why cannot ordinary sound travel through a vacuum?","Mechanical sound needs a material medium",["Vacuum is too bright","Sound needs visible light","A vacuum always makes sound louder"],"Sound is a mechanical disturbance that travels in material media."],["social-studies","communication inclusion","What makes a fictional community alert more accessible?","Audio, readable print, and plain text options",["Audio only","Only tiny printed text","An undocumented rumor"],"Multiple modes can serve differing community communication needs."],["social-studies","reliability","Does sending a message quickly establish its accuracy?","No, sources and claims still need checking",["Yes, speed guarantees truth","Yes, repetition proves the claim","Yes, any broadcast is verified"],"Transmission speed alone provides no guarantee of truth."],["world-languages","clarification","What does Spanish ¿Puede repetirlo? ask?","Can you repeat it?",["Can you paint it?","Where is the train?","Is it raining?"],"This respectful expression requests that the message be repeated."],["world-languages","transcription","What supports language access when sound is unavailable?","A faithful written transcript",["Only a louder volume","Unlabeled images only","Removing the message"],"A written transcript provides an alternative to hearing speech."],["arts-music","wave model","In a schematic wave, amplitude represents what?","Size of displacement from the reference level",["Cycles per second","The language of the song","Number of performers"],"Amplitude is the magnitude of a modeled oscillation, distinct from its frequency."],["arts-music","model limits","Can the height of a hand-drawn wave alone measure actual sound intensity?","No, it is only a schematic without measurement",["Yes, always","Yes, independent of scale","Yes, because louder means taller on every drawing"],"A drawing needs a measurement scale and actual data to support quantitative claims."],["health-pe-sel","safe lesson","Which lesson teaches sound concepts without unnecessary loud exposure?","A paper-based wave simulation",["Mandatory loudspeaker testing","Competitive hearing tests","Requiring medical disclosure"],"Paper models avoid unnecessary sound exposure and protect privacy."],["health-pe-sel","communication access","Which response supports a learner who requests written instructions?","Provide readable text or captions",["Demand a medical explanation","Refuse any alternative","Increase volume without consent"],"Accessible alternatives support participation without disclosure."],["technology-design","frequency formula","Which algorithm computes frequency from cycles and elapsed seconds?","cycles / seconds",["cycles × seconds","cycles + seconds","seconds − cycles"],"Frequency is the number of cycles per unit time."],["technology-design","division validation","What should a frequency calculator do if elapsed seconds is zero?","Explain that the input is invalid",["Divide by zero anyway","Report zero hertz as certain","Suppress any error"],"A zero denominator requires validation."],["integrated-projects","alert channels","Which set provides complementary fictional community alert channels?","Printed notice, audio script, and offline plain text",["One inaccessible recording only","Only unverified social posts","Only color-coded symbols"],"Multiple formats improve resilience and access."],["integrated-projects","verification","Before sharing a fictional public warning as real, what is essential?","Verify the source, date, and underlying claim",["Repeat it many times","Add a bright graphic","Remove qualifications"],"Public information requires reliable source and context verification."]];
 const subjects=["language-arts","science","social-studies","world-languages","arts-music","health-pe-sel","technology-design","integrated-projects"];
 const groups=subjects.map(subject=>shuffle(r,bank.filter(q=>q[0]===subject)));
 const selected=groups.map(g=>g[0]).concat(shuffle(r,groups.map(g=>g[1])).slice(0,4));
 return shuffle(r,selected.map(([subject,skill,prompt,correct,wrongs,rationale])=>finalize(makeQuestion(prompt,correct,wrongs,{subject,skill,grade:6,focus:"Grade 6 Week 18 Waves Sound and Communication",rationale}),r)));
}

global.KhaemenesMiddleQuestionFactory=Object.freeze({
  version:VERSION,
  subjects:SUBJECTS.slice(),
  normalizeSubject,
  makePool,
  makeBalanced,
  makeGrade6Week1Subjects,
  makeGrade6Week2Subjects,
  makeGrade6Week3Subjects,
  makeGrade6Week4Subjects,
  makeGrade6Week5Subjects,
  makeGrade6Week6Subjects,
  makeGrade6Week7Subjects,
  makeGrade6Week8Subjects,
  makeGrade6Week9Subjects,
  makeGrade6Week10Subjects,
  makeGrade6Week11Subjects,
  makeGrade6Week12Subjects,
  makeGrade6Week13Subjects,
  makeGrade6Week14Subjects,
  makeGrade6Week15Subjects,
  makeGrade6Week16Subjects,
  makeGrade6Week17Subjects,
  makeGrade6Week18Subjects,
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
