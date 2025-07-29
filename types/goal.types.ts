export interface SpiritualGoal {
  id: string
  user_id: string
  title: string
  description?: string
  target_date?: string // ISO date
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateSpiritualGoalInput {
  title: string
  description?: string
  target_date?: string
  user_id?: string
}

export interface UpdateSpiritualGoalInput {
  title?: string
  description?: string
  target_date?: string
  completed?: boolean
}
