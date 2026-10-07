import { useState } from "react";
import { downloadCard, shareCard } from "../utils/shareCard.js";

// Download image + native Share. Share attaches the image through the phone's
// share sheet when the browser supports it, and otherwise saves the image.
export default function ShareCardActions({ card, url, onShared }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function run(fn) {
    setBusy(true);
    setNote("");
    try {
      const result = await fn();
      if (result === "downloaded") setNote("Image saved to your device.");
      if (result === "shared" || result === "downloaded") onShared?.();
    } catch {
      setNote("Couldn't create the image. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="share-actions">
      <button type="button" className="btn btn--accent" disabled={busy} onClick={() => run(() => shareCard(card, { url }))}>
        Share
      </button>
      <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => run(() => downloadCard(card))}>
        Download image
      </button>
      {note && (
        <p className="share-actions__note" role="status">
          {note}
        </p>
      )}
    </div>
  );
}
