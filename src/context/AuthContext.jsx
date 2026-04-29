import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { loadUserState, saveUserState } from '../utils/syncService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 3000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const cloudState = await loadUserState(currentUser.id);
        if (cloudState) {
          localStorage.setItem('aida_state', JSON.stringify({
            ...cloudState,
            platformsUsed: Array.from(cloudState.platformsUsed),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function syncState() {
    if (!user) return;
    const localState = JSON.parse(localStorage.getItem('aida_state') || '{}');
    await saveUserState(user.id, {
      ...localState,
      platformsUsed: new Set(localState.platformsUsed || []),
    });
  }

  async function signOut() {
    await syncState();
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, loading, syncState, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}