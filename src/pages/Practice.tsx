
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGuestId } from "@/components/layout/GuestIdProvider";
import { getTestStatistics, getPerformanceByCategory, getWeakAreas } from "@/utils/test/statistics";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Practice = () => {
  const { guestId } = useGuestId();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([
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
  ]);

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user practice data from the database
  const { data: practiceData } = useQuery({
    queryKey: ['practice-data', guestId],
    queryFn: async () => {
      if (!guestId) return null;
      
      try {
        // Fetch performance by category
        const categoryPerformance = await getPerformanceByCategory(guestId);
        
        // Fetch weak areas
        const weakAreasData = await getWeakAreas(guestId);
        
        // Fix type safety issue - ensure we're setting a string array
        if (Array.isArray(weakAreasData)) {
          setWeakAreas(weakAreasData);
        } else {
          // Fallback to default weak areas if data is not an array
          setWeakAreas([
            "Probability",
            "Time and Work",
            "Reading Comprehension",
            "Binary Search",
          ]);
        }
        
        // Update categories with real data if available
        if (categoryPerformance && categoryPerformance.length > 0) {
          const updatedCategories = categories.map(category => {
            const match = categoryPerformance.find(c => 
              c.name.toLowerCase() === category.name.toLowerCase() ||
              c.name.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
            );
            
            if (match) {
              return {
                ...category,
                progress: match.progress
              };
            }
            
            return category;
          });
          
          setCategories(updatedCategories);
        }
        
        return {
          categoryPerformance,
          weakAreas: weakAreasData
        };
      } catch (error) {
        console.error("Error fetching practice data:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!guestId
  });
  
  useEffect(() => {
    if (!loading && !practiceData) {
      setLoading(false);
    }
  }, [practiceData, loading]);
  
  const handlePracticeNow = (topicName: string) => {
    // Find tests related to this topic
    const relatedTests = async () => {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('*')
          .ilike('title', `%${topicName}%`)
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          toast.success(`Starting ${topicName} practice`, {
            description: "Redirecting to test..."
          });
          
          setTimeout(() => {
            window.location.href = `/test/${data[0].id}`;
          }, 1500);
        } else {
          toast.success(`Starting practice for ${topicName}`, {
            description: "This specific topic will be available soon!"
          });
        }
      } catch (err) {
        console.error("Error finding related tests:", err);
        toast.success(`Starting practice for ${topicName}`, {
          description: "This feature will be available soon!"
        });
      }
    };
    
    relatedTests();
  };

  // Filter topics based on search query
  const filteredTopics = activeCategory.topics.filter(topic => 
    topic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <div className="mt-4 relative">
                  <Input
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map((topic, index) => (
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
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-muted-foreground">
                      No topics found matching "{searchQuery}".
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery("")}
                        className="block mx-auto mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
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
                          onClick={() => {
                            setActiveCategory(category);
                            setSearchQuery("");
                          }}
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
                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        weakAreas.slice(0, 3).map((area, index) => (
                          <div key={index} className="rounded-md border bg-muted/30 p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{area}</p>
                                <p className="text-xs text-muted-foreground">
                                  {index === 0 && "Quantitative Aptitude"}
                                  {index === 1 && "Verbal Ability"}
                                  {index === 2 && "Coding Skills"}
                                </p>
                              </div>
                              <Badge variant="secondary" className={`
                                ${index === 0 ? "bg-amber-100 text-amber-800" : 
                                  index === 1 ? "bg-emerald-100 text-emerald-800" : 
                                  "bg-rose-100 text-rose-800"}
                              `}>
                                {index === 0 ? "Medium" : index === 1 ? "Easy" : "Hard"}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => handlePracticeNow(area)}
                            >
                              Start Practice
                            </Button>
                          </div>
                        ))
                      )}
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
