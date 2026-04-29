import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import Logo from '../components/Logo';
import styles from './Auth.module.css';

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      navigate('/setup');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Check your email to confirm your account, then log in.');
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Logo size="md" />
        </div>
        <h1 className={styles.title}>
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? 'Log in to access your prompts and XP.' : 'Sign up to save your progress across devices.'}
        </p>

        <div className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          {error && <p className={styles.error}>⚠ {error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <p className={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className={styles.toggleBtn}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        <button className={styles.skipBtn} onClick={() => navigate('/setup')}>
          Continue without account →
        </button>
      </div>
    </div>
  );
}