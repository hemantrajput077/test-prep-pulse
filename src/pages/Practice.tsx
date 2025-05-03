
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

const Practice = () => {
  const categories = [
    {
      name: "Quantitative Aptitude",
      description: "Practice numerical problems and mathematical concepts",
      progress: 65,
      topics: [
        { name: "Number System", count: 25, completed: 15 },
        { name: "Algebra", count: 30, completed: 18 },
        { name: "Geometry", count: 20, completed: 10 },
        { name: "Probability", count: 15, completed: 5 },
      ],
    },
    {
      name: "Logical Reasoning",
      description: "Enhance critical thinking and problem-solving skills",
      progress: 48,
      topics: [
        { name: "Syllogisms", count: 20, completed: 12 },
        { name: "Blood Relations", count: 15, completed: 5 },
        { name: "Coding-Decoding", count: 25, completed: 10 },
        { name: "Visual Reasoning", count: 15, completed: 8 },
      ],
    },
    {
      name: "Verbal Ability",
      description: "Improve your language and communication skills",
      progress: 72,
      topics: [
        { name: "Reading Comprehension", count: 30, completed: 25 },
        { name: "Grammar", count: 25, completed: 18 },
        { name: "Vocabulary", count: 40, completed: 28 },
        { name: "Verbal Analogies", count: 15, completed: 10 },
      ],
    },
    {
      name: "Coding Skills",
      description: "Develop programming and algorithmic thinking abilities",
      progress: 35,
      topics: [
        { name: "Arrays & Strings", count: 20, completed: 8 },
        { name: "Linked Lists", count: 15, completed: 5 },
        { name: "Dynamic Programming", count: 25, completed: 6 },
        { name: "Graph Algorithms", count: 20, completed: 7 },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  const handlePracticeNow = (topicName: string) => {
    toast.success(`Starting practice for ${topicName}`, {
      description: "This feature will be available soon!"
    });
  };

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-heading">Practice Zone</h1>
            <p className="text-muted-foreground">
              Sharpen your skills with targeted practice exercises
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{activeCategory.name}</CardTitle>
                    <CardDescription>{activeCategory.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {activeCategory.progress}% Complete
                  </Badge>
                </div>
                <Progress value={activeCategory.progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCategory.topics.map((topic, index) => (
                    <Card key={index} className="card-hover">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Progress</span>
                          <span>{topic.completed}/{topic.count} questions</span>
                        </div>
                        <Progress value={(topic.completed / topic.count) * 100} />
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => handlePracticeNow(topic.name)}
                        >
                          Practice Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Tabs defaultValue="categories" className="h-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Practice Categories</CardTitle>
                    <CardDescription>Select a category to practice</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {categories.map((category, index) => (
                        <div 
                          key={index}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            activeCategory.name === category.name ? "bg-muted" : ""
                          }`}
                          onClick={() => setActiveCategory(category)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{category.name}</h3>
                            <Badge variant={activeCategory.name === category.name ? "default" : "outline"}>
                              {category.progress}%
                            </Badge>
                          </div>
                          <Progress value={category.progress} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="recommended" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Recommended Practice</CardTitle>
                    <CardDescription>Based on your performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border bg-muted/30 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Probability Problems</p>
                            <p className="text-xs text-muted-foreground">Quantitative Aptitude</p>
                          </div>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">Medium</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => handlePracticeNow("Probability Problems")}
                        >
                          Start Practice
                        </Button>
                      </div>
                      
                      <div className="rounded-md border bg-muted/30 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Reading Comprehension</p>
                            <p className="text-xs text-muted-foreground">Verbal Ability</p>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Easy</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => handlePracticeNow("Reading Comprehension")}
                        >
                          Start Practice
                        </Button>
                      </div>
                      
                      <div className="rounded-md border bg-muted/30 p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Dynamic Programming</p>
                            <p className="text-xs text-muted-foreground">Coding Skills</p>
                          </div>
                          <Badge variant="secondary" className="bg-rose-100 text-rose-800">Hard</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => handlePracticeNow("Dynamic Programming")}
                        >
                          Start Practice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Practice;
