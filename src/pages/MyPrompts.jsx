import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MyPrompts.module.css';
import { usePromptLibrary } from '../hooks/usePromptLibrary';
import { Link } from 'react-router-dom';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import { getState } from '../utils/achievements';
import CustomSelect from "./CustomSelect";

export default function MyPrompts() {
  const navigate = useNavigate();
  const { prompts, deletePrompt, incrementUsage } = usePromptLibrary();
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [copiedId, setCopiedId] = useState(null);

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
    // Copy the actual prompt content from localStorage or clipboard
    // For now, we'll copy a reference text
    const text = `${prompt.name}\nPlatform: ${prompt.platform}\nTask: ${prompt.taskType}\nSubject: ${prompt.subject}`;
    navigator.clipboard.writeText(text);
    incrementUsage(prompt.id);
    
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this prompt?')) {
      deletePrompt(id);
    }
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
        <div className={styles.header}>
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
                          className={styles.actionBtn}
                          onClick={() => handleUseAgain(prompt)}
                          title="Use this prompt again"
                        >
                          ↻
                        </button>
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
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  </div>
)
}