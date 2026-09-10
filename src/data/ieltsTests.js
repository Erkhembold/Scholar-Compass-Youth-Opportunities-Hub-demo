// IELTS Academic Reading mock tests — original content (not reproduced from
// any real IELTS paper). Each test: 3 passages, 40 questions total,
// grouped by question type so the runner can render/score generically.
// Only tests 1–2 are fully built; 3–10 are listed as "coming soon" using
// the same card so nothing on the page looks broken or fabricated.

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
  { id: "reading-mock-3", title: "IELTS Reading Mock Test 3", comingSoon: true },
  { id: "reading-mock-4", title: "IELTS Reading Mock Test 4", comingSoon: true },
  { id: "reading-mock-5", title: "IELTS Reading Mock Test 5", comingSoon: true },
  { id: "reading-mock-6", title: "IELTS Reading Mock Test 6", comingSoon: true },
  { id: "reading-mock-7", title: "IELTS Reading Mock Test 7", comingSoon: true },
  { id: "reading-mock-8", title: "IELTS Reading Mock Test 8", comingSoon: true },
  { id: "reading-mock-9", title: "IELTS Reading Mock Test 9", comingSoon: true },
  { id: "reading-mock-10", title: "IELTS Reading Mock Test 10", comingSoon: true },
];
