import { useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import { uploadAvatar } from "../utils/avatar.js";

// Lets the signed-in user replace their own profile picture. Nothing here
// grants access to anyone else's photo: the upload always goes to the
// caller's own storage folder (enforced server-side, see
// supabase/public_profiles_and_avatars.sql), and this component is only
// ever rendered on the owner's own Profile page.
export default function AvatarUpload({ userId, name, avatarPath, onUploaded }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const path = await uploadAvatar(userId, file);
      await onUploaded(path);
    } catch (err) {
      setError(err.message || "Couldn't upload that image — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="avatar-upload">
      <Avatar path={avatarPath} name={name} size={72} />
      <div className="avatar-upload__controls">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Uploading…" : "Change photo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={handleFile}
        />
        {error && (
          <p className="avatar-upload__error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
