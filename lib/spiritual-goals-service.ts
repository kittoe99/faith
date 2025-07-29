import { supabase } from './supabaseClient'
import {
  SpiritualGoal,
  CreateSpiritualGoalInput,
  UpdateSpiritualGoalInput,
} from '../types/goal.types'

const TABLE = 'spiritual_goals'

async function getUserId(): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

export const SpiritualGoalsService = {
  async list(): Promise<SpiritualGoal[]> {
    const userId = await getUserId()
    if (!userId) return []

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as SpiritualGoal[]
  },

  async create(input: CreateSpiritualGoalInput): Promise<SpiritualGoal> {
    const userId = await getUserId()
    if (!userId) throw new Error('Not signed in')

    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...input, user_id: userId })
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as SpiritualGoal
  },

  async update(id: string, input: UpdateSpiritualGoalInput): Promise<SpiritualGoal> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as SpiritualGoal
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
