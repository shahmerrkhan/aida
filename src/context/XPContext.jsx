import { createContext, useContext, useState, useEffect } from 'react';

const XPContext = createContext();

export function XPProvider({ children }) {
  const [xp, setXP] = useState(() => {
    const saved = localStorage.getItem('aida_xp');
    if (saved) return parseInt(saved, 10);
    
    const state = JSON.parse(localStorage.getItem('aida_state') || '{}');
    return state.xp || 0;
  });
  
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem('aida_level');
    if (saved) return parseInt(saved, 10);
    
    const state = JSON.parse(localStorage.getItem('aida_state') || '{}');
    return state.level || 0;
  });

  useEffect(() => {
    localStorage.setItem('aida_xp', xp.toString());
    localStorage.setItem('aida_level', level.toString());
  }, [xp, level]);

  return (
    <XPContext.Provider value={{ xp, setXP, level, setLevel }}>
      {children}
    </XPContext.Provider>
  );
}

export function useXP() {
  return useContext(XPContext);
}