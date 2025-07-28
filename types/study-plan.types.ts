export interface DailyReading {
  day: number;
  passages: string[]; // e.g. ["Genesis 1", "Matthew 1"]
  topic?: string; // optional topic/theme for the day
}

export interface StudyPlan {
  id: string; // uuid or slug
  title: string;
  description: string;
  duration: number; // total days
  readings: DailyReading[];
  source?: string; // optional reference/link
}

export interface UserPlanProgress {
  planId: string;
  completedDays: number[]; // list of day numbers completed
  completed: boolean;
}
