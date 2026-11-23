// Scholar Compass News — real student stories, newest first.
// Add an item to publish it. `imageUrl` is optional (no photo = initial avatar).
import tergelsaikhanPhoto from "../assets/news/tergelsaikhan.jpg";
import nominPhoto from "../assets/news/nomin.jpg";

// Only this many stories show in the homepage sidebar; the rest live on the news page.
export const HOME_NEWS_COUNT = 2;

export const NEWS = [
  {
    id: "nomin-ielts-8",
    date: "Nov 23, 2026",
    authorName: "E. Nomin",
    scoreTag: "IELTS 8.0",
    headline: "E. Nomin Scores IELTS Band 8.0: Sharing Her Preparation Journey",
    quoteOrStory: [
      { q: "How did you structure your IELTS preparation alongside your regular schoolwork?", a: "Beyond my schoolwork, I devoted an additional hour to reading English articles. I also completed weekly mock tests, which noticeably improved my focus and refined my IELTS methods." },
      { q: "Which IELTS skills did you initially struggle with the most, and what specific difficulties did you encounter?", a: "Initially, my Speaking and Writing abilities were quite limited. While preparing for the Speaking section, I often forgot the questions or produced overly long sentences. In Writing, I struggled to choose appropriate words and made many typing errors." },
      { q: "How did you discover Scholar Compass, and what motivated you to start using the platform?", a: "I first came across it through a classmate. Driven by curiosity, I started using it to find additional volunteer positions. Eventually, I noticed that helpful guidance from dependable sources was readily available, along with the chance to have my essays reviewed by AI. Over time, I grew accustomed to checking Scholar Compass every day." },
      { q: "Which Scholar Compass features did you find yourself using most frequently during your preparation?", a: "I frequently used the Writing feature, which allowed me to receive detailed assessments of my essays from an AI." },
      { q: "How did Scholar Compass's AI-powered Writing assessment help you improve your writing, and what difference did you notice in your performance?", a: "The AI Writing assessment provided significant support. It offered detailed feedback on my essays and contributed to my score of 7 in the actual IELTS exam. I had been stalled at Band 6 on mock tests, but that feature allowed me to improve my writing significantly." },
      { q: "How closely did Scholar Compass's IELTS mock tests reflect the actual examination, and how did your practice results compare with your final score?", a: "I was surprised to discover that the mock tests were remarkably similar to the actual IELTS test. My overall band scores on the mock tests, which I took a few days before my actual exam, had consistently been 8." },
      { q: "What did you find most challenging about the actual IELTS examination, and how did you manage your anxiety before the Speaking test?", a: "I found the most challenging part of the test to be waiting for my Speaking test after completing the other three sections (Listening, Reading, and Writing). My mind was a jumbled mess. However, about 15 minutes before my Speaking exam, I took several deep breaths and tried to distract myself from feeling more anxious. As a result, I calmly went through my examination." },
      { q: "Looking back, which preparation habits or strategies do you believe contributed most to your Band 8.0 result?", a: "Taking weekly mock tests significantly impacted my final result. They helped me identify my strengths and weaknesses, and taking them in a quiet, focused space, treating them as actual IELTS exams, reduced nervousness." },
      { q: "What advice would you give to students preparing for IELTS, particularly those aiming for Band 7.5 or higher?", a: "Focus on developing strong English proficiency rather than memorising model answers or sophisticated vocabulary. Practise all four IELTS skills consistently, analyse your mistakes, and work on improving your accuracy, coherence, and time management. Most importantly, understand the assessment criteria and aim for consistent performance across all sections, not just one." },
    ],
    imageUrl: nominPhoto,
    targetUrl: "#/ielts/writing",
  },
  {
    id: "tergelsaikhan-ielts-8",
    date: "Oct 11, 2026",
    authorName: "Tergelsaikhan U.",
    gradeClass: "Grade 11B",
    school: "Oyunlag Secondary School",
    scoreTag: "IELTS 8.0",
    headline: "Tergelsaikhan U. Scores Band 8.0 on IELTS & Shares His SAT Journey!",
    quoteOrStory: [
      "Tergelsaikhan capitalized on the extensive exercise banks available on ScholarCompass for both SAT and IELTS—putting in maximum reps across practice modules, with a focus on the 123 IELTS Reading & Writing exercises.",
      "Beyond test prep, he frequently uses the Opportunity Board to stay active. Through ScholarCompass, he discovered and joined Clean Up Day Mongolia 2026, spending a day contributing to environmental protection while making great new friends along the way.",
    ],
    imageUrl: tergelsaikhanPhoto,
    targetUrl: "#/category/ielts",
  },
  {
    id: "erkhembileg-ielts-7-5",
    date: "Oct 11, 2026",
    testedOn: "Took the IELTS on Oct 4, 2026",
    authorName: "Erkhembileg E.",
    gradeClass: "Grade 11B",
    school: "Oyunlag Secondary School",
    scoreTag: "IELTS 7.5",
    headline: "Erkhembileg E. Achieves IELTS 7.5 Overall Score!",
    quoteOrStory: [
      "“I prepared for the IELTS about 3 hours a day, mainly utilizing JumpInto.com and ScholarCompass to practice and refine my skills. Consistency before the exam was key for me. I found the Reading practice section on ScholarCompass exceptionally helpful due to its clean design and extensive library of study materials. It helped me practice efficiently, identify my weaknesses, and build real confidence before test day.”",
    ],
    targetUrl: "#/category/ielts",
  },
];
