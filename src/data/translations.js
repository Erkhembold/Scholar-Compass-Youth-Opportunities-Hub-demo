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
  Profile: "Профайл",

  // Generic call-to-actions
  "Explore Opportunities": "Боломжуудыг үзэх",
  "Read the Guides": "Зөвлөмжүүдийг унших",
  "Start Now": "Эхлүүлэх",
  "Show more": "Цааш үзэх",
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

  // Hero
  "ScholarCompass brings scholarships, competitions, volunteering, internships, and test-prep guidance into one place, so finding your next step takes minutes instead of a dozen open tabs.":
    "ScholarCompass нь тэтгэлэг, тэмцээн, сайн дурын ажил, дадлага, шалгалтын бэлтгэлийн зөвлөмжийг нэг дор цуглуулдаг тул дараагийн алхмаа олоход олон цонх нээх шаардлагагүй, ердөө хэдхэн минут л хангалттай.",

  // Opportunity board
  "The Opportunity Board": "Боломжуудын самбар",
  "A running list of scholarships, competitions, volunteer roles, and internships worth your time — filter to what applies to you.":
    "Цаг заваа зориулж болох тэтгэлэг, тэмцээн, сайн дурын ажил, дадлагын боломжуудын шинэчлэгдэж байдаг жагсаалт — өөрт тохирохыг шүүлтүүрээр олоорой.",
  All: "Бүгд",
  "Every current listing in this category — new ones are added as they come in.":
    "Энэ ангиллын одоогийн бүх боломж — шинэ мэдээлэл ирэх бүрд шинэчлэгдэнэ.",

  // IELTS mock test list
  "IELTS Reading Mock Tests": "IELTS Reading дадлага шалгалтууд",
  "Ten full-length practice tests, each timed at 60 minutes with 40 questions across 3 passages. Two are live now — the rest are on the way.":
    "Тус бүр 60 минут хугацаатай, 3 хэсэгт 40 асуулттай, нийт арван бүрэн дадлага шалгалт. Хоёр нь одоогоор бэлэн, үлдсэн нь удахгүй нэмэгдэнэ.",
  "60 min · 40 questions": "60 мин · 40 асуулт",
  "Coming soon": "Тун удахгүй",

  // About
  "ScholarCompass exists to make student opportunities easier to find, understand, and act on.":
    "ScholarCompass нь сурагчдад зориулсан боломжуудыг олоход, ойлгоход, ашиглахад хялбар болгох зорилготой.",
  "We're centralizing the scattered world of scholarships, competitions, volunteering, internships, and test-prep resources into a single, current source that a high-school student can actually keep up with.":
    "Бид тэтгэлэг, тэмцээн, сайн дурын ажил, дадлага, шалгалтын бэлтгэлийн тархай мэдээллийг ахлах ангийн сурагч бодитоор дагаж чадах нэг л эх сурвалж болгон нэгтгэж байна.",
  "Find it": "Олох",
  "Scholarships, competitions, volunteering, and internships collected in one board instead of a dozen separate sites.":
    "Тэтгэлэг, тэмцээн, сайн дурын ажил, дадлагыг арван өөр сайт биш, нэг самбар дээрээс олоорой.",
  "Understand it": "Ойлгох",
  "Plain-language eligibility, deadlines, and descriptions, so you can tell what's worth applying to in under a minute.":
    "Тавигдах шаардлага, эцсийн хугацаа, тайлбарыг ойлгомжтой хэлээр бичсэн тул юунд өргөдөл гаргах нь зохимжтойг нэг минутын дотор мэдэж болно.",
  "Act on it": "Ашиглах",
  "Deadline reminders and short guides on IELTS, SAT, and applications, so nothing worth doing slips past you.":
    "Эцсийн хугацааны сануулга, IELTS, SAT, өргөдлийн талаарх товч зөвлөмжүүд — ач холбогдолтой юу ч алдагдахгүй.",

  // Notification section
  "Get a short, occasional email when a new scholarship, competition, or internship deadline is added to the board.":
    "Самбарт шинэ тэтгэлэг, тэмцээн, дадлагын эцсийн хугацаа нэмэгдэх бүрд, ховорхон, товч имэйл авах болно.",
  "Enter a valid email address to continue.": "Үргэлжлүүлэхийн тулд зөв имэйл хаяг оруулна уу.",
  "Something went wrong on this device. Try again.": "Энэ төхөөрөмж дээр алдаа гарлаа. Дахин оролдоно уу.",
  "This is a prototype — your email is stored on this device only, for now.":
    "Энэ бол туршилтын хувилбар — таны имэйл одоохондоо зөвхөн энэ төхөөрөмж дээр хадгалагдана.",

  // Submit opportunity
  "Know an opportunity we're missing?": "Бид дутуулсан боломж байна уу?",
  "Teachers and students can send in scholarships, competitions, clubs, or internships for other students to find. Every submission is reviewed by hand before it goes on the board — no fake or paid listings.":
    "Багш, сурагчид бусад сурагчдад зориулж тэтгэлэг, тэмцээн, клуб, дадлагын мэдээлэл илгээж болно. Самбарт орохоос өмнө бүх мэдээллийг гараар шалгадаг — хуурамч, төлбөртэй зар байхгүй.",
  "Your name": "Таны нэр",
  "I am a": "Би бол",
  Student: "Сурагч/Оюутан",
  Teacher: "Багш",
  Other: "Бусад",
  "Your email": "Таны имэйл",
  "Opportunity title": "Боломжийн нэр",
  "Link (if there is one)": "Холбоос (байгаа бол)",
  "Deadline (if known)": "Эцсийн хугацаа (мэдэгдэж байгаа бол)",
  "Short description": "Товч тайлбар",
  "Send this opportunity": "Илгээх",
  "This opens your email app with the details pre-filled — nothing is sent automatically.":
    "Энэ товч дарахад мэдээлэл бөглөгдсөн байдалтай имэйл апп нээгдэнэ — юу ч автоматаар илгээгдэхгүй.",
  "Fill in your name, the opportunity title, and a short description.":
    "Нэр, боломжийн нэр, товч тайлбараа бөглөнө үү.",
  "Enter a valid email address so we can follow up.":
    "Бид холбогдож чадахын тулд зөв имэйл хаяг оруулна уу.",
  "Opening your email app with everything filled in — just hit send and we'll review it.":
    "Бүх мэдээлэл бөглөгдсөн имэйл апп нээгдэж байна — илгээх товч дарахад бид шалгаад авна.",

  // Sign in page
  "Welcome back": "Тавтай морил",
  "Create your ScholarCompass account": "ScholarCompass бүртгэлээ үүсгээрэй",
  "Sign in to track saved opportunities and your IELTS practice scores.":
    "Хадгалсан боломжууд болон IELTS дадлагын дүнгээ хянахын тулд нэвтэрнэ үү.",
  "Create an account to save opportunities, track test scores, and earn points.":
    "Боломж хадгалах, шалгалтын дүнгээ хянах, оноо цуглуулахын тулд бүртгэл үүсгээрэй.",
  "Accounts aren't connected to a database yet, so this is a preview of the sign-in flow rather than a working login. Once accounts are live, this is exactly what you'll see.":
    "Бүртгэл одоохондоо мэдээллийн баазтай холбогдоогүй тул энэ бол ажиллагаатай нэвтрэлт биш, туршилтын харагдац юм. Бүртгэл идэвхжсэний дараа яг ийм л дэлгэц харагдана.",
  "Full name": "Бүтэн нэр",
  Email: "Имэйл",
  Password: "Нууц үг",
  "← Back to ScholarCompass": "← ScholarCompass руу буцах",

  // Opportunity detail page
  "Essential Information": "Гол мэдээлэл",
  "General Info": "Ерөнхий мэдээлэл",
  Category: "Ангилал",
  Duration: "Хугацаа",
  Cost: "Төлбөр",
  Participants: "Оролцогчид",
  "Who it's for": "Хэнд зориулагдсан",
  Organizer: "Зохион байгуулагч",



  // Footer
  "A student opportunity hub for scholarships, competitions, volunteering, internships, and test-prep guidance — built so the next opportunity is easier to find than the last one.":
    "Тэтгэлэг, тэмцээн, сайн дурын ажил, дадлага, шалгалтын бэлтгэлийн зөвлөмжид зориулсан сурагчдын боломжийн төв — дараагийн боломжоо өмнөхөөс хялбар олоорой гэсэн зорилготой.",

  // Read detail page
  "Originally published by": "Анх нийтэлсэн эх сурвалж",
  "All credit for this article belongs to": "Энэ нийтлэлийн бүх эрх дараах эх сурвалжид хамаарна:",
  "We're summarizing it here so it's easy to find alongside the rest of ScholarCompass — the full piece, in the authors' own words, is on their site.":
    "Бид үүнийг ScholarCompass дээрх бусад мэдээллийн хамт хялбар олдоог тул товчлон оруулсан — зохиогчийн бүрэн эх бичвэрийг тэдний сайтаас уншиж болно.",
  "Read the full article on": "Бүрэн эхийг эндээс уншина уу:",
  "This read is on our editorial list but hasn't been written up yet. Check back soon, or":
    "Энэ нийтлэл манай төлөвлөгөөнд байгаа боловч хараахан бичигдээгүй байна. Дараа дахин орж үзээрэй, эсвэл",
  "let us know": "бидэнд мэдэгдээрэй",
  "if you've got a great free resource for this topic.": "энэ сэдвээр сайн, үнэгүй эх сурвалж мэддэг бол.",
  "Back to Suggested Reads": "Санал болгох нийтлэлүүд рүү буцах",

  // IELTS test runner
  "Back to IELTS": "IELTS руу буцах",
  "By question type": "Асуултын төрлөөр",
  "By passage": "Хэсгээр",
  "Full answer review": "Бүх хариултын дэлгэрэнгүй",
  "No answer": "Хариулаагүй",
  "This test hasn't been built yet — check back soon.":
    "Энэ шалгалт хараахан бэлэн болоогүй байна — дараа дахин орж үзээрэй.",
  "3 passages, 40 questions, 60 minutes. The timer starts as soon as you click Start, and the test auto-submits when time runs out.":
    "3 хэсэг, 40 асуулт, 60 минут. Start дарангуут цаг тоологдож эхэлнэ, хугацаа дуусмагц шалгалт автоматаар илгээгдэнэ.",
  "60-minute countdown timer, always visible": "60 минутын тоолуур байнга харагдана",
  "Mix of True/False/Not Given, multiple choice, matching headings, and sentence completion":
    "True/False/Not Given, олон сонголттой, гарчиг тохируулах, өгүүлбэр гүйцээх зэрэг асуултын хослол",
  "Full band score and answer review immediately after submitting":
    "Илгээмэгц бүрэн band оноо болон хариултын дэлгэрэнгүй шинжилгээ гарна",
  "Your band score": "Таны band оноо",
  correct: "зөв",
};
