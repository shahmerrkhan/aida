import { getLevel, getLevelProgress } from '../utils/achievements';
import styles from './XPBar.module.css';

export default function XPBar({ xp }) {
  const level = getLevel(xp);
  const progress = getLevelProgress(xp);

  return (
    <div className={styles.xpBar}>
      <div className={styles.info}>
        <span className={styles.levelLabel}>{level.label}</span>
        <span className={styles.xpCount}>{xp} XP</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
