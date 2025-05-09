
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestCard from "@/components/tests/TestCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { generateTestCards, TestData } from "@/utils/testData";
import { useGuestId } from "@/components/layout/GuestIdProvider";
import { TestDetails } from "@/utils/test/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define interface for tests from database
interface TestFromDB {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  duration: number;
  created_at?: string;
  updated_at?: string;
}

// Define interface for test progress
interface TestProgress {
  id: string;
  test_id: string;
  status: string;
  score: number | null;
  created_at: string;
  tests?: {
    title: string;
  };
}

const Tests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "a-z" | "z-a">("newest");
  const [filterDifficulty, setFilterDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [currentTab, setCurrentTab] = useState("browse");
  const { guestId } = useGuestId();
  
  // Use our Supabase database to fetch tests
  const { data: testsFromDb, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tests')
          .select('*');
        
        if (error) throw error;
        return data as TestFromDB[];
      } catch (err) {
        console.error("Error fetching tests:", err);
        return null;
      }
    }
  });
  
  // Fall back to local test data if database query fails
  const tests = testsFromDb?.length > 0 ? testsFromDb : generateTestCards();
  
  // Use Supabase to track test history using our guest ID
  const [testHistory, setTestHistory] = useState<TestProgress[]>([]);
  const [allTestHistory, setAllTestHistory] = useState<TestProgress[]>([]);
  
  useEffect(() => {
    if (!guestId) return;
    
    // Fetch the test history for the current guest ID
    const fetchTestHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('user_test_progress')
          .select(`
            id,
            test_id,
            status,
            score,
            created_at,
            tests (
              title
            )
          `)
          .eq('user_id', guestId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          // Set recent test history (last 3)
          setTestHistory(data.slice(0, 3));
          // Set all test history
          setAllTestHistory(data);
          // Also save to localStorage as backup
          localStorage.setItem('testHistory', JSON.stringify(data));
        } else if (error) {
          console.error("Error fetching test history:", error);
          // Try to fall back to localStorage
          const storedHistory = localStorage.getItem('testHistory');
          if (storedHistory) {
            try {
              const parsed = JSON.parse(storedHistory);
              setTestHistory(parsed.slice(0, 3));
              setAllTestHistory(parsed);
            } catch (e) {
              console.error("Failed to parse test history:", e);
              setTestHistory([]);
              setAllTestHistory([]);
            }
          }
        }
      } catch (err) {
        console.error("Error in test history fetch:", err);
      }
    };
    
    fetchTestHistory();
  }, [guestId]);

  // Error handling
  useEffect(() => {
    if (error) {
      toast.error("Failed to load tests", {
        description: "Using locally generated test data instead."
      });
    }
  }, [error]);
  
  // Get all unique categories from tests
  const allCategories = ["All", ...Array.from(new Set((tests as any[] || []).map((test) => test.category)))];
  
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
      case "Data Science":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        );
      case "General Knowledge":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
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
  
  // Apply filters and sorting to tests
  const filteredTests = React.useMemo(() => {
    if (!tests) return [];
    
    return (tests as (TestFromDB | TestData)[])
      .filter((test) => {
        const matchesCategory = activeCategory === "All" || test.category === activeCategory;
        const matchesSearch = 
          test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (test.description && test.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesDifficulty = filterDifficulty === "All" || 
          test.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
        
        return matchesCategory && matchesSearch && matchesDifficulty;
      })
      .sort((a, b) => {
        // Update sorting to handle cases where created_at might not exist in TestData
        const aDate = 'created_at' in a ? new Date(a.created_at || Date.now()) : new Date();
        const bDate = 'created_at' in b ? new Date(b.created_at || Date.now()) : new Date();
        
        switch (sortOrder) {
          case "newest":
            return bDate.getTime() - aDate.getTime();
          case "oldest":
            return aDate.getTime() - bDate.getTime();
          case "a-z":
            return a.title.localeCompare(b.title);
          case "z-a":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [tests, activeCategory, searchQuery, filterDifficulty, sortOrder]);

  // Handle viewing all test history
  const handleViewAllTests = () => {
    setCurrentTab("history");
    const historyTab = document.querySelector('[data-value="history"]');
    if (historyTab) {
      historyTab.dispatchEvent(new Event('click', { bubbles: true }));
    }
  };

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
              <Select value={filterDifficulty} onValueChange={(value) => setFilterDifficulty(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Levels</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="a-z">A-Z</SelectItem>
                  <SelectItem value="z-a">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {allCategories.map((category) => (
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
        
        <Tabs defaultValue="browse" className="animate-in" value={currentTab} onValueChange={setCurrentTab}>
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
                {filteredTests.map((test) => {
                  // Make sure we safely handle questions property for both TestFromDB and TestData
                  let questionsCount = 10; // Default value
                  
                  if ('questions' in test) {
                    // Handle TestData type which has questions array
                    questionsCount = Array.isArray(test.questions) ? test.questions.length : 10;
                  }
                  
                  return (
                    <TestCard
                      key={test.id}
                      id={test.id}
                      title={test.title}
                      description={test.description || ""}
                      icon={getCategoryIcon(test.category)}
                      category={test.category}
                      questions={questionsCount}
                      duration={test.duration}
                      difficulty={(test.difficulty?.toLowerCase() || "medium") as any}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No tests found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                    setFilterDifficulty("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(tests as any[])?.filter(test => test.difficulty === "Medium" || test.difficulty === "medium").slice(0, 3).map(test => {
                // Safely handle questions property here too
                let questionsCount = 10; // Default value
                
                if ('questions' in test) {
                  // Handle TestData type which has questions array
                  questionsCount = Array.isArray(test.questions) ? test.questions.length : 10;
                }
                
                return (
                  <TestCard
                    key={test.id}
                    id={test.id}
                    title={test.title}
                    description={test.description || ""}
                    icon={getCategoryIcon(test.category)}
                    category={test.category}
                    questions={questionsCount}
                    duration={test.duration}
                    difficulty={(test.difficulty || "medium").toLowerCase() as any}
                  />
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            {allTestHistory && allTestHistory.length > 0 ? (
              <div className="rounded-lg border bg-card shadow-sm divide-y">
                {allTestHistory.map((item: TestProgress) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{item.tests?.title || "Test"}</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Score</p>
                        <p className={`text-lg font-semibold ${
                          item.score && item.score >= 80 ? "text-emerald-500" : 
                          item.score && item.score >= 60 ? "text-amber-500" : "text-rose-500"
                        }`}>
                          {item.score ? `${item.score}%` : "N/A"}
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
                    setCurrentTab("browse");
                    document.querySelector('[data-value="browse"]')?.dispatchEvent(
                      new Event('click', { bubbles: true })
                    );
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
