import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import { BADGES } from '../utils/achievements';
import styles from './Result.module.css';
import SavePromptModal from '../components/SavePromptModal';
import { usePromptLibrary } from '../hooks/usePromptLibrary';

const PLATFORM_EMOJIS = {
  chatgpt: '🤖',
  gemini: '✨',
  claude: '🧠',
  copilot: '💻',
  perplexity: '🔍',
  grok: '⚡',
  mistral: '🌊',
  meta: '🎭',
  deepseek: '🌀',
  poe: '🎨',
};

const PLATFORM_LABELS = {
  chatgpt: 'ChatGPT',
  gemini: 'Gemini',
  claude: 'Claude',
  copilot: 'Copilot',
  perplexity: 'Perplexity',
  grok: 'Grok',
  mistral: 'Mistral',
  meta: 'Meta AI',
  deepseek: 'DeepSeek',
  poe: 'Poe',
};

const PLATFORM_URLS = {
  chatgpt: 'https://chat.openai.com',
  gemini: 'https://gemini.google.com',
  claude: 'https://claude.ai',
  copilot: 'https://copilot.microsoft.com',
  perplexity: 'https://www.perplexity.ai',
  grok: 'https://grok.x.com',
  mistral: 'https://chat.mistral.ai',
  meta: 'https://www.meta.ai',
  deepseek: 'https://chat.deepseek.com',
  poe: 'https://poe.com',
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt, platform, task, subject, xpGained, newBadges, totalXP } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { addPrompt } = usePromptLibrary();

  useEffect(() => {
    if (!prompt) { navigate('/setup'); return; }
    const t = setTimeout(() => setShowXP(true), 300);
    return () => clearTimeout(t);
  }, [prompt, navigate]);

  function handleCopy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleOpenInAI() {
    navigator.clipboard.writeText(prompt).then(() => {
      window.open(PLATFORM_URLS[platform] || 'https://chat.openai.com', '_blank');
    });
  }

  const handleSavePrompt = (promptData) => {
    addPrompt({
      ...promptData,
      content: prompt,
    });
    setShowSaveModal(false);
  };

  if (!prompt) return null;

  const platformEmoji = PLATFORM_EMOJIS[platform] || '🤖';
  const platformLabel = PLATFORM_LABELS[platform] || platform;
  const xpFormatted = xpGained ? xpGained.toLocaleString() : 0;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButtonHeader} onClick={() => navigate('/setup')} title="Back to Setup">
          ← Setup
        </button>
        <div className={styles.headerRight}>
          <XPBar xp={totalXP || 0} />
          <Link to="/badges" className={styles.badgesLink} title="View badges">🏅</Link>
          <Link to="/my-prompts" className={styles.badgesLink} title="My Prompts">📚</Link>
          <ThemePicker />
        </div>
      </header>

      <main className={styles.main}>
        {showXP && (
          <div className={`${styles.xpToast} ${showXP ? styles.xpVisible : ''}`}>
            <span className={styles.xpAmount}>+{xpFormatted} XP</span>
            {newBadges && newBadges.length > 0 && (
              <div className={styles.newBadges}>
                {newBadges.map(badge => {
                  const badgeObj = BADGES.find(b => b.id === badge.id);
                  return badgeObj ? (
                    <span key={badge.id} className={styles.newBadge}>
                      {badgeObj.emoji} {badgeObj.label} unlocked!
                    </span>
                  ) : null;
                })}
              </div>
            )}
          </div>
        )}

        <div className={styles.intro}>
          <h1 className={styles.title}>Your prompt is ready.</h1>
          <p className={styles.subtitle}>
            Generated for <strong>{platformEmoji} {platformLabel}</strong>. Copy it and paste it as the first message in a new chat.
          </p>
        </div>

        <div className={styles.promptBox}>
          <div className={styles.promptHeader}>
            <span className={styles.promptLabel}>Generated Prompt</span>
            <span className={styles.promptLength}>{prompt.length.toLocaleString()} chars</span>
          </div>
          <pre className={styles.promptContent}>{prompt}</pre>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : '⎘ Copy Prompt'}
          </button>
          <button className={styles.saveBtn} onClick={() => setShowSaveModal(true)}>
            🔖 Save Prompt
          </button>
          <button className={styles.openBtn} onClick={handleOpenInAI}>
            Open in {platformLabel} →
          </button>
        </div>

        <p className={styles.openHint}>
          "Open in {platformLabel}" copies the prompt to your clipboard and opens {platformLabel} in a new tab. Just paste when you get there.
        </p>

        <button className={styles.backLink} onClick={() => navigate('/setup')}>
          ← Build another prompt
        </button>
      </main>

      <SavePromptModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSavePrompt}
        promptData={{
          platform: platform,
          taskType: task,
          subject: subject,
        }}
      />
    </div>
  );
}