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
  if (parts[0] === "ielts" && parts[1] === "practice" && parts[2]) {
    return { name: "ielts-practice", skill: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "ielts" && parts[1] === "exercises" && parts[2]) {
    return { name: "ielts-exercises", skill: decodeURIComponent(parts[2]) };
  }
  if (parts[0] === "sat" && parts[1] === "practice" && parts[2]) {
    return { name: "sat-practice", categoryId: decodeURIComponent(parts[2]) };
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
