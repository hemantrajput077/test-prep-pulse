
import { supabase } from "@/integrations/supabase/client";
import { TestDetails, Question } from "./types";

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
