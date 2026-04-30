import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/Logo';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import GeneratingAnimation from '../components/GeneratingAnimation';
import { generatePromptWithGroq } from '../utils/groqApi';
import { parseFile } from '../utils/fileParser';
import { usePromptLibrary } from '../hooks/usePromptLibrary';
import { recordPrompt, getState, getCurrentLevel } from '../utils/achievements';
import { useAuth } from '../context/AuthContext';
import { useXP } from "../context/XPContext";
import styles from './Setup.module.css';

const PLATFORMS = [
  { id: 'chatgpt', label: 'ChatGPT', sub: 'OpenAI' },
  { id: 'gemini', label: 'Gemini', sub: 'Google' },
  { id: 'claude', label: 'Claude', sub: 'Anthropic' },
  { id: 'copilot', label: 'Copilot', sub: 'Microsoft' },
  { id: 'perplexity', label: 'Perplexity', sub: 'Search' },
  { id: 'grok', label: 'Grok', sub: 'xAI' },
  { id: 'mistral', label: 'Mistral', sub: 'Mistral AI' },
  { id: 'meta', label: 'Meta AI', sub: 'Meta' },
  { id: 'deepseek', label: 'DeepSeek', sub: 'DeepSeek' },
  { id: 'poe', label: 'Poe', sub: 'Anthropic' },
];

const TASKS = [
  { id: 'test_prep', label: 'Test Prep', icon: '🧠' },
  { id: 'assignment_review', label: 'Assignment Review', icon: '📝' },
  { id: 'quick_answers', label: 'Quick Answers', icon: '⚡' },
  { id: 'essay_feedback', label: 'Essay Feedback', icon: '✍️' },
  { id: 'explain_concept', label: 'Explain a Concept', icon: '💡' },
  { id: 'practice_problems', label: 'Practice Problems', icon: '🔢' },
  { id: 'study_session', label: 'Study Session', icon: '🎓' }
];

export default function Setup() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const { theme } = useTheme();
  const state = getState();
  const { presets, addPreset, deletePreset } = usePromptLibrary();
  const { setXP } = useXP();
  const [platform, setPlatform] = useState('');
  const [task, setTask] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [notesContent, setNotesContent] = useState('');
  const [notesFileName, setNotesFileName] = useState('');
  const [vibeLevel, setVibeLevel] = useState(50);
  const [presetSaved, setPresetSaved] = useState(false);
  const [searchParams] = useSearchParams();
  const [promptMode, setPromptMode] = useState('detailed');
  const [showCustomConfirm, setShowCustomConfirm] = useState(false);
  const [customInstructionsInput, setCustomInstructionsInput] = useState('');
  const [customMode, setCustomMode] = useState('rephrase');
  const { user, syncState, signOut } = useAuth();
  const [toggles, setToggles] = useState({
    shortAnswers: false,
    dontRepeat: false,
    citeSource: false,
    stepByStep: false,
    examplesAlways: false,
    checkUnderstand: false,
  });
  const [customInstructions, setCustomInstructions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileParseError, setFileParseError] = useState('');
  const location = useLocation();
  const [showTooltips, setShowTooltips] = useState(() => {
    const seen = localStorage.getItem('aida_onboarding_seen');
    return !seen;
  });

  useEffect(() => {
    if (location.state?.preset) {
      setPlatform(location.state.preset.platform);
      setTask(location.state.preset.taskType);
      setSubject(location.state.preset.subject);
    }
  }, [location.state?.preset]);

  useEffect(() => {
    const p = searchParams.get('platform');
    const t = searchParams.get('task');
    const s = searchParams.get('subject');
    if (p) setPlatform(p);
    if (t) setTask(t);
    if (s) setSubject(s);
  }, []);

  useEffect(() => {
    if (showTooltips && (platform || task || subject)) {
      localStorage.setItem('aida_onboarding_seen', 'true');
      setShowTooltips(false);
    }
  }, [platform, task, subject, showTooltips]);

  useEffect(() => {
    setPresetSaved(false);
  }, [platform, task, subject]);

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setFileParseError('');
    setIsLoading(true);
    try {
      const contents = await Promise.all(files.map(f => parseFile(f)));
      const newContent = notesContent 
        ? notesContent + '\n\n---\n\n' + contents.join('\n\n---\n\n')
        : contents.join('\n\n---\n\n');
      setNotesContent(newContent);
      setNotesFileName(
        notesFileName 
          ? `${notesFileName} + ${files.length} more file${files.length > 1 ? 's' : ''}`
          : files.length === 1 ? files[0].name : `${files.length} files`
      );
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setFileParseError(`Failed to parse file: ${err.message}`);
      if (fileRef.current) fileRef.current.value = '';
    } finally {
      setIsLoading(false);
    }
  }

  function removeFile() {
    setNotesFileName('');
    setNotesContent('');
    setFileParseError('');
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  function toggleItem(key) {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const vibeLabel =
    vibeLevel < 25 ? '📚 Formal & Precise' :
    vibeLevel < 50 ? '💼 Professional' :
    vibeLevel < 75 ? '😊 Casual' :
    '🔥 Full Chill Mode';

  function handleSavePreset() {
    if (!platform || !task || !subject.trim() || presetSaved) return;
    addPreset({ platform, task, subject: subject.trim() });
    setPresetSaved(true);
    setTimeout(() => setPresetSaved(false), 2000);
  }

  async function handleGenerate() {
    if (!platform) { setError('Pick an AI platform first.'); return; }
    if (!task) { setError('Choose what you need help with.'); return; }
    if (!subject.trim()) { setError('Subject is required.'); return; }
    setError('');
    setIsLoading(true);

    try {
      const generatedPrompt = await generatePromptWithGroq({
        platform,
        task,
        subject: subject.trim(),
        topic: topic.trim(),
        vibeLevel,
        fileContent: notesContent,
        toggles,
        customInstructions: customInstructions.trim(),
        promptMode,
        customMode,
      });

      const result = recordPrompt({ platform, usedNotes: !!notesContent, vibeLevel });
      setXP(result.state.xp);

      navigate('/result', {
        state: {
          prompt: generatedPrompt,
          platform,
          task,
          subject,
          xpGained: result.xpGained,
          newBadges: result.newBadges,
          totalXP: result.state.xp,
          leveledUp: result.state.level !== undefined && getCurrentLevel(result.state.xp - result.xpGained) < getCurrentLevel(result.state.xp),
          newLevel: getCurrentLevel(result.state.xp),
        },
      });
      
    } catch (err) {
      const msg = err.message;
      if (msg === 'NO_KEY') setError('Groq API key not configured. Check your .env file.');
      else if (msg === 'INVALID_KEY') setError('Groq API key is invalid.');
      else if (msg === 'RATE_LIMIT') setError('Rate limited. Wait a moment and try again.');
      else setError(`Error: ${msg}`);
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {isLoading && <GeneratingAnimation />}

      <header className={styles.header}>
        <Link to="/" className={styles.logoLink}>
          <Logo size="md" />
        </Link>
        <div className={styles.headerRight}>
          <XPBar xp={state.xp} />
          <Link to="/badges" className={styles.badgesLink} title="View badges">🏅</Link>
          <Link to="/my-prompts" className={styles.badgesLink} title="My Prompts">📚</Link>
          {user ? (
            <button 
              className={styles.badgesLink} 
              onClick={async () => { 
                await signOut();
                navigate('/'); 
              }} 
              title="Sign out" 
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              👤
            </button>
          ) : (
            <Link to="/auth" className={styles.badgesLink} title="Log in">👤</Link>
          )}
          <ThemePicker />
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Set up your AI</h1>
        <p className={styles.subtitle}>Pick your platform, task, and subject. Aida handles the rest.</p>

        {presets.length > 0 && (
          <section className={styles.section} style={{ textAlign: 'center' }}>
            <label className={styles.sectionLabel} style={{ textAlign: 'center' }}>⚡ Quick Presets</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {presets.map((preset) => (
                <div key={preset.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button
                    className={styles.presetBtn}
                    onClick={() => {
                      setPlatform(preset.platform);
                      setTask(preset.task);
                      setSubject(preset.subject);
                    }}
                  >
                    <span className={styles.presetBtnLabel}>{preset.subject}</span>
                    <span className={styles.presetBtnSub}>{preset.platform} · {preset.task}</span>
                  </button>
                  <button
                    className={styles.presetDeleteBtn}
                    onClick={() => deletePreset(preset.id)}
                    title="Remove preset"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <label className={styles.sectionLabel}>01 — Pick your AI</label>

          {showTooltips && (
            <div className={styles.tooltip}>
              Pick which AI you use most. Aida tailors the prompt for that platform's strengths.
            </div>
          )}

          <div className={styles.platformGrid}>
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                className={`${styles.platformCard} ${platform === p.id ? styles.platformCardActive : ''}`}
                onClick={() => setPlatform(p.id)}
              >
                <div className={styles.platformLabel}>{p.label}</div>
                <div className={styles.platformSub}>{p.sub}</div>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>02 — What do you need?</label>
          <div className={styles.taskGrid}>
            {TASKS.map(t => (
              <button
                key={t.id}
                className={`${styles.taskCard} ${task === t.id ? styles.taskCardActive : ''}`}
                onClick={() => setTask(t.id)}
              >
                <span className={styles.taskIcon}>{t.icon}</span>
                <span className={styles.taskLabel}>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>03 — Subject & Topic</label>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Subject *</label>
              <input
                className={styles.input}
                placeholder="e.g. Biology, Calculus, History"
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Topic (optional)</label>
              <input
                className={styles.input}
                placeholder="e.g. Photosynthesis"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>04 — Tone & Vibe</label>

          {showTooltips && (
            <div className={styles.tooltip}>
              Adjust how casual vs formal the AI should be. Move left for chill, right for strict.
            </div>
          )}

          <div className={styles.vibeContainer}>
            <input
              type="range"
              min={0}
              max={100}
              value={vibeLevel}
              onChange={e => setVibeLevel(Number(e.target.value))}
              className={styles.vibeSlider}
            />
            <div className={styles.vibeLabel}>{vibeLabel}</div>
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>05 — Preferences</label>
          <div className={styles.toggleGrid}>
            {[
              ['shortAnswers', 'Short answers only'],
              ['dontRepeat', "Don't repeat the question"],
              ['citeSource', 'Cite sources'],
              ['stepByStep', 'Step-by-step breakdowns'],
              ['examplesAlways', 'Always give examples'],
              ['checkUnderstand', 'Check I understand'],
            ].map(([key, label]) => (
              <label key={key} className={styles.toggleItem}>
                <input
                  type="checkbox"
                  checked={toggles[key]}
                  onChange={() => toggleItem(key)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>06 — Upload notes (optional)</label>

          {showTooltips && (
            <div className={styles.tooltip}>
              Upload your lecture notes, PDFs, or textbook pages. Aida reads them and bakes them into the prompt.
            </div>
          )}

          {notesFileName && (
            <div className={styles.fileLoaded}>
              <span className={styles.fileIcon}>📎</span>
              <span className={styles.fileName}>{notesFileName}</span>
              <button 
                className={styles.removeFile} 
                onClick={() => {
                  setNotesFileName('');
                  setNotesContent('');
                  setFileParseError('');
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                ✕ Remove
              </button>
            </div>
          )}

          <div className={styles.uploadZone} style={{ marginTop: notesFileName ? '12px' : '0' }} onClick={() => fileRef.current?.click()}>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.pdf,.docx,.pptx,.csv,.json,.rtf"
              className={styles.hiddenInput}
              onChange={handleFileUpload}
              disabled={isLoading}
              multiple
            />
            <span className={styles.uploadIcon}>{isLoading ? '⏳' : '📄'}</span>
            <span className={styles.uploadText}>{isLoading ? 'Parsing...' : notesFileName ? 'Add more files' : 'Drop a file or click'}</span>
            <span className={styles.uploadSub}>PDF, Word, PPTX, notes, etc.</span>
          </div>

          {fileParseError && <p className={styles.fileError}>⚠ {fileParseError}</p>}
        </section>

        <section className={styles.section}>
          <label className={styles.sectionLabel}>07 — Anything else? (optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="e.g. I'm a visual learner, always use analogies. I struggle with integration by parts specifically..."
            value={customInstructions}
            onChange={e => setCustomInstructions(e.target.value)}
          />
          {customInstructions.trim() && (
            <div className={styles.customConfirmBox}>
              <p className={styles.customConfirmText}>How should Aida handle these instructions?</p>
              <div className={styles.customConfirmButtons}>
                <button
                  className={customMode === 'rephrase' ? styles.confirmBtn : styles.confirmBtnSecondary}
                  onClick={() => setCustomMode('rephrase')}
                >
                  Rephrase & embed
                </button>
                <button
                  className={customMode === 'addEnd' ? styles.confirmBtn : styles.confirmBtnSecondary}
                  onClick={() => setCustomMode('addEnd')}
                >
                  Add at end
                </button>
              </div>
            </div>
          )}
        </section>
        
        {platform && task && subject.trim() && (
          <button
            className={styles.savePresetBtn}
            onClick={handleSavePreset}
            disabled={presetSaved}
            style={presetSaved ? { borderColor: 'var(--accent)', color: 'var(--accent)', borderStyle: 'solid' } : {}}
          >
            {presetSaved ? '✓ Preset saved!' : '⚡ Save as preset'}
          </button>
        )}

        {error && <p className={styles.error}>⚠ {error}</p>}

        <button
          className={`${styles.generateBtn} ${isLoading ? styles.generating : ''}`}
          onClick={handleGenerate}
          disabled={isLoading}
        >
          <span>{isLoading ? 'Building your prompt...' : 'Generate my prompt'}</span>
          <span className={styles.btnArrow}>{isLoading ? '✨' : '→'}</span>
        </button>
      </main>
    </div>
  );
}