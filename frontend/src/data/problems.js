// Original, LeetCode-style practice problems used by both the Problems page
// (solo practice) and live coding sessions. Difficulty is capitalized
// ("Easy" | "Medium" | "Hard") because the session UI lowercases it before
// sending it to the backend. Each problem's expectedOutput must exactly match
// the stdout produced by the test calls in starterCode when solved correctly.
export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
  },

  "sum-of-array": {
    id: "sum-of-array",
    title: "Sum of Array",
    difficulty: "Easy",
    category: "Array \u2022 Math",
    description: {
      text: "Given an array of integers nums, return the sum of all its elements.",
      notes: ["An empty array sums to 0."],
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "10" },
      { input: "nums = [-5,5]", output: "0" },
    ],
    constraints: ["0 \u2264 nums.length \u2264 10\u2074", "-10\u2079 \u2264 nums[i] \u2264 10\u2079"],
    starterCode: {
      javascript: `function sumArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(sumArray([1, 2, 3, 4])); // Expected: 10
console.log(sumArray([-5, 5])); // Expected: 0`,
      python: `def sumArray(nums):
    # Write your solution here
    pass

# Test cases
print(sumArray([1, 2, 3, 4]))  # Expected: 10
print(sumArray([-5, 5]))  # Expected: 0`,
      java: `class Solution {
    public static int sumArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(sumArray(new int[]{1, 2, 3, 4})); // Expected: 10
        System.out.println(sumArray(new int[]{-5, 5})); // Expected: 0
    }
}`,
    },
    expectedOutput: {
      javascript: "10\n0",
      python: "10\n0",
      java: "10\n0",
    },
  },

  "find-maximum": {
    id: "find-maximum",
    title: "Find Maximum",
    difficulty: "Easy",
    category: "Array \u2022 Math",
    description: {
      text: "Given a non-empty array of integers nums, return the largest value in the array.",
      notes: [],
    },
    examples: [
      { input: "nums = [3,7,2,9,4]", output: "9" },
      { input: "nums = [-1,-5,-3]", output: "-1" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074", "-10\u2079 \u2264 nums[i] \u2264 10\u2079"],
    starterCode: {
      javascript: `function findMax(nums) {
  // Write your solution here
  
}

// Test cases
console.log(findMax([3, 7, 2, 9, 4])); // Expected: 9
console.log(findMax([-1, -5, -3])); // Expected: -1`,
      python: `def findMax(nums):
    # Write your solution here
    pass

# Test cases
print(findMax([3, 7, 2, 9, 4]))  # Expected: 9
print(findMax([-1, -5, -3]))  # Expected: -1`,
      java: `class Solution {
    public static int findMax(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findMax(new int[]{3, 7, 2, 9, 4})); // Expected: 9
        System.out.println(findMax(new int[]{-1, -5, -3})); // Expected: -1
    }
}`,
    },
    expectedOutput: {
      javascript: "9\n-1",
      python: "9\n-1",
      java: "9\n-1",
    },
  },

  "count-vowels": {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Given a lowercase string s, return the number of vowels (a, e, i, o, u) it contains.",
      notes: [],
    },
    examples: [
      { input: 's = "hello"', output: "2" },
      { input: 's = "rhythm"', output: "0" },
    ],
    constraints: ["0 \u2264 s.length \u2264 10\u2075", "s consists of lowercase English letters"],
    starterCode: {
      javascript: `function countVowels(s) {
  // Write your solution here
  
}

// Test cases
console.log(countVowels("hello")); // Expected: 2
console.log(countVowels("rhythm")); // Expected: 0`,
      python: `def countVowels(s):
    # Write your solution here
    pass

# Test cases
print(countVowels("hello"))  # Expected: 2
print(countVowels("rhythm"))  # Expected: 0`,
      java: `class Solution {
    public static int countVowels(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(countVowels("hello")); // Expected: 2
        System.out.println(countVowels("rhythm")); // Expected: 0
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n0",
      python: "2\n0",
      java: "2\n0",
    },
  },

  "fizzbuzz": {
    id: "fizzbuzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    category: "Math \u2022 String",
    description: {
      text: "Given an integer n, return an array of strings from 1 to n where multiples of 3 are 'Fizz', multiples of 5 are 'Buzz', multiples of both are 'FizzBuzz', and all other numbers are their own value as a string.",
      notes: [],
    },
    examples: [
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
    ],
    constraints: ["1 \u2264 n \u2264 10\u2074"],
    starterCode: {
      javascript: `function fizzBuzz(n) {
  // Write your solution here
  
}

// Test cases
console.log(fizzBuzz(5)); // Expected: ["1","2","Fizz","4","Buzz"]`,
      python: `def fizzBuzz(n):
    # Write your solution here
    pass

# Test cases
print(fizzBuzz(5))  # Expected: ['1', '2', 'Fizz', '4', 'Buzz']`,
      java: `import java.util.*;

class Solution {
    public static List<String> fizzBuzz(int n) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(fizzBuzz(5)); // Expected: [1, 2, Fizz, 4, Buzz]
    }
}`,
    },
    expectedOutput: {
      javascript: '["1","2","Fizz","4","Buzz"]',
      python: "['1', '2', 'Fizz', '4', 'Buzz']",
      java: "[1, 2, Fizz, 4, Buzz]",
    },
  },

  "factorial": {
    id: "factorial",
    title: "Factorial",
    difficulty: "Easy",
    category: "Math \u2022 Recursion",
    description: {
      text: "Given a non-negative integer n, return n! (the product of all positive integers up to n).",
      notes: ["0! is defined as 1."],
    },
    examples: [
      { input: "n = 5", output: "120" },
      { input: "n = 0", output: "1" },
    ],
    constraints: ["0 \u2264 n \u2264 12"],
    starterCode: {
      javascript: `function factorial(n) {
  // Write your solution here
  
}

// Test cases
console.log(factorial(5)); // Expected: 120
console.log(factorial(0)); // Expected: 1`,
      python: `def factorial(n):
    # Write your solution here
    pass

# Test cases
print(factorial(5))  # Expected: 120
print(factorial(0))  # Expected: 1`,
      java: `class Solution {
    public static long factorial(int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(factorial(5)); // Expected: 120
        System.out.println(factorial(0)); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "120\n1",
      python: "120\n1",
      java: "120\n1",
    },
  },

  "is-prime": {
    id: "is-prime",
    title: "Is Prime",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an integer n, return true if n is a prime number, otherwise return false.",
      notes: ["A prime number is greater than 1 and divisible only by 1 and itself."],
    },
    examples: [
      { input: "n = 7", output: "true" },
      { input: "n = 9", output: "false" },
      { input: "n = 1", output: "false" },
    ],
    constraints: ["-10\u2079 \u2264 n \u2264 10\u2079"],
    starterCode: {
      javascript: `function isPrime(n) {
  // Write your solution here
  
}

// Test cases
console.log(isPrime(7)); // Expected: true
console.log(isPrime(9)); // Expected: false
console.log(isPrime(1)); // Expected: false`,
      python: `def isPrime(n):
    # Write your solution here
    pass

# Test cases
print(isPrime(7))  # Expected: True
print(isPrime(9))  # Expected: False
print(isPrime(1))  # Expected: False`,
      java: `class Solution {
    public static boolean isPrime(int n) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPrime(7)); // Expected: true
        System.out.println(isPrime(9)); // Expected: false
        System.out.println(isPrime(1)); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\nfalse",
      python: "True\nFalse\nFalse",
      java: "true\nfalse\nfalse",
    },
  },

  "reverse-integer": {
    id: "reverse-integer",
    title: "Reverse Integer",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given a 32-bit signed integer x, return x with its digits reversed. Assume the reversed value fits in a 32-bit signed integer.",
      notes: ["The sign of the number is preserved."],
    },
    examples: [
      { input: "x = 123", output: "321" },
      { input: "x = -456", output: "-654" },
      { input: "x = 120", output: "21" },
    ],
    constraints: ["-2\u00b3\u00b9 \u2264 x \u2264 2\u00b3\u00b9 - 1"],
    starterCode: {
      javascript: `function reverseInteger(x) {
  // Write your solution here
  
}

// Test cases
console.log(reverseInteger(123)); // Expected: 321
console.log(reverseInteger(-456)); // Expected: -654
console.log(reverseInteger(120)); // Expected: 21`,
      python: `def reverseInteger(x):
    # Write your solution here
    pass

# Test cases
print(reverseInteger(123))  # Expected: 321
print(reverseInteger(-456))  # Expected: -654
print(reverseInteger(120))  # Expected: 21`,
      java: `class Solution {
    public static int reverseInteger(int x) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(reverseInteger(123)); // Expected: 321
        System.out.println(reverseInteger(-456)); // Expected: -654
        System.out.println(reverseInteger(120)); // Expected: 21
    }
}`,
    },
    expectedOutput: {
      javascript: "321\n-654\n21",
      python: "321\n-654\n21",
      java: "321\n-654\n21",
    },
  },

  "count-words": {
    id: "count-words",
    title: "Count Words",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Given a string s, return the number of words in it. A word is a maximal sequence of non-space characters.",
      notes: ["Leading, trailing, and multiple spaces between words should be handled correctly."],
    },
    examples: [
      { input: 's = "the quick brown fox"', output: "4" },
      { input: 's = "  hello   world  "', output: "2" },
    ],
    constraints: ["0 \u2264 s.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function countWords(s) {
  // Write your solution here
  
}

// Test cases
console.log(countWords("the quick brown fox")); // Expected: 4
console.log(countWords("  hello   world  ")); // Expected: 2`,
      python: `def countWords(s):
    # Write your solution here
    pass

# Test cases
print(countWords("the quick brown fox"))  # Expected: 4
print(countWords("  hello   world  "))  # Expected: 2`,
      java: `class Solution {
    public static int countWords(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(countWords("the quick brown fox")); // Expected: 4
        System.out.println(countWords("  hello   world  ")); // Expected: 2
    }
}`,
    },
    expectedOutput: {
      javascript: "4\n2",
      python: "4\n2",
      java: "4\n2",
    },
  },

  "fibonacci": {
    id: "fibonacci",
    title: "Fibonacci Number",
    difficulty: "Easy",
    category: "Math \u2022 Dynamic Programming",
    description: {
      text: "Given an integer n, return the nth Fibonacci number, where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2).",
      notes: [],
    },
    examples: [
      { input: "n = 6", output: "8" },
      { input: "n = 0", output: "0" },
      { input: "n = 1", output: "1" },
    ],
    constraints: ["0 \u2264 n \u2264 45"],
    starterCode: {
      javascript: `function fib(n) {
  // Write your solution here
  
}

// Test cases
console.log(fib(6)); // Expected: 8
console.log(fib(0)); // Expected: 0
console.log(fib(1)); // Expected: 1`,
      python: `def fib(n):
    # Write your solution here
    pass

# Test cases
print(fib(6))  # Expected: 8
print(fib(0))  # Expected: 0
print(fib(1))  # Expected: 1`,
      java: `class Solution {
    public static int fib(int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(fib(6)); // Expected: 8
        System.out.println(fib(0)); // Expected: 0
        System.out.println(fib(1)); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "8\n0\n1",
      python: "8\n0\n1",
      java: "8\n0\n1",
    },
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array \u2022 Hash Table",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice, and false if every element is distinct.",
      notes: [],
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2075", "-10\u2079 \u2264 nums[i] \u2264 10\u2079"],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  // Write your solution here
  
}

// Test cases
console.log(containsDuplicate([1, 2, 3, 1])); // Expected: true
console.log(containsDuplicate([1, 2, 3, 4])); // Expected: false`,
      python: `def containsDuplicate(nums):
    # Write your solution here
    pass

# Test cases
print(containsDuplicate([1, 2, 3, 1]))  # Expected: True
print(containsDuplicate([1, 2, 3, 4]))  # Expected: False`,
      java: `import java.util.*;

class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 1})); // Expected: true
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 4})); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
    },
  },

  "single-number": {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Array \u2022 Bit Manipulation",
    description: {
      text: "Given a non-empty array nums where every element appears twice except for one, return the element that appears only once.",
      notes: ["Try to solve it with linear time and constant extra space."],
    },
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 3 * 10\u2074", "Each element appears twice except for one"],
    starterCode: {
      javascript: `function singleNumber(nums) {
  // Write your solution here
  
}

// Test cases
console.log(singleNumber([2, 2, 1])); // Expected: 1
console.log(singleNumber([4, 1, 2, 1, 2])); // Expected: 4`,
      python: `def singleNumber(nums):
    # Write your solution here
    pass

# Test cases
print(singleNumber([2, 2, 1]))  # Expected: 1
print(singleNumber([4, 1, 2, 1, 2]))  # Expected: 4`,
      java: `class Solution {
    public static int singleNumber(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{2, 2, 1})); // Expected: 1
        System.out.println(singleNumber(new int[]{4, 1, 2, 1, 2})); // Expected: 4
    }
}`,
    },
    expectedOutput: {
      javascript: "1\n4",
      python: "1\n4",
      java: "1\n4",
    },
  },

  "power-of-two": {
    id: "power-of-two",
    title: "Power of Two",
    difficulty: "Easy",
    category: "Math \u2022 Bit Manipulation",
    description: {
      text: "Given an integer n, return true if it is a power of two, otherwise return false.",
      notes: ["n is a power of two if there exists an integer x such that n == 2^x."],
    },
    examples: [
      { input: "n = 16", output: "true" },
      { input: "n = 3", output: "false" },
      { input: "n = 1", output: "true" },
    ],
    constraints: ["-2\u00b3\u00b9 \u2264 n \u2264 2\u00b3\u00b9 - 1"],
    starterCode: {
      javascript: `function isPowerOfTwo(n) {
  // Write your solution here
  
}

// Test cases
console.log(isPowerOfTwo(16)); // Expected: true
console.log(isPowerOfTwo(3)); // Expected: false
console.log(isPowerOfTwo(1)); // Expected: true`,
      python: `def isPowerOfTwo(n):
    # Write your solution here
    pass

# Test cases
print(isPowerOfTwo(16))  # Expected: True
print(isPowerOfTwo(3))  # Expected: False
print(isPowerOfTwo(1))  # Expected: True`,
      java: `class Solution {
    public static boolean isPowerOfTwo(int n) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPowerOfTwo(16)); // Expected: true
        System.out.println(isPowerOfTwo(3)); // Expected: false
        System.out.println(isPowerOfTwo(1)); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },

  "move-zeroes": {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Array \u2022 Two Pointers",
    description: {
      text: "Given an integer array nums, move all 0's to the end while keeping the relative order of the non-zero elements. Return the resulting array.",
      notes: [],
    },
    examples: [
      { input: "nums = [0,1,0,3,12]", output: "[1,3,12,0,0]" },
      { input: "nums = [0]", output: "[0]" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074", "-2\u00b3\u00b9 \u2264 nums[i] \u2264 2\u00b3\u00b9 - 1"],
    starterCode: {
      javascript: `function moveZeroes(nums) {
  // Write your solution here
  
}

// Test cases
console.log(moveZeroes([0, 1, 0, 3, 12])); // Expected: [1,3,12,0,0]
console.log(moveZeroes([0])); // Expected: [0]`,
      python: `def moveZeroes(nums):
    # Write your solution here
    pass

# Test cases
print(moveZeroes([0, 1, 0, 3, 12]))  # Expected: [1, 3, 12, 0, 0]
print(moveZeroes([0]))  # Expected: [0]`,
      java: `import java.util.*;

class Solution {
    public static int[] moveZeroes(int[] nums) {
        // Write your solution here
        
        return nums;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(moveZeroes(new int[]{0, 1, 0, 3, 12}))); // Expected: [1, 3, 12, 0, 0]
        System.out.println(Arrays.toString(moveZeroes(new int[]{0}))); // Expected: [0]
    }
}`,
    },
    expectedOutput: {
      javascript: "[1,3,12,0,0]\n[0]",
      python: "[1, 3, 12, 0, 0]\n[0]",
      java: "[1, 3, 12, 0, 0]\n[0]",
    },
  },

  "merge-sorted-array": {
    id: "merge-sorted-array",
    title: "Merge Two Sorted Arrays",
    difficulty: "Easy",
    category: "Array \u2022 Two Pointers",
    description: {
      text: "Given two sorted integer arrays a and b, merge them into a single sorted array and return it.",
      notes: [],
    },
    examples: [
      { input: "a = [1,3,5], b = [2,4,6]", output: "[1,2,3,4,5,6]" },
      { input: "a = [], b = [1]", output: "[1]" },
    ],
    constraints: ["0 \u2264 a.length, b.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function mergeSorted(a, b) {
  // Write your solution here
  
}

// Test cases
console.log(mergeSorted([1, 3, 5], [2, 4, 6])); // Expected: [1,2,3,4,5,6]
console.log(mergeSorted([], [1])); // Expected: [1]`,
      python: `def mergeSorted(a, b):
    # Write your solution here
    pass

# Test cases
print(mergeSorted([1, 3, 5], [2, 4, 6]))  # Expected: [1, 2, 3, 4, 5, 6]
print(mergeSorted([], [1]))  # Expected: [1]`,
      java: `import java.util.*;

class Solution {
    public static int[] mergeSorted(int[] a, int[] b) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(mergeSorted(new int[]{1, 3, 5}, new int[]{2, 4, 6}))); // Expected: [1, 2, 3, 4, 5, 6]
        System.out.println(Arrays.toString(mergeSorted(new int[]{}, new int[]{1}))); // Expected: [1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[1,2,3,4,5,6]\n[1]",
      python: "[1, 2, 3, 4, 5, 6]\n[1]",
      java: "[1, 2, 3, 4, 5, 6]\n[1]",
    },
  },

  "gcd": {
    id: "gcd",
    title: "Greatest Common Divisor",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given two positive integers a and b, return their greatest common divisor.",
      notes: ["The GCD is the largest integer that divides both a and b without a remainder."],
    },
    examples: [
      { input: "a = 12, b = 18", output: "6" },
      { input: "a = 7, b = 13", output: "1" },
    ],
    constraints: ["1 \u2264 a, b \u2264 10\u2079"],
    starterCode: {
      javascript: `function gcd(a, b) {
  // Write your solution here
  
}

// Test cases
console.log(gcd(12, 18)); // Expected: 6
console.log(gcd(7, 13)); // Expected: 1`,
      python: `def gcd(a, b):
    # Write your solution here
    pass

# Test cases
print(gcd(12, 18))  # Expected: 6
print(gcd(7, 13))  # Expected: 1`,
      java: `class Solution {
    public static int gcd(int a, int b) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(gcd(12, 18)); // Expected: 6
        System.out.println(gcd(7, 13)); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1",
      python: "6\n1",
      java: "6\n1",
    },
  },

  "is-anagram": {
    id: "is-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String \u2022 Hash Table",
    description: {
      text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram uses all the original letters exactly once.",
      notes: [],
    },
    examples: [
      { input: 's = "listen", t = "silent"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    constraints: ["1 \u2264 s.length, t.length \u2264 5 * 10\u2074", "s and t consist of lowercase English letters"],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Write your solution here
  
}

// Test cases
console.log(isAnagram("listen", "silent")); // Expected: true
console.log(isAnagram("rat", "car")); // Expected: false`,
      python: `def isAnagram(s, t):
    # Write your solution here
    pass

# Test cases
print(isAnagram("listen", "silent"))  # Expected: True
print(isAnagram("rat", "car"))  # Expected: False`,
      java: `class Solution {
    public static boolean isAnagram(String s, String t) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isAnagram("listen", "silent")); // Expected: true
        System.out.println(isAnagram("rat", "car")); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
    },
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase that takes n steps to reach the top. Each time you can climb 1 or 2 steps. Return how many distinct ways you can climb to the top.",
      notes: [],
    },
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" },
      { input: "n = 5", output: "8" },
    ],
    constraints: ["1 \u2264 n \u2264 45"],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your solution here
  
}

// Test cases
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3
console.log(climbStairs(5)); // Expected: 8`,
      python: `def climbStairs(n):
    # Write your solution here
    pass

# Test cases
print(climbStairs(2))  # Expected: 2
print(climbStairs(3))  # Expected: 3
print(climbStairs(5))  # Expected: 8`,
      java: `class Solution {
    public static int climbStairs(int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(climbStairs(2)); // Expected: 2
        System.out.println(climbStairs(3)); // Expected: 3
        System.out.println(climbStairs(5)); // Expected: 8
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n3\n8",
      python: "2\n3\n8",
      java: "2\n3\n8",
    },
  },

  "group-by-parity": {
    id: "group-by-parity",
    title: "Group By Parity",
    difficulty: "Medium",
    category: "Array \u2022 Two Pointers",
    description: {
      text: "Given an integer array nums, return an array with all the even numbers first (in their original order) followed by all the odd numbers (in their original order).",
      notes: [],
    },
    examples: [
      { input: "nums = [3,1,2,4]", output: "[2,4,3,1]" },
      { input: "nums = [1,3,5]", output: "[1,3,5]" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function groupByParity(nums) {
  // Write your solution here
  
}

// Test cases
console.log(groupByParity([3, 1, 2, 4])); // Expected: [2,4,3,1]
console.log(groupByParity([1, 3, 5])); // Expected: [1,3,5]`,
      python: `def groupByParity(nums):
    # Write your solution here
    pass

# Test cases
print(groupByParity([3, 1, 2, 4]))  # Expected: [2, 4, 3, 1]
print(groupByParity([1, 3, 5]))  # Expected: [1, 3, 5]`,
      java: `import java.util.*;

class Solution {
    public static int[] groupByParity(int[] nums) {
        // Write your solution here
        
        return nums;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(groupByParity(new int[]{3, 1, 2, 4}))); // Expected: [2, 4, 3, 1]
        System.out.println(Arrays.toString(groupByParity(new int[]{1, 3, 5}))); // Expected: [1, 3, 5]
    }
}`,
    },
    expectedOutput: {
      javascript: "[2,4,3,1]\n[1,3,5]",
      python: "[2, 4, 3, 1]\n[1, 3, 5]",
      java: "[2, 4, 3, 1]\n[1, 3, 5]",
    },
  },

  "longest-unique-substring": {
    id: "longest-unique-substring",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String \u2022 Sliding Window",
    description: {
      text: "Given a string s, return the length of the longest substring that contains no repeating characters.",
      notes: [],
    },
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: "1" },
      { input: 's = "pwwkew"', output: "3" },
    ],
    constraints: ["0 \u2264 s.length \u2264 5 * 10\u2074"],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Expected: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Expected: 3`,
      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass

# Test cases
print(lengthOfLongestSubstring("abcabcbb"))  # Expected: 3
print(lengthOfLongestSubstring("bbbbb"))  # Expected: 1
print(lengthOfLongestSubstring("pwwkew"))  # Expected: 3`,
      java: `class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
        System.out.println(lengthOfLongestSubstring("bbbbb")); // Expected: 1
        System.out.println(lengthOfLongestSubstring("pwwkew")); // Expected: 3
    }
}`,
    },
    expectedOutput: {
      javascript: "3\n1\n3",
      python: "3\n1\n3",
      java: "3\n1\n3",
    },
  },

  "product-except-self": {
    id: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array \u2022 Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] equals the product of all elements of nums except nums[i].",
      notes: ["Solve it without using the division operation."],
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [2,3,4]", output: "[12,8,6]" },
    ],
    constraints: ["2 \u2264 nums.length \u2264 10\u2075"],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Write your solution here
  
}

// Test cases
console.log(productExceptSelf([1, 2, 3, 4])); // Expected: [24,12,8,6]
console.log(productExceptSelf([2, 3, 4])); // Expected: [12,8,6]`,
      python: `def productExceptSelf(nums):
    # Write your solution here
    pass

# Test cases
print(productExceptSelf([1, 2, 3, 4]))  # Expected: [24, 12, 8, 6]
print(productExceptSelf([2, 3, 4]))  # Expected: [12, 8, 6]`,
      java: `import java.util.*;

class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(productExceptSelf(new int[]{1, 2, 3, 4}))); // Expected: [24, 12, 8, 6]
        System.out.println(Arrays.toString(productExceptSelf(new int[]{2, 3, 4}))); // Expected: [12, 8, 6]
    }
}`,
    },
    expectedOutput: {
      javascript: "[24,12,8,6]\n[12,8,6]",
      python: "[24, 12, 8, 6]\n[12, 8, 6]",
      java: "[24, 12, 8, 6]\n[12, 8, 6]",
    },
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "String \u2022 Stack",
    description: {
      text: "Given a string s containing only the characters '()[]{}', return true if every opening bracket is closed by the same type of bracket in the correct order.",
      notes: [],
    },
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
      { input: 's = "([)]"', output: "false" },
    ],
    constraints: ["1 \u2264 s.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}

// Test cases
console.log(isValid("()[]{}")); // Expected: true
console.log(isValid("(]")); // Expected: false
console.log(isValid("([)]")); // Expected: false`,
      python: `def isValid(s):
    # Write your solution here
    pass

# Test cases
print(isValid("()[]{}"))  # Expected: True
print(isValid("(]"))  # Expected: False
print(isValid("([)]"))  # Expected: False`,
      java: `class Solution {
    public static boolean isValid(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isValid("()[]{}")); // Expected: true
        System.out.println(isValid("(]")); // Expected: false
        System.out.println(isValid("([)]")); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\nfalse",
      python: "True\nFalse\nFalse",
      java: "true\nfalse\nfalse",
    },
  },

  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Medium",
    category: "Array \u2022 Binary Search",
    description: {
      text: "Given a sorted array of integers nums and a target value, return the index of target if it exists, otherwise return -1.",
      notes: ["Your solution should run in O(log n) time."],
    },
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074", "nums is sorted in ascending order"],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(search([-1, 0, 3, 5, 9, 12], 9)); // Expected: 4
console.log(search([-1, 0, 3, 5, 9, 12], 2)); // Expected: -1`,
      python: `def search(nums, target):
    # Write your solution here
    pass

# Test cases
print(search([-1, 0, 3, 5, 9, 12], 9))  # Expected: 4
print(search([-1, 0, 3, 5, 9, 12], 2))  # Expected: -1`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(search(new int[]{-1, 0, 3, 5, 9, 12}, 9)); // Expected: 4
        System.out.println(search(new int[]{-1, 0, 3, 5, 9, 12}, 2)); // Expected: -1
    }
}`,
    },
    expectedOutput: {
      javascript: "4\n-1",
      python: "4\n-1",
      java: "4\n-1",
    },
  },

  "rotate-array": {
    id: "rotate-array",
    title: "Rotate Array",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an integer array nums and an integer k, rotate the array to the right by k steps and return the result.",
      notes: ["k may be larger than the array length."],
    },
    examples: [
      { input: "nums = [1,2,3,4,5], k = 2", output: "[4,5,1,2,3]" },
      { input: "nums = [1,2], k = 3", output: "[2,1]" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2075", "0 \u2264 k \u2264 10\u2079"],
    starterCode: {
      javascript: `function rotate(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(rotate([1, 2, 3, 4, 5], 2)); // Expected: [4,5,1,2,3]
console.log(rotate([1, 2], 3)); // Expected: [2,1]`,
      python: `def rotate(nums, k):
    # Write your solution here
    pass

# Test cases
print(rotate([1, 2, 3, 4, 5], 2))  # Expected: [4, 5, 1, 2, 3]
print(rotate([1, 2], 3))  # Expected: [2, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] rotate(int[] nums, int k) {
        // Write your solution here
        
        return nums;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(rotate(new int[]{1, 2, 3, 4, 5}, 2))); // Expected: [4, 5, 1, 2, 3]
        System.out.println(Arrays.toString(rotate(new int[]{1, 2}, 3))); // Expected: [2, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[4,5,1,2,3]\n[2,1]",
      python: "[4, 5, 1, 2, 3]\n[2, 1]",
      java: "[4, 5, 1, 2, 3]\n[2, 1]",
    },
  },

  "first-unique-char": {
    id: "first-unique-char",
    title: "First Unique Character",
    difficulty: "Medium",
    category: "String \u2022 Hash Table",
    description: {
      text: "Given a string s, return the index of the first non-repeating character. If there is none, return -1.",
      notes: [],
    },
    examples: [
      { input: 's = "leetcode"', output: "0" },
      { input: 's = "aabb"', output: "-1" },
    ],
    constraints: ["1 \u2264 s.length \u2264 10\u2075", "s consists of lowercase English letters"],
    starterCode: {
      javascript: `function firstUniqChar(s) {
  // Write your solution here
  
}

// Test cases
console.log(firstUniqChar("leetcode")); // Expected: 0
console.log(firstUniqChar("aabb")); // Expected: -1`,
      python: `def firstUniqChar(s):
    # Write your solution here
    pass

# Test cases
print(firstUniqChar("leetcode"))  # Expected: 0
print(firstUniqChar("aabb"))  # Expected: -1`,
      java: `class Solution {
    public static int firstUniqChar(String s) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(firstUniqChar("leetcode")); // Expected: 0
        System.out.println(firstUniqChar("aabb")); // Expected: -1
    }
}`,
    },
    expectedOutput: {
      javascript: "0\n-1",
      python: "0\n-1",
      java: "0\n-1",
    },
  },

  "kadane-max-product": {
    id: "kadane-max-product",
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given an integer array nums representing the amount of money in each house along a street, return the maximum amount you can rob without robbing two adjacent houses.",
      notes: [],
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 and house 3 (1 + 3 = 4)." },
      { input: "nums = [2,7,9,3,1]", output: "12" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 100", "0 \u2264 nums[i] \u2264 400"],
    starterCode: {
      javascript: `function rob(nums) {
  // Write your solution here
  
}

// Test cases
console.log(rob([1, 2, 3, 1])); // Expected: 4
console.log(rob([2, 7, 9, 3, 1])); // Expected: 12`,
      python: `def rob(nums):
    # Write your solution here
    pass

# Test cases
print(rob([1, 2, 3, 1]))  # Expected: 4
print(rob([2, 7, 9, 3, 1]))  # Expected: 12`,
      java: `class Solution {
    public static int rob(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(rob(new int[]{1, 2, 3, 1})); // Expected: 4
        System.out.println(rob(new int[]{2, 7, 9, 3, 1})); // Expected: 12
    }
}`,
    },
    expectedOutput: {
      javascript: "4\n12",
      python: "4\n12",
      java: "4\n12",
    },
  },

  "coin-change": {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given an array of coin denominations coins and an integer amount, return the fewest number of coins needed to make up that amount. If it cannot be made, return -1.",
      notes: ["You may use each coin an unlimited number of times."],
    },
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1." },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    constraints: ["1 \u2264 coins.length \u2264 12", "0 \u2264 amount \u2264 10\u2074"],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
  
}

// Test cases
console.log(coinChange([1, 2, 5], 11)); // Expected: 3
console.log(coinChange([2], 3)); // Expected: -1`,
      python: `def coinChange(coins, amount):
    # Write your solution here
    pass

# Test cases
print(coinChange([1, 2, 5], 11))  # Expected: 3
print(coinChange([2], 3))  # Expected: -1`,
      java: `class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1, 2, 5}, 11)); // Expected: 3
        System.out.println(coinChange(new int[]{2}, 3)); // Expected: -1
    }
}`,
    },
    expectedOutput: {
      javascript: "3\n-1",
      python: "3\n-1",
      java: "3\n-1",
    },
  },

  "majority-element": {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "Medium",
    category: "Array \u2022 Hash Table",
    description: {
      text: "Given an array nums of size n, return the element that appears more than n/2 times. You may assume the majority element always exists.",
      notes: [],
    },
    examples: [
      { input: "nums = [3,2,3]", output: "3" },
      { input: "nums = [2,2,1,1,1,2,2]", output: "2" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 5 * 10\u2074"],
    starterCode: {
      javascript: `function majorityElement(nums) {
  // Write your solution here
  
}

// Test cases
console.log(majorityElement([3, 2, 3])); // Expected: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // Expected: 2`,
      python: `def majorityElement(nums):
    # Write your solution here
    pass

# Test cases
print(majorityElement([3, 2, 3]))  # Expected: 3
print(majorityElement([2, 2, 1, 1, 1, 2, 2]))  # Expected: 2`,
      java: `class Solution {
    public static int majorityElement(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(majorityElement(new int[]{3, 2, 3})); // Expected: 3
        System.out.println(majorityElement(new int[]{2, 2, 1, 1, 1, 2, 2})); // Expected: 2
    }
}`,
    },
    expectedOutput: {
      javascript: "3\n2",
      python: "3\n2",
      java: "3\n2",
    },
  },

  "top-k-frequent": {
    id: "top-k-frequent",
    title: "Sort By Frequency",
    difficulty: "Medium",
    category: "Array \u2022 Hash Table \u2022 Sorting",
    description: {
      text: "Given an integer array nums, return a new array where elements are sorted by descending frequency. When two elements have the same frequency, the smaller value comes first.",
      notes: ["Each distinct value appears once in the output."],
    },
    examples: [
      { input: "nums = [1,1,1,2,2,3]", output: "[1,2,3]" },
      { input: "nums = [4,4,1,1,2]", output: "[1,4,2]" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2075"],
    starterCode: {
      javascript: `function sortByFrequency(nums) {
  // Write your solution here
  
}

// Test cases
console.log(sortByFrequency([1, 1, 1, 2, 2, 3])); // Expected: [1,2,3]
console.log(sortByFrequency([4, 4, 1, 1, 2])); // Expected: [1,4,2]`,
      python: `def sortByFrequency(nums):
    # Write your solution here
    pass

# Test cases
print(sortByFrequency([1, 1, 1, 2, 2, 3]))  # Expected: [1, 2, 3]
print(sortByFrequency([4, 4, 1, 1, 2]))  # Expected: [1, 4, 2]`,
      java: `import java.util.*;

class Solution {
    public static int[] sortByFrequency(int[] nums) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(sortByFrequency(new int[]{1, 1, 1, 2, 2, 3}))); // Expected: [1, 2, 3]
        System.out.println(Arrays.toString(sortByFrequency(new int[]{4, 4, 1, 1, 2}))); // Expected: [1, 4, 2]
    }
}`,
    },
    expectedOutput: {
      javascript: "[1,2,3]\n[1,4,2]",
      python: "[1, 2, 3]\n[1, 4, 2]",
      java: "[1, 2, 3]\n[1, 4, 2]",
    },
  },

  "spiral-sum": {
    id: "spiral-sum",
    title: "Diagonal Sum",
    difficulty: "Medium",
    category: "Matrix",
    description: {
      text: "Given a square matrix represented as an array of integer arrays, return the sum of both diagonals. If the matrix has odd size, the center element is counted once.",
      notes: [],
    },
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]", output: "25", explanation: "1+5+9 + 3+7 = 25." },
      { input: "matrix = [[1,1],[1,1]]", output: "4" },
    ],
    constraints: ["1 \u2264 n \u2264 100", "matrix is n x n"],
    starterCode: {
      javascript: `function diagonalSum(matrix) {
  // Write your solution here
  
}

// Test cases
console.log(diagonalSum([[1, 2, 3], [4, 5, 6], [7, 8, 9]])); // Expected: 25
console.log(diagonalSum([[1, 1], [1, 1]])); // Expected: 4`,
      python: `def diagonalSum(matrix):
    # Write your solution here
    pass

# Test cases
print(diagonalSum([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))  # Expected: 25
print(diagonalSum([[1, 1], [1, 1]]))  # Expected: 4`,
      java: `class Solution {
    public static int diagonalSum(int[][] matrix) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(diagonalSum(new int[][]{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}})); // Expected: 25
        System.out.println(diagonalSum(new int[][]{{1, 1}, {1, 1}})); // Expected: 4
    }
}`,
    },
    expectedOutput: {
      javascript: "25\n4",
      python: "25\n4",
      java: "25\n4",
    },
  },

  "search-insert": {
    id: "search-insert",
    title: "Search Insert Position",
    difficulty: "Medium",
    category: "Array \u2022 Binary Search",
    description: {
      text: "Given a sorted array of distinct integers and a target, return the index where target is found, or the index where it would be inserted to keep the array sorted.",
      notes: [],
    },
    examples: [
      { input: "nums = [1,3,5,6], target = 5", output: "2" },
      { input: "nums = [1,3,5,6], target = 2", output: "1" },
      { input: "nums = [1,3,5,6], target = 7", output: "4" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function searchInsert(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(searchInsert([1, 3, 5, 6], 5)); // Expected: 2
console.log(searchInsert([1, 3, 5, 6], 2)); // Expected: 1
console.log(searchInsert([1, 3, 5, 6], 7)); // Expected: 4`,
      python: `def searchInsert(nums, target):
    # Write your solution here
    pass

# Test cases
print(searchInsert([1, 3, 5, 6], 5))  # Expected: 2
print(searchInsert([1, 3, 5, 6], 2))  # Expected: 1
print(searchInsert([1, 3, 5, 6], 7))  # Expected: 4`,
      java: `class Solution {
    public static int searchInsert(int[] nums, int target) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(searchInsert(new int[]{1, 3, 5, 6}, 5)); // Expected: 2
        System.out.println(searchInsert(new int[]{1, 3, 5, 6}, 2)); // Expected: 1
        System.out.println(searchInsert(new int[]{1, 3, 5, 6}, 7)); // Expected: 4
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n1\n4",
      python: "2\n1\n4",
      java: "2\n1\n4",
    },
  },

  "longest-common-prefix": {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Medium",
    category: "String",
    description: {
      text: "Given an array of strings, return the longest common prefix shared by all of them. If there is none, return an empty string.",
      notes: [],
    },
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""' },
    ],
    constraints: ["1 \u2264 strs.length \u2264 200"],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  // Write your solution here
  
}

// Test cases
console.log(longestCommonPrefix(["flower", "flow", "flight"])); // Expected: fl
console.log(longestCommonPrefix(["dog", "racecar", "car"])); // Expected: (empty)`,
      python: `def longestCommonPrefix(strs):
    # Write your solution here
    pass

# Test cases
print(longestCommonPrefix(["flower", "flow", "flight"]))  # Expected: fl
print(longestCommonPrefix(["dog", "racecar", "car"]))  # Expected: (empty)`,
      java: `class Solution {
    public static String longestCommonPrefix(String[] strs) {
        // Write your solution here
        
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(longestCommonPrefix(new String[]{"flower", "flow", "flight"})); // Expected: fl
        System.out.println(longestCommonPrefix(new String[]{"dog", "racecar", "car"})); // Expected: (empty)
    }
}`,
    },
    expectedOutput: {
      javascript: "fl\n",
      python: "fl\n",
      java: "fl\n",
    },
  },

  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array \u2022 Sorting",
    description: {
      text: "Given an array of intervals where each interval is [start, end], merge all overlapping intervals and return the result sorted by start.",
      notes: [],
    },
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    constraints: ["1 \u2264 intervals.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function mergeIntervals(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]]))); // Expected: [[1,6],[8,10],[15,18]]
console.log(JSON.stringify(mergeIntervals([[1, 4], [4, 5]]))); // Expected: [[1,5]]`,
      python: `import json

def mergeIntervals(intervals):
    # Write your solution here
    pass

# Test cases
print(json.dumps(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])))  # Expected: [[1, 6], [8, 10], [15, 18]]
print(json.dumps(mergeIntervals([[1, 4], [4, 5]])))  # Expected: [[1, 5]]`,
      java: `import java.util.*;

class Solution {
    public static int[][] mergeIntervals(int[][] intervals) {
        // Write your solution here
        
        return intervals;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(mergeIntervals(new int[][]{{1, 3}, {2, 6}, {8, 10}, {15, 18}}))); // Expected: [[1, 6], [8, 10], [15, 18]]
        System.out.println(Arrays.deepToString(mergeIntervals(new int[][]{{1, 4}, {4, 5}}))); // Expected: [[1, 5]]
    }
}`,
    },
    expectedOutput: {
      javascript: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
      python: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
      java: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
    },
  },

  "3sum-count": {
    id: "3sum-count",
    title: "Count Pairs With Sum",
    difficulty: "Medium",
    category: "Array \u2022 Hash Table",
    description: {
      text: "Given an integer array nums and an integer target, return the number of distinct index pairs (i, j) with i < j such that nums[i] + nums[j] equals target.",
      notes: [],
    },
    examples: [
      { input: "nums = [1,2,3,4,3], target = 6", output: "2", explanation: "(2,4) and (3,3) using values 2+4 and 3+3." },
      { input: "nums = [1,1,1], target = 2", output: "3" },
    ],
    constraints: ["2 \u2264 nums.length \u2264 10\u2074"],
    starterCode: {
      javascript: `function countPairs(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(countPairs([1, 2, 3, 4, 3], 6)); // Expected: 2
console.log(countPairs([1, 1, 1], 2)); // Expected: 3`,
      python: `def countPairs(nums, target):
    # Write your solution here
    pass

# Test cases
print(countPairs([1, 2, 3, 4, 3], 6))  # Expected: 2
print(countPairs([1, 1, 1], 2))  # Expected: 3`,
      java: `class Solution {
    public static int countPairs(int[] nums, int target) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(countPairs(new int[]{1, 2, 3, 4, 3}, 6)); // Expected: 2
        System.out.println(countPairs(new int[]{1, 1, 1}, 2)); // Expected: 3
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n3",
      python: "2\n3",
      java: "2\n3",
    },
  },

  "set-matrix-zeroes": {
    id: "set-matrix-zeroes",
    title: "Transpose Matrix",
    difficulty: "Medium",
    category: "Matrix",
    description: {
      text: "Given a 2D matrix, return its transpose (rows become columns and columns become rows).",
      notes: [],
    },
    examples: [
      { input: "matrix = [[1,2,3],[4,5,6]]", output: "[[1,4],[2,5],[3,6]]" },
      { input: "matrix = [[1,2],[3,4]]", output: "[[1,3],[2,4]]" },
    ],
    constraints: ["1 \u2264 rows, cols \u2264 100"],
    starterCode: {
      javascript: `function transpose(matrix) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(transpose([[1, 2, 3], [4, 5, 6]]))); // Expected: [[1,4],[2,5],[3,6]]
console.log(JSON.stringify(transpose([[1, 2], [3, 4]]))); // Expected: [[1,3],[2,4]]`,
      python: `import json

def transpose(matrix):
    # Write your solution here
    pass

# Test cases
print(json.dumps(transpose([[1, 2, 3], [4, 5, 6]])))  # Expected: [[1, 4], [2, 5], [3, 6]]
print(json.dumps(transpose([[1, 2], [3, 4]])))  # Expected: [[1, 3], [2, 4]]`,
      java: `import java.util.*;

class Solution {
    public static int[][] transpose(int[][] matrix) {
        // Write your solution here
        
        return matrix;
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(transpose(new int[][]{{1, 2, 3}, {4, 5, 6}}))); // Expected: [[1, 4], [2, 5], [3, 6]]
        System.out.println(Arrays.deepToString(transpose(new int[][]{{1, 2}, {3, 4}}))); // Expected: [[1, 3], [2, 4]]
    }
}`,
    },
    expectedOutput: {
      javascript: "[[1,4],[2,5],[3,6]]\n[[1,3],[2,4]]",
      python: "[[1, 4], [2, 5], [3, 6]]\n[[1, 3], [2, 4]]",
      java: "[[1, 4], [2, 5], [3, 6]]\n[[1, 3], [2, 4]]",
    },
  },

  "word-break": {
    id: "word-break",
    title: "Word Break",
    difficulty: "Hard",
    category: "Dynamic Programming \u2022 String",
    description: {
      text: "Given a string s and a list of words wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
      notes: ["Words from the dictionary may be reused."],
    },
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: "true" },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: "false" },
    ],
    constraints: ["1 \u2264 s.length \u2264 300", "1 \u2264 wordDict.length \u2264 1000"],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  // Write your solution here
  
}

// Test cases
console.log(wordBreak("leetcode", ["leet", "code"])); // Expected: true
console.log(wordBreak("applepenapple", ["apple", "pen"])); // Expected: true
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"])); // Expected: false`,
      python: `def wordBreak(s, wordDict):
    # Write your solution here
    pass

# Test cases
print(wordBreak("leetcode", ["leet", "code"]))  # Expected: True
print(wordBreak("applepenapple", ["apple", "pen"]))  # Expected: True
print(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]))  # Expected: False`,
      java: `import java.util.*;

class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(wordBreak("leetcode", Arrays.asList("leet", "code"))); // Expected: true
        System.out.println(wordBreak("applepenapple", Arrays.asList("apple", "pen"))); // Expected: true
        System.out.println(wordBreak("catsandog", Arrays.asList("cats", "dog", "sand", "and", "cat"))); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse",
    },
  },

  "edit-distance": {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming \u2022 String",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of single-character insertions, deletions, or replacements required to convert word1 into word2.",
      notes: [],
    },
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: "3" },
      { input: 'word1 = "intention", word2 = "execution"', output: "5" },
    ],
    constraints: ["0 \u2264 word1.length, word2.length \u2264 500"],
    starterCode: {
      javascript: `function minDistance(word1, word2) {
  // Write your solution here
  
}

// Test cases
console.log(minDistance("horse", "ros")); // Expected: 3
console.log(minDistance("intention", "execution")); // Expected: 5`,
      python: `def minDistance(word1, word2):
    # Write your solution here
    pass

# Test cases
print(minDistance("horse", "ros"))  # Expected: 3
print(minDistance("intention", "execution"))  # Expected: 5`,
      java: `class Solution {
    public static int minDistance(String word1, String word2) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros")); // Expected: 3
        System.out.println(minDistance("intention", "execution")); // Expected: 5
    }
}`,
    },
    expectedOutput: {
      javascript: "3\n5",
      python: "3\n5",
      java: "3\n5",
    },
  },

  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array \u2022 Two Pointers",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, return how much water it can trap after raining.",
      notes: [],
    },
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["1 \u2264 height.length \u2264 2 * 10\u2074", "0 \u2264 height[i] \u2264 10\u2075"],
    starterCode: {
      javascript: `function trap(height) {
  // Write your solution here
  
}

// Test cases
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // Expected: 6
console.log(trap([4, 2, 0, 3, 2, 5])); // Expected: 9`,
      python: `def trap(height):
    # Write your solution here
    pass

# Test cases
print(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))  # Expected: 6
print(trap([4, 2, 0, 3, 2, 5]))  # Expected: 9`,
      java: `class Solution {
    public static int trap(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1})); // Expected: 6
        System.out.println(trap(new int[]{4, 2, 0, 3, 2, 5})); // Expected: 9
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n9",
      python: "6\n9",
      java: "6\n9",
    },
  },

  "longest-increasing-subsequence": {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Hard",
    category: "Dynamic Programming \u2022 Binary Search",
    description: {
      text: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
      notes: ["A subsequence keeps the original order but does not need to be contiguous."],
    },
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "One LIS is [2,3,7,101]." },
      { input: "nums = [0,1,0,3,2,3]", output: "4" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 2500"],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // Expected: 4
console.log(lengthOfLIS([0, 1, 0, 3, 2, 3])); // Expected: 4`,
      python: `def lengthOfLIS(nums):
    # Write your solution here
    pass

# Test cases
print(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))  # Expected: 4
print(lengthOfLIS([0, 1, 0, 3, 2, 3]))  # Expected: 4`,
      java: `class Solution {
    public static int lengthOfLIS(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18})); // Expected: 4
        System.out.println(lengthOfLIS(new int[]{0, 1, 0, 3, 2, 3})); // Expected: 4
    }
}`,
    },
    expectedOutput: {
      javascript: "4\n4",
      python: "4\n4",
      java: "4\n4",
    },
  },

  "jump-game": {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Hard",
    category: "Greedy \u2022 Dynamic Programming",
    description: {
      text: "Given an integer array nums where each element is the maximum jump length from that position, return true if you can reach the last index starting from index 0.",
      notes: [],
    },
    examples: [
      { input: "nums = [2,3,1,1,4]", output: "true" },
      { input: "nums = [3,2,1,0,4]", output: "false" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2074", "0 \u2264 nums[i] \u2264 10\u2075"],
    starterCode: {
      javascript: `function canJump(nums) {
  // Write your solution here
  
}

// Test cases
console.log(canJump([2, 3, 1, 1, 4])); // Expected: true
console.log(canJump([3, 2, 1, 0, 4])); // Expected: false`,
      python: `def canJump(nums):
    # Write your solution here
    pass

# Test cases
print(canJump([2, 3, 1, 1, 4]))  # Expected: True
print(canJump([3, 2, 1, 0, 4]))  # Expected: False`,
      java: `class Solution {
    public static boolean canJump(int[] nums) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2, 3, 1, 1, 4})); // Expected: true
        System.out.println(canJump(new int[]{3, 2, 1, 0, 4})); // Expected: false
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
    },
  },

  "max-sliding-window": {
    id: "max-sliding-window",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    category: "Array \u2022 Sliding Window \u2022 Deque",
    description: {
      text: "Given an integer array nums and a window size k, return an array of the maximum value within each sliding window as it moves from left to right.",
      notes: [],
    },
    examples: [
      { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]" },
      { input: "nums = [1], k = 1", output: "[1]" },
    ],
    constraints: ["1 \u2264 nums.length \u2264 10\u2075", "1 \u2264 k \u2264 nums.length"],
    starterCode: {
      javascript: `function maxSlidingWindow(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // Expected: [3,3,5,5,6,7]
console.log(maxSlidingWindow([1], 1)); // Expected: [1]`,
      python: `def maxSlidingWindow(nums, k):
    # Write your solution here
    pass

# Test cases
print(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3))  # Expected: [3, 3, 5, 5, 6, 7]
print(maxSlidingWindow([1], 1))  # Expected: [1]`,
      java: `import java.util.*;

class Solution {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3))); // Expected: [3, 3, 5, 5, 6, 7]
        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1}, 1))); // Expected: [1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[3,3,5,5,6,7]\n[1]",
      python: "[3, 3, 5, 5, 6, 7]\n[1]",
      java: "[3, 3, 5, 5, 6, 7]\n[1]",
    },
  },

  "median-two-sorted": {
    id: "median-two-sorted",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array \u2022 Binary Search",
    description: {
      text: "Given two sorted integer arrays a and b, return the median of the combined sorted arrays as a number.",
      notes: ["If the total count is even, the median is the average of the two middle values."],
    },
    examples: [
      { input: "a = [1,3], b = [2]", output: "2", explanation: "Merged = [1,2,3], median is 2." },
      { input: "a = [1,2], b = [3,4]", output: "2.5" },
    ],
    constraints: ["0 \u2264 a.length, b.length \u2264 1000"],
    starterCode: {
      javascript: `function findMedianSortedArrays(a, b) {
  // Write your solution here
  
}

// Test cases
console.log(findMedianSortedArrays([1, 3], [2])); // Expected: 2
console.log(findMedianSortedArrays([1, 2], [3, 4])); // Expected: 2.5`,
      python: `def findMedianSortedArrays(a, b):
    # Write your solution here
    pass

# Test cases
print(findMedianSortedArrays([1, 3], [2]))  # Expected: 2
print(findMedianSortedArrays([1, 2], [3, 4]))  # Expected: 2.5`,
      java: `class Solution {
    public static double findMedianSortedArrays(int[] a, int[] b) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1, 3}, new int[]{2})); // Expected: 2.0
        System.out.println(findMedianSortedArrays(new int[]{1, 2}, new int[]{3, 4})); // Expected: 2.5
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n2.5",
      python: "2\n2.5",
      java: "2.0\n2.5",
    },
  },

  "n-queens-count": {
    id: "n-queens-count",
    title: "N-Queens Count",
    difficulty: "Hard",
    category: "Backtracking",
    description: {
      text: "Given an integer n, return the number of distinct ways to place n queens on an n x n chessboard so that no two queens attack each other.",
      notes: [],
    },
    examples: [
      { input: "n = 4", output: "2" },
      { input: "n = 1", output: "1" },
    ],
    constraints: ["1 \u2264 n \u2264 9"],
    starterCode: {
      javascript: `function totalNQueens(n) {
  // Write your solution here
  
}

// Test cases
console.log(totalNQueens(4)); // Expected: 2
console.log(totalNQueens(1)); // Expected: 1`,
      python: `def totalNQueens(n):
    # Write your solution here
    pass

# Test cases
print(totalNQueens(4))  # Expected: 2
print(totalNQueens(1))  # Expected: 1`,
      java: `class Solution {
    public static int totalNQueens(int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(totalNQueens(4)); // Expected: 2
        System.out.println(totalNQueens(1)); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "2\n1",
      python: "2\n1",
      java: "2\n1",
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
};