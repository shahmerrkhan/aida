// ─────────────────────────────────────────────────────────────────────────────
//  Aida · Groq prompt generator
// ─────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;   // ← set in .env
const GROQ_MODEL   = "llama-3.3-70b-versatile";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function buildSystemPrompt(config) {
  const {
    platform,
    task,
    subject,
    topic,
    vibeLevel,
    fileContent,
    toggles = {},
    customInstructions,
  } = config;

  const vibeDescription =
    vibeLevel < 25 ? "very formal, academic, and precise — use proper terminology, no slang, structured responses" :
    vibeLevel < 50 ? "clear and professional but approachable — explain clearly without being stiff" :
    vibeLevel < 75 ? "casual and conversational, like a knowledgeable friend tutoring you — warm, relatable" :
                     "super casual and gen-z — use words like 'lowkey', 'ngl', 'fire', 'no cap', 'bet' naturally and make it feel fun";

  const platformNotes = {
    chatgpt:     "ChatGPT — structure responses with clear headers and numbered steps where useful. Use markdown formatting.",
    claude:      "Claude — lean into nuanced multi-step reasoning. Claude handles long, layered instructions well. Be thorough.",
    gemini:      "Gemini — encourage connecting ideas across domains, use analogies, and suggest visual/multi-modal thinking where helpful.",
    copilot:     "Microsoft Copilot — keep a professional, structured tone. Use bullet points and clear section headers.",
    perplexity:  "Perplexity — encourage citing sources and distinguishing between established facts vs. open questions.",
    grok:        "Grok — can be witty and direct. Keep responses punchy but informative.",
    mistral:     "Mistral — clear, efficient, technically precise responses. Good at structured reasoning.",
    meta:        "Meta AI — conversational and approachable. Great for step-by-step walkthroughs.",
    deepseek:    "DeepSeek — excellent for STEM. Encourage detailed mathematical or logical breakdowns.",
    poe:         "Poe — flexible multi-model platform. Optimise for clarity and reusability.",
  };

  const taskInstructions = {
    test_prep:         "helping the student prepare for an upcoming test or exam. Quiz them, identify weak spots, explain concepts they're shaky on, and simulate exam-style questions.",
    assignment_review: "reviewing and giving detailed feedback on the student's assignments. Point out what's strong, what's weak, how to improve it, and what a top-grade version would look like.",
    quick_answers:     "giving fast, accurate, no-fluff answers to specific questions. Be direct but make sure the answer is complete enough to actually be useful.",
    essay_feedback:    "reading and critiquing essays. Comment on thesis clarity, argument structure, evidence quality, transitions, and writing style. Give concrete rewrite suggestions.",
    explain_concept:   "explaining concepts from scratch with zero assumed knowledge. Use analogies, real-world examples, and build understanding layer by layer.",
    practice_problems: "generating and walking through practice problems. Start with simpler ones, increase difficulty, show full worked solutions, and explain every step.",
  };

  const toggleLines = Object.entries(toggles)
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels = {
        shortAnswers:    "Keep answers concise — if you can say it in 3 sentences, don't use 10",
        dontRepeat:      "Never repeat the student's question back to them before answering — just answer",
        citeSource:      "Cite your reasoning, name relevant theorems/laws/frameworks, and where appropriate mention where this is taught",
        stepByStep:      "Always break explanations into numbered steps — never skip steps even if they seem obvious",
        examplesAlways:  "Every single explanation must include at least one concrete, real-world example",
        checkUnderstand: "At the end of every response, ask one targeted question to check the student actually understood",
      };
      return labels[k] ? `• ${labels[k]}` : null;
    })
    .filter(Boolean)
    .join("\n");

  const notesSection = fileContent
    ? `\n\nThe student has uploaded their personal notes and study material. Use this as your primary reference when answering — refer to it, quote it, and connect your explanations to it:\n"""\n${fileContent.slice(0, 6000)}\n"""`
    : "";

  const customSection = customInstructions
    ? `\n\nAdditional personal instructions from the student (treat these as high priority):\n${customInstructions}`
    : "";

  const platformContext = platformNotes[platform] || platform;
  const taskContext     = taskInstructions[task]   || task;

  return `You are an expert prompt engineer who writes world-class system prompts for AI study assistants. You are writing a system prompt that a student will paste directly into ${platformContext}.

Your output must be a SINGLE complete system prompt — not an explanation, not a template, not markdown fences. Just the raw prompt text, ready to paste.

Here is everything you need to know about what this student needs:

PLATFORM: ${platformContext}
TASK: The AI should be focused on ${taskContext}
SUBJECT: ${subject}${topic ? `\nTOPIC (be specific to this): ${topic}` : ""}
TONE: ${vibeDescription}
${toggleLines ? `\nBEHAVIOUR RULES (these are non-negotiable, always follow them):\n${toggleLines}` : ""}${notesSection}${customSection}

Now write the system prompt. It must:
1. Open with "You are..." and establish a clear, specific AI persona (not generic — make it feel purpose-built for THIS student and THIS subject)
2. Explain exactly what the AI is here to help with and how it should approach the subject
3. Set the tone and communication style explicitly with examples of what that looks like in practice
4. Include specific subject-matter guidance — mention relevant frameworks, common misconceptions to watch for, what "good" looks like in this subject
5. List all behavioural rules clearly
6. End with a warm, on-brand opening message the AI should use to greet the student when they first open the chat
7. Be at least 400 words — this needs to be thorough enough that the AI has zero ambiguity about how to behave
8. Be written entirely in second person ("You are…", "You will…", "Your job is…")

Output ONLY the system prompt. No preamble. No explanation. No markdown code fences.`;
}

export async function generatePromptWithGroq(config) {
  if (!GROQ_API_KEY) throw new Error("NO_KEY");

  const userPrompt = buildSystemPrompt(config);

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      messages:    [{ role: "user", content: userPrompt }],
      max_tokens:  1500,
      temperature: 0.75,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error("INVALID_KEY");
    if (response.status === 429) throw new Error("RATE_LIMIT");
    throw new Error(err?.error?.message || `Groq error ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("EMPTY_RESPONSE");
  return text;
}