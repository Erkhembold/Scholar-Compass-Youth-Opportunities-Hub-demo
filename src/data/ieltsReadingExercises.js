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
  // Added for the 60-question set below (ids R-MC-101..160): these cover
  // categories that set didn't have an existing tag for.
  "vocabulary",
  "specific_detail",
  "matching_information",
  "reference",
  "main_purpose",
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

  // ---------------- SET 2 — 60-question bank (R-MC-101..160), added in 3 batches of 20 ----------------
  {
    id: "R-MC-101",
    type: "mc",
    difficulty: "easy",
    skill: "main_idea",
    passage: "Urban gardens are becoming more common in large cities. They can provide fresh food, create green spaces, and give residents opportunities to meet their neighbors.",
    question: "What is the main idea?",
    options: [
      { id: "A", text: "Urban gardens are expensive to maintain." },
      { id: "B", text: "Urban gardens can provide several benefits to city residents." },
      { id: "C", text: "Most city residents grow their own food." },
      { id: "D", text: "Gardens are replacing city parks." }
    ],
    answer: "B",
  },
  {
    id: "R-MC-102",
    type: "mc",
    difficulty: "easy",
    skill: "true_false_not_given",
    passage: "The museum opened in 1985 and originally contained only paintings. In 2004, it expanded its collection to include photographs and sculptures.",
    question: "Statement: The museum displayed sculptures before 2004. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-103",
    type: "mc",
    difficulty: "easy",
    skill: "vocabulary",
    passage: "The new bus system is more efficient because buses spend less time waiting at stops.",
    question: "What does “efficient” mean here?",
    options: [
      { id: "A", text: "More expensive" },
      { id: "B", text: "Working effectively with less wasted time" },
      { id: "C", text: "More crowded" },
      { id: "D", text: "More complicated" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-104",
    type: "mc",
    difficulty: "easy",
    skill: "specific_detail",
    passage: "The course lasts twelve weeks and includes two classes each week.",
    question: "How many classes does the course include?",
    options: [
      { id: "A", text: "12" },
      { id: "B", text: "18" },
      { id: "C", text: "24" },
      { id: "D", text: "30" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-105",
    type: "mc",
    difficulty: "easy",
    skill: "matching_information",
    passage: "A. Solar panels convert sunlight into electricity.\nB. Wind turbines use moving air to generate electricity.\nC. Hydroelectric systems use flowing water.",
    question: "Which source depends on wind?",
    options: [
      { id: "A", text: "A" },
      { id: "B", text: "B" },
      { id: "C", text: "C" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-106",
    type: "mc",
    difficulty: "easy",
    skill: "inference",
    passage: "Nora always carries a reusable bottle because the school has removed plastic cups from its cafeteria.",
    question: "Why does Nora carry a reusable bottle?",
    options: [
      { id: "A", text: "She dislikes drinking water." },
      { id: "B", text: "She wants to avoid buying drinks." },
      { id: "C", text: "She needs an alternative to disposable cups." },
      { id: "D", text: "She works in the cafeteria." }
    ],
    answer: "C",
  },
  {
    id: "R-MC-107",
    type: "mc",
    difficulty: "easy",
    skill: "sentence_completion",
    passage: "The sports centre is open from 6 a.m. until 10 p.m. on weekdays.",
    question: "The centre closes at ______ on weekdays.",
    options: [
      { id: "A", text: "6 a.m." },
      { id: "B", text: "8 p.m." },
      { id: "C", text: "9 p.m." },
      { id: "D", text: "10 p.m." }
    ],
    answer: "D",
  },
  {
    id: "R-MC-108",
    type: "mc",
    difficulty: "easy",
    skill: "true_false_not_given",
    passage: "The university's new library contains 40 study rooms. Students can reserve some of these rooms online.",
    question: "Statement: All 40 study rooms must be reserved online. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-109",
    type: "mc",
    difficulty: "easy",
    skill: "main_idea",
    passage: "Walking to school can help students become more physically active. It may also reduce the number of cars around school entrances.",
    question: "What is the passage mainly about?",
    options: [
      { id: "A", text: "Why cars are necessary near schools" },
      { id: "B", text: "Benefits of walking to school" },
      { id: "C", text: "Problems with school entrances" },
      { id: "D", text: "How to buy walking shoes" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-110",
    type: "mc",
    difficulty: "easy",
    skill: "vocabulary",
    passage: "The old bridge was demolished to make space for a wider road.",
    question: "What does “demolished” mean?",
    options: [
      { id: "A", text: "Repaired" },
      { id: "B", text: "Painted" },
      { id: "C", text: "Completely destroyed" },
      { id: "D", text: "Carefully moved" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-111",
    type: "mc",
    difficulty: "easy",
    skill: "specific_detail",
    passage: "The study began in March and ended in August.",
    question: "How long did the study last?",
    options: [
      { id: "A", text: "Three months" },
      { id: "B", text: "Four months" },
      { id: "C", text: "Five months" },
      { id: "D", text: "Six months" }
    ],
    answer: "D",
  },
  {
    id: "R-MC-112",
    type: "mc",
    difficulty: "easy",
    skill: "reference",
    passage: "The town planted 500 trees last spring. They were placed along several main roads.",
    question: "What does “They” refer to?",
    options: [
      { id: "A", text: "The roads" },
      { id: "B", text: "The trees" },
      { id: "C", text: "The towns" },
      { id: "D", text: "The seasons" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-113",
    type: "mc",
    difficulty: "medium",
    skill: "inference",
    passage: "When the school introduced a quiet study room, teachers noticed that students began staying after class for longer periods.",
    question: "What can be inferred?",
    options: [
      { id: "A", text: "Students wanted a quieter place to work." },
      { id: "B", text: "Teachers increased the length of lessons." },
      { id: "C", text: "Students were no longer allowed to go home." },
      { id: "D", text: "The school reduced homework." }
    ],
    answer: "A",
  },
  {
    id: "R-MC-114",
    type: "mc",
    difficulty: "medium",
    skill: "true_false_not_given",
    passage: "The community centre offers cooking classes every Saturday. Some classes focus on traditional dishes, while others teach international recipes.",
    question: "Statement: Every cooking class teaches traditional Mongolian food. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-115",
    type: "mc",
    difficulty: "medium",
    skill: "main_purpose",
    passage: "Several companies now allow employees to work from home for part of the week. Supporters say this can reduce commuting time, although some employees report that they miss informal conversations with colleagues.",
    question: "What is the purpose of the passage?",
    options: [
      { id: "A", text: "To show only the advantages of remote work" },
      { id: "B", text: "To show both benefits and drawbacks of remote work" },
      { id: "C", text: "To explain how to build a home office" },
      { id: "D", text: "To argue that all companies should work remotely" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-116",
    type: "mc",
    difficulty: "medium",
    skill: "vocabulary",
    passage: "The researchers found a significant increase in attendance after the school changed its timetable.",
    question: "What does “significant” most likely mean?",
    options: [
      { id: "A", text: "Very small" },
      { id: "B", text: "Noticeable or important" },
      { id: "C", text: "Temporary" },
      { id: "D", text: "Unexpectedly negative" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-117",
    type: "mc",
    difficulty: "medium",
    skill: "sentence_completion",
    passage: "The science museum introduced a discounted student ticket in September. The new ticket costs 5 dollars, compared with 9 dollars for adults.",
    question: "Students pay ______ dollars for the new ticket.",
    options: [
      { id: "A", text: "4" },
      { id: "B", text: "5" },
      { id: "C", text: "9" },
      { id: "D", text: "14" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-118",
    type: "mc",
    difficulty: "medium",
    skill: "matching_information",
    passage: "A. Dr. Kim studies ocean temperatures.\nB. Dr. Patel studies urban air quality.\nC. Dr. Wong studies soil erosion.",
    question: "Who studies pollution in cities?",
    options: [
      { id: "A", text: "Dr. Kim" },
      { id: "B", text: "Dr. Patel" },
      { id: "C", text: "Dr. Wong" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-119",
    type: "mc",
    difficulty: "medium",
    skill: "true_false_not_given",
    passage: "Researchers surveyed 600 students from five secondary schools. The students answered questions about sleep, exercise and schoolwork.",
    question: "Statement: The survey included university students. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-120",
    type: "mc",
    difficulty: "medium",
    skill: "inference",
    passage: "The café had very few customers during its first month. After it added vegetarian meals, lunchtime sales increased.",
    question: "What is the most reasonable inference?",
    options: [
      { id: "A", text: "Vegetarian options may have attracted additional customers." },
      { id: "B", text: "The café became cheaper." },
      { id: "C", text: "The café stopped serving lunch." },
      { id: "D", text: "Customers preferred meat dishes." }
    ],
    answer: "A",
  },
  {
    id: "R-MC-121",
    type: "mc",
    difficulty: "medium",
    skill: "main_idea",
    passage: "Many museums now offer virtual tours. These tours allow people to view exhibitions from home and can be especially useful for visitors who live far away.",
    question: "What is the main idea?",
    options: [
      { id: "A", text: "Museums are closing permanently." },
      { id: "B", text: "Virtual tours can make museums more accessible." },
      { id: "C", text: "Most visitors dislike museums." },
      { id: "D", text: "Virtual tours are more expensive than travel." }
    ],
    answer: "B",
  },
  {
    id: "R-MC-122",
    type: "mc",
    difficulty: "medium",
    skill: "vocabulary",
    passage: "The committee decided to postpone the event because of severe weather.",
    question: "What does “postpone” mean?",
    options: [
      { id: "A", text: "Cancel permanently" },
      { id: "B", text: "Move to a later time" },
      { id: "C", text: "Finish early" },
      { id: "D", text: "Advertise" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-123",
    type: "mc",
    difficulty: "medium",
    skill: "specific_detail",
    passage: "The new recycling programme began with paper and cardboard. Glass containers were added six months later.",
    question: "Which material was added later?",
    options: [
      { id: "A", text: "Paper" },
      { id: "B", text: "Cardboard" },
      { id: "C", text: "Glass" },
      { id: "D", text: "Plastic" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-124",
    type: "mc",
    difficulty: "medium",
    skill: "reference",
    passage: "The company introduced flexible working hours. This change allowed employees to begin their day earlier or later.",
    question: "What does “This change” refer to?",
    options: [
      { id: "A", text: "Employees leaving the company" },
      { id: "B", text: "Flexible working hours" },
      { id: "C", text: "The company building" },
      { id: "D", text: "The employees' commute" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-125",
    type: "mc",
    difficulty: "medium",
    skill: "true_false_not_given",
    passage: "The park contains a lake, two playgrounds and several walking paths. It is most crowded on Sunday afternoons.",
    question: "Statement: The park is closed on Sundays. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-126",
    type: "mc",
    difficulty: "medium",
    skill: "matching_information",
    passage: "A. The first experiment lasted two weeks.\nB. The second experiment lasted three months.\nC. The third experiment was repeated several times.",
    question: "Which experiment was repeated?",
    options: [
      { id: "A", text: "A" },
      { id: "B", text: "B" },
      { id: "C", text: "C" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-127",
    type: "mc",
    difficulty: "medium",
    skill: "inference",
    passage: "The school introduced lockers near the sports hall. Within a month, fewer bags were left in the corridor.",
    question: "What probably caused the decrease in bags in the corridor?",
    options: [
      { id: "A", text: "More students stopped attending sports classes." },
      { id: "B", text: "Students began using the lockers." },
      { id: "C", text: "Teachers removed the bags." },
      { id: "D", text: "The corridor became smaller." }
    ],
    answer: "B",
  },
  {
    id: "R-MC-128",
    type: "mc",
    difficulty: "medium",
    skill: "main_purpose",
    passage: "The report compares three methods of transporting food. It discusses their cost, speed and environmental impact.",
    question: "Why was the report written?",
    options: [
      { id: "A", text: "To advertise a transport company" },
      { id: "B", text: "To compare different transport methods" },
      { id: "C", text: "To describe one food shipment" },
      { id: "D", text: "To explain how food is produced" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-129",
    type: "mc",
    difficulty: "medium",
    skill: "vocabulary",
    passage: "The project is sustainable because it uses local materials and can continue without large amounts of outside funding.",
    question: "What does “sustainable” mean here?",
    options: [
      { id: "A", text: "Able to continue over time" },
      { id: "B", text: "Extremely expensive" },
      { id: "C", text: "Difficult to understand" },
      { id: "D", text: "Designed for one season only" }
    ],
    answer: "A",
  },
  {
    id: "R-MC-130",
    type: "mc",
    difficulty: "medium",
    skill: "sentence_completion",
    passage: "The language course has three levels: beginner, intermediate and advanced. Students take a placement test before joining a class.",
    question: "Students take a ______ before choosing a level.",
    options: [
      { id: "A", text: "final exam" },
      { id: "B", text: "placement test" },
      { id: "C", text: "speaking competition" },
      { id: "D", text: "university interview" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-131",
    type: "mc",
    difficulty: "medium",
    skill: "inference",
    passage: "Researchers gave one group of students printed textbooks and another group digital textbooks. After eight weeks, both groups performed similarly on a reading test.",
    question: "What did the results suggest?",
    options: [
      { id: "A", text: "Digital textbooks were clearly worse." },
      { id: "B", text: "Printed textbooks were clearly better." },
      { id: "C", text: "Both formats produced similar reading performance." },
      { id: "D", text: "Students refused to use digital textbooks." }
    ],
    answer: "C",
  },
  {
    id: "R-MC-132",
    type: "mc",
    difficulty: "hard",
    skill: "inference",
    passage: "Although the new train was designed to reduce journey times, passengers reported little improvement during the first month. Engineers later discovered that several sections of track required maintenance.",
    question: "Why may the train have failed to reduce journey times initially?",
    options: [
      { id: "A", text: "Passengers were using the wrong stations." },
      { id: "B", text: "Track problems limited its performance." },
      { id: "C", text: "The train had too few seats." },
      { id: "D", text: "The train was only used at night." }
    ],
    answer: "B",
  },
  {
    id: "R-MC-133",
    type: "mc",
    difficulty: "hard",
    skill: "true_false_not_given",
    passage: "The researchers observed that students who slept more tended to perform better on memory tasks. However, because the study was observational, the researchers could not establish that additional sleep directly caused the improvement.",
    question: "Statement: The study proved that more sleep causes better memory. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-134",
    type: "mc",
    difficulty: "hard",
    skill: "main_idea",
    passage: "Some governments provide subsidies for electric vehicles. These policies can accelerate adoption, but their effect depends on factors such as charging infrastructure, electricity prices and consumer preferences.",
    question: "What is the main point?",
    options: [
      { id: "A", text: "Subsidies are the only way to increase electric-vehicle use." },
      { id: "B", text: "Electric vehicles are always cheaper." },
      { id: "C", text: "The success of subsidies depends on several other factors." },
      { id: "D", text: "Consumers dislike electric vehicles." }
    ],
    answer: "C",
  },
  {
    id: "R-MC-135",
    type: "mc",
    difficulty: "hard",
    skill: "vocabulary",
    passage: "The findings challenge the assumption that all young people prefer digital communication to face-to-face interaction.",
    question: "What does “challenge” mean?",
    options: [
      { id: "A", text: "Support strongly" },
      { id: "B", text: "Put into question" },
      { id: "C", text: "Explain clearly" },
      { id: "D", text: "Repeat" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-136",
    type: "mc",
    difficulty: "hard",
    skill: "matching_information",
    passage: "A. Professor Ali argues that tree planting should focus on native species.\nB. Professor Chen believes urban design should prioritize public transport.\nC. Professor Silva emphasizes the importance of water management.",
    question: "Who focuses on transport systems?",
    options: [
      { id: "A", text: "Ali" },
      { id: "B", text: "Chen" },
      { id: "C", text: "Silva" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-137",
    type: "mc",
    difficulty: "hard",
    skill: "inference",
    passage: "A company introduced a four-day workweek without reducing salaries. Productivity remained stable during the first six months, but managers reported that some teams needed additional coordination.",
    question: "What can be inferred?",
    options: [
      { id: "A", text: "The policy created no challenges at all." },
      { id: "B", text: "Productivity necessarily increased." },
      { id: "C", text: "The new schedule may require changes in team coordination." },
      { id: "D", text: "All employees preferred the new system." }
    ],
    answer: "C",
  },
  {
    id: "R-MC-138",
    type: "mc",
    difficulty: "hard",
    skill: "true_false_not_given",
    passage: "A university study followed students for four years. Those who participated in music activities reported stronger social connections, although the study did not determine whether music participation caused those connections.",
    question: "Statement: The researchers proved that music activities create stronger social relationships. True, False, or Not Given?",
    options: [
      { id: "A", text: "TRUE" },
      { id: "B", text: "FALSE" },
      { id: "C", text: "NOT GIVEN" }
    ],
    answer: "B",
  },
  {
    id: "R-MC-139",
    type: "mc",
    difficulty: "hard",
    skill: "specific_detail",
    passage: "The first version of the software was tested by 120 volunteers. After changes were made, the second version was tested by 300 volunteers.",
    question: "How many volunteers tested the second version?",
    options: [
      { id: "A", text: "120" },
      { id: "B", text: "180" },
      { id: "C", text: "300" },
      { id: "D", text: "420" }
    ],
    answer: "C",
  },
  {
    id: "R-MC-140",
    type: "mc",
    difficulty: "hard",
    skill: "main_purpose",
    passage: "The article examines why some public parks attract more visitors than others. It considers location, facilities, maintenance and the availability of activities.",
    question: "What is the author's main purpose?",
    options: [
      { id: "A", text: "To recommend one specific park" },
      { id: "B", text: "To identify factors that influence park use" },
      { id: "C", text: "To argue that parks should charge entry fees" },
      { id: "D", text: "To explain how parks are built" }
    ],
    answer: "B",
  },
];
