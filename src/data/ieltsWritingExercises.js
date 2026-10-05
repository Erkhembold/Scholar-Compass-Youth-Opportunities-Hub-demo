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
];
