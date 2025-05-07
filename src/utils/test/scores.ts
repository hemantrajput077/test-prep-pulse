
import { supabase } from "@/integrations/supabase/client";
import { QuestionScore } from "./types";

// Save a question response
export const saveQuestionScore = async (scoreData: QuestionScore): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scores')
      .insert({
        user_id: scoreData.guest_id, // Maps guest_id to user_id
        test_id: scoreData.test_id,
        question_id: scoreData.question_id,
        is_correct: scoreData.is_correct,
        score: scoreData.is_correct ? 1 : 0,
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
