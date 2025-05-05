import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: number;
  content: string;
  options: {
    id: string;
    text: string;
  }[];
  correct_answer: string;
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
  guest_id: string;
  test_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number | null;
  started_at: string;
  completed_at: string | null;
  time_spent: number | null;
}

export interface QuestionScore {
  guest_id: string;
  test_id: string;
  question_id: number;
  is_correct: boolean;
  time_taken?: number;
}

// Fetch a test with its questions
export const fetchTestWithQuestions = async (testId: string): Promise<TestDetails | null> => {
  try {
    // First fetch the test details
    const { data: testData, error: testError } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();
    
    if (testError || !testData) {
      console.error("Error fetching test:", testError);
      return null;
    }
    
    // Then fetch the questions for this test
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId);
    
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return null;
    }
    
    return {
      ...testData,
      questions: questions || []
    };
  } catch (err) {
    console.error("Error in fetchTestWithQuestions:", err);
    return null;
  }
};

// Start a test for a user
export const startTest = async (guestId: string, testId: string): Promise<string | null> => {
  try {
    // Check if there's an existing in-progress test
    const { data: existingProgress } = await supabase
      .from('user_test_progress')
      .select('id')
      .eq('guest_id', guestId)
      .eq('test_id', testId)
      .eq('status', 'in_progress')
      .maybeSingle();
    
    // If there's an existing in-progress test, return its ID
    if (existingProgress?.id) {
      return existingProgress.id;
    }
    
    // Otherwise create a new test progress entry
    const { data, error } = await supabase
      .from('user_test_progress')
      .insert({
        guest_id: guestId,
        test_id: testId,
        status: 'in_progress'
      })
      .select('id')
      .single();
    
    if (error || !data) {
      console.error("Error starting test:", error);
      return null;
    }
    
    return data.id;
  } catch (err) {
    console.error("Error in startTest:", err);
    return null;
  }
};

// Complete a test
export const completeTest = async (
  progressId: string, 
  guestId: string,
  score: number, 
  timeSpent: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_test_progress')
      .update({
        status: 'completed',
        score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString()
      })
      .eq('id', progressId)
      .eq('guest_id', guestId);
    
    if (error) {
      console.error("Error completing test:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in completeTest:", err);
    return false;
  }
};

// Save a question response
export const saveQuestionScore = async (score: QuestionScore): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scores')
      .insert(score);
    
    if (error) {
      console.error("Error saving question score:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in saveQuestionScore:", err);
    return false;
  }
};

// Get test progress statistics for a guest
export const getTestStatistics = async (guestId: string) => {
  try {
    // Get total tests taken
    const { data: totalTests, error: totalError } = await supabase
      .from('user_test_progress')
      .select('count', { count: 'exact' })
      .eq('guest_id', guestId)
      .eq('status', 'completed');
    
    // Get average score
    const { data: scores, error: scoresError } = await supabase
      .from('user_test_progress')
      .select('score')
      .eq('guest_id', guestId)
      .eq('status', 'completed')
      .not('score', 'is', null);
    
    // Get total questions solved
    const { data: questions, error: questionsError } = await supabase
      .from('scores')
      .select('count', { count: 'exact' })
      .eq('guest_id', guestId);
    
    // Calculate practice hours
    const { data: timeSpent, error: timeSpentError } = await supabase
      .from('user_test_progress')
      .select('time_spent')
      .eq('guest_id', guestId)
      .eq('status', 'completed')
      .not('time_spent', 'is', null);
    
    // Calculate average score
    const avgScore = scores && scores.length > 0
      ? scores.reduce((sum, item) => sum + (item.score || 0), 0) / scores.length
      : 0;
    
    // Calculate total hours
    const totalHours = timeSpent && timeSpent.length > 0
      ? timeSpent.reduce((sum, item) => sum + (item.time_spent || 0), 0) / 60
      : 0;
    
    return {
      totalTests: totalTests?.count || 0,
      avgScore: avgScore.toFixed(1),
      questionsSolved: questions?.count || 0,
      practiceHours: totalHours.toFixed(1)
    };
  } catch (err) {
    console.error("Error fetching test statistics:", err);
    return {
      totalTests: 0,
      avgScore: 0,
      questionsSolved: 0,
      practiceHours: 0
    };
  }
};
