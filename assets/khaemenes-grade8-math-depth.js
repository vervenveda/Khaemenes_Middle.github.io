/* Grade 8 independent mathematics instruction: explicit worked examples, practice and checks. */
(function(){
"use strict";
const matched=String(location.pathname).match(/\/grades\/grade-08\/subjects\/mathematics\/week-(\d{2})\.html$/i);
if(!matched)return;
const week=Number(matched[1]);
const lessons={
1:["Mathematical baseline and reasoning","Estimate 19×6 as 20×6=120, then subtract 6 to get 114.","Compute 18×7 using a mental strategy, and show why it works.","18×(5+2)=90+36=126.","An estimate checks reasonableness but does not replace exact calculation."],
2:["Linear patterns and rate of change","Points (1,4) and (3,10): slope=(10−4)/(3−1)=3; y=3x+1 fits both.","Find the slope and equation through (2,7) and (5,16).","Slope=9/3=3. With (2,7), b=7−3×2=1; y=3x+1.","Subtract y-values and x-values in matching point order; never divide by zero."],
3:["Functions as input–output rules","For f(x)=2x−3, f(4)=8−3=5; each input has exactly one output.","If g(x)=−3x+7, find g(−2) and g(5).","g(−2)=13; g(5)=−8.","The value of f(4) is an output, not the x-coordinate itself."],
4:["Slope and y-intercept","For y=−2x+5, slope is −2 and the y-intercept is (0,5). Every +1 in x lowers y by 2.","Find slope, intercept, and y when x=3 for y=4x−1.","Slope=4; intercept=(0,−1); at x=3, y=11.","The intercept is the output when x=0, not automatically the point (1,b)."],
5:["Systems of two equations","Solve y=x+2 and y=2x−1: x+2=2x−1 so x=3, then y=5.","Solve y=3x+1 and y=x+7.","3x+1=x+7 gives 2x=6; x=3, y=10.","An intersection must satisfy both equations, not just one."],
6:["Integer exponents and scientific notation","3.2×10⁴=32,000; moving the decimal four places multiplies by 10,000.","Express 0.00056 in scientific notation and evaluate 2³×2².","5.6×10⁻⁴; 2⁵=32.","When multiplying powers with the same base, add exponents rather than multiplying them."],
7:["Coordinate transformations and congruence","Translate (−2,3) by (+5,−4): new point (3,−1). Translation preserves side lengths.","Translate (4,−1) by (−6,+3). What happens to congruence?","(−2,2); the figure remains congruent.","A translation moves the shape without resizing it."],
8:["Dilations and similarity","Dilate (2,−3) about the origin by factor 2: (4,−6); lengths double, angles remain.","Dilate (−4,6) about the origin by factor 1/2.","(−2,3); the image is similar and each length is half.","Dilations preserve angle measures but generally not lengths."],
9:["Pythagorean theorem","A right triangle with legs 6 and 8 has c²=36+64=100, so c=10.","Find the hypotenuse for legs 5 and 12.","c=√(25+144)=√169=13.","Apply a²+b²=c² only to right triangles with c opposite the right angle."],
10:["Volume modeling","A cylinder with radius 3 and height 5 has V=πr²h=45π cubic units.","Find the volume of a cylinder with radius 2 cm and height 7 cm.","V=π(2²)(7)=28π cm³, about 87.96 cm³.","Area uses square units; volume uses cubic units."],
11:["Bivariate data and association","Data (1,3),(2,5),(3,7) follow y=2x+1. The positive slope means y rises with x.","Check whether (1,4),(2,7),(3,10) follow a linear rule; write the rule.","Yes: y=3x+1.","Association alone does not establish causation."],
12:["Probability and risk","A bag with 3 red and 2 blue counters gives P(red)=3/5=60% on a random draw.","With 4 green, 5 yellow, and 1 blue counter, find P(yellow).","5/10=1/2=50%.","Probability is not a guarantee for an individual draw."],
13:["Pattern evidence and proportional reasoning","A reading log grows from 40 to 60 pages: increase=20 pages, 20/40=50%.","A class reads 24 pages on Monday and 36 on Tuesday. Find the percent increase.","(36−24)/24=0.5=50%.","Divide the change by the original amount, not the final amount."],
14:["Testing a numerical claim","A report claiming 75% of 40 pupils equals 30 pupils checks out because 0.75×40=30.","Someone claims 45% of 60 is 24. Check and correct.","0.45×60=27, so the claim is false.","Check arithmetic independently before repeating a headline."],
15:["Research data and averages","Mean of 4,8,12 is (4+8+12)/3=8.","Find the mean of 5,9,10,16 and identify the effect of adding 40.","Mean=10. With 40 added, mean becomes 16.","Large outliers can pull the mean; consider the median too."],
16:["Numeric patterns in rhythm","A rhythm repeats every 3 beats. The 5th cycle finishes on beat 15 (=3×5).","A poem uses 4 beats per line across 7 lines. How many beats?","4×7=28 beats.","Regular rhythm can be modeled mathematically without claiming every poem follows a fixed meter."],
17:["Midyear algebra review","Solve 3x+4=19 by subtracting 4 then dividing by 3: x=5.","Solve 5(2x−1)=35.","10x−5=35; 10x=40; x=4.","Distribute multiplication across every term in parentheses."],
18:["Conservation and proportional quantities","If 12 g react with 8 g in a closed system, total mass afterward is 20 g.","A closed container begins with 15 g and 27 g of reactants. Find product mass total.","15+27=42 g, if the full contents are measured.","Conservation of mass does not imply each individual substance keeps the same mass."],
19:["Motion as a linear relationship","At constant speed 4 m/s, distance d=4t. After 7 s, d=28 m.","At 6 m/s, how far does an object travel in 9 seconds?","d=6×9=54 m.","Speed is distance divided by time; always label units."],
20:["Wave frequency and period","At frequency 5 Hz there are 5 cycles each second; in 4 seconds that is 20 cycles.","At 8 Hz, how many cycles occur in 3.5 seconds?","8×3.5=28 cycles.","Frequency counts cycles per second; period is seconds per cycle."],
21:["Cosmic-scale scientific notation","6×10⁶ km equals 6,000,000 km; 6×10⁶ is ten times 6×10⁵.","Convert 4.2×10⁷ to ordinary notation.","42,000,000.","An exponent changes the scale by powers of ten."],
22:["Geologic time as a number line","A fossil dated 150 million years ago is 50 million years older than one dated 100 million years ago.","How much older is a 230-million-year-old rock than a 175-million-year-old rock?","230−175=55 million years.","Larger years-ago values describe older events."],
23:["Genetic probability models","For two equally likely outcomes, one favorable yields 1/2=50% theoretical probability.","If a model has 4 equally likely combinations and 3 show a trait, what is predicted probability?","3/4=75%.","A probability model predicts chances, not a certain result for every family."],
24:["Ecosystem percentage change","A population falling from 200 to 150 drops by 50/200=25%.","A sample count rises from 80 to 100. Find its percent change.","(100−80)/80=25% increase.","Always use the starting count as the comparison base."],
25:["Civic budgets and percentages","If a $200 budget sets aside 15% for books, books receive $30.","A $500 community budget reserves 12% for accessibility. How much is that?","0.12×500=$60.","Percentage allocation describes a share; it is not proof of policy quality."],
26:["Historical numerical evidence","An index rises from 80 to 100: change=20, so the proportional increase is 25%.","A dataset grows from 120 to 150. Calculate the absolute and percent change.","30 units; 30/120=25%.","Do not confuse absolute change with percentage change."],
27:["Ratios in representation","A council has 4 representatives for 2 regions, or 2 per region if evenly allocated.","If 18 delegates serve 6 equal districts, how many per district?","18/6=3 delegates per district.","An equal average may conceal differences in actual representation."],
28:["Scale and mapping","At 1 cm=5 km, a 7 cm map distance represents 35 km.","A map uses 2 cm=9 km. Find the real distance for 6 cm.","6/2×9=27 km.","Keep the scale units consistent."],
29:["Time-series reading","Data 20,25,30 show a rise of 5 per interval, but three points alone do not prove future trends.","A series 12,18,24 rises evenly; predict the next value under the same rule.","30, assuming the +6 rule continues.","Extrapolating beyond observed data adds uncertainty."],
30:["Personal finance and budgeting","Income $120, expenses $95, remaining balance $25.","With $280 available and expenses $145 plus $67, how much remains?","$280−$145−$67=$68.","Balance is income minus expenses; a positive balance is not automatically savings."],
31:["Language study as comparative data","If 18 of 30 terms are cognates, that is 18/30=60%.","In a set of 40 words, 14 share a pattern. What fraction and percentage is that?","14/40=7/20=35%.","A shared spelling pattern does not guarantee identical meaning."],
32:["Algorithmic pattern testing","The rule y=2x+1 returns 7 when x=3 and 11 when x=5.","Test the rule y=4x−2 for x=0,2,5.","Outputs: −2,6,18.","A tested algorithm still needs boundary and error cases."],
33:["Time management and proportions","Four 25-minute study blocks take 100 minutes, plus 3 five-minute breaks =115 minutes.","Three 30-minute study blocks with two 10-minute breaks last how long?","90+20=110 minutes.","Plan breaks between blocks, not automatically after the final one."],
34:["Capstone data modeling","Data (0,2),(1,5),(2,8) follow y=3x+2; explain rate and starting value.","Find a rule for (0,4),(1,6),(2,8) and predict at x=5.","y=2x+4; when x=5, y=14.","Models summarize data under assumptions; check whether those assumptions hold."],
35:["Graph evidence and presentation","A chart labeled 0,10,20 on the y-axis makes a rise from 10 to 20 visible without hiding the baseline.","A quantity rises from 30 to 45. Give the numerical and percent change.","15; 15/30=50%.","A truncated axis can exaggerate a visual difference."],
36:["Final review and transition","The line y=2x−1 gives y=7 at x=4. Checking by substitution confirms the result.","Solve 2(x+3)=16 and evaluate y=3x−2 using that x.","x=5; y=13.","A final answer without substitution or units can hide errors."]
};
const lesson=lessons[week];if(!lesson)return;
const articles=[...document.querySelectorAll("main article.lesson")];
if(articles.length<5)return;
const style=document.createElement("style");
style.textContent=".grade8-math-studio{border:1px solid #d7c9a8;border-radius:7px;background:#fbf9f4;padding:16px;margin:14px 0;color:#111827;text-align:left}.grade8-math-studio h5{font-size:1.04rem;margin:0 0 8px;color:#172f37;font-weight:600}.grade8-math-studio p{margin:8px 0;line-height:1.55}.grade8-math-studio details{margin-top:9px;padding:9px;border:1px solid #cbd5e1;border-radius:7px}.grade8-math-studio summary{cursor:pointer;font-weight:600}.grade8-math-studio:focus-within{outline:2px solid #4f7f7a}";document.head.appendChild(style);
function block(article,title,paragraphs,answer){
 const div=document.createElement("section");div.className="grade8-math-studio";
 const h=document.createElement("h5");h.textContent=title;div.append(h);
 for(const p of paragraphs){const el=document.createElement("p");el.textContent=p;div.append(el)}
 if(answer){const details=document.createElement("details");const summary=document.createElement("summary");summary.textContent="Show the worked answer";const p=document.createElement("p");p.textContent=answer;details.append(summary,p);div.append(details)}
 article.appendChild(div);
}
for(const article of articles){for(const p of article.querySelectorAll("p")){const first=p.querySelector("strong:first-child");if(first?.textContent.trim()==="Focus:"){p.replaceChildren(first,document.createTextNode(" "+lesson[0]));}}}
block(articles[0],"Learn it — explicit worked example",[lesson[0]+".",lesson[1]],null);
block(articles[1],"Your turn — guided exercise",[lesson[2],"Write each calculation and show how you checked your answer."],lesson[3]);
block(articles[2],"Application and evidence",["Create a labelled diagram, table, or graph that illustrates this week's mathematical idea: "+lesson[0]+".","Explain what the model makes clearer, and where its limitations are."],null);
block(articles[3],"Misconception check",[lesson[4],"Explain in your own words why this warning matters, using one correct and one incorrect example."],null);
block(articles[4],"Independent mastery and portfolio",["Redo the guided exercise without looking at the answer, show all steps, and verify by substitution, estimation, or a second method.","Include the task, your reasoning, any corrections, and one new example in your portfolio. Only authorized adult review may record formal mastery."],null);
window.KhaemenesGrade8MathDepth=Object.freeze({version:"1.0.0",week,focus:lesson[0]});
})();
