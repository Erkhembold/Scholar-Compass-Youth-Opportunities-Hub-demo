// Shareable student cards: ONE canvas renderer used for both the on-screen
// preview and the exported image (so what you see is exactly what you
// download/share), plus Download and native Share. The data -> card model and
// milestone rules are in cardModel.js.
import logoUrl from "../assets/brand/scholarcompass-icon.png";
import { avatarUrl } from "./avatar.js";
import { CARD_W, CARD_H } from "./cardModel.js";

export * from "./cardModel.js";

// ---- renderer -----------------------------------------------------------------
const BG = "#061A3A";
const BG_LOW = "#08234C";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.68)";
const RULE = "rgba(255,255,255,0.16)";
const FONT = '"SF Pro Display","Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif';
const MARGIN = 96;

const imgCache = new Map();
function loadImage(url, cors) {
  const key = `${cors ? "c" : "n"}:${url}`;
  if (!imgCache.has(key)) {
    imgCache.set(
      key,
      new Promise((resolve) => {
        const img = new Image();
        if (cors) img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null); // never block the card on a photo
        img.src = url;
      })
    );
  }
  return imgCache.get(key);
}

function spaced(ctx, text, x, y, gap, align = "left") {
  let width = 0;
  for (const ch of text) width += ctx.measureText(ch).width + gap;
  width -= gap;
  let cx = align === "center" ? x - width / 2 : x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + gap;
  }
  return width;
}

function fit(ctx, text, weight, start, min, maxW) {
  let size = start;
  while (size > min) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 4;
  }
  ctx.font = `${weight} ${size}px ${FONT}`;
  return size;
}

function ellipsize(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

const FLAME = "M12 2c.9 3.1-1 4.6-2.5 6.6C8 10.6 7 12.1 7 14.6a5 5 0 0 0 10 0c0-2-1-3.4-2-4.6-.3 1.2-1 2-2 2 .8-3-.2-6.4-1-10z";

function drawAvatar(ctx, img, initial, cx, cy, r, accent) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
  if (img) {
    ctx.clip();
    const s = Math.max((r * 2) / img.width, (r * 2) / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
  } else {
    ctx.fillStyle = BG_LOW;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = accent;
    ctx.stroke();
    ctx.fillStyle = WHITE;
    ctx.font = `700 ${Math.round(r * 0.95)}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(initial, cx, cy + r * 0.04);
  }
  ctx.restore();
}

export async function drawCard(canvas, card) {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");

  try {
    await Promise.race([document.fonts?.load(`800 100px ${FONT}`), new Promise((r) => setTimeout(r, 600))]);
  } catch {
    /* system font is fine */
  }
  const [logo, photo] = await Promise.all([
    loadImage(logoUrl, false),
    card.person?.avatarPath ? loadImage(avatarUrl(card.person.avatarPath) || "", true) : null,
  ]);

  // background: flat navy, a slightly lighter lower band, one accent bar
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = BG_LOW;
  ctx.fillRect(0, 1440, CARD_W, CARD_H - 1440);
  ctx.fillStyle = card.accent;
  ctx.fillRect(MARGIN, 96, 168, 12);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // brand row
  if (logo) ctx.drawImage(logo, MARGIN, 150, 72, 72);
  ctx.fillStyle = WHITE;
  ctx.font = `700 44px ${FONT}`;
  ctx.fillText("ScholarCompass", MARGIN + 96, 200);

  const innerW = CARD_W - MARGIN * 2;
  const initial = (card.person?.name || "").trim().charAt(0).toUpperCase();

  if (card.studentLayout) {
    // avatar + name + stat rows
    let y = 360;
    ctx.fillStyle = card.accent;
    ctx.font = `700 34px ${FONT}`;
    spaced(ctx, card.eyebrow, MARGIN, y + 34, 7);
    y += 110;
    if (photo || initial) {
      drawAvatar(ctx, photo, initial, MARGIN + 130, y + 130, 130, card.accent);
      y += 310;
    }
    ctx.fillStyle = WHITE;
    fit(ctx, card.hero, 800, 124, 60, innerW);
    ctx.fillText(card.hero, MARGIN, y + 100);
    y += 100;
    if (card.person.sub) {
      ctx.fillStyle = MUTED;
      ctx.font = `500 44px ${FONT}`;
      ctx.fillText(ellipsize(ctx, card.person.sub, innerW), MARGIN, y + 76);
      y += 76;
    }
    y += 90;
    drawRows(ctx, card.lines, y, 112, 52, innerW, Math.min(card.lines.length, 5));
  } else {
    // eyebrow
    let y = 560;
    let x = MARGIN;
    if (card.flame) {
      ctx.save();
      ctx.translate(MARGIN, y - 20);
      ctx.scale(2.6, 2.6);
      ctx.fillStyle = card.accent;
      ctx.fill(new Path2D(FLAME));
      ctx.restore();
      x += 76;
    }
    ctx.fillStyle = card.accent;
    ctx.font = `700 36px ${FONT}`;
    spaced(ctx, card.eyebrow, x, y + 30, 7);

    // hero
    const heroLen = card.hero.length;
    const start = heroLen <= 3 ? 560 : heroLen <= 5 ? 400 : 230;
    ctx.fillStyle = WHITE;
    const size = fit(ctx, card.hero, 800, start, 90, innerW);
    const heroBase = y + 60 + size * 0.86;
    ctx.fillText(card.hero, MARGIN - Math.round(size * 0.03), heroBase);

    // label
    ctx.fillStyle = WHITE;
    ctx.font = `700 60px ${FONT}`;
    let ly = heroBase + 104;
    if (card.label) spaced(ctx, card.label, MARGIN, ly, 6);

    // supporting rows
    if (card.lines.length) {
      drawRows(ctx, card.lines, ly + 90, 100, 44, innerW, 4);
    }
    if (card.note) {
      ctx.fillStyle = MUTED;
      ctx.font = `500 32px ${FONT}`;
      ctx.fillText(card.note, MARGIN, 1388);
    }
  }

  // person block (name only when public) — bottom band
  const hasPerson = !card.studentLayout && (card.person?.name || photo);
  if (hasPerson) {
    const cy = 1640;
    let tx = MARGIN;
    if (photo || initial) {
      drawAvatar(ctx, photo, initial || "?", MARGIN + 64, cy, 64, card.accent);
      tx = MARGIN + 168;
    }
    if (card.person.name) {
      ctx.fillStyle = WHITE;
      ctx.font = `700 54px ${FONT}`;
      ctx.fillText(ellipsize(ctx, card.person.name, CARD_W - MARGIN - tx), tx, cy + (card.person.sub ? -2 : 18));
      if (card.person.sub) {
        ctx.fillStyle = MUTED;
        ctx.font = `500 36px ${FONT}`;
        ctx.fillText(ellipsize(ctx, card.person.sub, CARD_W - MARGIN - tx), tx, cy + 52);
      }
    }
  }

  // footer
  ctx.fillStyle = MUTED;
  ctx.font = `500 30px ${FONT}`;
  ctx.textAlign = "left";
  const host = typeof location !== "undefined" ? location.host : "scholarcompass";
  ctx.fillText(host, MARGIN, 1852);
  ctx.textAlign = "right";
  ctx.fillText("Opportunities for Mongolian students", CARD_W - MARGIN, 1852);
  ctx.textAlign = "left";
}

function drawRows(ctx, lines, startY, rowH, size, w, max) {
  let y = startY;
  for (const [k, v] of lines.slice(0, max)) {
    ctx.fillStyle = RULE;
    ctx.fillRect(MARGIN, y, w, 2);
    ctx.fillStyle = MUTED;
    ctx.font = `500 ${size - 6}px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(k, MARGIN, y + rowH * 0.64);
    ctx.fillStyle = WHITE;
    ctx.font = `700 ${size}px ${FONT}`;
    ctx.textAlign = "right";
    ctx.fillText(v, MARGIN + w, y + rowH * 0.64);
    ctx.textAlign = "left";
    y += rowH;
  }
}

// ---- export: download + native share --------------------------------------------
export async function renderCardBlob(card) {
  const canvas = document.createElement("canvas");
  await drawCard(canvas, card);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't create the image."))), "image/png");
  });
}

function fileName(card) {
  const day = new Date().toISOString().slice(0, 10);
  return `scholarcompass-${card.kind}-${day}.png`;
}

export async function downloadCard(card) {
  const blob = await renderCardBlob(card);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName(card);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return "downloaded";
}

// Native share sheet with the image attached where the browser supports it
// (most phones); otherwise the image is downloaded instead. Returns
// "shared" | "downloaded" | "cancelled".
export async function shareCard(card, { url } = {}) {
  const blob = await renderCardBlob(card);
  const file = new File([blob], fileName(card), { type: "image/png" });
  const text = `${card.alt || "My ScholarCompass card"}${url ? ` — ${url}` : ""}`;
  if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "ScholarCompass", text });
      return "shared";
    } catch (err) {
      if (err && err.name === "AbortError") return "cancelled";
      // fall through to the download fallback
    }
  }
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName(card);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
  return "downloaded";
}

export function publicProfileUrl(id) {
  return `${location.origin}${location.pathname}#/u/${encodeURIComponent(id)}`;
}
