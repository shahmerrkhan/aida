// GeneratingAnimation.jsx
// Used in Setup.jsx — shown as an overlay while Groq generates the prompt.
// If you inline the loading state inside Setup instead, you won't need this.
// But if you want a full-screen animated "thinking" screen, use this.

import { useEffect, useState } from "react";
import styles from "./GeneratingAnimation.module.css";

const PHASES = [
  { icon: "🧠", text: "Reading your setup…"              },
  { icon: "✍️",  text: "Crafting your prompt…"            },
  { icon: "⚡",  text: "Running it through Groq…"         },
  { icon: "✨",  text: "Polishing the final result…"      },
];

export default function GeneratingAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(prev => (prev < PHASES.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.spinner} aria-hidden="true" />
        <p className={styles.icon}>{PHASES[phase].icon}</p>
        <p className={styles.text}>{PHASES[phase].text}</p>
        <div className={styles.dots}>
          {PHASES.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i <= phase ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}