// English UI string -> Mongolian translation. Keys are matched exactly
// against the English copy used in components (see LanguageContext's `t`).
// Only interface chrome (buttons, labels, nav, headings) is translated —
// article/opportunity content and IELTS/SAT passages & questions stay in
// English regardless of language, by design.
//
// Proper/platform names (IELTS, SAT, ScholarCompass, Instagram, Gmail,
// etc.) are intentionally absent — they're never looked up, so they always
// render as written.

export const translations = {
  // Nav
  Home: "Нүүр",
  Competitions: "Тэмцээнүүд",
  "Volunteer Opportunities": "Сайн дурын ажлын боломжууд",
  Internships: "Дадлагын боломжууд",
  Scholarships: "Тэтгэлгийн боломжууд",
  Opportunities: "Боломжууд",
  "Suggested Reads": "Санал болгох нийтлэлүүд",
  About: "Бидний тухай",
  Contact: "Холбоо барих",
  "Get notified": "Мэдэгдэл авах",
  "Get Notified": "Мэдэгдэл авах",
  "Notify me": "Мэдэгдэл авах",

  // Generic call-to-actions
  "Explore Opportunities": "Боломжуудыг үзэх",
  "Read the Guides": "Зөвлөмжүүдийг унших",
  "Start Now": "Эхлүүлэх",
  "Learn More": "Дэлгэрэнгүй",
  "Read More": "Дэлгэрэнгүй унших",
  "Read Guide": "Зөвлөмж унших",
  Search: "Хайх",
  Filter: "Шүүх",
  "Clear Filters": "Шүүлтүүрийг арилгах",
  Save: "Хадгалах",
  Saved: "Хадгалсан",
  Share: "Хуваалцах",
  Apply: "Өргөдөл гаргах",
  "Apply Now": "Одоо өргөдөл гаргах",

  // Opportunity metadata
  Deadline: "Эцсийн хугацаа",
  Eligibility: "Шаардлага",
  Requirements: "Тавигдах шаардлага",
  Location: "Байршил",
  Online: "Онлайн",
  "In Person": "Биечлэн",
  "Fully Funded": "Бүрэн санхүүжилттэй",
  "Partially Funded": "Хэсэгчилсэн санхүүжилттэй",
  "Open Now": "Одоо нээлттэй",
  "Closing Soon": "Хаагдах дөхөж байна",
  Scholarship: "Тэтгэлэг",
  Competition: "Тэмцээн",
  Volunteer: "Сайн дурын ажил",
  Volunteering: "Сайн дурын ажил",
  Internship: "Дадлага",
  News: "Мэдээ",
  Guide: "Зөвлөмж",
  Resources: "Хэрэгтэй материалууд",
  Featured: "Онцлох",
  Applications: "Өргөдөл",
  Projects: "Төслүүд",
  "Profile Building": "Профайл бүрдүүлэх",
  "Test Prep": "Шалгалтын бэлтгэл",
  "Student Life": "Сурагчдын амьдрал",
  Essays: "Эсээ",
  Deadlines: "Эцсийн хугацаанууд",

  // Notification / newsletter
  "Don't Miss the Deadline": "Эцсийн хугацааг бүү алдаарай",
  "Don\u2019t miss the deadline.": "Эцсийн хугацааг бүү алдаарай.",
  "Your Email": "Таны имэйл",
  "Email address": "Имэйл хаяг",
  "Email Address": "Имэйл хаяг",
  "Enter Your Email": "Имэйл хаягаа оруулна уу",
  Subscribe: "Бүртгүүлэх",
  Subscribed: "Бүртгүүллээ",
  Success: "Амжилттай",
  Error: "Алдаа гарлаа",
  "Follow ScholarCompass": "ScholarCompass-ийг дагаарай",

  // Navigation / flow controls
  Previous: "Өмнөх",
  Next: "Дараагийнх",
  Continue: "Үргэлжлүүлэх",
  Back: "Буцах",
  Close: "Хаах",

  // Test-taking
  "Start Test": "Шалгалт эхлүүлэх",
  "Start Practice": "Дадлага эхлүүлэх",
  Submit: "Илгээх",
  "Submit Test": "Шалгалтаа илгээх",
  Question: "Асуулт",
  Questions: "Асуултууд",
  "Your Answer": "Таны хариулт",
  "Correct Answer": "Зөв хариулт",
  Explanation: "Тайлбар",
  Correct: "Зөв",
  Incorrect: "Буруу",
  Skipped: "Алгассан",
  "Time Left": "Үлдсэн хугацаа",
  Score: "Оноо",
  Result: "Үр дүн",
  Results: "Үр дүн",
  "View Results": "Үр дүнг харах",
  "Try Again": "Дахин оролдох",
  "Retake Test": "Шалгалтыг дахин өгөх",
  Instructions: "Заавар",
  Passage: "Эх",

  // IELTS-specific
  Reading: "Унших",
  Listening: "Сонсох",
  Speaking: "Ярих",
  Writing: "Бичих",
  "Reading Mock Test": "Унших дадлагын шалгалт",
  "Listening Mock Test": "Сонсох дадлагын шалгалт",
  "Speaking Practice": "Ярих дадлага",
  "Writing Practice": "Бичих дадлага",
  "Part 1": "1-р хэсэг",
  "Part 2": "2-р хэсэг",
  "Part 3": "3-р хэсэг",
  "Part 4": "4-р хэсэг",

  // Sign in
  "Sign In": "Нэвтрэх",
  "Create Account": "Бүртгэл үүсгэх",
};
