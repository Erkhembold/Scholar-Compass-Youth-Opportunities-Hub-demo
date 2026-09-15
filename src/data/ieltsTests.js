// IELTS Academic Reading mock tests — original content (not reproduced from
// any real IELTS paper). Each test: 3 passages, 40 questions total,
// grouped by question type so the runner can render/score generically.
// All 10 tests are fully built.
//
// Each passage renders a small numbered cover image at the top (see
// PassageArt.jsx) — it's a placeholder showing just the ordinal number
// (1, 2, 3) until a real image is chosen. To swap one in: import the image
// at the top of this file and add `image: yourImportedImage` to that
// passage's object, e.g.:
//   import libraryPhoto from "../assets/ielts/t1p1-library.jpg";
//   { id: "t1p1", title: "...", image: libraryPhoto, text: `...` }

export const TESTS = [
  {
    id: "reading-mock-1",
    title: "IELTS Reading Mock Test 1",
    passages: [
      {
        id: "t1p1",
        title: "The Origins of Public Libraries",
        text: `Before the nineteenth century, access to books in most parts of the world was a privilege reserved for the wealthy, the religious, or the academically connected. Private collections belonged to monasteries, royal courts, and a small number of universities, and the idea that an ordinary working person might walk into a building and borrow a book for free would have seemed almost fantastical. This began to change gradually across Europe and North America as literacy rates climbed and industrial cities produced a growing class of factory and office workers eager for education and self-improvement during their limited leisure hours.

One of the earliest formal steps toward the modern public library took place in Britain with the Public Libraries Act of 1850, which allowed local town councils to establish libraries funded through local taxation. Supporters argued that libraries would provide wholesome alternatives to public houses and reduce social unrest, while critics worried about the cost to ratepayers. Uptake was slow at first; only a handful of towns opened libraries in the years immediately following the Act, and it took several decades before the practice became widespread.

Meanwhile, in the United States, the philanthropist Andrew Carnegie became the single most influential force behind the spread of public libraries. Between 1883 and 1929, Carnegie's foundation funded the construction of over 2,500 libraries across the English-speaking world, on the condition that local governments agreed to provide the land and commit to ongoing running costs. Carnegie believed strongly that libraries offered a route out of poverty through self-education, having credited his own success partly to a Pittsburgh merchant who had opened his personal book collection to working boys.

The twentieth century brought further transformation. Libraries expanded their collections beyond books to include newspapers, periodicals, and eventually audio and visual media. Children's sections, reading programmes, and community meeting spaces became standard features rather than novelties. By the latter half of the century, libraries in many countries had also become de facto community centres, offering services such as job-search assistance, language classes, and free internet access long before such access was common in private homes.

Digital technology has posed both a challenge and an opportunity for public libraries in the twenty-first century. Some commentators predicted that the rise of the internet and e-books would render physical libraries obsolete, yet visitor numbers in many cities have remained stable or even increased. Many libraries have responded by offering e-book lending, digital literacy training, and makerspaces equipped with tools such as 3D printers, repositioning themselves as hubs of technological access rather than storehouses of paper alone.`,
        groups: [
          {
            type: "tfng",
            instruction:
              "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Before the nineteenth century, only wealthy or religious institutions typically had access to substantial book collections.", answer: "TRUE" },
              { number: 2, prompt: "The Public Libraries Act of 1850 required local councils to open a library immediately.", answer: "FALSE" },
              { number: 3, prompt: "All critics of the 1850 Act were concerned specifically about a decline in reading standards.", answer: "NOT GIVEN" },
              { number: 4, prompt: "Andrew Carnegie required local governments to help fund the ongoing costs of the libraries he supported.", answer: "TRUE" },
              { number: 5, prompt: "Library visitor numbers have consistently fallen in every country since the introduction of e-books.", answer: "FALSE" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Andrew Carnegie's library-building philanthropy took place mainly between 1883 and ___.", answer: ["1929"] },
              { number: 7, prompt: "Carnegie credited part of his own success to a Pittsburgh ___ who shared his books.", answer: ["merchant"] },
              { number: 8, prompt: "In the twentieth century, libraries increasingly became de facto community ___.", answer: ["centres", "centers"] },
              { number: 9, prompt: "Some libraries now include makerspaces equipped with tools such as ___.", answer: ["3d printers", "3D printers"] },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "Supporters of the 1850 Public Libraries Act believed libraries would:", options: [{ id: "A", text: "increase local taxes unfairly" }, { id: "B", text: "provide an alternative to public houses" }, { id: "C", text: "replace the need for schools" }, { id: "D", text: "only benefit the wealthy" }], answer: "B" },
              { number: 11, prompt: "What was required of local governments under Carnegie's funding model?", options: [{ id: "A", text: "They had to match Carnegie's donation dollar for dollar." }, { id: "B", text: "They had to provide land and cover ongoing costs." }, { id: "C", text: "They had to name the library after Carnegie." }, { id: "D", text: "They had to allow only children to use the libraries." }], answer: "B" },
              { number: 12, prompt: "What does the passage suggest about predictions that digital technology would make libraries obsolete?", options: [{ id: "A", text: "The predictions were entirely accurate." }, { id: "B", text: "Libraries have removed all printed books as a result." }, { id: "C", text: "The predictions have not been fully borne out." }, { id: "D", text: "No one made such predictions." }], answer: "C" },
              { number: 13, prompt: "Which of the following is mentioned as a modern library service?", options: [{ id: "A", text: "Free legal representation" }, { id: "B", text: "Digital literacy training" }, { id: "C", text: "Medical check-ups" }, { id: "D", text: "Housing assistance" }], answer: "B" },
            ],
          },
        ],
      },
      {
        id: "t1p2",
        title: "Urban Beekeeping",
        paragraphs: [
          { id: "A", text: "Over the past two decades, keeping honeybee hives on the rooftops and balconies of major cities has shifted from a fringe hobby to a recognised urban movement. Cities such as London, New York, Paris, and Tokyo have all seen a marked increase in registered hives, with some municipal governments actively encouraging the practice through subsidies, training programmes, or relaxed zoning restrictions." },
          { id: "B", text: "Advocates argue that urban beekeeping offers a partial solution to the well-documented decline in global bee populations, a trend linked to pesticide use, habitat loss, and disease. Cities, somewhat counterintuitively, can offer bees a more diverse diet than intensively farmed rural monocultures, since urban parks, gardens, and even roadside verges often contain a wider variety of flowering plants across a longer season." },
          { id: "C", text: "Nonetheless, a number of scientists have raised concerns that the popularity of urban beekeeping may not be delivering the ecological benefits its supporters claim. Research conducted in several cities has found that hive density can become so high in fashionable beekeeping districts that the honeybees begin to outcompete wild, native bee species for available nectar and pollen." },
          { id: "D", text: "There is also a commercial dimension to the trend. Urban honey is frequently marketed at a premium, sold as a distinctive, local product with tasting notes said to reflect the particular mix of flora found in a given neighbourhood. Some hotels and restaurants maintain their own rooftop hives partly for the marketing value of serving honey harvested from their own building." },
          { id: "E", text: "Training and support for new beekeepers has grown alongside the trend, with local associations offering courses on hive management, swarm control, and the legal responsibilities that come with keeping livestock, however small, within city limits. In several jurisdictions, keepers must register their hives with the authorities and take steps to prevent nuisance to neighbours." },
          { id: "F", text: "Looking ahead, some urban planners suggest that beekeeping should be considered as one part of a broader strategy of urban greening, alongside green roofs, pollinator-friendly plantings, and reduced pesticide use in public spaces, rather than as a stand-alone solution. Without such supporting measures, urban beekeeping risks becoming a well-intentioned but ultimately symbolic gesture." },
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A–F. Choose the correct heading for each paragraph.",
            headings: [
              { id: "i", text: "A commercial opportunity linked to local branding" },
              { id: "ii", text: "Growing official support in major cities" },
              { id: "iii", text: "A cause of the decline in bee populations" },
              { id: "iv", text: "Rules and guidance for newcomers to the practice" },
              { id: "v", text: "Urban environments as a rich food source for bees" },
              { id: "vi", text: "A call for beekeeping to be part of a wider plan" },
              { id: "vii", text: "Concerns about competition with native species" },
              { id: "viii", text: "The history of beekeeping in ancient civilisations" },
            ],
            questions: [
              { number: 14, paragraphId: "A", answer: "ii" },
              { number: 15, paragraphId: "B", answer: "v" },
              { number: 16, paragraphId: "C", answer: "vii" },
              { number: 17, paragraphId: "D", answer: "i" },
              { number: 18, paragraphId: "E", answer: "iv" },
              { number: 19, paragraphId: "F", answer: "vi" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Urban parks and gardens can offer bees a more varied ___ than rural monocultures.", answer: ["diet"] },
              { number: 21, prompt: "High hive density in popular districts may cause honeybees to outcompete ___ bee species.", answer: ["native", "wild native", "wild"] },
              { number: 22, prompt: "Urban honey is often marketed as a distinctive, local product with particular tasting ___.", answer: ["notes"] },
              { number: 23, prompt: "In several jurisdictions, beekeepers must ___ their hives with the authorities.", answer: ["register"] },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "Why might cities offer a better environment for bees than some rural areas?", options: [{ id: "A", text: "Cities have fewer competing insect species." }, { id: "B", text: "Cities can provide a wider variety of flowering plants." }, { id: "C", text: "Cities have stricter pesticide bans everywhere." }, { id: "D", text: "Cities are cooler in temperature." }], answer: "B" },
              { number: 25, prompt: "What concern do some scientists raise about popular urban beekeeping districts?", options: [{ id: "A", text: "The honey produced is unsafe to eat." }, { id: "B", text: "Hive numbers are always too low to be useful." }, { id: "C", text: "High hive density can harm wild bee species." }, { id: "D", text: "Beekeeping is banned in most cities." }], answer: "C" },
              { number: 26, prompt: "What do some urban planners suggest about the future of urban beekeeping?", options: [{ id: "A", text: "It should be banned in favour of wild bee conservation." }, { id: "B", text: "It should be combined with other greening measures." }, { id: "C", text: "It should only take place in rural areas." }, { id: "D", text: "It requires no further policy support." }], answer: "B" },
            ],
          },
        ],
      },
      {
        id: "t1p3",
        title: "How Sleep Shapes Memory",
        text: `For much of the twentieth century, sleep was widely regarded by scientists as a largely passive state, valuable chiefly for physical rest and recovery, while the real business of learning and memory formation was assumed to take place during waking hours. Over the past thirty years, however, a substantial body of research has overturned this view, demonstrating that sleep plays an active and essential role in consolidating new memories.

Memory consolidation refers to the process by which a newly formed, fragile memory is stabilised and integrated into existing networks of knowledge in the brain. Deep, slow-wave sleep, which predominates in the earlier part of the night, appears particularly important for consolidating factual and event-based memories. Rapid eye movement, or REM, sleep, which becomes more frequent later in the night, has instead been associated with the consolidation of procedural and emotional memories, including motor skills and the processing of emotionally significant experiences.

A number of experiments have illustrated these effects directly. In one commonly cited study, participants who learned a sequence of finger movements and were then allowed to sleep showed greater overnight improvement in speed and accuracy than a comparable group who remained awake for an equivalent period, even though neither group practised the sequence again before being retested.

Sleep deprivation studies point in the same direction from the opposite angle. Individuals who are prevented from sleeping after learning a new task typically perform markedly worse on later tests of that material than well-rested individuals. Chronic partial sleep restriction, of the kind common among students during examination periods or workers doing shift work, has similarly been linked to measurable declines in attention and working memory.

Some researchers have gone further, proposing that sleep, and REM sleep in particular, contributes to creative problem-solving by allowing the brain to form novel and unusual associations between previously unrelated pieces of information. Controlled laboratory studies have found that participants given a period of sleep, including a dream-rich REM stage, are more likely to solve certain creative puzzles than participants who remained awake for the same interval.

Taken together, this body of research has practical implications well beyond the laboratory. Educational institutions have been urged to reconsider scheduling practices, such as early school start times, that curtail adolescent sleep during a developmental period when memory consolidation is especially dependent on adequate rest.`,
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Scientists have always agreed that sleep plays an active role in memory formation.", answer: "FALSE" },
              { number: 28, prompt: "Slow-wave sleep is more strongly associated with factual and event-based memory than REM sleep.", answer: "TRUE" },
              { number: 29, prompt: "REM sleep occurs more frequently in the earlier part of the night than in the later part.", answer: "FALSE" },
              { number: 30, prompt: "In the finger-movement study, both groups practised the sequence again before being retested.", answer: "FALSE" },
              { number: 31, prompt: "Chronic partial sleep restriction has been linked to declines in working memory.", answer: "TRUE" },
              { number: 32, prompt: "All scientists agree on the exact mechanism by which sleep supports creative problem-solving.", answer: "NOT GIVEN" },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "According to the passage, memory consolidation during sleep is:", options: [{ id: "A", text: "evenly spread across the whole night" }, { id: "B", text: "linked to specific sleep stages" }, { id: "C", text: "unrelated to sleep stage" }, { id: "D", text: "only relevant to procedural memory" }], answer: "B" },
              { number: 34, prompt: "What did the finger-movement sequence study demonstrate?", options: [{ id: "A", text: "Practice alone accounts for skill improvement." }, { id: "B", text: "Sleep can improve performance without further practice." }, { id: "C", text: "Sleep deprivation improves motor skills." }, { id: "D", text: "REM sleep has no effect on motor learning." }], answer: "B" },
              { number: 35, prompt: "What does the passage say about students and shift workers?", options: [{ id: "A", text: "They are unaffected by partial sleep restriction." }, { id: "B", text: "They tend to sleep more than average." }, { id: "C", text: "They commonly experience chronic partial sleep restriction." }, { id: "D", text: "They perform better with fragmented sleep." }], answer: "C" },
              { number: 36, prompt: "What practical recommendation is mentioned at the end of the passage?", options: [{ id: "A", text: "Schools should introduce more homework." }, { id: "B", text: "Schools should reconsider early start times." }, { id: "C", text: "Students should avoid REM sleep." }, { id: "D", text: "Workers should take shorter breaks." }], answer: "B" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Deep, slow-wave sleep predominates in the ___ part of the night.", answer: ["earlier"] },
              { number: 38, prompt: "REM sleep has been linked to the consolidation of procedural and ___ memories.", answer: ["emotional"] },
              { number: 39, prompt: "Sleep deprivation studies show that affected individuals perform worse on later ___ of learned material.", answer: ["tests"] },
              { number: 40, prompt: "Some researchers believe REM sleep helps form novel associations, contributing to creative ___.", answer: ["problem-solving", "problem solving"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "reading-mock-2",
    title: "IELTS Reading Mock Test 2",
    passages: [
      {
        id: "t2p1",
        title: "The Silk Road and Cultural Exchange",
        text: `The term "Silk Road" was coined only in the late nineteenth century by the German geographer Ferdinand von Richthofen, yet it describes a network of trade routes that had connected East Asia with the Mediterranean world for well over a thousand years before he gave it a name. Rather than a single road, the Silk Road was a shifting web of overland and maritime paths stretching from China through Central Asia, Persia, and the Arabian Peninsula, eventually reaching Europe and North Africa.

Silk, prized in Rome for its lightness and lustre, was indeed one of the most valuable commodities traded, but it was far from the only one. Merchants carried spices, precious stones, glassware, paper, gunpowder, and countless other goods along these routes, and no single trader typically travelled the entire distance; instead, goods were passed through a long relay of regional merchants, each handling only a portion of the total journey.

Beyond material goods, the Silk Road served as a conduit for ideas, religions, and technologies. Buddhism spread from India into China and beyond largely along these trade routes, carried by monks and merchants alike, while later centuries saw the movement of Islamic scholarship and the technology of paper-making travel in the opposite direction, from China toward the Islamic world and eventually into Europe.

The routes were never entirely safe or predictable. Political instability, banditry, and the rise and fall of empires along the way could close sections of the network for years or decades at a time. The Mongol Empire's expansion in the thirteenth century, despite its reputation for military conquest, is credited by many historians with a period of relative stability known as the Pax Mongolica, during which trade and travel along the routes became notably safer and more frequent than in preceding centuries.

Maritime routes gradually grew in importance alongside the overland paths, particularly from the fifteenth century onward, as improvements in shipbuilding and navigation made sea travel more efficient for bulk goods than slow overland caravans. This shift, combined with the rise of direct sea trade between Europe and Asia following the voyages of explorers such as Vasco da Gama, contributed to a long-term decline in the economic centrality of the traditional overland routes, though they never disappeared entirely.

Contemporary interest in the Silk Road has extended well beyond historical scholarship. In the twenty-first century, several governments have explicitly invoked the concept in large-scale infrastructure initiatives intended to improve trade connectivity across Asia, Africa, and Europe, borrowing the historical name to lend cultural resonance to distinctly modern economic ambitions.`,
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "The name \"Silk Road\" was used by traders themselves throughout its history.", answer: "FALSE" },
              { number: 2, prompt: "Silk was the only significant good traded along the Silk Road.", answer: "FALSE" },
              { number: 3, prompt: "Individual merchants typically travelled the entire length of the Silk Road.", answer: "FALSE" },
              { number: 4, prompt: "The spread of Buddhism into China was linked to Silk Road trade routes.", answer: "TRUE" },
              { number: 5, prompt: "Paper-making technology moved exclusively from Europe to China.", answer: "FALSE" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "The term \"Silk Road\" was coined by the German geographer Ferdinand von ___.", answer: ["Richthofen"] },
              { number: 7, prompt: "The period of relative stability during Mongol rule is known as the Pax ___.", answer: ["Mongolica"] },
              { number: 8, prompt: "Improvements in shipbuilding and navigation made ___ travel more efficient for bulk goods.", answer: ["sea", "sea travel"] },
              { number: 9, prompt: "Some modern governments have used the concept in large-scale ___ initiatives.", answer: ["infrastructure"] },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "The Silk Road is best described as:", options: [{ id: "A", text: "a single, well-defined road" }, { id: "B", text: "a shifting network of overland and maritime routes" }, { id: "C", text: "a route used only for silk" }, { id: "D", text: "a modern invention with no historical basis" }], answer: "B" },
              { number: 11, prompt: "What effect did the Mongol Empire's expansion have on trade routes, according to many historians?", options: [{ id: "A", text: "It made trade routes permanently unsafe." }, { id: "B", text: "It brought a period of relative stability and increased trade." }, { id: "C", text: "It ended all overland trade permanently." }, { id: "D", text: "It had no effect on trade." }], answer: "B" },
              { number: 12, prompt: "Why did maritime routes grow in importance from the fifteenth century onward?", options: [{ id: "A", text: "Overland caravans became faster than ships." }, { id: "B", text: "Shipbuilding and navigation improvements made sea travel more efficient for bulk goods." }, { id: "C", text: "Overland routes were completely destroyed." }, { id: "D", text: "Silk stopped being traded." }], answer: "B" },
              { number: 13, prompt: "How do some modern governments use the concept of the Silk Road today?", options: [{ id: "A", text: "To justify banning international trade." }, { id: "B", text: "To lend cultural resonance to modern infrastructure initiatives." }, { id: "C", text: "To restore ancient trade routes exactly as they were." }, { id: "D", text: "To limit connectivity between continents." }], answer: "B" },
            ],
          },
        ],
      },
      {
        id: "t2p2",
        title: "Renewable Energy in Small Island Nations",
        paragraphs: [
          { id: "A", text: "Small island developing states, scattered across the Pacific, Caribbean, and Indian Oceans, have historically relied heavily on imported diesel fuel to generate electricity, a dependence that leaves their economies exposed to volatile global oil prices and costly, logistically complex fuel shipments." },
          { id: "B", text: "In recent years, a growing number of these nations have pursued ambitious renewable energy targets, driven partly by the high cost of imported fuel and partly by a heightened awareness of their particular vulnerability to climate change. Several island governments have announced goals of reaching near-total renewable electricity generation within a matter of years rather than decades." },
          { id: "C", text: "Solar power has proved especially attractive in tropical island settings, given consistently high levels of sunlight throughout the year and the relative ease of installing photovoltaic panels without requiring the extensive grid infrastructure that larger continental nations rely upon. Some islands have paired solar installations with battery storage systems to address supply after sunset." },
          { id: "D", text: "Wind power has also been adopted in certain locations with consistently strong and predictable wind patterns, though its suitability varies considerably from island to island. In a small number of cases, geothermal energy has offered a further option, particularly on volcanically active islands where underground heat can be harnessed relatively close to the surface." },
          { id: "E", text: "Financing remains one of the most significant obstacles to a full transition. Renewable infrastructure typically requires substantial upfront investment, and small island nations often struggle to access affordable financing on the international market, a difficulty frequently attributed to their small economic size and perceived risk by lenders. International climate funds have stepped in to fill part of this gap." },
          { id: "F", text: "Beyond financing, technical capacity presents an ongoing challenge. Maintaining and repairing renewable energy systems requires locally trained technicians, and small populations can make it difficult to sustain the specialised workforce needed, leading some governments to invest in vocational training programmes alongside the physical infrastructure itself." },
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A–F. Choose the correct heading for each paragraph.",
            headings: [
              { id: "i", text: "A workforce challenge behind the scenes" },
              { id: "ii", text: "The traditional reliance on imported fuel" },
              { id: "iii", text: "External support for covering upfront costs" },
              { id: "iv", text: "Ambitious targets driven by cost and climate concerns" },
              { id: "v", text: "The appeal of an abundant natural resource" },
              { id: "vi", text: "Alternative options depending on local geography" },
              { id: "vii", text: "A decline in global oil prices" },
              { id: "viii", text: "The history of electricity generation on islands" },
            ],
            questions: [
              { number: 14, paragraphId: "A", answer: "ii" },
              { number: 15, paragraphId: "B", answer: "iv" },
              { number: 16, paragraphId: "C", answer: "v" },
              { number: 17, paragraphId: "D", answer: "vi" },
              { number: 18, paragraphId: "E", answer: "iii" },
              { number: 19, paragraphId: "F", answer: "i" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Many island nations have historically depended on imported ___ to generate electricity.", answer: ["diesel", "diesel fuel"] },
              { number: 21, prompt: "Some islands pair solar panels with ___ systems to maintain supply after dark.", answer: ["battery storage", "battery"] },
              { number: 22, prompt: "On volcanically active islands, ___ energy can be harnessed close to the surface.", answer: ["geothermal"] },
              { number: 23, prompt: "Small island nations often struggle to access affordable ___ on the international market.", answer: ["financing"] },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "Why are small island nations exposed to volatile oil prices?", options: [{ id: "A", text: "They produce their own oil inefficiently." }, { id: "B", text: "They rely heavily on imported diesel fuel." }, { id: "C", text: "They have no electricity grid at all." }, { id: "D", text: "They export diesel to other countries." }], answer: "B" },
              { number: 25, prompt: "What is mentioned as a key advantage of solar power for tropical islands?", options: [{ id: "A", text: "It requires extensive new grid infrastructure." }, { id: "B", text: "It works only during cloudy weather." }, { id: "C", text: "High year-round sunlight and easy installation." }, { id: "D", text: "It is cheaper than diesel only in winter." }], answer: "C" },
              { number: 26, prompt: "What challenge is described in the final paragraph?", options: [{ id: "A", text: "A shortage of sunlight" }, { id: "B", text: "The difficulty of maintaining a locally trained technical workforce" }, { id: "C", text: "Excess electricity supply" }, { id: "D", text: "Opposition from local communities" }], answer: "B" },
            ],
          },
        ],
      },
      {
        id: "t2p3",
        title: "The Psychology of Decision-Making Under Uncertainty",
        text: `Classical economic theory long assumed that human beings make decisions by rationally weighing the costs, benefits, and probabilities associated with each available option, arriving at the choice that maximises expected value. Beginning in the 1970s, however, psychologists Daniel Kahneman and Amos Tversky conducted a series of experiments demonstrating that real human judgement under uncertainty deviates from this idealised model in consistent and predictable ways.

One influential concept to emerge from this research is loss aversion, the observation that people tend to feel the pain of a loss more intensely than the pleasure of an equivalent gain. In practical terms, this means that many individuals will reject a fair coin-flip gamble offering an equal chance of winning or losing the same amount of money, even though a purely rational actor should be willing to accept such a bet.

Another key finding concerns the availability heuristic, a mental shortcut in which people judge the probability of an event based on how easily relevant examples come to mind, rather than on objective statistical data. Vivid, heavily reported events such as plane crashes or shark attacks are often judged to be far more likely than they statistically are, while more mundane but statistically greater risks, such as heart disease, receive comparatively less psychological weight.

Framing effects represent a further departure from purely rational decision-making. Experiments have repeatedly shown that people respond differently to logically identical information depending on how it is presented. A medical treatment described as having a "90 percent survival rate" is typically viewed far more favourably than the same treatment described as having a "10 percent mortality rate," despite the two descriptions conveying identical statistical information.

These findings have practical applications well beyond academic psychology. Policymakers have increasingly applied insights from behavioural economics to areas such as retirement savings and public health messaging, often through so-called "nudges" that adjust the framing or default settings of a choice without restricting the options available. Automatically enrolling employees into a pension scheme, with the option to opt out, has proved far more effective at increasing participation than requiring employees to actively opt in.

Critics of behavioural economics caution against over-generalising from laboratory experiments, noting that decisions made under controlled, low-stakes conditions may not always predict behaviour in complex, high-stakes, real-world situations. Nonetheless, the core observation that human decision-making regularly departs from strict rational-choice models has become widely accepted across economics and psychology alike.`,
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Classical economic theory assumed that people always make irrational decisions.", answer: "FALSE" },
              { number: 28, prompt: "Kahneman and Tversky's experiments began in the 1970s.", answer: "TRUE" },
              { number: 29, prompt: "According to loss aversion, people generally feel gains more intensely than losses of the same size.", answer: "FALSE" },
              { number: 30, prompt: "The availability heuristic can cause people to overestimate the likelihood of vivid, heavily reported events.", answer: "TRUE" },
              { number: 31, prompt: "Framing effects only influence people's decisions in medical contexts.", answer: "FALSE" },
              { number: 32, prompt: "All critics of behavioural economics reject its findings entirely.", answer: "NOT GIVEN" },
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What does loss aversion describe?", options: [{ id: "A", text: "People feeling losses and gains equally." }, { id: "B", text: "People feeling losses more intensely than equivalent gains." }, { id: "C", text: "People always avoiding any form of risk." }, { id: "D", text: "People preferring guaranteed losses over gains." }], answer: "B" },
              { number: 34, prompt: "What is the availability heuristic based on?", options: [{ id: "A", text: "Objective statistical data only" }, { id: "B", text: "How easily examples come to mind" }, { id: "C", text: "Government risk reports" }, { id: "D", text: "Random chance" }], answer: "B" },
              { number: 35, prompt: "What example is given of a framing effect?", options: [{ id: "A", text: "Comparing \"90 percent survival\" versus \"10 percent mortality\" descriptions" }, { id: "B", text: "Comparing coin-flip gambles" }, { id: "C", text: "Comparing plane crashes and shark attacks" }, { id: "D", text: "Comparing retirement ages across countries" }], answer: "A" },
              { number: 36, prompt: "What is mentioned as an effective way to increase pension scheme participation?", options: [{ id: "A", text: "Increasing mandatory contribution amounts" }, { id: "B", text: "Automatically enrolling employees with an opt-out option" }, { id: "C", text: "Banning employees from opting out" }, { id: "D", text: "Removing pension schemes altogether" }], answer: "B" },
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Kahneman and Tversky showed that human judgement under uncertainty deviates from the classical ___ model.", answer: ["rational", "rational choice"] },
              { number: 38, prompt: "The availability heuristic is a mental ___ used to judge probability.", answer: ["shortcut"] },
              { number: 39, prompt: "Adjustments that change the framing or default settings of a choice are sometimes called ___.", answer: ["nudges"] },
              { number: 40, prompt: "Critics warn against over-generalising from ___ experiments to real-world behaviour.", answer: ["laboratory"] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "reading-mock-3",
    title: "IELTS Reading Mock Test 3",
    passages: [
      {
        id: "t3p1",
        title: "A Brief History of Timekeeping",
        text: "The measurement of time has occupied human societies for millennia, evolving from crude observations of natural cycles to instruments capable of measuring intervals far too brief for human senses to perceive directly. The earliest timekeeping relied entirely on astronomical observation: the daily passage of the sun, the monthly cycle of the moon, and the yearly progression of seasons provided the basic units from which calendars were built.\n\nSundials, among the oldest known timekeeping devices, appeared independently in several ancient civilisations, including Egypt and Babylon, and worked by casting a shadow whose position indicated the hour. Their major limitation was obvious: they were useless at night or on overcast days, and their accuracy varied with the seasons, since the sun's path across the sky changes throughout the year.\n\nWater clocks, or clepsydrae, offered an alternative that functioned regardless of daylight, measuring time through the steady, controlled flow of water from one container to another. Ancient Chinese, Greek, and Egyptian societies all developed their own versions, and some later water clocks incorporated elaborate mechanisms to drive additional displays, such as moving figures or astronomical models, well beyond simple timekeeping.\n\nThe mechanical clock, which emerged in Europe during the late thirteenth century, represented a fundamental shift toward devices governed by regulated mechanical motion rather than the continuous flow of a natural substance. Early mechanical clocks relied on a verge-and-foliot escapement, a mechanism that regulated the release of energy from a falling weight, though these early devices were notoriously inaccurate, often losing or gaining as much as fifteen minutes per day.\n\nA major leap in precision arrived in 1656, when the Dutch scientist Christiaan Huygens developed the first pendulum clock, applying Galileo's earlier observations about the regular period of a swinging pendulum to timekeeping. Pendulum clocks reduced typical error to under a minute per day, a dramatic improvement that made clocks genuinely useful for coordinating daily activities across a community for the first time.\n\nThe twentieth century brought two further transformative advances. Quartz clocks, which use the extremely regular vibration of a quartz crystal under electrical current to regulate timekeeping, became widely available from the 1970s onward and offered accuracy far surpassing any purely mechanical device at a fraction of the cost. Atomic clocks, developed slightly earlier but refined considerably since, measure time based on the vibration frequency of atoms such as caesium, and are now so precise that the most advanced examples would neither gain nor lose a single second over many millions of years.\n\nToday, precise timekeeping underpins far more than personal punctuality. Global navigation satellite systems, international financial markets, and telecommunications networks all depend on atomic-clock-level synchronisation, a level of precision that would have been entirely unimaginable to the ancient astronomers who first divided the day by watching a shadow move across the ground.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Sundials were only ever used in ancient Egypt.", answer: "FALSE" },
              { number: 2, prompt: "Sundials remained accurate at night as long as the sky was clear.", answer: "FALSE" },
              { number: 3, prompt: "Some later water clocks were built to drive displays beyond simple timekeeping.", answer: "TRUE" },
              { number: 4, prompt: "Early mechanical clocks using the verge-and-foliot escapement were highly accurate.", answer: "FALSE" },
              { number: 5, prompt: "Christiaan Huygens based his pendulum clock on observations made by Galileo.", answer: "TRUE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Water clocks are also known as ___.", answer: ["clepsydrae", "clepsydra"] },
              { number: 7, prompt: "The mechanical clock emerged in Europe during the late ___ century.", answer: ["thirteenth"] },
              { number: 8, prompt: "Huygens's pendulum clock reduced typical error to under a ___ per day.", answer: ["minute"] },
              { number: 9, prompt: "Atomic clocks measure time based on the vibration frequency of atoms such as ___.", answer: ["caesium", "cesium"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "What was a major limitation of sundials?", options: [{ id: "A", text: "They were too expensive to build" }, { id: "B", text: "They did not work at night or in poor weather" }, { id: "C", text: "They could only be used in Babylon" }, { id: "D", text: "They required electricity" }], answer: "B" },
              { number: 11, prompt: "What regulated the early mechanical clock's motion?", options: [{ id: "A", text: "A quartz crystal" }, { id: "B", text: "A verge-and-foliot escapement" }, { id: "C", text: "A pendulum" }, { id: "D", text: "An atomic vibration" }], answer: "B" },
              { number: 12, prompt: "What advantage did quartz clocks offer from the 1970s onward?", options: [{ id: "A", text: "Lower accuracy but lower cost" }, { id: "B", text: "Greater accuracy than mechanical clocks at lower cost" }, { id: "C", text: "They eliminated the need for calendars" }, { id: "D", text: "They required no electrical current" }], answer: "B" },
              { number: 13, prompt: "What modern systems depend on atomic-clock-level synchronisation, according to the passage?", options: [{ id: "A", text: "Only personal wristwatches" }, { id: "B", text: "Global navigation satellites, financial markets, and telecommunications" }, { id: "C", text: "Sundials and water clocks" }, { id: "D", text: "Only astronomical observatories" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t3p2",
        title: "Coral Reef Ecosystems",
        paragraphs: [
          { id: "A", text: "Coral reefs, often described as the rainforests of the sea, occupy less than one percent of the ocean floor yet support an estimated quarter of all marine species at some stage of their life cycle, making them among the most biologically productive and diverse ecosystems on the planet despite their comparatively small physical footprint." },
          { id: "B", text: "The coral organisms that form the physical structure of a reef are tiny animals called polyps, which live in large colonies and secrete calcium carbonate to build a hard external skeleton; over centuries, the accumulated skeletons of countless generations of polyps form the vast limestone structures recognisable as coral reefs." },
          { id: "C", text: "Most reef-building corals depend on a symbiotic relationship with microscopic algae called zooxanthellae, which live within the coral's tissue and supply the majority of the coral's energy needs through photosynthesis, in exchange for a protected environment and access to compounds the coral produces as waste." },
          { id: "D", text: "Rising ocean temperatures pose a severe threat to this symbiotic relationship, since sustained heat stress causes corals to expel their zooxanthellae in a process known as coral bleaching, leaving the coral without its primary energy source and, if the stress continues for an extended period, at serious risk of starvation and death." },
          { id: "E", text: "Ocean acidification, driven by the ocean's absorption of increasing atmospheric carbon dioxide, presents a further compounding threat, since more acidic water makes it progressively more difficult for corals to extract the calcium carbonate needed to build and maintain their skeletons." },
          { id: "F", text: "Conservation efforts now range from marine protected areas that limit fishing and physical disturbance to more experimental approaches, including the cultivation of heat-resistant coral strains in nurseries for later transplantation onto damaged reefs, though scientists caution that such measures alone cannot fully offset the effects of continued global warming." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "A vital energy-supplying partnership under threat" }, { id: "ii", text: "The tiny animals responsible for building reef structures" }, { id: "iii", text: "A second, chemical threat to coral survival" }, { id: "iv", text: "Disproportionate biological richness in a small area" }, { id: "v", text: "Approaches to protecting and restoring damaged reefs" }, { id: "vi", text: "The historical discovery of coral reefs" }, { id: "vii", text: "The process and consequences of coral bleaching" }, { id: "viii", text: "Commercial uses of coral limestone" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "iv" },
              { number: 15, paragraphId: "B", answer: "ii" },
              { number: 16, paragraphId: "C", answer: "i" },
              { number: 17, paragraphId: "D", answer: "vii" },
              { number: 18, paragraphId: "E", answer: "iii" },
              { number: 19, paragraphId: "F", answer: "v" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Coral reefs occupy less than one percent of the ___ floor.", answer: ["ocean"] },
              { number: 21, prompt: "Coral polyps secrete calcium carbonate to build a hard external ___.", answer: ["skeleton"] },
              { number: 22, prompt: "Zooxanthellae supply most of the coral's energy through ___.", answer: ["photosynthesis"] },
              { number: 23, prompt: "Heat stress can cause corals to expel their zooxanthellae in a process called coral ___.", answer: ["bleaching"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What is unusual about coral reefs, according to paragraph A?", options: [{ id: "A", text: "They cover most of the ocean floor" }, { id: "B", text: "They support a quarter of marine species despite covering under 1% of the ocean floor" }, { id: "C", text: "They contain no marine life" }, { id: "D", text: "They are found only in freshwater" }], answer: "B" },
              { number: 25, prompt: "What do zooxanthellae receive in exchange for supplying energy to coral?", options: [{ id: "A", text: "Nothing in return" }, { id: "B", text: "A protected environment and the coral's waste compounds" }, { id: "C", text: "A share of the coral's calcium carbonate" }, { id: "D", text: "Transportation to new reefs" }], answer: "B" },
              { number: 26, prompt: "What does ocean acidification make more difficult for corals?", options: [{ id: "A", text: "Photosynthesis" }, { id: "B", text: "Expelling zooxanthellae" }, { id: "C", text: "Extracting calcium carbonate to build their skeletons" }, { id: "D", text: "Reproducing sexually" }], answer: "C" }
            ],
          }
        ],
      },
      {
        id: "t3p3",
        title: "The Science of Habit Formation",
        text: "Habits, broadly defined as behaviours performed automatically in response to a particular context with minimal conscious deliberation, form a substantial portion of daily human activity, with some researchers estimating that as much as forty percent of daily actions are habitual rather than the product of active, in-the-moment decision-making.\n\nThe neurological basis of habit formation centres on a region of the brain called the basal ganglia, which becomes increasingly involved as a behaviour is repeated, gradually taking over functions initially handled by the prefrontal cortex, the brain region associated with deliberate, effortful decision-making. This neurological shift explains why well-established habits require so little conscious effort compared with new or unfamiliar behaviours.\n\nA widely cited model describes habit formation as a three-part loop: a cue, which triggers the behaviour; a routine, the behaviour itself; and a reward, which reinforces the association between the cue and the routine, making the behaviour more likely to recur when the same cue appears again in the future. Over repeated cycles, this loop becomes increasingly automatic, requiring progressively less conscious attention to execute.\n\nContrary to a popular claim suggesting that new habits form reliably within twenty-one days, research by health psychologist Phillippa Lally and colleagues found considerably more variation in practice, with participants in one frequently cited study taking anywhere from eighteen to over two hundred and fifty days to form a new habit, depending substantially on the complexity of the behaviour and individual differences between participants.\n\nBreaking an established habit generally proves more difficult than forming a new one, since the neural pathways underlying a well-practised habit do not simply disappear once the behaviour stops; instead, they tend to remain latent, meaning that old habits can resurface unexpectedly, particularly under conditions of stress, when the more effortful, deliberate cognitive systems needed to override an automatic response become less readily available.\n\nBehavioural scientists increasingly recommend a strategy of habit substitution rather than elimination alone when trying to change an unwanted behaviour, on the basis that maintaining the same cue and reward while deliberately inserting a new, healthier routine in between tends to prove considerably more sustainable than attempting to eliminate an established cue-routine-reward loop altogether without replacing it with anything.\n\nEnvironmental design has also emerged as a particularly effective, low-effort strategy for habit change, since altering the cues present in one's immediate physical environment, such as removing unhealthy snacks from visible kitchen counters or placing running shoes prominently by the front door, can significantly shift behaviour without requiring any additional exercise of willpower or conscious self-control.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Researchers estimate that habitual behaviour accounts for a significant portion of daily human activity.", answer: "TRUE" },
              { number: 28, prompt: "The basal ganglia becomes less involved as a behaviour becomes more habitual.", answer: "FALSE" },
              { number: 29, prompt: "The three-part habit loop consists of a cue, a routine, and a reward.", answer: "TRUE" },
              { number: 30, prompt: "Lally's research confirmed that new habits reliably form within exactly twenty-one days.", answer: "FALSE" },
              { number: 31, prompt: "Neural pathways underlying an old habit disappear completely once the habit is broken.", answer: "FALSE" },
              { number: 32, prompt: "Stress can make it harder to override an automatic habitual response.", answer: "TRUE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What happens neurologically as a behaviour becomes habitual?", options: [{ id: "A", text: "The prefrontal cortex becomes more active" }, { id: "B", text: "The basal ganglia takes over functions from the prefrontal cortex" }, { id: "C", text: "The behaviour requires more conscious effort" }, { id: "D", text: "No brain regions are involved" }], answer: "B" },
              { number: 34, prompt: "What did Lally's research find about the time needed to form a new habit?", options: [{ id: "A", text: "It always takes exactly 21 days" }, { id: "B", text: "It varied considerably, from 18 to over 250 days" }, { id: "C", text: "It takes less than a week for everyone" }, { id: "D", text: "It depends only on age" }], answer: "B" },
              { number: 35, prompt: "What strategy do behavioural scientists increasingly recommend for changing unwanted habits?", options: [{ id: "A", text: "Eliminating the cue and reward entirely" }, { id: "B", text: "Habit substitution: keeping the cue and reward but changing the routine" }, { id: "C", text: "Relying solely on willpower" }, { id: "D", text: "Avoiding all analysis of the habit loop" }], answer: "B" },
              { number: 36, prompt: "What is given as an example of environmental design for habit change?", options: [{ id: "A", text: "Increasing willpower through meditation" }, { id: "B", text: "Removing unhealthy snacks from visible counters" }, { id: "C", text: "Studying the basal ganglia" }, { id: "D", text: "Setting a strict 21-day countdown" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Habits are behaviours performed automatically with minimal conscious ___.", answer: ["deliberation"] },
              { number: 38, prompt: "The habit loop begins with a ___ that triggers the behaviour.", answer: ["cue"] },
              { number: 39, prompt: "Breaking an established habit is generally more difficult than ___ a new one.", answer: ["forming"] },
              { number: 40, prompt: "Placing running shoes by the front door is an example of ___ design.", answer: ["environmental"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-4",
    title: "IELTS Reading Mock Test 4",
    passages: [
      {
        id: "t4p1",
        title: "The Silk Road and Ancient Trade",
        text: "Stretching more than six thousand kilometres across deserts, mountains, and steppes, the network of trade routes now commonly known as the Silk Road connected China with the Mediterranean world for well over a thousand years, facilitating not only the exchange of goods but also the transmission of ideas, technologies, religions, and diseases between civilisations that would otherwise have had little direct contact.\n\nThe term \"Silk Road\" is, somewhat misleadingly, a nineteenth-century invention, coined by the German geographer Ferdinand von Richthofen; contemporary traders themselves rarely used any single collective name for the shifting, informal network of caravan routes they actually travelled, which varied considerably over time in response to political stability, climate, and the rise and fall of the empires that controlled particular sections.\n\nSilk was indeed among the most valuable commodities to travel westward, so prized in the Roman Empire that its production process remained a closely guarded Chinese state secret for centuries, reportedly punishable by death for anyone who attempted to smuggle silkworm eggs out of the country, until the secret eventually reached the Byzantine Empire around the sixth century CE.\n\nHowever, silk represented only one commodity among many. Spices, precious stones, glassware, paper, and gunpowder all moved along these routes in various directions, and the routes carried far more than physical goods: Buddhism spread from India into Central Asia and eventually China largely along Silk Road pathways, while later centuries saw the transmission of Islamic scholarship, mathematical concepts including the Hindu-Arabic numeral system, and various artistic and architectural styles.\n\nFew, if any, individual merchants travelled the entire length of the route; instead, goods typically passed through a long chain of regional traders, with merchandise changing hands, and often changing form through local processing, numerous times between its point of origin and its final destination, a system that also meant that ideas and cultural practices might be gradually transformed as they passed from one intermediary culture to the next.\n\nThe Mongol Empire's unification of much of Eurasia under a single political structure during the thirteenth and fourteenth centuries, a period sometimes called the Pax Mongolica, dramatically improved the safety and reliability of overland trade routes, prompting a marked increase in long-distance travel, including the well-documented journey of the Venetian merchant Marco Polo to the court of Kublai Khan.\n\nThe eventual decline of Silk Road overland trade resulted from multiple compounding factors, including the fragmentation of Mongol political unity, but perhaps most significantly from the development of viable maritime trade routes by European powers from the late fifteenth century onward, which offered a considerably cheaper and more efficient means of transporting bulk goods between Asia and Europe than the slow, costly overland caravan system could ever achieve.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "The term \"Silk Road\" was used by ancient traders themselves to describe the network.", answer: "FALSE" },
              { number: 2, prompt: "China's silk production process was kept secret for centuries.", answer: "TRUE" },
              { number: 3, prompt: "Silk was the only commodity ever traded along the Silk Road.", answer: "FALSE" },
              { number: 4, prompt: "Most individual merchants travelled the entire length of the Silk Road themselves.", answer: "FALSE" },
              { number: 5, prompt: "The Pax Mongolica made overland trade routes safer and more reliable.", answer: "TRUE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "The term \"Silk Road\" was coined by the geographer Ferdinand von ___.", answer: ["Richthofen"] },
              { number: 7, prompt: "The secret of silk production reportedly reached the Byzantine Empire around the ___ century CE.", answer: ["sixth"] },
              { number: 8, prompt: "Buddhism spread from India into Central Asia and eventually ___ along Silk Road pathways.", answer: ["China"] },
              { number: 9, prompt: "Marco Polo travelled to the court of ___.", answer: ["Kublai Khan"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "Why is the term \"Silk Road\" described as somewhat misleading?", options: [{ id: "A", text: "Silk was never actually traded on it" }, { id: "B", text: "It was coined in the 19th century and wasn't used by contemporary traders as a single name" }, { id: "C", text: "It only refers to a single, fixed route" }, { id: "D", text: "It refers only to maritime trade" }], answer: "B" },
              { number: 11, prompt: "What happened to goods as they moved along the Silk Road network?", options: [{ id: "A", text: "They travelled directly from origin to destination without changing hands" }, { id: "B", text: "They typically passed through many regional traders, sometimes being processed locally" }, { id: "C", text: "They were only ever carried by Chinese merchants" }, { id: "D", text: "They were never changed in form" }], answer: "B" },
              { number: 12, prompt: "What most significantly caused the decline of overland Silk Road trade?", options: [{ id: "A", text: "The invention of silk elsewhere" }, { id: "B", text: "The development of cheaper, more efficient maritime trade routes" }, { id: "C", text: "A ban on all overland travel" }, { id: "D", text: "The disappearance of demand for spices" }], answer: "B" },
              { number: 13, prompt: "What does the passage say about ideas moving along the Silk Road?", options: [{ id: "A", text: "Only goods moved, never ideas" }, { id: "B", text: "Ideas such as Buddhism and mathematical concepts spread along the routes" }, { id: "C", text: "Ideas moved only from Europe to Asia" }, { id: "D", text: "Religious ideas were banned from travelling" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t4p2",
        title: "How Migratory Birds Navigate",
        paragraphs: [
          { id: "A", text: "Each year, an estimated fifty billion birds undertake migratory journeys, some travelling remarkable distances between breeding and wintering grounds, with the Arctic tern holding the record for the longest annual migration of any animal, travelling an estimated seventy thousand kilometres round trip between the Arctic and Antarctic regions." },
          { id: "B", text: "Understanding precisely how migratory birds navigate such vast distances, often returning to the exact same nesting site year after year, has occupied ornithologists for well over a century, and current evidence suggests that birds rely not on any single mechanism but on a combination of several complementary navigational systems." },
          { id: "C", text: "Many species appear capable of sensing the Earth's magnetic field, a capability known as magnetoreception, which is thought to involve specialised light-sensitive proteins in the eye called cryptochromes, potentially allowing birds to perceive magnetic field lines as a visual pattern overlaid on their normal vision, though the precise mechanism remains an active area of scientific investigation." },
          { id: "D", text: "Celestial cues also play a documented role in bird navigation: several species have been shown experimentally to use the position of the sun during the day and the pattern of stars at night, with young birds of some species apparently learning to recognise the rotational centre of the night sky during a critical developmental period before their first migration." },
          { id: "E", text: "Olfactory, or scent-based, navigation has been demonstrated in certain species, most notably homing pigeons, which appear capable of using a mental map of environmental odours encountered near their home loft to help determine their position relative to it, even after being displaced to unfamiliar locations far away." },
          { id: "F", text: "Climate change poses an increasingly documented threat to migratory bird populations by disrupting the precise timing between migration schedules, evolved over many generations, and the seasonal availability of food resources at stopover and breeding sites, potentially causing birds to arrive too early or too late relative to peak food abundance." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "A scent-based method of finding the way home" }, { id: "ii", text: "The remarkable scale of annual bird migration" }, { id: "iii", text: "A newly discovered feeding technique" }, { id: "iv", text: "Using the sun and stars to navigate" }, { id: "v", text: "A threat posed by changing seasonal patterns" }, { id: "vi", text: "Sensing the Earth's magnetic field" }, { id: "vii", text: "The long-standing scientific puzzle of bird navigation" }, { id: "viii", text: "Migratory routes shaped by human development" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "ii" },
              { number: 15, paragraphId: "B", answer: "vii" },
              { number: 16, paragraphId: "C", answer: "vi" },
              { number: 17, paragraphId: "D", answer: "iv" },
              { number: 18, paragraphId: "E", answer: "i" },
              { number: 19, paragraphId: "F", answer: "v" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "The Arctic tern holds the record for the longest annual ___ of any animal.", answer: ["migration"] },
              { number: 21, prompt: "Magnetoreception is thought to involve light-sensitive proteins called ___.", answer: ["cryptochromes"] },
              { number: 22, prompt: "Young birds may learn to recognise the rotational centre of the night ___.", answer: ["sky"] },
              { number: 23, prompt: "Homing pigeons appear to use a mental map of environmental ___.", answer: ["odours", "odors"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What is suggested about how birds navigate, according to paragraph B?", options: [{ id: "A", text: "They rely on a single navigational mechanism" }, { id: "B", text: "They likely use a combination of several complementary systems" }, { id: "C", text: "They do not navigate at all, but wander randomly" }, { id: "D", text: "They rely exclusively on human-made landmarks" }], answer: "B" },
              { number: 25, prompt: "What has been demonstrated in homing pigeons specifically?", options: [{ id: "A", text: "Magnetic field sensing only" }, { id: "B", text: "Olfactory, scent-based navigation" }, { id: "C", text: "Navigation using only star patterns" }, { id: "D", text: "An inability to return home after displacement" }], answer: "B" },
              { number: 26, prompt: "What threat does climate change pose to migratory birds, according to the passage?", options: [{ id: "A", text: "It has no effect on migration" }, { id: "B", text: "It disrupts the timing between migration and food availability" }, { id: "C", text: "It only affects non-migratory birds" }, { id: "D", text: "It improves food availability at all stopover sites" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t4p3",
        title: "The Placebo Effect in Medicine",
        text: "The placebo effect, broadly defined as a measurable improvement in a patient's condition resulting from an inactive treatment rather than from any direct pharmacological or physiological action, has been documented in clinical research for well over a century, yet the precise mechanisms underlying it remain incompletely understood even today.\n\nEarly clinical trial design treated the placebo effect primarily as a methodological nuisance to be controlled for, leading to the widespread adoption of placebo-controlled trials, in which one group of participants receives an inactive substance while another receives the treatment actually being tested, allowing researchers to isolate the treatment's genuine effect from improvements that might have occurred regardless of any active intervention.\n\nContemporary research, however, increasingly treats the placebo effect as a genuine, biologically real phenomenon worthy of study in its own right rather than merely a statistical artefact to be subtracted out. Brain imaging studies have documented measurable changes in neural activity following placebo administration, particularly in pain processing, with several studies showing that placebo treatments can trigger the release of the body's own natural pain-relieving compounds, called endorphins.\n\nExpectation appears to play a central role in generating placebo responses: patients who are told, and who genuinely believe, that a treatment will be effective tend to show stronger placebo responses than those who are uncertain or sceptical about a treatment's likely effectiveness, a finding with significant implications for how clinicians communicate with patients about treatment options, including inactive ones.\n\nInterestingly, several controlled studies have found that placebo effects can occur even when patients are explicitly informed that they are receiving an inactive treatment, a phenomenon researchers have termed the \"open-label placebo effect,\" suggesting that the ritual and context surrounding treatment administration may itself carry some therapeutic value independent of any element of patient deception.\n\nThe related but distinct nocebo effect describes the opposite phenomenon: negative outcomes or side effects experienced by a patient as a result of negative expectations about a treatment, rather than from any genuine harmful property of the substance itself, a pattern documented, for instance, when patients informed of a medication's possible side effects subsequently report experiencing those exact side effects at notably higher rates than patients not given the same information.\n\nEthical considerations surrounding placebo use in both clinical practice and research remain genuinely contested, with ongoing debate concerning whether it is ever ethically appropriate to withhold known effective treatment from a control group purely for research purposes, particularly in trials involving serious or life-threatening medical conditions where doing so could carry meaningful risk to trial participants.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "The placebo effect has only recently been documented in clinical research, within the past decade.", answer: "FALSE" },
              { number: 28, prompt: "Early clinical trials treated the placebo effect mainly as something to control for statistically.", answer: "TRUE" },
              { number: 29, prompt: "Brain imaging studies have found no measurable neural changes following placebo administration.", answer: "FALSE" },
              { number: 30, prompt: "Patients who believe a treatment will work tend to show stronger placebo responses.", answer: "TRUE" },
              { number: 31, prompt: "Open-label placebo effects require that patients be deceived about their treatment.", answer: "FALSE" },
              { number: 32, prompt: "All researchers agree that placebo use in clinical trials raises no ethical concerns.", answer: "FALSE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "How did early clinical trial design typically treat the placebo effect?", options: [{ id: "A", text: "As the primary subject of study" }, { id: "B", text: "As a methodological nuisance to be controlled for" }, { id: "C", text: "As proof that all treatments are ineffective" }, { id: "D", text: "As irrelevant to trial design" }], answer: "B" },
              { number: 34, prompt: "What have brain imaging studies shown about placebo treatments and pain?", options: [{ id: "A", text: "They have no effect on pain processing" }, { id: "B", text: "They can trigger release of the body's own natural pain-relieving compounds" }, { id: "C", text: "They only work on non-pain conditions" }, { id: "D", text: "They increase pain sensitivity" }], answer: "B" },
              { number: 35, prompt: "What is the \"open-label placebo effect\"?", options: [{ id: "A", text: "A placebo effect that only occurs when patients are deceived" }, { id: "B", text: "A placebo effect that can occur even when patients know they're receiving an inactive treatment" }, { id: "C", text: "A treatment that is always effective" }, { id: "D", text: "A term for the nocebo effect" }], answer: "B" },
              { number: 36, prompt: "What does the nocebo effect describe?", options: [{ id: "A", text: "Positive outcomes from an active treatment" }, { id: "B", text: "Negative outcomes resulting from negative expectations, not the substance itself" }, { id: "C", text: "A treatment with no measurable effect at all" }, { id: "D", text: "A treatment that is always harmful" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Placebo-controlled trials allow researchers to isolate a treatment's genuine effect from ___ that might occur anyway.", answer: ["improvements"] },
              { number: 38, prompt: "Placebo pain relief has been linked to the release of natural compounds called ___.", answer: ["endorphins"] },
              { number: 39, prompt: "Patients told about possible side effects sometimes report experiencing those side effects due to the ___ effect.", answer: ["nocebo"] },
              { number: 40, prompt: "Debate continues over whether withholding effective treatment from a control group is ethically ___.", answer: ["appropriate"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-5",
    title: "IELTS Reading Mock Test 5",
    passages: [
      {
        id: "t5p1",
        title: "A Brief History of Currency",
        text: "Long before the invention of coined money, human societies relied on various forms of barter and, later, commodity money, in which items possessing intrinsic value or usefulness, such as cattle, grain, salt, or shells, served simultaneously as goods and as a medium of exchange, a system that functioned adequately for small-scale, local trade but became increasingly cumbersome as trade networks expanded across greater distances.\n\nThe first known coined money appeared in the kingdom of Lydia, in present-day western Turkey, around the seventh century BCE, made from electrum, a naturally occurring alloy of gold and silver; these early coins were stamped with official symbols, providing a guarantee of the metal's weight and purity that eliminated the need to verify a payment's value through weighing or testing at every single transaction.\n\nThe use of coined money spread rapidly throughout the ancient Mediterranean world, with Greek city-states, and later the Roman Empire, developing sophisticated monetary systems, though the value of coinage remained fundamentally tied to the precious metal content of each individual coin throughout this entire ancient period, a principle now generally referred to as commodity-backed currency.\n\nPaper money represented a considerably later and, in several respects, more radical innovation, first appearing in China during the Tang and Song dynasties, initially as a form of promissory note representing an underlying deposit of coins that would have been physically inconvenient to transport across long trade routes, before evolving into currency issued and guaranteed directly by the state itself.\n\nEuropean adoption of paper money lagged China's by several centuries, with the first sustained European paper currency generally credited to Sweden in 1661, and widespread adoption elsewhere in Europe following considerably more gradually over subsequent decades, often accompanied by considerable public scepticism regarding paper's intrinsic worthlessness compared with coined precious metal.\n\nThe twentieth century witnessed the near-total abandonment of the gold standard, the practice of directly backing a nation's currency with a fixed, guaranteed quantity of physical gold, a system that had provided a degree of long-term price stability but simultaneously constrained a government's ability to adjust its money supply flexibly in response to economic crises, such as recessions or banking panics.\n\nContemporary currency exists overwhelmingly as what economists term fiat money, meaning currency that holds value purely because a government has declared it legal tender and, crucially, because the public collectively maintains sufficient confidence and trust in its value, rather than because the currency is backed by any physical commodity such as gold or silver held in reserve.\n\nThe most recent chapter in this long historical progression is the emergence of digital and cryptocurrencies, which dispense with physical currency entirely, existing instead as encrypted digital records verified through decentralised computer networks, representing, according to some economists and commentators, as significant a conceptual shift in the fundamental nature of money as the original invention of coinage itself.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Commodity money involved items that had value only as a medium of exchange, not as goods themselves.", answer: "FALSE" },
              { number: 2, prompt: "The first known coined money appeared in Lydia and was made from electrum.", answer: "TRUE" },
              { number: 3, prompt: "Ancient coinage value was tied purely to a government's declaration, not to precious metal content.", answer: "FALSE" },
              { number: 4, prompt: "Paper money first appeared in Europe before it appeared in China.", answer: "FALSE" },
              { number: 5, prompt: "Sweden is generally credited with the first sustained European paper currency.", answer: "TRUE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Early Lydian coins were stamped with official symbols to guarantee their weight and ___.", answer: ["purity"] },
              { number: 7, prompt: "Chinese paper money initially represented an underlying deposit of ___.", answer: ["coins"] },
              { number: 8, prompt: "The gold standard directly backed a nation's currency with a fixed quantity of physical ___.", answer: ["gold"] },
              { number: 9, prompt: "Contemporary currency exists overwhelmingly as what economists term ___ money.", answer: ["fiat"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "Why did coined money mark an improvement over unstamped precious metal?", options: [{ id: "A", text: "It eliminated the need to verify weight and purity at every transaction" }, { id: "B", text: "It was lighter to carry than commodity money" }, { id: "C", text: "It could not be counterfeited under any circumstances" }, { id: "D", text: "It required no government involvement" }], answer: "A" },
              { number: 11, prompt: "What constrained governments under the gold standard?", options: [{ id: "A", text: "Their ability to declare legal tender" }, { id: "B", text: "Their ability to adjust the money supply flexibly during crises" }, { id: "C", text: "Their ability to mint any coins at all" }, { id: "D", text: "Their ability to trade internationally" }], answer: "B" },
              { number: 12, prompt: "What gives fiat money its value, according to the passage?", options: [{ id: "A", text: "Its gold content" }, { id: "B", text: "Legal tender status plus public confidence and trust" }, { id: "C", text: "Its weight in silver" }, { id: "D", text: "Its historical age" }], answer: "B" },
              { number: 13, prompt: "How does the passage characterise the emergence of cryptocurrency?", options: [{ id: "A", text: "As a return to commodity-backed money" }, { id: "B", text: "As potentially as significant a shift as the invention of coinage itself" }, { id: "C", text: "As a temporary trend with no lasting significance" }, { id: "D", text: "As identical to paper money" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t5p2",
        title: "Urban Heat Islands",
        paragraphs: [
          { id: "A", text: "Urban heat islands refer to the phenomenon whereby cities and other heavily developed areas experience significantly higher temperatures than surrounding rural or less-developed areas, sometimes by as much as several degrees Celsius during peak conditions, a difference that tends to be most pronounced during summer evenings after a day of solar heating." },
          { id: "B", text: "The primary cause of the urban heat island effect is the replacement of natural land cover, such as vegetation and soil, with dark, heat-absorbing surfaces such as asphalt and concrete, materials that both absorb more solar radiation during the day and release that stored heat more slowly after sunset compared with natural, vegetated surfaces." },
          { id: "C", text: "Waste heat generated directly by human activity, including vehicle engines, industrial processes, and air conditioning systems, contributes a further, additional source of warming in dense urban areas, compounding the effect already caused by altered surface materials and building geometry." },
          { id: "D", text: "The reduction of vegetation in urban areas removes a natural cooling mechanism known as evapotranspiration, the process by which plants release water vapour that absorbs heat from the surrounding air as it evaporates, meaning that cities with fewer trees and less green space generally experience notably more pronounced heat island effects than more heavily vegetated cities." },
          { id: "E", text: "Urban heat islands carry meaningful public health consequences, particularly during heat waves, since elevated night-time temperatures prevent the body from adequately cooling down during sleep, a factor associated with measurably increased rates of heat-related illness and mortality, especially among elderly residents and other vulnerable populations." },
          { id: "F", text: "Mitigation strategies increasingly being adopted by city planners include reflective or light-coloured roofing and paving materials that absorb less solar radiation, expanded urban tree canopy and green space, and, in some cities, experimental green roofs covered in vegetation, all approaches specifically intended to reduce a city's overall heat absorption and retention." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "A public health consequence of elevated urban temperatures" }, { id: "ii", text: "Strategies cities are adopting to reduce heat retention" }, { id: "iii", text: "Defining the temperature difference between cities and rural areas" }, { id: "iv", text: "How building materials absorb and retain heat" }, { id: "v", text: "The historical origin of the term \"heat island\"" }, { id: "vi", text: "Direct human activity as an additional heat source" }, { id: "vii", text: "The cooling role plants play through evapotranspiration" }, { id: "viii", text: "International cooperation on climate policy" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "iii" },
              { number: 15, paragraphId: "B", answer: "iv" },
              { number: 16, paragraphId: "C", answer: "vi" },
              { number: 17, paragraphId: "D", answer: "vii" },
              { number: 18, paragraphId: "E", answer: "i" },
              { number: 19, paragraphId: "F", answer: "ii" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Urban heat islands are most pronounced during summer ___ after a day of solar heating.", answer: ["evenings"] },
              { number: 21, prompt: "Dark surfaces such as asphalt and concrete absorb more ___ radiation.", answer: ["solar"] },
              { number: 22, prompt: "Plants cool the air through a process called ___.", answer: ["evapotranspiration"] },
              { number: 23, prompt: "Elevated night-time temperatures are linked to increased rates of heat-related illness among ___ residents.", answer: ["elderly"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What is the primary cause of the urban heat island effect, according to paragraph B?", options: [{ id: "A", text: "Waste heat from vehicles alone" }, { id: "B", text: "Replacement of natural land cover with heat-absorbing surfaces like asphalt" }, { id: "C", text: "Increased rainfall in cities" }, { id: "D", text: "Reduced building height" }], answer: "B" },
              { number: 25, prompt: "Why do cities with less vegetation experience stronger heat island effects?", options: [{ id: "A", text: "They lose the natural cooling effect of evapotranspiration" }, { id: "B", text: "They have more water available" }, { id: "C", text: "They have cooler building materials" }, { id: "D", text: "They receive less sunlight" }], answer: "A" },
              { number: 26, prompt: "What mitigation strategy is mentioned involving roofing?", options: [{ id: "A", text: "Removing all roofs" }, { id: "B", text: "Using reflective or light-coloured roofing materials" }, { id: "C", text: "Painting roofs black to absorb more heat" }, { id: "D", text: "Banning roof construction" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t5p3",
        title: "Artificial Intelligence and Creative Work",
        text: "Artificial intelligence's growing capacity to generate text, images, music, and other creative works has provoked considerable debate concerning both the practical implications and the deeper philosophical questions raised by machines producing output that closely resembles human artistic creativity, a debate that spans fields as varied as computer science, philosophy, copyright law, and the creative industries themselves.\n\nModern generative AI systems typically operate by learning statistical patterns from enormous datasets of existing human-created work, whether text, images, or audio, and then generating new output by predicting what elements, such as words or pixels, are statistically likely to follow given a particular input or prompt, a process fundamentally different from, though producing superficially similar results to, established models of human creative cognition.\n\nProponents of AI-generated creative content argue that these tools function primarily as an extension of existing creative technology, comparable in kind, if not necessarily in degree, to earlier innovations such as the camera, the synthesizer, or digital editing software, each of which similarly provoked considerable controversy and scepticism from established creative communities upon their initial introduction.\n\nCritics raise several distinct concerns, including the use of copyrighted creative work without explicit permission or compensation to train the underlying AI models, the potential for AI-generated content to displace paid opportunities for working human artists and writers, and, more philosophically, questions about whether output produced without conscious intention, subjective lived experience, or genuine emotional investment can meaningfully be considered art in any traditionally understood sense of that term.\n\nLegal systems in numerous jurisdictions currently remain in the process of actively determining how existing copyright law, developed and codified long before generative AI's emergence, should apply to both the training data used to build these AI systems and to the creative works these systems subsequently generate, with several significant, closely watched lawsuits currently working their way through courts in multiple countries.\n\nSome creative professionals have adopted a notably pragmatic middle position, incorporating AI tools into their existing creative workflow as an aid for brainstorming, generating rapid initial drafts, or exploring stylistic variations, while nonetheless maintaining that meaningful human creative direction, editorial judgement, and final decision-making remain absolutely essential to producing genuinely valuable creative work.\n\nLooking ahead, most informed observers anticipate that rather than a straightforward, wholesale replacement of human creativity by AI, a more probable long-term outcome involves a complex ongoing renegotiation of precisely which specific creative tasks and functions are considered appropriate to delegate to AI systems, and which are more likely to remain firmly and enduringly the domain of human creators.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Generative AI systems learn statistical patterns from large datasets of existing human-created work.", answer: "TRUE" },
              { number: 28, prompt: "The process AI uses to generate creative content is identical to human creative cognition.", answer: "FALSE" },
              { number: 29, prompt: "Proponents compare AI creative tools to earlier technologies like the camera and synthesizer.", answer: "TRUE" },
              { number: 30, prompt: "Legal systems have already fully resolved how copyright law applies to AI training data.", answer: "FALSE" },
              { number: 31, prompt: "All creative professionals reject the use of AI tools in their creative work.", answer: "FALSE" },
              { number: 32, prompt: "Most informed observers expect AI to completely replace human creativity in the near future.", answer: "FALSE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "How do modern generative AI systems typically produce creative output?", options: [{ id: "A", text: "By copying existing works exactly" }, { id: "B", text: "By predicting statistically likely elements based on patterns learned from data" }, { id: "C", text: "By randomly generating content with no patterns" }, { id: "D", text: "By consulting human artists directly" }], answer: "B" },
              { number: 34, prompt: "What concern do critics raise about AI training data?", options: [{ id: "A", text: "It is too limited in scope" }, { id: "B", text: "It often uses copyrighted work without permission or compensation" }, { id: "C", text: "It is generated entirely by AI itself" }, { id: "D", text: "It contains no creative works at all" }], answer: "B" },
              { number: 35, prompt: "What pragmatic approach have some creative professionals adopted?", options: [{ id: "A", text: "Rejecting AI tools entirely" }, { id: "B", text: "Using AI as an aid for brainstorming while maintaining human creative direction" }, { id: "C", text: "Allowing AI to make all final creative decisions" }, { id: "D", text: "Only using AI for legal research" }], answer: "B" },
              { number: 36, prompt: "What outcome do most informed observers anticipate for the future?", options: [{ id: "A", text: "A complete replacement of human creativity by AI" }, { id: "B", text: "An ongoing renegotiation of which creative tasks suit AI versus humans" }, { id: "C", text: "No change at all in creative industries" }, { id: "D", text: "A total ban on AI creative tools" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "AI systems learn statistical patterns from enormous ___ of existing human-created work.", answer: ["datasets"] },
              { number: 38, prompt: "Critics question whether AI output can be considered art without conscious ___.", answer: ["intention"] },
              { number: 39, prompt: "Several significant lawsuits are currently working through ___ in multiple countries.", answer: ["courts"] },
              { number: 40, prompt: "Some professionals use AI to explore stylistic ___ during their creative workflow.", answer: ["variations"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-6",
    title: "IELTS Reading Mock Test 6",
    passages: [
      {
        id: "t6p1",
        title: "The Invention of the Printing Press",
        text: "Before the mid-fifteenth century, every book in existence had to be copied entirely by hand, an extraordinarily labour-intensive process typically undertaken by monks or professional scribes that could take months or even years to complete a single substantial volume, making books extraordinarily expensive and limiting literacy and access to written knowledge almost entirely to religious institutions, royal courts, and a narrow, wealthy elite.\n\nJohannes Gutenberg, a goldsmith from the German city of Mainz, is generally credited with developing the first practical movable-type printing system in Europe around 1440, combining several existing technologies, including oil-based ink, a modified wine press, and, most significantly, individual reusable metal type pieces cast from a durable lead alloy, into a single coherent and repeatable printing process.\n\nGutenberg's most famous printed work, a Latin Bible commonly known today as the Gutenberg Bible, completed around 1455, is widely regarded as marking the definitive beginning of the printed book era in Europe, though it is worth noting that movable-type printing had, in fact, already been independently developed considerably earlier in East Asia, most notably in China and Korea, albeit using different materials and never achieving comparably widespread adoption there for various linguistic and economic reasons.\n\nThe economic and cultural impact of Gutenberg's press proved genuinely transformative and rapid: within just fifty years of its introduction, printing presses had spread to over two hundred European cities, and the number of books in circulation across Europe increased from an estimated few tens of thousands in the pre-print era to many millions by the year 1500 alone.\n\nIncreased book availability and correspondingly falling prices contributed substantially to a marked rise in European literacy rates over subsequent generations, though scholars continue to actively debate the precise scale, pace, and regional variation of this literacy increase, since reliable, comprehensive data from this early period remains genuinely scarce and difficult to interpret with confidence.\n\nThe printing press also played a demonstrably significant role in the Protestant Reformation of the sixteenth century, enabling Martin Luther's theological writings and criticisms of the Catholic Church to spread rapidly and widely across Europe in a manner that would have been entirely impossible under the earlier, slower system of hand-copied manuscripts, fundamentally altering how religious and political ideas could travel and gain popular support.\n\nStandardisation of language represents a further significant, if less immediately obvious, consequence of widespread printing: as printers increasingly favoured certain regional dialects and spelling conventions for economic and practical reasons of efficiency and market reach, these particular linguistic choices gradually became established as the accepted written standard, a process that measurably influenced the development of standardised national languages across much of Europe.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Before the printing press, books were copied entirely by hand.", answer: "TRUE" },
              { number: 2, prompt: "Gutenberg invented movable-type printing entirely from scratch, with no existing technologies involved.", answer: "FALSE" },
              { number: 3, prompt: "Movable-type printing had already been developed independently in East Asia before Gutenberg.", answer: "TRUE" },
              { number: 4, prompt: "Printing presses spread to over two hundred European cities within fifty years.", answer: "TRUE" },
              { number: 5, prompt: "Scholars have reached full agreement on the precise scale of the literacy increase following printing.", answer: "FALSE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Gutenberg was a goldsmith from the German city of ___.", answer: ["Mainz"] },
              { number: 7, prompt: "Gutenberg's press combined oil-based ink, a modified wine press, and reusable ___ type pieces.", answer: ["metal"] },
              { number: 8, prompt: "Gutenberg's most famous printed work is commonly known as the ___ Bible.", answer: ["Gutenberg"] },
              { number: 9, prompt: "The printing press enabled Martin Luther's writings to spread during the Protestant ___.", answer: ["Reformation"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "What limited access to books before the printing press, according to the passage?", options: [{ id: "A", text: "A lack of paper" }, { id: "B", text: "The extraordinarily labour-intensive hand-copying process" }, { id: "C", text: "A ban on reading by religious institutions" }, { id: "D", text: "The absence of any written language" }], answer: "B" },
              { number: 11, prompt: "Why did movable-type printing in East Asia not achieve comparably widespread adoption?", options: [{ id: "A", text: "It was never actually developed there" }, { id: "B", text: "Various linguistic and economic reasons" }, { id: "C", text: "It was banned by the government" }, { id: "D", text: "No one could read at the time" }], answer: "B" },
              { number: 12, prompt: "What effect did increased book availability have, according to the passage?", options: [{ id: "A", text: "A decrease in European literacy rates" }, { id: "B", text: "A marked rise in European literacy rates over subsequent generations" }, { id: "C", text: "No measurable effect on literacy" }, { id: "D", text: "A decline in the number of books in circulation" }], answer: "B" },
              { number: 13, prompt: "How did printing influence language, according to the final paragraph?", options: [{ id: "A", text: "It had no effect on language at all" }, { id: "B", text: "Printers' dialect and spelling choices contributed to standardised national languages" }, { id: "C", text: "It eliminated all regional dialects immediately" }, { id: "D", text: "It only affected spoken language, not written" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t6p2",
        title: "Bioluminescence in the Ocean",
        paragraphs: [
          { id: "A", text: "Bioluminescence, the biochemical production and emission of light by a living organism, occurs remarkably widely throughout the animal kingdom, particularly within marine environments, where an estimated seventy-five percent or more of deep-sea species are believed to possess some form of light-producing capability." },
          { id: "B", text: "The chemistry underlying bioluminescence typically involves a light-emitting molecule called luciferin reacting with oxygen in the presence of an enzyme called luciferase, a reaction that releases energy in the form of visible light rather than as heat, making the process remarkably efficient compared with most artificial, human-engineered light sources." },
          { id: "C", text: "Marine organisms employ bioluminescence for a genuinely diverse range of biological purposes, including attracting prey, as famously demonstrated by the anglerfish's luminous lure, evading predators through sudden, disorienting flashes of light, and communicating or attracting potential mates through species-specific light patterns." },
          { id: "D", text: "Counter-illumination represents one particularly sophisticated bioluminescent adaptation, in which certain species produce light specifically on their undersides to closely match the faint downwelling light from the surface above, effectively camouflaging themselves from predators observing from below by eliminating their otherwise visible dark silhouette." },
          { id: "E", text: "Beyond its ecological functions in marine environments, bioluminescence has found several significant practical applications in scientific research, most notably in the development of genetic reporter systems, in which the specific gene responsible for luciferase production is inserted into other organisms to allow researchers to visually track gene expression or specific cellular processes in real time." },
          { id: "F", text: "Some coastal regions experience a strikingly visible natural phenomenon known as a bioluminescent bay or a glowing tide, caused by dense concentrations of light-producing marine microorganisms called dinoflagellates, an occurrence that has become a significant tourist attraction in several specific locations around the world, including parts of Puerto Rico and the Maldives." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "A camouflage strategy using light from below" }, { id: "ii", text: "The chemical reaction that produces living light" }, { id: "iii", text: "A visible natural phenomenon attracting tourists" }, { id: "iv", text: "The widespread occurrence of light-producing marine species" }, { id: "v", text: "Scientific applications of bioluminescent genes" }, { id: "vi", text: "Multiple biological purposes of light production in the sea" }, { id: "vii", text: "The discovery of the first bioluminescent species" }, { id: "viii", text: "Efforts to reduce light pollution in the ocean" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "iv" },
              { number: 15, paragraphId: "B", answer: "ii" },
              { number: 16, paragraphId: "C", answer: "vi" },
              { number: 17, paragraphId: "D", answer: "i" },
              { number: 18, paragraphId: "E", answer: "v" },
              { number: 19, paragraphId: "F", answer: "iii" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Bioluminescence involves a molecule called luciferin reacting with ___ in the presence of an enzyme.", answer: ["oxygen"] },
              { number: 21, prompt: "The anglerfish uses a luminous ___ to attract prey.", answer: ["lure"] },
              { number: 22, prompt: "Counter-illumination helps organisms match the faint ___ light from the surface.", answer: ["downwelling"] },
              { number: 23, prompt: "Bioluminescent bays are caused by dense concentrations of microorganisms called ___.", answer: ["dinoflagellates"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What proportion of deep-sea species are believed to be bioluminescent, according to the passage?", options: [{ id: "A", text: "Less than ten percent" }, { id: "B", text: "An estimated seventy-five percent or more" }, { id: "C", text: "Exactly fifty percent" }, { id: "D", text: "None have been confirmed" }], answer: "B" },
              { number: 25, prompt: "Why is bioluminescence described as efficient?", options: [{ id: "A", text: "It produces heat rather than light" }, { id: "B", text: "It releases energy mostly as visible light rather than heat" }, { id: "C", text: "It requires no chemical reaction" }, { id: "D", text: "It only works in cold water" }], answer: "B" },
              { number: 26, prompt: "What scientific application of bioluminescence is mentioned in paragraph E?", options: [{ id: "A", text: "Powering underwater vehicles" }, { id: "B", text: "Genetic reporter systems to track gene expression" }, { id: "C", text: "Producing artificial sunlight" }, { id: "D", text: "Desalinating seawater" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t6p3",
        title: "The Psychology of Procrastination",
        text: "Procrastination, commonly understood as the voluntary and often irrational delay of an intended course of action despite a clear expectation that the delay will likely leave the person worse off, affects the vast majority of people to at least some degree, with some researchers estimating that a notable proportion of adults consider themselves chronic procrastinators experiencing genuine, recurring difficulty in daily functioning as a result.\n\nContrary to a common popular assumption, psychologists increasingly emphasise that procrastination is fundamentally an emotional regulation problem rather than simply a straightforward matter of poor time management or insufficient personal willpower, since procrastination typically functions, at least in the short term, as an avoidance strategy for managing negative emotions, such as anxiety, boredom, self-doubt, or frustration, associated with a particular task.\n\nTemporal discounting, a well-documented tendency in behavioural psychology to disproportionately value immediate rewards over larger but more distant future rewards, provides part of the underlying psychological explanation for procrastination: the short-term relief of avoiding an unpleasant task in the present moment often feels considerably more psychologically immediate and salient than the more abstract, temporally distant negative consequences of that continued delay.\n\nSeveral distinct types of procrastination have been identified by researchers, including perfectionist procrastination, in which excessive, often unrealistic concern about producing flawed work leads a person to delay starting a task altogether, and decisional procrastination, in which a genuine difficulty making a choice between competing available options leads to prolonged inaction and delay.\n\nEffective interventions for procrastination increasingly focus on directly addressing the underlying emotional and motivational drivers rather than exclusively targeting external practical organisation, with several specific techniques showing measurable, documented promise, including deliberately breaking large, overwhelming tasks into smaller, more psychologically manageable components, and practising self-compassion regarding earlier instances of procrastination rather than harsh, unproductive self-criticism.\n\nDigital technology, and smartphones in particular, has been widely implicated by researchers in exacerbating modern procrastination tendencies, since the constant, near-effortless availability of engaging, low-effort alternative activities, such as social media browsing, provides an unusually convenient and readily accessible outlet for task avoidance compared with the more limited distraction options available in earlier historical periods.\n\nInterestingly, a small but growing body of academic research distinguishes between generally harmful, chronic procrastination and what some researchers have more provocatively termed \"active procrastination,\" in which an individual deliberately delays a task while nonetheless remaining fully aware of and in control of the associated risks, sometimes reporting that the resulting time pressure genuinely enhances their subsequent performance or focus.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Procrastination is defined as the voluntary delay of an action despite expecting to be worse off as a result.", answer: "TRUE" },
              { number: 28, prompt: "Psychologists now generally view procrastination as purely a time management problem.", answer: "FALSE" },
              { number: 29, prompt: "Temporal discounting involves valuing immediate rewards more than larger, distant future rewards.", answer: "TRUE" },
              { number: 30, prompt: "Perfectionist procrastination involves difficulty choosing between competing options.", answer: "FALSE" },
              { number: 31, prompt: "Breaking tasks into smaller components is mentioned as a technique that shows promise.", answer: "TRUE" },
              { number: 32, prompt: "All researchers agree that procrastination is always harmful with no possible exceptions.", answer: "FALSE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What do psychologists increasingly emphasise about procrastination?", options: [{ id: "A", text: "It is purely about poor time management" }, { id: "B", text: "It is fundamentally an emotional regulation problem" }, { id: "C", text: "It has no connection to emotions at all" }, { id: "D", text: "It only affects a tiny minority of people" }], answer: "B" },
              { number: 34, prompt: "What does temporal discounting help explain about procrastination?", options: [{ id: "A", text: "Why people always choose long-term rewards" }, { id: "B", text: "Why immediate relief from avoiding a task feels more salient than distant consequences" }, { id: "C", text: "Why procrastination never occurs in adults" }, { id: "D", text: "Why all tasks feel equally urgent" }], answer: "B" },
              { number: 35, prompt: "What is decisional procrastination?", options: [{ id: "A", text: "Delay caused by excessive concern about flawed work" }, { id: "B", text: "Delay caused by difficulty choosing between competing options" }, { id: "C", text: "Delay caused only by smartphone use" }, { id: "D", text: "A type of active, beneficial procrastination" }], answer: "B" },
              { number: 36, prompt: "What is \"active procrastination\", according to the final paragraph?", options: [{ id: "A", text: "A form of procrastination that is always harmful" }, { id: "B", text: "Deliberately delaying a task while remaining aware of and in control of the risks" }, { id: "C", text: "A synonym for perfectionist procrastination" }, { id: "D", text: "A condition that only affects chronic procrastinators" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Procrastination typically functions as an avoidance strategy for managing negative ___.", answer: ["emotions"] },
              { number: 38, prompt: "Temporal discounting is a well-documented tendency studied in behavioural ___.", answer: ["psychology"] },
              { number: 39, prompt: "Effective interventions include practising self-___ rather than harsh self-criticism.", answer: ["compassion"] },
              { number: 40, prompt: "Smartphones provide convenient access to low-effort alternative activities such as social media ___.", answer: ["browsing"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-7",
    title: "IELTS Reading Mock Test 7",
    passages: [
      {
        id: "t7p1",
        title: "The History of Vaccination",
        text: "The practice of vaccination, deliberately exposing the immune system to a weakened, inactivated, or partial form of a pathogen in order to generate future protective immunity without causing the full disease itself, represents one of the most significant public health interventions in human history, credited with dramatically reducing mortality from numerous previously devastating infectious diseases.\n\nThe conceptual origins of vaccination can be traced to variolation, an earlier and considerably riskier practice documented in China, India, and the Ottoman Empire well before its introduction to Western Europe, in which material taken from a smallpox pustule was deliberately introduced into a healthy person, typically resulting in a markedly milder infection than naturally acquired smallpox while still conferring lasting future immunity, though the practice carried a small but genuinely significant risk of causing severe illness or death.\n\nEdward Jenner, an English physician, is widely credited with developing the first true vaccine in 1796, after observing that milkmaids who had previously contracted the considerably milder cowpox virus appeared to be protected from subsequently contracting smallpox; Jenner tested this observation experimentally by deliberately inoculating a young boy with material from a cowpox lesion, then later exposing him to smallpox material, finding that the boy remained entirely unaffected by the disease.\n\nThe nineteenth and twentieth centuries witnessed substantial, sustained expansion in vaccine science, with the French chemist Louis Pasteur developing vaccines against both rabies and anthrax, and subsequent researchers progressively developing effective vaccines against a wide and growing range of diseases, including diphtheria, tetanus, polio, and measles, dramatically reducing childhood mortality rates in countries where these vaccines achieved widespread public uptake.\n\nVaccines function immunologically by training the adaptive immune system to specifically recognise a particular pathogen without requiring the recipient to first experience the full, potentially dangerous natural infection, achieved by prompting the immune system to produce specific antibodies and, critically, long-lived memory cells capable of mounting a much faster, more effective response if the body subsequently encounters that same pathogen again in the future.\n\nHerd immunity, a critical population-level concept, describes the indirect epidemiological protection afforded to unvaccinated individuals within a population once a sufficiently high proportion of the surrounding community has become immune, whether through vaccination or, less desirably, prior natural infection, since sustained disease transmission becomes progressively more difficult once the pathogen can no longer readily find enough susceptible new hosts to infect.\n\nGlobal vaccination campaigns have achieved several remarkable, historically unprecedented public health milestones, including the complete worldwide eradication of naturally occurring smallpox, formally certified by the World Health Organization in 1980, and the near-elimination of wild poliovirus, which as of recent years remains endemic in only a small handful of countries worldwide, down from widespread global circulation just several decades earlier.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Variolation was first developed in Western Europe before spreading elsewhere.", answer: "FALSE" },
              { number: 2, prompt: "Edward Jenner tested his cowpox observation experimentally on a young boy.", answer: "TRUE" },
              { number: 3, prompt: "Louis Pasteur developed vaccines against rabies and anthrax.", answer: "TRUE" },
              { number: 4, prompt: "Vaccines work by causing the recipient to experience the full natural infection first.", answer: "FALSE" },
              { number: 5, prompt: "Herd immunity can only occur through vaccination, never through natural infection.", answer: "FALSE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Variolation involved introducing material from a smallpox ___ into a healthy person.", answer: ["pustule"] },
              { number: 7, prompt: "Jenner observed that milkmaids who had contracted ___ appeared protected from smallpox.", answer: ["cowpox"] },
              { number: 8, prompt: "Vaccines prompt the immune system to produce antibodies and long-lived ___ cells.", answer: ["memory"] },
              { number: 9, prompt: "Smallpox eradication was formally certified by the World Health Organization in ___.", answer: ["1980"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "What risk did variolation carry, according to the passage?", options: [{ id: "A", text: "No risk at all" }, { id: "B", text: "A small but significant risk of severe illness or death" }, { id: "C", text: "It always caused death" }, { id: "D", text: "It only worked on children" }], answer: "B" },
              { number: 11, prompt: "What did Jenner's experiment with the young boy demonstrate?", options: [{ id: "A", text: "That cowpox was more dangerous than smallpox" }, { id: "B", text: "That prior cowpox exposure protected against subsequent smallpox exposure" }, { id: "C", text: "That vaccination had no effect" }, { id: "D", text: "That smallpox could not be prevented" }], answer: "B" },
              { number: 12, prompt: "What is herd immunity, according to the passage?", options: [{ id: "A", text: "Immunity that only applies to vaccinated individuals" }, { id: "B", text: "Indirect protection for unvaccinated individuals once enough of the population is immune" }, { id: "C", text: "A vaccine used specifically on livestock" }, { id: "D", text: "A failed public health strategy" }], answer: "B" },
              { number: 13, prompt: "What is the current status of wild poliovirus, according to the passage?", options: [{ id: "A", text: "It has been completely eradicated worldwide" }, { id: "B", text: "It remains endemic in only a small handful of countries" }, { id: "C", text: "It is spreading more widely than ever before" }, { id: "D", text: "It has never been targeted by vaccination campaigns" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t7p2",
        title: "Advances in Battery Storage Technology",
        paragraphs: [
          { id: "A", text: "As the global demand for reliable electricity storage grows alongside the expansion of intermittent renewable energy sources such as solar and wind power, battery storage technology has emerged as a critical enabling component for a broader transition away from fossil-fuel-based electricity generation toward more sustainable alternatives." },
          { id: "B", text: "Lithium-ion batteries currently dominate the commercial grid-scale and consumer battery storage market, owing to their comparatively high energy density, proven manufacturing scalability, and steadily falling production costs over the past decade, though researchers continue to actively investigate several alternative chemistries that might eventually offer distinct advantages for specific applications." },
          { id: "C", text: "One significant limitation of current lithium-ion technology is its reliance on materials such as cobalt and nickel, whose extraction has raised well-documented environmental and human rights concerns in several major mining regions, prompting considerable research investment into alternative battery chemistries that reduce or eliminate dependence on these particular materials." },
          { id: "D", text: "Solid-state batteries, which replace the flammable liquid electrolyte found in conventional lithium-ion batteries with a solid material, promise potentially significant improvements in both safety and energy density, though considerable manufacturing and cost challenges currently remain before genuinely widespread commercial adoption becomes realistic at scale." },
          { id: "E", text: "Grid-scale battery storage installations increasingly serve a specific and valuable function beyond simple backup power provision: storing surplus renewable electricity generated during periods of low demand, such as sunny midday hours, for later use during periods of peak evening demand, when solar generation has naturally declined." },
          { id: "F", text: "Beyond battery technology specifically, researchers continue to actively explore several alternative energy storage approaches, including pumped hydroelectric storage, which uses surplus electricity to pump water uphill for later release through turbines, and green hydrogen production, in which surplus renewable electricity powers the production of hydrogen fuel for later use or combustion." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "Alternative approaches to energy storage beyond batteries" }, { id: "ii", text: "A promising but still-developing battery technology" }, { id: "iii", text: "Growing importance of storage amid renewable energy expansion" }, { id: "iv", text: "Ethical and environmental concerns about certain battery materials" }, { id: "v", text: "The dominant current battery chemistry and its advantages" }, { id: "vi", text: "Using stored electricity to balance daily demand patterns" }, { id: "vii", text: "The invention of the first battery" }, { id: "viii", text: "Government subsidies for battery manufacturing" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "iii" },
              { number: 15, paragraphId: "B", answer: "v" },
              { number: 16, paragraphId: "C", answer: "iv" },
              { number: 17, paragraphId: "D", answer: "ii" },
              { number: 18, paragraphId: "E", answer: "vi" },
              { number: 19, paragraphId: "F", answer: "i" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Lithium-ion batteries dominate the market due to high energy density and falling production ___.", answer: ["costs"] },
              { number: 21, prompt: "Cobalt and nickel extraction has raised environmental and human ___ concerns.", answer: ["rights"] },
              { number: 22, prompt: "Solid-state batteries replace the flammable liquid ___ with a solid material.", answer: ["electrolyte"] },
              { number: 23, prompt: "Pumped hydroelectric storage uses surplus electricity to pump water ___.", answer: ["uphill"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "Why has battery storage become critical, according to paragraph A?", options: [{ id: "A", text: "Because fossil fuels have become cheaper" }, { id: "B", text: "Because it supports the growth of intermittent renewable energy sources" }, { id: "C", text: "Because it eliminates the need for electricity entirely" }, { id: "D", text: "Because grid electricity is no longer needed" }], answer: "B" },
              { number: 25, prompt: "What limitation of lithium-ion batteries is discussed in paragraph C?", options: [{ id: "A", text: "They are too heavy to transport" }, { id: "B", text: "Their reliance on materials like cobalt and nickel raises environmental and human rights concerns" }, { id: "C", text: "They cannot store any electricity at all" }, { id: "D", text: "They are cheaper than all alternatives" }], answer: "B" },
              { number: 26, prompt: "What function do grid-scale battery installations increasingly serve, according to paragraph E?", options: [{ id: "A", text: "Only providing emergency backup power" }, { id: "B", text: "Storing surplus renewable electricity for use during peak demand" }, { id: "C", text: "Generating electricity directly from sunlight" }, { id: "D", text: "Replacing the need for solar panels" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t7p3",
        title: "The Evolution of Written Language",
        text: "The development of written language ranks among the most consequential innovations in human history, fundamentally transforming how knowledge could be recorded, preserved, and transmitted across both generations and geographic distances, in ways that purely oral tradition, however sophisticated, could not reliably achieve at comparable scale.\n\nThe earliest known writing systems emerged largely independently in several distinct regions, with Sumerian cuneiform in Mesopotamia and Egyptian hieroglyphics both dating to roughly the same period, around 3200 BCE, while Chinese script developed somewhat later, and Mesoamerican writing systems, including that of the Maya, emerged independently on an entirely separate continent, demonstrating that the underlying impulse toward written communication arose repeatedly across unconnected human societies.\n\nEarly writing systems were predominantly logographic or pictographic in basic structure, meaning that individual symbols directly represented whole words or concepts rather than individual component sounds, a system that, while genuinely functional, required learners to memorise a very large number of distinct symbols, since new symbols were needed for essentially every new word or concept requiring written representation.\n\nThe development of phonetic writing systems, in which symbols represent sounds rather than entire words directly, represented a major and highly consequential simplification, dramatically reducing the total number of distinct symbols a literate person needed to memorise; the Phoenician alphabet, developed around 1050 BCE, proved particularly historically influential, eventually giving rise, through a long chain of adaptation and transmission, to the Greek, Latin, and numerous other alphabets still in widespread use today.\n\nWriting materials themselves evolved considerably over time in response to available local resources and evolving practical needs: clay tablets, papyrus derived from a Nile-growing reed plant, parchment made from treated animal skin, and eventually paper, first developed in China around the second century CE, each offered distinct practical trade-offs in terms of durability, cost, and portability for different societies and purposes.\n\nThe transition from a predominantly oral culture to a written one carried profound cognitive and social consequences that extended considerably beyond simple practical record-keeping convenience: some researchers have argued persuasively that writing fundamentally altered human patterns of memory, structured reasoning, and legal and administrative organisation, enabling the development of considerably more complex, large-scale bureaucratic and legal systems than oral tradition alone could realistically support or sustain.\n\nLiteracy rates, however, remained extremely low across most human societies for millennia following the initial invention of writing, with genuinely widespread mass literacy emerging only relatively recently in human history, closely following the development and spread of affordable printing technology and, still later, the introduction of large-scale, systematic public education systems in the modern era.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Written language developed independently in several different regions of the world.", answer: "TRUE" },
              { number: 28, prompt: "Sumerian cuneiform and Egyptian hieroglyphics date to roughly the same period.", answer: "TRUE" },
              { number: 29, prompt: "Early logographic writing systems required memorising relatively few symbols.", answer: "FALSE" },
              { number: 30, prompt: "The Phoenician alphabet gave rise to the Greek and Latin alphabets.", answer: "TRUE" },
              { number: 31, prompt: "Paper was the first writing material ever used, before clay tablets or papyrus.", answer: "FALSE" },
              { number: 32, prompt: "Widespread mass literacy emerged immediately after the invention of writing.", answer: "FALSE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What characterised early logographic writing systems?", options: [{ id: "A", text: "Symbols represented individual sounds" }, { id: "B", text: "Individual symbols directly represented whole words or concepts" }, { id: "C", text: "They required no memorisation at all" }, { id: "D", text: "They were phonetic from the start" }], answer: "B" },
              { number: 34, prompt: "What major simplification did phonetic writing systems introduce?", options: [{ id: "A", text: "They eliminated the need for any symbols" }, { id: "B", text: "They dramatically reduced the number of symbols needed by representing sounds" }, { id: "C", text: "They required more symbols than logographic systems" }, { id: "D", text: "They could only represent numbers" }], answer: "B" },
              { number: 35, prompt: "What does the passage suggest about writing's broader consequences?", options: [{ id: "A", text: "It had no effect beyond simple record-keeping" }, { id: "B", text: "It may have altered memory, reasoning, and enabled complex bureaucratic systems" }, { id: "C", text: "It made oral tradition entirely obsolete overnight" }, { id: "D", text: "It had only negative consequences for society" }], answer: "B" },
              { number: 36, prompt: "What closely preceded the emergence of widespread mass literacy, according to the passage?", options: [{ id: "A", text: "The invention of writing itself" }, { id: "B", text: "The spread of affordable printing technology and public education" }, { id: "C", text: "The development of cuneiform" }, { id: "D", text: "The decline of oral tradition" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Mesoamerican writing systems, including that of the ___, emerged independently.", answer: ["Maya"] },
              { number: 38, prompt: "The Phoenician alphabet was developed around ___ BCE.", answer: ["1050"] },
              { number: 39, prompt: "Papyrus was derived from a reed plant growing along the ___.", answer: ["Nile"] },
              { number: 40, prompt: "Paper was first developed in China around the second century ___.", answer: ["CE"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-8",
    title: "IELTS Reading Mock Test 8",
    passages: [
      {
        id: "t8p1",
        title: "The Domestication of Dogs",
        text: "The domestication of the dog, now widely regarded as the first animal species domesticated by humans, remains a subject of active and occasionally contentious scientific debate regarding its precise timing, geographic origin, and the underlying process by which wild wolves gradually became the domesticated companions recognisable today.\n\nGenetic evidence derived from ancient DNA analysis suggests that dog domestication likely began somewhere between fifteen and forty thousand years ago, a considerably wide range reflecting genuine ongoing scientific uncertainty, though most current researchers now favour a period roughly between twenty and thirty thousand years ago, predating the development of agriculture by many thousands of years.\n\nTwo broad and competing theoretical models have been proposed to explain the underlying domestication process. The self-domestication hypothesis suggests that less fearful, bolder wolves gradually began scavenging near human settlements to access discarded food waste, with progressively tamer individuals surviving and reproducing more successfully in this novel human-adjacent environment, eventually leading to a distinct domesticated population without deliberate, active human intervention or selection.\n\nThe alternative, more traditional model instead proposes deliberate active human intervention, suggesting that early humans intentionally captured wolf pups and actively selected for increasingly desirable behavioural and physical traits, such as reduced fearfulness of humans, greater trainability, and useful behaviours including hunting assistance or guarding livestock and settlements.\n\nA now-famous long-term experiment conducted in Soviet Russia beginning in the 1950s, in which researcher Dmitri Belyaev selectively bred silver foxes purely for tameness across many successive generations, produced foxes that not only displayed dramatically increased friendliness toward humans but also exhibited a range of unexpected accompanying physical changes, including floppy ears, curled tails, and patches of unusual coat colouring, changes strikingly similar to differences observed between wolves and modern domestic dogs.\n\nThis experimental phenomenon, in which selecting purely for tameness appears to simultaneously produce a broader, correlated suite of other physical and behavioural changes, has been termed \"domestication syndrome\" by researchers, and offers a compelling potential partial explanation for why domesticated animal species across many different lineages tend to display certain broadly similar physical characteristics, regardless of the specific original wild species from which each was independently domesticated.\n\nContemporary dog breeds, of which several hundred distinct types are now formally recognised worldwide, display an extraordinary range of physical variation, from the diminutive Chihuahua to the substantially larger Great Dane, a degree of morphological diversity considerably greater than that found within almost any other single mammalian species, achieved through many additional centuries of subsequent deliberate, targeted selective breeding for highly specific working purposes and physical appearance standards.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "The dog is widely regarded as the first animal species domesticated by humans.", answer: "TRUE" },
              { number: 2, prompt: "All researchers agree precisely on when dog domestication began.", answer: "FALSE" },
              { number: 3, prompt: "Most current researchers favour a domestication period predating agriculture.", answer: "TRUE" },
              { number: 4, prompt: "The self-domestication hypothesis involves deliberate human capture of wolf pups.", answer: "FALSE" },
              { number: 5, prompt: "Belyaev's fox experiment took place in the United States.", answer: "FALSE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "Genetic evidence suggests dog domestication began between fifteen and forty ___ years ago.", answer: ["thousand"] },
              { number: 7, prompt: "Belyaev selectively bred silver foxes purely for ___.", answer: ["tameness"] },
              { number: 8, prompt: "Belyaev's foxes developed floppy ears, curled tails, and unusual coat ___.", answer: ["colouring", "coloring"] },
              { number: 9, prompt: "This phenomenon has been termed \"domestication ___\" by researchers.", answer: ["syndrome"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "What does the self-domestication hypothesis propose?", options: [{ id: "A", text: "Humans deliberately captured and bred wolf pups" }, { id: "B", text: "Bolder wolves scavenging near settlements gradually became tamer without deliberate selection" }, { id: "C", text: "Dogs were never actually domesticated from wolves" }, { id: "D", text: "Domestication happened entirely by accident in a laboratory" }], answer: "B" },
              { number: 11, prompt: "What did Belyaev's fox experiment demonstrate?", options: [{ id: "A", text: "That tameness cannot be selectively bred" }, { id: "B", text: "That selecting for tameness alone produced a broader suite of correlated physical changes" }, { id: "C", text: "That foxes cannot be domesticated under any circumstances" }, { id: "D", text: "That physical traits have no connection to behaviour" }], answer: "B" },
              { number: 12, prompt: "What does \"domestication syndrome\" help explain, according to the passage?", options: [{ id: "A", text: "Why all wild animals look alike" }, { id: "B", text: "Why domesticated species across different lineages tend to share similar physical traits" }, { id: "C", text: "Why dogs cannot be bred for specific purposes" }, { id: "D", text: "Why wolves are more aggressive than dogs" }], answer: "B" },
              { number: 13, prompt: "What is noted about the physical variation among contemporary dog breeds?", options: [{ id: "A", text: "It is smaller than in most other mammal species" }, { id: "B", text: "It is considerably greater than in almost any other single mammalian species" }, { id: "C", text: "It has remained unchanged for thousands of years" }, { id: "D", text: "It only affects coat colour" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t8p2",
        title: "The Problem of Ocean Plastic Pollution",
        paragraphs: [
          { id: "A", text: "Plastic pollution in the world's oceans has escalated dramatically over the past several decades, with some researchers estimating that several million metric tonnes of plastic waste enter marine environments annually, originating from a combination of land-based sources, such as improperly managed waste and littering, and direct marine sources, including discarded or lost fishing equipment." },
          { id: "B", text: "Unlike many organic materials, most conventional plastics do not fully biodegrade in marine environments within any realistic human timeframe, but instead gradually fragment into progressively smaller pieces through exposure to sunlight, wave action, and physical abrasion, eventually forming what are termed microplastics, generally defined as plastic particles measuring less than five millimetres across." },
          { id: "C", text: "Microplastics have now been documented in remarkably diverse locations worldwide, from the deepest ocean trenches to Arctic sea ice, and have been found within the tissues of a very wide range of marine organisms, from microscopic plankton up through fish and marine mammals, raising significant and still actively researched concerns about potential impacts on marine food webs and, ultimately, human health through seafood consumption." },
          { id: "D", text: "Large, floating accumulations of marine debris, most famously the Great Pacific Garbage Patch located between Hawaii and California, form in ocean regions where converging large-scale ocean currents, known as gyres, naturally concentrate floating debris, though these accumulation zones consist predominantly of fragmented microplastics rather than the large, clearly visible masses of solid waste that popular media coverage sometimes suggests." },
          { id: "E", text: "Marine animals face several documented forms of direct harm from plastic pollution, including physical entanglement in discarded fishing nets and other plastic debris, and the ingestion of plastic fragments that animals may mistake for genuine food sources, potentially causing internal injury, blockage, or a false, non-nutritive sense of fullness that can ultimately lead to malnutrition or starvation." },
          { id: "F", text: "Proposed and implemented solutions span a genuinely broad range of scales and approaches, from large-scale international policy measures such as bans on specific single-use plastic items and coordinated efforts to improve waste management infrastructure in developing regions, to more localised technological interventions, including specially engineered ocean cleanup systems designed to physically collect floating plastic debris from concentrated accumulation zones." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "How plastic breaks down into microplastics rather than disappearing" }, { id: "ii", text: "Direct physical harm to marine animals from plastic debris" }, { id: "iii", text: "The scale of plastic entering the ocean each year" }, { id: "iv", text: "A clarification about a famous floating debris accumulation zone" }, { id: "v", text: "Microplastics found across a remarkably wide range of locations and organisms" }, { id: "vi", text: "Approaches proposed and used to address the problem" }, { id: "vii", text: "The history of plastic manufacturing" }, { id: "viii", text: "International trade regulations on plastic waste" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "iii" },
              { number: 15, paragraphId: "B", answer: "i" },
              { number: 16, paragraphId: "C", answer: "v" },
              { number: 17, paragraphId: "D", answer: "iv" },
              { number: 18, paragraphId: "E", answer: "ii" },
              { number: 19, paragraphId: "F", answer: "vi" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Microplastics are generally defined as plastic particles measuring less than ___ millimetres across.", answer: ["five"] },
              { number: 21, prompt: "Large accumulations of floating debris form in ocean regions where currents called ___ converge.", answer: ["gyres"] },
              { number: 22, prompt: "The Great Pacific Garbage Patch is located between Hawaii and ___.", answer: ["California"] },
              { number: 23, prompt: "Animals may ingest plastic fragments, mistaking them for genuine ___ sources.", answer: ["food"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What happens to most conventional plastics in marine environments, according to paragraph B?", options: [{ id: "A", text: "They fully biodegrade within a few years" }, { id: "B", text: "They gradually fragment into smaller pieces called microplastics" }, { id: "C", text: "They immediately sink and disappear" }, { id: "D", text: "They dissolve completely in seawater" }], answer: "B" },
              { number: 25, prompt: "What clarification does paragraph D make about the Great Pacific Garbage Patch?", options: [{ id: "A", text: "It does not actually exist" }, { id: "B", text: "It consists mostly of fragmented microplastics rather than large visible waste masses" }, { id: "C", text: "It is made entirely of large, solid plastic objects" }, { id: "D", text: "It is located in the Atlantic Ocean" }], answer: "B" },
              { number: 26, prompt: "What harm can plastic ingestion cause to marine animals, according to paragraph E?", options: [{ id: "A", text: "Improved nutrition" }, { id: "B", text: "Internal injury, blockage, or a false sense of fullness leading to malnutrition" }, { id: "C", text: "No harm at all" }, { id: "D", text: "Increased reproduction rates" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t8p3",
        title: "The Economics of Attention",
        text: "The concept of the \"attention economy\" describes a way of understanding modern media and technology industries in which human attention itself, rather than any physical product or conventional service, functions as the primary scarce resource that companies compete to capture, hold, and ultimately monetise, typically through the sale of targeted advertising built on detailed data about user attention and behaviour.\n\nThis framing, first popularised in its modern form by economist and psychologist Herbert Simon in 1971, rests on the fundamental observation that as the sheer volume of available information has grown dramatically over subsequent decades, particularly following the advent of the internet, human attention itself has not similarly expanded to match, making attention an increasingly scarce and consequently increasingly commercially valuable resource.\n\nSocial media platforms and other digital services generating revenue primarily through advertising possess strong, direct commercial incentives to maximise the total time users spend actively engaged with their particular platform, since increased time on-platform generally translates fairly directly into increased advertising revenue, an incentive structure that critics argue can encourage the deliberate design of increasingly compulsive, attention-capturing features rather than features primarily intended to serve users' own genuine long-term interests.\n\nSpecific documented design techniques employed to help capture and retain user attention include infinite scroll interfaces that deliberately eliminate natural stopping points, variable reward schedules similar in underlying psychological structure to those famously found in casino slot machines, and carefully engineered push notifications specifically designed to prompt users back into an application at strategically optimal moments.\n\nCritics of the contemporary attention economy raise several distinct concerns, including well-documented associations between heavy social media use and measurably increased rates of anxiety and depression, particularly among younger and adolescent users, alongside broader concerns about fragmented attention spans and a general documented decline in sustained capacity for deep, focused concentration on demanding cognitive tasks.\n\nIn response to mounting public and regulatory pressure, some technology companies have introduced various digital wellbeing features, including screen-time tracking tools and app usage limits, though critics frequently note the inherent tension involved in a company whose core underlying business model depends directly on maximising user engagement simultaneously offering users the tools to meaningfully reduce that same engagement.\n\nPolicy responses under active consideration in various jurisdictions include proposed regulations specifically targeting manipulative design practices, mandatory algorithmic transparency requirements for content recommendation systems, and, in the case of some younger users, outright age restrictions or specific platform design requirements intended to reduce documented compulsive usage patterns among children and adolescents.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "The attention economy treats human attention as the primary scarce resource companies compete for.", answer: "TRUE" },
              { number: 28, prompt: "Herbert Simon's framing dates back to the nineteenth century.", answer: "FALSE" },
              { number: 29, prompt: "Advertising-funded platforms have a direct commercial incentive to maximise user time on-platform.", answer: "TRUE" },
              { number: 30, prompt: "Infinite scroll interfaces are designed to create natural stopping points for users.", answer: "FALSE" },
              { number: 31, prompt: "Heavy social media use has been associated with increased rates of anxiety and depression in some studies.", answer: "TRUE" },
              { number: 32, prompt: "All technology companies have completely solved the tension between engagement and user wellbeing.", answer: "FALSE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What does the attention economy framing rest on, according to paragraph two?", options: [{ id: "A", text: "The idea that information has become scarce" }, { id: "B", text: "The idea that attention has not expanded to match growing information volume" }, { id: "C", text: "The idea that advertising is no longer profitable" }, { id: "D", text: "The idea that internet use has declined" }], answer: "B" },
              { number: 34, prompt: "What is compared to variable reward schedules in slot machines?", options: [{ id: "A", text: "Push notifications only" }, { id: "B", text: "Certain design techniques used in digital platforms to capture attention" }, { id: "C", text: "Traditional television advertising" }, { id: "D", text: "Print media layout" }], answer: "B" },
              { number: 35, prompt: "What tension do critics note regarding digital wellbeing features?", options: [{ id: "A", text: "They are too expensive to implement" }, { id: "B", text: "Companies whose business model depends on engagement also offer tools to reduce it" }, { id: "C", text: "They have completely eliminated all screen time" }, { id: "D", text: "They are mandated by international law" }], answer: "B" },
              { number: 36, prompt: "What policy responses are mentioned as under consideration?", options: [{ id: "A", text: "Banning all forms of advertising" }, { id: "B", text: "Regulations targeting manipulative design and algorithmic transparency requirements" }, { id: "C", text: "Eliminating the internet entirely" }, { id: "D", text: "Removing all age restrictions on platforms" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "The attention economy framing was first popularised by economist and psychologist ___.", answer: ["Herbert Simon"] },
              { number: 38, prompt: "Push notifications are designed to prompt users back into an application at strategically optimal ___.", answer: ["moments"] },
              { number: 39, prompt: "Critics raise concerns about a general decline in sustained capacity for deep, focused ___.", answer: ["concentration"] },
              { number: 40, prompt: "Some jurisdictions are considering age restrictions or design requirements for younger ___.", answer: ["users"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-9",
    title: "IELTS Reading Mock Test 9",
    passages: [
      {
        id: "t9p1",
        title: "Desert Adaptations in Wildlife",
        text: "Deserts, defined broadly as regions receiving less than approximately two hundred and fifty millimetres of precipitation annually, present some of the most physiologically demanding environments on Earth for animal life, combining extreme daytime heat, often near-freezing nighttime temperatures, and severe scarcity of water and food. Despite these challenges, deserts host a surprisingly diverse array of specialised wildlife that has evolved remarkable adaptations over millions of years.\n\nWater conservation represents perhaps the single most critical adaptive challenge for desert animals. The kangaroo rat, native to arid regions of North America, has evolved kidneys capable of producing extraordinarily concentrated urine, allowing it to survive its entire life without ever drinking free-standing water, instead deriving sufficient moisture from the seeds it consumes and from water produced internally as a metabolic byproduct of digesting that food.\n\nMany desert reptiles and insects have evolved behavioural rather than purely physiological adaptations to manage extreme heat. Numerous species restrict their activity to dawn, dusk, or nighttime hours, remaining inactive in burrows or shaded crevices during the hottest part of the day, a strategy that avoids the need for costly physiological cooling mechanisms altogether by simply avoiding exposure to peak temperatures.\n\nThe camel, perhaps the most iconic desert animal, possesses a suite of adaptations extending well beyond its famous humps, which store fat rather than water as commonly assumed. Camels can tolerate body temperature fluctuations of several degrees without ill effect, reducing the need for energy-costly sweating, and their red blood cells are distinctively oval-shaped rather than the circular shape typical of most mammals, allowing blood to continue flowing smoothly even when significantly dehydrated.\n\nDesert plants have evolved parallel adaptations that indirectly support the animals dependent on them. Many desert plant species store water in thickened stems or leaves, a strategy exemplified by cacti, while others complete their entire life cycle, from germination to seed production, within the brief window following infrequent desert rainfall, lying dormant as seeds for months or years between suitable growing conditions.\n\nSome desert animals have evolved specialised physical structures for managing heat exchange with their environment. The fennec fox, native to the Sahara Desert, possesses disproportionately large ears relative to its body size, which serve a thermoregulatory function by dissipating excess body heat, in addition to their more obvious role in detecting prey movement in the sand.\n\nClimate change poses a significant emerging threat to desert ecosystems, since even species highly adapted to extreme heat and aridity generally operate close to their physiological limits, meaning that further increases in already extreme temperatures, combined with potential changes to already scarce and unpredictable rainfall patterns, could push some specialised desert species beyond their capacity to adapt through existing behavioural and physiological strategies alone.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "Deserts are defined as regions receiving less than approximately two hundred and fifty millimetres of precipitation annually.", answer: "TRUE" },
              { number: 2, prompt: "The kangaroo rat needs to drink free-standing water regularly to survive.", answer: "FALSE" },
              { number: 3, prompt: "Many desert reptiles and insects restrict their activity to avoid the hottest part of the day.", answer: "TRUE" },
              { number: 4, prompt: "Camel humps primarily store water rather than fat.", answer: "FALSE" },
              { number: 5, prompt: "Camel red blood cells are circular in shape, like those of most other mammals.", answer: "FALSE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "The kangaroo rat's kidneys produce extraordinarily concentrated ___.", answer: ["urine"] },
              { number: 7, prompt: "Camels can tolerate body temperature fluctuations of several ___ without ill effect.", answer: ["degrees"] },
              { number: 8, prompt: "Many desert plants, such as cacti, store water in thickened stems or ___.", answer: ["leaves"] },
              { number: 9, prompt: "The fennec fox has disproportionately large ___ that help dissipate body heat.", answer: ["ears"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "How does the kangaroo rat obtain sufficient moisture to survive?", options: [{ id: "A", text: "By drinking large amounts of water daily" }, { id: "B", text: "From seeds and internal metabolic processes" }, { id: "C", text: "From rainfall collected in burrows" }, { id: "D", text: "By migrating to wetter regions" }], answer: "B" },
              { number: 11, prompt: "What strategy do many desert reptiles and insects use to manage heat?", options: [{ id: "A", text: "Sweating extensively" }, { id: "B", text: "Restricting activity to cooler parts of the day" }, { id: "C", text: "Increasing body size" }, { id: "D", text: "Hibernating year-round" }], answer: "B" },
              { number: 12, prompt: "What is a notable feature of camel red blood cells?", options: [{ id: "A", text: "They are circular, like most mammals" }, { id: "B", text: "They are oval-shaped, aiding blood flow during dehydration" }, { id: "C", text: "They store water directly" }, { id: "D", text: "They are unusually large" }], answer: "B" },
              { number: 13, prompt: "What threat does climate change pose to desert species, according to the passage?", options: [{ id: "A", text: "It will have no effect since they are already adapted to heat" }, { id: "B", text: "It could push species beyond their existing adaptive limits" }, { id: "C", text: "It will increase rainfall, benefiting desert species" }, { id: "D", text: "It only affects non-desert ecosystems" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t9p2",
        title: "The Gig Economy",
        paragraphs: [
          { id: "A", text: "The term \"gig economy\" refers to a labour market increasingly characterised by short-term, flexible, and often app-mediated work arrangements, in which individuals complete discrete tasks or projects for multiple different clients or platforms rather than holding a single, ongoing position with one employer, a model that has expanded rapidly alongside the growth of smartphone-based platform technology over the past fifteen years." },
          { id: "B", text: "Ride-hailing and food-delivery platforms are among the most visible examples of gig economy work, connecting individual drivers or couriers with customers through an app that handles matching, payment processing, and, in many cases, performance rating, allowing workers considerable flexibility in choosing when and how much to work compared with conventional scheduled employment." },
          { id: "C", text: "Proponents of gig work highlight this flexibility as a significant benefit, particularly for individuals seeking supplementary income alongside other commitments, such as students, caregivers, or those pursuing other primary occupations, arguing that the ability to work variable hours according to one's own schedule represents a meaningful improvement over rigid, fixed-shift employment for many workers." },
          { id: "D", text: "Critics, however, point to significant downsides, including the frequent classification of gig workers as independent contractors rather than employees, a distinction that in many jurisdictions excludes them from benefits such as minimum wage guarantees, paid sick leave, unemployment insurance, and employer contributions to retirement savings, benefits that conventional employees in the same jurisdictions typically receive." },
          { id: "E", text: "Regulatory responses to the gig economy have varied considerably across different countries and even between individual states or cities within the same country, with some jurisdictions introducing new intermediate worker classifications specifically designed for gig workers, offering a limited subset of traditional employee protections, while others have pursued more aggressive reclassification of gig workers as full employees entitled to the complete range of standard protections." },
          { id: "F", text: "Economists continue to debate the gig economy's broader economic significance, with some viewing it as a genuinely novel and lasting transformation of labour markets driven by irreversible technological change, while others argue that gig work represents a comparatively small, though highly visible, segment of overall employment, with the traditional employer-employee relationship likely to remain dominant across most sectors of the economy for the foreseeable future." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "Ongoing disagreement about the gig economy's overall economic importance" }, { id: "ii", text: "Differing regulatory approaches across jurisdictions" }, { id: "iii", text: "Concerns about lost employee benefits and protections" }, { id: "iv", text: "The flexibility valued by many gig workers" }, { id: "v", text: "Defining a new, technology-driven labour market model" }, { id: "vi", text: "Ride-hailing and delivery apps as prominent examples" }, { id: "vii", text: "The origins of traditional employment law" }, { id: "viii", text: "Declining wages across all employment sectors" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "v" },
              { number: 15, paragraphId: "B", answer: "vi" },
              { number: 16, paragraphId: "C", answer: "iv" },
              { number: 17, paragraphId: "D", answer: "iii" },
              { number: 18, paragraphId: "E", answer: "ii" },
              { number: 19, paragraphId: "F", answer: "i" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "The gig economy has expanded alongside the growth of ___-based platform technology.", answer: ["smartphone"] },
              { number: 21, prompt: "Ride-hailing apps handle matching, payment processing, and performance ___.", answer: ["rating"] },
              { number: 22, prompt: "Gig workers are frequently classified as independent ___ rather than employees.", answer: ["contractors"] },
              { number: 23, prompt: "Some jurisdictions have introduced new intermediate worker ___ specifically for gig workers.", answer: ["classifications"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What benefit do proponents of gig work highlight, according to the passage?", options: [{ id: "A", text: "Guaranteed minimum wage" }, { id: "B", text: "Flexibility in choosing when and how much to work" }, { id: "C", text: "Automatic retirement contributions" }, { id: "D", text: "Unlimited paid sick leave" }], answer: "B" },
              { number: 25, prompt: "What is a criticism of gig work mentioned in the passage?", options: [{ id: "A", text: "It offers too many employee benefits" }, { id: "B", text: "Workers are often excluded from benefits available to conventional employees" }, { id: "C", text: "It requires too much fixed scheduling" }, { id: "D", text: "It has no flexibility at all" }], answer: "B" },
              { number: 26, prompt: "What do economists disagree about, according to the final paragraph?", options: [{ id: "A", text: "Whether gig work exists at all" }, { id: "B", text: "The gig economy's overall significance and permanence" }, { id: "C", text: "Whether ride-hailing apps are profitable" }, { id: "D", text: "The exact origin of the term \"gig economy\"" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t9p3",
        title: "The Psychology of Decision-Making Under Uncertainty",
        text: "Classical economic theory long assumed that human beings make decisions by rationally weighing the costs, benefits, and probabilities associated with each available option, arriving at the choice that maximises expected value. Beginning in the 1970s, however, psychologists Daniel Kahneman and Amos Tversky conducted a series of experiments demonstrating that real human judgement under uncertainty deviates from this idealised model in consistent and predictable ways.\n\nOne influential concept to emerge from this research is loss aversion, the observation that people tend to feel the pain of a loss more intensely than the pleasure of an equivalent gain. In practical terms, this means that many individuals will reject a fair coin-flip gamble offering an equal chance of winning or losing the same amount of money, even though a purely rational actor should be willing to accept such a bet.\n\nAnother key finding concerns the availability heuristic, a mental shortcut in which people judge the probability of an event based on how easily relevant examples come to mind, rather than on objective statistical data. Vivid, heavily reported events such as plane crashes or shark attacks are often judged to be far more likely than they statistically are, while more mundane but statistically greater risks, such as heart disease, receive comparatively less psychological weight.\n\nFraming effects represent a further departure from purely rational decision-making. Experiments have repeatedly shown that people respond differently to logically identical information depending on how it is presented. A medical treatment described as having a \"90 percent survival rate\" is typically viewed far more favourably than the same treatment described as having a \"10 percent mortality rate,\" despite the two descriptions conveying identical statistical information.\n\nThese findings have practical applications well beyond academic psychology. Policymakers have increasingly applied insights from behavioural economics to areas such as retirement savings and public health messaging, often through so-called \"nudges\" that adjust the framing or default settings of a choice without restricting the options available. Automatically enrolling employees into a pension scheme, with the option to opt out, has proved far more effective at increasing participation than requiring employees to actively opt in.\n\nCritics of behavioural economics caution against over-generalising from laboratory experiments, noting that decisions made under controlled, low-stakes conditions may not always predict behaviour in complex, high-stakes, real-world situations. Nonetheless, the core observation that human decision-making regularly departs from strict rational-choice models has become widely accepted across economics and psychology alike.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Classical economic theory assumed that people always make irrational decisions.", answer: "FALSE" },
              { number: 28, prompt: "Kahneman and Tversky's experiments began in the 1970s.", answer: "TRUE" },
              { number: 29, prompt: "According to loss aversion, people generally feel gains more intensely than losses of the same size.", answer: "FALSE" },
              { number: 30, prompt: "The availability heuristic can cause people to overestimate the likelihood of vivid, heavily reported events.", answer: "TRUE" },
              { number: 31, prompt: "Framing effects only influence people's decisions in medical contexts.", answer: "FALSE" },
              { number: 32, prompt: "All critics of behavioural economics reject its findings entirely.", answer: "NOT GIVEN" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "What does loss aversion describe?", options: [{ id: "A", text: "People feeling losses and gains equally." }, { id: "B", text: "People feeling losses more intensely than equivalent gains." }, { id: "C", text: "People always avoiding any form of risk." }, { id: "D", text: "People preferring guaranteed losses over gains." }], answer: "B" },
              { number: 34, prompt: "What is the availability heuristic based on?", options: [{ id: "A", text: "Objective statistical data only" }, { id: "B", text: "How easily examples come to mind" }, { id: "C", text: "Government risk reports" }, { id: "D", text: "Random chance" }], answer: "B" },
              { number: 35, prompt: "What example is given of a framing effect?", options: [{ id: "A", text: "Comparing \"90 percent survival\" versus \"10 percent mortality\" descriptions" }, { id: "B", text: "Comparing coin-flip gambles" }, { id: "C", text: "Comparing plane crashes and shark attacks" }, { id: "D", text: "Comparing retirement ages across countries" }], answer: "A" },
              { number: 36, prompt: "What is mentioned as an effective way to increase pension scheme participation?", options: [{ id: "A", text: "Increasing mandatory contribution amounts" }, { id: "B", text: "Automatically enrolling employees with an opt-out option" }, { id: "C", text: "Banning employees from opting out" }, { id: "D", text: "Removing pension schemes altogether" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "Kahneman and Tversky showed that human judgement under uncertainty deviates from the classical ___ model.", answer: ["rational", "rational choice"] },
              { number: 38, prompt: "The availability heuristic is a mental ___ used to judge probability.", answer: ["shortcut"] },
              { number: 39, prompt: "Adjustments that change the framing or default settings of a choice are sometimes called ___.", answer: ["nudges"] },
              { number: 40, prompt: "Critics warn against over-generalising from ___ experiments to real-world behaviour.", answer: ["laboratory"] }
            ],
          }
        ],
      }
    ],
  },
  {
    id: "reading-mock-10",
    title: "IELTS Reading Mock Test 10",
    passages: [
      {
        id: "t10p1",
        title: "The History of Cartography",
        text: "Cartography, the science and art of mapmaking, has evolved dramatically across human history, progressing from simple hand-drawn sketches representing local, immediately familiar terrain to the highly precise, satellite-derived digital maps available instantly on a modern smartphone, a transformation that closely mirrors humanity's steadily expanding geographic knowledge and available technical capability.\n\nThe earliest surviving maps, dating back several thousand years, were typically etched onto clay tablets or carved into stone, and generally depicted only a small, local area of immediate practical relevance, such as a single city, agricultural region, or important local trade route, rather than any attempt at broader, larger-scale geographic representation.\n\nAncient Greek scholars made several foundational contributions to systematic cartography, with Eratosthenes notably calculating the Earth's circumference with striking accuracy using little more than the angle of shadows cast at two separate locations, and later Ptolemy compiling an influential and highly comprehensive geographic work that included coordinate systems for hundreds of locations, one that continued to substantially shape European mapmaking for well over a thousand years afterward.\n\nThe Age of Exploration, spanning roughly the fifteenth through seventeenth centuries, dramatically accelerated cartographic development, as European voyages of maritime exploration steadily generated substantial new geographic information requiring accurate recording, while simultaneously creating urgent, practical commercial and strategic demand for genuinely reliable navigational maps and charts among merchants, naval commanders, and colonial administrators alike.\n\nThe Mercator projection, developed by the Flemish cartographer Gerardus Mercator in 1569, addressed a specific and pressing practical navigational problem by allowing sailors to plot a genuinely straight-line compass course across the map's surface, though this considerable navigational convenience came at the direct cost of significantly distorting the true relative size of landmasses, particularly and most noticeably near the poles, a well-documented and still-debated trade-off.\n\nAerial photography, which emerged in the early twentieth century, and satellite imagery, which followed considerably later in the century, revolutionised cartography once again by enabling mapmakers to systematically capture detailed, accurate geographic information without requiring direct, often difficult or dangerous ground-based surveying of every single mapped location, dramatically increasing both the achievable accuracy and the overall efficiency of the mapmaking process.\n\nContemporary digital mapping technology, including GPS-based satellite navigation and continuously updated, crowd-sourced online mapping platforms, has fundamentally transformed maps from largely static, unchanging documents into dynamic, real-time, and highly interactive tools capable of incorporating live information such as current traffic conditions, recent user-submitted corrections, and personalised route recommendations tailored to individual preferences.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 1, prompt: "The earliest surviving maps typically depicted large-scale, global geographic areas.", answer: "FALSE" },
              { number: 2, prompt: "Eratosthenes calculated the Earth's circumference using the angle of shadows at two locations.", answer: "TRUE" },
              { number: 3, prompt: "Ptolemy's geographic work influenced European mapmaking for over a thousand years.", answer: "TRUE" },
              { number: 4, prompt: "The Age of Exploration reduced the demand for accurate navigational maps.", answer: "FALSE" },
              { number: 5, prompt: "The Mercator projection distorts the relative size of landmasses, especially near the poles.", answer: "TRUE" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 6, prompt: "The earliest surviving maps were etched onto clay tablets or carved into ___.", answer: ["stone"] },
              { number: 7, prompt: "The Mercator projection was developed by Gerardus Mercator in ___.", answer: ["1569"] },
              { number: 8, prompt: "The Mercator projection allowed sailors to plot a straight-line ___ course.", answer: ["compass"] },
              { number: 9, prompt: "Aerial photography emerged in the early ___ century.", answer: ["twentieth"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 10, prompt: "What did early maps generally depict, according to the passage?", options: [{ id: "A", text: "Entire continents" }, { id: "B", text: "A small, local area of immediate practical relevance" }, { id: "C", text: "The whole known world" }, { id: "D", text: "Only ocean routes" }], answer: "B" },
              { number: 11, prompt: "What practical problem did the Mercator projection solve?", options: [{ id: "A", text: "It eliminated all map distortion" }, { id: "B", text: "It allowed sailors to plot a genuinely straight-line compass course" }, { id: "C", text: "It made landmasses appear their true relative size" }, { id: "D", text: "It removed the need for navigation altogether" }], answer: "B" },
              { number: 12, prompt: "What advantage did aerial photography and satellite imagery bring to cartography?", options: [{ id: "A", text: "They made ground-based surveying compulsory" }, { id: "B", text: "They enabled accurate mapping without direct ground-based surveying of every location" }, { id: "C", text: "They eliminated the need for any maps at all" }, { id: "D", text: "They only worked for ocean areas" }], answer: "B" },
              { number: 13, prompt: "How has contemporary digital mapping technology changed maps, according to the passage?", options: [{ id: "A", text: "It has made maps entirely static and unchanging" }, { id: "B", text: "It has transformed maps into dynamic, real-time, interactive tools" }, { id: "C", text: "It has removed the need for GPS" }, { id: "D", text: "It has made maps less accurate than paper maps" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t10p2",
        title: "Fermentation and Food Preservation",
        paragraphs: [
          { id: "A", text: "Fermentation, broadly defined as a metabolic process in which microorganisms such as bacteria, yeast, or moulds convert organic compounds, typically sugars, into other substances, including alcohol, acids, or gases, ranks among the oldest food preservation and transformation techniques known to humanity, with archaeological evidence suggesting deliberate fermentation practices date back at least eight thousand years." },
          { id: "B", text: "Beyond its role in preservation, extending the usable shelf life of otherwise highly perishable foods well beyond what would be achievable through storage alone, fermentation frequently and simultaneously enhances the nutritional profile of the foods involved, in some documented cases increasing the bioavailability of specific vitamins and breaking down naturally occurring anti-nutrient compounds that would otherwise interfere with the body's mineral absorption." },
          { id: "C", text: "Lactic acid fermentation, in which specific bacteria convert sugars present in food into lactic acid, underlies a wide range of familiar foods across many different culinary traditions, including yoghurt, sauerkraut, kimchi, and traditionally made sourdough bread, with the resulting acidic environment simultaneously imparting characteristic tangy flavours while inhibiting the growth of many potentially harmful competing microorganisms." },
          { id: "D", text: "Alcoholic fermentation, driven primarily by yeast converting sugars into ethanol and carbon dioxide, underlies the production of beer, wine, and other alcoholic beverages, a process that, in the specific case of winemaking, additionally depends heavily on the particular characteristics of the grape variety used and prevailing environmental growing conditions to shape the beverage's ultimate flavour profile." },
          { id: "E", text: "Beyond food and beverage production, fermentation has found extensive additional industrial applications, including the large-scale commercial production of antibiotics such as penicillin, various industrial enzymes used across multiple manufacturing sectors, and biofuels, with modern industrial fermentation processes now conducted at a vastly larger scale than the small-batch, artisanal traditional fermentation methods from which the underlying science originally developed." },
          { id: "F", text: "Contemporary scientific research increasingly focuses on the human gut microbiome, the extensive community of microorganisms residing within the human digestive system, and on the specific potential health benefits genuinely associated with regularly consuming fermented foods, though researchers generally caution that current robust scientific evidence remains more limited and preliminary than many enthusiastic popular health claims might otherwise suggest." }
        ],
        groups: [
          {
            type: "matching",
            instruction: "The passage has six paragraphs, A\u2013F. Choose the correct heading for each paragraph.",
            headings: [{ id: "i", text: "How fermentation can improve nutritional value" }, { id: "ii", text: "An ancient technique with a long, documented history" }, { id: "iii", text: "Fermentation's expanding role in industrial manufacturing" }, { id: "iv", text: "A note of scientific caution about health claims" }, { id: "v", text: "The process behind alcoholic beverages" }, { id: "vi", text: "Familiar foods produced through lactic acid fermentation" }, { id: "vii", text: "The discovery of yeast under a microscope" }, { id: "viii", text: "Government regulation of fermented food safety" }],
            questions: [
              { number: 14, paragraphId: "A", answer: "ii" },
              { number: 15, paragraphId: "B", answer: "i" },
              { number: 16, paragraphId: "C", answer: "vi" },
              { number: 17, paragraphId: "D", answer: "v" },
              { number: 18, paragraphId: "E", answer: "iii" },
              { number: 19, paragraphId: "F", answer: "iv" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 20, prompt: "Archaeological evidence suggests deliberate fermentation practices date back at least ___ years.", answer: ["eight thousand"] },
              { number: 21, prompt: "Fermentation can break down naturally occurring ___ compounds that interfere with mineral absorption.", answer: ["anti-nutrient"] },
              { number: 22, prompt: "Lactic acid fermentation underlies foods such as yoghurt, sauerkraut, and ___.", answer: ["kimchi"] },
              { number: 23, prompt: "Alcoholic fermentation is driven primarily by ___ converting sugars into ethanol and carbon dioxide.", answer: ["yeast"] }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 24, prompt: "What does fermentation do beyond preserving food, according to paragraph B?", options: [{ id: "A", text: "It always reduces nutritional value" }, { id: "B", text: "It can enhance the nutritional profile of foods" }, { id: "C", text: "It has no effect on nutrition" }, { id: "D", text: "It only affects the taste of food" }], answer: "B" },
              { number: 25, prompt: "What industrial applications of fermentation are mentioned in paragraph E?", options: [{ id: "A", text: "Only food and beverage production" }, { id: "B", text: "Antibiotics, industrial enzymes, and biofuels" }, { id: "C", text: "Only alcoholic beverage production" }, { id: "D", text: "Only bread production" }], answer: "B" },
              { number: 26, prompt: "What caution do researchers raise about fermented foods and gut health, according to paragraph F?", options: [{ id: "A", text: "There is no scientific interest in the topic" }, { id: "B", text: "Current evidence remains more limited than popular claims might suggest" }, { id: "C", text: "Fermented foods have been proven harmful" }, { id: "D", text: "The gut microbiome has no connection to fermented foods" }], answer: "B" }
            ],
          }
        ],
      },
      {
        id: "t10p3",
        title: "The Debate Over Handwriting Instruction",
        text: "Handwriting instruction has occupied a shifting and increasingly contested place within school curricula over recent decades, as the near-universal adoption of digital keyboards and touchscreen devices for both personal and professional communication has led many educators and policymakers to seriously question how much class time should still reasonably be devoted to systematically teaching legible, well-formed handwriting.\n\nFor much of the twentieth century, structured, systematic handwriting instruction, frequently including formal cursive writing, represented a standard and largely unquestioned component of primary education across most English-speaking countries, with students commonly required to master specific, standardised letter formations and practice sustained penmanship through repeated, deliberate drilling exercises.\n\nThe introduction of computers into everyday classroom environments beginning in the 1980s and 1990s gradually shifted institutional priorities, with keyboarding and basic typing skills increasingly viewed by many educators as comparably or even more practically essential than traditional handwriting for students' likely future professional and educational needs in an increasingly digital world.\n\nSeveral English-speaking countries and individual states have consequently removed formal cursive handwriting instruction as a compulsory element from their official standardised curricula in recent years, a genuinely controversial decision that has provoked considerable public debate among parents, educators, and researchers regarding the potential broader educational and cognitive consequences of this specific curricular shift.\n\nProponents of continued, sustained handwriting instruction cite a growing and increasingly cited body of research suggesting that the specific physical, motor act of handwriting, as opposed to typing on a keyboard, may meaningfully engage different underlying neural pathways associated with reading comprehension, memory retention, and idea generation, with several controlled studies finding that students taking handwritten notes subsequently demonstrated measurably better conceptual understanding than those who typed identical notes on a laptop.\n\nCritics of mandatory handwriting instruction counter that class time is a genuinely finite and valuable educational resource, arguing that time currently spent on extensive handwriting drilling could instead be more productively redirected toward digital literacy skills, computational thinking, or other subject areas of arguably greater direct relevance to students' likely future professional and personal lives.\n\nSome education researchers have proposed a deliberately balanced middle-ground approach, suggesting that basic, functional legible handwriting remains genuinely worth teaching for foundational early literacy development and certain specific practical situations, such as handwritten examinations, while extensive cursive mastery and repeated penmanship drilling beyond a basic functional level may reasonably be treated as optional rather than a compulsory core curriculum requirement for every student.",
        groups: [
          {
            type: "tfng",
            instruction: "Do the following statements agree with the information given in the passage? Answer TRUE, FALSE, or NOT GIVEN.",
            questions: [
              { number: 27, prompt: "Digital keyboards have led some educators to question how much time should be spent teaching handwriting.", answer: "TRUE" },
              { number: 28, prompt: "Cursive writing was a standard part of primary education for most of the twentieth century.", answer: "TRUE" },
              { number: 29, prompt: "Computers were introduced into classrooms mainly in the 1950s.", answer: "FALSE" },
              { number: 30, prompt: "All English-speaking countries have removed cursive handwriting from their curricula.", answer: "FALSE" },
              { number: 31, prompt: "Some research suggests handwriting may engage different neural pathways than typing.", answer: "TRUE" },
              { number: 32, prompt: "Critics of mandatory handwriting instruction believe class time could be redirected to other skills.", answer: "TRUE" }
            ],
          },
          {
            type: "mc",
            instruction: "Choose the correct letter, A, B, C, or D.",
            questions: [
              { number: 33, prompt: "Why did institutional priorities shift regarding handwriting, according to paragraph three?", options: [{ id: "A", text: "Because handwriting was proven harmful" }, { id: "B", text: "Because keyboarding was increasingly viewed as comparably or more essential" }, { id: "C", text: "Because students stopped attending school" }, { id: "D", text: "Because cursive was banned internationally" }], answer: "B" },
              { number: 34, prompt: "What did studies on handwritten versus typed notes find, according to the passage?", options: [{ id: "A", text: "No difference between the two methods" }, { id: "B", text: "Students taking handwritten notes showed measurably better conceptual understanding" }, { id: "C", text: "Typing always produced better results" }, { id: "D", text: "Handwriting had a negative effect on memory" }], answer: "B" },
              { number: 35, prompt: "What do critics of mandatory handwriting instruction argue?", options: [{ id: "A", text: "That handwriting should be taught more intensively" }, { id: "B", text: "That class time could be redirected to digital literacy or other subjects" }, { id: "C", text: "That handwriting has no cognitive benefits whatsoever" }, { id: "D", text: "That cursive should become compulsory worldwide" }], answer: "B" },
              { number: 36, prompt: "What middle-ground approach do some researchers propose?", options: [{ id: "A", text: "Banning all handwriting instruction" }, { id: "B", text: "Teaching basic functional handwriting while treating extensive cursive mastery as optional" }, { id: "C", text: "Requiring extensive cursive drilling for every student" }, { id: "D", text: "Eliminating typed work entirely" }], answer: "B" }
            ],
          },
          {
            type: "completion",
            instruction: "Complete the sentences below. Write NO MORE THAN TWO WORDS from the passage for each answer.",
            questions: [
              { number: 37, prompt: "For much of the twentieth century, handwriting instruction frequently included formal ___ writing.", answer: ["cursive"] },
              { number: 38, prompt: "Some studies found handwritten notes led to better ___ understanding than typed notes.", answer: ["conceptual"] },
              { number: 39, prompt: "Critics argue class time could be redirected toward digital literacy or computational ___.", answer: ["thinking"] },
              { number: 40, prompt: "Some researchers suggest basic handwriting remains useful for handwritten ___.", answer: ["examinations"] }
            ],
          }
        ],
      }
    ],
  },
];
