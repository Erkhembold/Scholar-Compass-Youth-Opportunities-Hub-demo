// ScholarCompass IELTS Writing exercises: short, single-answer drills
// (grammar, style, coherence, Task 1/2 sentence-level judgment) — distinct
// from the full essay-grading flow in WritingTaskPage.jsx. Same `mc` schema
// as ieltsReadingExercises.js so IeltsExercisesPage.jsx's exercise runner
// works for both unchanged; `passage` holds any context/data the question
// needs and is empty for pure sentence-choice items (the runner hides the
// passage box when it's empty).

export const WRITING_SKILL_TAGS = [
  "argument_development",
  "articles",
  "cause_effect",
  "coherence",
  "concision",
  "conclusion",
  "formal_language",
  "grammar",
  "paraphrasing",
  "prepositions",
  "pronoun_reference",
  "sentence_combination",
  "sentence_improvement",
  "subject_verb_agreement",
  "supporting_sentence",
  "task1",
  "thesis",
  "topic_sentence",
  "transition",
  "verb_form",
  "word_choice",
];

export const IELTS_WRITING_EXERCISES = [
  {
    id: "W-MC-001",
    type: "mc",
    difficulty: "easy",
    skill: "grammar",
    passage: "",
    question: "Choose the correct sentence.",
    options: [
      { id: "A", text: "Many student prefers online learning." },
      { id: "B", text: "Many students prefers online learning." },
      { id: "C", text: "Many students prefer online learning." },
      { id: "D", text: "Many student prefer online learning." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-002",
    type: "mc",
    difficulty: "easy",
    skill: "articles",
    passage: "",
    question: "Choose the correct sentence.",
    options: [
      { id: "A", text: "University can be expensive for international students." },
      { id: "B", text: "A university can be expensive for international students." },
      { id: "C", text: "An university can be expensive for international students." },
      { id: "D", text: "The university can be expensive for international students." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-003",
    type: "mc",
    difficulty: "easy",
    skill: "subject_verb_agreement",
    passage: "",
    question: "Choose the correct sentence.",
    options: [
      { id: "A", text: "The number of students are increasing." },
      { id: "B", text: "The number of students is increasing." },
      { id: "C", text: "The number of students increase." },
      { id: "D", text: "The number of students have increased." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-004",
    type: "mc",
    difficulty: "easy",
    skill: "prepositions",
    passage: "",
    question: "She is interested ___ studying engineering abroad.",
    options: [
      { id: "A", text: "on" },
      { id: "B", text: "at" },
      { id: "C", text: "in" },
      { id: "D", text: "for" }
    ],
    answer: "C",
  },
  {
    id: "W-MC-005",
    type: "mc",
    difficulty: "easy",
    skill: "formal_language",
    passage: "",
    question: "Which sentence is more appropriate for IELTS Writing?",
    options: [
      { id: "A", text: "Kids nowadays don't really care about reading." },
      { id: "B", text: "Young people nowadays aren't that into reading." },
      { id: "C", text: "Many young people today show less interest in reading." },
      { id: "D", text: "Kids these days are kinda bad at reading." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-006",
    type: "mc",
    difficulty: "easy",
    skill: "verb_form",
    passage: "",
    question: "Choose the correct sentence.",
    options: [
      { id: "A", text: "Students should studies regularly." },
      { id: "B", text: "Students should studying regularly." },
      { id: "C", text: "Students should study regularly." },
      { id: "D", text: "Students should studied regularly." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-007",
    type: "mc",
    difficulty: "easy",
    skill: "transition",
    passage: "",
    question: "Many students work part-time. ______, employment can help them develop practical skills.",
    options: [
      { id: "A", text: "However" },
      { id: "B", text: "In addition" },
      { id: "C", text: "Nevertheless" },
      { id: "D", text: "On the contrary" }
    ],
    answer: "B",
  },
  {
    id: "W-MC-008",
    type: "mc",
    difficulty: "easy",
    skill: "pronoun_reference",
    passage: "",
    question: "Choose the clearest sentence.",
    options: [
      { id: "A", text: "The school introduced a new policy, and this improved attendance." },
      { id: "B", text: "The school introduced a new policy, and it improved attendance." },
      { id: "C", text: "The school introduced a new policy, and that improved it." },
      { id: "D", text: "The school introduced a new policy, which they improved attendance." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-009",
    type: "mc",
    difficulty: "medium",
    skill: "sentence_combination",
    passage: "The city built more bicycle lanes. Cycling became more popular.",
    question: "Combine the ideas most effectively.",
    options: [
      { id: "A", text: "The city built more bicycle lanes, cycling became more popular." },
      { id: "B", text: "The city built more bicycle lanes, and cycling became more popular." },
      { id: "C", text: "The city built more bicycle lanes cycling became more popular." },
      { id: "D", text: "The city built more bicycle lanes because cycling became more popular." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-010",
    type: "mc",
    difficulty: "medium",
    skill: "thesis",
    passage: "Topic: Should school students have homework every day?",
    question: "Which sentence is the best thesis?",
    options: [
      { id: "A", text: "Homework is a very interesting topic." },
      { id: "B", text: "This essay will discuss homework." },
      { id: "C", text: "Daily homework can reinforce learning, but excessive assignments may increase stress and reduce students' free time." },
      { id: "D", text: "Students have homework every day in many schools." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-011",
    type: "mc",
    difficulty: "medium",
    skill: "topic_sentence",
    passage: "",
    question: "Which sentence is the best topic sentence for a paragraph about public transport?",
    options: [
      { id: "A", text: "Public transport is a popular topic." },
      { id: "B", text: "There are buses and trains in many cities." },
      { id: "C", text: "Improving public transport can reduce traffic congestion and make commuting more efficient." },
      { id: "D", text: "People travel for many different reasons." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-012",
    type: "mc",
    difficulty: "medium",
    skill: "supporting_sentence",
    passage: "Idea: Governments should encourage recycling.",
    question: "Which sentence best develops the idea?",
    options: [
      { id: "A", text: "Recycling is something many people know about." },
      { id: "B", text: "Recycling can reduce the amount of waste sent to landfills and conserve some natural resources." },
      { id: "C", text: "People have different opinions about rubbish." },
      { id: "D", text: "Governments are large organizations." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-013",
    type: "mc",
    difficulty: "medium",
    skill: "transition",
    passage: "",
    question: "Some students prefer studying alone. ______, others perform better when they can discuss difficult ideas with classmates.",
    options: [
      { id: "A", text: "Similarly" },
      { id: "B", text: "However" },
      { id: "C", text: "Therefore" },
      { id: "D", text: "For example" }
    ],
    answer: "B",
  },
  {
    id: "W-MC-014",
    type: "mc",
    difficulty: "medium",
    skill: "word_choice",
    passage: "",
    question: "The government should ______ more money to public transport.",
    options: [
      { id: "A", text: "allocate" },
      { id: "B", text: "attend" },
      { id: "C", text: "achieve" },
      { id: "D", text: "persuade" }
    ],
    answer: "A",
  },
  {
    id: "W-MC-015",
    type: "mc",
    difficulty: "medium",
    skill: "coherence",
    passage: "As a result, students may concentrate more effectively.\nA quiet study environment can support learning.\nLoud conversations and phone notifications can interrupt concentration.\nFor this reason, many students choose libraries for revision.",
    question: "Put the sentences in the best order.",
    options: [
      { id: "A", text: "2 → 3 → 1 → 4" },
      { id: "B", text: "3 → 2 → 4 → 1" },
      { id: "C", text: "1 → 3 → 2 → 4" },
      { id: "D", text: "4 → 2 → 3 → 1" }
    ],
    answer: "A",
  },
  {
    id: "W-MC-016",
    type: "mc",
    difficulty: "medium",
    skill: "coherence",
    passage: "Public libraries provide free access to books, computers and study spaces. They are particularly valuable for students who may not have suitable study environments at home.",
    question: "Which sentence is the best conclusion to this paragraph?",
    options: [
      { id: "A", text: "Libraries are buildings found in many cities." },
      { id: "B", text: "Therefore, public libraries can play an important role in supporting education." },
      { id: "C", text: "Students also enjoy sports." },
      { id: "D", text: "Books have existed for centuries." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-017",
    type: "mc",
    difficulty: "medium",
    skill: "paraphrasing",
    passage: "Original: Many people believe that online learning is more convenient than traditional classroom study.",
    question: "Which is the best paraphrase?",
    options: [
      { id: "A", text: "A lot of people think online education offers greater convenience than face-to-face learning." },
      { id: "B", text: "Many people say that online learning is classroom learning." },
      { id: "C", text: "People believe all online classes are easy." },
      { id: "D", text: "Traditional classrooms are more convenient than websites." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-018",
    type: "mc",
    difficulty: "medium",
    skill: "word_choice",
    passage: "",
    question: "Choose the best replacement for “a lot of problems.”",
    options: [
      { id: "A", text: "many hassles" },
      { id: "B", text: "numerous difficulties" },
      { id: "C", text: "tons of issues" },
      { id: "D", text: "loads of trouble" }
    ],
    answer: "B",
  },
  {
    id: "W-MC-019",
    type: "mc",
    difficulty: "medium",
    skill: "cause_effect",
    passage: "",
    question: "Choose the most logical sentence.",
    options: [
      { id: "A", text: "Because public transport was improved, traffic congestion decreased." },
      { id: "B", text: "Public transport improved, but therefore traffic increased." },
      { id: "C", text: "Traffic congestion decreased although public transport improved because it increased." },
      { id: "D", text: "Public transport improved because traffic was decreased by congestion." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-020",
    type: "mc",
    difficulty: "medium",
    skill: "task1",
    passage: "A graph shows:\nTrain use: 20% → 35%\nBus use: 40% → 30%\nCar use: 40% → 35%",
    question: "Which is the best overview?",
    options: [
      { id: "A", text: "Train use increased, while bus use decreased and car use remained relatively stable." },
      { id: "B", text: "All forms of transport became more popular." },
      { id: "C", text: "Cars became the most popular form of transport." },
      { id: "D", text: "Train use stayed the same." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-021",
    type: "mc",
    difficulty: "medium",
    skill: "task1",
    passage: "",
    question: "Which sentence appropriately describes a trend?",
    options: [
      { id: "A", text: "The number of students was going up very nicely." },
      { id: "B", text: "Student numbers increased steadily over the period." },
      { id: "C", text: "Students went up a lot." },
      { id: "D", text: "The graph was happy to rise." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-022",
    type: "mc",
    difficulty: "medium",
    skill: "task1",
    passage: "",
    question: "Which sentence best compares two figures?",
    options: [
      { id: "A", text: "Electricity use was 40%, and gas was 20%." },
      { id: "B", text: "Electricity use was twice as high as gas use." },
      { id: "C", text: "Electricity use and gas use were things on the graph." },
      { id: "D", text: "Gas was electricity's opposite." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-023",
    type: "mc",
    difficulty: "hard",
    skill: "sentence_improvement",
    passage: "",
    question: "Choose the clearest sentence.",
    options: [
      { id: "A", text: "Due to the fact that students have many assignments, they are unable to have enough time for rest." },
      { id: "B", text: "Because students have many assignments, they may have insufficient time to rest." },
      { id: "C", text: "Students have assignments and this is because they do not rest enough." },
      { id: "D", text: "Assignments are many and rest is not enough for students." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-024",
    type: "mc",
    difficulty: "hard",
    skill: "transition",
    passage: "",
    question: "Some people believe university education should be free. ______, others argue that students should contribute to the cost of their education.",
    options: [
      { id: "A", text: "Therefore" },
      { id: "B", text: "In contrast" },
      { id: "C", text: "For example" },
      { id: "D", text: "As a result" }
    ],
    answer: "B",
  },
  {
    id: "W-MC-025",
    type: "mc",
    difficulty: "hard",
    skill: "thesis",
    passage: "",
    question: "Which thesis is strongest for: “Is technology making communication better or worse?”",
    options: [
      { id: "A", text: "Technology is very important today." },
      { id: "B", text: "This essay will discuss communication." },
      { id: "C", text: "Although digital technology allows people to communicate more quickly, excessive reliance on it can reduce the quality of some face-to-face interactions." },
      { id: "D", text: "Technology and communication are related." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-026",
    type: "mc",
    difficulty: "hard",
    skill: "argument_development",
    passage: "Topic: Governments should invest more in public parks.",
    question: "Which sentence provides the strongest supporting evidence?",
    options: [
      { id: "A", text: "Parks are nice and people like them." },
      { id: "B", text: "Green spaces can provide residents with places for exercise and recreation while improving access to urban nature." },
      { id: "C", text: "Parks are found in lots of cities." },
      { id: "D", text: "Governments have money to spend." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-027",
    type: "mc",
    difficulty: "hard",
    skill: "concision",
    passage: "",
    question: "Choose the most concise version.",
    options: [
      { id: "A", text: "Due to the fact that pollution levels are increasing, it is necessary that governments take action." },
      { id: "B", text: "Because pollution levels are increasing, governments need to act." },
      { id: "C", text: "Pollution levels are increasing, and this is a fact that is currently happening." },
      { id: "D", text: "Governments, due to pollution levels that are increasing in nature, need action." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-028",
    type: "mc",
    difficulty: "hard",
    skill: "transition",
    passage: "",
    question: "The city introduced a congestion charge. ______, the number of cars entering the centre fell.",
    options: [
      { id: "A", text: "As a result" },
      { id: "B", text: "Nevertheless" },
      { id: "C", text: "In contrast" },
      { id: "D", text: "Similarly" }
    ],
    answer: "A",
  },
  {
    id: "W-MC-029",
    type: "mc",
    difficulty: "hard",
    skill: "argument_development",
    passage: "",
    question: "Which sentence best explains why volunteering can benefit teenagers?",
    options: [
      { id: "A", text: "Teenagers volunteer in many places." },
      { id: "B", text: "Volunteering can help teenagers develop communication and teamwork skills through practical experience." },
      { id: "C", text: "Volunteer work is a popular topic." },
      { id: "D", text: "Some teenagers enjoy helping people." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-030",
    type: "mc",
    difficulty: "hard",
    skill: "coherence",
    passage: "1. Public transport can reduce the number of private cars on the road.\n2. Buses and trains can also make commuting more affordable.\n3. Many students enjoy playing video games after school.\n4. Reliable public transport can therefore benefit both individuals and cities.",
    question: "Which sentence does NOT belong in this paragraph?",
    options: [
      { id: "A", text: "Sentence 1" },
      { id: "B", text: "Sentence 2" },
      { id: "C", text: "Sentence 3" },
      { id: "D", text: "Sentence 4" }
    ],
    answer: "C",
  },
  {
    id: "W-MC-031",
    type: "mc",
    difficulty: "hard",
    skill: "task1",
    passage: "A chart shows:\nSolar: 10 → 30\nWind: 20 → 35\nCoal: 50 → 25\nGas: 20 → 10",
    question: "Which is the strongest overview?",
    options: [
      { id: "A", text: "Renewable energy sources increased, while coal and gas declined." },
      { id: "B", text: "Solar energy remained the least popular source." },
      { id: "C", text: "Coal was always the most important source." },
      { id: "D", text: "Gas increased slightly over the period." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-032",
    type: "mc",
    difficulty: "hard",
    skill: "task1",
    passage: "",
    question: "Which sentence correctly describes data?",
    options: [
      { id: "A", text: "The percentage rose from 25% to 40%, an increase of 15 percentage points." },
      { id: "B", text: "The percentage rose by 15% from 25% to 40%." },
      { id: "C", text: "The percentage increased 25 points to 40%." },
      { id: "D", text: "The percentage was increased 40 from 25." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-033",
    type: "mc",
    difficulty: "hard",
    skill: "paraphrasing",
    passage: "Original: Governments need to take immediate action to reduce air pollution.",
    question: "Best paraphrase:",
    options: [
      { id: "A", text: "Immediate measures are required from governments to tackle air pollution." },
      { id: "B", text: "Governments should perhaps think about air pollution one day." },
      { id: "C", text: "Air pollution is something that governments know about." },
      { id: "D", text: "Governments are pollution." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-034",
    type: "mc",
    difficulty: "hard",
    skill: "formal_language",
    passage: "",
    question: "Which is most appropriate for an IELTS essay?",
    options: [
      { id: "A", text: "People nowadays totally freak out about social media." },
      { id: "B", text: "Social media is pretty bad for everyone." },
      { id: "C", text: "Excessive social-media use may have negative effects on users' well-being." },
      { id: "D", text: "Social media can mess people up." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-035",
    type: "mc",
    difficulty: "hard",
    skill: "sentence_improvement",
    passage: "",
    question: "Choose the grammatically correct sentence.",
    options: [
      { id: "A", text: "Although public transport is cheaper, many people still prefer cars because they offer greater convenience." },
      { id: "B", text: "Although public transport cheaper, many people still prefer cars because offer greater convenience." },
      { id: "C", text: "Although public transport is cheaper, but many people prefer cars." },
      { id: "D", text: "Public transport cheaper although people prefer cars because convenience." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-036",
    type: "mc",
    difficulty: "hard",
    skill: "cause_effect",
    passage: "",
    question: "Which sentence has the clearest causal relationship?",
    options: [
      { id: "A", text: "Housing costs rose, so some families moved to cheaper areas." },
      { id: "B", text: "Housing costs rose, although some families moved because cheaper." },
      { id: "C", text: "Housing costs rose, and therefore cheaper areas were expensive." },
      { id: "D", text: "Families moved to cheaper areas, despite housing costs." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-037",
    type: "mc",
    difficulty: "hard",
    skill: "argument_development",
    passage: "Topic: Some people believe university students should study only subjects directly related to their future careers.",
    question: "Which sentence introduces a counterargument effectively?",
    options: [
      { id: "A", text: "However, a broader education may help students develop skills that are transferable across different careers." },
      { id: "B", text: "University subjects are different." },
      { id: "C", text: "Students have many classes." },
      { id: "D", text: "Careers are important in life." }
    ],
    answer: "A",
  },
  {
    id: "W-MC-038",
    type: "mc",
    difficulty: "hard",
    skill: "conclusion",
    passage: "",
    question: "Which is the strongest concluding sentence for an essay arguing that cities should invest in cycling infrastructure?",
    options: [
      { id: "A", text: "In conclusion, bicycles are interesting." },
      { id: "B", text: "To conclude, cities are places where people live." },
      { id: "C", text: "Overall, expanding safe cycling infrastructure can reduce car dependence while encouraging healthier forms of urban travel." },
      { id: "D", text: "That's all about cycling." }
    ],
    answer: "C",
  },
  {
    id: "W-MC-039",
    type: "mc",
    difficulty: "hard",
    skill: "thesis",
    passage: "Question: “Some people think schools should teach financial skills such as budgeting and saving. To what extent do you agree?”",
    question: "Which sentence gives the clearest position?",
    options: [
      { id: "A", text: "Money is important to everyone." },
      { id: "B", text: "I think schools should teach financial skills because students need to make informed decisions about money as they become independent." },
      { id: "C", text: "This topic has many opinions." },
      { id: "D", text: "Students learn many things at school." }
    ],
    answer: "B",
  },
  {
    id: "W-MC-040",
    type: "mc",
    difficulty: "hard",
    skill: "sentence_combination",
    passage: "Many students use online resources. These resources provide access to information at any time.",
    question: "Combine the ideas most effectively.",
    options: [
      { id: "A", text: "Many students use online resources, these provide information at any time." },
      { id: "B", text: "Many students use online resources because they provide access to information at any time." },
      { id: "C", text: "Many students use online resources although information is available at any time because." },
      { id: "D", text: "Online resources are many students because information." }
    ],
    answer: "B",
  },
];
