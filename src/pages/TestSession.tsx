
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { generateQuestions, generateTestCards, Question, TestData } from "@/utils/testData";
import { startTest, completeTest } from "@/utils/test/testProgress";
import { useGuestId } from "@/components/layout/GuestIdProvider";

interface TestFromDB {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  created_at?: string;
  updated_at?: string;
}

// Union type for handling both local TestData and Supabase data
type Test = TestData | TestFromDB;

const TestSession = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testProgressId, setTestProgressId] = useState<string | null>(null);
  const { guestId } = useGuestId();
  const [trackingError, setTrackingError] = useState(false);
  const [startTime] = useState<Date>(new Date());
  
  // Fetch test details
  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      try {
        // Attempt to get test from Supabase
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .eq('id', testId)
          .single();
        
        if (error) {
          console.log("Error fetching test from Supabase:", error);
          // Fall back to local test data if database query fails
          const localTests = generateTestCards();
          const localTest = localTests.find(t => t.id === testId);
          if (localTest) {
            return localTest as TestData;
          }
          throw error;
        }
        return data as TestFromDB;
      } catch (err) {
        console.error("Error in test fetching:", err);
        // Fall back to local test data
        const localTests = generateTestCards();
        const localTest = localTests.find(t => t.id === testId);
        if (!localTest) {
          throw new Error("Test not found");
        }
        return localTest as TestData;
      }
    },
    enabled: !!testId
  });
  
  // Fetch questions for this test
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', testId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('test_id', testId);
        
        if (error || !data || data.length === 0) {
          console.log("Error or no data from Supabase questions:", error);
          // Use generated questions as fallback
          return generateQuestions(testId || '');
        }
        
        return data.map(q => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        })) as Question[];
      } catch (err) {
        console.error("Error fetching questions:", err);
        // Fall back to generated questions
        return generateQuestions(testId || '');
      }
    },
    enabled: !!testId
  });
  
  // Create test progress record when starting
  const createTestProgressMutation = useMutation({
    mutationFn: async () => {
      if (!testId || !guestId) {
        console.log("Missing testId or guestId for test progress tracking");
        setTrackingError(true);
        // Create a local ID for offline tracking
        return { id: `local-${Date.now()}` };
      }
      
      try {
        // Use the refactored startTest function
        const progressId = await startTest(guestId, testId);
        if (!progressId) {
          console.error("Failed to create test progress");
          setTrackingError(true);
          return { id: `local-${Date.now()}` };
        }
        setTrackingError(false);
        return { id: progressId };
      } catch (err) {
        console.error("Error in test progress creation:", err);
        setTrackingError(true);
        return { id: `local-${Date.now()}` };
      }
    },
    onSuccess: (data) => {
      if (data) {
        console.log("Set test progress ID:", data.id);
        setTestProgressId(data.id);
        
        if (data.id.startsWith("local-")) {
          setTrackingError(true);
          toast.warning("Using offline mode", {
            description: "Your results will be stored locally but not synced to your account."
          });
        }
      }
    },
    onError: () => {
      toast.error("Failed to start test", {
        description: "Your progress may not be tracked."
      });
      setTrackingError(true);
      // Create a fallback local progress ID
      setTestProgressId(`local-${Date.now()}`);
    }
  });
  
  // Update test progress when completed
  const completeTestMutation = useMutation({
    mutationFn: async (score: number) => {
      if (!testProgressId || !guestId) {
        setTrackingError(true);
        return;
      }
      
      const isLocalId = testProgressId.startsWith('local-');
      
      if (isLocalId) {
        // Store progress in localStorage for offline/demo mode
        const historyItem = {
          id: testProgressId,
          user_id: guestId,
          test_id: testId,
          score,
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          tests: { title: test?.title || "Test", category: test?.category, difficulty: test?.difficulty }
        };
        
        const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        existingHistory.unshift(historyItem);
        localStorage.setItem('testHistory', JSON.stringify(existingHistory.slice(0, 10)));
        return;
      }
      
      try {
        // Use the refactored completeTest function
        const endTime = new Date();
        const timeSpentMinutes = test ? 
          Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60))) : 
          Math.round((test?.duration || 0) * 60 - timeLeft) / 60;
        
        await completeTest(testProgressId, guestId, score, timeSpentMinutes);
        setTrackingError(false);
      } catch (err) {
        console.error("Error in complete test mutation:", err);
        setTrackingError(true);
        
        // Fall back to localStorage
        const historyItem = {
          id: testProgressId,
          user_id: guestId,
          test_id: testId,
          score,
          created_at: startTime.toISOString(),
          completed_at: new Date().toISOString(),
          status: 'completed',
          tests: { title: test?.title || "Test", category: test?.category, difficulty: test?.difficulty }
        };
        
        const existingHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        existingHistory.unshift(historyItem);
        localStorage.setItem('testHistory', JSON.stringify(existingHistory.slice(0, 10)));
      }
    },
    onError: () => {
      toast.error("Failed to save test results", {
        description: "Your score may not be recorded."
      });
      setTrackingError(true);
    }
  });
  
  // Initialize test session
  useEffect(() => {
    if (test && !testProgressId && guestId) {
      setTimeLeft(test.duration * 60);
      createTestProgressMutation.mutate();
    }
  }, [test, testProgressId, guestId]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  if (testLoading || questionsLoading || !questions || questions.length === 0) {
    return (
      <MainLayout>
        <div className="container px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const submitTest = () => {
    // Calculate score
    let score = 0;
    let totalQuestions = questions.length;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Update test progress
    completeTestMutation.mutate(percentage, {
      onSuccess: () => {
        // Show toast notification
        toast.success("Test submitted successfully!", {
          description: `Your score: ${percentage}%`,
        });
        
        // Navigate back to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    });
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        {trackingError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to track your progress</AlertTitle>
            <AlertDescription>
              Your results won't be saved, but you can still take the test. Make sure you're logged in and try again later.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{test.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 py-2 px-4 bg-muted rounded-md font-mono text-lg">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <Progress 
                value={(currentQuestionIndex + 1) / questions.length * 100} 
                className="mt-4"
              />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="text-lg font-medium">
                  {currentQuestion.content}
                </div>
                
                <RadioGroup 
                  value={answers[currentQuestion.id] || ""} 
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {currentQuestion.options.map(option => (
                    <div key={option.id} className="flex items-start space-x-2">
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="text-base">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={submitTest}>Submit</Button>
                ) : (
                  <Button onClick={goToNextQuestion}>Next</Button>
                )}
              </div>
            </CardFooter>
          </Card>
          
          <div className="mt-8 w-full max-w-3xl">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Question Navigation</h3>
              <div className="flex flex-wrap gap-2">
                {questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center text-sm ${
                      index === currentQuestionIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : answers[question.id] 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestSession;
