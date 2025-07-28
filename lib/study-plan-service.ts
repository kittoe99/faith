import { StudyPlan, UserPlanProgress } from '../types/study-plan.types'
import { v4 as uuid } from 'uuid'

/* -------------------------------------------------------------------------- */
/*                                Built-in data                               */
/* -------------------------------------------------------------------------- */

// Helper to create sequential numeric array
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)

// Generates a simple "read the Bible in one year" plan – 365 days, OT+NT+Psalm+Proverb per day
function generateOneYearPlan(): StudyPlan {
  const readings = range(365).map((d) => ({
    day: d,
    passages: [`Day ${d}: OT`, `Day ${d}: NT`],
  }))
  return {
    id: 'one-year-bible',
    title: 'One Year Bible',
    description: 'Read the entire Bible in 365 days (OT, NT, Psalms & Proverbs each day).',
    duration: 365,
    readings,
    source: 'https://oneyearbibleonline.com/',
  }
}

function generateMcCheynePlan(): StudyPlan {
  const readings = range(365).map((d) => ({
    day: d,
    passages: [`M\'Cheyne Day ${d}`],
  }))
  return {
    id: 'mcheyne',
    title: "M'Cheyne Reading Plan",
    description: 'Classic 4-chapters-per-day plan covering the OT once and NT / Psalms twice.',
    duration: 365,
    readings,
    source: 'https://www.mcheyne.info/calendar.pdf',
  }
}

function generateNinetyDayNT(): StudyPlan {
  const readings = range(90).map((d) => ({ day: d, passages: [`NT Day ${d}`] }))
  return {
    id: '90-day-nt',
    title: '90-Day New Testament',
    description: 'Read the entire New Testament in 3 months.',
    duration: 90,
    readings,
  }
}

function generateThirtyDayGospels(): StudyPlan {
  const readings = range(30).map((d) => ({ day: d, passages: [`Gospels Day ${d}`] }))
  return {
    id: '30-day-gospels',
    title: '30-Day Gospels',
    description: 'Journey through Matthew, Mark, Luke & John in a month.',
    duration: 30,
    readings,
  }
}

function generatePsalmProverb31(): StudyPlan {
  const readings = range(31).map((d) => ({ day: d, passages: [`Psalms & Proverbs Day ${d}`] }))
  return {
    id: 'psalms-proverbs-31',
    title: '31-Day Psalms & Proverbs',
    description: 'Daily wisdom readings for a month.',
    duration: 31,
    readings,
  }
}



const builtInPlans: StudyPlan[] = [
  generateOneYearPlan(),
  generateMcCheynePlan(),
  generateNinetyDayNT(),
  generateThirtyDayGospels(),
  generatePsalmProverb31(),
]

/* -------------------------------------------------------------------------- */
/*                       Local storage helpers (simple)                       */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'altar.studyPlan.progress'

function loadProgress(): Record<string, UserPlanProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(map: Record<string, UserPlanProgress>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

function getOrCreateProgress(planId: string, duration: number): UserPlanProgress {
  const map = loadProgress()
  if (!map[planId]) {
    map[planId] = { planId, completedDays: [], completed: false }
    saveProgress(map)
  }
  return map[planId]
}

/* -------------------------------------------------------------------------- */
/*                                Public API                                  */
/* -------------------------------------------------------------------------- */

export const StudyPlanService = {
  getBuiltInPlans(): StudyPlan[] {
    return builtInPlans
  },

  getProgress(planId: string, duration: number): UserPlanProgress {
    return getOrCreateProgress(planId, duration)
  },

  toggleDay(planId: string, day: number, duration: number) {
    const map = loadProgress()
    const progress = getOrCreateProgress(planId, duration)
    if (progress.completed) return
    const idx = progress.completedDays.indexOf(day)
    if (idx >= 0) {
      progress.completedDays.splice(idx, 1)
    } else {
      progress.completedDays.push(day)
    }
    // auto complete if all days checked
    if (progress.completedDays.length === duration) {
      progress.completed = true
    }
    map[planId] = progress
    saveProgress(map)
  },

  markPlanComplete(planId: string) {
    const map = loadProgress()
    if (map[planId]) {
      map[planId].completed = true
      map[planId].completedDays = []
      saveProgress(map)
    }
  },

  createCustomPlan(title: string, description: string, readings: { day: number; passages: string[] }[]): StudyPlan {
    const plan: StudyPlan = {
      id: uuid(),
      title,
      description,
      duration: readings.length,
      readings,
    }
    builtInPlans.push(plan) // treat as part of list for now
    return plan
  },
}
