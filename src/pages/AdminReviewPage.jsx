import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useIsAdmin } from "../hooks/useIsAdmin.js";
import { supabase } from "../lib/supabaseClient.js";
import { signedEvidenceUrl } from "../utils/uploadEvidence.js";
import { COMPLETION_XP, STATUS_LABELS } from "../utils/evidence.js";
import { opportunityHref, publicProfileHref, signInHref } from "../router.js";

const TABS = [
  { id: "pending", label: "Pending review" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function Submission({ item, onReviewed }) {
  const [photo, setPhoto] = useState(null);
  const [photoState, setPhotoState] = useState("loading");
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setPhotoState("loading");
    signedEvidenceUrl(item.evidence_path, 900).then((u) => {
      if (cancelled) return;
      setPhoto(u);
      setPhotoState(u ? "ready" : "error");
    });
    return () => {
      cancelled = true;
    };
  }, [item.evidence_path]);

  async function review(approve) {
    if (busy) return;
    setError("");
    if (!approve && reason.trim() === "") {
      setError("Give the student a short reason so they can fix it.");
      return;
    }
    setBusy(true);
    const { data, error: rpcError } = await supabase.rpc("admin_review_completion", {
      p_id: item.id,
      p_approve: approve,
      p_feedback: approve ? null : reason.trim(),
    });
    setBusy(false);
    if (rpcError) {
      setError(rpcError.message);
      // Someone (or another click) already reviewed it: refresh the list.
      if (/already reviewed/i.test(rpcError.message)) onReviewed(null);
      return;
    }
    onReviewed(
      approve
        ? `Approved. ${data?.xp_awarded ?? COMPLETION_XP} XP awarded to ${item.student_name || "the student"} for "${item.opportunity_title}".`
        : `Rejected. ${item.student_name || "The student"} can see your reason and resubmit.`
    );
  }

  const isPending = item.status === "pending";

  return (
    <article className="adm-item">
      <div className="adm-item__main">
        <header className="adm-item__head">
          <h2 className="adm-item__title">
            <a href={opportunityHref(item.opportunity_id)}>{item.opportunity_title}</a>
          </h2>
          <span className={`cmp-pill cmp-pill--${item.status}`}>{STATUS_LABELS[item.status]}</span>
        </header>
        <dl className="adm-item__meta">
          <div>
            <dt>Student</dt>
            <dd>
              <a href={publicProfileHref(item.user_id)}>{item.student_name || "No name"}</a>
              {item.student_email ? ` (${item.student_email})` : ""}
            </dd>
          </div>
          {(item.school || item.grade) && (
            <div>
              <dt>School / grade</dt>
              <dd>
                {[item.school, item.grade && `Grade ${item.grade}`].filter(Boolean).join(", ")}
              </dd>
            </div>
          )}
          <div>
            <dt>Submitted</dt>
            <dd>
              {formatWhen(item.submitted_at)}
              {item.resubmit_count > 0 ? ` (resubmission ${item.resubmit_count})` : ""}
            </dd>
          </div>
          {item.reviewed_at && (
            <div>
              <dt>Reviewed</dt>
              <dd>{formatWhen(item.reviewed_at)}</dd>
            </div>
          )}
        </dl>
        <p className="adm-item__note">
          <strong>Student's explanation:</strong> {item.note || <em>None given</em>}
        </p>
        {item.reviewer_feedback && (
          <p className="adm-item__note">
            <strong>Feedback sent:</strong> {item.reviewer_feedback}
          </p>
        )}

        {isPending && (
          <div className="adm-actions">
            {rejecting ? (
              <>
                <label htmlFor={`rej-${item.id}`} className="cmp-field__label">
                  Reason for rejecting (shown to the student)
                </label>
                <textarea
                  id={`rej-${item.id}`}
                  rows={3}
                  maxLength={500}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  disabled={busy}
                />
                <div className="adm-actions__row">
                  <button type="button" className="btn btn--danger-ghost btn--small" onClick={() => review(false)} disabled={busy}>
                    {busy ? "Saving…" : "Confirm rejection"}
                  </button>
                  <button type="button" className="btn btn--ghost btn--small" onClick={() => setRejecting(false)} disabled={busy}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="adm-actions__row">
                <button type="button" className="btn btn--accent btn--small" onClick={() => review(true)} disabled={busy}>
                  {busy ? "Saving…" : `Approve and award ${COMPLETION_XP} XP`}
                </button>
                <button type="button" className="btn btn--ghost btn--small" onClick={() => setRejecting(true)} disabled={busy}>
                  Reject
                </button>
              </div>
            )}
            {error && (
              <p className="friend-note friend-note--error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="adm-item__evidence">
        {photoState === "loading" && <p className="adm-item__photo-msg">Loading photo…</p>}
        {photoState === "error" && <p className="adm-item__photo-msg">The photo could not be loaded.</p>}
        {photoState === "ready" && (
          <a href={photo} target="_blank" rel="noreferrer" title="Open full size">
            <img src={photo} alt={`Evidence for ${item.opportunity_title}`} className="no-dim" />
          </a>
        )}
      </div>
    </article>
  );
}

// #/admin/reviews — administrator-only. The page asks the database whether
// you are an admin, and every list / approve / reject call is checked by the
// database again, so opening this URL as a normal student shows nothing and
// can change nothing.
export default function AdminReviewPage() {
  const { user, loading } = useAuth();
  const { checked, isAdmin } = useIsAdmin();
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    if (!supabase) return;
    setFetching(true);
    setError("");
    const { data, error: rpcError } = await supabase.rpc("admin_list_completions", { p_status: tab });
    setFetching(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setItems(data || []);
  }, [tab]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  if (loading || (user && !checked)) {
    return (
      <section className="section adm-page">
        <div className="adm-page__inner">
          <p className="section__lede">Loading…</p>
        </div>
      </section>
    );
  }
  if (!user) {
    return (
      <section className="section adm-page">
        <div className="adm-page__inner">
          <h1 className="adm-page__title">Review queue</h1>
          <p className="section__lede">
            <a href={signInHref()}>Sign in</a> to continue.
          </p>
        </div>
      </section>
    );
  }
  if (!isAdmin) {
    return (
      <section className="section adm-page">
        <div className="adm-page__inner">
          <h1 className="adm-page__title">Not available</h1>
          <p className="section__lede">This page is for ScholarCompass administrators.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section adm-page">
      <div className="adm-page__inner">
        <h1 className="adm-page__title">Review queue</h1>
        <p className="section__lede">
          Check each student's evidence, then approve it ({COMPLETION_XP} XP, awarded once) or reject it with a reason.
        </p>

        <div className="adm-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`adm-tab ${tab === t.id ? "adm-tab--active" : ""}`}
              onClick={() => {
                setTab(t.id);
                setMessage("");
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {message && (
          <p className="cmp-confirm" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="friend-note friend-note--error" role="alert">
            {error}
          </p>
        )}

        {fetching && items.length === 0 ? (
          <p className="section__lede">Loading…</p>
        ) : items.length === 0 ? (
          <p className="board__empty">
            {tab === "pending" ? "Nothing is waiting for review." : `No ${STATUS_LABELS[tab].toLowerCase()} submissions yet.`}
          </p>
        ) : (
          <div className="adm-list">
            {items.map((item) => (
              <Submission
                key={item.id}
                item={item}
                onReviewed={(msg) => {
                  if (msg) setMessage(msg);
                  load();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
