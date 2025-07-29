import { supabase } from './supabaseClient'
import { JournalEntry, CreateJournalEntryInput, UpdateJournalEntryInput } from '../types/journal.types'

const TABLE = 'journal_entries'

async function getUserId() {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export const JournalService = {
  async list(): Promise<JournalEntry[]> {
    const userId = await getUserId()
    if (!userId) return []
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('entry_date', { ascending: false })
    if (error) throw new Error(error.message)
    return data as JournalEntry[]
  },

  async create(input: CreateJournalEntryInput): Promise<JournalEntry> {
    const userId = await getUserId()
    if (!userId) throw new Error('Not signed in')
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...input, user_id: userId })
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as JournalEntry
  },

  async update(id: string, input: UpdateJournalEntryInput): Promise<JournalEntry> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as JournalEntry
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
