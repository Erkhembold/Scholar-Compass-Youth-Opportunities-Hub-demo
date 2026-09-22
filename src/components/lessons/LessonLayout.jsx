import Breadcrumb from "./Breadcrumb.jsx";
import LessonProgress from "./LessonProgress.jsx";
import LessonNavigation from "./LessonNavigation.jsx";

// Base shell every lesson page is built on.
//   Desktop: main content (left) + sticky progress panel (right).
//   Mobile: single column, with a compact progress bar under the
//   breadcrumb instead of the sticky side panel.
//
// This component does NOT render the site's global top navigation —
// that's the existing app-wide <Header /> already rendered by App.jsx.
// "Top navigation" from the universal-elements list refers to that
// existing header, not something duplicated here.
export default function LessonLayout({ breadcrumbItems, steps, prev, next, children }) {
  return (
    <section className="section lesson-page">
      <div className="section__inner lesson-page__inner">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}

        {steps && steps.length > 0 && (
          <div className="lesson-page__compact-progress">
            <LessonProgress steps={steps} compact />
          </div>
        )}

        <div className="lesson-page__layout">
          <div className="lesson-page__main">{children}</div>

          {steps && steps.length > 0 && (
            <aside className="lesson-page__sidebar">
              <div className="lesson-page__sidebar-sticky">
                <LessonProgress steps={steps} />
              </div>
            </aside>
          )}
        </div>
      </div>

      {(prev || next) && <LessonNavigation prev={prev} next={next} />}
    </section>
  );
}
