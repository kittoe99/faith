export interface Task {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string // ISO date
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  created_at: string
  updated_at: string
}

export interface CreateTaskInput {
  title: string
  description?: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  user_id?: string
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  due_date?: string
  priority?: 'low' | 'medium' | 'high'
  completed?: boolean
}
