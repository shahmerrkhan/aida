import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function submitFeedback({ message, userId, platform }) {
  const { error } = await supabase
    .from('feedback')
    .insert({ message, user_id: userId || null, platform: platform || null });
  if (error) throw error;
}