
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
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: number;
  content: string;
  options: { id: string; text: string }[];
  correct_answer: string;
}

interface Test {
  id: string;
  title: string;
  duration: number;
  description: string;
}

const TestSession = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testProgressId, setTestProgressId] = useState<string | null>(null);
  
  // Fetch test details
  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (error) throw error;
      return data as Test;
    }
  });
  
  // Fetch questions for this test
  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', testId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('test_id', testId);
      
      if (error) throw error;
      
      return data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      })) as Question[];
    },
    enabled: !!testId
  });
  
  // Create test progress record when starting
  const createTestProgressMutation = useMutation({
    mutationFn: async () => {
      if (!testId) return null;
      
      // Use a guest ID or anonymous tracking for non-authenticated users
      const guestId = localStorage.getItem('guestId') || crypto.randomUUID();
      localStorage.setItem('guestId', guestId);
      
      const { data, error } = await supabase
        .from('user_test_progress')
        .insert({
          guest_id: guestId,
          test_id: testId,
          status: 'in_progress'
        })
        .select('id')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setTestProgressId(data.id);
      }
    },
    onError: () => {
      toast.error("Failed to start test", {
        description: "Please try again."
      });
    }
  });
  
  // Update test progress when completed
  const completeTestMutation = useMutation({
    mutationFn: async (score: number) => {
      if (!testProgressId) return;
      
      const { error } = await supabase
        .from('user_test_progress')
        .update({
          status: 'completed',
          score,
          completed_at: new Date().toISOString(),
          time_spent: test!.duration * 60 - timeLeft
        })
        .eq('id', testProgressId);
      
      if (error) throw error;
    },
    onError: () => {
      toast.error("Failed to save test results", {
        description: "Your score may not be recorded."
      });
    }
  });
  
  // Initialize test session
  useEffect(() => {
    if (test && !testProgressId) {
      setTimeLeft(test.duration * 60);
      createTestProgressMutation.mutate();
    }
  }, [test, testProgressId]);
  
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
