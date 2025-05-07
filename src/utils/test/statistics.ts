
import { supabase } from "@/integrations/supabase/client";

// Get test progress statistics for a user
export const getTestStatistics = async (guestId: string) => {
  try {
    // Get completed tests (avoid using count with complex queries)
    const { data: testsData, error: totalError } = await supabase
      .from('user_test_progress')
      .select('id')
      .eq('user_id', guestId)
      .eq('status', 'completed');
    
    if (totalError) {
      console.error("Error fetching total tests:", totalError);
    }
    
    const totalTests = testsData?.length || 0;
    
    // Get scores from completed tests
    const { data: scoreData, error: scoresError } = await supabase
      .from('user_test_progress')
      .select('score')
      .eq('user_id', guestId)
      .eq('status', 'completed')
      .not('score', 'is', null);
    
    if (scoresError) {
      console.error("Error fetching scores:", scoresError);
    }
    
    // Get total questions answered
    const { data: questionsData, error: questionsError } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', guestId);
    
    if (questionsError) {
      console.error("Error fetching questions solved:", questionsError);
    }
    
    const questionsSolved = questionsData?.length || 0;
    
    // Get time spent data
    const { data: timeData, error: timeSpentError } = await supabase
      .from('user_test_progress')
      .select('time_spent')
      .eq('user_id', guestId)
      .eq('status', 'completed')
      .not('time_spent', 'is', null);
    
    if (timeSpentError) {
      console.error("Error fetching time spent:", timeSpentError);
    }
    
    // Calculate average score
    const avgScore = scoreData && scoreData.length > 0
      ? scoreData.reduce((sum, item) => sum + (item.score || 0), 0) / scoreData.length
      : 0;
    
    // Calculate total practice hours
    const totalHours = timeData && timeData.length > 0
      ? timeData.reduce((sum, item) => sum + (item.time_spent || 0), 0) / 60 // Convert minutes to hours
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
