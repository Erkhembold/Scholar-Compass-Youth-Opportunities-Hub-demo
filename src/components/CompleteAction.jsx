import { useCompletions } from "../hooks/useCompletions.js";
import { completeHref, signInHref } from "../router.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { COMPLETION_XP } from "../utils/evidence.js";

// The "Complete" control shown on every opportunity card (and the detail
// page). Shows the student's own submission status once they have one.
// Works inside a card that is itself a link: it stops the click from
// opening the opportunity.
export default function CompleteAction({ opportunityId, size = "md" }) {
  const { t } = useLanguage();
  const { byOpportunity, isSignedIn } = useCompletions();
  const row = byOpportunity[opportunityId];
  const status = row?.status || "none";

  const label =
    status === "approved"
      ? `${t("Completed")} +${COMPLETION_XP} XP`
      : status === "pending"
      ? t("Pending review")
      : status === "rejected"
      ? t("Rejected - resubmit")
      : t("Complete");

  function go(e) {
    e.preventDefault();
    e.stopPropagation();
    window.location.hash = isSignedIn ? completeHref(opportunityId) : signInHref();
  }

  return (
    <button
      type="button"
      className={`cmp-action cmp-action--${status} cmp-action--${size}`}
      onClick={go}
      title={status === "none" ? t("Submit proof that you completed this opportunity") : undefined}
    >
      {label}
    </button>
  );
}
