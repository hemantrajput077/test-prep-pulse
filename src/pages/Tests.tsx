
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestCard from "@/components/tests/TestCard";
import { Badge } from "@/components/ui/badge";

const Tests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const testCategories = [
    "All",
    "Quantitative",
    "Logical Reasoning",
    "Verbal",
    "Coding",
  ];
  
  const [activeCategory, setActiveCategory] = useState("All");
  
  const quantTests = [
    {
      id: 1,
      title: "Basic Arithmetic",
      description: "Practice fundamental arithmetic operations with this beginner-friendly test.",
      category: "Quantitative",
      questions: 20,
      duration: 30,
      difficulty: "easy" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
    {
      id: 2,
      title: "Advanced Algebra",
      description: "Challenge yourself with complex algebraic problems and equations.",
      category: "Quantitative",
      questions: 15,
      duration: 45,
      difficulty: "hard" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18"></path>
          <path d="m19 9-5 5-4-4-3 3"></path>
        </svg>
      ),
    },
  ];
  
  const logicalTests = [
    {
      id: 3,
      title: "Pattern Recognition",
      description: "Identify patterns and sequences in this logical reasoning test.",
      category: "Logical Reasoning",
      questions: 25,
      duration: 35,
      difficulty: "medium" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"></path>
          <path d="M9 17h6"></path>
          <path d="M9 13h6"></path>
        </svg>
      ),
    },
    {
      id: 4,
      title: "Syllogisms",
      description: "Master deductive reasoning through syllogisms and logical arguments.",
      category: "Logical Reasoning",
      questions: 15,
      duration: 25,
      difficulty: "medium" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"></path>
          <path d="M9 17h6"></path>
          <path d="M9 13h6"></path>
        </svg>
      ),
    },
  ];
  
  const verbalTests = [
    {
      id: 5,
      title: "Reading Comprehension",
      description: "Improve your reading comprehension skills with passage-based questions.",
      category: "Verbal",
      questions: 15,
      duration: 30,
      difficulty: "medium" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V3"></path>
          <path d="M5 3h14"></path>
          <path d="M5 9h14"></path>
          <path d="M5 15h14"></path>
          <path d="M5 22h14"></path>
        </svg>
      ),
    },
    {
      id: 6,
      title: "Vocabulary Builder",
      description: "Enhance your vocabulary with a focus on commonly tested words.",
      category: "Verbal",
      questions: 30,
      duration: 25,
      difficulty: "easy" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V3"></path>
          <path d="M5 3h14"></path>
          <path d="M5 9h14"></path>
          <path d="M5 15h14"></path>
          <path d="M5 22h14"></path>
        </svg>
      ),
    },
  ];
  
  const codingTests = [
    {
      id: 7,
      title: "Data Structures Basics",
      description: "Practice fundamental data structures like arrays, linked lists, and stacks.",
      category: "Coding",
      questions: 10,
      duration: 60,
      difficulty: "medium" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
    },
    {
      id: 8,
      title: "Algorithm Challenges",
      description: "Solve advanced algorithmic problems focusing on efficiency and optimization.",
      category: "Coding",
      questions: 5,
      duration: 90,
      difficulty: "hard" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
    },
  ];
  
  const allTests = [...quantTests, ...logicalTests, ...verbalTests, ...codingTests];
  
  const filteredTests = allTests.filter((test) => {
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
            {filteredTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => (
                  <TestCard
                    key={test.id}
                    title={test.title}
                    description={test.description}
                    icon={test.icon}
                    category={test.category}
                    questions={test.questions}
                    duration={test.duration}
                    difficulty={test.difficulty}
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
              <TestCard
                title="Probability and Statistics"
                description="Improve your understanding of probability concepts and statistical analysis."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                }
                category="Quantitative"
                questions={20}
                duration={40}
                difficulty="medium"
              />
              <TestCard
                title="Critical Reasoning"
                description="Enhance your logical thinking and critical reasoning skills with complex puzzles."
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"></path>
                    <path d="M9 17h6"></path>
                    <path d="M9 13h6"></path>
                  </svg>
                }
                category="Logical Reasoning"
                questions={15}
                duration={30}
                difficulty="hard"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="rounded-lg border bg-card shadow-sm divide-y">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Basic Arithmetic</h3>
                  <p className="text-sm text-muted-foreground">Completed on Apr 28, 2023</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-lg font-semibold text-emerald-500">85%</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Pattern Recognition</h3>
                  <p className="text-sm text-muted-foreground">Completed on Apr 22, 2023</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-lg font-semibold text-amber-500">72%</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reading Comprehension</h3>
                  <p className="text-sm text-muted-foreground">Completed on Apr 15, 2023</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-lg font-semibold text-rose-500">58%</p>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tests;
