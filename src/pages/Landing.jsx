import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemePicker from '../components/ThemePicker';
import styles from './Landing.module.css';

export default function Landing() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo size="md" />
        <ThemePicker />
      </header>

      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.heroSection}>
          <div className={styles.badge}>Built for students</div>
          <h1 className={styles.heroTitle}>
            Set up your AI once.<br />Use it every time.
          </h1>
          <p className={styles.heroSubtitle}>
            Pick your platform, drop your notes, set the vibe — Aida builds the perfect prompt so you don't have to start from scratch every single session.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/setup" className={styles.ctaPrimary}>
              <span>Start Building</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>
            <p className={styles.ctaSubtext}>No account. No setup. Everything stays local.</p>
          </div>
        </section>

        {/* Mockup */}
        <section className={styles.mockupSection}>
          <div className={styles.mockupWindow}>
            <div className={styles.mockupBar}>
              <span className={styles.mockupDot} style={{ background: '#ff5f57' }} />
              <span className={styles.mockupDot} style={{ background: '#febc2e' }} />
              <span className={styles.mockupDot} style={{ background: '#28c840' }} />
              <span className={styles.mockupTitle}>aida — prompt builder</span>
            </div>
            <div className={styles.mockupBody}>
              <div className={styles.mockupRow}>
                <div className={styles.mockupLabel}>Platform</div>
                <div className={styles.mockupChips}>
                  {['ChatGPT', 'Claude', 'Gemini', 'Perplexity'].map((p, i) => (
                    <span key={p} className={`${styles.mockupChip} ${i === 1 ? styles.mockupChipActive : ''}`}>{p}</span>
                  ))}
                </div>
              </div>
              <div className={styles.mockupRow}>
                <div className={styles.mockupLabel}>Task</div>
                <div className={styles.mockupChips}>
                  {['🧠 Test Prep', '📝 Essay Feedback', '💡 Explain Concept'].map((t, i) => (
                    <span key={t} className={`${styles.mockupChip} ${i === 0 ? styles.mockupChipActive : ''}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className={styles.mockupRow}>
                <div className={styles.mockupLabel}>Subject</div>
                <div className={styles.mockupInput}>Grade 11 Chemistry — Radioactive Decay</div>
              </div>
              <div className={styles.mockupRow}>
                <div className={styles.mockupLabel}>Vibe</div>
                <div className={styles.mockupVibeBar}>
                  <div className={styles.mockupVibeFill} />
                  <span className={styles.mockupVibeLabel}>😊 Casual</span>
                </div>
              </div>
              <div className={styles.mockupGenBtn}>Generate my prompt →</div>
            </div>
          </div>
        </section>

        {/* Features — 3 only */}
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎯</span>
            <h3 className={styles.featureTitle}>Actually tailored</h3>
            <p className={styles.featureDesc}>Not a generic "explain this to me" prompt. Aida builds around your platform, task, subject, notes, and tone.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📄</span>
            <h3 className={styles.featureTitle}>Drop your notes in</h3>
            <p className={styles.featureDesc}>Upload a PDF, Word doc, PPTX, or plain text. Aida pulls the content and injects it right into the prompt.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎮</span>
            <h3 className={styles.featureTitle}>XP and badges</h3>
            <p className={styles.featureDesc}>Every prompt earns you XP. Level up, unlock badges, build streaks. Makes the grind feel slightly less terrible.</p>
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>Made for students who actually think.</p>
      </footer>
    </div>
  );
}