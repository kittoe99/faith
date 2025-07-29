export interface JournalEntry {
  id: string
  user_id: string
  title: string
  content: string
  entry_date: string
  mood: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface CreateJournalEntryInput {
  title: string
  content: string
  mood?: string
  tags?: string[]
  user_id?: string
}

export interface UpdateJournalEntryInput {
  title?: string
  content?: string
  mood?: string
  tags?: string[]
}
