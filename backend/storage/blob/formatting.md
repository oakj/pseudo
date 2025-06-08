# Table of Contents
1. [Questions JSON File](#questions-json-file)
2. [UserQuestions JSON File](#userquestions-json-file)
3. [Prompt Engineering for Solution Validation](#prompt-engineering-for-solution-validation)

# Questions JSON File

## Base Structure
```json
{
    "question_id": "string",
    "metadata": {
        "difficulty": "string (easy|medium|hard)",
        "categories": ["array of strings"],
        "time_limit_ms": "integer",
        "memory_limit_mb": "integer",
        "version": "string (semver)",
        "last_modified": "string (YYYY-MM-DD)"
    },
    "title": "string",
    "description": "string",
    "constraints": ["array of strings"],
    "complexity_requirements": {
        "time": "string (Big O notation)",
        "space": "string (Big O notation)"
    },
    "test_cases": [
        {
            "input": {
                "value": "any",
                "type": "string (data type)"
            },
            "output": {
                "value": "any",
                "type": "string (data type)"
            },
            "explanation": "string",
            "is_performance_test": "boolean"
        }
    ],
    "pseudocode_requirements": {
        "allowed_constructs": ["array of strings"],
        "required_concepts": ["array of strings"],
        "validation_rules": {
            "syntax_flexibility": "string (low|medium|high)",
            "variable_naming": "string"
        }
    },
    "boilerplate_solution": {
        "language": "string (python)",
        "pseudocode": "string (must contain a Solution class with typed methods)"
    },
    "valid_solutions": [
        {
            "approach": "string",
            "time_complexity": "string (Big O notation)",
            "space_complexity": "string (Big O notation)",
            "pseudocode": "string"
        }
    ],
    "evaluation_criteria": {
        "critical_requirements": ["array of strings"],
        "common_mistakes": [
            {
                "pattern": "string",
                "issue": "string",
                "suggestion": "string"
            }
        ],
        "scoring_rubric": {
            "correctness": {
                "weight": "integer (0-100)",
                "criteria": ["array of strings"]
            },
            "complexity": {
                "weight": "integer (0-100)",
                "criteria": ["array of strings"]
            },
            "implementation": {
                "weight": "integer (0-100)",
                "criteria": ["array of strings"]
            }
        }
    },
    "solution_breakdown": {
        "key_steps": [
            {
                "step": "string",
                "purpose": "string"
            }
        ],
        "invariants": ["array of strings"]
    },
    "anti_patterns": [
        {
            "pattern": "string",
            "why_wrong": "string",
            "correction": "string"
        }
    ],
    "validation_examples": {
        "incorrect_solutions": [
            {
                "code": "string",
                "why_wrong": "string",
                "feedback": "string"
            }
        ],
        "partially_correct": [
            {
                "code": "string",
                "issues": ["array of strings"],
                "feedback": "string"
            }
        ]
    }
}
```

## Purpose and Usage
- Each question is stored as a separate JSON file in S3
- Files are retrieved when users select a question
- Structure supports LLM-based validation of user solutions
- Includes comprehensive metadata for problem presentation and solution validation
- All boilerplate solutions must follow Python class structure with type hints

## Key Components
1. **Basic Metadata**: Question ID, difficulty, categories, and resource limits
2. **Problem Definition**: Title, description, and constraints
3. **Test Cases**: Various scenarios including edge cases
4. **Solution Requirements**: Complexity requirements and accepted approaches
5. **Validation Support**: 
   - Evaluation criteria
   - Common mistakes
   - Solution breakdowns
   - Anti-patterns
   - Example solutions
6. **Solution Structure Requirements**:
   - Must be wrapped in a Solution class
   - All methods must include self parameter
   - All parameters and return values must have type hints
   - Follow Python naming conventions (snake_case)

## LLM Validation Considerations
- Structured format enables consistent evaluation
- Multiple valid solutions support different approaches
- Detailed feedback components guide LLM responses
- Scoring rubric ensures systematic evaluation

# UserQuestions JSON File

## Base Structure
```json
{
    "user_id": "string (UUID)",
    "question_id": "string",
    "submission": {
        "solution": "string (must contain a Solution class with typed methods)",
        "timestamp": "string (ISO 8601)",
        "evaluation": {
            "score": "integer (0-100)",
            "approach_identified": "string",
            "complexity_analysis": {
                "time": "string (Big O notation)",
                "space": "string (Big O notation)"
            },
            "feedback": {
                "strengths": ["array of strings"],
                "improvements": ["array of strings"]
            },
            "requirements_met": ["array of strings"],
            "requirements_missing": ["array of strings"]
        }
    },
    "hint_chat": {
        "messages": [
            {
                "from": "string (user|hint_bot)",
                "message": "string",
                "timestamp": "string (ISO 8601)"
            }
        ]
    }
}
```

## Example File
```json
{
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "question_id": "3",
    "submission": {
        "solution": "class Solution:\n    def length_of_longest_substring(self, s: str) -> int:\n        seen = set()\n        max_length = 0\n        left = 0\n        \n        for right in range(len(s)):\n            while s[right] in seen:\n                seen.remove(s[left])\n                left += 1\n            seen.add(s[right])\n            max_length = max(max_length, right - left + 1)\n        return max_length",
        "timestamp": "2024-03-21T15:30:45Z",
        "evaluation": {
            "score": 85,
            "approach_identified": "sliding window with hash set",
            "complexity_analysis": {
                "time": "O(n)",
                "space": "O(min(m,n))"
            },
            "feedback": {
                "strengths": [
                    "Correct implementation of sliding window technique",
                    "Proper handling of duplicate characters",
                    "Efficient space usage with Set data structure"
                ],
                "improvements": [
                    "Consider adding input validation for empty strings",
                    "Could optimize by using a Map to track character positions"
                ]
            },
            "requirements_met": [
                "Maintains proper window boundaries",
                "Tracks character frequencies accurately",
                "Handles strings with all unique characters"
            ],
            "requirements_missing": [
                "Does not explicitly handle empty strings"
            ]
        }
    },
    "hint_chat": {
        "messages": [
            {
                "from": "user",
                "message": "I'm not sure how to handle duplicate characters efficiently. Any hints?",
                "timestamp": "2024-03-21T15:25:30Z"
            },
            {
                "from": "hint_bot",
                "message": "Think about using a sliding window approach. When you encounter a duplicate character, what needs to happen to the window? Consider using a set to track characters in your current window.",
                "timestamp": "2024-03-21T15:25:35Z"
            },
            {
                "from": "user",
                "message": "That helps! So I should slide the window when I find a duplicate?",
                "timestamp": "2024-03-21T15:26:10Z"
            },
            {
                "from": "hint_bot",
                "message": "Exactly! You'll need to slide the left side of the window until you remove the duplicate character. This maintains the property that all characters in the window are unique.",
                "timestamp": "2024-03-21T15:26:15Z"
            }
        ]
    }
}
```

## Purpose and Usage
- Stores complete history of user interactions with a specific question
- Tracks submitted solutions and their evaluations
- Maintains chat history with the hints bot
- Links user activity to main question definitions

## Key Components
1. **User and Question Identification**:
   - Unique identifiers for both user and question
   - Enables efficient querying and relationship tracking

2. **Solution Submission**:
   - Complete solution code
   - Timestamp for tracking attempts
   - Detailed evaluation results including:
     - Numerical score
     - Identified approach
     - Complexity analysis
     - Specific feedback points

3. **Hint System Integration**:
   - Chronological chat history
   - Both user queries and bot responses
   - Timestamps for message sequencing

## Usage Guidelines
1. **Solution Storage**:
   - Always include complete Solution class
   - Maintain type hints and method signatures
   - Store original submission exactly as provided

2. **Evaluation Records**:
   - Score must be between 0-100
   - Include specific, actionable feedback
   - Document both strengths and areas for improvement

3. **Hint Chat Format**:
   - Messages must identify sender
   - Preserve chronological order
   - Include timestamps for all messages

## Considerations for Future Implementation
1. User progress tracking
2. Solution history
3. Performance metrics
4. Personalized difficulty adjustments

# Prompt Engineering for Solution Validation

## Base Prompt Template
```python
def create_validation_prompt(problem_json, user_solution):
    return f"""You are a strict programming instructor evaluating a student's pseudocode solution.

Problem: {problem_json['title']}
Required Complexity: Time {problem_json['complexity_requirements']['time']}, Space {problem_json['complexity_requirements']['space']}
Valid Approaches: {[sol['approach'] for sol in problem_json['valid_solutions']]}

Student's Solution:
{user_solution}

Evaluate the solution on:
1. Correctness (handles all test cases)
2. Complexity requirements
3. Proper use of required concepts {problem_json['pseudocode_requirements']['required_concepts']}
4. Code clarity and style

Provide a score (0-100) and detailed feedback."""
```

## Prompt Components Explanation
1. **Role Definition**: Sets the LLM as a strict programming instructor to ensure rigorous evaluation
2. **Context Setting**: Provides essential problem information
   - Problem title
   - Complexity requirements
   - Valid solution approaches
3. **Evaluation Criteria**: Clear scoring rubric covering
   - Solution correctness
   - Time/space complexity
   - Required concepts implementation
   - Code quality
4. **Output Format**: Requests both numerical score and detailed feedback

## Usage Guidelines
1. **Input Validation**:
   - Ensure problem_json contains all required fields
   - Sanitize user_solution before insertion
2. **JSON Integration**:
   - Uses fields from the question JSON structure
   - Leverages evaluation_criteria and solution_breakdown sections
3. **Best Practices**:
   - Keep prompt consistent across evaluations
   - Include all relevant constraints from JSON
   - Reference specific test cases when needed

## Example Usage
```python
# Example implementation
def validate_solution(question_json, user_solution):
    prompt = create_validation_prompt(question_json, user_solution)
    # Send to LLM for evaluation
    evaluation = llm.evaluate(prompt)
    return evaluation
```