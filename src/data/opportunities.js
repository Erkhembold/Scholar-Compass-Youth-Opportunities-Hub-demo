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
];
