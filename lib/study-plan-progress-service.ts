import { supabase } from './supabaseClient'
import { UserPlanProgress } from '../types/study-plan.types'

/* -------------------------------------------------------------------------- */
/*                      Study Plan Progress Supabase API                      */
/* -------------------------------------------------------------------------- */

const TABLE = 'study_plan_progress'

/**
 * Returns the signed-in user id or null.
 */
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

/**
 * Ensures a progress row exists for (user, plan). Returns the row.
 */
async function getOrCreateRow(userId: string, planId: string, duration: number) {
  // Try fetch existing
  const { data: rows, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .eq('plan_id', planId)
    .limit(1)

  if (error) throw new Error(error.message)

  if (rows && rows.length) return rows[0]

  // Create new row
  const { data: inserted, error: insErr } = await supabase
    .from(TABLE)
    .insert({ user_id: userId, plan_id: planId, completed_days: [], completed: false })
    .select()
    .single()

  if (insErr) throw new Error(insErr.message)
  return inserted
}

export const StudyPlanProgressService = {
  /**
   * Fetch or create user progress for a plan.
   */
  async getProgress(planId: string, duration: number): Promise<UserPlanProgress> {
    const userId = await getUserId()
    if (!userId) {
      // Fallback to localStorage if not logged-in
      const { StudyPlanService } = await import('./study-plan-service')
      return StudyPlanService.getProgress(planId, duration)
    }

    const row = await getOrCreateRow(userId, planId, duration)
    return {
      planId,
      completedDays: row.completed_days ?? [],
      completed: row.completed ?? false,
    }
  },

  /**
   * Toggle a day completed/uncompleted.
   */
  async toggleDay(planId: string, day: number, duration: number) {
    const userId = await getUserId()
    if (!userId) {
      const { StudyPlanService } = await import('./study-plan-service')
      StudyPlanService.toggleDay(planId, day, duration)
      return
    }

    const row = await getOrCreateRow(userId, planId, duration)
    if (row.completed) return

    const current: number[] = row.completed_days ?? []
    const idx = current.indexOf(day)
    if (idx >= 0) current.splice(idx, 1)
    else current.push(day)

    const completed = current.length === duration

    await supabase
      .from(TABLE)
      .update({ completed_days: current, completed })
      .eq('id', row.id)
  },

  /**
   * Mark entire plan complete for user.
   */
  async markPlanComplete(planId: string) {
    const userId = await getUserId()
    if (!userId) return

    await supabase
      .from(TABLE)
      .update({ completed: true, completed_days: [] })
      .eq('user_id', userId)
      .eq('plan_id', planId)
  },
}
