import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useMyCardData } from "../hooks/useMyCardData.js";
import ShareCardCanvas from "./ShareCardCanvas.jsx";
import ShareCardActions from "./ShareCardActions.jsx";
import {
  CARD_KINDS,
  SHARE_FIELDS,
  buildCard,
  buildMilestoneCard,
  isPublic,
  listMilestones,
  milestoneWeight,
  ownerViewModel,
  publicProfileUrl,
} from "../utils/shareCard.js";

// Owner-only: choose what other students can see, pick which cards sit on the
// public profile, and download/share them as images. The preview is built from
// the SAME per-field settings the database enforces for everyone else, so it
// shows exactly what a visitor (or a shared image) will contain.
export default function StudentCardsSection() {
  const { user, updateProfile } = useAuth();
  const { data, loading, isSetUp } = useMyCardData();
  const [override, setOverride] = useState(null); // optimistic settings while saving
  const [error, setError] = useState("");
  const [previewId, setPreviewId] = useState("student");

  const settings = override || data?.settings || {};
  const vm = useMemo(() => ownerViewModel(data, settings), [data, settings]);
  const chosen = Array.isArray(settings.cards) ? settings.cards : [];
  const featured = settings.featured || null;

  const milestones = useMemo(
    () => listMilestones(data).sort((a, b) => milestoneWeight(b) - milestoneWeight(a)),
    [data]
  );

  if (loading) return <p className="signin__lede">Loading…</p>;
  if (!isSetUp || !data) {
    return <p className="signin__lede">Shareable cards aren't switched on yet.</p>;
  }

  async function save(next) {
    const prev = override;
    setOverride(next);
    setError("");
    const { error: err } = await updateProfile({ public_profile: next });
    if (err) {
      setOverride(prev);
      setError("Couldn't save that change. Please try again.");
    }
  }

  const base = () => ({ show: { ...(settings.show || {}) }, cards: [...chosen], featured });
  const setField = (key, on) => {
    const next = base();
    next.show[key] = on;
    save(next);
  };
  const toggleCard = (id) => {
    const next = base();
    next.cards = chosen.includes(id) ? chosen.filter((c) => c !== id) : [...chosen, id];
    if (!next.cards.includes(next.featured)) next.featured = null;
    save(next);
  };
  const setFeatured = (id) => {
    const next = base();
    if (!next.cards.includes(id)) next.cards.push(id);
    next.featured = next.featured === id ? null : id;
    save(next);
  };

  // What's being previewed: a regular card, or a milestone ("ms:<id>").
  const milestone = previewId.startsWith("ms:") ? milestones.find((m) => `ms:${m.id}` === previewId) : null;
  const card = milestone ? buildMilestoneCard(milestone, vm) : buildCard(previewId, vm);
  const profileUrl = publicProfileUrl(user.id);

  return (
    <div className="cards-section">
      <div className="cards-section__preview">
        {card ? (
          <>
            <ShareCardCanvas card={card} className="cards-section__canvas" />
            <ShareCardActions card={card} url={profileUrl} />
          </>
        ) : (
          <p className="signin__lede cards-section__empty">
            There's nothing to show on this card yet. Practice a little, or turn the related field on.
          </p>
        )}
      </div>

      <div className="cards-section__controls">
        <h3 className="cards-section__subhead">Your cards</h3>
        <p className="cards-section__help">
          Tick “On profile” to show a card to other students. The star picks the one they see first.
        </p>
        <ul className="card-kind-list">
          {CARD_KINDS.map((k) => {
            const available = !!buildCard(k.id, vm);
            const on = chosen.includes(k.id);
            const why =
              k.needs && !isPublic(settings, k.needs)
                ? `Turn on “${SHARE_FIELDS.find((f) => f.key === k.needs).label}” below`
                : "Nothing to show yet";
            return (
              <li key={k.id} className={`card-kind ${previewId === k.id ? "card-kind--active" : ""}`}>
                <button
                  type="button"
                  className="card-kind__name"
                  disabled={!available}
                  onClick={() => setPreviewId(k.id)}
                  aria-pressed={previewId === k.id}
                >
                  {k.label}
                  {!available && <span className="card-kind__why">{why}</span>}
                </button>
                <label className="card-kind__check">
                  <input type="checkbox" checked={on} disabled={!available && !on} onChange={() => toggleCard(k.id)} />
                  On profile
                </label>
                <button
                  type="button"
                  className="card-kind__star"
                  aria-pressed={featured === k.id}
                  aria-label={`${featured === k.id ? "Unfeature" : "Feature"} ${k.label}`}
                  disabled={!available && featured !== k.id}
                  onClick={() => setFeatured(k.id)}
                >
                  {featured === k.id ? "★" : "☆"}
                </button>
              </li>
            );
          })}
        </ul>

        <h3 className="cards-section__subhead">Who can see what</h3>
        <p className="cards-section__help">
          Private fields are never shown on your cards, your public profile or shared images. Your email is never shared.
        </p>
        <ul className="privacy-list">
          {SHARE_FIELDS.map((f) => {
            const on = isPublic(settings, f.key);
            return (
              <li key={f.key} className="privacy-row">
                <span className="privacy-row__label">
                  {f.label}
                  {f.hint && !on && <span className="privacy-row__hint">{f.hint}</span>}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`${f.label}: ${on ? "public" : "private"}`}
                  className={`privacy-switch ${on ? "privacy-switch--on" : ""}`}
                  onClick={() => setField(f.key, !on)}
                >
                  {on ? "Public" : "Private"}
                </button>
              </li>
            );
          })}
        </ul>

        <h3 className="cards-section__subhead">Milestones</h3>
        {milestones.length === 0 ? (
          <p className="cards-section__help">
            Keep a 7-day streak, move up a league, or practice 100 questions and a shareable milestone appears here.
          </p>
        ) : (
          <ul className="share-milestones">
            {milestones.map((m) => (
              <li key={m.id} className="share-milestone">
                <span>{m.title}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  aria-pressed={previewId === `ms:${m.id}`}
                  onClick={() => setPreviewId(`ms:${m.id}`)}
                >
                  Preview &amp; share
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && (
          <p className="friend-note friend-note--error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
