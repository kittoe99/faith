import { supabase } from './supabaseClient'
import { StudyPlan } from '../types/study-plan.types'

export async function getStudyPlans(): Promise<StudyPlan[]> {
  const { data, error } = await supabase
    .from('study_plans')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[Supabase] getStudyPlans error', error)
    return []
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
  const { data, error } = await supabase.from('study_plans').insert({
    title: plan.title,
    description: plan.description,
    duration: plan.duration,
    readings: plan.readings,
    source: 'client',
  }).select('id').single()

  if (error) {
    console.error('[Supabase] createStudyPlan error', error)
    return null
  }

  return data?.id ?? null
}
