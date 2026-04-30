import { useNavigate, Link } from 'react-router-dom';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import { useXP } from '../context/XPContext';
import styles from './Templates.module.css';

const TEMPLATES = [
  {
    id: 'exam_cram',
    emoji: '🧠',
    label: 'Exam Cram — Last Night',
    desc: 'You have one night. Get the most important stuff only.',
    platform: 'chatgpt',
    task: 'test_prep',
    subject: 'Biology',
    topic: '',
    vibeLevel: 65,
    promptMode: 'quick',
    toggles: {
      shortAnswers: true,
      dontRepeat: true,
      citeSource: false,
      stepByStep: false,
      examplesAlways: false,
      checkUnderstand: true,
    },
    customInstructions: 'I have one night to study. Give me the highest-yield topics only — the stuff most likely to appear on the exam. Use bullet points, keep it tight, no filler.',
  },
  {
    id: 'essay_structure',
    emoji: '✍️',
    label: 'Fix My Essay Structure',
    desc: 'Thesis, flow, transitions — the stuff teachers actually mark',
    platform: 'claude',
    task: 'essay_feedback',
    subject: 'English',
    topic: '',
    vibeLevel: 40,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: false,
      stepByStep: true,
      examplesAlways: false,
      checkUnderstand: false,
    },
    customInstructions: 'Focus only on structure: thesis strength, topic sentence clarity, paragraph flow, and transitions. Do not rewrite my sentences — point out what is weak and explain why. Be direct.',
  },
  {
    id: 'math_stuck',
    emoji: '📐',
    label: 'I Am Stuck on This Problem',
    desc: 'Walk me through it without just giving me the answer',
    platform: 'claude',
    task: 'practice_problems',
    subject: 'Math',
    topic: '',
    vibeLevel: 45,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: false,
      stepByStep: true,
      examplesAlways: true,
      checkUnderstand: true,
    },
    customInstructions: 'Do not give me the answer directly. Walk me through the method step by step and let me try each step before moving on. If I get something wrong, explain where my thinking broke down.',
  },
  {
    id: 'concept_simple',
    emoji: '💡',
    label: 'Explain It Like I Am 12',
    desc: 'No jargon, just the actual idea',
    platform: 'gemini',
    task: 'explain_concept',
    subject: 'Physics',
    topic: '',
    vibeLevel: 75,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: false,
      stepByStep: true,
      examplesAlways: true,
      checkUnderstand: false,
    },
    customInstructions: 'Explain this like I have zero background in it. Use a real-world analogy first, then build up the actual concept from there. Avoid textbook language.',
  },
  {
    id: 'research_kickstart',
    emoji: '🔍',
    label: 'Research Paper Kickstart',
    desc: 'Outline, angles, and what to actually argue',
    platform: 'perplexity',
    task: 'assignment_review',
    subject: 'History',
    topic: '',
    vibeLevel: 35,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: true,
      stepByStep: true,
      examplesAlways: false,
      checkUnderstand: false,
    },
    customInstructions: 'Help me figure out a strong arguable thesis, not just a topic. Then give me a suggested outline with 3 body sections and the kinds of evidence I should look for in each. Point me toward specific angles that are interesting and not obvious.',
  },
  {
    id: 'vocab_test',
    emoji: '🗣️',
    label: 'Vocabulary Quiz Me',
    desc: 'Test me on terms until I actually know them',
    platform: 'chatgpt',
    task: 'test_prep',
    subject: 'Biology',
    topic: '',
    vibeLevel: 60,
    promptMode: 'quick',
    toggles: {
      shortAnswers: true,
      dontRepeat: true,
      citeSource: false,
      stepByStep: false,
      examplesAlways: false,
      checkUnderstand: true,
    },
    customInstructions: 'Quiz me on key terms one at a time. Give me the term, wait for my definition, then tell me if I got it right and what I missed. Keep going until I get everything right twice in a row.',
  },
  {
    id: 'study_plan',
    emoji: '📅',
    label: 'Build Me a Study Plan',
    desc: 'Realistic schedule based on how much time I actually have',
    platform: 'claude',
    task: 'study_session',
    subject: 'Multiple subjects',
    topic: '',
    vibeLevel: 50,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: false,
      stepByStep: true,
      examplesAlways: false,
      checkUnderstand: false,
    },
    customInstructions: 'Ask me how many days I have and which subjects need the most work. Then build a realistic day-by-day plan with specific focus areas per session. Do not assume I have 6 free hours a day.',
  },
  {
    id: 'code_debug',
    emoji: '🐛',
    label: 'Debug My Code',
    desc: 'Find what is broken and explain why',
    platform: 'claude',
    task: 'assignment_review',
    subject: 'Computer Science',
    topic: '',
    vibeLevel: 40,
    promptMode: 'detailed',
    toggles: {
      shortAnswers: false,
      dontRepeat: true,
      citeSource: false,
      stepByStep: true,
      examplesAlways: true,
      checkUnderstand: false,
    },
    customInstructions: 'I will paste my code. Find the bug, explain exactly why it is happening, and show me the fix. Then tell me one thing I can do differently to avoid this kind of mistake going forward.',
  },
];

export default function Templates() {
  const navigate = useNavigate();
  const { xp } = useXP();

  function handleUse(template) {
  navigate('/setup', {
    state: {
      preset: {
        platform: template.platform,
        taskType: template.task,
        subject: template.subject,
        topic: template.topic,
        vibeLevel: template.vibeLevel,
        promptMode: template.promptMode,
        toggles: template.toggles,
        customInstructions: template.customInstructions,
      },
    },
  });
}

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/setup" className={styles.backBtn}>← Back to Setup</Link>
        <div className={styles.headerRight}>
          <XPBar xp={xp} />
          <ThemePicker />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Templates</h1>
          <p className={styles.subtitle}>Pre-built setups for the most common study situations. Pick one and go.</p>
        </div>

        <div className={styles.grid}>
          {TEMPLATES.map(template => (
            <div key={template.id} className={styles.card}>
              <div className={styles.cardEmoji}>{template.emoji}</div>
              <div className={styles.cardInfo}>
                <div className={styles.cardLabel}>{template.label}</div>
                <div className={styles.cardDesc}>{template.desc}</div>
                <div className={styles.cardMeta}>
                  {template.platform} · {template.task.replace('_', ' ')}
                </div>
              </div>
              <button className={styles.useBtn} onClick={() => handleUse(template)}>
                Use →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}