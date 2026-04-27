import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemePicker from '../components/ThemePicker';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <Logo size="md" />
        <ThemePicker />
      </header>

      {/* Hero */}
      <main className={styles.main}>
        <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Stop rewriting your prompts.</h1>
            <p className={styles.heroSubtitle}>
              Configure your AI setup once. Generate perfect prompts for any session. No copy-paste hell.
            </p>

            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>⚡</span>
                <h3 className={styles.featureTitle}>Lightning Fast</h3>
                <p className={styles.featureDesc}>Build a prompt in seconds, not minutes.</p>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🎯</span>
                <h3 className={styles.featureTitle}>Actually Tailored</h3>
                <p className={styles.featureDesc}>Choose your AI, task, vibe, and upload notes. Not generic.</p>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🎮</span>
                <h3 className={styles.featureTitle}>Rewarding</h3>
                <p className={styles.featureDesc}>Earn XP and badges. Make studying feel less like a chore.</p>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>📱</span>
                <h3 className={styles.featureTitle}>10+ AI Platforms</h3>
                <p className={styles.featureDesc}>ChatGPT, Claude, Gemini, Perplexity, and more.</p>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>📄</span>
                <h3 className={styles.featureTitle}>Upload Anything</h3>
                <p className={styles.featureDesc}>PDF, Word, PPTX, notes. We parse it all.</p>
              </div>

              <div className={styles.featureCard}>
                <span className={styles.featureIcon}>🎨</span>
                <h3 className={styles.featureTitle}>Yours to Customize</h3>
                <p className={styles.featureDesc}>Themes, vibe slider, toggles. Make it feel like you.</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.ctaSection}>
            <Link to="/setup" className={styles.ctaPrimary}>
              <span>Start Building</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <p className={styles.ctaSubtext}>Zero config needed. Everything is local.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Made for students who actually think.</p>
        </footer>
      </main>
    </div>
  );
}