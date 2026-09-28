// ScholarCompass SAT Math exercise bank.
//
// HOW TO ADD A QUESTION LATER
//   1. Add one mc(...) (or spr(...)) line to the right domain block below.
//      Use a new unique id (e.g. A11, B11, C11, D11).
//   2. Run `npm run gen:sat-math-key` — it rewrites the answer-key section
//      of supabase/sat_math_1v1_schema.sql from this file.
//   3. Re-run that SQL file in the Supabase SQL Editor (it is safe to re-run).
//      Until step 3 is done the new question shows up on the practice page
//      but is not drawn for 1v1 matches (the server only deals questions it
//      has an answer key for).
//   `npm test` fails if a question is malformed or the SQL key is out of sync.
//
// Math is written in LaTeX: $$ ... $$ for display math, \( ... \) for inline.
// String.raw keeps the backslashes intact.

const r = String.raw;

export const SAT_MATH_DOMAINS = [
  { id: "algebra", label: "Algebra", short: "Algebra" },
  { id: "advanced-math", label: "Advanced Math", short: "Advanced Math" },
  { id: "data-analysis", label: "Problem-Solving & Data Analysis", short: "Data Analysis" },
  { id: "geometry-trig", label: "Geometry & Trigonometry", short: "Geometry & Trig" },
];

export const SAT_MATH_DIFFICULTIES = [
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" },
];

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Multiple choice: options is an array of strings, answer is a letter.
function mc(id, domain, difficulty, topic, prompt, options, answer, explanation) {
  return {
    id,
    domain,
    difficulty,
    topic,
    type: "mc",
    prompt,
    options: options.map((text, i) => ({ id: LETTERS[i], text })),
    answer,
    explanation,
  };
}

// Student-produced response (grid-in): answer is the accepted text, e.g. "6" or "7/3".
// None of the current 40 questions use this, but the page and the 1v1 server support it.
// eslint-disable-next-line no-unused-vars
function spr(id, domain, difficulty, topic, prompt, answer, explanation) {
  return { id, domain, difficulty, topic, type: "spr", prompt, options: [], answer, explanation };
}

export const SAT_MATH_QUESTIONS = [
  // ---------------------------------------------------------------- ALGEBRA
  mc("A01", "algebra", "easy", "Linear Equations",
    r`If $$3x+7=25$$ what is the value of \(x\)?`,
    ["4", "5", "6", "7"], "C",
    r`Subtract 7 from both sides: \(3x=18\), so \(x=6\).`),
  mc("A02", "algebra", "easy", "Linear Functions",
    r`A linear function \(f\) satisfies \(f(2)=11\) and has a slope of 4. What is \(f(5)\)?`,
    ["19", "21", "23", "25"], "C",
    r`A slope of 4 means \(f\) rises 4 for every 1 step in \(x\). From \(x=2\) to \(x=5\) is 3 steps, so \(f(5)=11+4(3)=23\).`),
  mc("A03", "algebra", "easy", "Systems of Equations",
    r`If $$x+y=11$$ and $$2x-y=7,$$ what is the value of \(x\)?`,
    ["4", "5", "6", "7"], "C",
    r`Add the two equations to eliminate \(y\): \(3x=18\), so \(x=6\).`),
  mc("A04", "algebra", "medium", "Linear Inequalities",
    r`Which inequality is equivalent to $$5-2x<17?$$`,
    [r`\(x<-6\)`, r`\(x>-6\)`, r`\(x<6\)`, r`\(x>6\)`], "B",
    r`Subtract 5: \(-2x<12\). Dividing by \(-2\) flips the inequality sign, so \(x>-6\).`),
  mc("A05", "algebra", "medium", "Linear Equations in Two Variables",
    r`A line passes through \((2,1)\) and is parallel to $$3x-2y=8.$$ Which equation represents the line?`,
    [r`\(3x-2y=4\)`, r`\(3x-2y=8\)`, r`\(2x-3y=4\)`, r`\(2x-3y=8\)`], "A",
    r`Parallel lines keep the same \(x\) and \(y\) coefficients, so the line is \(3x-2y=c\). Substituting \((2,1)\): \(c=3(2)-2(1)=4\).`),
  mc("A06", "algebra", "medium", "Linear Word Problem",
    r`A taxi charges a fixed fee of $5 plus $1.80 per kilometer. If a passenger pays $23 in total, how many kilometers did the passenger travel?`,
    ["8", "9", "10", "12"], "C",
    r`Write \(5+1.8k=23\). Then \(1.8k=18\), so \(k=10\).`),
  // NOTE: the source bank said 26 tickets for $161, which has no whole-number
  // solution (3a = 31). Total changed to $169 so the intended answer (13) is valid.
  mc("A07", "algebra", "medium", "Systems of Equations",
    r`A school sells adult tickets for $8 and student tickets for $5. A total of 26 tickets are sold for $169. How many adult tickets were sold?`,
    ["11", "13", "15", "17"], "B",
    r`Let \(a\) be adult tickets, so students sold \(26-a\). Then \(8a+5(26-a)=169\), which gives \(3a+130=169\), so \(3a=39\) and \(a=13\).`),
  mc("A08", "algebra", "hard", "Linear Functions",
    r`A linear function is given by $$f(x)=3x-12.$$ For what value of \(x\) is \(f(x)=0\)?`,
    ["2", "3", "4", "6"], "C",
    r`Solve \(3x-12=0\): \(3x=12\), so \(x=4\).`),
  mc("A09", "algebra", "hard", "Systems with Parameters",
    r`The system $$x+2y=7$$ $$3x+ky=11$$ has no solution. What is the value of \(k\)?`,
    ["3", "4", "6", "8"], "C",
    r`No solution means the lines are parallel but different. Multiplying the first equation by 3 gives \(3x+6y=21\). For the same slope, \(k=6\); then \(3x+6y=21\) and \(3x+6y=11\) can never both be true.`),
  mc("A10", "algebra", "hard", "Linear Systems / Infinite Solutions",
    r`The equations $$x+2y=8$$ and $$3x+6y=b$$ represent the same line. What is the value of \(b\)?`,
    ["8", "16", "24", "32"], "C",
    r`Multiplying \(x+2y=8\) by 3 gives \(3x+6y=24\). For the equations to be the same line, \(b=24\).`),

  // ---------------------------------------------------------- ADVANCED MATH
  mc("B01", "advanced-math", "easy", "Quadratics / Factoring",
    r`Which expression is equivalent to $$x^2-9x+20?$$`,
    [r`\((x-2)(x-10)\)`, r`\((x-4)(x-5)\)`, r`\((x+4)(x+5)\)`, r`\((x-1)(x-20)\)`], "B",
    r`Find two numbers that multiply to 20 and add to \(-9\): \(-4\) and \(-5\). So the expression is \((x-4)(x-5)\).`),
  mc("B02", "advanced-math", "easy", "Quadratic Functions / Vertex",
    r`The function $$f(x)=(x-3)^2-7$$ has its vertex at which point?`,
    [r`\((-3,-7)\)`, r`\((3,-7)\)`, r`\((-3,7)\)`, r`\((3,7)\)`], "B",
    r`In vertex form \(f(x)=(x-h)^2+k\), the vertex is \((h,k)\). Here \(h=3\) and \(k=-7\).`),
  mc("B03", "advanced-math", "medium", "Exponential Functions",
    r`A population is initially 500 and increases by 8% each year. What will the population be after 2 years?`,
    ["540", "560", "583.2", "600"], "C",
    r`Growth of 8% per year multiplies by 1.08 each year: \(500(1.08)^2=500(1.1664)=583.2\).`),
  mc("B04", "advanced-math", "medium", "Rational Equations",
    r`For \(x\neq2\), $$\frac{1}{x-2}=3.$$ What is \(x\)?`,
    [r`\(\frac{5}{3}\)`, "2", "3", r`\(\frac{7}{3}\)`], "D",
    r`Multiply both sides by \(x-2\): \(1=3(x-2)\). So \(x-2=\frac{1}{3}\) and \(x=\frac{7}{3}\).`),
  mc("B05", "advanced-math", "medium", "Radical Equations",
    r`If $$\sqrt{x+4}=x-2,$$ what is the value of \(x\)?`,
    ["0", "2", "4", "5"], "D",
    r`Square both sides: \(x+4=x^2-4x+4\), so \(x^2-5x=0\) and \(x=0\) or \(x=5\). Check: \(x=0\) gives \(2=-2\) (extraneous). \(x=5\) gives \(3=3\), which works.`),
  mc("B06", "advanced-math", "medium", "Equivalent Expressions / Completing the Square",
    r`Which expression is equivalent to $$2x^2+12x+7?$$`,
    [r`\(2(x+3)^2-11\)`, r`\(2(x+6)^2-29\)`, r`\(2(x+3)^2+11\)`, r`\(2(x-3)^2-11\)`], "A",
    r`Factor 2 from the \(x\)-terms: \(2(x^2+6x)+7\). Complete the square: \(2[(x+3)^2-9]+7=2(x+3)^2-11\).`),
  // NOTE: the source bank asked for "the positive value of y", but both solutions
  // (y = 9 and y = 1) are positive. Reworded to "the greater value of y".
  mc("B07", "advanced-math", "hard", "Nonlinear Systems",
    r`The system $$y=x^2$$ and $$y=2x+3$$ has two solutions. What is the greater value of \(y\) among the two solutions?`,
    ["3", "5", "9", "12"], "C",
    r`Set \(x^2=2x+3\), so \(x^2-2x-3=0\) and \((x-3)(x+1)=0\). Then \(x=3\) or \(x=-1\), giving \(y=9\) or \(y=1\). The greater value is 9.`),
  mc("B08", "advanced-math", "hard", "Quadratics / Discriminant",
    r`The equation $$x^2-6x+k=0$$ has exactly one real solution. What is \(k\)?`,
    ["6", "9", "12", "18"], "B",
    r`Exactly one real solution means the discriminant is 0: \((-6)^2-4(1)(k)=0\), so \(36-4k=0\) and \(k=9\).`),
  mc("B09", "advanced-math", "hard", "Polynomial Functions",
    r`The polynomial $$x^3-4x^2-x+4$$ can be factored completely. What is the sum of its positive roots?`,
    ["3", "4", "5", "6"], "C",
    r`Factor by grouping: \(x^2(x-4)-(x-4)=(x-4)(x^2-1)=(x-4)(x-1)(x+1)\). The roots are 4, 1 and \(-1\). The positive roots sum to \(4+1=5\).`),
  mc("B10", "advanced-math", "hard", "Exponential Equations",
    r`If $$2^{x+1}=16^{x-1},$$ what is \(x\)?`,
    ["1", r`\(\frac{4}{3}\)`, r`\(\frac{5}{3}\)`, "2"], "C",
    r`Write 16 as \(2^4\): \(2^{x+1}=2^{4(x-1)}\). Equal bases mean equal exponents: \(x+1=4x-4\), so \(5=3x\) and \(x=\frac{5}{3}\).`),

  // ------------------------------------------- PROBLEM-SOLVING & DATA ANALYSIS
  mc("C01", "data-analysis", "easy", "Ratios",
    r`The ratio of boys to girls in a class is \(3:5\). There are 64 students in total. How many are girls?`,
    ["24", "32", "40", "48"], "C",
    r`The ratio has \(3+5=8\) parts, so girls are \(\frac{5}{8}\) of the class: \(\frac{5}{8}\times64=40\).`),
  mc("C02", "data-analysis", "easy", "Percentages",
    r`A jacket's price increases from $240 to $300. What is the percentage increase?`,
    ["20%", "25%", "30%", "35%"], "B",
    r`The increase is \(300-240=60\). Percentage increase is \(\frac{60}{240}=0.25=25\%\).`),
  mc("C03", "data-analysis", "easy", "Mean, Median, Range",
    r`The numbers are: $$4,\ 7,\ 7,\ 10,\ 12$$ What is the range?`,
    ["5", "6", "7", "8"], "D",
    r`Range is the largest value minus the smallest: \(12-4=8\).`),
  mc("C04", "data-analysis", "medium", "Conditional Probability",
    r`In a group of 24 students who studied for a test, 15 passed. What is the probability that a randomly selected student from those who studied passed?`,
    [r`\(\frac{5}{8}\)`, r`\(\frac{3}{5}\)`, r`\(\frac{15}{40}\)`, r`\(\frac{9}{24}\)`], "A",
    r`Probability is favorable outcomes over total outcomes: \(\frac{15}{24}=\frac{5}{8}\).`),
  mc("C05", "data-analysis", "easy", "Rates / Units",
    r`A car travels 360 kilometers using 24 liters of fuel. What is the car's average fuel efficiency, in kilometers per liter?`,
    ["12", "15", "18", "20"], "B",
    r`Divide distance by fuel: \(\frac{360}{24}=15\) kilometers per liter.`),
  mc("C06", "data-analysis", "medium", "Two-Variable Data",
    r`A model relating study time \(x\), in hours, to predicted score \(y\) is $$y=2.5x+80.$$ What does the value 2.5 represent?`,
    ["The predicted score when no studying occurs", "The number of hours needed to earn 80 points", "The predicted increase in score for each additional hour studied", "The maximum possible score"], "C",
    r`In \(y=mx+b\), the slope \(m\) is the change in \(y\) for each 1-unit increase in \(x\). So 2.5 is the predicted score increase per extra hour of study. (The value 80 is the predicted score with no studying.)`),
  mc("C07", "data-analysis", "medium", "Margin of Error",
    r`A survey estimates that 52% of students prefer online homework, with a margin of error of \(\pm5\) percentage points. Which interval represents the likely range for the population proportion?`,
    ["42%–52%", "47%–57%", "50%–55%", "52%–57%"], "B",
    r`Go 5 points below and 5 points above the estimate: \(52-5=47\) and \(52+5=57\), so 47%–57%.`),
  mc("C08", "data-analysis", "medium", "Evaluating Statistical Claims",
    r`Researchers want to determine whether a new teaching method causes students' test scores to increase. Which study design would provide the strongest evidence of a causal relationship?`,
    ["Ask students whether they like the new method.", "Observe schools that already use the method.", "Randomly assign students to either the new method or the traditional method.", "Compare students' scores from different years."], "C",
    r`Random assignment makes the two groups comparable apart from the method, so differences in scores can be attributed to the method. The other designs can be affected by other differences between groups.`),
  mc("C09", "data-analysis", "medium", "Sample Proportion",
    r`A random sample of 120 students contains 78 students who support a proposed school policy. What is the sample proportion of students who support the policy?`,
    ["52%", "60%", "65%", "78%"], "C",
    r`Sample proportion is \(\frac{78}{120}=0.65=65\%\).`),
  mc("C10", "data-analysis", "hard", "Measures of Spread",
    r`Two data sets have the same mean. In Data Set A, the values are generally close to the mean. In Data Set B, the values are much farther from the mean. Which statement is most likely true?`,
    ["Data Set A has a larger standard deviation.", "Data Set B has a larger standard deviation.", "Both have the same standard deviation.", "The standard deviation cannot be compared."], "B",
    r`Standard deviation measures how far values typically are from the mean. Values that are farther from the mean mean a larger standard deviation, so Data Set B has the larger one.`),

  // ------------------------------------------------ GEOMETRY & TRIGONOMETRY
  mc("D01", "geometry-trig", "easy", "Angles in a Triangle",
    r`A triangle has angles measuring \(50^\circ\), \((2x+10)^\circ\), and \((3x)^\circ\). What is \(x\)?`,
    ["20", "22", "24", "26"], "C",
    r`Angles in a triangle sum to \(180^\circ\): \(50+(2x+10)+3x=180\), so \(5x+60=180\) and \(x=24\).`),
  mc("D02", "geometry-trig", "easy", "Area",
    r`A rectangle has length 12 and width 7. What is its area?`,
    ["38", "72", "84", "96"], "C",
    r`Area is length times width: \(12\times7=84\).`),
  mc("D03", "geometry-trig", "easy", "Circles",
    r`A circle has a circumference of \(18\pi\). What is its radius?`,
    ["6", "8", "9", "18"], "C",
    r`Circumference is \(2\pi r\), so \(2\pi r=18\pi\) and \(r=9\).`),
  mc("D04", "geometry-trig", "medium", "Similar Figures / Scale Factor",
    r`Two similar figures have side lengths in the ratio \(3:5\). The area of the smaller figure is 36. What is the area of the larger figure?`,
    ["60", "75", "90", "100"], "D",
    r`Areas of similar figures are in the ratio of the squares of the side lengths: \(3^2:5^2=9:25\). So the larger area is \(36\times\frac{25}{9}=100\).`),
  mc("D05", "geometry-trig", "easy", "Pythagorean Theorem",
    r`A right triangle has legs of length 9 and 12. What is the length of the hypotenuse?`,
    ["13", "15", "18", "21"], "B",
    r`\(\sqrt{9^2+12^2}=\sqrt{81+144}=\sqrt{225}=15\). (This is a 3-4-5 triangle scaled by 3.)`),
  mc("D06", "geometry-trig", "medium", "Trigonometry",
    r`For an acute angle \(\theta\), $$\sin\theta=\frac{3}{5}.$$ What is \(\cos\theta\)?`,
    [r`\(\frac{2}{5}\)`, r`\(\frac{3}{5}\)`, r`\(\frac{4}{5}\)`, r`\(\frac{5}{3}\)`], "C",
    r`Use \(\sin^2\theta+\cos^2\theta=1\): \(\cos^2\theta=1-\frac{9}{25}=\frac{16}{25}\). Since \(\theta\) is acute, \(\cos\theta=\frac{4}{5}\).`),
  mc("D07", "geometry-trig", "medium", "Circle Equation",
    r`The equation $$(x-2)^2+(y+1)^2=25$$ represents a circle. What is its center?`,
    [r`\((-2,1)\)`, r`\((2,-1)\)`, r`\((2,1)\)`, r`\((-2,-1)\)`], "B",
    r`A circle \((x-h)^2+(y-k)^2=r^2\) has center \((h,k)\). Here \(x-2\) gives \(h=2\), and \(y+1=y-(-1)\) gives \(k=-1\).`),
  mc("D08", "geometry-trig", "medium", "Volume",
    r`A cylinder has radius 4 and volume \(96\pi\). What is its height?`,
    ["4", "5", "6", "8"], "C",
    r`Volume is \(\pi r^2h\): \(96\pi=\pi(16)h\), so \(h=6\).`),
  mc("D09", "geometry-trig", "medium", "Parallel Lines",
    r`Two parallel lines are cut by a transversal. One of the angles measures \(68^\circ\). What is the measure of the corresponding angle?`,
    [r`\(22^\circ\)`, r`\(68^\circ\)`, r`\(112^\circ\)`, r`\(136^\circ\)`], "B",
    r`Corresponding angles formed by parallel lines and a transversal are equal, so the answer is \(68^\circ\).`),
  mc("D10", "geometry-trig", "hard", "30-60-90 Triangle",
    r`A \(30^\circ\)-\(60^\circ\)-\(90^\circ\) triangle has a hypotenuse of 14. What is the length of its longer leg?`,
    ["7", r`\(7\sqrt2\)`, r`\(7\sqrt3\)`, r`\(14\sqrt3\)`], "C",
    r`In a 30-60-90 triangle the sides are in the ratio \(1:\sqrt3:2\). The hypotenuse is 14, so the short leg is 7 and the longer leg is \(7\sqrt3\).`),
];

export function getSatMathQuestion(id) {
  return SAT_MATH_QUESTIONS.find((q) => q.id === id) || null;
}

export function satMathDomainLabel(domainId) {
  return SAT_MATH_DOMAINS.find((d) => d.id === domainId)?.label || domainId;
}

// Compares a student's answer to the stored answer. MC answers are letters;
// SPR answers are compared as trimmed text (or as equal numbers, so "7/3" and
// "2.3333" would need to be listed explicitly — keep SPR answers to one form).
export function isSatMathAnswerCorrect(question, given) {
  if (given === null || given === undefined) return false;
  const a = String(given).trim().toLowerCase();
  const b = String(question.answer).trim().toLowerCase();
  return a !== "" && a === b;
}
