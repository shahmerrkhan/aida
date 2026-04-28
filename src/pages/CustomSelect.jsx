import { useState } from "react";
import styles from "./CustomSelect.module.css";

export default function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);

  const prettyNames = {
    chatgpt: "ChatGPT",
    claude: "Claude",
    gemini: "Gemini",
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
      >
        {prettyNames[value] || "All platforms"}
      </button>

      {open && (
        <div className={styles.menu}>
          <div
            className={styles.item}
            onClick={() => { onChange(""); setOpen(false); }}
          >
            All platforms
          </div>

          {options.map(opt => (
            <div
              key={opt}
              className={styles.item}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {prettyNames[opt] || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
