/**
 * Groq API Integration for Aida
 * Generates elaborate, detailed AI study prompts using Groq
 */

// ⚠️  ONE key only — no duplicates or the app crashes
const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generatePromptWithGroq({
  platform,
  task,
  subject,
  topic,
  vibeLevel,
  fileContent,
  toggles,
  customInstructions,
  promptMode = 'detailed',
})
{
  if (!GROQ_API_KEY) throw new Error('NO_KEY');

  const vibeDescription =
    vibeLevel < 25 ? "very formal, academic, and precise — use proper terminology, structured responses, no slang whatsoever" :
    vibeLevel < 50 ? "clear and professional but approachable — explain things clearly without being stiff or robotic" :
    vibeLevel < 75 ? "casual and conversational, like a knowledgeable friend tutoring you — warm, relatable, encouraging" :
                     "super casual and gen-z — naturally use words like 'lowkey', 'ngl', 'fire', 'no cap', 'bet', 'fr' — make studying feel fun not painful";

  const platformNotes = {
    chatgpt:    "ChatGPT (OpenAI) — use markdown formatting with headers, bullet points, and numbered steps. Structure responses clearly.",
    gemini:     "Gemini (Google) — connect ideas across domains, use analogies, encourage visual and multi-modal thinking.",
    claude:     "Claude (Anthropic) — lean into nuanced multi-step reasoning. Claude handles long, layered instructions exceptionally well.",
    copilot:    "Microsoft Copilot — professional structured tone. Use bullet points and clear section headers throughout.",
    perplexity: "Perplexity — cite sources, distinguish established facts from open questions, and encourage verification.",
    grok:       "Grok (xAI) — witty and direct. Keep responses punchy but substantive.",
    mistral:    "Mistral AI — clear, efficient, technically precise. Excellent at structured logical reasoning.",
    meta:       "Meta AI — conversational and approachable. Great for step-by-step walkthroughs.",
    deepseek:   "DeepSeek — excellent for STEM subjects. Encourage detailed mathematical or logical breakdowns with full working shown.",
    poe:        "Poe — flexible platform. Optimise for clarity, depth, and reusability across sessions.",
  };

  const taskInstructions = {
    test_prep:         "helping the student prepare for an upcoming test or exam. Your approach: actively quiz them with exam-style questions, diagnose and target weak spots, explain concepts they're shaky on with layered depth, simulate real exam conditions, and track what they've covered.",
    assignment_review: "reviewing and giving detailed, actionable feedback on the student's assignments. Your approach: identify what's strong and why, what's weak and exactly how to fix it, what a distinction-level answer looks like, and give concrete rewrite suggestions with examples.",
    quick_answers:     "giving fast, accurate, no-fluff answers to specific questions. Your approach: answer directly and completely, anticipate the follow-up question they probably have, and flag any common misconceptions related to the question.",
    essay_feedback:    "reading and deeply critiquing essays. Your approach: evaluate thesis clarity, argument structure, evidence quality, paragraph transitions, writing style, and academic voice. Give specific line-level rewrites, not just vague suggestions.",
    explain_concept:   "explaining concepts from scratch assuming zero prior knowledge. Your approach: build understanding layer by layer, use at least two different analogies per concept, connect to things the student already knows, and check understanding as you go.",
    practice_problems: "generating and walking through practice problems at increasing difficulty. Your approach: start easy to build confidence, progressively increase difficulty, show complete worked solutions with every step explained, and explain the reasoning behind each step not just the mechanics.",
    study_session: "running an interactive back-and-forth study session. Your approach: open by asking what topic the student wants to cover, then quiz them one question at a time — never more than one at once. After each answer give specific feedback on what was right and wrong and why. Track weak spots and revisit them. Never just give the answer unprompted — guide them to it. Always end your response with the next question or a prompt to continue.",
  };

  const toggleLines = Object.entries(toggles || {})
    .filter(([, v]) => v)
    .map(([k]) => ({
      shortAnswers:    "• Keep answers tight and concise — say it in the fewest words possible without losing meaning",
      dontRepeat:      "• Never repeat the student's question before answering — just answer immediately",
      citeSource:      "• Always cite your reasoning: name the theorem, law, rule, or framework you're drawing from",
      stepByStep:      "• Always break down explanations into clearly numbered steps — skip no steps even obvious ones",
      examplesAlways:  "• Every single explanation must include at least one concrete real-world or worked example",
      checkUnderstand: "• At the end of every response, ask one precise follow-up question to confirm the student understood",
    }[k]))
    .filter(Boolean)
    .join("\n");

  const notesSection = fileContent
    ? `\n\nThe student has uploaded their personal study notes and materials. These are your PRIMARY reference — quote from them, connect your explanations directly to them, and treat them as ground truth for this session:\n"""\n${fileContent.slice(0, 6000)}\n"""`
    : "";

  const customSection = customInstructions
    ? `\n\nHigh-priority personal instructions from the student (always follow these):\n${customInstructions}`
    : "";

  const platformContext = platformNotes[platform] || platform;
  const taskContext = taskInstructions[task] || task;
  

const metaPrompt = promptMode === 'quick'
  ? `You are a prompt engineer. Create a SHORT, focused system prompt for an AI study assistant.

    OUTPUT RULES:
    - Output ONLY the raw system prompt text, nothing else
    - No preamble, no code fences, no explanation
    - Start with "You are..."
    - Maximum 150 words — be concise and direct

    STUDENT'S REQUIREMENTS:
    Platform: ${platformContext}
    Task: ${taskContext}
    Subject: ${subject}${topic ? `\nTopic: ${topic}` : ''}
    Tone: ${vibeDescription}
    ${toggleLines ? `Rules:\n${toggleLines}` : ''}${notesSection}${customSection}

    Write a tight, punchy system prompt that gets straight to the point. No fluff.`
      : `You are a world-class prompt engineer creating a detailed system prompt for an AI study assistant. A student will paste your output directly into ${platformContext}.

    OUTPUT RULES — critical:
    - Output ONLY the raw system prompt text. Nothing else.
    - No preamble like "Here is your prompt:" 
    - No markdown code fences (no triple backticks)
    - No explanation after the prompt
    - Start immediately with "You are..."

    STUDENT'S REQUIREMENTS:
    Platform: ${platformContext}
    Task: The AI must specialise in ${taskContext}
    Subject: ${subject}${topic ? `\nSpecific topic (go deep on this): ${topic}` : ""}
    Tone: ${vibeDescription}
    ${toggleLines ? `\nNon-negotiable behaviour rules:\n${toggleLines}` : ""}${notesSection}${customSection}

    WHAT THE SYSTEM PROMPT MUST CONTAIN (all of these, in order):
    1. A strong "You are..." opening that establishes a specific, vivid AI persona purpose-built for this exact student, subject, and task — NOT a generic tutor
    2. A clear explanation of the AI's primary job and how it should approach this specific subject area
    3. Subject-specific expertise section: key frameworks, common student misconceptions to actively watch for and correct, what mastery looks like in ${subject}
    4. Explicit tone and communication style with 2-3 examples of what that sounds like in practice (show, don't just tell)
    5. All behaviour rules listed clearly with no ambiguity
    6. How to handle situations where the student is stuck, confused, or getting something wrong
    7. A warm, on-brand opening message the AI will use to greet the student — written in the correct tone, referencing the subject
    8. The prompt must be at least 450 words — thorough enough that the AI has zero ambiguity

    Write entirely in second person ("You are...", "You will...", "Your job is..."). Make it feel hand-crafted for THIS student, not templated.`;
    
    const studySessionAddOn = task === 'study_session' ? `

    CRITICAL STUDY SESSION RULES (override everything else if there is a conflict):
    - Open the session by warmly greeting the student and asking what specific topic or concept they want to work on today
    - Ask ONE question at a time — never two or more
    - After the student answers, give clear feedback: what they got right, what they got wrong, and why
    - Never reveal the full answer before the student attempts it — only guide them
    - Keep track of which concepts the student is struggling with and loop back to them
    - End every single response with either the next question or an explicit prompt to keep the session going
    - Make the session feel like a real tutoring conversation, not a quiz sheet
    ` : '';

      const finalPrompt = metaPrompt + studySessionAddOn;

    const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.75,
      max_tokens: 1800,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('INVALID_KEY');
    if (response.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(error.error?.message || 'API Error');
  }

  const data = await response.json();
  const generatedPrompt = data.choices[0]?.message?.content?.trim();
  if (!generatedPrompt) throw new Error('No prompt generated');
  return generatedPrompt;
}