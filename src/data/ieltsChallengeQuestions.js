// ScholarCompass IELTS 1v1 Challenge question bank.
// Purpose-built for the timed 1v1 format: every question — Reading or
// Writing — is a single multiple-choice item with one correct option,
// so it can be scored instantly and automatically. This is a separate,
// smaller bank from ieltsReadingExercises.js (which supports richer
// item types like TFNG-with-multiple-statements and matching-headings
// that don't reduce to a single MC pick) and from the full-length mock
// tests in ieltsTests.js.

export const IELTS_CHALLENGE_SKILLS = [
  { id: "reading", label: "IELTS Reading" },
  { id: "writing", label: "IELTS Writing" },
];

export const IELTS_CHALLENGE_QUESTIONS = {
  reading: [
    {
      id: "R01",
      passage:
        "Many cities are planting more trees along roads and around public buildings. Besides making urban areas more attractive, trees can provide shade and help reduce the temperature of nearby streets.",
      prompt: "What is the main idea of the passage?",
      options: [
        { id: "A", text: "Trees are expensive to maintain." },
        { id: "B", text: "Trees can improve urban environments in several ways." },
        { id: "C", text: "Most cities have too many roads." },
        { id: "D", text: "Public buildings need more decoration." },
      ],
      answer: "B",
    },
    {
      id: "R02",
      passage:
        "The town library introduced a self-service system last year. Visitors can now borrow books using machines near the entrance. Library staff are still available to help people who need assistance.",
      prompt: "Statement: Library staff are no longer needed because of the new system. True, False, or Not Given?",
      options: [
        { id: "A", text: "TRUE" },
        { id: "B", text: "FALSE" },
        { id: "C", text: "NOT GIVEN" },
      ],
      answer: "B",
    },
    {
      id: "R03",
      passage:
        "The museum was renovated to make the building more accessible to visitors. New ramps were added, and several signs were redesigned.",
      prompt: "What does \u201caccessible\u201d most likely mean?",
      options: [
        { id: "A", text: "Easier to reach or use" },
        { id: "B", text: "More expensive" },
        { id: "C", text: "More difficult to enter" },
        { id: "D", text: "Older and more traditional" },
      ],
      answer: "A",
    },
    {
      id: "R04",
      passage:
        "A. Solar panels produce electricity from sunlight.\nB. Wind turbines generate electricity when their blades rotate.\nC. Hydroelectric systems use moving water to generate power.",
      prompt: "Which source depends directly on moving water?",
      options: [
        { id: "A", text: "Solar power" },
        { id: "B", text: "Wind power" },
        { id: "C", text: "Hydroelectric power" },
        { id: "D", text: "None of them" },
      ],
      answer: "C",
    },
    {
      id: "R05",
      passage:
        "Mina usually studies in the school library because her home is often noisy in the evenings. This week, however, the library is closed for repairs, so she plans to remain at school after classes finish.",
      prompt: "Why will Mina stay at school after classes?",
      options: [
        { id: "A", text: "She has joined a new club." },
        { id: "B", text: "She needs a quiet place to study." },
        { id: "C", text: "Her teacher asked her to stay." },
        { id: "D", text: "She has forgotten her books." },
      ],
      answer: "B",
    },
    {
      id: "R06",
      passage:
        "The community garden was established in 2022 with only twelve vegetable plots. Two years later, the number had increased to thirty.",
      prompt: "How many plots did the garden have in 2022?",
      options: [
        { id: "A", text: "12" },
        { id: "B", text: "18" },
        { id: "C", text: "24" },
        { id: "D", text: "30" },
      ],
      answer: "A",
    },
    {
      id: "R07",
      passage:
        "Researchers observed that students who exercised regularly tended to sleep longer than students who rarely exercised. However, the researchers did not determine whether exercise directly caused better sleep.",
      prompt: "Statement: The researchers proved that exercise causes students to sleep longer. True, False, or Not Given?",
      options: [
        { id: "A", text: "TRUE" },
        { id: "B", text: "FALSE" },
        { id: "C", text: "NOT GIVEN" },
      ],
      answer: "B",
    },
    {
      id: "R08",
      passage:
        "Some schools are replacing printed notices with digital announcements. This allows information to be updated quickly and reduces the amount of paper used.",
      prompt: "Why are some schools using digital announcements?",
      options: [
        { id: "A", text: "To make teachers work longer hours" },
        { id: "B", text: "To communicate more efficiently and reduce paper use" },
        { id: "C", text: "To eliminate school rules" },
        { id: "D", text: "To prevent students from reading notices" },
      ],
      answer: "B",
    },
    {
      id: "R09",
      passage:
        "The company decided to expand its training programme after receiving positive feedback from employees.",
      prompt: "What does \u201cexpand\u201d mean?",
      options: [
        { id: "A", text: "Cancel" },
        { id: "B", text: "Reduce" },
        { id: "C", text: "Increase" },
        { id: "D", text: "Delay" },
      ],
      answer: "C",
    },
    {
      id: "R10",
      passage:
        "During the first month of the new bus service, passenger numbers were lower than expected. After the company added more convenient morning routes, usage increased significantly.",
      prompt: "What can be inferred?",
      options: [
        { id: "A", text: "Morning routes may have influenced passenger numbers." },
        { id: "B", text: "The buses became more expensive." },
        { id: "C", text: "The company stopped operating in the afternoon." },
        { id: "D", text: "Passengers preferred walking." },
      ],
      answer: "A",
    },
    {
      id: "R11",
      passage:
        "The university introduced online appointment booking for students. Previously, students had to visit the administration office in person.",
      prompt: "Before the new system, students had to ______.",
      options: [
        { id: "A", text: "call the university every morning" },
        { id: "B", text: "visit the office personally" },
        { id: "C", text: "send a letter" },
        { id: "D", text: "speak to a professor" },
      ],
      answer: "B",
    },
    {
      id: "R12",
      passage:
        "The experiment was carried out in three schools. Researchers collected information from students over a period of six months.",
      prompt: "Statement: The experiment lasted one year. True, False, or Not Given?",
      options: [
        { id: "A", text: "TRUE" },
        { id: "B", text: "FALSE" },
        { id: "C", text: "NOT GIVEN" },
      ],
      answer: "B",
    },
    {
      id: "R13",
      passage: "The city introduced electric buses last spring. They produce less noise than traditional diesel buses.",
      prompt: "What does \u201cThey\u201d refer to?",
      options: [
        { id: "A", text: "The cities" },
        { id: "B", text: "The springs" },
        { id: "C", text: "The electric buses" },
        { id: "D", text: "Traditional buses" },
      ],
      answer: "C",
    },
    {
      id: "R14",
      passage:
        "Reading for pleasure can expose students to unfamiliar vocabulary and different writing styles. It can also encourage students to read for longer periods without feeling that they are studying.",
      prompt: "What is the passage mainly about?",
      options: [
        { id: "A", text: "Why textbooks are difficult" },
        { id: "B", text: "Benefits of reading for pleasure" },
        { id: "C", text: "How teachers choose books" },
        { id: "D", text: "Why students dislike studying" },
      ],
      answer: "B",
    },
    {
      id: "R15",
      passage:
        "The research team began collecting data in January and completed the process in April. Analysis of the results began in May.",
      prompt: "When did data collection finish?",
      options: [
        { id: "A", text: "January" },
        { id: "B", text: "April" },
        { id: "C", text: "May" },
        { id: "D", text: "June" },
      ],
      answer: "B",
    },
    {
      id: "R16",
      passage: "Although the new caf\u00e9 opened only three months ago, customers often have to wait for a table during lunchtime.",
      prompt: "What is most likely true?",
      options: [
        { id: "A", text: "The caf\u00e9 is unpopular." },
        { id: "B", text: "The caf\u00e9 receives many lunchtime customers." },
        { id: "C", text: "The caf\u00e9 closes at lunchtime." },
        { id: "D", text: "The caf\u00e9 has stopped serving food." },
      ],
      answer: "B",
    },
    {
      id: "R17",
      passage: "The project was temporarily suspended while engineers inspected the equipment.",
      prompt: "What does \u201ctemporarily\u201d mean?",
      options: [
        { id: "A", text: "Permanently" },
        { id: "B", text: "For a short period" },
        { id: "C", text: "Secretly" },
        { id: "D", text: "Immediately" },
      ],
      answer: "B",
    },
    {
      id: "R18",
      passage:
        "A. The first group studied using printed textbooks.\nB. The second group used recorded lectures.\nC. The third group combined lectures with weekly discussions.",
      prompt: "Which group used discussions as part of its study method?",
      options: [
        { id: "A", text: "Group A" },
        { id: "B", text: "Group B" },
        { id: "C", text: "Group C" },
        { id: "D", text: "All groups" },
      ],
      answer: "C",
    },
    {
      id: "R19",
      passage:
        "The new sports centre contains a swimming pool, a gym and two basketball courts. The centre is open from 6 a.m. until 10 p.m.",
      prompt: "Statement: The sports centre has a football field. True, False, or Not Given?",
      options: [
        { id: "A", text: "TRUE" },
        { id: "B", text: "FALSE" },
        { id: "C", text: "NOT GIVEN" },
      ],
      answer: "C",
    },
    {
      id: "R20",
      passage:
        "At first, only a few students attended the environmental club's meetings. Attendance increased after the club began organizing outdoor clean-up activities.",
      prompt: "What probably encouraged more students to join?",
      options: [
        { id: "A", text: "The meetings became shorter." },
        { id: "B", text: "The club offered more practical activities." },
        { id: "C", text: "The club stopped meeting indoors." },
        { id: "D", text: "Students received higher grades." },
      ],
      answer: "B",
    },
  ],
  writing: [
    {
      id: "W01",
      passage: "",
      prompt: "Choose the correct sentence.",
      options: [
        { id: "A", text: "Students should studies regularly before an exam." },
        { id: "B", text: "Students should studying regularly before an exam." },
        { id: "C", text: "Students should study regularly before an exam." },
        { id: "D", text: "Students should studied regularly before an exam." },
      ],
      answer: "C",
    },
    {
      id: "W02",
      passage: "",
      prompt: "Choose the correct sentence.",
      options: [
        { id: "A", text: "The number of students are increasing." },
        { id: "B", text: "The number of students is increasing." },
        { id: "C", text: "The number of students increase." },
        { id: "D", text: "The number of students have increased." },
      ],
      answer: "B",
    },
    {
      id: "W03",
      passage: "Many students prefer studying at home. ______, some students find libraries more effective because they provide fewer distractions.",
      prompt: "Choose the best transition.",
      options: [
        { id: "A", text: "Therefore" },
        { id: "B", text: "However" },
        { id: "C", text: "For example" },
        { id: "D", text: "Similarly" },
      ],
      answer: "B",
    },
    {
      id: "W04",
      passage: "",
      prompt: "Which sentence is the clearest thesis for an essay about school uniforms?",
      options: [
        { id: "A", text: "School uniforms are interesting." },
        { id: "B", text: "This essay will talk about uniforms." },
        {
          id: "C",
          text: "School uniforms can reduce visible differences between students, but they may also limit individual expression.",
        },
        { id: "D", text: "There are many schools that use uniforms." },
      ],
      answer: "C",
    },
    {
      id: "W05",
      passage: "The city built more bicycle lanes. Cycling became more popular.",
      prompt: "Choose the best combination of these two sentences.",
      options: [
        { id: "A", text: "The city built more bicycle lanes, cycling became more popular." },
        { id: "B", text: "The city built more bicycle lanes, and cycling became more popular." },
        { id: "C", text: "The city built more bicycle lanes cycling became more popular." },
        { id: "D", text: "The city built more bicycle lanes because cycling became more popular." },
      ],
      answer: "B",
    },
    {
      id: "W06",
      passage:
        "1. As a result, students may find it easier to concentrate.\n2. A quiet study environment can improve learning.\n3. Loud conversations and constant phone notifications can interrupt concentration.\n4. For this reason, many students choose libraries for important revision sessions.",
      prompt: "Which sentence should come FIRST in the paragraph?",
      options: [
        { id: "A", text: "Sentence 1" },
        { id: "B", text: "Sentence 2" },
        { id: "C", text: "Sentence 3" },
        { id: "D", text: "Sentence 4" },
      ],
      answer: "B",
    },
    {
      id: "W07",
      passage: "The government should ______ more money to public transport.",
      prompt: "Choose the most appropriate word.",
      options: [
        { id: "A", text: "allocate" },
        { id: "B", text: "attend" },
        { id: "C", text: "achieve" },
        { id: "D", text: "persuade" },
      ],
      answer: "A",
    },
    {
      id: "W08",
      passage: "Idea: Schools should encourage students to exercise regularly.",
      prompt: "Which sentence best develops this idea?",
      options: [
        { id: "A", text: "Exercise is something people know about." },
        {
          id: "B",
          text: "Regular physical activity can improve students' fitness and may help them concentrate during lessons.",
        },
        { id: "C", text: "Schools contain classrooms and teachers." },
        { id: "D", text: "Many students have different hobbies." },
      ],
      answer: "B",
    },
    {
      id: "W09",
      passage: "",
      prompt: "Which sentence is most appropriate for an IELTS Task 2 essay?",
      options: [
        { id: "A", text: "Kids these days don't really wanna study." },
        { id: "B", text: "A lot of kids are kinda lazy about school." },
        { id: "C", text: "Some students may become less motivated when academic pressure becomes excessive." },
        { id: "D", text: "Students just don't care anymore." },
      ],
      answer: "C",
    },
    {
      id: "W10",
      passage: "Argument: Public transport should be improved.",
      prompt: "Which is the best concluding sentence for an essay arguing that public transport should be improved?",
      options: [
        { id: "A", text: "Public transport is a topic that many people know about." },
        {
          id: "B",
          text: "To sum up, investing in reliable public transport can reduce congestion and provide people with a more practical way to travel.",
        },
        { id: "C", text: "In conclusion, buses are buses and trains are trains." },
        { id: "D", text: "That's why this essay is important." },
      ],
      answer: "B",
    },
  ],
};

export function getIeltsChallengeQuestions(skill) {
  return (IELTS_CHALLENGE_QUESTIONS[skill] || []).map((q) => ({ id: q.id, skill }));
}

export function findIeltsChallengeQuestionById(id, skill) {
  const pools = skill ? [skill] : Object.keys(IELTS_CHALLENGE_QUESTIONS);
  for (const s of pools) {
    const found = (IELTS_CHALLENGE_QUESTIONS[s] || []).find((q) => q.id === id);
    if (found) return { ...found, skill: s };
  }
  return null;
}
