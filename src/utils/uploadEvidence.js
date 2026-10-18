import { supabase } from "../lib/supabaseClient.js";
import { EVIDENCE_BUCKET } from "./evidence.js";

// Uploads one photo to the PRIVATE evidence bucket and reports progress.
// supabase-js has no upload progress, so this talks to the Storage REST
// endpoint directly with the signed-in user's own access token (never a
// service key). The bucket policies still decide whether the upload is
// allowed: only into the student's own folder.
export async function uploadEvidence(file, path, onProgress) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (!token) return { error: "Please sign in again, then retry." };

  const base = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const url = `${base}/storage/v1/object/${EVIDENCE_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "3600");
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => resolve({ error: "Network problem while uploading. Check your connection and try again." });
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve({ error: null });
      let message = "";
      try {
        message = JSON.parse(xhr.responseText).message || "";
      } catch {
        // ignore
      }
      resolve({ error: message || `Upload failed (${xhr.status}).` });
    };
    xhr.send(file);
  });
}

export async function signedEvidenceUrl(path, seconds = 600) {
  if (!supabase || !path) return null;
  const { data, error } = await supabase.storage.from(EVIDENCE_BUCKET).createSignedUrl(path, seconds);
  return error ? null : data?.signedUrl || null;
}
