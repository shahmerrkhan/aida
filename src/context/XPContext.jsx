import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';
import { loadUserState } from '../utils/syncService';

const XPContext = createContext();

export function XPProvider({ children }) {
  const { user } = useAuth();
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load XP/level on login
  useEffect(() => {
    if (!user) {
      try {
        const saved = localStorage.getItem('aida_xp');
        if (saved) setXP(parseInt(saved, 10));

        const savedLevel = localStorage.getItem('aida_level');
        if (savedLevel) setLevel(parseInt(savedLevel, 10));
      } catch (error) {
        console.error('Failed to load XP from localStorage:', error);
      }
      setIsLoading(false);
      setHasLoaded(true);
      return;
    }

    const loadXP = async () => {
  try {
    console.log('Loading XP for user:', user.id);
    const state = await loadUserState(user.id);
    console.log('Loaded state:', state);
        if (state) {
          setXP(state.xp || 0);
          setLevel(state.level || 0);
        }
      } catch (error) {
        console.error('Failed to load XP from Supabase:', error);
      }
      setIsLoading(false);
      setHasLoaded(true);
    };

    loadXP();
  }, [user]);

  // Save XP/level — only runs after initial load is fully done
  useEffect(() => {
    if (!hasLoaded || !user) return;

    localStorage.setItem('aida_xp', xp.toString());
    localStorage.setItem('aida_level', level.toString());

    const saveXP = async () => {
      try {
        const saved = localStorage.getItem('aida_state');
      if (saved) {
        const { saveUserState } = await import("../utils/syncService");
        const localState = JSON.parse(saved);
        localState.platformsUsed = new Set(localState.platformsUsed || []);
        await saveUserState(user.id, { ...localState, xp, level });
      } else {
        await supabase
          .from('user_state')
          .upsert({ id: user.id, xp, level });
      }
      } catch (error) {
        console.error('Failed to save XP:', error);
      }
    };
    saveXP();
  }, [xp, level, user, hasLoaded]);

  return (
    <XPContext.Provider value={{ xp, setXP, level, setLevel, isLoading }}>
      {children}
    </XPContext.Provider>
  );
}

export function useXP() {
  return useContext(XPContext);
}