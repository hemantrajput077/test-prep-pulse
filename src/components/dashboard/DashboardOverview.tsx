
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/ui/custom/StatsCard";
import { Progress } from "@/components/ui/progress";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import TopicAnalysis from "@/components/dashboard/TopicAnalysis";

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const recentTests = [
    { id: 1, name: "Quantitative Aptitude - Basic", score: 85, date: "2023-04-28" },
    { id: 2, name: "Logical Reasoning - Medium", score: 72, date: "2023-04-25" },
    { id: 3, name: "Verbal Ability - Advanced", score: 68, date: "2023-04-20" },
  ];

  const performanceByCategory = [
    { name: "Quantitative", progress: 85 },
    { name: "Logical Reasoning", progress: 72 },
    { name: "Verbal", progress: 65 },
    { name: "Coding", progress: 78 },
  ];

  const weakAreas = [
    "Probability",
    "Time and Work",
    "Reading Comprehension",
    "Binary Search",
  ];

  const recommendedTests = [
    { id: 1, name: "Probability Practice Set", difficulty: "Medium" },
    { id: 2, name: "Reading Comprehension Drills", difficulty: "Hard" },
    { id: 3, name: "Binary Search Problems", difficulty: "Medium" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Tests Taken"
          value="42"
          trend="up"
          trendValue="12%"
        />
        
        <StatsCard 
          title="Average Score"
          value="76%"
          trend="up"
          trendValue="5%"
        />
        
        <StatsCard 
          title="Questions Solved"
          value="358"
        />
        
        <StatsCard 
          title="Practice Hours"
          value="24.5"
          subtitle="Last 30 days"
        />
      </div>

      <Tabs defaultValue="overview" className="mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Taken on {new Date(test.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span 
                          className={`text-sm font-semibold ${
                            test.score >= 80 ? "text-emerald-500" : 
                            test.score >= 60 ? "text-amber-500" : "text-rose-500"
                          }`}
                        >
                          {test.score}%
                        </span>
                        <Button variant="ghost" size="sm" className="ml-2">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Tests
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Practice Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceByCategory.map((category) => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">{category.progress}%</span>
                      </div>
                      <Progress value={category.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart />
              <TopicAnalysis />
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">Strength Areas</h3>
                      <p className="text-muted-foreground">You excel in Algebra, Data Structures, and Grammar. Keep up the good work!</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">Areas for Improvement</h3>
                      <p className="text-muted-foreground">Focus on Probability, Reading Comprehension, and Binary Search to improve your overall performance.</p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">Practice Recommendation</h3>
                      <p className="text-muted-foreground">Try spending at least 30 minutes daily on your weak areas to see significant improvement.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Areas to Improve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weakAreas.map((area, index) => (
                    <div key={index} className="flex items-center">
                      <span className="h-2 w-2 mr-2 rounded-full bg-amber-500"></span>
                      {area}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-xs">
                          <span 
                            className={`${
                              test.difficulty === "Easy" ? "text-emerald-500" : 
                              test.difficulty === "Medium" ? "text-amber-500" : "text-rose-500"
                            }`}
                          >
                            {test.difficulty}
                          </span>
                        </p>
                      </div>
                      <Button size="sm" className="bg-accent hover:bg-accent/90">
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
};

export default DashboardOverview;
