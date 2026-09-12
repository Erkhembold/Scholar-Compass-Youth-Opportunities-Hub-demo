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
  if (parts[0] === "reads" && parts[1]) {
    return { name: "read", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "signin") {
    return { name: "signin" };
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

export function readHref(id) {
  return `#/reads/${encodeURIComponent(id)}`;
}

export function signInHref() {
  return "#/signin";
}
