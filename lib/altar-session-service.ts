import { supabase } from './supabaseClient'
import { AltarSession, CreateAltarSessionInput, UpdateAltarSessionInput } from '../types/altar.types'

const TABLE = 'altar_sessions'

export const AltarSessionService = {
  async listRecent(limit: number = 5): Promise<AltarSession[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('session_date', { ascending: false })
      .order('session_time', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data as AltarSession[]
  },
  async list(altarId: string): Promise<AltarSession[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('altar_id', altarId)
      .order('session_date', { ascending: false })
      .order('session_time', { ascending: false })
    if (error) throw error
    return data as AltarSession[]
  },

  async create(input: CreateAltarSessionInput): Promise<AltarSession> {
    const { data, error } = await supabase.from(TABLE).insert(input).select('*').single()
    if (error) throw error
    return data as AltarSession
  },

  async update(id: string, input: UpdateAltarSessionInput): Promise<AltarSession> {
    const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
    if (error) throw error
    return data as AltarSession
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw error
  }
}
