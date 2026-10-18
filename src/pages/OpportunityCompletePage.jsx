import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useCompletions, notifyCompletionsChanged } from "../hooks/useCompletions.js";
import { supabase } from "../lib/supabaseClient.js";
import { opportunities } from "../data/opportunities.js";
import { opportunityHref, signInHref } from "../router.js";
import { uploadEvidence, signedEvidenceUrl } from "../utils/uploadEvidence.js";
import {
  COMPLETION_XP,
  NOTE_MAX,
  STATUS_LABELS,
  evidencePath,
  formatBytes,
  friendlyCompletionError,
  validateEvidenceFile,
} from "../utils/evidence.js";

function StatusPill({ status }) {
  return <span className={`cmp-pill cmp-pill--${status}`}>{STATUS_LABELS[status] || status}</span>;
}

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

// #/opportunity/<id>/complete — a student submits photo evidence that they
// completed an opportunity. Nothing here awards XP: the 100 XP is only added
// by the database when an administrator approves the submission.
export default function OpportunityCompletePage({ id }) {
  const { t } = useLanguage();
  const { user, loading, refreshProfile } = useAuth();
  const { byOpportunity, loading: loadingRows } = useCompletions();
  const opportunity = opportunities.find((o) => o.id === id);
  const row = byOpportunity[id];

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justSent, setJustSent] = useState(false);
  const [savedPhoto, setSavedPhoto] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Show the student their own already-submitted photo (private, signed URL).
  useEffect(() => {
    let cancelled = false;
    setSavedPhoto(null);
    if (row?.evidence_path) {
      signedEvidenceUrl(row.evidence_path).then((u) => {
        if (!cancelled) setSavedPhoto(u);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [row?.evidence_path]);

  // Once approved, make sure the XP shown elsewhere is the real balance.
  useEffect(() => {
    if (row?.status === "approved") refreshProfile();
  }, [row?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = opportunity?.title || row?.opportunity_title;

  if (loading || (user && loadingRows)) {
    return (
      <section className="section cmp-page">
        <div className="cmp-page__inner">
          <p className="section__lede">{t("Loading…")}</p>
        </div>
      </section>
    );
  }
  if (!user) {
    return (
      <section className="section cmp-page">
        <div className="cmp-page__inner">
          <h1 className="cmp-page__title">{t("Sign in to submit your completion")}</h1>
          <p className="section__lede">
            <a href={signInHref()}>{t("Sign in")}</a> {t("to upload proof and earn XP for finishing an opportunity.")}
          </p>
        </div>
      </section>
    );
  }
  if (!title) {
    return (
      <section className="section cmp-page">
        <div className="cmp-page__inner">
          <h1 className="cmp-page__title">{t("Opportunity not found")}</h1>
          <p className="section__lede">
            <a href="#/">{t("Back to home")}</a>
          </p>
        </div>
      </section>
    );
  }

  function pick(e) {
    const f = e.target.files?.[0] || null;
    setError("");
    const problem = f ? validateEvidenceFile(f) : null;
    if (problem) {
      setFile(null);
      setError(t(problem));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setFile(f);
  }

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setError("");
    const problem = validateEvidenceFile(file);
    if (problem) {
      setError(t(problem));
      return;
    }
    setBusy(true);
    setProgress(0);
    const path = evidencePath(user.id, id, file);
    const up = await uploadEvidence(file, path, setProgress);
    if (up.error) {
      setBusy(false);
      setError(friendlyCompletionError(up.error));
      return;
    }
    const { error: rpcError } = await supabase.rpc("submit_opportunity_completion", {
      p_opportunity_id: id,
      p_title: title,
      p_evidence_path: path,
      p_note: note.trim() || null,
    });
    setBusy(false);
    if (rpcError) {
      setError(friendlyCompletionError(rpcError.message));
      notifyCompletionsChanged();
      return;
    }
    setFile(null);
    setNote("");
    setJustSent(true);
    if (inputRef.current) inputRef.current.value = "";
    notifyCompletionsChanged();
  }

  const canSubmit = !row || row.status === "rejected";

  return (
    <section className="section cmp-page">
      <div className="cmp-page__inner">
        <p className="cmp-page__back">
          <a href={opportunity ? opportunityHref(id) : "#/profile"}>&larr; {opportunity ? t("Back to opportunity") : t("Profile")}</a>
        </p>
        <h1 className="cmp-page__title">{t("Mark as completed")}</h1>
        <p className="cmp-page__opp">{title}</p>

        {row && (
          <div className={`cmp-status cmp-status--${row.status}`} role="status">
            <div className="cmp-status__head">
              <StatusPill status={row.status} />
              <span className="cmp-status__when">
                {t("Submitted")} {formatWhen(row.submitted_at)}
              </span>
            </div>
            {row.status === "pending" && (
              <p>{t("Your evidence is waiting for review. No XP is awarded until it is approved.")}</p>
            )}
            {row.status === "approved" && (
              <p>
                {t("Approved. You earned")} <strong>{COMPLETION_XP} XP</strong> {t("for this opportunity.")}
              </p>
            )}
            {row.status === "rejected" && (
              <>
                <p>
                  <strong>{t("Reason from the reviewer:")}</strong> {row.reviewer_feedback}
                </p>
                <p>{t("Fix the issue and submit new evidence below. You will not lose your place and cannot be rewarded twice.")}</p>
              </>
            )}
            {row.note && (
              <p className="cmp-status__note">
                <strong>{t("Your explanation:")}</strong> {row.note}
              </p>
            )}
            {savedPhoto && row.status !== "rejected" && (
              <a href={savedPhoto} target="_blank" rel="noreferrer" className="cmp-status__photo">
                <img src={savedPhoto} alt={t("Your submitted evidence")} className="no-dim" />
              </a>
            )}
          </div>
        )}

        {justSent && (
          <p className="cmp-confirm" role="status">
            {t("Submitted. An administrator will review your evidence and you will see the result here.")}
          </p>
        )}

        {canSubmit && !justSent && (
          <form className="cmp-form" onSubmit={submit} noValidate>
            <div className="cmp-req">
              <h2 className="cmp-req__title">{t("What to upload")}</h2>
              <ul>
                <li>{t("A participation certificate, competition results, a volunteering confirmation, or a photo that clearly shows you took part.")}</li>
                <li>{t("Make sure it is readable and shows the event name or your name and the date where possible.")}</li>
                <li>{t("JPG, PNG or WebP, up to 5 MB. Only you and the reviewing administrator can see it.")}</li>
              </ul>
              <p className="cmp-req__reward">
                {t("You earn")} <strong>{COMPLETION_XP} XP</strong> {t("once, after your evidence is approved.")}
              </p>
            </div>

            <div className="cmp-field">
              <label htmlFor="cmp-file" className="cmp-field__label">
                {t("Photo evidence")}
              </label>
              <input
                id="cmp-file"
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={pick}
                disabled={busy}
              />
              {file && preview && (
                <div className="cmp-preview">
                  <img src={preview} alt={t("Preview of the photo you chose")} className="no-dim" />
                  <p>
                    {file.name} ({formatBytes(file.size)})
                  </p>
                </div>
              )}
            </div>

            <div className="cmp-field">
              <label htmlFor="cmp-note" className="cmp-field__label">
                {t("What did you do, and when? (optional)")}
              </label>
              <textarea
                id="cmp-note"
                rows={4}
                maxLength={NOTE_MAX}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={busy}
              />
              <span className="cmp-field__count">
                {note.length}/{NOTE_MAX}
              </span>
            </div>

            {busy && (
              <div className="cmp-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                <div className="cmp-progress__bar" style={{ width: `${progress}%` }} />
                <span>{progress < 100 ? `${t("Uploading")} ${progress}%` : t("Submitting…")}</span>
              </div>
            )}
            {error && (
              <p className="friend-note friend-note--error cmp-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn--accent" disabled={busy || !file}>
              {busy ? t("Submitting…") : row ? t("Resubmit for review") : t("Submit for review")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
