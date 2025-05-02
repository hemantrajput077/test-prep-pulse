
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestCard from "@/components/tests/TestCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
}

const difficultyMap = {
  "Easy": "easy" as const,
  "Medium": "medium" as const,
  "Hard": "hard" as const,
};

const Tests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*');
      
      if (error) throw error;
      return data as Test[];
    }
  });
  
  const { data: testHistory } = useQuery({
    queryKey: ['testHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_test_progress')
        .select(`
          id,
          test_id,
          status,
          score,
          created_at,
          tests(title)
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error("Failed to load tests", {
        description: "Please try again later."
      });
    }
  }, [error]);
  
  const testCategories = ["All", "Quantitative", "Reasoning", "Verbal", "Coding"];
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Quantitative":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
        );
      case "Reasoning":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"></path>
            <path d="M9 17h6"></path>
            <path d="M9 13h6"></path>
          </svg>
        );
      case "Verbal":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V3"></path>
            <path d="M5 3h14"></path>
            <path d="M5 9h14"></path>
            <path d="M5 15h14"></path>
            <path d="M5 22h14"></path>
          </svg>
        );
      case "Coding":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"></path>
            <path d="m19 9-5 5-4-4-3 3"></path>
          </svg>
        );
    }
  };
  
  const filteredTests = tests?.filter((test) => {
    const matchesCategory = activeCategory === "All" || test.category === activeCategory;
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      test.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-heading">Tests</h1>
            <p className="text-muted-foreground">
              Browse and take tests to improve your skills
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Sort
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {testCategories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  activeCategory === category
                    ? "bg-brand-500 hover:bg-brand-600"
                    : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="browse" className="animate-in">
          <TabsList className="mb-6">
            <TabsTrigger value="browse">Browse Tests</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="history">Test History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredTests && filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <TestCard
                    key={test.id}
                    id={test.id}
                    title={test.title}
                    description={test.description}
                    icon={getCategoryIcon(test.category)}
                    category={test.category}
                    questions={10} // We can enhance this later
                    duration={test.duration}
                    difficulty={difficultyMap[test.difficulty]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No tests found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests?.slice(0, 2).map(test => (
                <TestCard
                  key={test.id}
                  id={test.id}
                  title={test.title}
                  description={test.description}
                  icon={getCategoryIcon(test.category)}
                  category={test.category}
                  questions={10}
                  duration={test.duration}
                  difficulty={difficultyMap[test.difficulty]}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {testHistory && testHistory.length > 0 ? (
              <div className="rounded-lg border bg-card shadow-sm divide-y">
                {testHistory.map((item: any) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.tests?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Score</p>
                        <p className={`text-lg font-semibold ${
                          item.score >= 80 ? "text-emerald-500" : 
                          item.score >= 60 ? "text-amber-500" : "text-rose-500"
                        }`}>
                          {item.score}%
                        </p>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No test history found.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    // Navigate to tests
                  }}
                >
                  Take your first test
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tests;
