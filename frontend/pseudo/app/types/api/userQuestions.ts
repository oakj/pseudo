export interface HintMessage {
  from: 'user' | 'hint_bot';
  message: string;
  timestamp: string;
}

export interface UserQuestion {
  id: string;
  user_id: string;
  question_id: string;
  solved: boolean;
  blob_url: string | null;
  user_question_id: string;
}

export interface UserQuestionFile {
  user_id: string;
  question_id: string;
  submission?: {
    solution: string;
    timestamp: string;
  };
  hint_chat: {
    messages: Array<HintMessage>;
  };
}

export interface UserQuestionData {
  user_id: string;
  question_id: string;
  submission?: {
    solution: string;
    timestamp: string;
    evaluation?: any;
  };
  hint_chat: {
    messages: Array<HintMessage>;
  };
} 