# Purpose
This file is intended to be a document detailing the pseudocodesubmission evaluation flow. It should be both a user guide and a technical document with flowcharts and code examples.


# Background
This application is intended to be a platform for users to practice their algorithms and coding interview skills. The user will be able to select a question. The user will submit a pseudocode solution to the question. The purpose of using pseudocode is to allow the user to focus on the logic of the solution rather than the syntax of the language. Since we are building a mobile application, writing pseudocode is more efficient than writing actual code.

Here is an example flow of the application:
1. User opens the mobile application and is directed to the home screen.
2. User selects a question from the home screen.
3. User is presented with the question description, question difficulty, question constraints, and question test cases. This data is stored in a "question" json file in the S3 bucket. In this example it is a file called L-3.json.
4. User submits a pseudocode solution to the question.
5. This is where the pseudocode submission evaluation flow begins. The user's solution is sent to the FastAPI backend.
6. The FastAPI backend retrieves the question file from the S3 bucket. (In this example it is a file called L-3.json)
7. The FastAPI backend sends the question file and the user's solution to the LLM for evaluation.
8. The LLM evaluates the user's solution and returns a response to the FastAPI backend.
9. The FastAPI backend sends the response to the user.

# Guidelines

## 1. Submission Structure
The user's submission should be structured as follows:
```json
{
    "questionId": "string",
    "solution": "string (must contain a Solution class with typed methods)"
}
```

Example valid submission:
```python
class Solution:
    def solve_problem(self, nums: List[int], target: int) -> int:
        # Solution implementation
        pass
```

## 2. Evaluation Pipeline
The evaluation process follows these steps:

1. **Question Data Retrieval**
   - Load question JSON from S3 using the questionId
   - Validate that the question file exists and contains all required fields
   - Parse the question's evaluation criteria and test cases

2. **Initial Validation**
   - Check if the solution is empty or exceeds length limits
   - Verify that the solution attempts to solve the correct problem
   - Ensure basic formatting requirements are met
   - Verify solution contains a properly structured Solution class
   - Check for presence of required type hints
   - Validate method names match the expected pattern

3. **LLM Evaluation**
   - Submit solution to LLM with structured prompt
   - LLM evaluates based on:
     - Correctness (40% weight)
     - Complexity (30% weight)
     - Implementation (30% weight)
   - Generate detailed feedback for user

4. **Response Generation**
   - Format evaluation results as JSON response
   - Include score, feedback, and improvement suggestions
   - Flag for human review if confidence is low

## 3. Scoring Criteria

### Correctness (40 points)
- Handles all test cases correctly
- Maintains proper data structure state
- Follows problem constraints
- Handles edge cases appropriately

### Complexity (30 points)
- Meets time complexity requirements
- Meets space complexity requirements
- Avoids unnecessary operations
- Uses efficient data structures

### Implementation (30 points)
- Uses required concepts correctly
- Follows logical code organization
- Uses clear variable naming
- Implements proper error handling

## 4. System Flow with Code Examples

### 4.1 Mobile App to Backend
```typescript
// Mobile app submission
const submission = {
    questionId: "3",
    solution: `
        class Solution:
            def length_of_longest_substring(self, s: str) -> int:
                seen = set()
                max_length = 0
                left = 0
                
                for right in range(len(s)):
                    while s[right] in seen:
                        seen.remove(s[left])
                        left += 1
                    seen.add(s[right])
                    max_length = max(max_length, right - left + 1)
                return max_length
    `
}

// API call
const response = await fetch('/api/submissions/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission)
})
```

### 4.2 Backend API Endpoint
```python
@router.post("/submissions/evaluate")
async def evaluate_submission(
    submission: SubmissionModel,
    s3_client: S3Client = Depends(get_s3_client),
    llm_client: LLMClient = Depends(get_llm_client)
):
    # 1. Fetch question data
    question_json = await s3_client.get_object(
        Bucket="questions",
        Key=f"L-{submission.questionId}.json"
    )
    
    # 2. Initialize evaluation pipeline
    evaluator = EvaluationPipeline(llm_client)
    
    # 3. Process submission
    result = await evaluator.evaluate_submission(
        question_json,
        submission.solution
    )
    
    return result
```

### 4.3 Backend to LLM
```python
class EvaluationPipeline:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client

    def _create_evaluation_prompt(self, question_json: Dict, solution: str) -> str:
        return f"""You are evaluating a pseudocode solution. Focus on:
        1. Algorithmic correctness
        2. Time complexity: {question_json['complexity_requirements']['time']}
        3. Space complexity: {question_json['complexity_requirements']['space']}
        4. Clear logic and approach

        Question: {question_json['title']}
        Requirements: {question_json['requirements']}
        Test Cases: {json.dumps(question_json['test_cases'], indent=2)}
        
        Solution:
        {solution}

        Evaluate the solution and provide:
        1. Overall assessment
        2. Specific feedback on approach
        3. Any improvement suggestions

        Provide evaluation in the following JSON format:
        {{
            "score": <0-100>,
            "approach_identified": "<string>",
            "complexity_analysis": {{
                "time": "<Big O notation>",
                "space": "<Big O notation>"
            }},
            "feedback": {{
                "strengths": ["<string>"],
                "improvements": ["<string>"]
            }},
            "requirements_met": ["<string>"],
            "requirements_missing": ["<string>"]
        }}"""

    async def evaluate_submission(
        self, 
        question_json: Dict, 
        solution: str
    ) -> Dict:
        # 1. Basic validation
        if not self._validate_basic_requirements(solution):
            return {
                "success": False,
                "error": "INVALID_SUBMISSION",
                "message": "Solution does not meet basic requirements"
            }

        # 2. Create evaluation prompt
        prompt = self._create_evaluation_prompt(question_json, solution)

        # 3. Get LLM evaluation
        try:
            response = await self.llm_client.complete(prompt)
            evaluation = json.loads(response)
            
            # 4. Format and return response
            return {
                "success": True,
                "score": evaluation["score"],
                "passed": evaluation["score"] >= 70,
                "feedback": {
                    "summary": self._generate_summary(evaluation),
                    "approach": {
                        "name": evaluation["approach_identified"],
                        "complexity": evaluation["complexity_analysis"]
                    },
                    "strengths": evaluation["feedback"]["strengths"],
                    "improvements": evaluation["feedback"]["improvements"]
                }
            }
        except Exception as e:
            return {
                "success": False,
                "error": "EVALUATION_ERROR",
                "message": "Failed to evaluate submission"
            }

    def _validate_basic_requirements(self, solution: str) -> bool:
        """
        Perform basic validation checks on the submission:
        - Not empty
        - Meets minimum length
        - Contains basic algorithmic constructs
        """
        if not solution or len(solution.strip()) < 10:
            return False
        return True

    def _generate_summary(self, evaluation: Dict) -> str:
        """Generate a concise summary from the evaluation results"""
        if evaluation["score"] >= 90:
            return "Excellent solution that meets all requirements!"
        elif evaluation["score"] >= 70:
            return "Good solution with some room for improvement."
        else:
            return "Solution needs significant improvements."
```

### 4.4 LLM Response Format
```json
{
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
```

### 4.5 Backend Response to Mobile App
```json
{
    "success": true,
    "score": 85,
    "passed": true,
    "feedback": {
        "summary": "Good solution using sliding window approach. Meets complexity requirements but could be improved with better edge case handling.",
        "approach": {
            "name": "sliding window with hash set",
            "isOptimal": true
        },
        "complexity": {
            "time": "O(n)",
            "space": "O(min(m,n))",
            "meetsRequirements": true
        },
        "improvements": [
            "Add input validation for empty strings",
            "Consider using Map instead of Set for better efficiency"
        ],
        "strengths": [
            "Correct sliding window implementation",
            "Proper handling of duplicates",
            "Efficient space usage"
        ]
    },
    "testResults": {
        "passed": 7,
        "failed": 1,
        "failedCases": [
            {
                "input": "",
                "expected": 0,
                "received": "TypeError"
            }
        ]
    }
}
```

## 5. Error Response Examples

### 5.1 Question Not Found
```json
{
    "success": false,
    "error": "QUESTION_NOT_FOUND",
    "message": "Question ID 3 could not be found",
    "details": {
        "questionId": "3",
        "timestamp": "2024-03-21T10:15:30Z"
    }
}
```

### 5.2 Invalid Solution Format
```json
{
    "success": false,
    "error": "INVALID_SOLUTION",
    "message": "The solution format is invalid"
}
```

### 5.3 System Errors
```json
{
    "success": false,
    "error": "SYSTEM_ERROR",
    "message": "An internal error occurred while processing the submission",
    "details": {
        "retryable": true,
        "errorCode": "RATE_LIMIT_EXCEEDED"
    }
}
```

## 6. Best Practices

1. **Solution Validation**
   - Always validate input before processing
   - Check for required fields and proper formatting
   - Sanitize user input to prevent injection attacks

2. **Performance**
   - Cache frequently accessed question data
   - Use parallel processing for test cases
   - Implement timeouts for LLM evaluation

3. **Feedback Quality**
   - Provide specific, actionable feedback
   - Include both positive aspects and areas for improvement
   - Reference specific parts of the solution in feedback

4. **Error Handling**
   - Log all errors with appropriate context
   - Return user-friendly error messages
   - Maintain audit trail of evaluations

## 7. Implementation Notes

1. **LLM Configuration**
   - Use strict evaluation mode
   - Set appropriate temperature for consistent results
   - Implement retry logic for failed requests

2. **Testing**
   - Maintain suite of test solutions
   - Regular validation of evaluation accuracy
   - Monitor for bias in evaluations

3. **Monitoring**
   - Track evaluation times
   - Monitor LLM usage and costs
   - Record evaluation accuracy metrics

## 8. User Guidelines

### Writing Effective Solutions
1. **Before You Start**
   - Read the entire question description carefully
   - Review the constraints and requirements
   - Look at all test cases to understand edge cases
   - Note the required Solution class structure and type hints

2. **Solution Structure**
   - Must be wrapped in a Solution class
   - Include self parameter in all methods
   - Use proper type hints for parameters and return values
   - Use clear variable names
   - Include brief comments for complex logic
   - Handle edge cases explicitly

3. **Type Hint Requirements**
   - Use standard Python type hints (List[int], Dict[str, int], etc.)
   - Include return type annotations
   - Common types:
     - List[int], List[str], List[List[int]]
     - Dict[str, Any]
     - Optional[int]
     - TreeNode, ListNode (for specific data structures)
     - bool, int, str, float

### Understanding Feedback
1. **Score Breakdown**
   - Correctness (40%): How well your solution handles all cases
   - Complexity (30%): Meeting time and space requirements
   - Implementation (30%): Code quality and organization

2. **Improvement Process**
   - Review failed test cases first
   - Address specific feedback points
   - Consider suggested optimizations
   - Resubmit with improvements

## 9. Troubleshooting

### Common Issues
1. **Submission Failures**
   - Check solution format
   - Verify question ID exists
   - Ensure solution is within length limits

2. **Poor Scores**
   - Review failed test cases
   - Check complexity requirements
   - Implement missing edge cases
   - Follow code organization guidelines

3. **System Issues**
   - Retry on temporary errors
   - Check system status
   - Contact support for persistent issues
