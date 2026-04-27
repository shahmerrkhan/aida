import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemePicker from '../components/ThemePicker';
import XPBar from '../components/XPBar';
import Stats from '../components/Stats';
import { BADGES, LEVELS, getState, getLevel, getLevelProgress } from '../utils/achievements';
import styles from './Badges.module.css';

export default function Badges() {
  const state = getState();
  const level = getLevel(state.xp);
  const progress = getLevelProgress(state.xp);

  const currentLevelIndex = LEVELS.findIndex(l => l.level === level);
  const nextLevel = LEVELS[currentLevelIndex + 1];

  // Count earned badges from state
  const earnedCount = state.badges.filter(b => b.unlocked).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/setup" className={styles.backBtn}>← Back to Setup</Link>
        <div className={styles.headerRight}>
          <XPBar xp={state.xp} />
          <ThemePicker />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.title}>Your Progress</h1>
          <p className={styles.subtitle}>Every prompt gets you closer to the next level.</p>
        </div>

        {/* Level Card */}
        <div className={styles.levelCard}>
          <div className={styles.levelTop}>
            <div>
              <div className={styles.levelName}>{LEVELS[level - 1]?.label || 'Newbie'}</div>
              <div className={styles.levelXP}>{state.xp.toLocaleString()} XP total</div>
            </div>
            <div className={styles.levelBadgeCount}>
              <span className={styles.badgeCountNum}>{earnedCount}</span>
              <span className={styles.badgeCountLabel}>/{BADGES.length} badges</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          {nextLevel && (
            <div className={styles.nextLevel}>
              {Math.round(progress)}% to <strong>{nextLevel.label}</strong>
            </div>
          )}
          {!nextLevel && (
            <div className={styles.nextLevel}>You've reached the top. Aida Master. 🎖️</div>
          )}
        </div>

        {/* Stats Row */}
        <Stats />

        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{state.promptCount || 0}</span>
            <span className={styles.statLabel}>Prompts Generated</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{state.platformsUsed.size || 0}</span>
            <span className={styles.statLabel}>AI Platforms Tried</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{state.streakDays || 0}</span>
            <span className={styles.statLabel}>Day Streak 🔥</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className={styles.sectionLabel}>Badges</div>
        <div className={styles.badgeGrid}>
          {BADGES.map(badge => {
            const isEarned = state.badges.find(b => b.id === badge.id)?.unlocked || false;
            return (
              <div
                key={badge.id}
                className={`${styles.badgeCard} ${isEarned ? styles.badgeEarned : styles.badgeLocked}`}
              >
                <div className={styles.badgeEmoji}>
                  {isEarned ? badge.emoji : '🔒'}
                </div>
                <div className={styles.badgeInfo}>
                  <div className={styles.badgeName}>{badge.label}</div>
                  <div className={styles.badgeDesc}>{badge.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Levels Reference */}
        <div className={styles.sectionLabel} style={{ marginTop: 40 }}>Levels</div>
        <div className={styles.levelsTable}>
          {LEVELS.map(l => (
            <div
              key={l.level}
              className={`${styles.levelRow} ${level === l.level ? styles.currentLevel : ''}`}
            >
              <span className={styles.levelRowName}>{l.emoji} {l.label}</span>
              <span className={styles.levelRowRange}>{l.minXP.toLocaleString()} XP</span>
              {level === l.level && <span className={styles.youAreHere}>← you</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}