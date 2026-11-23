/* Khaemenes Grade 7 Language Arts Curriculum Spine v1.0.0 */
(function(global){"use strict";
if(global.KhaemenesGrade7LanguageArtsSpine)return;
const rows=[
[1,"Sentence variety and evidence integration","evid-, infer-, revise-","distinguish observation, inference, and defensible interpretation","evidence paragraph with revision rationale"],
[2,"Embedded quotations and citation punctuation","cit-, propor-, annot-","integrate quoted and paraphrased evidence proportionally","comparative explanation with source locator"],
[3,"Complex comparison sentences and rate language","relat-, rate-, structur-","connect text structure with quantitative relationships","informational synthesis with precise units"],
[4,"Subordination for cause, contrast, and concession","civic-, percent-, represent-","evaluate civic data claims and sample limits","qualified civic recommendation"],
[5,"Verb tense consistency and signed-number language","rational-, oppos-, magnit-","read symbolic and verbal representations accurately","technical explanation with worked example"],
[6,"Parallel structure and distributive syntax","express-, distribut-, precis-","analyze how structure changes meaning","precision-focused explanatory writing"],
[7,"Conditional clauses and logical connectors","equat-, inequ-, constrain-","interpret conditions and solution sets","reasoned rule/constraint explanation"],
[8,"Modifier placement and scale-comparison language","scale-, ratio-, model-","evaluate scale representations and model limits","design brief with measured justification"],
[9,"Appositives and formal definition sentences","circum-, radius-, diameter-","read formula explanations and geometric claims","technical explanation with counterexample"],
[10,"Participial phrases and spatial sequencing","surface-, volume-, dimens-","connect 2D nets to 3D reasoning","modeling memo with limitation statement"],
[11,"Probability qualifiers and modal verbs","probab-, likelihood-, fair-","distinguish possible, likely, certain, and fair","evidence-based fairness argument"],
[12,"Comparative/contrast clauses for inference","stat-, infer-, popul-","evaluate sample-to-population claims","statistical commentary with caveats"],
[13,"Point-of-view shifts and pronoun reference","identity-, perspect-, narrat-","analyze narrator, perspective, conflict, and theme","literary analysis paragraph with textual evidence"],
[14,"Rhetorical sentence patterns and claim hierarchy","argu-, rhetoric-, valid-","evaluate argument, reasoning, and evidence quality","argument analysis with counterclaim"],
[15,"Source-introduction syntax and citation signal phrases","cred-, source-, synth-","compare source purpose, credibility, and corroboration","multi-source research explanation"],
[16,"Figurative syntax, line breaks, and sound devices","voice-, figur-, connot-","analyze voice, imagery, tone, and connotation","poetry/narrative response with style imitation"],
[17,"Cohesion, transitions, and portfolio commentary","portfolio-, synth-, revise-","compare drafts and identify evidence of growth","midyear synthesis with annotated revisions"],
[18,"Definition and analogy limits in science writing","cell-, struct-, function-","evaluate structure-function explanations and analogy limits","scientific literacy explanation"],
[19,"Cause/effect syntax and systems language","homeo-, system-, regul-","trace interactions among body systems without overclaiming","systems explanation with causal qualification"],
[20,"Conditional inheritance language and uncertainty","gen-, vari-, inherit-","distinguish pattern, probability, and deterministic claims","genetics explanation with qualifiers"],
[21,"Cumulative relationships and ecological transitions","eco-, interdepend-, impact-","trace ecosystem relationships and competing evidence","environmental argument with tradeoffs"],
[22,"Passive/active voice in scientific process writing","atom-, chem-, react-","read particle models and evidence for change","lab-style explanation with model limits"],
[23,"Causal chains and energy-transfer syntax","energy-, force-, motion-","separate measured patterns from causal claims","systems brief using graph/data evidence"],
[24,"Chronology and hazard-risk sentence structures","tect-, hazard-, mitig-","synthesize map, chronology, and risk evidence","hazard advisory with uncertainty"],
[25,"Long-term trend language and quantitative qualifiers","climate-, trend-, variab-","distinguish weather observations from climate evidence","climate evidence commentary"],
[26,"Historical sourcing verbs and attribution","feudal-, manorial-, hierarch-","source and contextualize medieval systems evidence","historical explanation with perspective"],
[27,"Corroboration language and knowledge-network syntax","scholar-, translat-, network-","compare sources about intellectual exchange","corroborated knowledge-network account"],
[28,"Comparative civilization syntax and trade vocabulary","trade-, exchang-, diaspor-","compare routes, goods, ideas, and power across regions","multi-region synthesis"],
[29,"Rhetorical analysis and humanist vocabulary","renaiss-, human-, reform-","analyze competing ideas, audience, and historical context","source-based intellectual-history essay"],
[30,"Reasoning verbs and evidence hierarchy","enlight-, empir-, reason-","compare claims grounded in authority, observation, and argument","evidence-and-reason analysis"],
[31,"Economic cause/effect transitions and fairness language","labor-, market-, distrib-","evaluate economic systems and distributional effects","economic argument with stakeholder perspectives"],
[32,"Register, diplomacy, and intercultural syntax","diplom-, cultur-, register-","analyze translation, audience, and cultural context","diplomatic communication analysis"],
[33,"Algorithmic sequence and ethical modal language","algorithm-, privacy-, ethic-","evaluate technical claims, data use, and human choices","technology ethics brief"],
[34,"Research synthesis sentences and integrated citations","inquiry-, synth-, thesis-","integrate multiple credible sources around a big question","capstone proposal with annotated evidence"],
[35,"Oral argument syntax, rebuttal, and pacing cues","defend-, rebut-, clarify-","anticipate counterquestions and defend evidence publicly","oral defense script + revision notes"],
[36,"Editing for coherence, conventions, and source consistency","readiness-, reflect-, curate-","synthesize yearlong evidence and identify Grade 8 readiness","portfolio defense and transition reflection"]
];
const weeks=Object.freeze(Object.fromEntries(rows.map(r=>[String(r[0]).padStart(2,"0"),Object.freeze({week:r[0],mechanics:r[1],morphology:r[2].split(",").map(x=>x.trim()),readingEvidence:r[3],writingRevision:r[4]})])));
global.KhaemenesGrade7LanguageArtsSpine=Object.freeze({version:"1.0.0",grade:"07",weeks});
})(window);
