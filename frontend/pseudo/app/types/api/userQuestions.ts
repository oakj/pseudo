export interface HintMessage {
  from: 'user' | 'hint_bot';
  message: string;
  timestamp: string;
}

export interface UserQuestion {
  user_question_id: string;
  question_id: string;
  user_id: string;
  solved: boolean;
}

export interface Solution {
  lines: Array<{
    number: number;
    text: string;
  }>;
}

export interface Evaluation {
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
}

export interface UserQuestionData {
  user_id: string;
  question_id: string;
  submission?: {
    solution: Solution;
    timestamp: string;
    evaluation?: Evaluation;
  };
  hint_chat: {
    messages: Array<HintMessage>;
  };
} 