# Aida

> Stop writing AI instructions from scratch every time you open a new chat.

Aida is a prompt generator built for students. Tell it your platform, subject, task, and vibe — and it uses AI to write you a detailed, tailored system prompt you can paste directly into ChatGPT, Claude, Gemini, or any other AI. No prompt engineering knowledge needed.

![Aida](https://img.shields.io/badge/built%20for-students-7c6aff?style=flat-square) ![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite) ![Groq](https://img.shields.io/badge/powered%20by-Groq-f55036?style=flat-square)

---

## What it does

You fill in a short setup form. Aida sends your choices to Groq's API (running Llama 3.3 70B) which writes a proper, elaborate system prompt — with a persona, subject-specific guidance, tone, behaviour rules, and an opening message. The whole thing takes about 2 seconds.

The prompts it generates are 400–600 words, purpose-built for your exact subject and platform. Way better than anything you'd write yourself in 30 seconds.

---

## Features

- **10 AI platforms** — ChatGPT, Claude, Gemini, Copilot, Perplexity, Grok, Mistral, Meta AI, DeepSeek, Poe
- **6 task types** — Test Prep, Assignment Review, Quick Answers, Essay Feedback, Explain Concepts, Practice Problems
- **Tone slider** — Formal & Academic → Full Gen-Z Chill Mode
- **Behaviour toggles** — step-by-step, cite sources, don't repeat, always give examples, check understanding
- **File upload** — upload your notes (PDF, DOCX, PPTX, TXT, MD, CSV) and they get injected into the prompt
- **Custom instructions** — tell it anything extra about how you learn
- **XP & Badges** — 25 levels, 14 badges, daily streaks
- **Themes** — dark, light, forest, midnight, rose, pink, pride, trans, and more
- **Groq-powered** — real AI writes your prompt, not a template

---

## Quick Start
> Note: A Groq API key is included for demo purposes. For your own deployment, replace it in `src/utils/groqApi.js` or use your own free key from console.groq.com
```bash
git clone https://github.com/shahmerrkhan/aida.git
cd aida
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Tech Stack

- React 18 + Vite
- React Router
- CSS Modules with full theme system
- Groq API (llama-3.3-70b-versatile)
- PDF.js + Mammoth for file parsing
- localStorage for all state — zero backend

---

## Project Structure

```
src/
├── components/
│   ├── GeneratingAnimation.jsx
│   ├── Logo.jsx
│   ├── ThemePicker.jsx
│   ├── XPBar.jsx
│   └── Stats.jsx
├── context/
│   └── ThemeContext.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Setup.jsx
│   ├── Result.jsx
│   └── Badges.jsx
├── utils/
│   ├── groqApi.js       ← Groq integration + prompt engineering
│   ├── achievements.js
│   ├── buildPrompt.js
│   └── fileParser.js
├── App.jsx
└── index.css
```

---

## How the prompt generation works

1. You fill in the setup form (platform, task, subject, vibe, toggles, notes)
2. Aida builds a detailed meta-prompt describing exactly what kind of system prompt is needed
3. That meta-prompt gets sent to Groq's `llama-3.3-70b-versatile` model
4. Groq returns a 400–600 word system prompt with a full AI persona, subject expertise, tone examples, behaviour rules, and an opening message
5. You copy it and paste it into your AI of choice

---

## XP System

| Action | XP |
|---|---|
| Generate a prompt | +10 XP |
| Upload notes | +5 XP |
| First time using a platform | +5 XP |
| Daily streak | +3 XP |

25 levels with balanced progression. Badges unlock for consistency, variety, and milestones.

---

## Themes

Edit CSS variables in `src/index.css` to customise any theme. Each theme is a single `[data-theme="x"]` block.

---

## Browser Support

Chrome, Firefox, Safari (latest 2 versions). All data lives in localStorage — zero accounts, zero backend.

---

## Contributing

Got ideas or found a bug? Open an issue or DM on Instagram.

---

## License

MIT

---

*Built by a student, for students.*
