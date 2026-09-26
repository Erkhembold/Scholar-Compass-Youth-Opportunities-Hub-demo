// Real, current opportunities. Structured so this array can later be
// swapped for a live API response without touching any component code.
//
// Shape:
//   id, title, category, image, pattern (placeholder-art fallback style),
//   deadline: { date?, time?, label? }  — see src/utils/deadline.js
//   essential: { duration, cost, participants, whoFor, organizer }
//   description: string | { mn: string, en: string }
//   links: [{ label, href }]
//   contactNote?: string — shown when no link is available for a field

import unicefClubImg from "../assets/opportunities/unicef-club.png";
import tfmInternshipImg from "../assets/opportunities/tfm-internship.png";
import monichatImg from "../assets/opportunities/monichat-ambassador.png";
import cleanupDayImg from "../assets/opportunities/cleanup-day.png";
import esportsVolunteersImg from "../assets/opportunities/esports-volunteers.png";
import ssmOpenDayImg from "../assets/opportunities/ssm-open-day.png";
import soundMeditationImg from "../assets/opportunities/sound-meditation.png";
import japanStudyFairImg from "../assets/opportunities/japan-study-fair.png";
import nightMarathonImg from "../assets/opportunities/night-marathon-volunteers.png";
import lightlabHiringImg from "../assets/opportunities/lightlab-hiring.png";
import goodwavesImg from "../assets/opportunities/goodwaves-volunteers.png";
import microcreditZorigImg from "../assets/opportunities/microcredit-zorig-scholarship.png";
import manuulHackClubImg from "../assets/opportunities/manuul-hack-club.png";
import berkeleyClubImg from "../assets/opportunities/berkeley-club-autumn-intake.png";
import feltCityTourImg from "../assets/opportunities/felt-city-walking-tour.png";
import aoMockTrialImg from "../assets/opportunities/ao-mock-trial.png";
import recycleRallyImg from "../assets/opportunities/recycle-rally-2026.png";
import yscBookFairImg from "../assets/opportunities/ysc-book-fair.png";
import wingsOfHopeImg from "../assets/opportunities/wings-of-hope-volunteers.png";
import openParliamentImg from "../assets/opportunities/open-parliament-hackathon.png";
import wcsFieldAssistantImg from "../assets/opportunities/wcs-field-assistant.png";

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "scholarships", label: "Scholarships" },
  { id: "competitions", label: "Competitions" },
  { id: "volunteering", label: "Volunteering" },
  { id: "internships", label: "Internships" },
];

export const opportunities = [
  {
    id: "unicef-club-mongolia-2026",
    title:
      "UNICEF Club Mongolia хөтөлбөрийн 2026–2027 оны хичээлийн жилийн бүртгэл нээгдлээ!",
    category: "volunteering",
    image: unicefClubImg,
    pattern: "grid",
    deadline: { date: "2026-09-21" },
    essential: {
      duration: "Registration period: Sep 7–21, 2026",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Secondary school & university students",
      organizer: "UNICEF Club Mongolia",
    },
    description: {
      mn: `ЕБС-ийн сурагчид, их, дээд сургуулийн оюутан залуус та бүхнийг өөрсдийн сургууль дээрээ UNICEF Club байгуулж, хүүхдийн сайн сайхны төлөө хувь нэмрээ оруулахыг урьж байна.

Бүртгэлийн хугацаа: 2026 оны 9-р сарын 7 – 21
Дэлгэрэнгүй мэдээлэл: https://shorturl.at/cxMvU
Бүртгүүлэх холбоос: https://shorturl.at/dSDn3`,
      en: `Registration for the 2026–2027 UNICEF Club Mongolia is now open!

We invite students to start a UNICEF Club at their school or university to take action for child rights.

Registration period: September 7 – 21, 2026
Learn more: https://shorturl.at/cxMvU
Register: https://shorturl.at/dSDn3`,
    },
    links: [
      { label: "Register", href: "https://shorturl.at/dSDn3" },
      { label: "Learn more", href: "https://shorturl.at/cxMvU" },
    ],
  },
  {
    id: "tfm-full-time-intern-program",
    title: "Бүтэн цагийн дадлагажигч хөтөлбөр зарлагдлаа!",
    category: "internships",
    image: tfmInternshipImg,
    pattern: "stripe",
    deadline: { date: "2026-09-13", time: "23:59" },
    essential: {
      duration: "Not specified",
      cost: "Not specified",
      participants: "Not specified",
      whoFor: "Gap-year students",
      organizer: "Teach for Mongolia",
    },
    description: `Нийгэмд хувь нэмрээ оруулах хүсэлтэй завсар жил авч буй залуус та бүхнийг манай багийн нэг хэсэг болохыг урьж байна. ✨✨

Өргөдөл хүлээж авах эцсийн хугацаа: 2026 оны 9-р сарын 13, 23:59 цаг
Өргөдөл илгээх форм: https://forms.gle/ZgB3pfVgRPmNvR2G9`,
    links: [{ label: "Apply", href: "https://forms.gle/ZgB3pfVgRPmNvR2G9" }],
  },
  {
    id: "monichat-ambassador-2026",
    title: "MONICHAT ТЭТГЭЛЭГТЭЙ AMBASSADOR",
    category: "scholarships",
    image: monichatImg,
    pattern: "radial",
    deadline: { date: "2026-12-25" },
    essential: {
      duration: "Point collection through Dec 25, 2026",
      cost: "Free to join",
      participants: "40 spots",
      whoFor: "University students",
      organizer: "MoniChat & Mongolian Students' Association",
    },
    description: `Сургуульдаа MoniChat брэндийн дуу хоолой болж, CV-дээ үнэ цэнтэй туршлага нэмэнгээ тэтгэлэг авах боломж нээгдлээ!

Бид идэвхтэй, бүтээлч 4️⃣0️⃣ оюутныг сонгож тэтгэлэгт "Брэнд амбассадор"-оор шалгаруулна.

Ambassador болсноор:
🎓 Мөнгөн тэтгэлгийн эзэн болох
🖍 Контент бүтээх болон маркетингийн туршлагатай болох
📚 Сургалт, менторшипт хамрагдах
🤝 Арга хэмжээ, уулзалт, нетворкинг хөтөлбөрүүдэд оролцох

Хэрхэн оролцох вэ?
1. MoniChat апп-аа татах: https://onelink.to/dr8ng3
2. Аппликэйшнд бүртгэлээ үүсгэх
3. Оюутны мэдээллээ баталгаажуулах
4. "Тэтгэлэгт бүртгүүлэгч" хэсэгт хүсэлтээ илгээх: https://www.monichat.mn/scholarship2026

Оноо цуглуулах заавар:
● MoniChat апп суулгах = 1 оноо
● Найзаа урих = 1 оноо
● Брэндийн талаарх Reel контентын идэвхжил:
○ 1 Like = 1 оноо
○ 1 Comment = 2 оноо

Оролцогчдын урилга, reel, контентын чанар, идэвхжил болон цуглуулсан нийт оноог нэгтгэн дүгнэж, шилдэг 40 Амбассадорт тэтгэлэг олгоно.

⏰ Бүртгэлийн хугацаа: 2026 оны 12-р сарын 25 хүртэл`,
    links: [
      { label: "Apply for the scholarship", href: "https://www.monichat.mn/scholarship2026" },
      { label: "Download the MoniChat app", href: "https://onelink.to/dr8ng3" },
    ],
  },
  {
    id: "world-cleanup-day-mongolia-6",
    title: "World Cleanup Day in Mongolia – 6",
    category: "volunteering",
    image: cleanupDayImg,
    pattern: "diagonal",
    deadline: { label: "Rolling until event day" },
    essential: {
      duration: "Rolling until event day",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Open to all",
      organizer: "CleanUp Mongolia",
    },
    description: `A big thank you to everyone who is joining us in protecting our planet and supporting us in raising awareness about Cleanup Day 💚

Let's come together to make our city cleaner and our planet greener. 🌱

📍 Join the Cleanup Day event in Ulaanbaatar!
Register here: https://forms.gle/jR3FTh7FvWgjmMbP8

Every action counts. Let's clean up together! ♻️✨

#WorldCleanupDay #CleanupDay #Mongolia #Ulaanbaatar #CleanMongolia`,
    links: [{ label: "Register", href: "https://forms.gle/jR3FTh7FvWgjmMbP8" }],
  },
  {
    id: "mct-east-asia-ulaanbaatar-volunteers",
    title: "VOLUNTEERS WANTED — MCT East Asia Ulaanbaatar (eSports Network)",
    category: "volunteering",
    image: esportsVolunteersImg,
    pattern: "dots",
    deadline: { date: "2026-10-15" },
    essential: {
      duration: "Event volunteering — registration through Oct 15, 2026",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Youth interested in esports & event organizing",
      organizer: "eSports Network (ESN) — MCT East Asia Ulaanbaatar",
    },
    description: `И-спорт болон арга хэмжээ зохион байгуулалтад сонирхолтой хүүхэд, залуус анхаарлаа хандуулаарай 😎

ESN - eSports Network-оос албан ёсны эрхтэй зохион байгуулах гэж буй MCT East Asia Ulaanbaatar тэмцээний сайн дурын ажилтны бүртгэл нээгдлээ.

Ази тивийн шилдэгүүд Улаанбаатар хотноо ирэхэд уулзаж, улсаа төлөөлөх чухал ажлын нэгээхэн хэсэг болмоор байвал энэ боломжийг алдалгүй заавал бүртгүүлээрэй.

👇 Volunteer-д бүртгүүлэх линк BIO дээр байгаа.

Бүртгэл 2026.10.15 хүртэл үргэлжлэнэ.

Тэмцээний нэг хэсэг болж, танилын хүрээгээ тэлж, сайхан дурсамж бүтээгээрэй ✌🏼`,
    links: [],
    contactNote:
      "No direct registration link was shared for this one — the organizer says to use the link in their Instagram bio.",
  },
  {
    id: "ssm-mongolia-open-day-2026",
    title: "🎓 Swiss School of Management Mongolia — OPEN DAY 2026",
    category: "events",
    image: ssmOpenDayImg,
    pattern: "diagonal",
    deadline: { label: "Event day — Sep 12, 2026" },
    essential: {
      duration: "One day, 11:00–16:00",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Prospective BBA / MBA / DBA students",
      organizer: "Swiss School of Management (SSM) Mongolia, in partnership with Tetgeleg",
    },
    description: `Швейцарын боловсролыг Монголдоо эзэмших боломж! 🇨🇭🇲🇳

35 жилийн түүхтэй Swiss School of Management (SSM)-ийн Монгол дахь салбарын Нээлттэй өдөрлөгт урьж байна.

Өдөрлөгөөр:
🎓 BBA | MBA | DBA хөтөлбөрүүд
💰 Элсэлт, сургалтын төлбөр, тэтгэлгийн мэдээлэл
🌍 Европ болон олон улсын кампусуудад суралцах боломж
🚀 Мэргэжил, карьерын зөвлөгөө авах боломжтой.

📅 9-р сарын 12 | 11:00–16:00
📍 Люкс Центр, 3-р давхар
🔗 Бүртгүүлэх: https://forms.cloud.microsoft/r/sDbC6jSMR8

Өөрийн олон улсын боловсролын боломжоо судлахыг хүсвэл хүрэлцэн ирээрэй! ✨`,
    links: [{ label: "Register", href: "https://forms.cloud.microsoft/r/sDbC6jSMR8" }],
  },
  {
    id: "sound-meditation-gallery-volunteers",
    title: "Sound Meditation Mongolia & Sanctuary Gallery — Volunteer Team",
    category: "volunteering",
    image: soundMeditationImg,
    pattern: "radial",
    deadline: { label: "Rolling / not specified" },
    essential: {
      duration: "Rolling / not specified",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Students interested in art, events, and creative spaces",
      organizer: "Sound Meditation Mongolia & Sanctuary Gallery",
    },
    description: `Sound Meditation Mongolia & Sanctuary Gallery нь Media Art Exhibition болон Sound Meditation-ний арга хэмжээ, үйл ажиллагаанд хамтран ажиллах Volunteer багийн гишүүдийг хайж байна.

Хэрэв та:
• Урлаг, бүтээлч орчинд дуртай
• Хүмүүстэй зөв боловсон харилцах чадвартай
• Event зохион байгуулалт сонирхдог
• Шинэ зүйл сурах, туршлага хуримтлуулах
хүсэлтэй бол Volunteer багт нэгдээрэй. 🤍

Бидний зохион байгуулж буй Sound Meditation арга хэмжээ, үзэсгэлэн болон бусад бүтээлч үйл ажиллагаанд оролцож, туршлага хуримтлуулахын зэрэгцээ оролцооны урамшуулал авах боломжтой.

Таны хийх зүйлс:
• Зочид угтах, мэдээлэл өгөх
• Бүртгэл хийх
• Event-ийн зохион байгуулалтад туслах
• Gallery орчны бэлтгэлд дэмжлэг үзүүлэх
• Маркетингийн үйл ажиллагаанд дэмжлэг үзүүлэх

🌀🌀🌀 CV-гээ манай багт илгээнэ үү.`,
    links: [{ label: "Email: soundmeditationmongolia@gmail.com", href: "mailto:soundmeditationmongolia@gmail.com" }],
  },
  {
    id: "study-in-japan-fair-2026",
    title: "Японд суралцах тухай мэдээллийн яармаг-2026 (Study in Japan Information Fair 2026)",
    category: "events",
    image: japanStudyFairImg,
    pattern: "grid",
    deadline: { label: "Event days — Oct 3–4, 2026" },
    essential: {
      duration: "Two days, 11:00–17:00",
      cost: "Free — no pre-registration required",
      participants: "Not specified",
      whoFor: "Students interested in studying in Japan",
      organizer: "Mongolia-Japan Center, with the Japanese Embassy & JASSO",
    },
    description: `ТА ЯПОНД СУРАЛЦАХЫГ ХҮСЭЖ БАЙНА УУ? 🎓
Тэгвэл энэ намар таны заавал оролцох арга хэмжээний нэг бол "Японд суралцах тухай мэдээллийн яармаг-2026" юм! ✈️

✨2026 оны 10-р сарын 3,4-ний өдрүүдэд тус төв нь 17 дахь удаагийн "Японд суралцах тухай мэдээллийн яармаг-2026"-г танхимаар зохион байгуулах гэж байна✨

Тус мэдээллийн яармагийн үеэр Японы улсын болоод хувийн их дээд сургуулиудын төлөөлөгчид оролцон, сургуулийнхаа танилцуулгыг хийх бөгөөд та өөрийн сонирхсон сургуулийн танилцуулгыг сонсож, ганцаарчилсан зөвлөгөө авах боломжтой.

Мөн бид дараах үйл ажиллагааг Япон улсад суралцахаар төлөвлөж буй та бүхэнд хүргэх болно.
📌Тэтгэлэг олгодог албан ёсны байгууллагуудаас тэтгэлгийн талаарх үнэн зөв мэдээлэл авах.
📌Японд сурсан төгсөгчдөөс Япон улсад хэрхэн суралцах, амьдрах талаарх бодит туршлагыг сонсох.
📌Япон улсад хувийн зардлаар суралцах шалгалт (EJU) -ын хими, физикт хэрхэн бэлдэх вэ үйл ажиллагаа зэрэг Японд суралцахтай холбоотой цогц мэдээллийг авах боломжтой.

🎓 ОРОЛЦОГЧ СУРГУУЛИУД
1. Каназава их сургууль
2. Кэйо их сургууль
3. Китами инженер, технологийн их сургууль
4. Киото Тачибана их сургууль
5. Кюүшү Сангёо их сургууль
6. Нийгата мужийн их сургууль
7. Токио олон улсын их сургууль
8. Такэо Ази их сургууль
9. Хёого мужийн их сургууль
10. Риккёо их сургууль
11. Яманаши Гакүин их сургууль

📚 МАТЕРИАЛААР ОРОЛЦОХ СУРГУУЛИУД
12. Киото дэвшилтэт шинжлэх ухааны их сургууль
13. Ямагата их сургууль

🏢 ОРОЛЦОГЧ БАЙГУУЛЛАГУУД
1. Япон улсын Элчин сайдын яам
2. Японы оюутныг дэмжих байгууллага (JASSO)

📅 2026 оны 10-р сарын 3,4-ний өдрүүдэд
🏠 Монгол-Японы төвийн байранд
⏰ 11:00–17:00 цаг
🎟️ ҮНЭ ТӨЛБӨРГҮЙ
🙅🏻‍♀️ Урьдчилан бүртгүүлэх шаардлагагүй

✨Японд суралцах мөрөөдлөө биелүүлэхэд хэрэгтэй бүх мэдээллээ нэг дороос аваарай!

📞 Дэлгэрэнгүй мэдээллийг Монгол-Японы төвийн 7511-0879 (Ext-1), 8065-0879 утсаар холбогдон авах боломжтой.`,
    links: [
      { label: "Facebook event page", href: "https://www.facebook.com/events/1600404958459625" },
    ],
  },
  {
    id: "night-marathon-2026-volunteers",
    title: "Night Marathon 2026 — сайн дурын ажилтны бүртгэл",
    category: "volunteering",
    image: nightMarathonImg,
    pattern: "grid",
    deadline: { label: "Event day — Sep 26, 2026" },
    essential: {
      duration: "One event day, Sep 26, 2026",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Volunteers aged 18+",
      organizer: "Night Marathon 2026, Ulaanbaatar",
    },
    description: `"Night Marathon 2026" сайн дурын ажилтны бүртгэл эхэллээ ✨

Хотын шөнийн хамгийн онцгой арга хэмжээний нэг хэсэг болж, мянга мянган гүйгчийн урам зориг, эрч хүчийг мэдэрч, мартагдашгүй туршлагыг хамтдаа бүтээхийг хүсэж байна уу? Тэгвэл "Night Marathon 2026" арга хэмжээнд сайн дурын ажилтнаар нэгдээрэй. 🏃‍♀️🏃‍♂️

Та арга хэмжээний өдөр бидэнтэй ажиллаж, UB Night Marathon-ийг амжилттай зохион байгуулахад өөрийн хувь нэмрээ оруулах боломжтой.

🤝 Шинэ хүмүүстэй танилцана
✨ Томоохон эвент зохион байгуулалтыг амжилттай бүтээх чухал багийн нэг хэсэг болно
💪 Багаар ажиллаж, харилцааны ур чадвараа хөгжүүлнэ
🌙 Хотын шөнийн хамгийн онцгой мөчүүдийн нэгийг хамтдаа бүтээнэ

Бүртгэлээ илгээсний дараа манай баг тантай холбогдож, ажлын чиг үүрэг, дэлгэрэнгүй мэдээлэл болон шаардлагатай сургалтыг танилцуулна.

📌 Санамж: Сайн дурын ажилтнаар бүртгүүлэх оролцогч 18 нас хүрсэн байх шаардлагатай.

📅 2026.09.26
📍 Сүхбаатарын талбай

Run the City. Light the Night. 🌙`,
    links: [{ label: "Register", href: "https://www.nightmarathon.mn/volunteer" }],
  },
  {
    id: "lightlab-sales-social-assistant",
    title: "LightLab-д борлуулалт & сошиал медиа туслах ажилтан авна",
    category: "internships",
    image: lightlabHiringImg,
    pattern: "dots",
    deadline: { label: "Rolling — apply anytime" },
    essential: {
      duration: "3–4 weekdays 12:00–19:00, plus 1–2 weekend days 10:00–19:00",
      cost: "Not specified",
      participants: "Not specified",
      whoFor: "Students with a flexible schedule, or gap-year students",
      organizer: "LightLab",
    },
    description: `LightLab-д маань өдөр тутмын борлуулалт болон сошиал медиа хариуцаж ажиллах идэвхтэй, хариуцлагатай, сошиалд сонирхолтой хүн хайж байна. 💡✨

👀 Бид хэнийг хайж байна вэ?
🎓 Хичээлийн хуваарь уян хатан оюутан
🌱 Эсвэл gap year авч байгаа хүн
📱 Instagram, Facebook болон сошиал медиа маркетингт сонирхолтой /өмнө нь ажиллаж байсан эсвэл маркетингаар сурдаг бол давуу тал/
💬 Хүмүүстэй зөв боловсон, найрсаг харилцаж чаддаг
🧠 Хариуцлагатай, эмх цэгцтэй, бие даан ажиллах чадвартай
🎨 Interior design, home decoration мөн decor гэрлүүдэд сонирхолтой
🚗 Жолооны үнэмлэхтэй, өөрийн машинтай бол том давуу тал
💻 Instagram/Facebook дээр ажиллаж байсан туршлагатай бол давуу тал

⏰ Ажлын цаг:
Ажлын 3-4 өдөр 12:00 – 19:00
Мөн амралтын 1-2 өдөр 10:00-19:00
Оюутан болон gap year-тэй байгаа хүмүүст тохиромжтой уян хатан цагийн хуваарь

CV-гээ илгээнэ үү ☺️💡`,
    links: [
      { label: "Email: narniigereltord@gmail.com", href: "mailto:narniigereltord@gmail.com" },
    ],
    contactNote: "You can also call LightLab directly at 88886759.",
  },
  {
    id: "goodwaves-ngo-volunteers-2026",
    title: "GoodWaves NGO — шинэ элсэлт",
    category: "volunteering",
    image: goodwavesImg,
    pattern: "radial",
    deadline: { label: "Enrollment: Sep 1 – Oct 1, 2026" },
    essential: {
      duration: "Enrollment window Sep 1 – Oct 1, 2026",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Youth who want to be part of a change, not just a one-off volunteer",
      organizer: "GoodWaves NGO",
    },
    description: `🌊 Чи зүгээр нэг volunteer биш, өөрчлөлтийн нэг хэсэг болохыг хүсэж байна уу? GoodWaves-ийн шинэ элсэлт явагдаж байна.

Сайн дурын ажил гэдэг зөвхөн бусдад туслах тухай биш. Энэ бол өөрийгөө хөгжүүлэх, шинэ зүйл сурах, шинэ хүмүүстэй танилцах, өөрийн санаагаа бодит ажил болгох боломж юм. 🤝

Тэгвэл чи volunteer болсноор юу авч болох вэ?

Хэрвээ чи:
🌱 Нийгэмдээ эерэг өөрчлөлт хийхийг хүсдэг
💡 Шинэ зүйл туршиж үзэх дуртай
🤝 Шинэ хүмүүстэй хамтран ажиллахыг хүсдэг
🔥 Өөрийгөө хөгжүүлэхийг хүсдэг бол

GoodWaves чамайг хүлээж байна. 🌊

📅 Элсэлт: 09.01 – 10.01

Жижиг үйлдэл. Том нөлөө.
Чиний давалгаа хаанаас эхлэх вэ? 🌊`,
    links: [],
    contactNote:
      "No direct enrollment link was shared for this one — check the GoodWaves NGO Instagram for the sign-up link.",
  },
  {
    id: "microcredit-zorig-scholarship-2026",
    title: "Микро Кредит ББСБ × Зориг сангийн тэтгэлэгт хөтөлбөр 2026",
    category: "scholarships",
    image: microcreditZorigImg,
    pattern: "stripe",
    deadline: { date: "2026-09-27", time: "23:59" },
    essential: {
      duration: "Application closes Sep 27, 2026, 23:59",
      cost: "Free to apply",
      participants: "Not specified",
      whoFor:
        "University students (year 2+) in health/medicine fields in Ulaanbaatar, cumulative GPA 3.2+",
      organizer: "Microcredit NBFI & Zorig Foundation",
    },
    description: `🎓 Микро Кредит ББСБ × Зориг сангийн ТЭТГЭЛЭГТ ХӨТӨЛБӨР 2026 зарлагдлаа.

Эрүүл мэндийн салбарын ирээдүйн боловсон хүчнийг дэмжих зорилгоор Микро Кредит ББСБ болон Зориг сан хамтран тэтгэлэгт хөтөлбөр хэрэгжүүлдэг билээ.

📌 Хэн хамрагдах вэ?
Улаанбаатар хотод байрлах эрүүл мэнд, анагаах ухааны чиглэлээр мэргэжилтэн бэлтгэдэг их, дээд сургуулийн 2 болон түүнээс дээш дамжаанд суралцаж буй, нийт суралцсан хугацааны голч дүн 3.2 ба түүнээс дээш оюутнууд хамрагдах боломжтой.

🌱 Тэтгэлэгт хөтөлбөрт хамрагдсанаар:
• Сургалтын төлбөрийн тэтгэлэг авах
• Эрүүл мэнд, нийгмийн салбарт эерэг өөрчлөлт авчрах хүсэл эрмэлзэлтэй залуусын хүрээлэлд нэгдэх боломжтой.

📝 Өргөдөл хүлээн авах эцсийн хугацаа:
2026 оны 9 дүгээр сарын 27-ны 23:59 цаг

📲 Өргөдлийн маягтыг цахимаар бөглөнө.`,
    links: [
      {
        label: "Apply",
        href: "https://form.jotform.com/zorigfoundation/microcredit2026",
      },
    ],
    contactNote: "More information: 11-315444.",
  },
  {
    id: "manuul-hack-club-2026",
    title: "Manuul Hack Club — Weekly Coding Meetups",
    category: "events",
    image: manuulHackClubImg,
    pattern: "dots",
    deadline: { label: "Ongoing — Mondays & Wednesdays, 16:30–18:30" },
    essential: {
      duration: "Recurring, Mon & Wed, 16:30–18:30",
      cost: "Free",
      participants: "Not specified",
      whoFor: "High school students in Ulaanbaatar",
      organizer: "Manuul Hack Club (Hack Club global network)",
    },
    description: {
      mn: `Hack Club бол дэлхийн 100 гаруй орны 140,000 гаруй өсвөр насны залуусыг холбосон олон улсын ашгийн бус нийгэмлэг юм. Бид сурагчдад зориулсан орчныг бүрдүүлж, өөрсдийн санаагаа бодит төсөл болгон хөгжүүлэхэд тусалдаг. Manuul Hack Club нь энэхүү дэлхийн сүлжээний албан ёсны салбар бөгөөд долоо хоног бүр цуглаж хамтдаа суралцаж, код бичиж байна.

📌 Хэзээ: Даваа, Лхагва гараг бүр | 16:30 – 18:30
📍 Хаана: American Corner Ulaanbaatar
🔗 Бүртгүүлэх: Профиль дээрх линкээр нэвтрээрэй.`,
      en: `Hack Club is a global non-profit community of over 140,000 teenagers across 100+ countries who code and build projects together. It gives high schoolers total freedom to build real apps, hardware, and websites with direct backing from major tech organizations. Manuul Hack Club is the local chapter right here in Ulaanbaatar.

📌 When: Mondays & Wednesdays | 16:30 – 18:30
📍 Where: American Corner Ulaanbaatar
🔗 Register: Link in bio.`,
    },
    links: [],
    contactNote: "Registration link is in the Manuul Hack Club Instagram bio.",
  },
  {
    id: "berkeley-club-autumn-intake-2026",
    title: "Berkeley Club Autumn Admissions — 7 Days Left",
    category: "competitions",
    image: berkeleyClubImg,
    pattern: "diagonal",
    deadline: { date: "2026-09-20" },
    essential: {
      duration: "Applications close Sep 20, 2026",
      cost: "Not specified",
      participants: "Not specified",
      whoFor: "University students (National University of Mongolia)",
      organizer: "Berkeley Club (МУИС)",
    },
    description: `Шинэ хичээлийн жилээ өөртөө шинэ боломж нээж эхлүүлээрэй✨🌅
• Илтгэх урлаг
• Парламентын болон шүүхийн мэтгэлцээн
• Академик сургалт
• Халуун дулаан хамт олон
• Өөрийгөө хөгжүүлэх олон боломж

Өөрийгөө сорьж, илтгэх урлаг, мэтгэлцээнээр ур чадвараа хөгжүүлэхийг хүсэж байвал яг одоо бүртгүүлээрэй📝

📌 Бүртгэл: 2026.09.20 хүртэл
🔗 Online бүртгэлийн LINK IN BIO
🔗 МУИС-ийн 2 байрны хоёр давхарт элсэлт явагдаж байна.`,
    links: [],
    contactNote:
      "In-person registration is open at MUIS Building 2, 2nd floor. Online registration link is in the Berkeley Club Instagram bio.",
  },
  {
    id: "felt-city-walking-tour-2026-09-20",
    title: "\"Felt City\" Walking Tour",
    category: "events",
    image: feltCityTourImg,
    pattern: "stripe",
    deadline: { date: "2026-09-20", time: "11:00" },
    essential: {
      duration: "2–3 hours",
      cost: "50,000₮ per person",
      participants: "Not specified",
      whoFor: "General public",
      organizer: "\"Гэр өргөө\" ТББ (NGO) — curators A. Darisuren, S. Uurtsaikh",
    },
    description: `"Гэр өргөө" ТББ судалгааны төслийн хүрээнд судлаач, фото зурагчдын хамтаар Германы Мюнхен хотод болсон олон улсын архитектурын үзэсгэлэнд Зөвлөлтийн үед бэлэглэсэн орон сууцны хороолол, бүтээн байгуулалтыг тэнд амьдарч буй гурван үеийн өнцгөөс судалсан юм. Үзэсгэлэнгийн сэдвээр "The Gift: Spaces of Global Socialism and Their Afterlives" ном хэвлэгдсэн.

Улаанбаатар хотод бэлэглэсэн, олон улсын тусламжаар барьсан ямар барилга, байгууламжийг Та мэдэх вэ? "Тусламж", "бэлэг" гэдэг үгсийн цаана ямар утга агуулагддаг талаар Та юу гэж боддог вэ? Нийгэм, эдийн засгийн хөгжлийн явцад бэлэг, тусламжийг үе, үеийнхэн хэрхэн ойлгож, тайлбарладаг вэ?

Куратор: А. Дарьсүрэн, С. Үүрцайх
Цуглах цэг: Барилгачдын талбай
Огноо: 9-р сарын 20-ны Ням гараг
Эхлэх цаг: 11 цаг
Хугацаа: 2-3 цаг
Тайлбар: Монгол хэл дээр
Нэг хүний төлбөр: 50'000`,
    links: [],
    contactNote: "Meeting point: Барилгачдын талбай. Registration form is in the organizer's Instagram bio.",
  },
  {
    id: "ao-mock-trial-volunteers",
    title: "AO Mock Trial — сайн дурын ажилтны бүртгэл",
    category: "volunteering",
    image: aoMockTrialImg,
    pattern: "stripe",
    deadline: { label: "Rolling — register via the form" },
    essential: {
      duration: "Not specified",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Students interested in law and court procedure",
      organizer: "AO Academy",
    },
    description: `AO MOCK TRIAL — Сайн дурын ажилтнаар бүртгүүлээрэй!

Хууль, шүүх процесстой ойрхон ажиллах сонирхолтой юу? AO Mock Trial-ийн зохион байгуулалтад нэгдэж, туршлага хуримтлуулаарай.`,
    links: [
      {
        label: "Register",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSeqR38oS6CYaGv3PcnmzcmvDbUh8m4Iw8TSth0CH4N449F3Rw/viewform",
      },
    ],
  },
  {
    id: "recycle-rally-2026",
    title: "Recycle Rally 2026 — хуванцар цуглуулах аян",
    category: "competitions",
    image: recycleRallyImg,
    pattern: "grid",
    deadline: { date: "2026-12-04" },
    essential: {
      duration: "Sep 7 – Dec 4, 2026",
      cost: "Free",
      participants: "School teams",
      whoFor: "All public and private schools in Ulaanbaatar",
      organizer: "Mongolia Without Waste, CFLI/FCIL, TML Plastic, Save",
    },
    description: `📢 RECYCLE RALLY 2026 is here!

UB schools — collect PET-1 plastic bottles and compete for cash prizes + recycling bins 🏆

📅 Sep 7 – Dec 4, 2026
🌱 Open to all public & private schools in Ulaanbaatar

Нийслэлийн ЕБС-уудыг хуванцар цуглуулах аянд нэгдэхийг урьж байна. ЕБС-ийн сурагчдад байгаль орчныг хамгаалах, хог хаягдлыг эх үүсвэр дээр нь ангилах дадал хэвшүүлэх, хуванцар хог хаягдлын хор хөнөөл болон дахин боловсруулах боломжийн талаар мэдлэг олгох зорилготой аян.

🏆 I байр: Сертификат, 2,500,000 төгрөгийн үнийн бүхий шагнал, 850,000 төгрөгийн үнийн бүхий хуванцар ангилах сав.

From Waste to Wonder ♻️`,
    links: [{ label: "Full guidelines", href: "https://shorturl.at/6HwAL" }],
  },
  {
    id: "ysc-book-fair-2026-volunteers",
    title: "YSC × Номын баяр 2026 — сайн дурын ажилтны бүртгэл",
    category: "volunteering",
    image: yscBookFairImg,
    pattern: "radial",
    deadline: { label: "Event days: Sep 18–20, 2026" },
    essential: {
      duration: "Sep 18, 19, 20 — 10:00–18:00 (full day or shift)",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Punctual youth with good communication skills; prior YSC/YP experience an advantage",
      organizer: "Mongol Ecology Center, Youth Sustainability Corps",
    },
    description: `📖 YSCхНомын баяр 2026 📖

40 дэхь удаагийн номын баярын арга хэмжээнд Монгол Экологи Төвийн асар дээр хөтөлбөрүүдийг танилцуулах, мэдээлэл өгөх, судалгаа авах зэрэг ажилд оролцох сайн дурын залуусыг бүртгэж байна.

Хэнийг сонгох вэ?
✅ 9-р сарын 18, 19, 20-ны өдрүүдэд өглөө 10:00-18:00 цаг хүртэл бүтэн эсвэл цагаа тохироод ээлжлээд гарах боломжтой
✅ Цаг сайн баримталдаг, харилцааны соёлтой
✅ YSC хөтөлбөрт оролцож байсан болон YP-ийн ЗБ эсвэл сайн дурын ажилтнаар оролцож байсан бол давуу талтай

🎁 Шалгараад амжилттай ажилласан оролцогчдод YSC оноо болон мерч өгөх болно.`,
    links: [],
    contactNote: "Registration link is in the Mongol Ecology Center Instagram bio (@mongolecologycenter).",
  },
  {
    id: "wings-of-hope-online-volunteers",
    title: "Итгэлийн Далавч ТББ — онлайн сайн дурын баг",
    category: "volunteering",
    image: wingsOfHopeImg,
    pattern: "diagonal",
    deadline: { date: "2026-10-01" },
    essential: {
      duration: "Fully online, ongoing",
      cost: "Free",
      participants: "Not specified",
      whoFor: "Youth aged 15+",
      organizer: "Итгэлийн Далавч ТББ (Wings of Hope NGO)",
    },
    description: `Итгэлийн Далавч ТББ-ын сайн дурын багт урьж байна!

Та өөрийн амьдарч буй хороо, дүүрэг, аймаг, сумандаа хүүхдийн эрх хэрхэн зөрчигдөж, боловсролын салбарт ямар тэгш бус байдал үүсэж байгааг анзаардаг уу?

"Итгэлийн Далавч" ТББ нь 15 болон түүнээс дээш насны залуусыг онлайн сайн дурын багийн бүрэлдэхүүндээ урьж байна.

Бид хамтдаа юу хийх вэ?
• Асуудлыг тодорхойлж, дуу хоолой нь болох
• Бодит шийдэл боловсруулах
• Шийдвэр гаргагчдад нөлөөлөх

Танд ямар боломжууд нээгдэх вэ?
🌐 Бүрэн онлайн
🏛️ Хүсэлт хүргүүлэх туршлага
📜 Сертификат
🤝 Байгууллагын гишүүнчлэл`,
    links: [{ label: "Register", href: "https://forms.gle/zWrEgEwG2DJPmcgX7" }],
    contactNote: "Contact: itgeliindalavch@gmail.com",
  },
  {
    id: "open-parliament-hackathon-2026",
    title: "Open Parliament Hackathon — бүртгэл",
    category: "competitions",
    image: openParliamentImg,
    pattern: "grid",
    deadline: { date: "2026-09-24", time: "12:00" },
    essential: {
      duration: "24-hour hackathon",
      cost: "Free",
      participants: "Teams of 3 (must include one developer)",
      whoFor: "Youth interested in civic tech and AI",
      organizer: "Монгол Улсын Их Хурлын Тамгын газар, The Asia Foundation, Unread Media",
    },
    description: `"Open Parliament Hackathon" бүртгэл эхэллээ! 🚀

Парламентын үйл ажиллагааг иргэдэд илүү нээлттэй, ойлгомжтой, хүртээмжтэй болгох технологийн шийдэл танд байна уу?

Оролцогчид парламентын үйл ажиллагаатай холбоотой бодит асуудлууд дээр ажиллаж, технологи болон хиймэл оюуны боломжийг ашигласан шийдлийг 24 цагийн дотор хөгжүүлнэ.

Баг бүр 3 гишүүнтэй байх бөгөөд нэг гишүүн нь заавал хөгжүүлэгч байх ёстой. Бүртгүүлсэн багуудаас 10 багийг эцсийн шатанд сонгон шалгаруулна.

Санаагаа бодит шийдэл болгоорой.`,
    links: [
      {
        label: "Register",
        href: "https://docs.google.com/forms/d/e/1FAIpQLSdEwQmTIrDjO-s-A7kpsg_0gZlyoc8S4tpVGsrYTk9E3cG4bw/viewform",
      },
    ],
  },
  {
    id: "wcs-mongolia-field-assistant",
    title: "WCS Монгол — Хээрийн судалгаанд туслах ажилтан",
    category: "internships",
    image: wcsFieldAssistantImg,
    pattern: "radial",
    deadline: { date: "2026-09-25", time: "17:00" },
    essential: {
      duration: "2026.10.01 – 2026.10.11",
      cost: "Not specified",
      participants: "1",
      whoFor: "Students/graduates in biology, ecology, or conservation, able to work in field conditions",
      organizer: "Wildlife Conservation Society (WCS) Mongolia",
    },
    description: `📢 НЭЭЛТТЭЙ АЖЛЫН БАЙР: Хээрийн судалгаанд оролцох туслах ажилтан 🐾

WCS Монгол Өмнөговь аймагт цоохор ирвэсийн судалгааны ажилд туслах оюутан эсвэл төгсөгчийг урьж байна!

📍 Байршил: Өмнөговь аймаг (Номгон, Баян-Овоо сум)
🗓 Ажиллах хугацаа: 2026.10.01 – 2026.10.11

📋 Гүйцэтгэх үүрэг: Автомат камерын шалгалт, батарей/SD карт солих, мэдээлэл хуулах болон хээрийн тэмдэглэл хөтлөх

🎯 Тавигдах шаардлага: Биологи, экологи, байгаль хамгааллын чиглэлээр суралцдаг/төгссөн, хээрийн нөхцөлд ажиллах боломжтой

Өөрийн туршлага, CV-гээ "Цоохор ирвэс-Хээрийн туслах ажилтан - Овог нэр" гэсэн гарчигтайгаар илгээнэ үү.`,
    links: [
      { label: "Email application", href: "mailto:procurementmongolia@wcs.org" },
    ],
    contactNote: "Phone: 323719 · mongolia.wcs.org",
  },
];
