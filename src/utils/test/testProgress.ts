
import { supabase } from "@/integrations/supabase/client";

// Start a test for a user
export const startTest = async (guestId: string, testId: string): Promise<string | null> => {
  try {
    if (!guestId || !testId) {
      console.error("Missing required parameters for startTest");
      return null;
    }

    // Check if there's an existing in-progress test
    const { data: existingProgress, error: queryError } = await supabase
      .from('user_test_progress')
      .select('id')
      .eq('user_id', guestId)
      .eq('test_id', testId)
      .eq('status', 'in_progress')
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking existing progress:", queryError);
      return null;
    }
    
    // If there's an existing in-progress test, return its ID
    if (existingProgress?.id) {
      console.log("Resuming existing test progress:", existingProgress.id);
      return existingProgress.id;
    }
    
    // Otherwise create a new test progress entry
    const { data, error } = await supabase
      .from('user_test_progress')
      .insert({
        user_id: guestId,
        test_id: testId,
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();
    
    if (error) {
      console.error("Error starting test:", error);
      
      // For debugging purposes, check if it's an RLS policy issue
      if (error.code === '42501') {
        console.error("RLS policy violation - check that RLS policies are configured correctly");
      }
      
      // Fall back to using a local ID when the database insert fails
      return `local-${Date.now()}`;
    }
    
    console.log("Created new test progress:", data.id);
    return data.id;
  } catch (err) {
    console.error("Error in startTest:", err);
    // Fall back to using a local ID when an exception occurs
    return `local-${Date.now()}`;
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
    if (!progressId || !guestId) {
      console.error("Missing required parameters for completeTest");
      return false;
    }

    // Check if it's a local ID
    if (progressId.startsWith('local-')) {
      console.log("Using local storage for test completion since we have a local ID");
      // Store in localStorage for offline mode
      const historyItem = {
        id: progressId,
        user_id: guestId,
        status: 'completed',
        score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('testHistory', JSON.stringify(existingHistory.slice(0, 10)));
      return true;
    }

    const { error } = await supabase
      .from('user_test_progress')
      .update({
        status: 'completed',
        score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString()
      })
      .eq('id', progressId)
      .eq('user_id', guestId);
    
    if (error) {
      console.error("Error completing test:", error);
      
      // Fall back to localStorage if the database update fails
      const historyItem = {
        id: progressId,
        user_id: guestId,
        status: 'completed',
        score: score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString(),
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('testHistory', JSON.stringify(existingHistory.slice(0, 10)));
      
      return false;
    }
    
    console.log("Successfully completed test:", progressId);
    return true;
  } catch (err) {
    console.error("Error in completeTest:", err);
    return false;
  }
};

// Get test progress history for a user
export const getTestProgressHistory = async (guestId: string, limit?: number) => {
  try {
    if (!guestId) {
      console.error("Missing guestId for getTestProgressHistory");
      return [];
    }

    let query = supabase
      .from('user_test_progress')
      .select(`
        id,
        test_id,
        status,
        score,
        created_at,
        completed_at,
        time_spent,
        tests (
          title,
          category,
          difficulty
        )
      `)
      .eq('user_id', guestId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching test history:", error);
      
      // Try to fall back to localStorage for test history
      const storedHistory = localStorage.getItem('testHistory');
      if (storedHistory) {
        try {
          const history = JSON.parse(storedHistory);
          console.log("Using localStorage test history:", history.length, "entries");
          return history;
        } catch (e) {
          console.error("Failed to parse localStorage test history:", e);
          return [];
        }
      }
      
      return [];
    }
    
    if (data && data.length > 0) {
      console.log("Fetched test history from database:", data.length, "entries");
      // Store in localStorage as a backup
      localStorage.setItem('testHistory', JSON.stringify(data));
      return data;
    } else {
      console.log("No test history found in database");
      // Try to fall back to localStorage
      const storedHistory = localStorage.getItem('testHistory');
      if (storedHistory) {
        try {
          return JSON.parse(storedHistory);
        } catch (e) {
          console.error("Failed to parse localStorage test history:", e);
          return [];
        }
      }
      return [];
    }
  } catch (err) {
    console.error("Error in getTestProgressHistory:", err);
    
    // Fall back to localStorage in case of error
    const storedHistory = localStorage.getItem('testHistory');
    if (storedHistory) {
      try {
        return JSON.parse(storedHistory);
      } catch (e) {
        console.error("Failed to parse localStorage test history:", e);
        return [];
      }
    }
    
    return [];
  }
};
