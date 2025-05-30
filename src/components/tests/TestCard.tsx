
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGuestId } from "@/components/layout/GuestIdProvider";
import { startTest } from "@/utils/testUtils";
import { toast } from "@/components/ui/sonner";

interface TestCardProps {
  id?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  questions: number;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
}

const TestCard = ({
  id = "demo-test",
  title,
  description,
  icon,
  category,
  questions,
  duration,
  difficulty,
}: TestCardProps) => {
  const navigate = useNavigate();
  const { guestId } = useGuestId();
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "hard":
        return "bg-rose-100 text-rose-800 hover:bg-rose-200";
      default:
        return "bg-slate-100 text-slate-800 hover:bg-slate-200";
    }
  };
  
  const handleStartTest = async () => {
    // If we don't have a guestId yet, navigate directly to the test page
    if (!guestId) {
      navigate(`/test-session/${id}`);
      return;
    }

    // Start the test in the database
    try {
      const progressId = await startTest(guestId, id);
      
      if (progressId) {
        // Navigate to the test session with progress ID
        navigate(`/test-session/${id}?progress=${progressId}`);
      } else {
        // If there was an error, still navigate but without progress tracking
        toast.error("Unable to track your progress", {
          description: "Your results won't be saved, but you can still take the test."
        });
        navigate(`/test-session/${id}`);
      }
    } catch (error) {
      console.error("Error starting test:", error);
      toast.error("Error starting the test", {
        description: "Please try again later."
      });
    }
  };

  return (
    <Card className="overflow-hidden border card-hover">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2">
              {category}
            </Badge>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="text-primary/70">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="flex gap-3 mt-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="font-medium">{questions}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-medium">{duration} min</p>
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Difficulty</p>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className={getDifficultyColor(difficulty)}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/40">
        <Button 
          className="w-full bg-gradient-to-r from-brand-500 to-accent-600 hover:from-brand-600 hover:to-accent-700"
          onClick={handleStartTest}
        >
          Start Test
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
