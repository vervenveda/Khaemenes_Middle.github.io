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

global.KhaemenesMiddleQuestionFactory=Object.freeze({
  version:VERSION,
  subjects:SUBJECTS.slice(),
  normalizeSubject,
  makePool,
  makeBalanced,
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
  validateQuestion
});
})(typeof globalThis!=="undefined"?globalThis:window);
