import styles from './Logo.module.css';

export default function Logo({ size = 'md' }) {
  const sizes = {
    sm: { circle: 22, viewBox: '0 0 22 22', pulse: 'M2,11 L5,11 L6.5,7 L9,15 L11,5 L13,13 L15,9 L16.5,11 L20,11' },
    md: { circle: 32, viewBox: '0 0 32 32', pulse: 'M3,16 L7,16 L9.5,10 L13,22 L16,8 L19,20 L21.5,14 L23.5,16 L29,16' },
    lg: { circle: 44, viewBox: '0 0 44 44', pulse: 'M4,22 L10,22 L13,13 L18,31 L22,10 L26,28 L29.5,19 L32,22 L40,22' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`${styles.logo} ${styles[size]}`}>
      <svg
        width={s.circle}
        height={s.circle}
        viewBox={s.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-hidden="true"
      >
        <circle
          cx={s.circle / 2}
          cy={s.circle / 2}
          r={s.circle / 2 - 1.5}
          fill="var(--logo-fill)"
        />
        <polyline
          points={s.pulse}
          fill="none"
          stroke="var(--logo-stroke)"
          strokeWidth={size === 'sm' ? 1.5 : 2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.wordmark}>aida</span>
    </div>
  );
}
