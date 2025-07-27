import { supabase } from './supabase';

export type FaithEntry = {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  category: 'testimony' | 'miracle' | 'answered_prayer' | 'blessing' | 'lesson';
  reference_verse?: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
};

export const FaithService = {
  // Create a new faith entry
  async createEntry(entry: Omit<FaithEntry, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('faith_entries')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all entries for the current user
  async getUserEntries(userId: string) {
    const { data, error } = await supabase
      .from('faith_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single entry by ID
  async getEntryById(id: string) {
    const { data, error } = await supabase
      .from('faith_entries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing entry
  async updateEntry(
    id: string,
    updates: Partial<Omit<FaithEntry, 'id' | 'user_id' | 'created_at'>>
  ) {
    const { data, error } = await supabase
      .from('faith_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an entry
  async deleteEntry(id: string) {
    const { error } = await supabase
      .from('faith_entries')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get public entries (for community features)
  async getPublicEntries(limit = 10) {
    const { data, error } = await supabase
      .from('faith_entries')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Subscribe to real-time updates
  subscribeToUpdates(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('faith_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'faith_entries',
        },
        (payload) => callback(payload)
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(subscription);
    };
  },
};
