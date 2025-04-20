import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Message types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

// Chat functions
export const sendMessage = async (message: Omit<Message, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();

  if (error) throw error;
  return data[0];
};

export const getMessages = async (userId: string, otherUserId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const markMessageAsRead = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId);

  if (error) throw error;
};

export const subscribeToMessages = (callback: (message: Message) => void) => {
  return supabase
    .channel('messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
      callback(payload.new as Message);
    })
    .subscribe();
}; 