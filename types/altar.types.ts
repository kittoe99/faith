export interface AltarPractice {
  id: string;
  user_id: string;
  name: string;
  type: string;
  purpose: string;
  practices: string[];
  sacrifices: string[];
  custom_items: string[];
  created_at: string;
  updated_at: string;
}

export interface AltarFormData {
  name: string;
  type: string;
  purpose: string;
  customPurpose: string;
  practices: string[];
  sacrifices: string[];
  customItems: string[];
}

export interface CreateAltarPracticeInput {
  name: string;
  type: string;
  purpose: string;
  practices: string[];
  sacrifices: string[];
  custom_items: string[];
}

export interface AltarSession {
  id: string;
  altar_id: string;
  user_id: string;
  session_date: string; // ISO date
  session_time: string; // HH:MM:SS
  activities: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAltarSessionInput {
  altar_id: string;
  session_date: string;
  session_time: string;
  activities: string[];
  notes: string;
  user_id?: string; // optional, added for Supabase RLS
}

export interface UpdateAltarSessionInput {
  session_date?: string;
  session_time?: string;
  activities?: string[];
  notes?: string;
}

export interface UpdateAltarPracticeInput {
  name?: string;
  type?: string;
  purpose?: string;
  practices?: string[];
  sacrifices?: string[];
  custom_items?: string[];
}

export interface AltarPracticeServiceType {
  getAltarPractices: () => Promise<AltarPractice[]>;
  createAltarPractice: (input: CreateAltarPracticeInput) => Promise<AltarPractice>;
  updateAltarPractice: (id: string, input: UpdateAltarPracticeInput) => Promise<AltarPractice>;
  deleteAltarPractice: (id: string) => Promise<boolean>;
}
