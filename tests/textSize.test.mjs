import test from "node:test";
import assert from "node:assert/strict";
import {
  applyTextSize,
  getNextTextSize,
  getTextSize,
  subscribeTextSize,
} from "../src/utils/textSize.js";

test("text size cycles from standard through larger and back to standard", () => {
  assert.equal(getNextTextSize("standard"), "large");
  assert.equal(getNextTextSize("large"), "larger");
  assert.equal(getNextTextSize("larger"), "standard");
});

test("unknown text size values safely return to standard", () => {
  assert.equal(getNextTextSize("unknown"), "standard");
});

test("text size changes update the shared preference and persist locally", () => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  const attributes = new Map();
  const storage = new Map();
  let notifications = 0;
  const unsubscribe = subscribeTextSize(() => notifications++);

  globalThis.document = {
    documentElement: {
      getAttribute: (name) => attributes.get(name) ?? null,
      setAttribute: (name, value) => attributes.set(name, value),
    },
  };
  globalThis.window = {
    localStorage: {
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
  };

  try {
    applyTextSize("large");
    assert.equal(getTextSize(), "large");
    assert.equal(storage.get("scholarcompass-text-size"), "large");
    assert.equal(notifications, 1);

    applyTextSize("standard");
    assert.equal(getTextSize(), "standard");
    assert.equal(storage.has("scholarcompass-text-size"), false);
    assert.equal(notifications, 2);
  } finally {
    unsubscribe();
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
