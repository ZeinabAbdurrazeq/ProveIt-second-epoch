/**
 * Seed script for the InterviewQuestions collection (Feature 2).
 *
 * Run with:  node scripts/seedQuestions.js
 *
 * Idempotent: clears existing questions and re-inserts the full set so the RAG
 * layer has consistent data. Covers JavaScript, React, Node.js, Python,
 * system design, algorithms, CSS and SQL with correct fieldRelevance tags.
 */
import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";
import InterviewQuestions from "../src/models/InterviewQuestions.js";

const QUESTIONS = [
  // ---------------- JavaScript ----------------
  {
    questionText:
      "What is the difference between let, const, and var in JavaScript?",
    category: "javascript",
    fieldRelevance: ["frontend", "backend", "fullstack", "mobile"],
    difficulty: "easy",
    followUpQuestions: [
      "What is the temporal dead zone?",
      "How does hoisting differ between var and let?",
    ],
    expectedKeywords: ["block scope", "hoisting", "reassignment", "temporal dead zone"],
  },
  {
    questionText:
      "Explain how closures work in JavaScript and give a practical use case.",
    category: "javascript",
    fieldRelevance: ["frontend", "backend", "fullstack"],
    difficulty: "medium",
    followUpQuestions: ["How can closures cause memory leaks?"],
    expectedKeywords: ["lexical scope", "inner function", "state", "encapsulation"],
  },
  {
    questionText:
      "Describe the JavaScript event loop, including the call stack, task queue, and microtask queue.",
    category: "javascript",
    fieldRelevance: ["frontend", "backend", "fullstack"],
    difficulty: "hard",
    followUpQuestions: [
      "Where do Promise callbacks run relative to setTimeout?",
    ],
    expectedKeywords: ["call stack", "microtask", "macrotask", "promise", "non-blocking"],
  },
  {
    questionText:
      "What is the difference between == and === in JavaScript?",
    category: "javascript",
    fieldRelevance: ["frontend", "backend", "fullstack", "mobile"],
    difficulty: "easy",
    followUpQuestions: ["What is type coercion?"],
    expectedKeywords: ["strict equality", "type coercion", "type conversion"],
  },

  // ---------------- React ----------------
  {
    questionText: "What is the virtual DOM and how does React use it?",
    category: "react",
    fieldRelevance: ["frontend", "fullstack", "mobile"],
    difficulty: "easy",
    followUpQuestions: ["What is reconciliation?"],
    expectedKeywords: ["virtual dom", "diffing", "reconciliation", "re-render"],
  },
  {
    questionText:
      "Explain the useEffect hook and how its dependency array controls when it runs.",
    category: "react",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "medium",
    followUpQuestions: [
      "How do you clean up a subscription in useEffect?",
      "What happens with an empty dependency array?",
    ],
    expectedKeywords: ["side effect", "dependency array", "cleanup", "mount", "re-render"],
  },
  {
    questionText:
      "What problem do useMemo and useCallback solve, and when should you avoid them?",
    category: "react",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "hard",
    followUpQuestions: ["What is referential equality?"],
    expectedKeywords: ["memoization", "referential equality", "re-render", "performance"],
  },
  {
    questionText:
      "What is the difference between controlled and uncontrolled components in React?",
    category: "react",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "medium",
    followUpQuestions: ["When would you prefer an uncontrolled component?"],
    expectedKeywords: ["controlled", "uncontrolled", "state", "ref", "value"],
  },

  // ---------------- Node.js ----------------
  {
    questionText:
      "How does Node.js handle concurrency despite being single-threaded?",
    category: "nodejs",
    fieldRelevance: ["backend", "fullstack"],
    difficulty: "medium",
    followUpQuestions: ["What is the libuv thread pool used for?"],
    expectedKeywords: ["event loop", "non-blocking", "libuv", "asynchronous", "thread pool"],
  },
  {
    questionText:
      "What is middleware in Express and how does the request flow through it?",
    category: "nodejs",
    fieldRelevance: ["backend", "fullstack"],
    difficulty: "easy",
    followUpQuestions: ["What does calling next() do?"],
    expectedKeywords: ["middleware", "next", "request", "response", "pipeline"],
  },
  {
    questionText:
      "How would you handle errors in an async/await Express route handler?",
    category: "nodejs",
    fieldRelevance: ["backend", "fullstack"],
    difficulty: "hard",
    followUpQuestions: ["Why is a centralized error handler useful?"],
    expectedKeywords: ["try catch", "next(error)", "error handler", "async"],
  },
  {
    questionText:
      "What is the difference between process.nextTick and setImmediate in Node.js?",
    category: "nodejs",
    fieldRelevance: ["backend", "fullstack"],
    difficulty: "hard",
    followUpQuestions: [],
    expectedKeywords: ["nextTick", "setImmediate", "event loop", "phase"],
  },

  // ---------------- Python ----------------
  {
    questionText:
      "What is the difference between a list and a tuple in Python?",
    category: "python",
    fieldRelevance: ["backend", "data science", "fullstack"],
    difficulty: "easy",
    followUpQuestions: ["When would you use a tuple over a list?"],
    expectedKeywords: ["mutable", "immutable", "list", "tuple", "hashable"],
  },
  {
    questionText:
      "Explain how list comprehensions work and when you might avoid them.",
    category: "python",
    fieldRelevance: ["backend", "data science", "fullstack"],
    difficulty: "medium",
    followUpQuestions: ["What is a generator expression?"],
    expectedKeywords: ["comprehension", "iterable", "readability", "generator"],
  },
  {
    questionText:
      "What is the Global Interpreter Lock (GIL) and how does it affect multithreaded Python?",
    category: "python",
    fieldRelevance: ["backend", "data science"],
    difficulty: "hard",
    followUpQuestions: ["How can you achieve true parallelism in Python?"],
    expectedKeywords: ["GIL", "thread", "multiprocessing", "parallelism", "CPython"],
  },
  {
    questionText:
      "How does Python manage memory and what is reference counting?",
    category: "python",
    fieldRelevance: ["backend", "data science"],
    difficulty: "medium",
    followUpQuestions: ["What is the garbage collector for cyclic references?"],
    expectedKeywords: ["reference counting", "garbage collection", "memory", "cycle"],
  },

  // ---------------- System design ----------------
  {
    questionText:
      "How would you design a URL shortening service like bit.ly?",
    category: "system design",
    fieldRelevance: ["backend", "fullstack", "devops"],
    difficulty: "hard",
    followUpQuestions: [
      "How would you generate unique short codes?",
      "How would you scale reads?",
    ],
    expectedKeywords: ["hashing", "database", "caching", "scalability", "redirect"],
  },
  {
    questionText:
      "What is the difference between horizontal and vertical scaling?",
    category: "system design",
    fieldRelevance: ["backend", "fullstack", "devops"],
    difficulty: "medium",
    followUpQuestions: ["What are the trade-offs of each?"],
    expectedKeywords: ["horizontal", "vertical", "load balancer", "scale out", "scale up"],
  },
  {
    questionText:
      "Explain caching strategies and when you would use a cache in a web application.",
    category: "system design",
    fieldRelevance: ["backend", "fullstack", "devops"],
    difficulty: "medium",
    followUpQuestions: ["What is cache invalidation and why is it hard?"],
    expectedKeywords: ["cache", "TTL", "invalidation", "redis", "latency"],
  },

  // ---------------- Algorithms ----------------
  {
    questionText:
      "What is Big O notation and why does it matter when evaluating an algorithm?",
    category: "algorithms",
    fieldRelevance: ["frontend", "backend", "fullstack", "data science", "mobile"],
    difficulty: "easy",
    followUpQuestions: ["What is the difference between O(n) and O(log n)?"],
    expectedKeywords: ["time complexity", "space complexity", "worst case", "scalability"],
  },
  {
    questionText:
      "How would you detect a cycle in a linked list?",
    category: "algorithms",
    fieldRelevance: ["backend", "fullstack", "data science"],
    difficulty: "medium",
    followUpQuestions: ["What is Floyd's tortoise and hare algorithm?"],
    expectedKeywords: ["two pointers", "fast slow", "cycle", "Floyd"],
  },
  {
    questionText:
      "Explain the difference between depth-first search and breadth-first search.",
    category: "algorithms",
    fieldRelevance: ["backend", "fullstack", "data science"],
    difficulty: "medium",
    followUpQuestions: ["Which uses a queue and which uses a stack?"],
    expectedKeywords: ["DFS", "BFS", "stack", "queue", "graph", "traversal"],
  },

  // ---------------- CSS ----------------
  {
    questionText:
      "Explain the CSS box model and the difference between content-box and border-box.",
    category: "css",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "easy",
    followUpQuestions: ["What does box-sizing: border-box change?"],
    expectedKeywords: ["box model", "padding", "border", "margin", "box-sizing"],
  },
  {
    questionText:
      "What is the difference between Flexbox and CSS Grid, and when would you use each?",
    category: "css",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "medium",
    followUpQuestions: ["How do you center an element with Flexbox?"],
    expectedKeywords: ["flexbox", "grid", "one dimensional", "two dimensional", "layout"],
  },
  {
    questionText:
      "How does CSS specificity work and how are conflicting rules resolved?",
    category: "css",
    fieldRelevance: ["frontend", "fullstack"],
    difficulty: "hard",
    followUpQuestions: ["What does !important do and why avoid it?"],
    expectedKeywords: ["specificity", "selector", "inline", "id", "class", "cascade"],
  },

  // ---------------- SQL ----------------
  {
    questionText:
      "What is the difference between an INNER JOIN and a LEFT JOIN?",
    category: "sql",
    fieldRelevance: ["backend", "fullstack", "data science"],
    difficulty: "easy",
    followUpQuestions: ["What does a FULL OUTER JOIN return?"],
    expectedKeywords: ["inner join", "left join", "matching rows", "null"],
  },
  {
    questionText:
      "What is a database index and what are the trade-offs of adding one?",
    category: "sql",
    fieldRelevance: ["backend", "fullstack", "data science"],
    difficulty: "medium",
    followUpQuestions: ["How does an index affect write performance?"],
    expectedKeywords: ["index", "b-tree", "lookup", "write cost", "query performance"],
  },
  {
    questionText:
      "Explain database normalization and when you might denormalize.",
    category: "sql",
    fieldRelevance: ["backend", "fullstack", "data science"],
    difficulty: "hard",
    followUpQuestions: ["What problems does normalization prevent?"],
    expectedKeywords: ["normalization", "redundancy", "normal form", "denormalization", "join"],
  },
];

async function seed() {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not set in the environment");
    }

    await mongoose.connect(ENV.DB_URL);
    console.log("Connected to DB");

    await InterviewQuestions.deleteMany({});
    console.log("Cleared existing questions");

    const inserted = await InterviewQuestions.insertMany(QUESTIONS);
    console.log(`Seeded ${inserted.length} interview questions`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  }
}

seed();
