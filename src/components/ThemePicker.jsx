import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemePicker.module.css';

const SWATCH_COLORS = {
  warm: '#c4794a',
  dark: '#333333',
  forest: '#4a8a3c',
  midnight: '#4455aa',
  rose: '#c04060',
  pink: '#e05090',
};

const THEME_LABELS = {
  warm: 'Warm',
  dark: 'Dark',
  forest: 'Forest',
  midnight: 'Midnight',
  rose: 'Rose',
  pink: 'Pink',
};

export default function ThemePicker() {
  const { theme, setTheme, THEMES } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-label="Change theme"
        title="Change theme"
        style={{ background: SWATCH_COLORS[theme] }}
      />
      {open && (
        <div className={styles.panel}>
          <p className={styles.label}>Theme</p>
          <div className={styles.swatches}>
            {THEMES.map(t => (
              <button
                key={t}
                className={`${styles.swatch} ${theme === t ? styles.active : ''}`}
                style={{ background: SWATCH_COLORS[t] }}
                onClick={() => { setTheme(t); setOpen(false); }}
                title={THEME_LABELS[t]}
                aria-label={`${THEME_LABELS[t]} theme`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
