
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

// Get topic performance statistics
export const getTopicPerformance = async (guestId: string) => {
  try {
    const { data, error } = await supabase
      .from('scores')
      .select(`
        score,
        is_correct,
        questions (
          content
        )
      `)
      .eq('user_id', guestId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching topic performance:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [
        { topicName: "Algebra", correct: 75, incorrect: 25 },
        { topicName: "Geometry", correct: 60, incorrect: 40 },
        { topicName: "Probability", correct: 40, incorrect: 60 },
        { topicName: "Statistics", correct: 80, incorrect: 20 },
      ];
    }
    
    // Group data by topics (extracted from question content)
    const topicStats: Record<string, { correct: number, incorrect: number }> = {};
    
    data.forEach(score => {
      const content = score.questions?.content || "";
      
      // Extract topic from question content (simplified approach)
      const topics = [
        "Algebra", "Geometry", "Probability", "Statistics", 
        "Grammar", "Vocabulary", "Reading", "Arrays", 
        "Strings", "Algorithms", "Logic", "Reasoning"
      ];
      
      let questionTopic = "General";
      for (const topic of topics) {
        if (content.toLowerCase().includes(topic.toLowerCase())) {
          questionTopic = topic;
          break;
        }
      }
      
      if (!topicStats[questionTopic]) {
        topicStats[questionTopic] = { correct: 0, incorrect: 0 };
      }
      
      if (score.is_correct) {
        topicStats[questionTopic].correct += 1;
      } else {
        topicStats[questionTopic].incorrect += 1;
      }
    });
    
    // Convert to expected format
    return Object.entries(topicStats).map(([topic, stats]) => ({
      topicName: topic,
      correct: (stats.correct / (stats.correct + stats.incorrect)) * 100,
      incorrect: (stats.incorrect / (stats.correct + stats.incorrect)) * 100
    }));
  } catch (err) {
    console.error("Error in getTopicPerformance:", err);
    return [
      { topicName: "Algebra", correct: 75, incorrect: 25 },
      { topicName: "Geometry", correct: 60, incorrect: 40 },
      { topicName: "Probability", correct: 40, incorrect: 60 },
      { topicName: "Statistics", correct: 80, incorrect: 20 },
    ];
  }
};
