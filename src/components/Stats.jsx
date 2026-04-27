import { useMemo } from 'react';
import { getState } from '../utils/achievements';
import styles from './Stats.module.css';

export default function Stats() {
  const state = getState();

  // Calculate platform usage
  const platformStats = useMemo(() => {
    const counts = {};
    // This would need to be tracked in achievements, for now we'll show platforms used
    const platformsUsed = Array.from(state.platformsUsed || []);
    return platformsUsed.length > 0 ? platformsUsed : [];
  }, [state]);

  if (state.promptCount === 0) {
    return null; // Don't show stats if no prompts yet
  }

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statItem}>
        <div className={styles.statLabel}>Total Prompts</div>
        <div className={styles.statValue}>{state.promptCount}</div>
        <div className={styles.statMiniBar}>
          <div className={styles.miniBarFill} style={{ width: `${Math.min((state.promptCount / 50) * 100, 100)}%` }} />
        </div>
      </div>

      <div className={styles.statItem}>
        <div className={styles.statLabel}>Platforms Explored</div>
        <div className={styles.statValue}>{platformStats.length}</div>
        <div className={styles.statMiniBar}>
          <div className={styles.miniBarFill} style={{ width: `${(platformStats.length / 10) * 100}%` }} />
        </div>
      </div>

      <div className={styles.statItem}>
        <div className={styles.statLabel}>Current Streak</div>
        <div className={styles.statValue}>{state.streakDays} days 🔥</div>
        <div className={styles.statMiniBar}>
          <div className={styles.miniBarFill} style={{ width: `${Math.min((state.streakDays / 30) * 100, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}