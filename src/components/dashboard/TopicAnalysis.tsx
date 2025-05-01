
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopicItem {
  name: string;
  strength: number;
  color: string;
}

const TopicAnalysis = () => {
  const topics: TopicItem[] = [
    { name: "Algebra", strength: 85, color: "bg-emerald-500" },
    { name: "Geometry", strength: 72, color: "bg-blue-500" },
    { name: "Probability", strength: 45, color: "bg-amber-500" },
    { name: "Data Interpretation", strength: 68, color: "bg-violet-500" },
    { name: "Reasoning", strength: 78, color: "bg-rose-500" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Topic Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {topics.map((topic) => (
            <div key={topic.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{topic.name}</span>
                <span className="text-sm text-muted-foreground">{topic.strength}%</span>
              </div>
              <Progress value={topic.strength} className={topic.color} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicAnalysis;
