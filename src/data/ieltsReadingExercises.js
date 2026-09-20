// ScholarCompass IELTS Reading short-exercise question bank — original
// content, provided directly (not AI-generated here). Each exercise is
// short and targeted (one passage, one to a few questions), distinct
// from the full 40-question mock tests in ieltsTests.js.
//
// Schema by type:
//  mc:         { id, type: "mc", difficulty, skill, passage, question, options, answer, explanation }
//  tfng:       { id, type: "tfng", difficulty, passage, statements: [{ text, answer }], explanation }
//  matching:   { id, type: "matching", difficulty, passage, headings, answer, explanation }
//  completion: { id, type: "completion", difficulty, passage, prompt, answer, explanation }

export const READING_SKILL_TAGS = [
  "stated_information",
  "main_idea",
  "paraphrase",
  "inference",
  "contrast",
  "cause_effect",
  "true_false_not_given",
  "matching_headings",
  "sentence_completion",
  "information_location",
];

export const IELTS_READING_EXERCISES = [
  // ---------------- SET 1 — MULTIPLE CHOICE ----------------
  {
    id: "R-MC-001",
    type: "mc",
    difficulty: "easy",
    skill: "stated_information",
    passage:
      "Urban gardens can provide more than vegetables. Researchers have found that small gardens can also create habitats for insects and birds. Even gardens located on rooftops may contribute to local biodiversity.",
    question: "According to the passage, what is one additional benefit of urban gardens?",
    options: [
      { id: "A", text: "They reduce the cost of housing." },
      { id: "B", text: "They provide habitats for wildlife." },
      { id: "C", text: "They eliminate air pollution." },
      { id: "D", text: "They require less water than farms." },
    ],
    answer: "B",
    explanation:
      "The passage directly states that urban gardens can create habitats for insects and birds.",
  },
  {
    id: "R-MC-002",
    type: "mc",
    difficulty: "easy",
    skill: "main_idea",
    passage:
      "For many years, scientists assumed that sleep was mainly a period of rest. More recent research, however, has shown that the brain remains highly active during sleep. Some studies suggest that sleep helps the brain organize and strengthen newly acquired information.",
    question: "What is the main purpose of the passage?",
    options: [
      { id: "A", text: "To explain why people dream" },
      { id: "B", text: "To describe how sleep affects physical health" },
      { id: "C", text: "To introduce research showing that the brain remains active during sleep" },
      { id: "D", text: "To compare different sleeping patterns" },
    ],
    answer: "C",
    explanation:
      "The passage contrasts the older view of sleep with newer research about brain activity.",
  },
  {
    id: "R-MC-003",
    type: "mc",
    difficulty: "medium",
    skill: "paraphrase",
    passage:
      "A study of public transport users found that people were more likely to choose buses and trains when services were frequent and reliable. Lower ticket prices had an effect, but researchers found that passengers valued predictable schedules even more.",
    question: "What did passengers value most?",
    options: [
      { id: "A", text: "Cheap tickets" },
      { id: "B", text: "Large vehicles" },
      { id: "C", text: "Predictable services" },
      { id: "D", text: "Shorter walking distances" },
    ],
    answer: "C",
    explanation: "\u201cPredictable schedules\u201d is paraphrased as \u201cpredictable services.\u201d",
  },
  {
    id: "R-MC-004",
    type: "mc",
    difficulty: "medium",
    skill: "inference",
    passage:
      "When the museum introduced free entry on Sundays, visitor numbers increased substantially. However, the museum did not extend the policy to every day because staff and maintenance costs also increased with the larger crowds.",
    question: "Why did the museum probably avoid making entry free every day?",
    options: [
      { id: "A", text: "It wanted fewer visitors." },
      { id: "B", text: "It could not accommodate children." },
      { id: "C", text: "Increased attendance created additional costs." },
      { id: "D", text: "Visitors complained about Sunday opening hours." },
    ],
    answer: "C",
    explanation:
      "The passage connects increased crowds with higher staff and maintenance costs.",
  },
  {
    id: "R-MC-005",
    type: "mc",
    difficulty: "medium",
    skill: "contrast",
    passage:
      "Traditional farming methods can require considerable amounts of water. Drip irrigation, by contrast, delivers water directly to plant roots and can reduce unnecessary water loss.",
    question: "What is the main advantage of drip irrigation mentioned in the passage?",
    options: [
      { id: "A", text: "It increases the size of farms." },
      { id: "B", text: "It reduces water waste." },
      { id: "C", text: "It eliminates the need for farmers." },
      { id: "D", text: "It makes crops grow without sunlight." },
    ],
    answer: "B",
    explanation: "The phrase \u201creduce unnecessary water loss\u201d directly supports B.",
  },
  {
    id: "R-MC-006",
    type: "mc",
    difficulty: "medium",
    skill: "information_location",
    passage:
      "Researchers monitoring a restored wetland recorded three major changes. Water quality improved during the first year, bird populations increased during the second year, and native plants became more common by the third year.",
    question: "When did bird populations increase?",
    options: [
      { id: "A", text: "During the first year" },
      { id: "B", text: "During the second year" },
      { id: "C", text: "During the third year" },
      { id: "D", text: "Before restoration began" },
    ],
    answer: "B",
    explanation:
      "The passage explicitly states that bird populations increased during the second year.",
  },
  {
    id: "R-MC-007",
    type: "mc",
    difficulty: "hard",
    skill: "cause_effect",
    passage:
      "Students who regularly participated in outdoor activities tended to report lower levels of stress. The researchers warned, however, that this did not prove that outdoor activity alone caused the difference. Students who choose outdoor activities may also differ from other students in several other ways.",
    question: "What caution did the researchers make?",
    options: [
      { id: "A", text: "Outdoor activities are dangerous." },
      { id: "B", text: "The students were not asked about stress." },
      { id: "C", text: "The relationship did not necessarily demonstrate causation." },
      { id: "D", text: "Outdoor activities increased stress in some students." },
    ],
    answer: "C",
    explanation:
      "The researchers explicitly warned that the relationship did not prove that outdoor activity caused lower stress.",
  },
  {
    id: "R-MC-008",
    type: "mc",
    difficulty: "hard",
    skill: "inference",
    passage:
      "The first generation of solar panels was relatively expensive, which limited their adoption. As manufacturing processes improved, production costs fell. Governments also introduced incentives that encouraged households and businesses to install solar systems.",
    question: "What can be inferred about the growth of solar-panel adoption?",
    options: [
      { id: "A", text: "It was influenced by more than one factor." },
      { id: "B", text: "It occurred only because governments banned other energy sources." },
      { id: "C", text: "Manufacturing improvements made solar panels less effective." },
      { id: "D", text: "Solar panels became more expensive as demand increased." },
    ],
    answer: "A",
    explanation:
      "The passage identifies both lower production costs and government incentives as factors.",
  },

  // ---------------- SET 2 — TRUE / FALSE / NOT GIVEN ----------------
  {
    id: "R-TFNG-001",
    type: "tfng",
    difficulty: "easy",
    passage:
      "The city opened its first public bicycle-sharing system in 2018. Initially, 500 bicycles were available at 40 stations. The program was later expanded to neighboring districts.",
    statements: [
      { text: "The bicycle-sharing system began in 2018.", answer: "TRUE" },
      { text: "There were 500 stations when the system opened.", answer: "FALSE" },
      { text: "The system was eventually expanded.", answer: "TRUE" },
    ],
    explanation: "1 is directly stated. 2 reverses bicycles and stations. 3 is directly stated.",
  },
  {
    id: "R-TFNG-002",
    type: "tfng",
    difficulty: "easy",
    passage:
      "The researchers surveyed 600 university students about their study habits. Most participants reported studying at home, while a smaller group preferred libraries.",
    statements: [
      { text: "The researchers surveyed university students.", answer: "TRUE" },
      { text: "More students preferred libraries than studying at home.", answer: "FALSE" },
      { text: "The researchers surveyed students from several countries.", answer: "NOT GIVEN" },
    ],
    explanation:
      "The passage states that most studied at home. It gives no information about the countries represented.",
  },
  {
    id: "R-TFNG-003",
    type: "tfng",
    difficulty: "medium",
    passage:
      "A mountain village previously depended heavily on diesel generators. After a small solar installation was built, the generators were used less frequently. The village still used diesel power during periods of particularly low sunlight.",
    statements: [
      { text: "Solar power completely replaced diesel power.", answer: "FALSE" },
      { text: "Diesel generators were used less after solar panels were installed.", answer: "TRUE" },
      { text: "The solar installation was built by the national government.", answer: "NOT GIVEN" },
    ],
    explanation:
      "The village still used diesel power, so complete replacement is false. The installer is not identified.",
  },
  {
    id: "R-TFNG-004",
    type: "tfng",
    difficulty: "medium",
    passage:
      "A university introduced flexible working hours for administrative staff. After six months, employee satisfaction had increased. The university did not, however, publish data on whether productivity had changed.",
    statements: [
      { text: "Employee satisfaction increased.", answer: "TRUE" },
      { text: "Productivity definitely increased.", answer: "NOT GIVEN" },
      { text: "The policy applied to administrative staff.", answer: "TRUE" },
    ],
    explanation: "The passage says nothing about whether productivity increased or decreased.",
  },
  {
    id: "R-TFNG-005",
    type: "tfng",
    difficulty: "hard",
    passage:
      "Several coastal communities have planted mangroves to reduce the impact of waves. In some locations, the trees have also provided habitats for fish and other organisms. Researchers are still investigating how effective different planting methods are over long periods.",
    statements: [
      { text: "Mangroves can provide habitats for marine organisms.", answer: "TRUE" },
      { text: "All coastal communities use the same planting method.", answer: "NOT GIVEN" },
      {
        text: "Researchers are studying the long-term effectiveness of planting methods.",
        answer: "TRUE",
      },
    ],
    explanation:
      "The passage mentions habitats and ongoing research but does not state that communities use different or identical methods.",
  },

  // ---------------- SET 3 — MATCHING HEADINGS ----------------
  {
    id: "R-MH-001",
    type: "matching",
    difficulty: "easy",
    passage:
      "Electric buses are becoming more common in cities. Unlike diesel buses, they produce no exhaust emissions while operating, although the environmental impact of their electricity source must also be considered.",
    headings: [
      { id: "i", text: "The limits of electric transport" },
      { id: "ii", text: "A cleaner alternative for urban transport" },
      { id: "iii", text: "The history of public buses" },
      { id: "iv", text: "Problems caused by traffic" },
    ],
    answer: "ii",
    explanation: "",
  },
  {
    id: "R-MH-002",
    type: "matching",
    difficulty: "medium",
    passage:
      "Some researchers argue that urban trees should be planted strategically rather than simply in large numbers. Trees placed near buildings can provide shade, while trees beside busy roads may help improve local conditions.",
    headings: [
      { id: "i", text: "Choosing locations for urban trees" },
      { id: "ii", text: "Why trees are expensive" },
      { id: "iii", text: "The history of forestry" },
      { id: "iv", text: "Removing trees from cities" },
    ],
    answer: "i",
    explanation: "",
  },
  {
    id: "R-MH-003",
    type: "matching",
    difficulty: "medium",
    passage:
      "Early weather stations depended heavily on manual observations. Modern systems can automatically collect temperature, rainfall and wind data, allowing information to be gathered more frequently and consistently.",
    headings: [
      { id: "i", text: "The cost of weather equipment" },
      { id: "ii", text: "The development of automated observation" },
      { id: "iii", text: "Problems with modern weather forecasts" },
      { id: "iv", text: "Training professional meteorologists" },
    ],
    answer: "ii",
    explanation: "",
  },
  {
    id: "R-MH-004",
    type: "matching",
    difficulty: "hard",
    passage:
      "Although artificial intelligence can process enormous quantities of satellite imagery, researchers still need observations from the ground. Ground measurements can reveal information that satellites cannot directly detect and can also help verify remotely collected data.",
    headings: [
      { id: "i", text: "Why satellite technology has failed" },
      { id: "ii", text: "Combining satellite and ground observations" },
      { id: "iii", text: "The history of artificial intelligence" },
      { id: "iv", text: "Training satellite operators" },
    ],
    answer: "ii",
    explanation: "",
  },
  {
    id: "R-MH-005",
    type: "matching",
    difficulty: "hard",
    passage:
      "A common assumption is that restoring an ecosystem means returning it to exactly the condition it was in before human disturbance. In reality, restoration projects often have to account for changed rainfall patterns, temperatures and surrounding land use.",
    headings: [
      { id: "i", text: "Rethinking the meaning of restoration" },
      { id: "ii", text: "Measuring rainfall accurately" },
      { id: "iii", text: "The disappearance of natural ecosystems" },
      { id: "iv", text: "Why restoration projects are inexpensive" },
    ],
    answer: "i",
    explanation: "",
  },

  // ---------------- SET 4 — SENTENCE COMPLETION ----------------
  {
    id: "R-SC-001",
    type: "completion",
    difficulty: "easy",
    passage:
      "The school installed rainwater tanks to collect water from the roofs. The stored water is mainly used to irrigate the school garden.",
    prompt: "The school uses collected rainwater mainly to ________ the garden.",
    answer: "irrigate",
    explanation: "",
  },
  {
    id: "R-SC-002",
    type: "completion",
    difficulty: "easy",
    passage:
      "The archaeological team discovered pottery fragments beneath a layer of soil. Laboratory analysis suggested that the fragments were approximately 1,500 years old.",
    prompt: "The pottery fragments were approximately ________ years old.",
    answer: "1,500",
    explanation: "",
  },
  {
    id: "R-SC-003",
    type: "completion",
    difficulty: "medium",
    passage:
      "Researchers placed sensors throughout the forest to measure temperature and humidity. Data from the sensors were transmitted to a central computer every hour.",
    prompt: "The sensors transmitted information to a ________ computer.",
    answer: "central",
    explanation: "",
  },
  {
    id: "R-SC-004",
    type: "completion",
    difficulty: "medium",
    passage:
      "The restoration team first mapped areas where vegetation had disappeared. They then identified locations where soil conditions were suitable for planting native species.",
    prompt: "Before planting native species, the team identified suitable ________ conditions.",
    answer: "soil",
    explanation: "",
  },
  {
    id: "R-SC-005",
    type: "completion",
    difficulty: "hard",
    passage:
      "Satellite imagery allowed researchers to identify changes in vegetation across the entire mining area. However, field measurements were necessary to determine whether apparent changes in vegetation represented genuine ecological recovery.",
    prompt: "Field measurements were needed to confirm genuine ecological ________.",
    answer: "recovery",
    explanation: "",
  },
];
