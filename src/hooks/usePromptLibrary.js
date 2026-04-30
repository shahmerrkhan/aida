import { useState, useEffect } from 'react';
import { useXP } from '../context/XPContext';
import { useAuth } from '../context/AuthContext';
import {
  loadSavedPrompts,
  addSavedPrompt,
  deleteSavedPrompt,
  loadPromptHistory,
  addPromptHistory,
  loadPresets,
  addPreset,
  deletePreset,
} from '../utils/syncService';

const STORAGE_KEY = 'aida_prompt_library';
const HISTORY_KEY = 'aida_prompt_history';
const MAX_HISTORY = 15;
const PRESETS_KEY = 'aida_presets';
const MAX_PRESETS = 8;

export function usePromptLibrary() {
  const { xp, setXP, level, setLevel } = useXP();
  const { user } = useAuth();
  const [prompts, setPrompts] = useState([]);
  const [promptHistory, setPromptHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [presets, setPresets] = useState([]);

  // Load from Supabase on user login, or from localStorage if no user
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const [promptsData, historyData, presetsData] = await Promise.all([
          loadSavedPrompts(user.id),
          loadPromptHistory(user.id),
          loadPresets(user.id),
        ]);
        setPrompts(promptsData || []);
        setPromptHistory(historyData || []);
        setPresets(presetsData || []);
      } catch (error) {
        console.error('Failed to load from Supabase:', error);
        // Fallback to localStorage if Supabase fails
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) setPrompts(JSON.parse(stored));
          const history = localStorage.getItem(HISTORY_KEY);
          if (history) setPromptHistory(JSON.parse(history));
          const savedPresets = localStorage.getItem(PRESETS_KEY);
          if (savedPresets) setPresets(JSON.parse(savedPresets));
        } catch (e) {
          console.error('Failed to load from localStorage:', e);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const addPrompt = async (promptData) => {
    if (!user) {
      // If not logged in, just add to local state
      const newPrompt = {
        id: Date.now().toString(),
        ...promptData,
        createdAt: new Date().toISOString(),
        usageCount: 0,
      };
      setPrompts(prev => [newPrompt, ...prev]);
      return newPrompt;
    }

    try {
      await addSavedPrompt(user.id, promptData);
      // Reload prompts from Supabase to get the real ID
      const updated = await loadSavedPrompts(user.id);
      setPrompts(updated);
    } catch (error) {
      console.error('Failed to add prompt:', error);
    }
  };

  const addToHistory = async (entry) => {
    if (!user) {
      // If not logged in, just add to local state
      const newEntry = {
        id: Date.now().toString(),
        ...entry,
        createdAt: new Date().toISOString(),
      };
      setPromptHistory(prev => [newEntry, ...prev].slice(0, MAX_HISTORY));
      return;
    }

    try {
      await addPromptHistory(user.id, entry);
      // Reload history from Supabase
      const updated = await loadPromptHistory(user.id);
      setPromptHistory(updated);
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  const clearHistory = async () => {
    setPromptHistory([]);
    // Note: You'd need to add a clearPromptHistory function to syncService.js if you want to clear from Supabase too
  };

  const deletePrompt = async (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    
    if (user) {
      try {
        await deleteSavedPrompt(user.id, id);
      } catch (error) {
        console.error('Failed to delete prompt:', error);
      }
    }
  };

  const incrementUsage = (id) => {
    setPrompts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p
      )
    );
  };

  const addPresetFunc = async (preset) => {
    if (!user) {
      // If not logged in, just add to local state
      const newPreset = {
        id: Date.now().toString(),
        ...preset,
        createdAt: new Date().toISOString(),
      };
      setPresets(prev => [newPreset, ...prev].slice(0, MAX_PRESETS));
      return newPreset;
    }

    try {
      await addPreset(user.id, preset);
      // Reload presets from Supabase
      const updated = await loadPresets(user.id);
      setPresets(updated);
    } catch (error) {
      console.error('Failed to add preset:', error);
    }
  };

  const deletePresetFunc = async (id) => {
    setPresets(prev => prev.filter(p => p.id !== id));
    
    if (user) {
      try {
        await deletePreset(user.id, id);
      } catch (error) {
        console.error('Failed to delete preset:', error);
      }
    }
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
    addPreset: addPresetFunc,
    deletePreset: deletePresetFunc,
    clearHistory,
    deletePrompt,
    incrementUsage,
    getPromptById,
    filterPrompts,
  };
}