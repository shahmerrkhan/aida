import { useState } from 'react';
import styles from './SavePromptModal.module.css';

export default function SavePromptModal({ isOpen, onClose, onSave, promptData }) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    
    setTimeout(() => {
      onSave({
        name: name.trim(),
        platform: promptData.platform,
        taskType: promptData.taskType,
        subject: promptData.subject,
      });
      
      setName('');
      setIsSaving(false);
      onClose();
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Save this prompt</h2>
          <button 
            className={styles.closeBtn} 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label htmlFor="prompt-name" className={styles.label}>
              Prompt name
            </label>
            <input
              id="prompt-name"
              type="text"
              placeholder="e.g., AP Bio Photosynthesis"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              className={styles.input}
            />
          </div>

          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Platform</span>
              <span className={styles.metaValue}>{promptData.platform}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Task</span>
              <span className={styles.metaValue}>{promptData.taskType}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Subject</span>
              <span className={styles.metaValue}>{promptData.subject}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save prompt'}
          </button>
        </div>
      </div>
    </div>
  );
}