/* Khaemenes Grade 6 Language Arts Curriculum Spine v1.0.0
 * Supplements the authored 36-week curriculum with explicit mechanics,
 * morphology/vocabulary, reading-evidence and writing/revision progression.
 */
(function(global){"use strict";
if(global.KhaemenesGrade6LanguageArtsSpine)return;
const rows=[
[1,"Complete sentences and sentence boundaries","respons-, evid-, infer-","cite two details and distinguish evidence from inference","claim + evidence paragraph"],
[2,"Quotation punctuation and attribution","annot-, para-, cit-","annotate, quote and paraphrase without changing meaning","evidence paragraph with source locator"],
[3,"Signal words and informational-text structure","struct-, compar-, rate","identify central idea and organizational structure","source-note summary with units"],
[4,"Pronoun clarity and antecedents","percent-, represent-, sample","separate respondent data from population claims","measured civic recommendation"],
[5,"Imperative verbs and transition sequence","proced-, precis-, equal","follow and test procedural sequence","reproducible how-to writing"],
[6,"Parallel comparison sentences","numer-, symbol-, cultur-","compare representations without stereotyping","comparative explanation with qualification"],
[7,"Prepositions and spatial language","coord-, origin-, spatial","connect prose claims to a map/coordinate model","map-linked explanatory guide"],
[8,"Syntax, grouping and punctuation for meaning","express-, vari-, symbol-","translate between symbolic and verbal meaning","explanatory paragraph using precise syntax"],
[9,"Claim/counterclaim sentence frames","argu-, counter-, balance","evaluate support and counterexamples","balanced argument essay"],
[10,"Conditionals, modals and boundary language","condit-, constrain-, inclus-","interpret at least/no more than/fewer than","qualified procedural policy"],
[11,"Comparatives and quantitative qualifiers","stat-, distrib-, vari-","describe a distribution without overclaiming","honest statistical summary"],
[12,"Technical noun phrases and unit notation","geo-, surface-, dimens-","read a measured design and distinguish units","sequenced technical explanation"],
[13,"Complex sentences with because/although/while","volum-, capacity-, prism-","interpret a 3D model and its limits","technical model explanation"],
[14,"Appositives and definition sentences","matter-, particle-, dens-","separate observation, model and inference","scientific explanation with qualification"],
[15,"Cause/effect connectors and tense consistency","therm-, phase-, energy","interpret a graph without false causation","CER paragraph and revised explanation"],
[16,"Active/passive voice and variable-reference clarity","motion-, force-, rate","read graph evidence and separate cause from correlation","evidence-based motion brief"],
[17,"Revision marks, sentence combining and coherence","revise-, synth-, port-","compare early and revised work","midyear synthesis and portfolio reflection"],
[18,"Precise verbs for communication processes","commun-, trans-, vibr-","evaluate sender/channel/receiver evidence","communication brief with model limits"],
[19,"Modifiers and denotation/connotation","visual-, reflect-, infer-","distinguish observation from visual inference","visual-evidence critique"],
[20,"Analogy language and limiting phrases","cell-, struct-, function-","evaluate analogy against scientific model","model-based explanatory essay"],
[21,"Cohesion with reference words and transitions","eco-, troph-, energy","trace relationships in food-web evidence","environmental argument"],
[22,"Temporal transitions and relative clauses","hydro-, cycle-, system-","sequence Earth-system evidence","water-systems explanation"],
[23,"Comparative clauses and cautious modal verbs","climate-, weather-, pattern","compare data across regions without overclaiming","data commentary"],
[24,"Source-introduction phrases and citation punctuation","civil-, river-, primary","source and contextualize river-civilization evidence","sourced comparison"],
[25,"Perspective verbs and quotation integration","belief-, law-, context-","compare perspectives and source limits","contextual reading analysis"],
[26,"Concessive clauses for civic argument","civic-, polis-, republic-","compare civic claims and supporting evidence","evidence-based civic essay"],
[27,"Reported speech and interview punctuation","migr-, trade-, exchang-","compare travel accounts and reliability","multi-source synthesis"],
[28,"Register, audience and translation choices","lingu-, cogn-, translat-","compare literal meaning and cultural interpretation","audience-aware language analysis"],
[29,"Thesis syntax and note-to-sentence transformation","research-, thesis-, credible","build a trustworthy source trail","research argument with revision"],
[30,"Counterclaim transitions and rhetorical punctuation","debate-, rebut-, rhetoric-","evaluate evidence quality in disagreement","balanced oral/written argument"],
[31,"Parallelism and rhetorical choice","media-, rhetor-, frame-","analyze point of view and media choices","evidence-based media critique"],
[32,"Inclusive language and plain-language editing","well-, ident-, respons-","evaluate health claims and audience needs","inclusive informational guide"],
[33,"Colon/semicolon use and procedural clarity","algorithm-, data-, ethic-","read technical/data narratives critically","accessible evidence-aware guide"],
[34,"Synthesis transitions and source embedding","capstone-, inquiry-, synth-","organize an annotated source log","coherent research proposal"],
[35,"Oral syntax, pacing cues and question response","defend-, clarify-, counter-","anticipate questions and test evidence","oral defense script + revision"],
[36,"Editing for conventions, cohesion and citation consistency","readiness-, reflect-, curate-","synthesize reading evidence across the year","Grade 7 readiness portfolio defense"]
];
const weeks=Object.freeze(Object.fromEntries(rows.map(r=>[String(r[0]).padStart(2,"0"),Object.freeze({week:r[0],mechanics:r[1],morphology:r[2].split(",").map(x=>x.trim()),readingEvidence:r[3],writingRevision:r[4]})])));
global.KhaemenesGrade6LanguageArtsSpine=Object.freeze({version:"1.0.0",grade:"06",weeks});
})(window);
