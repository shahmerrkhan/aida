import { useState } from 'react';
import { submitFeedback } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import styles from './FeedbackWidget.module.css';

export default function FeedbackWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  async function handleSubmit() {
    if (!message.trim()) return;
    setStatus('loading');
    try {
      await submitFeedback({ message: message.trim(), userId: user?.id });
      setStatus('success');
      setMessage('');
      setTimeout(() => {
        setStatus('idle');
        setOpen(false);
      }, 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Send feedback</span>
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
          </div>
          <textarea
            className={styles.textarea}
            placeholder="What's working, what's broken, what's missing..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!message.trim() || status === 'loading' || status === 'success'}
          >
            {status === 'loading' ? 'Sending...' : status === 'success' ? '✓ Sent!' : status === 'error' ? 'Failed — try again' : 'Send feedback'}
          </button>
        </div>
      )}
      <button
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        title="Send feedback"
      >
        💬
      </button>
    </div>
  );
}