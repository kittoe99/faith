import { supabase } from './supabaseClient'

const TABLE = 'income_tithes'

export interface IncomeTithe {
  id: string
  user_id: string
  description: string
  amount: number
  percentage: number
  tithe_amount: number
  tithe_paid: boolean
  created_at: string
}

async function getUserId() {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export const IncomeTithesService = {
  async list(): Promise<IncomeTithe[]> {
    const userId = await getUserId()
    if (!userId) return []
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as IncomeTithe[]
  },

  async create(input: Omit<IncomeTithe, 'id' | 'created_at' | 'tithe_paid' | 'user_id'>): Promise<IncomeTithe> {
    const userId = await getUserId()
    if (!userId) throw new Error('Not signed in')
    const payload = { ...input, user_id: userId, tithe_paid: false }
    const { data, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as IncomeTithe
  },

  async markPaid(id: string): Promise<IncomeTithe> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ tithe_paid: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as IncomeTithe
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
