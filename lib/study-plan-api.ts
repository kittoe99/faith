import { supabase, isSupabaseConfigured } from './supabaseClient'
import { StudyPlan } from '../types/study-plan.types'

/**
 * Fetch all study plans from Supabase
 */
export async function getStudyPlans(): Promise<StudyPlan[]> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching study plans:', error)
    throw new Error('Failed to fetch study plans')
  }

  // ensure readings is parsed to correct type
  return (data || []).map((row: any) => ({
    id: row.id.toString(),
    title: row.title,
    description: row.description,
    duration: row.duration,
    readings: row.readings,
  }))
}

export async function createStudyPlan(plan: Omit<StudyPlan, 'id'>): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, cannot create study plan')
    return null
  }

  const { data, error } = await supabase.from('study_plans').insert({
    title: plan.title,
    description: plan.description,
    duration: plan.duration,
    readings: plan.readings,
    source: 'client',
  }).select('id').single()

  if (error) {
    console.error('Error creating study plan:', error)
    return null
  }

  return data?.id ?? null
}
