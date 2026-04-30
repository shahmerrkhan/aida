import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadUserState } from '../utils/syncService';
import styles from './WeeklyRecap.module.css';

export default function WeeklyRecap() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadUserState(user.id).then(state => {
      if (state) setStats(state);
    });
  }, [user]);

  if (!user || !stats) return null;

  return (
    <div className={styles.card}>
      <div className={styles.title}>📊 Your week so far</div>
      <div className={styles.row}>
        <div className={styles.stat}>
          <span className={styles.num}>{stats.promptCount}</span>
          <span className={styles.label}>Prompts</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.num}>{stats.streakDays}</span>
          <span className={styles.label}>Day Streak 🔥</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.num}>{stats.platformsUsed.size}</span>
          <span className={styles.label}>Platforms</span>
        </div>
      </div>
    </div>
  );
}