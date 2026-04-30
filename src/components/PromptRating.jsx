import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updatePromptRating } from '../utils/syncService';
import styles from './PromptRating.module.css';

export default function PromptRating({ promptId }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(null);

  if (!user || !promptId) return null;

  async function handleRate(value) {
    setRating(value);
    await updatePromptRating(user.id, promptId, value);
  }

  return (
    <div className={styles.card}>
      <p className={styles.question}>Did this prompt work well?</p>
      <div className={styles.buttons}>
        <button
          className={`${styles.btn} ${rating === 1 ? styles.selected : ''}`}
          onClick={() => handleRate(1)}
        >
          👍 Worked great
        </button>
        <button
          className={`${styles.btn} ${rating === -1 ? styles.selectedBad : ''}`}
          onClick={() => handleRate(-1)}
        >
          👎 Not really
        </button>
      </div>
      {rating && (
        <p className={styles.thanks}>
          {rating === 1 ? 'Glad it helped! 🎉' : 'Got it — we\'ll keep improving.'}
        </p>
      )}
    </div>
  );
}