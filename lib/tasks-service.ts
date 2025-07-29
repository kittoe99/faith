import { supabase } from './supabaseClient'
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task.types'

const TABLE = 'tasks'

async function getUserId() {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

export const TasksService = {
  async list(): Promise<Task[]> {
    const userId = await getUserId()
    if (!userId) return []
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data as Task[]
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const userId = await getUserId()
    if (!userId) throw new Error('Not signed in')
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...input, user_id: userId })
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as Task
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data as Task
  },

  async delete(id: string) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id)
    if (error) throw new Error(error.message)
  },
}
