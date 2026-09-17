// ScholarCompass — IELTS Writing Task 2 evaluator
//
// This runs server-side on Supabase, never in the browser, which is the
// whole point: ANTHROPIC_API_KEY lives only in this function's environment
// (set via `supabase secrets set`), so it's never visible in the site's
// frontend bundle or network tab.
//
// Deploy with: supabase functions deploy evaluate-essay
// Call from the frontend with: supabase.functions.invoke("evaluate-essay", { body: {...} })

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an experienced IELTS Writing Task 2 examiner. Score the given essay strictly according to the official IELTS band descriptors, across these four criteria:
- Task Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

Each criterion gets a band from 0 to 9 in 0.5 increments, scored independently and honestly — do not inflate scores to be encouraging. The overall band is the average of the four criteria, rounded to the nearest 0.5 (rounding .25 down and .75 up, matching standard IELTS rounding).

Respond with ONLY valid JSON — no markdown formatting, no code fences, no commentary before or after — in exactly this shape:

{
  "overallBand": 6.5,
  "wordCount": 267,
  "criteria": {
    "taskResponse": { "band": 6.5, "notes": ["specific point referencing the essay", "specific point referencing the essay"] },
    "coherenceCohesion": { "band": 6.5, "notes": ["...", "..."] },
    "lexicalResource": { "band": 6.5, "notes": ["...", "..."] },
    "grammar": { "band": 6.5, "notes": ["...", "..."] }
  },
  "summary": "One or two sentence overall assessment."
}

Each "notes" array must have 2-3 short, specific, actionable points. Where possible, reference or quote a specific phrase from the essay rather than giving generic advice. Count the words in the essay yourself for "wordCount".`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskPrompt, essayText } = await req.json();

    if (!taskPrompt || typeof taskPrompt !== "string") {
      return jsonResponse({ error: "Missing task prompt." }, 400);
    }

    const wordCount = (essayText || "").trim().split(/\s+/).filter(Boolean).length;
    if (!essayText || wordCount < 50) {
      return jsonResponse(
        { error: "Essay is too short to evaluate meaningfully. Write at least 50 words." },
        400
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Evaluator is not configured (missing API key)." }, 500);
    }

    const userMessage = `Essay prompt:\n${taskPrompt}\n\nStudent's essay:\n${essayText}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const detail = await anthropicRes.text();
      console.error("Anthropic API error:", detail);
      return jsonResponse({ error: "The evaluator service failed. Try again shortly." }, 502);
    }

    const data = await anthropicRes.json();
    const rawText = data?.content?.[0]?.text ?? "";

    let result;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch (parseErr) {
      console.error("Failed to parse model output:", rawText);
      return jsonResponse({ error: "Could not parse the evaluation result. Try again." }, 502);
    }

    return jsonResponse(result, 200);
  } catch (err) {
    console.error("evaluate-essay unexpected error:", err);
    return jsonResponse({ error: "Unexpected server error." }, 500);
  }
});

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
