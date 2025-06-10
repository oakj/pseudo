export interface HomeData {
  profile: {
    user_id: string;
    email: string;
    avatar_url: string | null;
    dark_mode_preference: string;
  } | null;
  weeklyStreak: {
    streak_days: number[];
    week_start_utc: Date;
  } | null;
  collections: {
    collection_id: string;
    collection_name: string;
    is_default: boolean;
    user_id: string | null;
    default_collection_id: string | null;
  }[];
  questions: {
    question_id: string;
    title: string;
    difficulty: string;
    design_patterns: string[];
    is_solved: boolean;
  }[];
} 