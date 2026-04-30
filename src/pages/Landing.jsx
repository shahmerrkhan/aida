import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemePicker from '../components/ThemePicker';
import styles from './Landing.module.css';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo size="md" />
        <ThemePicker />
      </header>

      <main className={styles.main}>

        <section className={styles.heroSection}>
          <div className={styles.badge}>Built for students</div>
          <h1 className={styles.heroTitle}>
            Stop writing prompts<br />from scratch.
          </h1>
          <p className={styles.heroSubtitle}>
            Aida builds the perfect AI prompt for your subject, task, and learning style — in seconds. Pick your platform, set the vibe, drop your notes. Done.
          </p>
          <div className={styles.ctaRow}>
            <Link to="/setup" className={styles.ctaPrimary}>
              <span>Build my prompt</span>
              <span className={styles.ctaArrow}>→</span>
            </Link>
            {user ? (
              <p className={styles.ctaSubtext}>Logged in as {user.email}</p>
            ) : (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/auth" className={styles.ctaSecondary}>Log in</Link>
                <p className={styles.ctaSubtext}>or just try it — no account needed</p>
              </div>
            )}
          </div>
          <div className={styles.socialProof}>
            <span className={styles.socialDot} />
            <span>Works with ChatGPT, Claude, Gemini, Perplexity and more</span>
          </div>
        </section>

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

        <section className={styles.howSection}>
          <h2 className={styles.howTitle}>How it works</h2>
          <div className={styles.howSteps}>
            <div className={styles.howStep}>
              <div className={styles.howStepNum}>1</div>
              <div className={styles.howStepText}>
                <div className={styles.howStepTitle}>Pick your setup</div>
                <div className={styles.howStepDesc}>Choose your AI platform, what you need help with, and your subject. Takes about 20 seconds.</div>
              </div>
            </div>
            <div className={styles.howStep}>
              <div className={styles.howStepNum}>2</div>
              <div className={styles.howStepText}>
                <div className={styles.howStepTitle}>Tune it to you</div>
                <div className={styles.howStepDesc}>Set the tone, toggle preferences like step-by-step or cite sources, and drop in your notes or files if you have them.</div>
              </div>
            </div>
            <div className={styles.howStep}>
              <div className={styles.howStepNum}>3</div>
              <div className={styles.howStepText}>
                <div className={styles.howStepTitle}>Copy and go</div>
                <div className={styles.howStepDesc}>Aida builds a structured prompt tailored to your platform. Copy it, paste it, and get better answers immediately.</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎯</span>
            <h3 className={styles.featureTitle}>Actually tailored</h3>
            <p className={styles.featureDesc}>Not a generic prompt. Aida builds around your platform, task, subject, notes, and tone — every time.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📄</span>
            <h3 className={styles.featureTitle}>Drop your notes in</h3>
            <p className={styles.featureDesc}>Upload a PDF, Word doc, PPTX, or plain text. Aida reads it and bakes the content right into the prompt.</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎮</span>
            <h3 className={styles.featureTitle}>XP and badges</h3>
            <p className={styles.featureDesc}>Every prompt earns XP. Level up, collect badges, build streaks. Makes the grind feel slightly less terrible.</p>
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
        <p>Made for students who actually think.</p>
      </footer>
    </div>
  );
}