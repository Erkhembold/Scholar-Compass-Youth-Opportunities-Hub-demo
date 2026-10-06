import { supabase } from "../lib/supabaseClient.js";

const MAX_BYTES = 2 * 1024 * 1024; // must match the bucket's file_size_limit
const EXT_BY_TYPE = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Public URL for a stored avatar path (the `avatars` bucket is public — see
// supabase/public_profiles_and_avatars.sql — so this needs no auth header
// and works in a plain <img src>).
export function avatarUrl(path) {
  if (!path || !supabase) return null;
  return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}

// Uploads a new avatar for the signed-in user and returns the stored path
// (to save on profiles.avatar_path), or throws a short user-facing message.
// Each upload gets a fresh file name ("<user id>/avatar-<timestamp>.<ext>"),
// so the new photo shows immediately instead of the CDN serving the old
// image for up to an hour; the previous file is then deleted (best effort).
// Staying inside "<user id>/" satisfies the "own folder" database check.
export async function uploadAvatar(userId, file) {
  if (!supabase || !userId) throw new Error("Sign in to add a profile picture.");
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) throw new Error("Please choose a JPG, PNG or WEBP image.");
  if (file.size > MAX_BYTES) throw new Error("Image must be under 2 MB.");

  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });
  if (error) throw new Error("Couldn't upload that image — please try again.");
  return path;
}

// Best-effort cleanup of a replaced photo. Storage policy only lets a user
// delete files in their own folder; any failure is ignored on purpose (a
// leftover file is harmless, a thrown error here would look like a failed upload).
export async function removeAvatarFile(path) {
  if (!supabase || !path) return;
  try {
    await supabase.storage.from("avatars").remove([path]);
  } catch {
    /* ignore */
  }
}
