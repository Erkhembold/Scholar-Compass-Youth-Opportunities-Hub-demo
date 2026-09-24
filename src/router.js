import { useEffect, useState } from "react";

// Only hashes starting with "/" are treated as routes (e.g. "#/category/sat",
// "#/opportunity/some-id"). Plain in-page anchors like "#notify" or
// "#opportunities" are left alone so native browser scroll-to-id keeps working.
function parseHash(hash) {
  const clean = hash.replace(/^#/, "");
  if (!clean.startsWith("/")) return { name: "home" };

  const parts = clean.split("/").filter(Boolean);

  if (parts[0] === "category" && parts[1]) {
    return { name: "category", category: parts[1] };
  }
  if (parts[0] === "opportunity" && parts[1]) {
    return { name: "opportunity", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "ielts" && parts[1] === "test" && parts[2]) {
    return { name: "ielts-test", id: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "ielts" && parts[1] === "writing" && parts[2]) {
    return { name: "ielts-writing", id: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "reads" && parts[1]) {
    return { name: "read", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "signin") {
    return { name: "signin" };
  }
  if (parts[0] === "profile") {
    return { name: "profile" };
  }
  if (parts[0] === "ielts" && parts[1] === "1v1") {
    return { name: "ielts-1v1", id: parts[2] ? decodeURIComponent(parts[2]) : null };
  }
  if (parts[0] === "ielts" && parts[1] === "practice" && parts[2]) {
    return { name: "ielts-practice", skill: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "ielts" && parts[1] === "exercises" && parts[2]) {
    return { name: "ielts-exercises", skill: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "sat" && parts[1] === "practice" && parts[2]) {
    return { name: "sat-practice", categoryId: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "sat" && parts[1] === "lessons" && parts[2] === "beginner-guide") {
    return { name: "sat-lessons-beginner-guide" };
  }
  if (parts[0] === "ielts" && parts[1] === "lessons" && parts[2] === "beginner-guide") {
    return { name: "ielts-lessons-beginner-guide" };
  }
  if (parts[0] === "sat" && parts[1] === "lessons" && parts[2] === "reading" && parts[3] === "evidence-based-inference") {
    return { name: "sat-lessons-reading-evidence" };
  }
  if (parts[0] === "sat" && parts[1] === "lessons" && parts[2] === "writing" && parts[3] === "complete-sentences") {
    return { name: "sat-lessons-writing-sentences" };
  }
  if (parts[0] === "sat" && parts[1] === "lessons" && parts[2] === "writing" && parts[3] === "transitions") {
    return { name: "sat-lessons-writing-transitions" };
  }
  if (parts[0] === "leaderboard") {
    return { name: "leaderboard" };
  }
  return { name: "home" };
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash));
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return route;
}

export function categoryHref(category) {
  return `#/category/${category}`;
}

export function opportunityHref(id) {
  return `#/opportunity/${encodeURIComponent(id)}`;
}

export function ieltsTestHref(id) {
  return `#/ielts/test/${encodeURIComponent(id)}`;
}

export function writingTaskHref(id) {
  return `#/ielts/writing/${encodeURIComponent(id)}`;
}

export function readHref(id) {
  return `#/reads/${encodeURIComponent(id)}`;
}

export function signInHref() {
  return "#/signin";
}

export function profileHref() {
  return "#/profile";
}

export function ieltsChallengeHref(id) {
  return id ? `#/ielts/1v1/${encodeURIComponent(id)}` : "#/ielts/1v1";
}

export function ieltsPracticeHref(skill) {
  return `#/ielts/practice/${encodeURIComponent(skill)}`;
}

export function ieltsExercisesHref(skill) {
  return `#/ielts/exercises/${encodeURIComponent(skill)}`;
}

export function satPracticeHref(categoryId) {
  return `#/sat/practice/${encodeURIComponent(categoryId)}`;
}

export function leaderboardHref() {
  return "#/leaderboard";
}

export function satBeginnerGuideHref() {
  return "#/sat/lessons/beginner-guide";
}

export function ieltsBeginnerGuideHref() {
  return "#/ielts/lessons/beginner-guide";
}

export function satReadingEvidenceHref() {
  return "#/sat/lessons/reading/evidence-based-inference";
}

export function satWritingSentencesHref() {
  return "#/sat/lessons/writing/complete-sentences";
}

export function satWritingTransitionsHref() {
  return "#/sat/lessons/writing/transitions";
}
