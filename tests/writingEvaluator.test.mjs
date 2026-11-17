import test from "node:test";
import assert from "node:assert/strict";
import { evaluateEssay, validateAssessment, validateRequest, overallBand, extractJson, cyrillicRatio, estimateCostUsd, SYSTEM_PROMPT, buildUserMessage } from "../supabase/functions/evaluate-essay/index.ts";

const RID = () => crypto.randomUUID();

const STRONG = "Many people argue that technology has reduced the value of face-to-face communication. I partly agree, because digital tools have changed how we maintain relationships, although they cannot fully replace personal contact. ".repeat(6).trim();
const WEAK = "Technology is good. People use phone every day and they are not talking each other. I am agree with this because phone is very important in modern life and many peoples use it for everything they want to do in the day.";
const INCOMPLETE = "Some people think that studying abroad is better than studying at home because students can learn languages and meet new people from different cultures and this is very useful for their future careers in many fields";
const IRRELEVANT = "My favourite food is pizza with cheese and tomatoes. Yesterday I went to the market and bought fresh vegetables and fruit for my family because we wanted to cook dinner together at home and enjoy a quiet evening.";

const TASK = { taskId: "writing-task-1", taskType: "task2", taskTitle: "T", taskPrompt: "Some people believe technology has made face-to-face communication less important. Discuss.", minWords: 250 };

function aiJson(essay, over = {}) {
  const sent = essay.split(/(?<=\.)\s/)[0];
  const base = {
    relevance: "on_topic",
    criteria: Object.fromEntries(["taskResponse", "coherenceCohesion", "lexicalResource", "grammar"].map((k) => [
      k, { band: 6, strengths: ["Санаагаа тодорхой илэрхийлсэн байна."], weaknesses: ["Жишээ дутмаг байна."], evidence: [{ quote: sent.slice(0, 30), comment: "Энэ хэсэг сэдвийг шууд хөндсөн." }] },
    ])),
    corrections: [{ original: sent, improved: sent + " (засвартай)", explanation: "Энд өгүүлбэрийн бүтцийг илүү тодорхой болгох хэрэгтэй." }],
    recommendations: ["Өдөр бүр нэг догол мөр бич.", "Холбох үгсийг зөв ашиглаж сур.", "Жишээгээ илүү тодорхой болго."],
    summary: "Таны эссе сэдэвт нийцсэн боловч санаа дэлгэрэнгүй биш байна.",
  };
  return { ...base, ...over };
}

function makeDeps({ aiReplies, dailyLimit = 3, user = { id: "u1" } } = {}) {
  const rows = [];
  const usage = [];
  let aiCalls = 0;
  const replies = [...(aiReplies || [])];
  const deps = {
    rows, usage,
    get aiCalls() { return aiCalls; },
    config: { provider: "anthropic", model: "test-model", dailyLimit, priceIn: "3", priceOut: "15" },
    getUser: async (t) => (t === "good" ? user : null),
    ai: { complete: async () => { aiCalls++; const r = replies.shift(); if (r instanceof Error) throw r; return { text: typeof r === "string" ? r : JSON.stringify(r), inputTokens: 1500, outputTokens: 2500, model: "test-model", provider: "anthropic" }; } },
    db: {
      failStalePending: async (uid, before) => { rows.filter((r) => r.user_id === uid && r.status === "pending" && r.created_at < before).forEach((r) => (r.status = "failed")); },
      findByRequest: async (uid, rid) => rows.find((r) => r.user_id === uid && r.request_id === rid) || null,
      findCompletedByHash: async (uid, tid, h) => rows.find((r) => r.user_id === uid && r.task_id === tid && r.essay_hash === h && r.status === "completed") || null,
      countRecent: async (uid) => rows.filter((r) => r.user_id === uid && ["completed", "pending"].includes(r.status)).length,
      countRecentFailed: async (uid) => rows.filter((r) => r.user_id === uid && r.status === "failed").length,
      insertPending: async (row) => {
        if (rows.some((r) => r.user_id === row.user_id && r.status === "pending")) return { id: null, conflict: true };
        const r = { ...row, id: "id" + (rows.length + 1), status: "pending", created_at: new Date().toISOString() };
        rows.push(r); return { id: r.id };
      },
      reopen: async (id, row) => { const r = rows.find((x) => x.id === id); Object.assign(r, row, { status: "pending", error: null }); return { id }; },
      complete: async (id, patch) => { const r = rows.find((x) => x.id === id); Object.assign(r, patch, { status: "completed" }); return r; },
      fail: async (id, msg) => { const r = rows.find((x) => x.id === id); r.status = "failed"; r.error = msg; },
      logUsage: async (row) => usage.push(row),
    },
  };
  return deps;
}

const submit = (deps, essay, extra = {}, token = "good") => evaluateEssay({ token, body: { ...TASK, essayText: essay, requestId: RID(), ...extra } }, deps);

test("strong essay: stored, bands validated, overall computed server-side, Mongolian, usage logged", async () => {
  const d = makeDeps({ aiReplies: [aiJson(STRONG, { overallBand: 9 })] });
  const r = await submit(d, STRONG);
  assert.equal(r.status, 200);
  assert.equal(r.body.assessment.result.overallBand, 6); // AI's claimed 9 ignored
  assert.equal(r.body.assessment.result.aiEstimated, true);
  assert.equal(d.rows[0].status, "completed");
  assert.equal(d.rows[0].band_task, 6);
  assert.equal(d.usage.at(-1).status, "ok");
  assert.ok(d.rows[0].est_cost_usd > 0);
});

test("weak / incomplete essays still assessed; irrelevant essay caps Task Response at 2", async () => {
  const d1 = makeDeps({ aiReplies: [aiJson(WEAK)] });
  assert.equal((await submit(d1, WEAK + " " + WEAK)).status, 200);
  const inc = INCOMPLETE + " " + INCOMPLETE;
  const d2 = makeDeps({ aiReplies: [aiJson(inc)] });
  assert.equal((await submit(d2, inc)).status, 200);
  const irr = IRRELEVANT + " " + IRRELEVANT;
  const j = aiJson(irr, { relevance: "off_topic" });
  j.criteria.taskResponse.band = 5.5;
  const d3 = makeDeps({ aiReplies: [j] });
  const r = await submit(d3, irr);
  assert.equal(r.body.assessment.result.criteria.taskResponse.band, 2);
  assert.equal(r.body.assessment.result.relevance, "off_topic");
});

test("fabricated quotes and corrections are dropped, real ones kept", () => {
  const essay = WEAK + " " + WEAK;
  const j = aiJson(essay);
  j.criteria.grammar.evidence.push({ quote: "this sentence is not in the essay at all", comment: "Монгол тайлбар." });
  j.corrections.push({ original: "I has went to school", improved: "I went to school", explanation: "Үйл үгийн цаг буруу." });
  j.corrections.push({ original: "Technology is good.", improved: "Technology is good.", explanation: "Адил." });
  const v = validateAssessment(j, essay);
  assert.equal(v.ok, true);
  assert.equal(v.result.criteria.grammar.evidence.length, 1);
  assert.equal(v.dropped.evidence, 1);
  assert.equal(v.result.corrections.length, 1);
  assert.equal(v.dropped.corrections, 2);
});

test("rejects bad bands, English-only feedback, too few recommendations", () => {
  const essay = STRONG;
  const bad = aiJson(essay); bad.criteria.grammar.band = 6.3;
  assert.equal(validateAssessment(bad, essay).ok, false);
  const eng = aiJson(essay, { summary: "This essay is fine overall.", recommendations: ["Write more.", "Read more.", "Practise more."] });
  eng.corrections = [];
  assert.match(validateAssessment(eng, essay).reason, /Mongolian/);
  assert.equal(validateAssessment(aiJson(essay, { recommendations: ["нэг", "хоёр"] }), essay).ok, false);
});

test("invalid first reply triggers exactly one retry; both usages logged and summed", async () => {
  const d = makeDeps({ aiReplies: ["not json at all", aiJson(STRONG)] });
  const r = await submit(d, STRONG);
  assert.equal(r.status, 200);
  assert.equal(d.aiCalls, 2);
  assert.equal(d.rows[0].input_tokens, 3000);
  assert.deepEqual(d.usage.map((u) => u.status), ["invalid_output", "ok"]);
});

test("two invalid replies -> 502, failed row, no score stored", async () => {
  const d = makeDeps({ aiReplies: ["nope", "still nope"] });
  const r = await submit(d, STRONG);
  assert.equal(r.status, 502);
  assert.equal(d.rows[0].status, "failed");
  assert.equal(d.rows[0].overall_band, undefined);
});

test("provider error -> 502, essay saved as failed, same request id can be retried safely", async () => {
  const d = makeDeps({ aiReplies: [new Error("boom"), aiJson(STRONG)] });
  const id = RID();
  const a = await evaluateEssay({ token: "good", body: { ...TASK, essayText: STRONG, requestId: id } }, d);
  assert.equal(a.status, 502);
  assert.equal(d.usage.at(-1).status, "provider_error");
  const b = await evaluateEssay({ token: "good", body: { ...TASK, essayText: STRONG, requestId: id } }, d);
  assert.equal(b.status, 200);
  assert.equal(d.rows.length, 1); // re-opened, not duplicated
});

test("duplicate request id / identical essay never calls the AI twice", async () => {
  const d = makeDeps({ aiReplies: [aiJson(STRONG)] });
  const id = RID();
  const a = await evaluateEssay({ token: "good", body: { ...TASK, essayText: STRONG, requestId: id } }, d);
  const b = await evaluateEssay({ token: "good", body: { ...TASK, essayText: STRONG, requestId: id } }, d);
  const c = await submit(d, "  " + STRONG.toUpperCase() + "  "); // same essay, new request id
  assert.equal(d.aiCalls, 1);
  assert.equal(b.body.cached, true);
  assert.equal(c.body.cached, true);
  assert.equal(a.body.assessment.id, c.body.assessment.id);
});

test("auth, validation and rate limit", async () => {
  const d = makeDeps({ aiReplies: [aiJson(STRONG), aiJson(STRONG + " a"), aiJson(STRONG + " b"), aiJson(STRONG + " c")], dailyLimit: 3 });
  assert.equal((await submit(d, STRONG, {}, "bad")).status, 401);
  assert.equal((await submit(d, STRONG, {}, "")).status, 401);
  assert.equal((await submit(d, "too short")).status, 400);
  assert.equal((await submit(d, "word ".repeat(900))).status, 400);
  assert.equal((await submit(d, STRONG, { taskType: "task3" })).status, 400);
  assert.equal((await submit(d, STRONG, { requestId: "x" })).status, 400);
  assert.equal(d.aiCalls, 0);
  for (let i = 0; i < 3; i++) {
    const r = await submit(d, STRONG + " ".repeat(i) + " extra".repeat(i));
    assert.equal(r.status, 200, "attempt " + i);
  }
  const over = await submit(d, STRONG + " different ending words here to make it unique");
  assert.equal(over.status, 429);
  assert.equal(d.aiCalls, 3);
});

test("only one evaluation in flight per student", async () => {
  const d = makeDeps({ aiReplies: [aiJson(STRONG)] });
  d.rows.push({ id: "p", user_id: "u1", status: "pending", created_at: new Date().toISOString(), request_id: RID() });
  const r = await submit(d, STRONG);
  assert.equal(r.status, 409);
  assert.equal(d.aiCalls, 0);
});

test("stale pending rows are cleared so students are never stuck", async () => {
  const d = makeDeps({ aiReplies: [aiJson(STRONG)] });
  d.rows.push({ id: "old", user_id: "u1", status: "pending", created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), request_id: RID() });
  assert.equal((await submit(d, STRONG)).status, 200);
});

test("helpers: IELTS rounding, json extraction, cyrillic ratio, cost, prompt content", () => {
  assert.equal(overallBand([6, 6, 6, 6.5]), 6); // 6.125 -> 6.0
  assert.equal(overallBand([6, 6.5, 6.5, 6.5]), 6.5); // 6.375 -> 6.5
  assert.equal(overallBand([6.5, 7, 7, 7]), 7); // 6.875 -> 7.0
  assert.equal(overallBand([5.5, 6, 6, 6.5]), 6); // 6.0
  assert.equal(overallBand([6, 6, 6.5, 6.5]), 6.5); // 6.25 -> 6.5
  assert.equal(overallBand([6.5, 7, 7, 7.5]), 7); // 7.0 -> 7; check 7.0 exact
  assert.deepEqual(extractJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(extractJson('Here: {"a":2} thanks'), { a: 2 });
  assert.equal(extractJson("nothing"), null);
  assert.ok(cyrillicRatio("Сайн байна уу") > 0.99);
  assert.ok(cyrillicRatio("hello") === 0);
  assert.equal(estimateCostUsd(1000000, 1000000, "3", "15"), 18);
  assert.equal(estimateCostUsd(10, 10, undefined, undefined), null);
  assert.match(SYSTEM_PROMPT, /MONGOLIAN CYRILLIC/);
  assert.match(SYSTEM_PROMPT, /NEVER invent grammar mistakes/);
  assert.match(buildUserMessage({ taskType: "task1", taskPrompt: "p", taskData: "TABLE", minWords: 150, wordCount: 10, essayText: "e" }), /TABLE/);
});

test("validateRequest limits", () => {
  assert.ok(validateRequest({ ...TASK, essayText: STRONG, requestId: RID() }).value);
  assert.ok(validateRequest({ ...TASK, essayText: STRONG, requestId: RID(), taskData: "x".repeat(3000) }).error);
});

test("gemini adapter: request shape, parsing, token accounting (mocked fetch)", async () => {
  const { callGemini, DEFAULT_MODELS, KEY_NAMES } = await import("../supabase/functions/evaluate-essay/index.ts");
  assert.equal(DEFAULT_MODELS.gemini, "gemini-2.5-flash");
  assert.equal(KEY_NAMES.gemini, "GEMINI_API_KEY");
  let seen;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    seen = { url, init };
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"a":' }, { text: "1}" }] } }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 20, thoughtsTokenCount: 5 }, modelVersion: "gemini-x" }), { status: 200 });
  };
  try {
    const r = await callGemini({ apiKey: "K", model: "gemini-2.5-flash", system: "S", user: "U" });
    assert.equal(r.text, '{"a":1}');
    assert.equal(r.inputTokens, 10);
    assert.equal(r.outputTokens, 25);
    assert.equal(r.provider, "gemini");
    assert.match(seen.url, /models\/gemini-2\.5-flash:generateContent$/);
    assert.equal(seen.init.headers["x-goog-api-key"], "K");
    assert.ok(!seen.url.includes("K"), "key must not be in the URL");
    const body = JSON.parse(seen.init.body);
    assert.equal(body.generationConfig.responseMimeType, "application/json");
    assert.equal(body.systemInstruction.parts[0].text, "S");
    globalThis.fetch = async () => new Response("quota", { status: 429 });
    await assert.rejects(() => callGemini({ apiKey: "K", model: "m", system: "S", user: "U" }), /Gemini 429/);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("gemini: retired model (404) falls back to newest available flash model", async () => {
  const { callGemini } = await import("../supabase/functions/evaluate-essay/index.ts");
  const urls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    urls.push(String(url));
    if (String(url).includes("gemini-2.5-flash:generateContent")) return new Response("gone", { status: 404 });
    if (String(url).includes("/models?")) return new Response(JSON.stringify({ models: [
      { name: "models/gemini-2.5-flash", supportedGenerationMethods: ["generateContent"] },
      { name: "models/gemini-3.0-flash", supportedGenerationMethods: ["generateContent"] },
      { name: "models/gemini-3.0-flash-lite", supportedGenerationMethods: ["generateContent"] },
      { name: "models/embedding-001", supportedGenerationMethods: ["embedContent"] } ] }), { status: 200 });
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "{}" }] } }], usageMetadata: {} }), { status: 200 });
  };
  try {
    const r = await callGemini({ apiKey: "K", model: "gemini-2.5-flash", system: "S", user: "U" });
    assert.equal(r.text, "{}");
    assert.ok(urls.at(-1).includes("gemini-3.0-flash:generateContent"));
  } finally { globalThis.fetch = realFetch; }
});

test("missing table / db failure is reported as db_error, not 'in progress'", async () => {
  const d = makeDeps({ aiReplies: [] });
  d.db.insertPending = async () => ({ id: null, error: 'relation "writing_assessments" does not exist', conflict: false });
  const r = await submit(d, STRONG);
  assert.equal(r.status, 500);
  assert.equal(r.body.code, "db_error");
  assert.match(r.body.detail, /does not exist/);
  assert.equal(d.aiCalls, 0);
});

test("provider errors expose a short detail for the owner", async () => {
  const d = makeDeps({ aiReplies: [new Error("Gemini 400: API key not valid")] });
  const r = await submit(d, STRONG);
  assert.equal(r.body.code, "provider_error");
  assert.match(r.body.detail, /API key not valid/);
});
