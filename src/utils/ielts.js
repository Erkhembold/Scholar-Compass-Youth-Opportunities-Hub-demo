// Standard IELTS Academic Reading raw-score-to-band conversion table.
// Real IELTS calibrates this slightly per sitting; this is the widely
// published typical table, used here since there's no per-test official
// calibration available for mock content.
const BAND_TABLE = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 },
  { min: 0, band: 2 },
];

export function scoreToBand(raw) {
  for (const row of BAND_TABLE) {
    if (raw >= row.min) return row.band;
  }
  return 0;
}

function norm(value) {
  return String(value ?? "").trim().toLowerCase();
}

// Single source of truth for "is this answer correct", used both when
// scoring and when rendering the review list.
export function isCorrect(question, userValue) {
  if (userValue == null || userValue === "") return false;
  if (Array.isArray(question.answer)) {
    return question.answer.map(norm).includes(norm(userValue));
  }
  return norm(userValue) === norm(question.answer);
}

export function correctAnswerLabel(question) {
  return Array.isArray(question.answer) ? question.answer[0] : question.answer;
}

export const TYPE_LABELS = {
  tfng: "True / False / Not Given",
  mc: "Multiple Choice",
  completion: "Sentence Completion",
  matching: "Matching Headings",
};
