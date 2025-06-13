import OpenAI from 'openai';
import type { Solution } from '~/app/types/api/userQuestions';

// Rate limiting configuration for Tier 2
const RATE_LIMIT = {
  maxRequests: 10, // Increased from 3 to 10 for Tier 2
  timeWindow: 60000, // 1 minute in milliseconds
  requests: [] as number[],
  maxConcurrent: 3, // Allow up to 3 concurrent requests
  quotaLimit: 100000 // Tokens per minute for Tier 2
};

// Initialize OpenAI client with retry configuration
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for development, should be moved to backend in production
  maxRetries: 3,
  timeout: 30000 // 30 seconds timeout
});

// Rate limiting helper function
function checkRateLimit(): boolean {
  const now = Date.now();
  // Remove requests older than the time window
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(time => now - time < RATE_LIMIT.timeWindow);
  
  // Check both rate limit and concurrent requests
  const recentRequests = RATE_LIMIT.requests.filter(time => now - time < 1000); // Last second
  if (recentRequests.length >= RATE_LIMIT.maxConcurrent) {
    return false;
  }
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  RATE_LIMIT.requests.push(now);
  return true;
}

// Error handling helper
class LLMError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

interface EvaluationResponse {
  score: number;
  feedback: {
    correctness: {
      score: number;
      comments: string;
    };
    complexity: {
      score: number;
      comments: string;
    };
    implementation: {
      score: number;
      comments: string;
    };
  };
  suggestions: string[];
}

interface HintResponse {
  message: string;
  timestamp: string;
}

/**
 * Evaluates a user's solution using OpenAI's API
 */
export async function evaluateSolution(
  questionTitle: string,
  validApproaches: string[],
  userSolution: Solution
): Promise<EvaluationResponse> {
  console.log('Starting solution evaluation...');
  console.log('Question:', questionTitle);
  console.log('Valid approaches:', validApproaches);
  console.log('User solution:', JSON.stringify(userSolution, null, 2));

  if (!checkRateLimit()) {
    throw new LLMError(
      'Rate limit exceeded. Please try again in a minute.',
      'RATE_LIMIT_EXCEEDED'
    );
  }

  try {
    console.log('Creating OpenAI API request...');
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a strict programming instructor evaluating a student's pseudocode solution."
        },
        {
          role: "user",
          content: `Problem: ${questionTitle}
Valid Approaches: ${validApproaches.join(', ')}

Student's Solution:
${userSolution.lines.map(line => line.text).join('\n')}

Evaluate the solution and provide a response in the following JSON format:
{
    "score": <0-100>,
    "feedback": {
        "correctness": {
            "score": <0-40>,
            "comments": "<string>"
        },
        "complexity": {
            "score": <0-30>,
            "comments": "<string>"
        },
        "implementation": {
            "score": <0-30>,
            "comments": "<string>"
        }
    },
    "suggestions": ["<string>"]
}`
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    console.log('Received response from OpenAI:', response.choices[0].message);
    
    if (!response.choices[0].message.content) {
      throw new LLMError('No content in OpenAI response', 'EMPTY_RESPONSE');
    }

    const evaluation = JSON.parse(response.choices[0].message.content);
    console.log('Parsed evaluation:', evaluation);
    return evaluation;
  } catch (error) {
    console.error('Error evaluating solution:', error);
    
    if (error instanceof LLMError) {
      throw error;
    }
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        if (error.message?.includes('quota')) {
          throw new LLMError(
            'OpenAI API quota exceeded. Please check your billing details.',
            'QUOTA_EXCEEDED',
            error
          );
        }
        throw new LLMError(
          'OpenAI API rate limit exceeded. Please try again later.',
          'API_RATE_LIMIT',
          error
        );
      }
      throw new LLMError(
        'OpenAI API error occurred',
        'API_ERROR',
        error
      );
    }
    
    throw new LLMError(
      'Failed to evaluate solution',
      'EVALUATION_ERROR',
      error
    );
  }
}

/**
 * Generates a hint for the user based on their current solution
 */
export async function generateHint(
  questionTitle: string,
  questionDescription: string,
  userSolution: Solution,
  previousHints: Array<{ from: 'user' | 'hint_bot'; message: string; timestamp: string }>
): Promise<HintResponse> {
  if (!checkRateLimit()) {
    throw new LLMError(
      'Rate limit exceeded. Please try again in a minute.',
      'RATE_LIMIT_EXCEEDED'
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a helpful programming mentor providing hints to students. Your hints should be specific, actionable, and not give away the complete solution. Focus on guiding the student to discover the solution themselves."
        },
        {
          role: "user",
          content: `Problem: ${questionTitle}
Description: ${questionDescription}

Student's current solution:
${userSolution.lines.map(line => line.text).join('\n')}

Previous conversation:
${previousHints.map(hint => `${hint.from}: ${hint.message}`).join('\n')}

Provide a helpful hint that guides the student without giving away the complete solution.`
        }
      ],
      temperature: 0.7
    });

    if (!response.choices[0].message.content) {
      throw new LLMError('No content in OpenAI response', 'EMPTY_RESPONSE');
    }

    return {
      message: response.choices[0].message.content,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating hint:', error);
    
    if (error instanceof LLMError) {
      throw error;
    }
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        if (error.message?.includes('quota')) {
          throw new LLMError(
            'OpenAI API quota exceeded. Please check your billing details.',
            'QUOTA_EXCEEDED',
            error
          );
        }
        throw new LLMError(
          'OpenAI API rate limit exceeded. Please try again later.',
          'API_RATE_LIMIT',
          error
        );
      }
      throw new LLMError(
        'OpenAI API error occurred',
        'API_ERROR',
        error
      );
    }
    
    throw new LLMError(
      'Failed to generate hint',
      'HINT_ERROR',
      error
    );
  }
}

/**
 * Validates if a solution meets the basic requirements
 */
export function validateSolution(solution: Solution): boolean {
  if (!solution.lines || solution.lines.length === 0) {
    return false;
  }

  // Check if there's any actual code content
  const hasContent = solution.lines.some(line => line.text.trim().length > 0);
  if (!hasContent) {
    return false;
  }

  return true;
}
