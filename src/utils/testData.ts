
interface TestData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  questions: number;
}

export const generateTestCards = (): TestData[] => {
  return [
    {
      id: "quantitative-1",
      title: "Quantitative Aptitude Basics",
      description: "Practice fundamental concepts in arithmetic, algebra and geometry",
      category: "Quantitative",
      difficulty: "Easy",
      duration: 30,
      questions: 15
    },
    {
      id: "quantitative-2",
      title: "Advanced Mathematics",
      description: "Challenge yourself with complex problems in calculus and statistics",
      category: "Quantitative",
      difficulty: "Hard",
      duration: 60,
      questions: 25
    },
    {
      id: "reasoning-1",
      title: "Logical Reasoning Essentials",
      description: "Enhance your critical thinking skills with basic reasoning problems",
      category: "Reasoning",
      difficulty: "Easy",
      duration: 25,
      questions: 20
    },
    {
      id: "reasoning-2",
      title: "Advanced Logic Problems",
      description: "Complex logical puzzles and pattern recognition challenges",
      category: "Reasoning",
      difficulty: "Medium",
      duration: 45,
      questions: 18
    },
    {
      id: "verbal-1",
      title: "Verbal Ability Fundamentals",
      description: "Improve your grammar, vocabulary and reading comprehension",
      category: "Verbal",
      difficulty: "Easy", 
      duration: 30,
      questions: 25
    },
    {
      id: "verbal-2",
      title: "Advanced Communication Skills",
      description: "Master complex passages and advanced language constructs",
      category: "Verbal",
      difficulty: "Hard",
      duration: 50,
      questions: 20
    },
    {
      id: "coding-1",
      title: "Programming Basics",
      description: "Learn fundamental programming concepts and algorithms",
      category: "Coding",
      difficulty: "Medium",
      duration: 45,
      questions: 10
    },
    {
      id: "coding-2",
      title: "Advanced Data Structures",
      description: "Complex problems involving trees, graphs and advanced algorithms",
      category: "Coding",
      difficulty: "Hard", 
      duration: 60,
      questions: 8
    }
  ];
};

export const generateQuestions = (testId: string) => {
  // Generate 10 sample questions for any test
  const questions = [];
  
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: i,
      content: `Sample question ${i} for test ${testId}`,
      options: [
        { id: `q${i}-a`, text: `Option A for question ${i}` },
        { id: `q${i}-b`, text: `Option B for question ${i}` },
        { id: `q${i}-c`, text: `Option C for question ${i}` },
        { id: `q${i}-d`, text: `Option D for question ${i}` }
      ],
      correct_answer: `q${i}-b` // Sample correct answer
    });
  }
  
  return questions;
};
