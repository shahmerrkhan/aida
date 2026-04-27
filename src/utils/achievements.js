/**
 * Optimized XP System
 * 25 levels with moderate exponential scaling
 * Early levels: Quick progression (days)
 * Mid levels: Steady progression (weeks-months)
 * Late levels: Real grind but achievable (months-years)
 * Sweet spot for engagement without burnout
 */

const LEVELS = [
  { level: 1, minXP: 0, label: 'Newbie', emoji: '🌱' },
  { level: 2, minXP: 20, label: 'Spark', emoji: '✨' },
  { level: 3, minXP: 50, label: 'Glow', emoji: '🔥' },
  { level: 4, minXP: 100, label: 'Flame', emoji: '🌟' },
  { level: 5, minXP: 170, label: 'Blaze', emoji: '⚡' },
  { level: 6, minXP: 270, label: 'Inferno', emoji: '🎯' },
  { level: 7, minXP: 400, label: 'Phoenix', emoji: '🚀' },
  { level: 8, minXP: 560, label: 'Sentinel', emoji: '🛡️' },
  { level: 9, minXP: 760, label: 'Archwiz', emoji: '🧙' },
  { level: 10, minXP: 1000, label: 'Sage', emoji: '🎓' },
  { level: 11, minXP: 1300, label: 'Luminary', emoji: '💎' },
  { level: 12, minXP: 1650, label: 'Ascendant', emoji: '👑' },
  { level: 13, minXP: 2050, label: 'Ethereal', emoji: '🌌' },
  { level: 14, minXP: 2500, label: 'Celestial', emoji: '🌠' },
  { level: 15, minXP: 3000, label: 'Divine', emoji: '⭐' },
  { level: 16, minXP: 3600, label: 'Titan', emoji: '🏛️' },
  { level: 17, minXP: 4250, label: 'Leviathan', emoji: '🐉' },
  { level: 18, minXP: 4950, label: 'Primordial', emoji: '🌋' },
  { level: 19, minXP: 5700, label: 'Cosmic', emoji: '🌍' },
  { level: 20, minXP: 6500, label: 'Omniscient', emoji: '🔮' },
  { level: 21, minXP: 7350, label: 'Legendary', emoji: '🏆' },
  { level: 22, minXP: 8250, label: 'Mythic', emoji: '🎭' },
  { level: 23, minXP: 9200, label: 'Eternal', emoji: '♾️' },
  { level: 24, minXP: 10200, label: 'Infinite', emoji: '🌀' },
  { level: 25, minXP: 11250, label: 'Aida Master', emoji: '👑✨' },
];

const BADGES = [
  { id: 'first_prompt', label: 'First Spark', desc: 'Generated your first prompt', emoji: '🎉', unlocked: false },
  { id: 'five_prompts', label: 'Getting Started', desc: 'Generated 5 prompts', emoji: '🚀', unlocked: false },
  { id: 'note_dropper', label: 'File Master', desc: 'Uploaded files 5 times', emoji: '📎', unlocked: false },
  { id: 'vibe_setter', label: 'Vibes Only', desc: 'Set vibe to max chill (85+)', emoji: '😎', unlocked: false },
  { id: 'ai_hopper', label: 'Platform Hopper', desc: 'Used 5 different AI platforms', emoji: '🌍', unlocked: false },
  { id: 'consistent', label: '7-Day Grind', desc: 'Generated prompts on 7 consecutive days', emoji: '📅', unlocked: false },
  { id: 'night_owl', label: 'Night Owl', desc: 'Generated a prompt after midnight', emoji: '🌙', unlocked: false },
  { id: 'level_5', label: 'Rising Star', desc: 'Reached level 5', emoji: '⭐', unlocked: false },
  { id: 'level_10', label: 'Sage Status', desc: 'Reached level 10', emoji: '🎓', unlocked: false },
  { id: 'level_15', label: 'Divine Being', desc: 'Reached level 15', emoji: '✨', unlocked: false },
  { id: 'level_20', label: 'Omni-User', desc: 'Reached level 20', emoji: '🔮', unlocked: false },
  { id: 'level_25', label: 'Aida Deity', desc: 'Reached level 25', emoji: '👑', unlocked: false },
  { id: 'all_platforms', label: 'Master of All', desc: 'Used all 10 AI platforms', emoji: '🎯', unlocked: false },
  { id: 'speed_demon', label: 'Speed Demon', desc: 'Generated 30 prompts total', emoji: '⚡', unlocked: false },
];

// XP rewards — balanced for good pacing
const XP_REWARDS = {
  generatePrompt: 5,      // Base: 5 XP per prompt
  uploadNotes: 3,         // Upload notes: 3 XP
  useNewPlatform: 5,      // New platform: 5 XP bonus
  maxVibe: 2,             // Max vibe (85+): 2 XP
  streak: 3,              // Daily streak: 3 XP bonus
};

export function getState() {
  const saved = localStorage.getItem('aida_state');
  if (!saved) {
    return {
      xp: 0,
      level: 1,
      promptCount: 0,
      fileCount: 0,
      platformsUsed: new Set(),
      lastGeneratedDate: null,
      streakDays: 0,
      badges: BADGES.map(b => ({ ...b })),
    };
  }
  const state = JSON.parse(saved);
  // Convert platformsUsed back to Set
  state.platformsUsed = new Set(state.platformsUsed || []);
  return state;
}

export function saveState(state) {
  const toSave = {
    ...state,
    platformsUsed: Array.from(state.platformsUsed), // Convert Set to Array for JSON
  };
  localStorage.setItem('aida_state', JSON.stringify(toSave));
}

export function getLevelInfo(level) {
  return LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
}

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

export function getCurrentLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      return LEVELS[i].level;
    }
  }
  return 1;
}

export function getLevelProgress(xp) {
  const currentLevel = getCurrentLevel(xp);
  const currentLevelInfo = LEVELS[currentLevel - 1];
  const nextLevelInfo = LEVELS[currentLevel];

  if (!nextLevelInfo) {
    return 100; // Max level reached
  }

  const currentXP = xp - currentLevelInfo.minXP;
  const nextXP = nextLevelInfo.minXP - currentLevelInfo.minXP;
  const progress = (currentXP / nextXP) * 100;

  return Math.min(progress, 100);
}

export function getXPForNextLevel(xp) {
  const currentLevel = getCurrentLevel(xp);
  if (currentLevel >= 25) return 0; // Max level reached

  const nextLevel = LEVELS[currentLevel]; // currentLevel is 1-indexed, LEVELS is 0-indexed
  if (!nextLevel) return 0;

  return nextLevel.minXP - xp;
}

export function recordPrompt({ platform, usedNotes, vibeLevel }) {
  const state = getState();
  const before = state.xp;
  let xpGained = 0;
  const newBadges = [];

  // Base XP for generating
  xpGained += XP_REWARDS.generatePrompt;

  // Bonus for uploading notes
  if (usedNotes) {
    xpGained += XP_REWARDS.uploadNotes;
    state.fileCount++;

    // Badge: File Master (5 uploads)
    if (state.fileCount === 5 && !state.badges.find(b => b.id === 'note_dropper')?.unlocked) {
      const badge = state.badges.find(b => b.id === 'note_dropper');
      if (badge) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
  }

  // Bonus for new platform
  if (!state.platformsUsed.has(platform)) {
    state.platformsUsed.add(platform);
    xpGained += XP_REWARDS.useNewPlatform;

    // Badge: Platform Hopper (5 platforms)
    if (state.platformsUsed.size === 5 && !state.badges.find(b => b.id === 'ai_hopper')?.unlocked) {
      const badge = state.badges.find(b => b.id === 'ai_hopper');
      if (badge) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }

    // Badge: Master of All (10 platforms)
    if (state.platformsUsed.size === 10 && !state.badges.find(b => b.id === 'all_platforms')?.unlocked) {
      const badge = state.badges.find(b => b.id === 'all_platforms');
      if (badge) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
  }

  // Bonus for max vibe
  if (vibeLevel >= 85) {
    xpGained += XP_REWARDS.maxVibe;
  }

  // Increment prompt count
  state.promptCount++;

  // Badge: First Spark
  if (state.promptCount === 1 && !state.badges.find(b => b.id === 'first_prompt')?.unlocked) {
    const badge = state.badges.find(b => b.id === 'first_prompt');
    if (badge) {
      badge.unlocked = true;
      newBadges.push(badge);
    }
  }

  // Badge: Getting Started (5 prompts)
  if (state.promptCount === 5 && !state.badges.find(b => b.id === 'five_prompts')?.unlocked) {
    const badge = state.badges.find(b => b.id === 'five_prompts');
    if (badge) {
      badge.unlocked = true;
      newBadges.push(badge);
    }
  }

  // Badge: Speed Demon (30 prompts)
  if (state.promptCount === 30 && !state.badges.find(b => b.id === 'speed_demon')?.unlocked) {
    const badge = state.badges.find(b => b.id === 'speed_demon');
    if (badge) {
      badge.unlocked = true;
      newBadges.push(badge);
    }
  }

  // Vibe Badge
  if (vibeLevel >= 85 && !state.badges.find(b => b.id === 'vibe_setter')?.unlocked) {
    const badge = state.badges.find(b => b.id === 'vibe_setter');
    if (badge) {
      badge.unlocked = true;
      newBadges.push(badge);
    }
  }

  // Streak logic
  const today = new Date().toDateString();
  if (state.lastGeneratedDate !== today) {
    if (state.lastGeneratedDate === new Date(Date.now() - 86400000).toDateString()) {
      // Yesterday → continue streak
      state.streakDays++;
    } else {
      // Not yesterday → reset streak
      state.streakDays = 1;
    }
    state.lastGeneratedDate = today;
    xpGained += XP_REWARDS.streak;

    // Badge: 7-Day Grind
    if (state.streakDays === 7 && !state.badges.find(b => b.id === 'consistent')?.unlocked) {
      const badge = state.badges.find(b => b.id === 'consistent');
      if (badge) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
  }

  // Night Owl badge
  if (new Date().getHours() >= 0 && new Date().getHours() < 4 && !state.badges.find(b => b.id === 'night_owl')?.unlocked) {
    const badge = state.badges.find(b => b.id === 'night_owl');
    if (badge) {
      badge.unlocked = true;
      newBadges.push(badge);
    }
  }

  // Apply XP
  state.xp += xpGained;
  const newLevel = getCurrentLevel(state.xp);
  const oldLevel = getCurrentLevel(before);

  // Level-up badges
  if (newLevel !== oldLevel) {
    if (newLevel >= 5 && oldLevel < 5) {
      const badge = state.badges.find(b => b.id === 'level_5');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
    if (newLevel >= 10 && oldLevel < 10) {
      const badge = state.badges.find(b => b.id === 'level_10');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
    if (newLevel >= 15 && oldLevel < 15) {
      const badge = state.badges.find(b => b.id === 'level_15');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
    if (newLevel >= 20 && oldLevel < 20) {
      const badge = state.badges.find(b => b.id === 'level_20');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
    if (newLevel >= 25 && oldLevel < 25) {
      const badge = state.badges.find(b => b.id === 'level_25');
      if (badge && !badge.unlocked) {
        badge.unlocked = true;
        newBadges.push(badge);
      }
    }
  }

  saveState(state);

  return {
    xpGained,
    newBadges,
    state,
  };
}

export function getAllBadges() {
  return BADGES;
}

export function getBadges() {
  const state = getState();
  return state.badges;
}

// Export constants for components that need them
export { LEVELS, BADGES };
