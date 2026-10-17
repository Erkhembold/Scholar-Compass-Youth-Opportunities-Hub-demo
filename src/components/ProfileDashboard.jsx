import { useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { IconFlame } from "./icons.jsx";
import { useProgressData } from "../hooks/useProgressData.js";
import { useStreak } from "../hooks/useStreak.js";
import { useFriendships } from "../hooks/useFriendships.js";
import { levelProgress } from "../utils/levels.js";
import { buildProgressCards, buildWeakestList, percent } from "../utils/profileDashboard.js";
import { removeAvatarFile, uploadAvatar } from "../utils/avatar.js";
import { SAT_QUESTIONS } from "../data/satQuestions.js";
import { LEAGUE_BY_ID } from "../data/leagues.js";
import { MIN_SAMPLE } from "../utils/progress.js";
import { satMathExercisesHref, profileStatsHref, leaderboardHref, publicProfileHref } from "../router.js";

const SAT_RW_TOTAL = Object.values(SAT_QUESTIONS).reduce((n, qs) => n + qs.length, 0);
const fmt = (n) => (n ?? 0).toLocaleString();

function Bar({ value, label }) {
  const w = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="pd-bar" role="img" aria-label={label}>
      <div className="pd-bar__fill" style={{ width: `${w}%` }} />
    </div>
  );
}

function StatCard({ title, big, unit, line, bar, barLabel, href, cta }) {
  return (
    <a className="pd-stat" href={href}>
      <span className="pd-stat__title">{title}</span>
      <span className="pd-stat__value">
        {big}
        {unit && <small>{unit}</small>}
      </span>
      {bar != null ? <Bar value={bar} label={barLabel} /> : <span className="pd-bar pd-bar--empty" aria-hidden="true" />}
      <span className="pd-stat__line">{line}</span>
      <span className="pd-stat__cta">{cta}</span>
    </a>
  );
}

function ProgressSection({ progress, loading, isSetUp }) {
  const cards = buildProgressCards(progress, SAT_RW_TOTAL);
  return (
    <section className="pd-section pd-progress" aria-labelledby="pd-progress-h">
      <h2 id="pd-progress-h" className="pd-h">Your progress</h2>
      {loading ? (
        <p className="pd-note">Loading...</p>
      ) : !isSetUp || !cards ? (
        <p className="pd-note">Progress tracking isn't switched on yet.</p>
      ) : (
        <div className="pd-stats">
          <StatCard
            title="Questions answered"
            big={fmt(cards.answered.value)}
            line={cards.answered.accuracy == null ? "No practice yet" : `${cards.answered.accuracy}% correct overall`}
            bar={cards.answered.accuracy == null ? null : cards.answered.accuracy / 100}
            barLabel={`${cards.answered.accuracy}% correct overall`}
            href="#/category/sat"
            cta="Practice"
          />
          <StatCard
            title="SAT Reading & Writing"
            big={fmt(cards.rw.mastered)}
            unit={` / ${fmt(cards.rw.total)}`}
            line={cards.rw.seen ? `${cards.rw.mastered} of ${cards.rw.seen} tried questions mastered` : "No practice yet"}
            bar={cards.rw.fraction}
            barLabel={`${cards.rw.mastered} of ${cards.rw.total} questions mastered`}
            href="#/category/sat"
            cta="Practice"
          />
          <StatCard
            title="SAT Math"
            big={cards.math.accuracy == null ? "-" : percent(cards.math.accuracy)}
            unit={cards.math.accuracy == null ? null : "%"}
            line={cards.math.attempted ? `${cards.math.correct} of ${cards.math.attempted} correct` : "No practice yet"}
            bar={cards.math.accuracy}
            barLabel="SAT Math accuracy"
            href={satMathExercisesHref()}
            cta="Practice"
          />
          <StatCard
            title="IELTS Reading"
            big={cards.ielts.accuracy == null ? "-" : percent(cards.ielts.accuracy)}
            unit={cards.ielts.accuracy == null ? null : "%"}
            line={
              cards.ielts.attempted
                ? `${cards.ielts.correct} of ${cards.ielts.attempted} correct${cards.ielts.latestBand != null ? `, latest mock band ${cards.ielts.latestBand}` : ""}`
                : "No exercises yet"
            }
            bar={cards.ielts.accuracy}
            barLabel="IELTS Reading accuracy"
            href="#/ielts/exercises/reading"
            cta="Practice"
          />
        </div>
      )}
    </section>
  );
}

function WeakSection({ progress, loading, isSetUp }) {
  const list = buildWeakestList(progress, 4);
  return (
    <section className="pd-section pd-weak" aria-labelledby="pd-weak-h">
      <h2 id="pd-weak-h" className="pd-h">Your weakest areas</h2>
      {loading ? (
        <p className="pd-note">Loading...</p>
      ) : !isSetUp ? (
        <p className="pd-note">Weak-area tracking isn't switched on yet.</p>
      ) : list.length === 0 ? (
        <p className="pd-note">
          Not enough answers yet. Once you have tried {MIN_SAMPLE} questions in a topic, your lowest topics show up here.
        </p>
      ) : (
        <ul className="pd-weak__list">
          {list.map((r) => (
            <li key={r.key} className="pd-weak__row">
              <div className="pd-weak__text">
                <span className="pd-weak__label">{r.label}</span>
                <span className="pd-weak__sub">{r.subject} - {r.sample} attempted</span>
              </div>
              <Bar value={r.rate} label={`${percent(r.rate)}% ${r.metric}`} />
              <span className="pd-weak__pct">{percent(r.rate)}%</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FriendsPanel({ onManage }) {
  const f = useFriendships();
  const people = [...f.friends].sort((a, b) => (b.current_streak || 0) - (a.current_streak || 0));
  const shown = people.slice(0, 6);
  return (
    <section className="pd-section pd-friends" aria-labelledby="pd-friends-h">
      <div className="pd-friends__head">
        <h2 id="pd-friends-h" className="pd-h">Friends</h2>
        <button type="button" className="pd-link" onClick={onManage}>
          {f.incoming.length > 0 ? `Manage (${f.incoming.length} request${f.incoming.length === 1 ? "" : "s"})` : "Manage"}
        </button>
      </div>
      {f.loading ? (
        <p className="pd-note">Loading...</p>
      ) : !f.isSetUp ? (
        <p className="pd-note">Friends aren't switched on yet.</p>
      ) : shown.length === 0 ? (
        <p className="pd-note">
          No friends yet. Open a name on the <a href={leaderboardHref()}>leaderboard</a> and choose Add friend.
        </p>
      ) : (
        <ul className="pd-friends__list">
          {shown.map((p) => {
            const league = p.current_league ? LEAGUE_BY_ID[p.current_league] : null;
            const streak = typeof p.current_streak === "number" ? p.current_streak : null;
            return (
              <li key={p.friendship_id}>
                <a className="pd-friend" href={publicProfileHref(p.user_id)}>
                  <Avatar path={p.avatar_path} name={p.name} size={36} />
                  <span className="pd-friend__text">
                    <span className="pd-friend__name">{p.name || "ScholarCompass student"}</span>
                    <span className="pd-friend__meta">{league ? `${league.name} league` : "League hidden"}</span>
                  </span>
                  {streak != null && (
                    <span className="pd-friend__streak" aria-label={`${streak} day streak`}>
                      <IconFlame width={15} height={15} />
                      {streak}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      {f.friends.length > shown.length && (
        <button type="button" className="pd-link pd-friends__all" onClick={onManage}>
          View all {f.friends.length} friends
        </button>
      )}
    </section>
  );
}

export default function ProfileDashboard({ user, profile, onProfileChange, onSettings, onSignOut, onManageFriends }) {
  const { progress, loading, isSetUp } = useProgressData();
  const streak = useStreak();
  const fileRef = useRef(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const xp = profile?.lifetime_xp || 0;
  const lv = levelProgress(xp);
  const league = LEAGUE_BY_ID[profile?.current_league || "bronze"];
  const name = profile?.name || "Student";

  async function onPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPhotoBusy(true);
    setPhotoError("");
    try {
      const path = await uploadAvatar(user.id, file);
      await onProfileChange({ avatar_path: path });
      if (profile?.avatar_path && profile.avatar_path !== path) removeAvatarFile(profile.avatar_path);
    } catch (err) {
      setPhotoError(err.message || "Couldn't upload that image.");
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <div className="pd">
      <header className="pd-head">
        <div className="pd-id">
          <button type="button" className="pd-avatar" onClick={() => fileRef.current?.click()} disabled={photoBusy} aria-label="Change profile photo">
            <Avatar path={profile?.avatar_path} name={name} size={76} />
            <span className="pd-avatar__hint">{photoBusy ? "Uploading" : "Change"}</span>
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onPhoto} />
          <div className="pd-id__text">
            <h1 className="pd-name">{name}</h1>
            <a className="pd-league" href={leaderboardHref()} data-league={league.id}>
              <span className="pd-league__dot" style={{ background: league.primary }} aria-hidden="true" />
              {league.name} league
            </a>
          </div>
        </div>

        <dl className="pd-kpis">
          <div className="pd-kpi">
            <dt>Total points</dt>
            <dd>{fmt(xp)}</dd>
          </div>
          <div className="pd-kpi">
            <dt>Day streak</dt>
            <dd className="pd-kpi__streak">
              <IconFlame width={22} height={22} />
              {streak.isSetUp ? streak.current : 0}
            </dd>
          </div>
        </dl>

        <div className="pd-actions">
          <button type="button" className="pd-action" onClick={onSettings}>Settings</button>
          <button type="button" className="pd-action" onClick={onSignOut}>Sign out</button>
        </div>
      </header>
      {photoError && <p className="pd-error" role="alert">{photoError}</p>}

      <div className="pd-level">
        <span className="pd-level__end">Level {lv.level}</span>
        <div className="pd-level__track">
          <Bar value={lv.fraction} label={`${fmt(lv.into)} of ${fmt(lv.ceiling - lv.floor)} points to level ${lv.level + 1}`} />
          <span className="pd-level__note">
            {fmt(lv.remaining)} points to level {lv.level + 1} - <a href={profileStatsHref()}>levels and milestones</a>
          </span>
        </div>
        <span className="pd-level__end pd-level__end--next">Level {lv.level + 1}</span>
      </div>

      <div className="pd-main">
        <ProgressSection progress={progress} loading={loading} isSetUp={isSetUp} />
        <WeakSection progress={progress} loading={loading} isSetUp={isSetUp} />
        <FriendsPanel onManage={onManageFriends} />
      </div>
    </div>
  );
}
