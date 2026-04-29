import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import { BADGES, getLevelInfo } from '../utils/achievements';
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

const PLATFORM_TIPS = {
  chatgpt: "Paste this as your first message in a new chat. For best results, start a fresh conversation — don't add it to an existing one.",
  gemini: "Paste this at the start of a new Gemini chat. If you're using Gemini Advanced, it'll handle the length better.",
  claude: "Claude works best with this in a new Project. Go to Projects → New Project → paste this as the system prompt for a persistent setup.",
  copilot: "Use this in Copilot's chat interface. For school work, try Microsoft Edge's built-in Copilot sidebar for quick access.",
  perplexity: "Paste this at the start of your Perplexity thread. It works best in Focus mode — turn off web search if you want pure reasoning.",
  grok: "Paste this as your opening message on grok.x.com. Grok handles casual tone really well so crank the vibe slider next time.",
  mistral: "Use Le Chat at chat.mistral.ai. Mistral is especially strong at structured reasoning so this works great for STEM.",
  meta: "Paste this on meta.ai. Meta AI works well for conversational back-and-forth so ask follow-up questions freely.",
  deepseek: "Paste this on chat.deepseek.com. For math and science, DeepSeek R1 is the model to pick — it shows full working.",
  poe: "On Poe, you can save this as a custom bot prompt so you don't have to paste it every time. Try the Bot Creator.",
};

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt, platform, task, subject, xpGained, newBadges, totalXP, leveledUp, newLevel } = location.state || {};
  const [copied, setCopied] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { addPrompt, addToHistory } = usePromptLibrary();
  const [shared, setShared] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
  if (!prompt) { navigate('/setup'); return; }
  addToHistory({ content: prompt, platform, task, subject });
  const t = setTimeout(() => setShowXP(true), 300);
  const didLevelUp = location.state?.leveledUp;
  if (didLevelUp) {
    const t2 = setTimeout(() => setShowLevelUp(true), 800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }
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
  function handleCopyLink() {
  const params = new URLSearchParams({ platform, task, subject });
  const url = `${window.location.origin}/setup?${params.toString()}`;
  navigator.clipboard.writeText(url).then(() => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  });
}

function handleCopyPromptText() {
  navigator.clipboard.writeText(prompt).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowShare(false);
  });
}

function handleShareEmail() {
  const subject = encodeURIComponent('Check out this AI study prompt');
  const body = encodeURIComponent(`I built this prompt using Aida:\n\n${prompt}\n\nTry it at: ${window.location.origin}`);
  window.open(`mailto:?subject=${subject}&body=${body}`);
}

function handleShareWhatsApp() {
  const params = new URLSearchParams({ platform, task, subject });
  const url = `${window.location.origin}/setup?${params.toString()}`;
  const text = encodeURIComponent(`Check out this AI study prompt I built on Aida: ${url}`);
  window.open(`https://wa.me/?text=${text}`);
}

function handleShareTwitter() {
  const params = new URLSearchParams({ platform, task, subject });
  const url = `${window.location.origin}/setup?${params.toString()}`;
  const text = encodeURIComponent(`Just built a fire study prompt on Aida ⚡`);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`);
}

  function handleShare() {
  const params = new URLSearchParams({
    platform: platform || '',
    task: task || '',
    subject: subject || '',
  });
  const url = `${window.location.origin}/setup?${params.toString()}`;
  navigator.clipboard.writeText(url).then(() => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
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
        {PLATFORM_TIPS[platform] && (
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>💡</span>
            <p className={styles.tipText}>{PLATFORM_TIPS[platform]}</p>
          </div>
        )}
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
  <button className={styles.copyBtn} onClick={() => navigate('/setup', {
    state: { preset: { platform, task, subject } }
  })}>
    ↺ Use this setup again
  </button>
  <button className={styles.copyBtn} onClick={() => setShowShare(true)}>
    🔗 Share
  </button>
</div>

{showShare && (
  <div className={styles.shareOverlay} onClick={() => setShowShare(false)}>
    <div className={styles.shareCard} onClick={e => e.stopPropagation()}>
      <div className={styles.shareCardHeader}>
        <h3 className={styles.shareCardTitle}>Share this prompt</h3>
        <button className={styles.shareCloseBtn} onClick={() => setShowShare(false)}>×</button>
      </div>
      <div className={styles.shareOptions}>
        <button className={styles.shareOption} onClick={handleCopyLink}>
          <span className={styles.shareOptionIcon}>🔗</span>
          <span>{shared ? '✓ Copied!' : 'Copy link'}</span>
        </button>
        <button className={styles.shareOption} onClick={handleCopyPromptText}>
          <span className={styles.shareOptionIcon}>⎘</span>
          <span>Copy prompt text</span>
        </button>
        <button className={styles.shareOption} onClick={handleShareWhatsApp}>
          <span className={styles.shareOptionIcon}>💬</span>
          <span>WhatsApp</span>
        </button>
        <button className={styles.shareOption} onClick={handleShareEmail}>
          <span className={styles.shareOptionIcon}>✉️</span>
          <span>Email</span>
        </button>
        <button className={styles.shareOption} onClick={handleShareTwitter}>
          <span className={styles.shareOptionIcon}>𝕏</span>
          <span>Twitter / X</span>
        </button>
      </div>
    </div>
  </div>
)}



        <p className={styles.openHint}>
          "Open in {platformLabel}" copies the prompt to your clipboard and opens {platformLabel} in a new tab. Just paste when you get there.
        </p>

      {showLevelUp && (() => {
        const levelInfo = getLevelInfo(newLevel);
        return (
        <div className={styles.levelUpOverlay} onClick={() => setShowLevelUp(false)}>
          <div className={styles.levelUpCard} onClick={e => e.stopPropagation()}>
            <div className={styles.levelUpGlow} />
            <div className={styles.levelUpEmoji}>{levelInfo.emoji}</div>
            <div className={styles.levelUpBadge}>LEVEL UP</div>
            <h2 className={styles.levelUpLevel}>Level {newLevel}</h2>
            <p className={styles.levelUpTitle}>{levelInfo.label}</p>
            <p className={styles.levelUpSub}>You're on a roll. Keep building.</p>
            <button className={styles.levelUpBtn} onClick={() => setShowLevelUp(false)}>
              Let's go →
            </button>
          </div>
        </div>
      );
    })()}
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