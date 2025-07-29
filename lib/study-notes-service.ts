import { supabase } from './supabaseClient'

export interface StudyNote {
  id: string
  reference: string
  content: string
  created_at: string
  updated_at: string
}

const TABLE = 'study_notes'

async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data.user
}

export const StudyNotesService = {
  async list(): Promise<StudyNote[]> {
    const user = await getUser()
    if (!user) return []
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as StudyNote[]
  },

  async create(reference: string, content: string): Promise<StudyNote> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ reference, content })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as StudyNote
  },

  async update(id: string, content: string): Promise<StudyNote> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as StudyNote
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
