
import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: number;
  content: string;
  options: {
    id: string;
    text: string;
  }[];
  correct_answer: string;
  test_id?: string;
}

export interface TestDetails {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration: number;
  questions: Question[];
}

export interface TestProgress {
  id: string;
  user_id: string;
  test_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number | null;
  started_at: string;
  completed_at: string | null;
  time_spent: number | null;
}

export interface QuestionScore {
  guest_id: string; // Will be mapped to user_id in the function
  test_id: string;
  question_id: number;
  is_correct: boolean;
  time_taken?: number;
}
