
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

// Sample test data
const testData = {
  id: "aptitude-test-1",
  title: "Quantitative Aptitude Test",
  duration: 30, // minutes
  questions: [
    {
      id: 1,
      text: "If a train travels at a speed of 60 km/hr, how long will it take to cover a distance of 240 km?",
      options: [
        { id: "a", text: "3 hours" },
        { id: "b", text: "4 hours" },
        { id: "c", text: "5 hours" },
        { id: "d", text: "6 hours" }
      ],
      correctAnswer: "b"
    },
    {
      id: 2,
      text: "Find the next number in the series: 2, 6, 12, 20, 30, ...",
      options: [
        { id: "a", text: "40" },
        { id: "b", text: "42" },
        { id: "c", text: "36" },
        { id: "d", text: "48" }
      ],
      correctAnswer: "b"
    },
    {
      id: 3,
      text: "If 15 workers can build a wall in 48 hours, how many workers are needed to build the same wall in 30 hours?",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "24" },
        { id: "c", text: "22" },
        { id: "d", text: "26" }
      ],
      correctAnswer: "b"
    },
    {
      id: 4,
      text: "A car travels at a speed of 50 km/hr for 2 hours and then at a speed of 70 km/hr for 3 hours. Find the average speed for the entire journey.",
      options: [
        { id: "a", text: "60 km/hr" },
        { id: "b", text: "62 km/hr" },
        { id: "c", text: "58 km/hr" },
        { id: "d", text: "65 km/hr" }
      ],
      correctAnswer: "b"
    },
    {
      id: 5,
      text: "If a = 5 and b = 7, then the value of a² + b² - 2ab is:",
      options: [
        { id: "a", text: "0" },
        { id: "b", text: "4" },
        { id: "c", text: "8" },
        { id: "d", text: "16" }
      ],
      correctAnswer: "b"
    }
  ]
};

const TestSession = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(testData.duration * 60); // seconds
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
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
  }, []);
  
  const currentQuestion = testData.questions[currentQuestionIndex];
  
  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value
    });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
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
    testData.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score++;
      }
    });
    
    const percentage = Math.round((score / testData.questions.length) * 100);
    
    // Show toast notification
    toast.success("Test submitted successfully!", {
      description: `Your score: ${percentage}%`,
    });
    
    // Navigate back to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };
  
  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col items-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{testData.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Question {currentQuestionIndex + 1} of {testData.questions.length}
                  </p>
                </div>
                <div className="mt-4 md:mt-0 py-2 px-4 bg-muted rounded-md font-mono text-lg">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <Progress 
                value={(currentQuestionIndex + 1) / testData.questions.length * 100} 
                className="mt-4"
              />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-6">
                <div className="text-lg font-medium">
                  {currentQuestion.text}
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
                {currentQuestionIndex === testData.questions.length - 1 ? (
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
                {testData.questions.map((question, index) => (
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
