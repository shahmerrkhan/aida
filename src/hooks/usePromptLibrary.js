import { useState, useEffect } from 'react';
import { useXP } from '../context/XPContext';

const STORAGE_KEY = 'aida_prompt_library';
const HISTORY_KEY = 'aida_prompt_history';
const MAX_HISTORY = 15;
const PRESETS_KEY = 'aida_presets';
const MAX_PRESETS = 8;

export function usePromptLibrary() {
  const { xp, setXP, level, setLevel } = useXP();
  const [prompts, setPrompts] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPrompts(JSON.parse(stored));
      const history = localStorage.getItem(HISTORY_KEY);
      if (history) setPromptHistory(JSON.parse(history));
      const savedPresets = localStorage.getItem(PRESETS_KEY);
      if (savedPresets) setPresets(JSON.parse(savedPresets));
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    setIsLoading(false);
  }, []);

  // Save prompts to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
      } catch (error) {
        console.error('Failed to save prompts:', error);
      }
    }
  }, [prompts, isLoading]);

  // Save history to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(promptHistory));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
    }
  }, [promptHistory, isLoading]);

  // Save presets to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
      } catch (error) {
        console.error('Failed to save presets:', error);
      }
    }
  }, [presets, isLoading]);

  const addPrompt = (promptData) => {
    const newPrompt = {
      id: Date.now().toString(),
      ...promptData,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    setPrompts(prev => [newPrompt, ...prev]);
    return newPrompt;
  };

  const addToHistory = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      createdAt: new Date().toISOString(),
    };
    setPromptHistory(prev => [newEntry, ...prev].slice(0, MAX_HISTORY));
  };

  const clearHistory = () => setPromptHistory([]);

  const deletePrompt = (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const incrementUsage = (id) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p
      )
    );
  };

  const addPreset = (preset) => {
    const newPreset = {
      id: Date.now().toString(),
      ...preset,
      createdAt: new Date().toISOString(),
    };
    setPresets(prev => [newPreset, ...prev].slice(0, MAX_PRESETS));
  };

  const deletePreset = (id) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  const getPromptById = (id) => prompts.find(p => p.id === id);

  const filterPrompts = (filters) => {
    return prompts.filter(p => {
      if (filters.platform && p.platform !== filters.platform) return false;
      if (filters.taskType && p.taskType !== filters.taskType) return false;
      if (filters.subject && p.subject !== filters.subject) return false;
      if (filters.search) {
        return p.name.toLowerCase().includes(filters.search.toLowerCase());
      }
      return true;
    });
  };

  return {
    prompts,
    promptHistory,
    presets,
    isLoading,
    xp,
    level,
    setXP,
    setLevel,
    addPrompt,
    addToHistory,
    addPreset,
    deletePreset,
    clearHistory,
    deletePrompt,
    incrementUsage,
    getPromptById,
    filterPrompts,
  };
}