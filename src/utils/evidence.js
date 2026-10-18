// Helpers for opportunity-completion evidence (photo upload + status text).
// The same limits are enforced again by the private storage bucket and the
// database (supabase/opportunity_completions.sql); checking here only gives a
// friendlier message before anything is sent.

export const EVIDENCE_BUCKET = "opportunity-evidence";
export const EVIDENCE_MAX_BYTES = 5 * 1024 * 1024;
export const EVIDENCE_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const NOTE_MAX = 500;
export const COMPLETION_XP = 100; // display only; the database decides the real award

export function validateEvidenceFile(file) {
  if (!file) return "Choose a photo to upload.";
  if (!EVIDENCE_TYPES[file.type]) return "Only JPG, PNG or WebP photos are accepted.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > EVIDENCE_MAX_BYTES) return "That photo is larger than 5 MB. Choose a smaller one.";
  return null;
}

export function evidencePath(userId, opportunityId, file, now = Date.now()) {
  const ext = EVIDENCE_TYPES[file.type] || "jpg";
  const slug = String(opportunityId).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "opportunity";
  return `${userId}/${slug}-${now}.${ext}`;
}

export function formatBytes(n) {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export const STATUS_LABELS = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

// Turns a raw database/network error into something a student can act on.
export function friendlyCompletionError(message) {
  const m = String(message || "");
  if (/already have a submission/i.test(m)) return m.replace(/^.*?(You already)/i, "$1");
  if (/not uploaded|own folder|sign in|Unknown opportunity|limited to/i.test(m)) return m.replace(/^.*?ERROR:\s*/i, "");
  if (/function .* does not exist|schema cache|relation .* does not exist|bucket not found/i.test(m)) {
    return "Completion submissions are not switched on yet. Please try again later.";
  }
  if (/payload too large|exceeded the maximum|too large/i.test(m)) return "That photo is larger than 5 MB. Choose a smaller one.";
  if (/mime|not supported|invalid.*type/i.test(m)) return "Only JPG, PNG or WebP photos are accepted.";
  return m || "Something went wrong. Please try again.";
}
