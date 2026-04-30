import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './MyPrompts.module.css';
import { usePromptLibrary } from '../hooks/usePromptLibrary';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import { getState } from '../utils/achievements';
import CustomSelect from "./CustomSelect";

export default function MyPrompts() {
  const navigate = useNavigate();
  const { prompts, deletePrompt, incrementUsage, promptHistory, clearHistory } = usePromptLibrary();
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedHistoryId, setCopiedHistoryId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmClearHistory, setConfirmClearHistory] = useState(false);
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filterPlatform && p.platform !== filterPlatform) {
        return false;
      }
      return true;
    });
  }, [prompts, search, filterPlatform]);

  const platforms = [...new Set(prompts.map((p) => p.platform))].sort();

  const handleCopy = (prompt) => {
    navigator.clipboard.writeText(prompt.content || '');
    incrementUsage(prompt.id);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
  setConfirmDeleteId(id);
  };

  const handleCopyHistory = (entry) => {
  navigator.clipboard.writeText(entry.content);
  setCopiedHistoryId(entry.id);
  setTimeout(() => setCopiedHistoryId(null), 2000);
  };

  const handleUseAgain = (prompt) => {
    navigate('/setup', {
      state: {
        preset: {
          platform: prompt.platform,
          taskType: prompt.taskType,
          subject: prompt.subject,
        },
      },
    });
  };

  const [ratings, setRatings] = useState(() => {
  try {
    const stored = localStorage.getItem('aida_prompt_ratings');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
    }
  });

  useEffect(() => {
  try {
    localStorage.setItem('aida_prompt_ratings', JSON.stringify(ratings));
  } catch (error) {
    console.error('Failed to save ratings:', error);
  }
  }, [ratings]);

  const handleRate = (promptId, rating) => {
  setRatings(prev => ({ ...prev, [promptId]: rating }));
  };

  return (
  <div className={styles.page}>
    {/* HEADER — same as Result.jsx and Setup.jsx */}
    <header className={styles.header}>
      <button 
        className={styles.backButtonHeader} 
        onClick={() => navigate('/setup')} 
        title="Back to Setup"
      >
        ← Setup
      </button>
      <div className={styles.headerRight}>
        <XPBar xp={getState().xp} />
        <Link to="/badges" className={styles.badgesLink} title="View badges">🏅</Link>
        <ThemePicker />
      </div>
    </header>

    {/* YOUR EXISTING CONTENT WRAPPED IN MAIN */}
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>My Prompts</h1>
            <p className={styles.subtitle}>
              {filteredPrompts.length} of {prompts.length} saved
            </p>
          </div>
        </div>

        {prompts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>∅</div>
            <h2 className={styles.emptyTitle}>No prompts saved yet</h2>
            <p className={styles.emptyText}>
              Generate a prompt and save it to build your library
            </p>
            <button 
              className={styles.emptyButton}
              onClick={() => navigate('/setup')}
            >
              Create a prompt
            </button>
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search prompts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />            

                {platforms.length > 0 && (
                    <CustomSelect
                        value={filterPlatform}
                        onChange={setFilterPlatform}
                        options={platforms}
                    />
                )}
            </div>

            {filteredPrompts.length === 0 ? (
              <div className={styles.noResults}>
                <p>No prompts match your search</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredPrompts.map((prompt) => (
                  <div key={prompt.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{prompt.name}</h3>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(prompt.id)}
                        aria-label="Delete prompt"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>

                    <div className={styles.cardMeta}>
                      <div className={styles.metaBadge}>
                        <span className={styles.badgeLabel}>Platform</span>
                        <span className={styles.badgeValue}>{prompt.platform}</span>
                      </div>
                      <div className={styles.metaBadge}>
                        <span className={styles.badgeLabel}>Task</span>
                        <span className={styles.badgeValue}>{prompt.taskType}</span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.usageCount}>
                        Used {prompt.usageCount || 0}x
                      </span>
                      <div className={styles.cardActions}>
                        <button
                          className={`${styles.actionBtn} ${
                            copiedId === prompt.id ? styles.copied : ''
                        }`}
                        onClick={() => handleCopy(prompt)}
                        title="Copy to clipboard"
                      >
                        {copiedId === prompt.id ? '✓' : '⎘'}
                        </button>
                      </div>
                    </div>
                    <div className={styles.ratingSection}>
                    <span className={styles.ratingLabel}>Rate this</span>
                    <div className={styles.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          className={`${styles.star} ${ratings[prompt.id] >= star ? styles.starActive : ''}`}
                          onClick={() => handleRate(prompt.id, star)}
                          title={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    {promptHistory.length > 0 && (
        <div className={styles.container} style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 className={styles.title} style={{ fontSize: '1.25rem' }}>Recent</h2>
              <p className={styles.subtitle}>Last {promptHistory.length} generated prompts</p>
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => setConfirmClearHistory(true)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
            >
              Clear
            </button>
          </div>
          <div className={styles.grid}>
            {promptHistory.map((entry) => (
                  <div key={`history-${entry.id}`} className={styles.card}>
                  <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{entry.subject || 'Untitled'}</h3>
                  <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.cardMeta}>
                  <div className={styles.metaBadge}>
                    <span className={styles.badgeLabel}>Platform</span>
                    <span className={styles.badgeValue}>{entry.platform}</span>
                  </div>
                  <div className={styles.metaBadge}>
                    <span className={styles.badgeLabel}>Task</span>
                    <span className={styles.badgeValue}>{entry.task}</span>
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.usageCount}>
                    {entry.content?.length?.toLocaleString()} chars
                  </span>
                  <div className={styles.cardActions}>
                    <button
                      className={`${styles.actionBtn} ${copiedHistoryId === entry.id ? styles.copied : ''}`}
                      onClick={() => handleCopyHistory(entry)}
                      title="Copy prompt"
                    >
                      {copiedHistoryId === entry.id ? '✓' : '⎘'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
    {confirmDeleteId && (
      <div className={styles.confirmBackdrop} onClick={() => setConfirmDeleteId(null)}>
        <div className={styles.confirmCard} onClick={e => e.stopPropagation()}>
          <p className={styles.confirmText}>Delete this prompt?</p>
          <div className={styles.confirmActions}>
            <button className={styles.confirmCancel} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
            <button className={styles.confirmDelete} onClick={() => { deletePrompt(confirmDeleteId); setConfirmDeleteId(null); }}>Delete</button>
          </div>
        </div>
      </div>
    )}

    {confirmClearHistory && (
      <div className={styles.confirmBackdrop} onClick={() => setConfirmClearHistory(false)}>
        <div className={styles.confirmCard} onClick={e => e.stopPropagation()}>
          <p className={styles.confirmText}>Clear all history?</p>
          <div className={styles.confirmActions}>
            <button className={styles.confirmCancel} onClick={() => setConfirmClearHistory(false)}>Cancel</button>
            <button className={styles.confirmDelete} onClick={() => { clearHistory(); setConfirmClearHistory(false); }}>Clear</button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}