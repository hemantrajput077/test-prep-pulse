
import { supabase } from "@/integrations/supabase/client";

// Get test progress statistics for a user
export const getTestStatistics = async (guestId: string) => {
  try {
    // Get completed tests count
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

// Get a breakdown of test performance by category
export const getPerformanceByCategory = async (guestId: string) => {
  try {
    // Get test results with category information
    const { data, error } = await supabase
      .from('user_test_progress')
      .select(`
        score,
        tests (
          category
        )
      `)
      .eq('user_id', guestId)
      .eq('status', 'completed')
      .not('score', 'is', null);
    
    if (error) {
      console.error("Error fetching category performance:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Group by category and calculate average scores
    const categoryScores: Record<string, {total: number, count: number}> = {};
    
    data.forEach(item => {
      const category = item.tests?.category;
      if (!category || !item.score) return;
      
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0 };
      }
      
      categoryScores[category].total += item.score;
      categoryScores[category].count += 1;
      
      return;
    });
    
    // Convert to array with average scores
    return Object.entries(categoryScores).map(([category, data]) => ({
      name: category,
      progress: Math.round(data.total / data.count)
    }));
  } catch (err) {
    console.error("Error in getPerformanceByCategory:", err);
    return [];
  }
};

// Get weak areas based on scores
export const getWeakAreas = async (guestId: string) => {
  try {
    // Try to call the RPC function if it exists
    try {
      const { data, error } = await supabase.rpc('get_weak_areas', { 
        user_id_param: guestId 
      });
      
      if (!error && data) {
        return data;
      }
    } catch (rpcErr) {
      console.error("RPC function error:", rpcErr);
      // Fall through to fallback implementation
    }
    
    // Fallback implementation if RPC function doesn't exist or fails
    // Return default weak areas
    return [
      "Probability",
      "Time and Work",
      "Reading Comprehension",
      "Binary Search",
    ];
  } catch (err) {
    console.error("Error in getWeakAreas:", err);
    return [
      "Probability",
      "Time and Work",
      "Reading Comprehension",
      "Binary Search",
    ];
  }
};
