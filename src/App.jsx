import { lazy, Suspense, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import OpportunityDetailPage from "./pages/OpportunityDetailPage.jsx";
import IeltsTestPage from "./pages/IeltsTestPage.jsx";
import WritingTaskPage from "./pages/WritingTaskPage.jsx";
import ReadDetailPage from "./pages/ReadDetailPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PublicProfilePage from "./pages/PublicProfilePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import ArchivePage from "./pages/ArchivePage.jsx";
import IeltsPracticePage from "./pages/IeltsPracticePage.jsx";
import IeltsExercisesPage from "./pages/IeltsExercisesPage.jsx";
import IeltsChallengePage from "./pages/IeltsChallengePage.jsx";
import SatPracticePage from "./pages/SatPracticePage.jsx";
import SatChallengePage from "./pages/SatChallengePage.jsx";
import SatBeginnerGuidePage from "./pages/SatBeginnerGuidePage.jsx";
import IeltsBeginnerGuidePage from "./pages/IeltsBeginnerGuidePage.jsx";
import SatReadingLesson01Page from "./pages/SatReadingLesson01Page.jsx";
import SatWritingLesson01Page from "./pages/SatWritingLesson01Page.jsx";
import SatWritingLesson02Page from "./pages/SatWritingLesson02Page.jsx";
import { useRoute } from "./router.js";

// Loaded on demand: these pull in KaTeX (math rendering), which the rest of the
// site doesn't need, so it stays out of the main bundle.
const SatMathExercisesPage = lazy(() => import("./pages/SatMathExercisesPage.jsx"));
const SatMathChallengePage = lazy(() => import("./pages/SatMathChallengePage.jsx"));

export default function App() {
  const route = useRoute();

  // Scroll to top on every route change, except when the URL still carries
  // an in-page anchor (e.g. "#notify") meant for the homepage — that case
  // is handled by the effect below instead.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const isInPageAnchor = hash && !hash.startsWith("/");
    if (!isInPageAnchor) {
      window.scrollTo({ top: 0 });
    }
  }, [route.name, route.category, route.id]);

  // Plain anchors like "#notify" or "#opportunities" aren't routes (see
  // router.js), so when they fire while a different page is mounted, scroll
  // to the target manually once the homepage has re-rendered.
  useEffect(() => {
    if (route.name !== "home") return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || hash.startsWith("/")) return;
    const el = document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [route]);

  let page;
  if (route.name === "category") {
    page = <CategoryPage category={route.category} />;
  } else if (route.name === "opportunity") {
    page = <OpportunityDetailPage id={route.id} />;
  } else if (route.name === "ielts-test") {
    page = <IeltsTestPage id={route.id} />;
  } else if (route.name === "ielts-writing") {
    page = <WritingTaskPage id={route.id} />;
  } else if (route.name === "read") {
    page = <ReadDetailPage id={route.id} />;
  } else if (route.name === "archive") {
    page = <ArchivePage />;
  } else if (route.name === "signin") {
    page = <SignInPage />;
  } else if (route.name === "profile") {
    page = <ProfilePage />;
  } else if (route.name === "ielts-practice") {
    page = <IeltsPracticePage skill={route.skill} />;
  } else if (route.name === "ielts-exercises") {
    page = <IeltsExercisesPage skill={route.skill} />;
  } else if (route.name === "ielts-challenge") {
    page = <IeltsChallengePage matchId={route.matchId} />;
  } else if (route.name === "sat-practice") {
    page = <SatPracticePage categoryId={route.categoryId} />;
  } else if (route.name === "sat-challenge") {
    page = <SatChallengePage matchId={route.matchId} />;
  } else if (route.name === "sat-math-exercises") {
    page = <SatMathExercisesPage initialDomain={route.domain} />;
  } else if (route.name === "sat-math-challenge") {
    page = <SatMathChallengePage matchId={route.matchId} />;
  } else if (route.name === "sat-lessons-beginner-guide") {
    page = <SatBeginnerGuidePage />;
  } else if (route.name === "ielts-lessons-beginner-guide") {
    page = <IeltsBeginnerGuidePage />;
  } else if (route.name === "sat-lessons-reading-evidence") {
    page = <SatReadingLesson01Page />;
  } else if (route.name === "sat-lessons-writing-sentences") {
    page = <SatWritingLesson01Page />;
  } else if (route.name === "sat-lessons-writing-transitions") {
    page = <SatWritingLesson02Page />;
  } else if (route.name === "leaderboard") {
    page = <LeaderboardPage />;
  } else if (route.name === "public-profile") {
    page = <PublicProfilePage id={route.id} />;
  } else {
    page = <HomePage />;
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Suspense
          fallback={
            <section className="section">
              <div className="section__inner">
                <p className="section__lede">Loading…</p>
              </div>
            </section>
          }
        >
          {page}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
