
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
    const { data: questionsData, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('test_id', testId);
    
    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return null;
    }
    
    // Parse the options from JSON to object
    const questions = questionsData?.map(question => ({
      id: question.id,
      content: question.content,
      options: typeof question.options === 'string' 
        ? JSON.parse(question.options) 
        : question.options,
      correct_answer: question.correct_answer,
      test_id: question.test_id
    })) || [];
    
    return {
      ...testData,
      questions
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
    const { data: existingProgress, error: queryError } = await supabase
      .from('user_test_progress')
      .select('id')
      .eq('guest_id', guestId)
      .eq('test_id', testId)
      .eq('status', 'in_progress')
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking existing progress:", queryError);
      return null;
    }
    
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
export const saveQuestionScore = async (scoreData: QuestionScore): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scores')
      .insert({
        guest_id: scoreData.guest_id,
        test_id: scoreData.test_id,
        question_id: scoreData.question_id,
        is_correct: scoreData.is_correct,
        score: scoreData.is_correct ? 1 : 0, // Adding score field
        time_taken: scoreData.time_taken || null
      });
    
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
    // Get total tests taken - Fix: Changed from count to countQuery approach
    const { data: testsData, error: totalError } = await supabase
      .from('user_test_progress')
      .select('id')
      .eq('guest_id', guestId)
      .eq('status', 'completed');
    
    if (totalError) {
      console.error("Error fetching total tests:", totalError);
    }
    
    const totalTests = testsData?.length || 0;
    
    // Get average score
    const { data: scores, error: scoresError } = await supabase
      .from('user_test_progress')
      .select('score')
      .eq('guest_id', guestId)
      .eq('status', 'completed')
      .not('score', 'is', null);
    
    if (scoresError) {
      console.error("Error fetching scores:", scoresError);
    }
    
    // Get total questions solved - Fix: Changed from count to countQuery approach
    const { data: questionsData, error: questionsError } = await supabase
      .from('scores')
      .select('id')
      .eq('guest_id', guestId);
    
    if (questionsError) {
      console.error("Error fetching questions solved:", questionsError);
    }
    
    const questionsSolved = questionsData?.length || 0;
    
    // Calculate practice hours
    const { data: timeSpent, error: timeSpentError } = await supabase
      .from('user_test_progress')
      .select('time_spent')
      .eq('guest_id', guestId)
      .eq('status', 'completed')
      .not('time_spent', 'is', null);
    
    if (timeSpentError) {
      console.error("Error fetching time spent:", timeSpentError);
    }
    
    // Calculate average score
    const avgScore = scores && scores.length > 0
      ? scores.reduce((sum, item) => sum + (item.score || 0), 0) / scores.length
      : 0;
    
    // Calculate total hours
    const totalHours = timeSpent && timeSpent.length > 0
      ? timeSpent.reduce((sum, item) => sum + (item.time_spent || 0), 0) / 60
      : 0;
    
    return {
      totalTests,
      avgScore: avgScore.toFixed(1),
      questionsSolved,
      practiceHours: totalHours.toFixed(1)
    };
  } catch (err) {
    console.error("Error fetching test statistics:", err);
    return {
      totalTests: 0,
      avgScore: '0.0',
      questionsSolved: 0,
      practiceHours: '0.0'
    };
  }
};
