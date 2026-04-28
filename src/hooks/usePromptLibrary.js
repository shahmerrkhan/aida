import { useState, useEffect } from 'react';

const STORAGE_KEY = 'aida_prompt_library';

export function usePromptLibrary() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrompts(parsed);
      }
    } catch (error) {
      console.error('Failed to load prompts from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever prompts change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
      } catch (error) {
        console.error('Failed to save prompts to localStorage:', error);
      }
    }
  }, [prompts, isLoading]);

  const addPrompt = (promptData) => {
    const newPrompt = {
      id: Date.now().toString(),
      ...promptData,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };
    setPrompts((prev) => [newPrompt, ...prev]);
    return newPrompt;
  };

  const deletePrompt = (id) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const incrementUsage = (id) => {
    setPrompts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p
      )
    );
  };

  const getPromptById = (id) => {
    return prompts.find((p) => p.id === id);
  };

  const filterPrompts = (filters) => {
    return prompts.filter((p) => {
      if (filters.platform && p.platform !== filters.platform) return false;
      if (filters.taskType && p.taskType !== filters.taskType) return false;
      if (filters.subject && p.subject !== filters.subject) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return p.name.toLowerCase().includes(searchLower);
      }
      return true;
    });
  };

  return {
    prompts,
    isLoading,
    addPrompt,
    deletePrompt,
    incrementUsage,
    getPromptById,
    filterPrompts,
  };
}   