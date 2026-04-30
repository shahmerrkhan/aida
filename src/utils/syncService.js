import { supabase } from './supabaseClient';

export async function loadUserState(userId) {
  try {
    const { data, error } = await supabase
      .from('user_state')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !data) return null;
    
    return {
      xp: data.xp || 0,
      level: data.level || 0,
      promptCount: data.prompt_count || 0,
      fileCount: data.file_count || 0,
      platformsUsed: new Set(data.platforms_used || []),
      lastGeneratedDate: data.last_generated_date,
      streakDays: data.streak_days || 0,
      badges: data.badges && Array.isArray(data.badges) ? data.badges.map(b => ({ ...b })) : [],
    };
  } catch (e) {
    return null;
  }
}

export async function saveUserState(userId, state) {
  const { error } = await supabase
    .from('user_state')
    .upsert({
      id: userId,
      xp: state.xp,
      level: state.level || 1,
      prompt_count: state.promptCount,
      file_count: state.fileCount,
      platforms_used: Array.from(state.platformsUsed),
      last_generated_date: state.lastGeneratedDate,
      streak_days: state.streakDays,
      badges: state.badges,
      updated_at: new Date().toISOString(),
    });
  
  if (error) console.error('Failed to save user state:', error);
}

export async function loadSavedPrompts(userId) {
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    name: p.name,
    platform: p.platform,
    taskType: p.task_type,
    subject: p.subject,
    content: p.content,
    usageCount: p.usage_count,
    rating: p.rating || 0,
    createdAt: p.created_at,
  }));
}

export async function addSavedPrompt(userId, prompt) {
  const { data, error } = await supabase
    .from('saved_prompts')
    .insert({
      user_id: userId,
      name: prompt.name,
      platform: prompt.platform,
      task_type: prompt.taskType,
      subject: prompt.subject,
      content: prompt.content,
      usage_count: 0,
      rating: prompt.rating || 0,
    })
    .select()
    .single();
  
  if (error) { console.error('Failed to save prompt:', error); return null; }
  return data;
}

export async function deleteSavedPrompt(userId, promptId) {
  const { error } = await supabase
    .from('saved_prompts')
    .delete()
    .eq('id', promptId)
    .eq('user_id', userId);
  
  if (error) console.error('Failed to delete prompt:', error);
}

export async function loadPromptHistory(userId) {
  const { data, error } = await supabase
    .from('prompt_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(15);
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    content: p.content,
    platform: p.platform,
    task: p.task,
    subject: p.subject,
    createdAt: p.created_at,
  }));
}

export async function addPromptHistory(userId, entry) {
  const { error } = await supabase
    .from('prompt_history')
    .insert({
      user_id: userId,
      content: entry.content,
      platform: entry.platform,
      task: entry.task,
      subject: entry.subject,
    });
  
  if (error) console.error('Failed to save history:', error);
}

export async function loadPresets(userId) {
  const { data, error } = await supabase
    .from('presets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data.map(p => ({
    id: p.id,
    platform: p.platform,
    task: p.task,
    subject: p.subject,
    createdAt: p.created_at,
  }));
}

export async function addPreset(userId, preset) {
  const { data, error } = await supabase
    .from('presets')
    .insert({
      user_id: userId,
      platform: preset.platform,
      task: preset.task,
      subject: preset.subject,
    })
    .select()
    .single();
  
  if (error) { console.error('Failed to save preset:', error); return null; }
  return data;
}

export async function deletePreset(userId, presetId) {
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', presetId)
    .eq('user_id', userId);
  
  if (error) console.error('Failed to delete preset:', error);
}

export async function saveUserSettings(userId, settings) {
  const { error } = await supabase
    .from('user_state')
    .upsert({
      id: userId,
      pref_platform: settings.platform,
      pref_task: settings.task,
      pref_vibe: settings.vibeLevel,
      pref_toggles: settings.toggles,
      pref_prompt_mode: settings.promptMode,
      updated_at: new Date().toISOString(),
    });
  if (error) console.error('Failed to save settings:', error);
}

export async function loadUserSettings(userId) {
  const { data, error } = await supabase
    .from('user_state')
    .select('pref_platform, pref_task, pref_vibe, pref_toggles, pref_prompt_mode')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    platform: data.pref_platform || '',
    task: data.pref_task || '',
    vibeLevel: data.pref_vibe ?? 50,
    toggles: data.pref_toggles || null,
    promptMode: data.pref_prompt_mode || 'detailed',
  };
}

export async function updatePromptRating(userId, promptId, rating) {
  const { error } = await supabase
    .from('saved_prompts')
    .update({ rating })
    .eq('id', promptId)
    .eq('user_id', userId);
  
  if (error) console.error('Failed to update rating:', error);
}