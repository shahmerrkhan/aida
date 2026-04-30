# Aida — AI Prompt Builder for Students

Aida helps students get better results from AI tools by building structured, tailored prompts instead of typing the same vague questions every session.

Pick your platform, set your task and subject, tune the tone, drop in your notes, and Aida generates a prompt optimized for how that specific AI works.

**Live:** https://aida-f1cm.vercel.app

---

## What it does

- Builds prompts tailored to ChatGPT, Claude, Gemini, Perplexity, Grok, and more
- Accepts uploaded notes (PDF, Word, PPTX, plain text) and injects them into the prompt
- Lets you set tone, preferences (step-by-step, cite sources, short answers, etc.), and prompt style
- Saves presets for your most-used setups
- Tracks XP, levels, streaks, and badges to make repeated use feel rewarding
- Prompt history so you never lose a good setup
- Share prompts via link, WhatsApp, email, or Twitter
- Full Supabase auth with cloud sync across devices
- In-app feedback via the floating button (bottom-right corner on every page)

---

## Tech stack

- React + Vite
- Supabase (auth + database)
- Groq API (prompt generation via Llama)
- Vercel (deployment)
- CSS Modules

---

## Running locally

1. Clone the repo

```bash
git clone https://github.com/shahmerrkhan/aida.git
cd aida
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key

4. Start the dev server

```bash
npm run dev
```

---

## Project structure
src/
components/     Reusable UI (XPBar, Logo, ThemePicker, FeedbackWidget, etc.)
context/        Auth, Theme, XP providers
hooks/          usePromptLibrary
pages/          Landing, Setup, Result, Templates, Badges, MyPrompts, Auth
utils/          Groq API, Supabase client, achievements, file parser, sync

---

## Status

Active development. Built by Shahmeer — Grade 11, St. Benedict CSS, Cambridge ON.

Feedback welcome via the in-app 💬 button or by opening a GitHub issue.