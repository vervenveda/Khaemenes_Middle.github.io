/* Khaemenes Grade 6 Language Arts · Academy-Original Reading Evidence Lab v1
 * Weeks 08–23: sustained reading before analysis/writing.
 * All texts are Academy-original instructional fiction/nonfiction.
 */
(function(global){"use strict";
if(global.KhaemenesGrade6LanguageArtsReadingLab)return;
const entries={
"08":{title:"The Variable in the Window",source:"Academy-original explanatory narrative",paragraphs:[
"Rina was helping design signs for the school garden. One sign said, “Each planter receives three seed packets, plus two packets for the demonstration table.” Instead of writing a new total every time the number of planters changed, she wrote 3p + 2, where p represented the number of planters.",
"Her partner first read the expression as “three plus p plus two.” Rina pointed to the wording in the sign and explained that 3p represents three groups of p only if p has been defined carefully. She then tested the expression with p = 4 and obtained 14 packets.",
"The symbols were useful because they preserved a relationship, but they did not explain the garden by themselves. A reader still needed the original situation, the meaning of p, and the units being counted."
],questions:["What does p represent, and which sentence establishes its meaning?","Why is 3p + 2 different from 3 + p + 2?","What information would be lost if the expression appeared without the original context?"]},
"09":{title:"Two Proposals for the Reading Room",source:"Academy-original civic argument",paragraphs:[
"The student council considered two proposals for a quiet reading room. Proposal A would reserve the room every lunch period. Proposal B would open it three days each week so clubs could use the space on the other days.",
"Supporters of Proposal A argued that a predictable daily schedule would help students form routines. Supporters of Proposal B answered that the school had limited meeting space and that clubs also needed dependable access. A voluntary survey of 40 students favored Proposal A by 24 to 16, but the council noted that the survey did not include every student.",
"Rather than declaring one side proven correct, the council listed the strongest reason for each proposal and asked what additional evidence would help: room-usage records, club schedules, and a wider student survey."
],questions:["State the strongest claim for each proposal.","Why does the 24-to-16 survey result not settle the decision?","Write a qualified recommendation and name one counterargument it must address."]},
"10":{title:"The Rule That Changed at the Boundary",source:"Academy-original informational scenario",paragraphs:[
"A makerspace notice originally read, “Groups with fewer than 12 students may enter.” On Monday, a group of exactly 12 arrived and was turned away. Several students had expected 12 to be allowed because they had interpreted the notice as a general capacity statement rather than a strict rule.",
"The coordinator revised the notice: “Groups of 12 or fewer may enter when a staff member is present.” The new wording changed both the numerical boundary and the condition. It also made clear who was responsible for deciding whether the room could open.",
"The incident showed that small words such as fewer, at most, unless, and when can change a rule. Precise language is not merely formal; it determines who qualifies and under what conditions."
],questions:["Compare the boundary in the first and second notices.","Which words introduce a condition rather than a number?","Rewrite one rule so that its boundary and exception are unambiguous."]},
"11":{title:"Five Readers Are Not the Whole School",source:"Academy-original data commentary",paragraphs:[
"A book club asked five volunteers how many books they had finished during the previous month. Their responses were 1, 2, 2, 3, and 7. One student announced, “Students at our school usually finish seven books a month.”",
"Another student checked the list. Seven was the largest observation, not the typical value. The median was 2, and only one respondent had reported 7. The group also realized that volunteers in a book club were not a random sample of the whole school.",
"The club revised its report: “Among these five volunteers, the median was two books, and the responses ranged from one to seven. This small convenience sample cannot describe the reading habits of all students.”"
],questions:["Which sentence in the first report overclaims?","What do the median and range actually describe?","Why does the way the sample was chosen matter to the conclusion?"]},
"12":{title:"A Design Note for the Reading Nook",source:"Academy-original technical memo",paragraphs:[
"A design team planned a rectangular reading mat four meters long and three meters wide. Their first memo said the mat had “twelve meters of space.” During review, a student pointed out that the unit should be square meters because the team was describing area.",
"The team then considered a triangular side cushion with a base of two meters and a perpendicular height of one meter. They wrote the calculation as one-half times base times height, giving an area of one square meter.",
"The revised memo included a diagram, units, formulas, and a note that the measurements described a proposed design rather than an installed room. Technical writing became clearer when every number was tied to what it measured."
],questions:["Why is 12 m an incorrect unit for the mat’s area?","Which measurement must be perpendicular when finding triangle area?","Identify one sentence that distinguishes a proposed model from a real installation."]},
"13":{title:"The Box With Two Kinds of Space",source:"Academy-original technical explanation",paragraphs:[
"A storage model measured five centimeters long, two centimeters wide, and three centimeters high. Multiplying the three dimensions gave an exterior model volume of 30 cubic centimeters.",
"A student then wrote, “The box can hold exactly 30 cubic centimeters.” The class challenged the statement. If the box had walls with thickness, its interior capacity could be smaller than the volume described by the exterior dimensions.",
"The class revised the caption to distinguish the measurements they had from the capacity they had not measured. Their model still supported useful reasoning, but only when the claim matched the evidence."
],questions:["What quantity is supported by the three exterior dimensions?","Why is the capacity claim too strong?","Revise the final claim using a limiting phrase."]},
"14":{title:"What a Particle Drawing Can Show",source:"Academy-original science-literacy text",paragraphs:[
"A classroom diagram showed circles packed closely in one panel and spread farther apart in another. The caption labeled the panels “solid model” and “gas model.” No one had observed individual atoms arranged exactly like the drawing.",
"The diagram was a model: a simplified representation designed to emphasize spacing and movement. It could help learners compare states of matter, but the circles were not drawn to scale, and the picture did not display every interaction among particles.",
"Readers used the model more responsibly when they separated what the diagram represented from what it literally pictured."
],questions:["Which features of matter is the model designed to emphasize?","Name two limitations of the drawing.","Write one sentence that clearly distinguishes representation from direct observation."]},
"15":{title:"The Flat Part of the Graph",source:"Academy-original science data narrative",paragraphs:[
"A fictional warming graph showed temperature rising for several minutes and then remaining nearly level for a short interval. One caption said, “The heater stopped adding energy because the temperature stopped rising.”",
"The class questioned the caption. During some phase changes, energy transfer can continue while temperature changes very little. The graph alone also did not identify every condition of the imaginary experiment.",
"A revised caption described only what the data supported: the recorded temperature remained nearly constant during the interval, and additional evidence would be needed to explain exactly why."
],questions:["What does the graph directly show?","Why is the first caption an unsupported causal claim?","Write a qualified explanation that separates observation from mechanism."]},
"16":{title:"The Faster Cart Report",source:"Academy-original motion report",paragraphs:[
"Two model carts traveled along a marked track. Cart A moved 12 meters in four seconds; Cart B moved 12 meters in three seconds. A student concluded that Cart B must have experienced a greater force.",
"The times support a comparison of average speed, but they do not reveal the force history of either cart. Different starting conditions, friction, or other factors could matter. A speed comparison is not automatically a force measurement.",
"The class rewrote the report to calculate the rates first and then identify what additional measurements would be needed to test a force claim."
],questions:["Calculate the average speed of each cart.","Which conclusion is not supported by the recorded distance and time alone?","What additional evidence would help test a claim about force?"]},
"17":{title:"Three Drafts of the Same Claim",source:"Academy-original revision study",paragraphs:[
"Draft 1 read, “My writing got better because I worked hard.” Draft 2 added, “In Week 9, I included a counterclaim.” Draft 3 explained, “My Week 9 revision added a counterclaim and response, which made the proposal more balanced than my first draft.”",
"Each draft became more useful as evidence because it moved from a broad self-judgment to a specific artifact and then to an explanation of how the artifact demonstrated growth.",
"A portfolio reflection is strongest when it identifies the work, names the skill, and explains the change rather than merely praising effort."
],questions:["What makes Draft 3 stronger evidence than Draft 1?","Identify the artifact, skill, and change in Draft 3.","Revise a vague reflection into an evidence-based one."]},
"18":{title:"The Announcement That Lost Its Meaning",source:"Academy-original communication narrative",paragraphs:[
"A school message said, “Meet there after the second signal.” New students did not know where “there” was or which signal counted as the second one. The sender assumed shared knowledge that the audience did not have.",
"The revised message named the location, time, and purpose. It also offered a text-only version for students who could not access the original audio announcement.",
"The communication improved not because the sender repeated it louder, but because the message became more explicit and accessible."
],questions:["Which words in the first message depend on missing context?","How does the revision change the audience’s ability to act?","Explain why repetition alone does not guarantee understanding."]},
"19":{title:"The Photograph Outside the Frame",source:"Academy-original visual-literacy text",paragraphs:[
"A fictional photograph showed three people standing beside a flooded path. One caption read, “Residents ignored every warning.” Nothing visible in the photograph established whether warnings had been issued or received.",
"A second caption described only observable details and identified the date and location as provided by the photographer. It then separated a question—what warnings were available?—from the visual evidence.",
"The exercise reminded readers that images can be powerful evidence while still leaving causes, motives, and events outside the frame."
],questions:["Which part of the first caption is an inference rather than an observation?","What information belongs in a source note for a photograph?","Write one question that the image cannot answer by itself."]},
"20":{title:"When the Cell-City Analogy Breaks",source:"Academy-original science-literacy explanation",paragraphs:[
"A teacher compared a cell membrane with a city gate because both can help regulate movement across a boundary. A student extended the analogy and wrote, “The membrane decides who may enter, just like a guard.”",
"The comparison became misleading. A membrane does not think or make decisions. Its structures and physical processes affect which substances cross under particular conditions.",
"Analogies are useful when they highlight a relationship and name their limits. They become confusing when figurative language is mistaken for literal biological behavior."
],questions:["What relationship does the analogy help explain?","Which word creates an inaccurate human-like interpretation?","Rewrite the analogy so that its limitation is explicit."]},
"21":{title:"One Food Web, Several Claims",source:"Academy-original ecosystem evidence text",paragraphs:[
"A simplified food web linked grasses to rabbits, rabbits to foxes, and several organisms to decomposers. A student wrote, “Foxes control the entire ecosystem.”",
"The diagram supported a relationship between foxes and rabbits, but it did not show every species, population size, disease, weather event, or human influence. Removing one organism could affect many relationships, yet the direction and size of those effects would require evidence.",
"The class revised its explanation to trace specific pathways in the model and to distinguish energy flow from broader claims about ecosystem control."
],questions:["Which relationship is directly represented in the food web?","Why is the claim about total control too broad?","Trace one pathway and state one limitation of the model."]},
"22":{title:"Following Water Without Losing the System",source:"Academy-original Earth-systems text",paragraphs:[
"A diagram showed evaporation from a lake, condensation in clouds, precipitation, runoff, and infiltration. One student summarized the cycle as a simple circle in which water always followed the same path.",
"The class noticed that the model included several pathways. Some water infiltrated soil, some moved across the surface, and some remained stored before moving again. The diagram also omitted many local conditions.",
"A stronger explanation used sequence words without implying that every water molecule follows one identical route."
],questions:["Name three different pathways shown in the description.","Why is a single fixed loop an oversimplification?","Write a sequence that uses transitions while acknowledging alternative pathways."]},
"23":{title:"Weather Today, Climate Over Time",source:"Academy-original data-reading text",paragraphs:[
"On one unusually cool day, a student wrote, “The region’s climate is getting colder.” The statement used one weather observation to make a long-term climate claim.",
"Climate descriptions depend on patterns measured across longer periods. A single day can be important weather, but it does not by itself establish a long-term trend.",
"The revised commentary identified the day’s temperature as one observation and asked for a longer record before drawing a climate conclusion."
],questions:["What is the difference between the observation and the long-term claim?","Why is one day insufficient evidence for a climate trend?","Rewrite the claim using cautious language and a request for additional data."]}
};
global.KhaemenesGrade6LanguageArtsReadingLab=Object.freeze({version:"1.0.0",grade:"06",weeks:Object.freeze(entries)});
})(window);
