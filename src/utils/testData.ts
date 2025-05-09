
// Define the interface for our test data
export interface TestData {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: number;
  questions: number;
}

// Define interface for questions
export interface Question {
  id: number;
  content: string;
  options: { id: string; text: string }[];
  correct_answer: string;
}

// Generate test cards for our application
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
      id: "probability-1",
      title: "Probability Foundations",
      description: "Master basic probability concepts and problem-solving techniques",
      category: "Probability",
      difficulty: "Medium",
      duration: 40, 
      questions: 20
    },
    {
      id: "statistics-1",
      title: "Statistical Analysis",
      description: "Learn statistical methods and data interpretation techniques",
      category: "Statistics",
      difficulty: "Medium",
      duration: 45,
      questions: 18
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
    },
    {
      id: "data-structures-1",
      title: "Advanced Tree & Graph Algorithms",
      description: "Master complex tree traversals, graph algorithms and optimization techniques",
      category: "Data Structures",
      difficulty: "Hard",
      duration: 70,
      questions: 12
    },
    {
      id: "data-structures-2",
      title: "Dynamic Programming",
      description: "Solve optimization problems using dynamic programming techniques",
      category: "Data Structures",
      difficulty: "Hard",
      duration: 65,
      questions: 10
    },
    {
      id: "data-science-1",
      title: "Data Analysis Fundamentals",
      description: "Learn the basics of data analysis and statistics",
      category: "Data Science",
      difficulty: "Medium",
      duration: 40,
      questions: 15
    },
    {
      id: "data-science-2",
      title: "Machine Learning Basics",
      description: "Introduction to machine learning algorithms and concepts",
      category: "Data Science",
      difficulty: "Hard",
      duration: 50,
      questions: 20
    },
    {
      id: "general-knowledge-1",
      title: "Current Affairs Quiz",
      description: "Test your knowledge on recent global events and developments",
      category: "General Knowledge",
      difficulty: "Easy",
      duration: 20,
      questions: 25
    },
    {
      id: "general-knowledge-2",
      title: "History & Geography",
      description: "Comprehensive assessment of historical events and geographical concepts",
      category: "General Knowledge",
      difficulty: "Medium",
      duration: 35,
      questions: 30
    }
  ];
};

// Generate sample questions for a test
export const generateQuestions = (testId: string): Question[] => {
  // Special question sets based on test ID
  if (testId.includes('probability')) {
    return generateProbabilityQuestions();
  } else if (testId.includes('statistics')) {
    return generateStatisticsQuestions();
  } else if (testId.includes('data-structures')) {
    return generateDataStructuresQuestions();
  }
  
  // Default question generation
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

// Generate specialized probability questions
const generateProbabilityQuestions = (): Question[] => {
  return [
    {
      id: 1,
      content: "A bag contains 3 red balls and 5 blue balls. If two balls are drawn at random without replacement, what is the probability of drawing 2 red balls?",
      options: [
        { id: "q1-a", text: "3/28" },
        { id: "q1-b", text: "3/8" },
        { id: "q1-c", text: "1/4" },
        { id: "q1-d", text: "3/20" }
      ],
      correct_answer: "q1-a"
    },
    {
      id: 2,
      content: "If the probability of an event occurring is 0.35, what is the probability of it not occurring?",
      options: [
        { id: "q2-a", text: "0.65" },
        { id: "q2-b", text: "0.35" },
        { id: "q2-c", text: "1.35" },
        { id: "q2-d", text: "0.5" }
      ],
      correct_answer: "q2-a"
    },
    {
      id: 3,
      content: "In a standard deck of 52 cards, what is the probability of drawing a face card (Jack, Queen, King) or an Ace?",
      options: [
        { id: "q3-a", text: "4/13" },
        { id: "q3-b", text: "16/52" },
        { id: "q3-c", text: "1/4" },
        { id: "q3-d", text: "1/3" }
      ],
      correct_answer: "q3-b"
    },
    {
      id: 4,
      content: "If P(A) = 0.4, P(B) = 0.5, and P(A and B) = 0.2, what is P(A or B)?",
      options: [
        { id: "q4-a", text: "0.7" },
        { id: "q4-b", text: "0.9" },
        { id: "q4-c", text: "0.3" },
        { id: "q4-d", text: "0.5" }
      ],
      correct_answer: "q4-a"
    },
    {
      id: 5,
      content: "A coin is tossed three times. What is the probability of getting at least one head?",
      options: [
        { id: "q5-a", text: "7/8" },
        { id: "q5-b", text: "1/2" },
        { id: "q5-c", text: "3/4" },
        { id: "q5-d", text: "1/8" }
      ],
      correct_answer: "q5-a"
    },
    {
      id: 6,
      content: "In Bayesian probability, if P(A|B) = 0.8, P(B) = 0.5, and P(A) = 0.6, what is P(B|A)?",
      options: [
        { id: "q6-a", text: "0.4" },
        { id: "q6-b", text: "0.67" },
        { id: "q6-c", text: "0.75" },
        { id: "q6-d", text: "0.48" }
      ],
      correct_answer: "q6-b"
    },
    {
      id: 7,
      content: "Two dice are rolled. What is the probability that the sum of the numbers is either 7 or 11?",
      options: [
        { id: "q7-a", text: "2/9" },
        { id: "q7-b", text: "1/6" },
        { id: "q7-c", text: "5/36" },
        { id: "q7-d", text: "8/36" }
      ],
      correct_answer: "q7-d"
    },
    {
      id: 8,
      content: "In a binomial distribution with n=10 and p=0.3, what is the probability of exactly 3 successes?",
      options: [
        { id: "q8-a", text: "0.2668" },
        { id: "q8-b", text: "0.3456" },
        { id: "q8-c", text: "0.2334" },
        { id: "q8-d", text: "0.1211" }
      ],
      correct_answer: "q8-a"
    },
    {
      id: 9,
      content: "If events A and B are independent, and P(A) = 0.4, P(B) = 0.25, what is P(A and B)?",
      options: [
        { id: "q9-a", text: "0.65" },
        { id: "q9-b", text: "0.1" },
        { id: "q9-c", text: "0.15" },
        { id: "q9-d", text: "0.4" }
      ],
      correct_answer: "q9-b"
    },
    {
      id: 10,
      content: "A box contains 5 red marbles, 3 blue marbles, and 2 green marbles. If three marbles are drawn at random without replacement, what is the probability of getting all three colors?",
      options: [
        { id: "q10-a", text: "1/6" },
        { id: "q10-b", text: "1/4" },
        { id: "q10-c", text: "1/5" },
        { id: "q10-d", text: "1/3" }
      ],
      correct_answer: "q10-c"
    }
  ];
};

// Generate specialized statistics questions
const generateStatisticsQuestions = (): Question[] => {
  return [
    {
      id: 1,
      content: "Which measure of central tendency is most affected by extreme values?",
      options: [
        { id: "q1-a", text: "Mean" },
        { id: "q1-b", text: "Median" },
        { id: "q1-c", text: "Mode" },
        { id: "q1-d", text: "Range" }
      ],
      correct_answer: "q1-a"
    },
    {
      id: 2,
      content: "If the standard deviation of a data set is 0, what can we conclude?",
      options: [
        { id: "q2-a", text: "The data set contains only positive values" },
        { id: "q2-b", text: "All values in the data set are identical" },
        { id: "q2-c", text: "The mean of the data set is 0" },
        { id: "q2-d", text: "The data set contains an equal number of positive and negative values" }
      ],
      correct_answer: "q2-b"
    },
    {
      id: 3,
      content: "In a normal distribution, approximately what percentage of values fall within 2 standard deviations of the mean?",
      options: [
        { id: "q3-a", text: "68%" },
        { id: "q3-b", text: "95%" },
        { id: "q3-c", text: "99.7%" },
        { id: "q3-d", text: "50%" }
      ],
      correct_answer: "q3-b"
    },
    {
      id: 4,
      content: "What test would you use to determine if there's a significant difference between the means of two independent groups?",
      options: [
        { id: "q4-a", text: "Chi-square test" },
        { id: "q4-b", text: "Paired t-test" },
        { id: "q4-c", text: "Independent samples t-test" },
        { id: "q4-d", text: "ANOVA" }
      ],
      correct_answer: "q4-c"
    },
    {
      id: 5,
      content: "Which correlation coefficient indicates the strongest positive linear relationship?",
      options: [
        { id: "q5-a", text: "-0.95" },
        { id: "q5-b", text: "0.25" },
        { id: "q5-c", text: "0.85" },
        { id: "q5-d", text: "-0.55" }
      ],
      correct_answer: "q5-c"
    },
    {
      id: 6,
      content: "What is the quartile deviation of the data set: 3, 5, 7, 9, 11, 13, 15?",
      options: [
        { id: "q6-a", text: "3" },
        { id: "q6-b", text: "4" },
        { id: "q6-c", text: "6" },
        { id: "q6-d", text: "8" }
      ],
      correct_answer: "q6-a"
    },
    {
      id: 7,
      content: "In hypothesis testing, what is a Type II error?",
      options: [
        { id: "q7-a", text: "Correctly rejecting the null hypothesis" },
        { id: "q7-b", text: "Incorrectly rejecting the null hypothesis" },
        { id: "q7-c", text: "Correctly failing to reject the null hypothesis" },
        { id: "q7-d", text: "Failing to reject the null hypothesis when it is false" }
      ],
      correct_answer: "q7-d"
    },
    {
      id: 8,
      content: "Which sampling method involves dividing the population into subgroups and then randomly selecting from each subgroup?",
      options: [
        { id: "q8-a", text: "Simple random sampling" },
        { id: "q8-b", text: "Stratified sampling" },
        { id: "q8-c", text: "Cluster sampling" },
        { id: "q8-d", text: "Systematic sampling" }
      ],
      correct_answer: "q8-b"
    },
    {
      id: 9,
      content: "What is the variance of the data set: 2, 4, 6, 8, 10?",
      options: [
        { id: "q9-a", text: "10" },
        { id: "q9-b", text: "6" },
        { id: "q9-c", text: "8" },
        { id: "q9-d", text: "2.83" }
      ],
      correct_answer: "q9-a"
    },
    {
      id: 10,
      content: "If two variables have a correlation coefficient of -0.8, what can we conclude?",
      options: [
        { id: "q10-a", text: "There is a strong positive linear relationship" },
        { id: "q10-b", text: "There is a strong negative linear relationship" },
        { id: "q10-c", text: "There is no linear relationship" },
        { id: "q10-d", text: "The variables are independent" }
      ],
      correct_answer: "q10-b"
    }
  ];
};

// Generate specialized data structures questions
const generateDataStructuresQuestions = (): Question[] => {
  return [
    {
      id: 1,
      content: "What is the time complexity of searching for an element in a balanced binary search tree?",
      options: [
        { id: "q1-a", text: "O(1)" },
        { id: "q1-b", text: "O(log n)" },
        { id: "q1-c", text: "O(n)" },
        { id: "q1-d", text: "O(n log n)" }
      ],
      correct_answer: "q1-b"
    },
    {
      id: 2,
      content: "Which data structure is best for implementing a priority queue?",
      options: [
        { id: "q2-a", text: "Stack" },
        { id: "q2-b", text: "Queue" },
        { id: "q2-c", text: "Heap" },
        { id: "q2-d", text: "Linked List" }
      ],
      correct_answer: "q2-c"
    },
    {
      id: 3,
      content: "What algorithm is commonly used to find the shortest path in a weighted graph?",
      options: [
        { id: "q3-a", text: "BFS" },
        { id: "q3-b", text: "DFS" },
        { id: "q3-c", text: "Dijkstra's Algorithm" },
        { id: "q3-d", text: "Binary Search" }
      ],
      correct_answer: "q3-c"
    },
    {
      id: 4,
      content: "What is the space complexity of a recursive fibonacci function without memoization?",
      options: [
        { id: "q4-a", text: "O(1)" },
        { id: "q4-b", text: "O(log n)" },
        { id: "q4-c", text: "O(n)" },
        { id: "q4-d", text: "O(2^n)" }
      ],
      correct_answer: "q4-c"
    },
    {
      id: 5,
      content: "Which of these is not a balanced binary search tree implementation?",
      options: [
        { id: "q5-a", text: "AVL Tree" },
        { id: "q5-b", text: "Red-Black Tree" },
        { id: "q5-c", text: "B-Tree" },
        { id: "q5-d", text: "Binary Heap" }
      ],
      correct_answer: "q5-d"
    },
    {
      id: 6,
      content: "What is the time complexity of the quick sort algorithm in the average case?",
      options: [
        { id: "q6-a", text: "O(n)" },
        { id: "q6-b", text: "O(n log n)" },
        { id: "q6-c", text: "O(n^2)" },
        { id: "q6-d", text: "O(log n)" }
      ],
      correct_answer: "q6-b"
    },
    {
      id: 7,
      content: "What is the primary advantage of using a hash table?",
      options: [
        { id: "q7-a", text: "Guaranteed O(1) worst-case operations" },
        { id: "q7-b", text: "Memory efficiency" },
        { id: "q7-c", text: "O(1) average-case lookup, insertion, and deletion" },
        { id: "q7-d", text: "Maintaining sorted order of elements" }
      ],
      correct_answer: "q7-c"
    },
    {
      id: 8,
      content: "Which data structure would you use to implement an undo functionality?",
      options: [
        { id: "q8-a", text: "Queue" },
        { id: "q8-b", text: "Stack" },
        { id: "q8-c", text: "Tree" },
        { id: "q8-d", text: "Hash Table" }
      ],
      correct_answer: "q8-b"
    },
    {
      id: 9,
      content: "What is the worst-case time complexity of the merge sort algorithm?",
      options: [
        { id: "q9-a", text: "O(n)" },
        { id: "q9-b", text: "O(n log n)" },
        { id: "q9-c", text: "O(n^2)" },
        { id: "q9-d", text: "O(2^n)" }
      ],
      correct_answer: "q9-b"
    },
    {
      id: 10,
      content: "In a Union-Find data structure with path compression and union by rank, what is the amortized time complexity of operations?",
      options: [
        { id: "q10-a", text: "O(1)" },
        { id: "q10-b", text: "O(log n)" },
        { id: "q10-c", text: "O(log* n)" },
        { id: "q10-d", text: "O(n)" }
      ],
      correct_answer: "q10-c"
    }
  ];
};
